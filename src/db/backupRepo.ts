import * as SQLite from 'expo-sqlite';
import { Crop, Entry, FarmProfile, FinanceEntry, Harvest, Plot } from './schema';
import { uuidv4 } from '../utils/uuid';

export const BACKUP_FORMAT = 'bhoomishakti-backup';
export const BACKUP_VERSION = 1;

export type BackupData = {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
  farmProfile: FarmProfile | null;
  plots: Plot[];
  crops: Crop[];
  diaryEntries: Entry[];
  financeEntries: FinanceEntry[];
  harvests: Harvest[];
};

export type BackupCounts = {
  farmProfile: number;
  plots: number;
  crops: number;
  diaryEntries: number;
  financeEntries: number;
  harvests: number;
};

export function countBackup(data: BackupData): BackupCounts {
  return {
    farmProfile: data.farmProfile ? 1 : 0,
    plots: data.plots.length,
    crops: data.crops.length,
    diaryEntries: data.diaryEntries.length,
    financeEntries: data.financeEntries.length,
    harvests: data.harvests.length,
  };
}

// Scoped to the active owner only — a backup never includes another local
// account's data, even though they may share this device's SQLite file.
export async function buildBackup(db: SQLite.SQLiteDatabase, ownerId: string | null): Promise<BackupData> {
  const [farmProfile, plots, crops, diaryEntries, financeEntries, harvests] = await Promise.all([
    db.getFirstAsync<FarmProfile>('SELECT * FROM farm_profile WHERE id = 1 AND (userId IS ?)', ownerId),
    db.getAllAsync<Plot>('SELECT * FROM plots WHERE deletedAt IS NULL AND (userId IS ?)', ownerId),
    db.getAllAsync<Crop>('SELECT * FROM crops WHERE deletedAt IS NULL AND (userId IS ?)', ownerId),
    db.getAllAsync<Entry>('SELECT * FROM diary_entries WHERE deletedAt IS NULL AND (userId IS ?)', ownerId),
    db.getAllAsync<FinanceEntry>('SELECT * FROM finance_entries WHERE deletedAt IS NULL AND (userId IS ?)', ownerId),
    db.getAllAsync<Harvest>('SELECT * FROM harvests WHERE deletedAt IS NULL AND (userId IS ?)', ownerId),
  ]);
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    farmProfile: farmProfile ?? null,
    plots, crops, diaryEntries, financeEntries, harvests,
  };
}

// Validates shape only (not exhaustively) before anything touches the DB.
export function parseBackup(text: string): BackupData {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('invalid-json');
  }
  if (
    typeof json !== 'object' || json === null ||
    (json as Record<string, unknown>).format !== BACKUP_FORMAT ||
    !Array.isArray((json as Record<string, unknown>).plots) ||
    !Array.isArray((json as Record<string, unknown>).crops) ||
    !Array.isArray((json as Record<string, unknown>).diaryEntries) ||
    !Array.isArray((json as Record<string, unknown>).financeEntries) ||
    !Array.isArray((json as Record<string, unknown>).harvests)
  ) {
    throw new Error('invalid-shape');
  }
  return json as BackupData;
}

// Replaces only the *active owner's* rows with the backup's contents, inside
// one transaction (all-or-nothing). This device's SQLite file may also hold
// another local account's rows (see schema.ts's userId scoping) — those are
// never touched. Restored rows always get this owner's id re-stamped and a
// fresh local autoincrement id (old ids from the backup file are not reused,
// since they could collide with another account's existing rows in the same
// table); plot/crop cross-references are remapped from old id -> new id as
// they're inserted. uuid is preserved when present (so re-syncing recognizes
// these as the same logical record instead of duplicating them in the
// cloud); lastSyncedAt is always reset to null so restored rows are treated
// as pending and re-pushed on the next sync rather than assumed up to date.
export async function restoreBackup(db: SQLite.SQLiteDatabase, data: BackupData, ownerId: string | null): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM harvests WHERE userId IS ?', ownerId);
    await db.runAsync('DELETE FROM finance_entries WHERE userId IS ?', ownerId);
    await db.runAsync('DELETE FROM diary_entries WHERE userId IS ?', ownerId);
    await db.runAsync('DELETE FROM crops WHERE userId IS ?', ownerId);
    await db.runAsync('DELETE FROM plots WHERE userId IS ?', ownerId);
    await db.runAsync('DELETE FROM farm_profile WHERE id = 1 AND userId IS ?', ownerId);

    if (data.farmProfile) {
      const p = data.farmProfile;
      const result = await db.runAsync(
        `UPDATE farm_profile SET farmName = ?, farmerName = ?, village = ?, district = ?, state = ?,
           totalArea = ?, areaUnit = ?, updatedAt = ?, userId = ? WHERE id = 1`,
        p.farmName, p.farmerName, p.village, p.district, p.state, p.totalArea, p.areaUnit, p.updatedAt, ownerId
      );
      if (result.changes === 0) {
        await db.runAsync(
          `INSERT INTO farm_profile (id, farmName, farmerName, village, district, state, totalArea, areaUnit, updatedAt, userId)
           VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          p.farmName, p.farmerName, p.village, p.district, p.state, p.totalArea, p.areaUnit, p.updatedAt, ownerId
        );
      }
    }

    const plotIdMap = new Map<number, number>();
    for (const plot of data.plots) {
      const result = await db.runAsync(
        'INSERT INTO plots (name, area, areaUnit, notes, createdAt, updatedAt, uuid, userId, deletedAt, lastSyncedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)',
        plot.name, plot.area, plot.areaUnit, plot.notes, plot.createdAt, plot.updatedAt, plot.uuid ?? uuidv4(), ownerId
      );
      plotIdMap.set(plot.id, result.lastInsertRowId);
    }

    const cropIdMap = new Map<number, number>();
    for (const crop of data.crops) {
      const mappedPlotId = crop.plotId !== null ? (plotIdMap.get(crop.plotId) ?? null) : null;
      const result = await db.runAsync(
        `INSERT INTO crops (cropName, season, plotId, sowingDate, expectedHarvestDate, createdAt, updatedAt, uuid, userId, deletedAt, lastSyncedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)`,
        crop.cropName, crop.season, mappedPlotId, crop.sowingDate, crop.expectedHarvestDate, crop.createdAt, crop.updatedAt, crop.uuid ?? uuidv4(), ownerId
      );
      cropIdMap.set(crop.id, result.lastInsertRowId);
    }

    for (const entry of data.diaryEntries) {
      const mappedPlotId = entry.plotId !== null ? (plotIdMap.get(entry.plotId) ?? null) : null;
      const mappedCropId = entry.cropId !== null ? (cropIdMap.get(entry.cropId) ?? null) : null;
      await db.runAsync(
        `INSERT INTO diary_entries (title, category, note, createdAt, updatedAt, plotId, cropId, uuid, userId, deletedAt, lastSyncedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)`,
        entry.title, entry.category, entry.note, entry.createdAt, entry.updatedAt, mappedPlotId, mappedCropId, entry.uuid ?? uuidv4(), ownerId
      );
    }
    for (const fin of data.financeEntries) {
      await db.runAsync(
        'INSERT INTO finance_entries (type, amount, category, date, notes, createdAt, updatedAt, uuid, userId, deletedAt, lastSyncedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)',
        fin.type, fin.amount, fin.category, fin.date, fin.notes, fin.createdAt, fin.updatedAt, fin.uuid ?? uuidv4(), ownerId
      );
    }
    for (const h of data.harvests) {
      const mappedPlotId = h.plotId !== null ? (plotIdMap.get(h.plotId) ?? null) : null;
      const mappedCropId = h.cropId !== null ? (cropIdMap.get(h.cropId) ?? null) : null;
      await db.runAsync(
        `INSERT INTO harvests (cropId, plotId, harvestDate, quantity, quantityUnit, sellingPrice, buyer, notes, createdAt, updatedAt, uuid, userId, deletedAt, lastSyncedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)`,
        mappedCropId, mappedPlotId, h.harvestDate, h.quantity, h.quantityUnit, h.sellingPrice, h.buyer, h.notes, h.createdAt, h.updatedAt, h.uuid ?? uuidv4(), ownerId
      );
    }
  });
}
