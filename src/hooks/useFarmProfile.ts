import * as SQLite from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import * as profileRepo from '../db/profileRepo';
import { ProfileInput } from '../db/profileRepo';
import { FarmProfile } from '../db/schema';

export function useFarmProfile(db: SQLite.SQLiteDatabase | null, ready: boolean, ownerId: string | null) {
  const [profile, setProfile] = useState<FarmProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    (async () => {
      if (!db) {
        if (alive) setLoading(false);
        return;
      }
      const row = await profileRepo.getProfile(db, ownerId);
      if (alive) {
        setProfile(row);
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [db, ready, ownerId]);

  const save = useCallback(async (input: ProfileInput) => {
    if (!db) return;
    await profileRepo.saveProfile(db, input, ownerId);
    setProfile(await profileRepo.getProfile(db, ownerId));
  }, [db, ownerId]);

  const refresh = useCallback(async () => {
    if (!db) return;
    setProfile(await profileRepo.getProfile(db, ownerId));
  }, [db, ownerId]);

  return { profile, loading, save, refresh };
}
