import * as SQLite from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

// Generic load/add/update/delete + refresh for a single-table entity list.
// Every list screen (plots, crops, finance entries, harvests) follows the
// same shape as useActivities did, so this is that shape made reusable.
//
// `ownerId` scopes every query to the signed-in user (or null for
// guest/pre-auth local data) — see schema.ts's SyncColumns. Switching
// accounts (ownerId changes) re-fetches so the list never shows stale data
// from a different owner.
export function useEntityList<T extends { id: number }, Input>(
  db: SQLite.SQLiteDatabase | null,
  ready: boolean,
  ownerId: string | null,
  repo: {
    list: (db: SQLite.SQLiteDatabase, ownerId: string | null) => Promise<T[]>;
    add: (db: SQLite.SQLiteDatabase, input: Input, ownerId: string | null) => Promise<void>;
    update: (db: SQLite.SQLiteDatabase, id: number, input: Input, ownerId: string | null) => Promise<void>;
    remove: (db: SQLite.SQLiteDatabase, id: number, ownerId: string | null) => Promise<void>;
  }
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!db) return;
    setItems(await repo.list(db, ownerId));
    // repo is a stable module-level object literal passed by the caller each
    // render; depending on db/ownerId avoids re-creating this callback every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, ownerId]);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    (async () => {
      if (!db) {
        if (alive) setLoading(false);
        return;
      }
      const rows = await repo.list(db, ownerId);
      if (alive) {
        setItems(rows);
        setLoading(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, ready, ownerId]);

  const add = useCallback(async (input: Input) => {
    if (!db) return;
    await repo.add(db, input, ownerId);
    await refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, ownerId, refresh]);

  const update = useCallback(async (id: number, input: Input) => {
    if (!db) return;
    await repo.update(db, id, input, ownerId);
    await refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, ownerId, refresh]);

  const remove = useCallback(async (id: number) => {
    if (!db) return;
    await repo.remove(db, id, ownerId);
    await refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, ownerId, refresh]);

  return { items, loading, add, update, remove, refresh };
}
