import * as SQLite from 'expo-sqlite';
import { Harvest } from './schema';
import { uuidv4 } from '../utils/uuid';

export type HarvestInput = {
  cropId: number | null;
  plotId: number | null;
  harvestDate: string;
  quantity: number;
  quantityUnit: string;
  sellingPrice: number | null;
  buyer: string | null;
  notes: string;
};

export async function listHarvests(db: SQLite.SQLiteDatabase, ownerId: string | null): Promise<Harvest[]> {
  return db.getAllAsync<Harvest>(
    'SELECT * FROM harvests WHERE deletedAt IS NULL AND (userId IS ?) ORDER BY harvestDate DESC, id DESC',
    ownerId
  );
}

export async function addHarvest(db: SQLite.SQLiteDatabase, input: HarvestInput, ownerId: string | null): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO harvests (cropId, plotId, harvestDate, quantity, quantityUnit, sellingPrice, buyer, notes, createdAt, updatedAt, uuid, userId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    input.cropId, input.plotId, input.harvestDate, input.quantity, input.quantityUnit,
    input.sellingPrice, input.buyer, input.notes, now, now, uuidv4(), ownerId
  );
}

export async function updateHarvest(db: SQLite.SQLiteDatabase, id: number, input: HarvestInput, ownerId: string | null): Promise<void> {
  await db.runAsync(
    `UPDATE harvests SET cropId = ?, plotId = ?, harvestDate = ?, quantity = ?, quantityUnit = ?,
       sellingPrice = ?, buyer = ?, notes = ?, updatedAt = ? WHERE id = ? AND (userId IS ?)`,
    input.cropId, input.plotId, input.harvestDate, input.quantity, input.quantityUnit,
    input.sellingPrice, input.buyer, input.notes, new Date().toISOString(), id, ownerId
  );
}

export async function deleteHarvest(db: SQLite.SQLiteDatabase, id: number, ownerId: string | null): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    'UPDATE harvests SET deletedAt = ?, updatedAt = ? WHERE id = ? AND (userId IS ?)',
    now, now, id, ownerId
  );
}
