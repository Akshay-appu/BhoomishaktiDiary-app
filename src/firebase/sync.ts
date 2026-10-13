import {
  collection, doc, getDoc, getDocs, setDoc, type Firestore,
} from 'firebase/firestore';
import * as SQLite from 'expo-sqlite';

// Generic push/pull engine for every syncable table (plots, crops,
// diary_entries, finance_entries, harvests). One config per entity instead
// of bespoke logic per table — mirrors how useEntityList generalized CRUD.
//
// Local autoincrement ids (plotId/cropId on crops/diary_entries/harvests)
// are device-specific and meaningless on another device, so they never
// travel to Firestore directly: refColumns describes which local columns
// are really references to another synced table, and the cloud doc carries
// the referenced row's stable `uuid` instead (as `<column>Uuid`). Pulling
// resolves that uuid back to whatever local id it has (or NULL if that
// referenced row hasn't synced down yet — resolved on a later pass once it
// has).
export type RefColumn = { localColumn: string; refTable: string };

export type EntitySyncConfig = {
  table: string;
  collection: string;
  // Plain data columns to sync verbatim (NOT including id/uuid/userId/
  // updatedAt/deletedAt/lastSyncedAt/ref columns — those are handled
  // specially below).
  columns: string[];
  refColumns?: RefColumn[];
};

type SqlValue = string | number | null;

async function resolveLocalIdToUuid(db: SQLite.SQLiteDatabase, table: string, localId: SqlValue): Promise<string | null> {
  if (localId === null || localId === undefined) return null;
  const row = await db.getFirstAsync<{ uuid: string }>(`SELECT uuid FROM ${table} WHERE id = ?`, localId);
  return row?.uuid ?? null;
}

async function resolveUuidToLocalId(db: SQLite.SQLiteDatabase, table: string, uuid: unknown, ownerId: string): Promise<number | null> {
  if (typeof uuid !== 'string' || !uuid) return null;
  const row = await db.getFirstAsync<{ id: number }>(`SELECT id FROM ${table} WHERE uuid = ? AND userId = ?`, uuid, ownerId);
  return row?.id ?? null;
}

// Pushes every row changed since it was last synced (or never synced) to
// `users/{uid}/{collection}/{uuid}`, then stamps lastSyncedAt locally.
export async function pushEntity(
  db: SQLite.SQLiteDatabase, firestore: Firestore, ownerId: string, config: EntitySyncConfig
): Promise<number> {
  const pending = await db.getAllAsync<Record<string, SqlValue>>(
    `SELECT * FROM ${config.table} WHERE userId = ? AND (lastSyncedAt IS NULL OR updatedAt > lastSyncedAt)`,
    ownerId
  );
  const now = new Date().toISOString();
  for (const row of pending) {
    const data: Record<string, unknown> = {
      updatedAt: row.updatedAt, deletedAt: row.deletedAt ?? null, createdAt: row.createdAt ?? null,
    };
    for (const col of config.columns) data[col] = row[col];
    for (const ref of config.refColumns ?? []) {
      data[`${ref.localColumn}Uuid`] = await resolveLocalIdToUuid(db, ref.refTable, row[ref.localColumn] as SqlValue);
    }
    await setDoc(doc(firestore, `users/${ownerId}/${config.collection}/${row.uuid}`), data, { merge: true });
    await db.runAsync(`UPDATE ${config.table} SET lastSyncedAt = ? WHERE id = ?`, now, row.id as number);
  }
  return pending.length;
}

// Pulls every remote doc and applies last-write-wins: a doc only overwrites
// the matching local row (by uuid) if the remote updatedAt is strictly
// newer; otherwise the local row is left alone (it'll be pushed instead, or
// is already in sync). Docs with no matching local row are inserted fresh.
export async function pullEntity(
  db: SQLite.SQLiteDatabase, firestore: Firestore, ownerId: string, config: EntitySyncConfig
): Promise<number> {
  const snap = await getDocs(collection(firestore, `users/${ownerId}/${config.collection}`));
  const now = new Date().toISOString();
  let applied = 0;

  for (const docSnap of snap.docs) {
    const remote = docSnap.data();
    const remoteUpdatedAt = String(remote.updatedAt ?? '');
    const existing = await db.getFirstAsync<{ id: number; updatedAt: string }>(
      `SELECT id, updatedAt FROM ${config.table} WHERE uuid = ? AND userId = ?`, docSnap.id, ownerId
    );

    if (existing) {
      if (existing.updatedAt >= remoteUpdatedAt) {
        // Local is already current or newer. If exactly equal, this is the
        // round-trip of our own last push — mark it synced so it isn't
        // re-pushed every pass. If local is strictly newer, leave it; the
        // next push will carry it up.
        if (existing.updatedAt === remoteUpdatedAt) {
          await db.runAsync(`UPDATE ${config.table} SET lastSyncedAt = ? WHERE id = ?`, now, existing.id);
        }
        continue;
      }
    }

    const refs: Record<string, number | null> = {};
    for (const ref of config.refColumns ?? []) {
      refs[ref.localColumn] = await resolveUuidToLocalId(db, ref.refTable, remote[`${ref.localColumn}Uuid`], ownerId);
    }

    const setColumns = ['updatedAt', 'deletedAt', ...config.columns, ...Object.keys(refs)];
    const setValues: SqlValue[] = [
      remoteUpdatedAt, (remote.deletedAt as SqlValue) ?? null,
      ...config.columns.map(c => (remote[c] as SqlValue) ?? null),
      ...Object.values(refs),
    ];

    if (existing) {
      await db.runAsync(
        `UPDATE ${config.table} SET ${setColumns.map(c => `${c} = ?`).join(', ')}, lastSyncedAt = ? WHERE id = ?`,
        ...setValues, now, existing.id
      );
    } else {
      const insertColumns = ['uuid', 'userId', 'lastSyncedAt', 'createdAt', ...setColumns];
      const insertValues: SqlValue[] = [
        docSnap.id, ownerId, now, (remote.createdAt as SqlValue) ?? remoteUpdatedAt, ...setValues,
      ];
      await db.runAsync(
        `INSERT INTO ${config.table} (${insertColumns.join(', ')}) VALUES (${insertColumns.map(() => '?').join(', ')})`,
        ...insertValues
      );
    }
    applied += 1;
  }
  return applied;
}

export const PLOTS_SYNC: EntitySyncConfig = {
  table: 'plots', collection: 'plots', columns: ['name', 'area', 'areaUnit', 'notes'],
};
export const CROPS_SYNC: EntitySyncConfig = {
  table: 'crops', collection: 'crops',
  columns: ['cropName', 'season', 'sowingDate', 'expectedHarvestDate'],
  refColumns: [{ localColumn: 'plotId', refTable: 'plots' }],
};
export const ACTIVITIES_SYNC: EntitySyncConfig = {
  table: 'diary_entries', collection: 'activities', columns: ['title', 'category', 'note'],
  refColumns: [{ localColumn: 'plotId', refTable: 'plots' }, { localColumn: 'cropId', refTable: 'crops' }],
};
export const FINANCE_SYNC: EntitySyncConfig = {
  table: 'finance_entries', collection: 'financeEntries', columns: ['type', 'amount', 'category', 'date', 'notes'],
};
export const HARVESTS_SYNC: EntitySyncConfig = {
  table: 'harvests', collection: 'harvests',
  columns: ['harvestDate', 'quantity', 'quantityUnit', 'sellingPrice', 'buyer', 'notes'],
  refColumns: [{ localColumn: 'plotId', refTable: 'plots' }, { localColumn: 'cropId', refTable: 'crops' }],
};

export const ALL_ENTITY_SYNC_CONFIGS: EntitySyncConfig[] = [
  PLOTS_SYNC, CROPS_SYNC, ACTIVITIES_SYNC, FINANCE_SYNC, HARVESTS_SYNC,
];

// farm_profile is a single local row (id=1), not a list, so it gets its own
// simple doc at users/{uid}/meta/profile instead of the generic engine.
export async function pushProfile(db: SQLite.SQLiteDatabase, firestore: Firestore, ownerId: string): Promise<boolean> {
  const row = await db.getFirstAsync<Record<string, SqlValue>>(
    'SELECT * FROM farm_profile WHERE id = 1 AND userId = ? AND (lastSyncedAt IS NULL OR updatedAt > lastSyncedAt)',
    ownerId
  );
  if (!row) return false;
  const now = new Date().toISOString();
  await setDoc(doc(firestore, `users/${ownerId}/meta/profile`), {
    farmName: row.farmName, farmerName: row.farmerName, village: row.village, district: row.district,
    state: row.state, totalArea: row.totalArea, areaUnit: row.areaUnit, updatedAt: row.updatedAt,
  });
  await db.runAsync('UPDATE farm_profile SET lastSyncedAt = ? WHERE id = 1', now);
  return true;
}

export async function pullProfile(db: SQLite.SQLiteDatabase, firestore: Firestore, ownerId: string): Promise<boolean> {
  const snap = await getDoc(doc(firestore, `users/${ownerId}/meta/profile`));
  if (!snap.exists()) return false;
  const remote = snap.data();
  const remoteUpdatedAt = String(remote.updatedAt ?? '');
  const now = new Date().toISOString();
  const existing = await db.getFirstAsync<{ updatedAt: string }>(
    'SELECT updatedAt FROM farm_profile WHERE id = 1 AND userId = ?', ownerId
  );
  if (existing && existing.updatedAt >= remoteUpdatedAt) {
    if (existing.updatedAt === remoteUpdatedAt) {
      await db.runAsync('UPDATE farm_profile SET lastSyncedAt = ? WHERE id = 1', now);
    }
    return false;
  }
  await db.runAsync(
    `INSERT INTO farm_profile (id, farmName, farmerName, village, district, state, totalArea, areaUnit, updatedAt, userId, lastSyncedAt)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET farmName=excluded.farmName, farmerName=excluded.farmerName, village=excluded.village,
       district=excluded.district, state=excluded.state, totalArea=excluded.totalArea, areaUnit=excluded.areaUnit,
       updatedAt=excluded.updatedAt, userId=excluded.userId, lastSyncedAt=excluded.lastSyncedAt`,
    remote.farmName, remote.farmerName, remote.village, remote.district, remote.state,
    remote.totalArea, remote.areaUnit, remoteUpdatedAt, ownerId, now
  );
  return true;
}
