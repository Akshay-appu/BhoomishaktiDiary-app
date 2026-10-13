import * as SQLite from 'expo-sqlite';
import * as plotsRepo from '../db/plotsRepo';
import { Plot } from '../db/schema';
import { useEntityList } from './useEntityList';

export function usePlots(db: SQLite.SQLiteDatabase | null, ready: boolean, ownerId: string | null) {
  return useEntityList<Plot, plotsRepo.PlotInput>(db, ready, ownerId, {
    list: plotsRepo.listPlots,
    add: plotsRepo.addPlot,
    update: plotsRepo.updatePlot,
    remove: plotsRepo.deletePlot,
  });
}
