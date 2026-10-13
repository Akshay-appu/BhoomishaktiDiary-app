import * as SQLite from 'expo-sqlite';
import * as harvestsRepo from '../db/harvestsRepo';
import { Harvest } from '../db/schema';
import { useEntityList } from './useEntityList';

export function useHarvests(db: SQLite.SQLiteDatabase | null, ready: boolean, ownerId: string | null) {
  return useEntityList<Harvest, harvestsRepo.HarvestInput>(db, ready, ownerId, {
    list: harvestsRepo.listHarvests,
    add: harvestsRepo.addHarvest,
    update: harvestsRepo.updateHarvest,
    remove: harvestsRepo.deleteHarvest,
  });
}
