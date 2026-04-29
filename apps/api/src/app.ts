import express, { type NextFunction, type Request, type Response } from "express";
import instrumentTypesRouter from "./routes/instrument-types";
import instrumentsRouter from "./routes/instruments";
import potentialInstrumentsRouter from "./routes/potential-instruments";
import scraperRouter from "./routes/scraper";

const app = express();

app.use(express.json());

app.use("/instrument-types", instrumentTypesRouter);
app.use("/instruments", instrumentsRouter);
app.use("/potential-instruments", potentialInstrumentsRouter);
app.use("/scraper", scraperRouter);

// 404 handler
app.use((_req, res) => {
	res.status(404).json({ error: "Not Found" });
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err);
	res.status(500).json({ error: "Internal Server Error" });
});

export default app;
