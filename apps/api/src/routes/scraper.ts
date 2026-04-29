import { Router } from "express";
import { scraperManager, type ScraperStatus, type ScraperConfig } from "../scraper-process";

const router = Router();

// POST /scraper/start
router.post("/start", (req, res) => {
	const workers = parseInt(req.body.workers, 10);
	const headless = Boolean(req.body.headless);

	if (!Number.isFinite(workers) || workers < 1) {
		res.status(400).json({ error: "workers must be a positive integer" });
		return;
	}

	try {
		scraperManager.start(workers, headless);
		res.json({ ok: true });
	} catch (err) {
		res.status(409).json({ error: (err as Error).message });
	}
});

// POST /scraper/stop
router.post("/stop", (_req, res) => {
	try {
		scraperManager.stop();
		res.json({ ok: true });
	} catch (err) {
		res.status(409).json({ error: (err as Error).message });
	}
});

// POST /scraper/restart
router.post("/restart", (req, res) => {
	const workers = parseInt(req.body.workers, 10);
	const headless = Boolean(req.body.headless);

	if (!Number.isFinite(workers) || workers < 1) {
		res.status(400).json({ error: "workers must be a positive integer" });
		return;
	}

	scraperManager.restart(workers, headless);
	res.json({ ok: true });
});

// GET /scraper/status
router.get("/status", (_req, res) => {
	res.json({
		status: scraperManager.getStatus(),
		config: scraperManager.getConfig(),
		logCount: scraperManager.getLogs().length,
	});
});

// GET /scraper/logs — Server-Sent Events stream
// Immediately flushes the buffered log history, then streams live lines.
// Also emits "status" named events when the scraper status changes.
router.get("/logs", (req, res) => {
	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	// Disable proxy buffering (nginx / other reverse proxies)
	res.setHeader("X-Accel-Buffering", "no");
	res.flushHeaders();

	const writeStatus = (status: ScraperStatus, config: ScraperConfig) => {
		res.write(`event: status\ndata: ${JSON.stringify({ status, config })}\n\n`);
	};

	// Send current status immediately so the client can hydrate without a separate fetch
	writeStatus(scraperManager.getStatus(), scraperManager.getConfig());

	// Replay buffered logs
	for (const line of scraperManager.getLogs()) {
		res.write(`data: ${line}\n\n`);
	}

	// Subscribe to live log lines
	const onLog = (line: string) => {
		res.write(`data: ${line}\n\n`);
	};

	// Subscribe to status changes
	const onStatus = (status: ScraperStatus, config: ScraperConfig) => {
		writeStatus(status, config);
	};

	scraperManager.subscribe(onLog);
	scraperManager.subscribeStatus(onStatus);

	req.on("close", () => {
		scraperManager.unsubscribe(onLog);
		scraperManager.unsubscribeStatus(onStatus);
	});
});

export default router;
