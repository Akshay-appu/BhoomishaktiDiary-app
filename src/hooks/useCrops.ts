import * as SQLite from 'expo-sqlite';
import * as cropsRepo from '../db/cropsRepo';
import { Crop } from '../db/schema';
import { useEntityList } from './useEntityList';

export function useCrops(db: SQLite.SQLiteDatabase | null, ready: boolean, ownerId: string | null) {
  return useEntityList<Crop, cropsRepo.CropInput>(db, ready, ownerId, {
    list: cropsRepo.listCrops,
    add: cropsRepo.addCrop,
    update: cropsRepo.updateCrop,
    remove: cropsRepo.deleteCrop,
  });
}
