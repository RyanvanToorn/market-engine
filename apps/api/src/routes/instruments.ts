import { Router } from 'express';
import * as repository from '../repositories/instrument.repo';
import * as priceHistoryRepo from '../repositories/price-history.repo';
import * as dividendRepo from '../repositories/dividend.repo';
import { PriceHistoryRecord } from '../repositories/price-history.repo';
import { DividendRecord } from '../repositories/dividend.repo';

const router = Router();

// ── Instruments ────────────────────────────────────────────────────────────

// GET /instruments
router.get('/', async (_req, res, next) => {
  try {
    res.json(await repository.getAll());
  } catch (err) {
    next(err);
  }
});

// GET /instruments/keys  — must be registered before /:id
router.get('/keys', async (_req, res, next) => {
  try {
    res.json(await repository.getKeys());
  } catch (err) {
    next(err);
  }
});

// POST /instruments
router.post('/', async (req, res, next) => {
  try {
    const { symbol, name, typeId, exchange, currency } = req.body as {
      symbol: string;
      name: string;
      typeId: number;
      exchange: string;
      currency?: string;
    };
    const entity = await repository.add({ symbol, name, typeId, exchange, currency: currency ?? '' });
    res.status(201).json(entity);
  } catch (err) {
    next(err);
  }
});

// POST /instruments/batch
router.post('/batch', async (req, res, next) => {
  try {
    const items = req.body as Array<{
      symbol: string;
      name: string;
      typeId: number;
      exchange: string;
      currency?: string;
    }>;
    const count = await repository.addRange(
      items.map((i) => ({ ...i, currency: i.currency ?? '' })),
    );
    res.status(201).json({ count });
  } catch (err) {
    next(err);
  }
});

// PUT /instruments/batch  — must be registered before /:id
router.put('/batch', async (req, res, next) => {
  try {
    const reqs = req.body as Array<{
      id: number;
      symbol: string;
      name: string;
      typeId: number;
      exchange: string;
    }>;
    const updates: typeof reqs = [];

    for (const r of reqs) {
      const entity = await repository.getById(r.id);
      if (!entity) return res.status(404).json({ id: r.id });
      updates.push(r);
    }

    const count = await repository.updateRange(updates);
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

// PUT /instruments/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { symbol, name, typeId, exchange } = req.body as {
      symbol: string;
      name: string;
      typeId: number;
      exchange: string;
    };
    const entity = await repository.update(id, { symbol, name, typeId, exchange });
    if (!entity) return res.status(404).end();
    res.json(entity);
  } catch (err) {
    next(err);
  }
});

// DELETE /instruments/batch  — must be registered before /:id
router.delete('/batch', async (req, res, next) => {
  try {
    const ids = req.body as number[];
    await repository.removeRange(ids);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// DELETE /instruments/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const entity = await repository.getById(id);
    if (!entity) return res.status(404).end();
    await repository.remove(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// GET /instruments/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const entity = await repository.getById(id);
    if (!entity) return res.status(404).end();
    res.json(entity);
  } catch (err) {
    next(err);
  }
});

// ── Price History ──────────────────────────────────────────────────────────

// GET /instruments/:id/price-history?granularity=
router.get('/:id/price-history', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const instrument = await repository.getById(id);
    if (!instrument) return res.status(404).end();

    const granularity = req.query.granularity as string | undefined;
    const records = await priceHistoryRepo.getByInstrument(id, granularity);
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// POST /instruments/:id/price-history/batch
router.post('/:id/price-history/batch', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const instrument = await repository.getById(id);
    if (!instrument) return res.status(404).end();

    const reqs = req.body as Array<{
      date: string;
      granularity: string;
      open?: number | null;
      high?: number | null;
      low?: number | null;
      close?: number | null;
      adjClose?: number | null;
      volume?: number | null;
    }>;

    if (reqs.length === 0) return res.json({ inserted: 0 });

    // Filter out records with invalid dates or blank granularity — matching .NET behaviour
    const records: PriceHistoryRecord[] = reqs
      .filter((r) => isValidDate(r.date) && r.granularity?.trim())
      .map((r) => ({
        instrumentId: id,
        date: r.date,
        granularity: r.granularity,
        open: r.open ?? null,
        high: r.high ?? null,
        low: r.low ?? null,
        close: r.close ?? null,
        adjClose: r.adjClose ?? null,
        volume: r.volume ?? null,
      }));

    const inserted = await priceHistoryRepo.upsertRange(records);
    res.json({ inserted });
  } catch (err) {
    next(err);
  }
});

// ── Dividends ──────────────────────────────────────────────────────────────

// GET /instruments/:id/dividends
router.get('/:id/dividends', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const instrument = await repository.getById(id);
    if (!instrument) return res.status(404).end();

    const records = await dividendRepo.getByInstrument(id);
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// POST /instruments/:id/dividends/batch
router.post('/:id/dividends/batch', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const instrument = await repository.getById(id);
    if (!instrument) return res.status(404).end();

    const reqs = req.body as Array<{
      exDate: string;
      paymentDate: string;
      amount: number;
    }>;

    if (reqs.length === 0) return res.json({ inserted: 0 });

    // Filter out records with invalid dates — matching .NET behaviour
    const records: DividendRecord[] = reqs
      .filter((r) => isValidDate(r.exDate) && isValidDate(r.paymentDate))
      .map((r) => ({
        instrumentId: id,
        exDate: r.exDate,
        paymentDate: r.paymentDate,
        amount: r.amount,
      }));

    const inserted = await dividendRepo.upsertRange(records);
    res.json({ inserted });
  } catch (err) {
    next(err);
  }
});

/** Returns true if the string can be parsed as a valid date (matches DateOnly.TryParse behaviour). */
function isValidDate(value: string | undefined | null): value is string {
  if (!value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

export default router;
