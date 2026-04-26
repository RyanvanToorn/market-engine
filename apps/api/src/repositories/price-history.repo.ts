import { pool } from '../db';
import { InstrumentPriceHistory } from '../types';

// pg returns numeric(18,6) as a string — parse to number.
// pg returns date (OID 1082) as a 'YYYY-MM-DD' string — no conversion needed.
function mapRow(row: Record<string, unknown>): InstrumentPriceHistory {
  return {
    id: row.id as number,
    instrumentId: row.instrument_id as number,
    date: row.date as string,
    granularity: row.granularity as string,
    open: row.open != null ? parseFloat(row.open as string) : null,
    high: row.high != null ? parseFloat(row.high as string) : null,
    low: row.low != null ? parseFloat(row.low as string) : null,
    close: row.close != null ? parseFloat(row.close as string) : null,
    adjClose: row.adj_close != null ? parseFloat(row.adj_close as string) : null,
    // pg returns bigint as a string to avoid precision loss
    volume: row.volume != null ? Number(row.volume) : null,
  };
}

export async function getByInstrument(
  instrumentId: number,
  granularity?: string,
): Promise<InstrumentPriceHistory[]> {
  if (granularity !== undefined) {
    const { rows } = await pool.query(
      `SELECT id, instrument_id, date, granularity, open, high, low, close, adj_close, volume
       FROM instrument_price_history
       WHERE instrument_id = $1 AND granularity = $2
       ORDER BY date ASC`,
      [instrumentId, granularity],
    );
    return rows.map(mapRow);
  }

  const { rows } = await pool.query(
    `SELECT id, instrument_id, date, granularity, open, high, low, close, adj_close, volume
     FROM instrument_price_history
     WHERE instrument_id = $1
     ORDER BY date ASC`,
    [instrumentId],
  );
  return rows.map(mapRow);
}

export interface PriceHistoryRecord {
  instrumentId: number;
  date: string; // 'YYYY-MM-DD'
  granularity: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  adjClose: number | null;
  volume: number | null;
}

/**
 * Inserts records that do not already exist, identified by (instrument_id, date, granularity).
 * Existing records are silently skipped. Returns the count of rows actually inserted.
 */
export async function upsertRange(records: PriceHistoryRecord[]): Promise<number> {
  if (records.length === 0) return 0;

  // Group by (instrumentId, granularity) to minimise round-trips — matching .NET behaviour
  const groups = new Map<string, PriceHistoryRecord[]>();
  for (const r of records) {
    const key = `${r.instrumentId}::${r.granularity}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  const toInsert: PriceHistoryRecord[] = [];

  for (const group of groups.values()) {
    const { instrumentId, granularity } = group[0];
    const { rows } = await pool.query(
      `SELECT date FROM instrument_price_history
       WHERE instrument_id = $1 AND granularity = $2`,
      [instrumentId, granularity],
    );
    // pg returns date columns as 'YYYY-MM-DD' strings
    const existingDates = new Set<string>(rows.map((r: Record<string, unknown>) => r.date as string));
    toInsert.push(...group.filter((r) => !existingDates.has(r.date)));
  }

  if (toInsert.length === 0) return 0;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const r of toInsert) {
      await client.query(
        `INSERT INTO instrument_price_history
           (instrument_id, date, granularity, open, high, low, close, adj_close, volume)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [r.instrumentId, r.date, r.granularity, r.open, r.high, r.low, r.close, r.adjClose, r.volume],
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
