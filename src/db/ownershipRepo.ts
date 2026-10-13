import * as SQLite from 'expo-sqlite';

const SYNCABLE_TABLES = ['plots', 'crops', 'diary_entries', 'finance_entries', 'harvests'] as const;

// "Unclaimed" = userId IS NULL — data entered before any account existed on
// this device (today's only mode, untouched for anyone who never signs in).
export async function hasUnclaimedData(db: SQLite.SQLiteDatabase): Promise<boolean> {
  for (const table of SYNCABLE_TABLES) {
    const row = await db.getFirstAsync<{ c: number }>(`SELECT COUNT(*) as c FROM ${table} WHERE userId IS NULL`);
    if ((row?.c ?? 0) > 0) return true;
  }
  const profile = await db.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM farm_profile WHERE id = 1 AND userId IS NULL');
  return (profile?.c ?? 0) > 0;
}

// One-time claim: every row this device has never associated with any
// account becomes this user's. Bumps updatedAt so the next sync pass treats
// them as pending (they've never been pushed to this account's cloud data).
export async function claimUnclaimedData(db: SQLite.SQLiteDatabase, uid: string): Promise<void> {
  const now = new Date().toISOString();
  await db.withTransactionAsync(async () => {
    for (const table of SYNCABLE_TABLES) {
      await db.runAsync(`UPDATE ${table} SET userId = ?, updatedAt = ? WHERE userId IS NULL`, uid, now);
    }
    await db.runAsync('UPDATE farm_profile SET userId = ?, updatedAt = ? WHERE id = 1 AND userId IS NULL', uid, now);
  });
}
