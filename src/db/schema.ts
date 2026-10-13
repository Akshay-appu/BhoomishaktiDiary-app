import * as SQLite from 'expo-sqlite';
import { uuidv4 } from '../utils/uuid';

// Sync bookkeeping columns shared by every syncable table:
//   uuid         - stable cross-device identity; also the Firestore doc id
//   userId       - which signed-in account locally owns this row (null = unclaimed/guest)
//   deletedAt    - soft-delete tombstone so deletes can propagate instead of just disappearing
//   lastSyncedAt - local-only bookkeeping: last time this row's current updatedAt was pushed/pulled
type SyncColumns = {
  uuid: string;
  userId: string | null;
  deletedAt: string | null;
  lastSyncedAt: string | null;
};

export type Entry = {
  id: number;
  title: string;
  category: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  plotId: number | null;
  cropId: number | null;
} & SyncColumns;

export type FarmProfile = {
  id: 1;
  farmName: string;
  farmerName: string;
  village: string;
  district: string;
  state: string;
  totalArea: number | null;
  areaUnit: string;
  updatedAt: string;
  userId: string | null;
  lastSyncedAt: string | null;
};

export type Plot = {
  id: number;
  name: string;
  area: number | null;
  areaUnit: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
} & SyncColumns;

export type Crop = {
  id: number;
  cropName: string;
  season: string;
  plotId: number | null;
  sowingDate: string;
  expectedHarvestDate: string | null;
  createdAt: string;
  updatedAt: string;
} & SyncColumns;

export type FinanceType = 'expense' | 'income';

export type FinanceEntry = {
  id: number;
  type: FinanceType;
  amount: number;
  category: string;
  date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
} & SyncColumns;

export type Harvest = {
  id: number;
  cropId: number | null;
  plotId: number | null;
  harvestDate: string;
  quantity: number;
  quantityUnit: string;
  sellingPrice: number | null;
  buyer: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
} & SyncColumns;

const SCHEMA_VERSION = 3;

// Every syncable table except farm_profile (singleton, no uuid/tombstone needed).
const SYNCABLE_TABLES = ['plots', 'crops', 'diary_entries', 'finance_entries', 'harvests'] as const;

async function columnExists(db: SQLite.SQLiteDatabase, table: string, column: string): Promise<boolean> {
  const rows = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`);
  return rows.some(row => row.name === column);
}

async function addColumnIfMissing(db: SQLite.SQLiteDatabase, table: string, column: string, ddl: string): Promise<void> {
  if (!(await columnExists(db, table, column))) {
    await db.execAsync(`ALTER TABLE ${table} ADD COLUMN ${ddl};`);
  }
}

async function migrateToV2(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS farm_profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      farmName TEXT NOT NULL DEFAULT '',
      farmerName TEXT NOT NULL DEFAULT '',
      village TEXT NOT NULL DEFAULT '',
      district TEXT NOT NULL DEFAULT '',
      state TEXT NOT NULL DEFAULT '',
      totalArea REAL,
      areaUnit TEXT NOT NULL DEFAULT 'acres',
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      area REAL,
      areaUnit TEXT NOT NULL DEFAULT 'acres',
      notes TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS crops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cropName TEXT NOT NULL,
      season TEXT NOT NULL,
      plotId INTEGER,
      sowingDate TEXT NOT NULL,
      expectedHarvestDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS finance_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK (type IN ('expense','income')),
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS harvests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cropId INTEGER,
      plotId INTEGER,
      harvestDate TEXT NOT NULL,
      quantity REAL NOT NULL,
      quantityUnit TEXT NOT NULL DEFAULT 'kg',
      sellingPrice REAL,
      buyer TEXT,
      notes TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL
    );
  `);

  // Nullable, additive columns on the existing table — existing rows get
  // NULL for both, so old activities keep working unlinked.
  await addColumnIfMissing(db, 'diary_entries', 'plotId', 'plotId INTEGER');
  await addColumnIfMissing(db, 'diary_entries', 'cropId', 'cropId INTEGER');
}

async function migrateToV3(db: SQLite.SQLiteDatabase): Promise<void> {
  // updatedAt was missing on these three tables (plots/crops/farm_profile
  // already had it). Backfill existing rows from createdAt so last-write-wins
  // sync has a sane starting point instead of NULL.
  await addColumnIfMissing(db, 'diary_entries', 'updatedAt', 'updatedAt TEXT');
  await addColumnIfMissing(db, 'finance_entries', 'updatedAt', 'updatedAt TEXT');
  await addColumnIfMissing(db, 'harvests', 'updatedAt', 'updatedAt TEXT');
  await db.execAsync(`
    UPDATE diary_entries SET updatedAt = createdAt WHERE updatedAt IS NULL;
    UPDATE finance_entries SET updatedAt = createdAt WHERE updatedAt IS NULL;
    UPDATE harvests SET updatedAt = createdAt WHERE updatedAt IS NULL;
  `);

  await addColumnIfMissing(db, 'farm_profile', 'userId', 'userId TEXT');
  await addColumnIfMissing(db, 'farm_profile', 'lastSyncedAt', 'lastSyncedAt TEXT');

  for (const table of SYNCABLE_TABLES) {
    await addColumnIfMissing(db, table, 'uuid', 'uuid TEXT');
    await addColumnIfMissing(db, table, 'userId', 'userId TEXT');
    await addColumnIfMissing(db, table, 'deletedAt', 'deletedAt TEXT');
    await addColumnIfMissing(db, table, 'lastSyncedAt', 'lastSyncedAt TEXT');

    // Backfill a unique uuid per existing row — can't be a column DEFAULT
    // since every row needs a *different* value.
    const rows = await db.getAllAsync<{ id: number }>(`SELECT id FROM ${table} WHERE uuid IS NULL`);
    for (const row of rows) {
      await db.runAsync(`UPDATE ${table} SET uuid = ? WHERE id = ?`, uuidv4(), row.id);
    }
  }
}

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const database = await SQLite.openDatabaseAsync('bhoomishakti-diary.db');
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS diary_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      note TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL
    );
  `);

  const row = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;

  if (version < 1) {
    version = 1; // diary_entries already ensured above for both new and pre-existing installs
  }
  if (version < 2) {
    await migrateToV2(database);
    version = 2;
  }
  if (version < 3) {
    await migrateToV3(database);
    version = 3;
  }
  await database.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);

  return database;
}
