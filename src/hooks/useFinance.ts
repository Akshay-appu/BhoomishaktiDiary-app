import * as SQLite from 'expo-sqlite';
import * as financeRepo from '../db/financeRepo';
import { FinanceEntry } from '../db/schema';
import { useEntityList } from './useEntityList';

export function useFinance(db: SQLite.SQLiteDatabase | null, ready: boolean, ownerId: string | null) {
  return useEntityList<FinanceEntry, financeRepo.FinanceInput>(db, ready, ownerId, {
    list: financeRepo.listFinanceEntries,
    add: financeRepo.addFinanceEntry,
    update: financeRepo.updateFinanceEntry,
    remove: financeRepo.deleteFinanceEntry,
  });
}
