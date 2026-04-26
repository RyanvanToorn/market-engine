import { pool } from '../db';
import { InstrumentDividend } from '../types';

// pg returns numeric(18,6) as a string — parse to number.
// pg returns date (OID 1082) as a 'YYYY-MM-DD' string — no conversion needed.
function mapRow(row: Record<string, unknown>): InstrumentDividend {
  return {
    id: row.id as number,
    instrumentId: row.instrument_id as number,
    exDate: row.ex_date as string,
    paymentDate: row.payment_date as string,
    amount: parseFloat(row.amount as string),
  };
}

export async function getByInstrument(instrumentId: number): Promise<InstrumentDividend[]> {
  const { rows } = await pool.query(
    `SELECT id, instrument_id, ex_date, payment_date, amount
     FROM instrument_dividends
     WHERE instrument_id = $1
     ORDER BY ex_date ASC`,
    [instrumentId],
  );
  return rows.map(mapRow);
}

export interface DividendRecord {
  instrumentId: number;
  exDate: string; // 'YYYY-MM-DD'
  paymentDate: string; // 'YYYY-MM-DD'
  amount: number;
}

/**
 * Inserts dividends that do not already exist, identified by (instrument_id, ex_date).
 * Existing records are silently skipped. Returns the count of rows actually inserted.
 */
export async function upsertRange(records: DividendRecord[]): Promise<number> {
  if (records.length === 0) return 0;

  const instrumentIds = [...new Set(records.map((r) => r.instrumentId))];

  const { rows } = await pool.query(
    `SELECT instrument_id, ex_date
     FROM instrument_dividends
     WHERE instrument_id = ANY($1::int[])`,
    [instrumentIds],
  );

  // Build a set of "instrumentId|exDate" composite keys for fast lookup
  const existingKeys = new Set<string>(
    rows.map((r: Record<string, unknown>) => `${r.instrument_id}|${r.ex_date}`),
  );

  const toInsert = records.filter(
    (r) => !existingKeys.has(`${r.instrumentId}|${r.exDate}`),
  );

  if (toInsert.length === 0) return 0;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const r of toInsert) {
      await client.query(
        `INSERT INTO instrument_dividends (instrument_id, ex_date, payment_date, amount)
         VALUES ($1, $2, $3, $4)`,
        [r.instrumentId, r.exDate, r.paymentDate, r.amount],
      );
    }
    await client.query('COMMIT');
    return toInsert.length;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
