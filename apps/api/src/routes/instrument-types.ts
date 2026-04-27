import { Router } from 'express';
import * as repository from '../repositories/instrument-type.repo';

const router = Router();

// GET /instrument-types
router.get('/', async (_req, res, next) => {
  try {
    res.json(await repository.getAll());
  } catch (err) {
    next(err);
  }
});

// GET /instrument-types/:id
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

// POST /instrument-types
router.post('/', async (req, res, next) => {
  try {
    const { description } = req.body as { description: string };
    const entity = await repository.add(description);
    res.status(201).json(entity);
  } catch (err) {
    next(err);
  }
});

// POST /instrument-types/batch
router.post('/batch', async (req, res, next) => {
  try {
    const items = req.body as Array<{ description: string }>;
    const count = await repository.addRange(items.map((i) => i.description));
    res.status(201).json({ count });
  } catch (err) {
    next(err);
  }
});

// PUT /instrument-types/batch  — must be registered before /:id
router.put('/batch', async (req, res, next) => {
  try {
    const reqs = req.body as Array<{ id: number; description: string }>;
    const updates: Array<{ id: number; description: string }> = [];

    for (const r of reqs) {
      const entity = await repository.getById(r.id);
      if (!entity) return res.status(404).json({ id: r.id });
      updates.push({ id: r.id, description: r.description });
    }

    const count = await repository.updateRange(updates);
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

// PUT /instrument-types/:id
router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { description } = req.body as { description: string };
    const entity = await repository.update(id, description);
    if (!entity) return res.status(404).end();
    res.json(entity);
  } catch (err) {
    next(err);
  }
});

// DELETE /instrument-types/batch  — must be registered before /:id
router.delete('/batch', async (req, res, next) => {
  try {
    const ids = req.body as number[];
    await repository.removeRange(ids);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// DELETE /instrument-types/:id
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

export default router;
