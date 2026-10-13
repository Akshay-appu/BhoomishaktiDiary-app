import * as SQLite from 'expo-sqlite';
import { unlinkPlot as unlinkPlotFromActivities } from './activitiesRepo';
import { Plot } from './schema';
import { uuidv4 } from '../utils/uuid';

export type PlotInput = { name: string; area: number | null; areaUnit: string; notes: string };

export async function listPlots(db: SQLite.SQLiteDatabase, ownerId: string | null): Promise<Plot[]> {
  return db.getAllAsync<Plot>(
    'SELECT * FROM plots WHERE deletedAt IS NULL AND (userId IS ?) ORDER BY id DESC',
    ownerId
  );
}

export async function addPlot(db: SQLite.SQLiteDatabase, input: PlotInput, ownerId: string | null): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    'INSERT INTO plots (name, area, areaUnit, notes, createdAt, updatedAt, uuid, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    input.name, input.area, input.areaUnit, input.notes, now, now, uuidv4(), ownerId
  );
}

export async function updatePlot(db: SQLite.SQLiteDatabase, id: number, input: PlotInput, ownerId: string | null): Promise<void> {
  await db.runAsync(
    'UPDATE plots SET name = ?, area = ?, areaUnit = ?, notes = ?, updatedAt = ? WHERE id = ? AND (userId IS ?)',
    input.name, input.area, input.areaUnit, input.notes, new Date().toISOString(), id, ownerId
  );
}

// Unlinks (doesn't cascade-delete) crops/activities/harvests that reference this
// plot, then soft-deletes the plot — history survives, just shown as "no plot linked",
// and the tombstone can still propagate to other devices/the cloud.
export async function deletePlot(db: SQLite.SQLiteDatabase, id: number, ownerId: string | null): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync('UPDATE crops SET plotId = NULL, updatedAt = ? WHERE plotId = ?', now, id);
  await db.runAsync('UPDATE harvests SET plotId = NULL, updatedAt = ? WHERE plotId = ?', now, id);
  await unlinkPlotFromActivities(db, id);
  await db.runAsync('UPDATE plots SET deletedAt = ?, updatedAt = ? WHERE id = ? AND (userId IS ?)', now, now, id, ownerId);
}
