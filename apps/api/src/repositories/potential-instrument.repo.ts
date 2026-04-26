import { pool } from '../db';
import { InstrumentType, PotentialInstrument } from '../types';

const PI_COLS = `
  pi.id, pi.symbol, pi.name, pi.type_id, pi.exchange,
  pi.created_on, pi.created_by, pi.modified_on, pi.modified_by, pi.is_active, pi.validated,
  it.id          AS it_id,
  it.description AS it_description,
  it.created_on  AS it_created_on,
  it.created_by  AS it_created_by,
  it.modified_on AS it_modified_on,
  it.modified_by AS it_modified_by,
  it.is_active   AS it_is_active
`;

const FROM_JOIN = `
  FROM potential_instruments pi
  LEFT JOIN instrument_types it ON pi.type_id = it.id
`;

function mapRow(row: Record<string, unknown>): PotentialInstrument {
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
    createdOn: row.created_on as Date,
    createdBy: row.created_by as string,
    modifiedOn: (row.modified_on as Date | null) ?? null,
    modifiedBy: (row.modified_by as string | null) ?? null,
    isActive: row.is_active as boolean,
    validated: row.validated as boolean,
    instrumentType,
  };
}

export async function getAll(): Promise<PotentialInstrument[]> {
  const { rows } = await pool.query(
    `SELECT ${PI_COLS} ${FROM_JOIN} ORDER BY pi.id`,
  );
  return rows.map(mapRow);
}

export async function getById(id: number): Promise<PotentialInstrument | null> {
  const { rows } = await pool.query(
    `SELECT ${PI_COLS} ${FROM_JOIN} WHERE pi.id = $1`,
    [id],
  );
  return rows.length ? mapRow(rows[0]) : null;
}

export async function add(params: {
  symbol: string;
  name: string;
  typeId: number;
  exchange: string;
}): Promise<PotentialInstrument> {
  const { rows } = await pool.query(
    `INSERT INTO potential_instruments (symbol, name, type_id, exchange, created_on, created_by, is_active, validated)
     VALUES ($1, $2, $3, $4, NOW(), 'system', true, false)
     RETURNING id`,
    [params.symbol, params.name, params.typeId, params.exchange],
  );
  return (await getById(rows[0].id as number))!;
}

export async function addRange(
  items: Array<{ symbol: string; name: string; typeId: number; exchange: string }>,
): Promise<number> {
  if (items.length === 0) return 0;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const p of items) {
      await client.query(
        `INSERT INTO potential_instruments (symbol, name, type_id, exchange, created_on, created_by, is_active, validated)
         VALUES ($1, $2, $3, $4, NOW(), 'system', true, false)`,
        [p.symbol, p.name, p.typeId, p.exchange],
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
): Promise<PotentialInstrument | null> {
  const { rowCount } = await pool.query(
    `UPDATE potential_instruments
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
        `UPDATE potential_instruments
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

export async function validate(id: number): Promise<PotentialInstrument | null> {
  const { rowCount } = await pool.query(
    `UPDATE potential_instruments
     SET validated = true, modified_on = NOW(), modified_by = 'system'
     WHERE id = $1`,
    [id],
  );
  if (!rowCount) return null;
  return getById(id);
}

export async function remove(id: number): Promise<void> {
  await pool.query(`DELETE FROM potential_instruments WHERE id = $1`, [id]);
}

export async function removeRange(ids: number[]): Promise<void> {
  if (ids.length === 0) return;
  await pool.query(`DELETE FROM potential_instruments WHERE id = ANY($1::int[])`, [ids]);
}
