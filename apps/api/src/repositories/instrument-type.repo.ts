import { pool } from '../db';
import { InstrumentType } from '../types';

const COLS = `id, description, created_on, created_by, modified_on, modified_by, is_active`;

function mapRow(row: Record<string, unknown>): InstrumentType {
  return {
    id: row.id as number,
    description: row.description as string,
    createdOn: row.created_on as Date,
    createdBy: row.created_by as string,
    modifiedOn: (row.modified_on as Date | null) ?? null,
    modifiedBy: (row.modified_by as string | null) ?? null,
    isActive: row.is_active as boolean,
  };
}

export async function getAll(): Promise<InstrumentType[]> {
  const { rows } = await pool.query(`SELECT ${COLS} FROM instrument_types ORDER BY id`);
  return rows.map(mapRow);
}

export async function getById(id: number): Promise<InstrumentType | null> {
  const { rows } = await pool.query(
    `SELECT ${COLS} FROM instrument_types WHERE id = $1`,
    [id],
  );
  return rows.length ? mapRow(rows[0]) : null;
}

export async function add(description: string): Promise<InstrumentType> {
  const { rows } = await pool.query(
    `INSERT INTO instrument_types (description, created_on, created_by, is_active)
     VALUES ($1, NOW(), 'system', true)
     RETURNING ${COLS}`,
    [description],
  );
  return mapRow(rows[0]);
}

export async function addRange(descriptions: string[]): Promise<number> {
  if (descriptions.length === 0) return 0;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const description of descriptions) {
      await client.query(
        `INSERT INTO instrument_types (description, created_on, created_by, is_active)
         VALUES ($1, NOW(), 'system', true)`,
        [description],
      );
    }
    await client.query('COMMIT');
    return descriptions.length;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function update(id: number, description: string): Promise<InstrumentType | null> {
  const { rows } = await pool.query(
    `UPDATE instrument_types
     SET description = $1, modified_on = NOW(), modified_by = 'system'
     WHERE id = $2
     RETURNING ${COLS}`,
    [description, id],
  );
  return rows.length ? mapRow(rows[0]) : null;
}

export async function updateRange(
  updates: Array<{ id: number; description: string }>,
): Promise<number> {
  if (updates.length === 0) return 0;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const u of updates) {
      await client.query(
        `UPDATE instrument_types
         SET description = $1, modified_on = NOW(), modified_by = 'system'
         WHERE id = $2`,
        [u.description, u.id],
      );
    }
    await client.query('COMMIT');
    return updates.length;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function remove(id: number): Promise<void> {
  await pool.query(`DELETE FROM instrument_types WHERE id = $1`, [id]);
}

export async function removeRange(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  await pool.query(`DELETE FROM instrument_types WHERE id = ANY($1::int[])`, [ids]);
}
