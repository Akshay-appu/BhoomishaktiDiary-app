import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { AlertModal } from './src/components/AlertModal';
import { useCrossPlatformAlert } from './src/hooks/useCrossPlatformAlert';
import { useResponsive } from './src/hooks/useResponsive';
import { useActivities } from './src/hooks/useActivities';
import { useFarmProfile } from './src/hooks/useFarmProfile';
import { usePlots } from './src/hooks/usePlots';
import { useCrops } from './src/hooks/useCrops';
import { useFinance } from './src/hooks/useFinance';
import { useHarvests } from './src/hooks/useHarvests';
import { useBackup } from './src/hooks/useBackup';
import { useAuth } from './src/hooks/useAuth';
import { useClaimLocalData } from './src/hooks/useClaimLocalData';
import { useSync } from './src/hooks/useSync';
import { AuthScreen } from './src/screens/AuthScreen';
import { openDatabase } from './src/db/schema';
import { Crop, Entry, FinanceEntry, Harvest, Plot } from './src/db/schema';
import { BackupData } from './src/db/backupRepo';
import { copy, Language, languages } from './src/i18n/copy';
import { seasonLabel } from './src/i18n/vocab';
import { ActivityFormModal } from './src/screens/ActivityFormModal';
import { HomeScreen } from './src/screens/HomeScreen';
import { DiaryScreen } from './src/screens/DiaryScreen';
import { FarmScreen } from './src/screens/FarmScreen';
import { RecordsScreen } from './src/screens/RecordsScreen';
import { MoreScreen } from './src/screens/MoreScreen';
import { shared } from './src/styles/shared';
import { CONTENT_MAX_WIDTH, NAV_MAX_WIDTH } from './src/theme';

type Tab = 'Home' | 'Diary' | 'Farm' | 'Records' | 'More';

export default function App() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [dbReady, setDbReady] = useState(false);
  const [tab, setTab] = useState<Tab>('Home');
  const [language, setLanguage] = useState<Language>('en');
  const [showAdd, setShowAdd] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [note, setNote] = useState('');
  const [activityPlotId, setActivityPlotId] = useState<number | null>(null);
  const [activityCropId, setActivityCropId] = useState<number | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const { isMobile, lg, horizontalPadding, gridColumns, cardWidth } = useResponsive();
  const { webAlert, setWebAlert, showAlert } = useCrossPlatformAlert();
  const auth = useAuth();
  // Every entity query is scoped by this value (see schema.ts's
  // SyncColumns): null while signed out (today's local-only behavior,
  // untouched), the Firebase uid once signed in.
  const ownerId: string | null = auth.user?.uid ?? null;
  const activities = useActivities(db, dbReady, ownerId);
  const profile = useFarmProfile(db, dbReady, ownerId);
  const plots = usePlots(db, dbReady, ownerId);
  const crops = useCrops(db, dbReady, ownerId);
  const finance = useFinance(db, dbReady, ownerId);
  const harvests = useHarvests(db, dbReady, ownerId);
  const backup = useBackup(db, ownerId);

  const refreshAllEntities = useCallback(async () => {
    await Promise.all([
      activities.refresh(), profile.refresh(), plots.refresh(),
      crops.refresh(), finance.refresh(), harvests.refresh(),
    ]);
  }, [activities, profile, plots, crops, finance, harvests]);

  const sync = useSync(db, ownerId, refreshAllEntities);
  const claimLocalData = useClaimLocalData(db, ownerId, () => {
    void refreshAllEntities().then(() => sync.syncNow());
  });

  const t = useMemo(() => copy[language], [language]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const database = await openDatabase();
        if (!alive) return;
        setDb(database);
      } catch {
        showAlert('Local storage error', 'Could not initialize the diary database. Please restart the app.');
      } finally {
        if (alive) setDbReady(true);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!claimLocalData.pendingClaim) return;
    showAlert(t.claimLocalDataTitle, t.claimLocalDataMessage, [
      { text: t.claimLocalDataSkip, style: 'cancel', onPress: () => claimLocalData.skip() },
      { text: t.claimLocalDataConfirm, onPress: () => claimLocalData.claim() },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimLocalData.pendingClaim]);

  const openAddActivity = useCallback(() => {
    setEditingEntryId(null);
    setTitle('');
    setCategory('General');
    setNote('');
    setActivityPlotId(null);
    setActivityCropId(null);
    setShowAdd(true);
  }, []);

  const openEditActivity = useCallback((entry: Entry) => {
    setEditingEntryId(entry.id);
    setTitle(entry.title);
    setCategory(entry.category);
    setNote(entry.note);
    setActivityPlotId(entry.plotId);
    setActivityCropId(entry.cropId);
    setShowAdd(true);
  }, []);

  const saveActivity = useCallback(async () => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      showAlert(t.requiredTitle, t.enterActivity);
      return;
    }
    if (!db) {
      showAlert('Please wait', 'Local storage is still initializing.');
      return;
    }
    const input = { title: cleanTitle, category, note: note.trim(), plotId: activityPlotId, cropId: activityCropId };
    try {
      if (editingEntryId === null) {
        await activities.add(input);
        setTab('Diary');
      } else {
        await activities.update(editingEntryId, input);
      }
      setShowAdd(false);
    } catch {
      showAlert('Save failed', 'Your activity was not saved. Please try again.');
    }
  }, [activities, activityCropId, activityPlotId, category, db, editingEntryId, note, showAlert, t.enterActivity, t.requiredTitle, title]);

  const deleteActivity = useCallback((id: number) => {
    showAlert(t.deleteEntry, t.deleteConfirm, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => activities.remove(id) },
    ]);
  }, [activities, showAlert, t.cancel, t.delete, t.deleteConfirm, t.deleteEntry]);

  const deletePlotConfirm = useCallback((plot: Plot) => {
    showAlert(t.deletePlot, t.deleteConfirmGeneric, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => plots.remove(plot.id) },
    ]);
  }, [plots, showAlert, t.cancel, t.delete, t.deleteConfirmGeneric, t.deletePlot]);

  const deleteCropConfirm = useCallback((crop: Crop) => {
    showAlert(t.deleteCrop, t.deleteConfirmGeneric, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => crops.remove(crop.id) },
    ]);
  }, [crops, showAlert, t.cancel, t.delete, t.deleteConfirmGeneric, t.deleteCrop]);

  const deleteFinanceConfirm = useCallback((entry: FinanceEntry) => {
    const title = entry.type === 'expense' ? t.deleteExpense : t.deleteIncome;
    showAlert(title, t.deleteConfirmGeneric, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => finance.remove(entry.id) },
    ]);
  }, [finance, showAlert, t.cancel, t.delete, t.deleteConfirmGeneric, t.deleteExpense, t.deleteIncome]);

  const deleteHarvestConfirm = useCallback((harvest: Harvest) => {
    showAlert(t.deleteHarvest, t.deleteConfirmGeneric, [
      { text: t.cancel, style: 'cancel' },
      { text: t.delete, style: 'destructive', onPress: () => harvests.remove(harvest.id) },
    ]);
  }, [harvests, showAlert, t.cancel, t.delete, t.deleteConfirmGeneric, t.deleteHarvest]);

  const confirmRestore = useCallback((data: BackupData) => {
    showAlert(t.restoreWarningTitle, t.replaceDataWarning, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.confirmRestore,
        style: 'destructive',
        onPress: async () => {
          try {
            await backup.restore(data);
            await refreshAllEntities();
            showAlert(t.restoreSuccess, '');
          } catch (err) {
            showAlert('Save failed', err instanceof Error ? err.message : String(err));
          }
        },
      },
    ]);
  }, [backup, refreshAllEntities, showAlert, t.cancel, t.confirmRestore, t.replaceDataWarning, t.restoreSuccess, t.restoreWarningTitle]);

  const dateLabel = new Date().toLocaleDateString(
    language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN',
    { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
  );

  return (
    <SafeAreaView style={shared.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={shared.header}>
        <View style={[shared.headerInner, { maxWidth: CONTENT_MAX_WIDTH, paddingHorizontal: horizontalPadding }]}>
          <View style={shared.brandMark}><Text style={shared.brandLeaf}>✦</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={[shared.brand, lg && shared.brandLg]}>BHOOMISHAKTI</Text>
            <Text style={[shared.brandSub, lg && shared.brandSubLg]}>DIARY · {t.tagline}</Text>
          </View>
          <TouchableOpacity style={shared.langButton} onPress={() => {
            const next: Language = language === 'en' ? 'kn' : language === 'kn' ? 'hi' : 'en';
            setLanguage(next);
          }}>
            <Text style={shared.langButtonText}>{languages[language]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          shared.content,
          { paddingHorizontal: horizontalPadding, paddingTop: isMobile ? 18 : 28, maxWidth: CONTENT_MAX_WIDTH, width: '100%', alignSelf: 'center' },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {tab === 'Home' && (
          <HomeScreen
            t={t}
            lg={lg}
            gridColumns={gridColumns}
            cardWidth={cardWidth}
            dateLabel={dateLabel}
            entries={activities.entries}
            loading={activities.loading}
            plotsCount={plots.items.length}
            currentSeasonLabel={crops.items.length ? seasonLabel(language, crops.items[0].season) : ''}
            onAddPress={openAddActivity}
            onDeleteEntry={id => deleteActivity(id)}
            onViewAll={() => setTab('Diary')}
          />
        )}
        {tab === 'Diary' && (
          <DiaryScreen
            t={t}
            lg={lg}
            gridColumns={gridColumns}
            cardWidth={cardWidth}
            entries={activities.entries}
            loading={activities.loading}
            onAddPress={openAddActivity}
            onEditEntry={openEditActivity}
            onDeleteEntry={id => deleteActivity(id)}
          />
        )}
        {tab === 'Farm' && (
          <FarmScreen
            t={t}
            language={language}
            lg={lg}
            isMobile={isMobile}
            gridColumns={gridColumns}
            cardWidth={cardWidth}
            profile={profile}
            plots={plots}
            crops={crops}
            onDeletePlotConfirm={deletePlotConfirm}
            onDeleteCropConfirm={deleteCropConfirm}
            onError={message => showAlert('Save failed', message)}
          />
        )}
        {tab === 'Records' && (
          <RecordsScreen
            t={t}
            language={language}
            lg={lg}
            isMobile={isMobile}
            gridColumns={gridColumns}
            cardWidth={cardWidth}
            activitiesCount={activities.entries.length}
            finance={finance}
            harvests={harvests}
            crops={crops.items}
            plots={plots.items}
            onDeleteFinanceConfirm={deleteFinanceConfirm}
            onDeleteHarvestConfirm={deleteHarvestConfirm}
            onError={message => showAlert('Save failed', message)}
          />
        )}
        {tab === 'More' && (
          <MoreScreen
            t={t}
            lg={lg}
            language={language}
            onLanguageChange={setLanguage}
            auth={auth}
            sync={sync}
            onSignIn={() => setShowAuth(true)}
            onSignOutConfirm={() => auth.signOutUser()}
            backup={backup}
            onError={message => showAlert('Save failed', message)}
            onConfirmRestore={confirmRestore}
          />
        )}
      </ScrollView>

      <View style={shared.bottomNav}>
        <View style={[shared.bottomNavInner, { maxWidth: isMobile ? '100%' : NAV_MAX_WIDTH }]}>
          {([
            ['Home', '⌂', t.home], ['Diary', '▤', t.diary], ['Farm', '♧', t.farm],
            ['Records', '▣', t.records], ['More', '•••', t.more],
          ] as [Tab, string, string][]).map(([key, icon, label]) => (
            <TouchableOpacity key={key} style={shared.navItem} onPress={() => setTab(key)}>
              <Text style={[shared.navIcon, tab === key && shared.navActive]}>{icon}</Text>
              <Text style={[shared.navLabel, lg && shared.navLabelLg, tab === key && shared.navActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ActivityFormModal
        visible={showAdd}
        isMobile={isMobile}
        isEdit={editingEntryId !== null}
        t={t}
        title={title}
        category={category}
        note={note}
        plotId={activityPlotId}
        cropId={activityCropId}
        plots={plots.items}
        crops={crops.items}
        onTitleChange={setTitle}
        onCategoryChange={setCategory}
        onNoteChange={setNote}
        onPlotChange={setActivityPlotId}
        onCropChange={setActivityCropId}
        onSave={saveActivity}
        onClose={() => setShowAdd(false)}
      />

      <AuthScreen visible={showAuth} isMobile={isMobile} t={t} auth={auth} onClose={() => setShowAuth(false)} />

      <AlertModal alert={webAlert} onClose={() => setWebAlert(null)} />
    </SafeAreaView>
  );
}
