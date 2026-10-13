import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import * as ownershipRepo from '../db/ownershipRepo';

const promptedKey = (uid: string) => `bhoomishakti:claim-prompted:${uid}`;

// Offers, once per account per device, to attach any pre-existing
// userId-IS-NULL local data (entered before this account existed) to the
// newly signed-in account. Never silent: the caller is expected to show a
// confirm dialog when `pendingClaim` is true and call claim()/skip().
export function useClaimLocalData(db: SQLite.SQLiteDatabase | null, uid: string | null, onClaimed: () => void) {
  const [pendingClaim, setPendingClaim] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!db || !uid) {
        if (alive) setPendingClaim(false);
        return;
      }
      const alreadyPrompted = await AsyncStorage.getItem(promptedKey(uid));
      if (alreadyPrompted) return;
      const hasUnclaimed = await ownershipRepo.hasUnclaimedData(db);
      if (!alive) return;
      if (hasUnclaimed) {
        setPendingClaim(true);
      } else {
        await AsyncStorage.setItem(promptedKey(uid), '1');
      }
    })();
    return () => { alive = false; };
  }, [db, uid]);

  const claim = useCallback(async () => {
    if (!db || !uid) return;
    await ownershipRepo.claimUnclaimedData(db, uid);
    await AsyncStorage.setItem(promptedKey(uid), '1');
    setPendingClaim(false);
    onClaimed();
  }, [db, uid, onClaimed]);

  const skip = useCallback(async () => {
    if (!uid) return;
    await AsyncStorage.setItem(promptedKey(uid), '1');
    setPendingClaim(false);
  }, [uid]);

  return { pendingClaim, claim, skip };
}
