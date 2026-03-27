import path from 'node:path';
import { app } from 'electron';
import Database from 'better-sqlite3';
import { DDL } from './schema';

export type AppDatabase = Database.Database;

export const resolveDatabasePath = (): string => {
  const userDataDir = app.getPath('userData');
  return path.join(userDataDir, 'promech_db.sqlite');
};

export const initDatabase = (): AppDatabase => {
  const dbPath = resolveDatabasePath();
  const db = new Database(dbPath);

  db.pragma('journal_mode = WAL');
  db.exec(DDL);

  const taxSeedCount = db
    .prepare('SELECT COUNT(*) AS count FROM TaxConfiguration')
    .get() as { count: number };

  if (taxSeedCount.count === 0) {
    db.prepare(
      `INSERT INTO TaxConfiguration (effective_from, tax_rate_percent, rounding_rule, invoice_mode)
       VALUES (@effective_from, @tax_rate_percent, @rounding_rule, @invoice_mode)`
    ).run({
      effective_from: '2023-10-01',
      tax_rate_percent: 10,
      rounding_rule: 'ROUND',
      invoice_mode: 1
    });
  }

  return db;
};
