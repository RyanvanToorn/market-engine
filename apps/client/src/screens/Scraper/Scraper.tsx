import { Box } from "@components/Box/Box";
import { Paper } from "@components/Paper/Paper";
import { Typography } from "@components/Typography/Typography";
import styles from "./Scraper.module.css";
import { IconButton } from "@components/IconButton/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StopIcon from "@mui/icons-material/Stop";
import { TextField } from "@components/TextField/TextField";
import { Checkbox } from "@components/Checkbox/Checkbox";
import { useBasicLayout } from "@layouts/BasicLayout";
import { useState, useEffect, useRef } from "react";

type ScraperStatus = "idle" | "running" | "stopping";

interface ScraperConfig {
	workers: number;
	headless: boolean;
}

interface ScraperControlsProps {
	status: ScraperStatus;
	onStart: () => void;
	onStop: () => void;
	onRestart: () => void;
}

interface ScraperSettingsProps {
	workers: number;
	headless: boolean;
	onWorkersChange: (workers: number) => void;
	onHeadlessChange: (headless: boolean) => void;
}

function ScraperControls({
	status,
	onStart,
	onStop,
	onRestart,
}: ScraperControlsProps): React.ReactElement {
	const isIdle = status === "idle";
	const isBusy = status !== "idle";

	return (
		<Box extendedClass={styles.ScraperControls}>
			<IconButton onClick={onStop} aria-label="Stop scraper" disabled={isIdle}>
				<StopIcon />
			</IconButton>

			<IconButton onClick={onStart} aria-label="Start scraper" disabled={isBusy}>
				<PlayArrowIcon />
			</IconButton>

			<IconButton onClick={onRestart} aria-label="Restart scraper" disabled={isIdle}>
				<RestartAltIcon />
			</IconButton>
		</Box>
	);
}

function ScraperSettings({
	workers,
	headless,
	onWorkersChange,
	onHeadlessChange,
}: ScraperSettingsProps): React.ReactElement {
	return (
		<Box extendedClass={styles.ScraperSettings}>
			<Box extendedClass={styles.ScraperSettingsRow}>
				<TextField
					label="Number of Workers:"
					type="number"
					value={workers}
					onChange={(e) => {
						const val = parseInt(e.target.value, 10);
						if (!Number.isNaN(val) && val >= 1) onWorkersChange(val);
					}}
					slotProps={{ htmlInput: { min: 1 } }}
				/>
			</Box>

			<Box extendedClass={styles.ScraperSettingsRow}>
				<Typography text={"Headless"} />
				<Checkbox checked={headless} onChange={(_e, checked) => onHeadlessChange(checked)} />
			</Box>
		</Box>
	);
}

interface LogEntry {
	id: number;
	text: string;
}

export function Scraper(): React.ReactElement | null {
	const { setLayout } = useBasicLayout();
	const [status, setStatus] = useState<ScraperStatus>("idle");
	const [workers, setWorkers] = useState<number>(3);
	const [headless, setHeadless] = useState<boolean>(true);
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const logIdRef = useRef(0);
	const consoleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setLayout((prev) => ({ ...prev, title: "Scraper" }));
	}, [setLayout]);

	useEffect(() => {
		const eventSource = new EventSource("/api/scraper/logs");

		eventSource.addEventListener("message", (e) => {
			setLogs((prev) => [...prev, { id: logIdRef.current++, text: e.data as string }]);
		});

		eventSource.addEventListener("status", (e) => {
			const payload = JSON.parse(e.data as string) as {
				status: ScraperStatus;
				config: ScraperConfig;
			};
			setStatus(payload.status);
			setWorkers(payload.config.workers);
			setHeadless(payload.config.headless);
		});

		eventSource.onerror = () => {
			console.warn("[Scraper] SSE connection error — will retry automatically");
		};

		return () => {
			eventSource.close();
		};
	}, []);

	// Auto-scroll console to bottom when new log entries arrive
	useEffect(() => {
		if (logs.length > 0 && consoleRef.current) {
			consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
		}
	}, [logs]);

	async function startScraper() {
		try {
			await fetch("/api/scraper/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ workers, headless }),
			});
		} catch (err) {
			console.error("[Scraper] Failed to start:", err);
		}
	}

	async function stopScraper() {
		try {
			await fetch("/api/scraper/stop", { method: "POST" });
		} catch (err) {
			console.error("[Scraper] Failed to stop:", err);
		}
	}

	async function restartScraper() {
		try {
			await fetch("/api/scraper/restart", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ workers, headless }),
			});
		} catch (err) {
			console.error("[Scraper] Failed to restart:", err);
		}
	}

	const fontSx = {
		fontFamily: "'Fjalla One', sans-serif",
	};

	const statusClass = {
		idle: styles.ScraperStatus_idle,
		running: styles.ScraperStatus_running,
		stopping: styles.ScraperStatus_stopping,
	}[status];

	return (
		<Box extendedClass={styles.Scraper}>
			<Paper
				extendedClass={styles.ScraperPaper}
				sx={{
					borderRadius: "0rem",
					backgroundColor: "background.paper",
					height: "100%",
				}}
			>
				<form className={styles.ScraperForm}>
					<Box extendedClass={styles.ScraperHeading}>
						<Box extendedClass={styles.ScraperHeadingLeft}>
							<Typography text={"Scraper"} variant="h4" sx={fontSx} />
							<span className={`${styles.ScraperStatusBadge} ${statusClass}`}>{status}</span>
						</Box>
						<ScraperControls
							status={status}
							onStart={startScraper}
							onStop={stopScraper}
							onRestart={restartScraper}
						/>
					</Box>

					<Box extendedClass={styles.ScraperConsole}>
						<Box extendedClass={styles.ScraperConsoleHeading}>
							<Typography text={"Console"} variant="h6" sx={fontSx} />
						</Box>
						<div ref={consoleRef} className={styles.ScraperConsoleConsole}>
							{logs.map((entry) => (
								<div key={entry.id} className={styles.ScraperConsoleLog}>
									{entry.text}
								</div>
							))}
						</div>
					</Box>

					<ScraperSettings
						workers={workers}
						headless={headless}
						onWorkersChange={setWorkers}
						onHeadlessChange={setHeadless}
					/>
				</form>
			</Paper>
		</Box>
	);
}
