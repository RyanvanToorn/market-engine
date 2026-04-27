import { Router } from 'express';
import * as repository from '../repositories/potential-instrument.repo';

const router = Router();

// GET /potential-instruments
router.get('/', async (_req, res, next) => {
  try {
    res.json(await repository.getAll());
  } catch (err) {
    next(err);
  }
});

// POST /potential-instruments
router.post('/', async (req, res, next) => {
  try {
    const { symbol, name, typeId, exchange } = req.body as {
      symbol: string;
      name: string;
      typeId: number;
      exchange: string;
    };
    const entity = await repository.add({ symbol, name, typeId, exchange });
    res.status(201).json(entity);
  } catch (err) {
    next(err);
  }
});

// POST /potential-instruments/batch
router.post('/batch', async (req, res, next) => {
  try {
    const items = req.body as Array<{
      symbol: string;
      name: string;
      typeId: number;
      exchange: string;
    }>;
    const count = await repository.addRange(items);
    res.status(201).json({ count });
  } catch (err) {
    next(err);
  }
});

// PUT /potential-instruments/batch  — must be registered before /:id
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

// PUT /potential-instruments/:id
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

// PATCH /potential-instruments/:id/validate  — must be before /:id to avoid ambiguity
router.patch('/:id/validate', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const entity = await repository.validate(id);
    if (!entity) return res.status(404).end();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// DELETE /potential-instruments/batch  — must be registered before /:id
router.delete('/batch', async (req, res, next) => {
  try {
    const ids = req.body as number[];
    await repository.removeRange(ids);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// DELETE /potential-instruments/:id
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

// GET /potential-instruments/:id
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

export default router;
