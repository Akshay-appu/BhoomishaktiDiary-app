import * as SQLite from 'expo-sqlite';
import { FinanceEntry, FinanceType } from './schema';
import { uuidv4 } from '../utils/uuid';

export type FinanceInput = {
  type: FinanceType;
  amount: number;
  category: string;
  date: string;
  notes: string;
};

export async function listFinanceEntries(db: SQLite.SQLiteDatabase, ownerId: string | null): Promise<FinanceEntry[]> {
  return db.getAllAsync<FinanceEntry>(
    'SELECT * FROM finance_entries WHERE deletedAt IS NULL AND (userId IS ?) ORDER BY date DESC, id DESC',
    ownerId
  );
}

export async function addFinanceEntry(db: SQLite.SQLiteDatabase, input: FinanceInput, ownerId: string | null): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    'INSERT INTO finance_entries (type, amount, category, date, notes, createdAt, updatedAt, uuid, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    input.type, input.amount, input.category, input.date, input.notes, now, now, uuidv4(), ownerId
  );
}

export async function updateFinanceEntry(db: SQLite.SQLiteDatabase, id: number, input: FinanceInput, ownerId: string | null): Promise<void> {
  await db.runAsync(
    'UPDATE finance_entries SET type = ?, amount = ?, category = ?, date = ?, notes = ?, updatedAt = ? WHERE id = ? AND (userId IS ?)',
    input.type, input.amount, input.category, input.date, input.notes, new Date().toISOString(), id, ownerId
  );
}

export async function deleteFinanceEntry(db: SQLite.SQLiteDatabase, id: number, ownerId: string | null): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    'UPDATE finance_entries SET deletedAt = ?, updatedAt = ? WHERE id = ? AND (userId IS ?)',
    now, now, id, ownerId
  );
}

export async function getFinanceTotals(
  db: SQLite.SQLiteDatabase, ownerId: string | null
): Promise<{ totalExpenses: number; totalIncome: number }> {
  const row = await db.getFirstAsync<{ totalExpenses: number | null; totalIncome: number | null }>(
    `SELECT
       (SELECT COALESCE(SUM(amount), 0) FROM finance_entries WHERE type = 'expense' AND deletedAt IS NULL AND (userId IS ?)) AS totalExpenses,
       (SELECT COALESCE(SUM(amount), 0) FROM finance_entries WHERE type = 'income' AND deletedAt IS NULL AND (userId IS ?)) AS totalIncome`,
    ownerId, ownerId
  );
  return { totalExpenses: row?.totalExpenses ?? 0, totalIncome: row?.totalIncome ?? 0 };
}
