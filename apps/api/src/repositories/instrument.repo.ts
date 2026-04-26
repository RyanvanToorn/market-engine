import { pool } from '../db';
import { Instrument, InstrumentKey, InstrumentType } from '../types';

const INSTRUMENT_COLS = `
  i.id, i.symbol, i.name, i.type_id, i.exchange, i.currency,
  i.created_on, i.created_by, i.modified_on, i.modified_by, i.is_active,
  it.id          AS it_id,
  it.description AS it_description,
  it.created_on  AS it_created_on,
  it.created_by  AS it_created_by,
  it.modified_on AS it_modified_on,
  it.modified_by AS it_modified_by,
  it.is_active   AS it_is_active
`;

const FROM_JOIN = `
  FROM instruments i
  LEFT JOIN instrument_types it ON i.type_id = it.id
`;

function mapRow(row: Record<string, unknown>): Instrument {
  const instrumentType: InstrumentType | null = row.it_id
    ? {
        id: row.it_id as number,
        description: row.it_description as string,
        createdOn: row.it_created_on as Date,
        createdBy: row.it_created_by as string,
        modifiedOn: (row.it_modified_on as Date | null) ?? null,
        modifiedBy: (row.it_modified_by as string | null) ?? null,
        isActive: row.it_is_active as boolean,
      }
    : null;

  return {
    id: row.id as number,
    symbol: row.symbol as string,
    name: row.name as string,
    typeId: row.type_id as number,
    exchange: row.exchange as string,
    currency: row.currency as string,
    createdOn: row.created_on as Date,
    createdBy: row.created_by as string,
    modifiedOn: (row.modified_on as Date | null) ?? null,
    modifiedBy: (row.modified_by as string | null) ?? null,
    isActive: row.is_active as boolean,
    instrumentType,
  };
}

export async function getAll(): Promise<Instrument[]> {
  const { rows } = await pool.query(
    `SELECT ${INSTRUMENT_COLS} ${FROM_JOIN} ORDER BY i.id`,
  );
  return rows.map(mapRow);
}

export async function getById(id: number): Promise<Instrument | null> {
  const { rows } = await pool.query(
    `SELECT ${INSTRUMENT_COLS} ${FROM_JOIN} WHERE i.id = $1`,
    [id],
  );
  return rows.length ? mapRow(rows[0]) : null;
}

export async function getKeys(): Promise<InstrumentKey[]> {
  const { rows } = await pool.query(
    `SELECT id, symbol, exchange FROM instruments ORDER BY id`,
  );
  return rows.map((r) => ({
    id: r.id as number,
    symbol: r.symbol as string,
    exchange: r.exchange as string,
  }));
}

export async function add(params: {
  symbol: string;
  name: string;
  typeId: number;
  exchange: string;
  currency: string;
}): Promise<Instrument> {
  const { rows } = await pool.query(
    `INSERT INTO instruments (symbol, name, type_id, exchange, currency, created_on, created_by, is_active)
     VALUES ($1, $2, $3, $4, $5, NOW(), 'system', true)
     RETURNING id`,
    [params.symbol, params.name, params.typeId, params.exchange, params.currency],
  );
  return (await getById(rows[0].id as number))!;
}

export async function addRange(
  items: Array<{ symbol: string; name: string; typeId: number; exchange: string; currency: string }>,
): Promise<number> {
  if (items.length === 0) return 0;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of items) {
      await client.query(
        `INSERT INTO instruments (symbol, name, type_id, exchange, currency, created_on, created_by, is_active)
         VALUES ($1, $2, $3, $4, $5, NOW(), 'system', true)`,
        [p.symbol, p.name, p.typeId, p.exchange, p.currency],
      );
    }
    await client.query('COMMIT');
    return items.length;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function update(
  id: number,
  params: { symbol: string; name: string; typeId: number; exchange: string },
): Promise<Instrument | null> {
  const { rowCount } = await pool.query(
    `UPDATE instruments
     SET symbol = $1, name = $2, type_id = $3, exchange = $4,
         modified_on = NOW(), modified_by = 'system'
     WHERE id = $5`,
    [params.symbol, params.name, params.typeId, params.exchange, id],
  );
  if (!rowCount) return null;
  return getById(id);
}

export async function updateRange(
  updates: Array<{ id: number; symbol: string; name: string; typeId: number; exchange: string }>,
): Promise<number> {
  if (updates.length === 0) return 0;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const u of updates) {
      await client.query(
        `UPDATE instruments
         SET symbol = $1, name = $2, type_id = $3, exchange = $4,
             modified_on = NOW(), modified_by = 'system'
         WHERE id = $5`,
        [u.symbol, u.name, u.typeId, u.exchange, u.id],
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
  await pool.query(`DELETE FROM instruments WHERE id = $1`, [id]);
}

export async function removeRange(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  await pool.query(`DELETE FROM instruments WHERE id = ANY($1::int[])`, [ids]);
}
