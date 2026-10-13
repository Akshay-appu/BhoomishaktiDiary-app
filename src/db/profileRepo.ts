import * as SQLite from 'expo-sqlite';
import { FarmProfile } from './schema';

export type ProfileInput = {
  farmName: string;
  farmerName: string;
  village: string;
  district: string;
  state: string;
  totalArea: number | null;
  areaUnit: string;
};

// farm_profile is a single local row (id=1, enforced by a CHECK constraint)
// rather than a list, so it can't carry one row per account the way the
// other tables do. Reads are scoped by ownerId (a different signed-in user
// sees "no profile yet," never the previous user's data); saving always
// writes id=1 and re-stamps it with the current ownerId — so on a shared
// device, the *last person who saved* owns the single stored copy, and
// switching users doesn't let you read someone else's profile out of it.
export async function getProfile(db: SQLite.SQLiteDatabase, ownerId: string | null): Promise<FarmProfile | null> {
  return db.getFirstAsync<FarmProfile>('SELECT * FROM farm_profile WHERE id = 1 AND (userId IS ?)', ownerId);
}

export async function saveProfile(db: SQLite.SQLiteDatabase, input: ProfileInput, ownerId: string | null): Promise<void> {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    `UPDATE farm_profile SET farmName = ?, farmerName = ?, village = ?, district = ?, state = ?,
       totalArea = ?, areaUnit = ?, updatedAt = ?, userId = ? WHERE id = 1`,
    input.farmName, input.farmerName, input.village, input.district, input.state,
    input.totalArea, input.areaUnit, now, ownerId
  );
  if (result.changes === 0) {
    await db.runAsync(
      `INSERT INTO farm_profile (id, farmName, farmerName, village, district, state, totalArea, areaUnit, updatedAt, userId)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      input.farmName, input.farmerName, input.village, input.district, input.state,
      input.totalArea, input.areaUnit, now, ownerId
    );
  }
}
