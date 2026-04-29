import { spawn, type ChildProcess } from "child_process";
import path from "path";

export type ScraperStatus = "idle" | "running" | "stopping";

export interface ScraperConfig {
	workers: number;
	headless: boolean;
}

type LogSubscriber = (line: string) => void;
type StatusSubscriber = (status: ScraperStatus, config: ScraperConfig) => void;

const LOG_BUFFER_LIMIT = 1000;

// __dirname when run with tsx from source = apps/api/src
// Resolve to monorepo root: apps/api/src → apps/api → apps → root
const MONOREPO_ROOT = path.resolve(__dirname, "../../..");
const SCRIPT_PATH = path.join(MONOREPO_ROOT, "apps", "collector", "src", "scripts", "promote.ts");
const COLLECTOR_TSCONFIG = path.join(MONOREPO_ROOT, "apps", "collector", "tsconfig.json");

class ScraperProcessManager {
	private proc: ChildProcess | null = null;
	private _status: ScraperStatus = "idle";
	private _config: ScraperConfig = { workers: 3, headless: true };
	private _logs: string[] = [];
	private logSubs = new Set<LogSubscriber>();
	private statusSubs = new Set<StatusSubscriber>();
	private pendingRestart: ScraperConfig | null = null;

	start(workers: number, headless: boolean): void {
		if (this._status !== "idle") {
			throw new Error("Scraper is already running");
		}

		this._config = { workers, headless };
		const args = ["--tsconfig", COLLECTOR_TSCONFIG, SCRIPT_PATH, String(workers)];
		if (!headless) args.push("--headed");

		const tsxBin = path.join(MONOREPO_ROOT, "node_modules", ".bin", "tsx");
		const proc = spawn(tsxBin, args, {
			shell: false,
			cwd: MONOREPO_ROOT,
			env: {
				...process.env,
				API_BASE_URL: process.env.API_BASE_URL ?? "http://localhost:3000",
			},
		});

		this.proc = proc;
		this.setStatus("running");
		this.addLog(`[manager] Starting scraper — workers=${workers} headless=${headless}`);

		const handleData = (chunk: Buffer) => {
			const lines = chunk.toString().split(/\r?\n/);
			for (const line of lines) {
				const trimmed = line.trimEnd();
				if (trimmed) this.addLog(trimmed);
			}
		};

		proc.stdout?.on("data", handleData);
		proc.stderr?.on("data", handleData);

		proc.on("close", (code) => {
			if (this.proc === proc) this.proc = null;
			this.addLog(`[manager] Process exited with code ${code ?? "null"}`);

			if (this.pendingRestart) {
				const { workers: w, headless: h } = this.pendingRestart;
				this.pendingRestart = null;
				this.setStatus("idle");
				this.start(w, h);
			} else {
				this.setStatus("idle");
			}
		});

		proc.on("error", (err) => {
			if (this.proc === proc) this.proc = null;
			this.addLog(`[manager] Process error: ${err.message}`);
			this.pendingRestart = null;
			this.setStatus("idle");
		});
	}

	stop(): void {
		if (this._status === "idle" || !this.proc) {
			throw new Error("Scraper is not running");
		}
		this.setStatus("stopping");
		this.addLog("[manager] Stop requested");
		this.proc.kill();
	}

	restart(workers: number, headless: boolean): void {
		if (this._status === "idle") {
			this.start(workers, headless);
			return;
		}
		// Store restart config; close handler will pick it up
		this.pendingRestart = { workers, headless };
		if (this._status === "running" && this.proc) {
			this.setStatus("stopping");
			this.addLog("[manager] Restart requested — stopping current process");
			this.proc.kill();
		}
		// If already 'stopping', pendingRestart is set; close handler will restart automatically
	}

	getStatus(): ScraperStatus {
		return this._status;
	}

	getConfig(): ScraperConfig {
		return { ...this._config };
	}

	getLogs(): readonly string[] {
		return this._logs;
	}

	subscribe(cb: LogSubscriber): void {
		this.logSubs.add(cb);
	}

	unsubscribe(cb: LogSubscriber): void {
		this.logSubs.delete(cb);
	}

	subscribeStatus(cb: StatusSubscriber): void {
		this.statusSubs.add(cb);
	}

	unsubscribeStatus(cb: StatusSubscriber): void {
		this.statusSubs.delete(cb);
	}

	private addLog(line: string): void {
		this._logs.push(line);
		if (this._logs.length > LOG_BUFFER_LIMIT) {
			this._logs.shift();
		}
		for (const cb of this.logSubs) {
			cb(line);
		}
	}

	private setStatus(status: ScraperStatus): void {
		this._status = status;
		for (const cb of this.statusSubs) {
			cb(status, this._config);
		}
	}
}

export const scraperManager = new ScraperProcessManager();
