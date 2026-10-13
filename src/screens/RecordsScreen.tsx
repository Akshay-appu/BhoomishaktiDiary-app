import React, { useMemo, useState } from 'react';
import { ActivityIndicator, DimensionValue, Text, View } from 'react-native';
import { PrimaryButton } from '../components/Buttons';
import { EmptyState } from '../components/EmptyState';
import { GridList } from '../components/GridList';
import { ListCard } from '../components/ListCard';
import { SectionTitle } from '../components/SectionTitle';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { Stat } from '../components/Stat';
import { Crop, FinanceEntry, Harvest, Plot } from '../db/schema';
import { Copy, Language } from '../i18n/copy';
import { expenseCategoryLabel, incomeCategoryLabel, quantityUnitLabel, seasonLabel } from '../i18n/vocab';
import { FinanceFormModal, FinanceFormState } from './FinanceFormModal';
import { HarvestFormModal, HarvestFormState } from './HarvestFormModal';
import { shared } from '../styles/shared';
import { formatINR, formatShortDate, isValidDateString, parseAmount, todayDateString } from '../utils/format';

type RecordsSection = 'overview' | 'finance' | 'harvests';

const EMPTY_FINANCE: FinanceFormState = { type: 'expense', category: 'seeds', amount: '', date: todayDateString(), notes: '' };
const EMPTY_HARVEST: HarvestFormState = {
  cropId: null, plotId: null, harvestDate: todayDateString(), quantity: '', quantityUnit: 'kg', sellingPrice: '', buyer: '', notes: '',
};

export function RecordsScreen({
  t, language, lg, isMobile, gridColumns, cardWidth,
  activitiesCount, finance, harvests, crops, plots,
  onDeleteFinanceConfirm, onDeleteHarvestConfirm, onError,
}: {
  t: Copy;
  language: Language;
  lg: boolean;
  isMobile: boolean;
  gridColumns: number;
  cardWidth: DimensionValue;
  activitiesCount: number;
  finance: {
    items: FinanceEntry[]; loading: boolean;
    add: (input: { type: 'expense' | 'income'; amount: number; category: string; date: string; notes: string }) => Promise<void>;
    update: (id: number, input: { type: 'expense' | 'income'; amount: number; category: string; date: string; notes: string }) => Promise<void>;
  };
  harvests: {
    items: Harvest[]; loading: boolean;
    add: (input: { cropId: number | null; plotId: number | null; harvestDate: string; quantity: number; quantityUnit: string; sellingPrice: number | null; buyer: string | null; notes: string }) => Promise<void>;
    update: (id: number, input: { cropId: number | null; plotId: number | null; harvestDate: string; quantity: number; quantityUnit: string; sellingPrice: number | null; buyer: string | null; notes: string }) => Promise<void>;
  };
  crops: Crop[];
  plots: Plot[];
  onDeleteFinanceConfirm: (entry: FinanceEntry) => void;
  onDeleteHarvestConfirm: (harvest: Harvest) => void;
  onError: (message: string) => void;
}) {
  const [section, setSection] = useState<RecordsSection>('overview');

  const totalExpenses = useMemo(() => finance.items.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0), [finance.items]);
  const totalIncome = useMemo(() => finance.items.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0), [finance.items]);
  const netBalance = totalIncome - totalExpenses;

  const harvestValue = useMemo(() => {
    let value = 0;
    let missingPriceCount = 0;
    for (const h of harvests.items) {
      if (h.sellingPrice != null) value += h.quantity * h.sellingPrice;
      else missingPriceCount += 1;
    }
    return { value, missingPriceCount };
  }, [harvests.items]);

  const seasonalGroups = useMemo(() => {
    const groups = new Map<string, Crop[]>();
    for (const crop of crops) {
      const key = crop.season;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(crop);
    }
    return Array.from(groups.entries());
  }, [crops]);

  // --- Finance form ---
  const [financeModalVisible, setFinanceModalVisible] = useState(false);
  const [editingFinanceId, setEditingFinanceId] = useState<number | null>(null);
  const [financeForm, setFinanceForm] = useState<FinanceFormState>(EMPTY_FINANCE);
  const [financeErrors, setFinanceErrors] = useState<{ amount?: string; date?: string }>({});

  const openAddFinance = (type: 'expense' | 'income') => {
    setEditingFinanceId(null);
    setFinanceForm({ ...EMPTY_FINANCE, type });
    setFinanceErrors({});
    setFinanceModalVisible(true);
  };
  const openEditFinance = (entry: FinanceEntry) => {
    setEditingFinanceId(entry.id);
    setFinanceForm({ type: entry.type, category: entry.category, amount: String(entry.amount), date: entry.date, notes: entry.notes });
    setFinanceErrors({});
    setFinanceModalVisible(true);
  };
  const saveFinance = async () => {
    const amount = parseAmount(financeForm.amount);
    const errors: typeof financeErrors = {};
    if (amount === null || amount <= 0) errors.amount = t.invalidAmount;
    if (!isValidDateString(financeForm.date)) errors.date = t.invalidDate;
    if (Object.keys(errors).length) { setFinanceErrors(errors); return; }
    const input = { type: financeForm.type, amount: amount!, category: financeForm.category, date: financeForm.date, notes: financeForm.notes.trim() };
    try {
      if (editingFinanceId === null) await finance.add(input); else await finance.update(editingFinanceId, input);
      setFinanceModalVisible(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    }
  };

  // --- Harvest form ---
  const [harvestModalVisible, setHarvestModalVisible] = useState(false);
  const [editingHarvestId, setEditingHarvestId] = useState<number | null>(null);
  const [harvestForm, setHarvestForm] = useState<HarvestFormState>(EMPTY_HARVEST);
  const [harvestErrors, setHarvestErrors] = useState<{ quantity?: string; harvestDate?: string }>({});

  const openAddHarvest = () => { setEditingHarvestId(null); setHarvestForm(EMPTY_HARVEST); setHarvestErrors({}); setHarvestModalVisible(true); };
  const openEditHarvest = (h: Harvest) => {
    setEditingHarvestId(h.id);
    setHarvestForm({
      cropId: h.cropId, plotId: h.plotId, harvestDate: h.harvestDate, quantity: String(h.quantity),
      quantityUnit: h.quantityUnit as HarvestFormState['quantityUnit'], sellingPrice: h.sellingPrice != null ? String(h.sellingPrice) : '',
      buyer: h.buyer ?? '', notes: h.notes,
    });
    setHarvestErrors({});
    setHarvestModalVisible(true);
  };
  const saveHarvest = async () => {
    const quantity = parseAmount(harvestForm.quantity);
    const errors: typeof harvestErrors = {};
    if (quantity === null || quantity <= 0) errors.quantity = t.invalidAmount;
    if (!isValidDateString(harvestForm.harvestDate)) errors.harvestDate = t.invalidDate;
    if (Object.keys(errors).length) { setHarvestErrors(errors); return; }
    const input = {
      cropId: harvestForm.cropId, plotId: harvestForm.plotId, harvestDate: harvestForm.harvestDate,
      quantity: quantity!, quantityUnit: harvestForm.quantityUnit, sellingPrice: parseAmount(harvestForm.sellingPrice),
      buyer: harvestForm.buyer.trim() || null, notes: harvestForm.notes.trim(),
    };
    try {
      if (editingHarvestId === null) await harvests.add(input); else await harvests.update(editingHarvestId, input);
      setHarvestModalVisible(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <>
      <Text style={[shared.pageTitle, lg && shared.pageTitleLg]}>{t.records}</Text>
      <SegmentedTabs
        options={[
          { key: 'overview', label: t.recordsOverviewTab },
          { key: 'finance', label: t.financeTab },
          { key: 'harvests', label: t.harvestsTab },
        ]}
        value={section}
        onChange={setSection}
      />

      {section === 'overview' && (
        <>
          <View style={shared.statsRow}>
            <Stat value={String(activitiesCount)} label={t.totalActivities} lg={lg} />
            <Stat value={formatINR(totalExpenses)} label={t.totalExpenses} lg={lg} />
            <Stat value={formatINR(totalIncome)} label={t.totalIncome} lg={lg} />
          </View>
          <View style={shared.statsRow}>
            <Stat value={formatINR(netBalance)} label={t.netBalance} note={t.netBalanceNote} lg={lg} />
            <Stat
              value={formatINR(harvestValue.value)}
              label={t.totalValue}
              note={harvestValue.missingPriceCount > 0 ? `${harvestValue.missingPriceCount} ${t.valueNotRecorded.toLowerCase()}` : undefined}
              lg={lg}
            />
          </View>
          <SectionTitle title={t.seasonalHistory} lg={lg} />
          {seasonalGroups.length ? (
            <GridList
              items={seasonalGroups.map(([season, list]) => ({ id: season.length, season, list }))}
              gridColumns={gridColumns}
              cardWidth={cardWidth}
              renderItem={group => (
                <ListCard
                  icon="📅"
                  title={seasonLabel(language, group.season)}
                  meta={`${group.list.length} ${t.cropsTab.toLowerCase()}`}
                  note={group.list.map(c => c.cropName).join(', ')}
                  lg={lg}
                />
              )}
            />
          ) : (
            <EmptyState title={t.noDataYet} detail={t.addFirstCrop} lg={lg} />
          )}
        </>
      )}

      {section === 'finance' && (
        <>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <View style={{ flex: 1 }}><PrimaryButton label={`＋ ${t.addExpense}`} onPress={() => openAddFinance('expense')} /></View>
            <View style={{ flex: 1 }}><PrimaryButton label={`＋ ${t.addIncome}`} onPress={() => openAddFinance('income')} /></View>
          </View>
          {finance.loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : finance.items.length ? (
            <GridList
              items={finance.items}
              gridColumns={gridColumns}
              cardWidth={cardWidth}
              renderItem={entry => (
                <ListCard
                  icon={entry.type === 'expense' ? '💸' : '💰'}
                  title={entry.type === 'expense' ? expenseCategoryLabel(language, entry.category) : incomeCategoryLabel(language, entry.category)}
                  meta={`${formatINR(entry.amount)} · ${formatShortDate(entry.date, 'en-IN')}`}
                  note={entry.notes}
                  onPress={() => openEditFinance(entry)}
                  onDelete={() => onDeleteFinanceConfirm(entry)}
                  lg={lg}
                />
              )}
            />
          ) : (
            <EmptyState title={t.noExpensesYet} detail={t.addFirstExpense} lg={lg} />
          )}
        </>
      )}

      {section === 'harvests' && (
        <>
          <PrimaryButton label={`＋ ${t.addHarvest}`} onPress={openAddHarvest} />
          {harvests.loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : harvests.items.length ? (
            <GridList
              items={harvests.items}
              gridColumns={gridColumns}
              cardWidth={cardWidth}
              renderItem={h => {
                const cropName = crops.find(c => c.id === h.cropId)?.cropName ?? t.noCropLinked;
                const valueLabel = h.sellingPrice != null ? formatINR(h.quantity * h.sellingPrice) : t.valueNotRecorded;
                return (
                  <ListCard
                    icon="🌾"
                    title={cropName}
                    meta={`${h.quantity} ${quantityUnitLabel(language, h.quantityUnit)} · ${formatShortDate(h.harvestDate, 'en-IN')}`}
                    note={`${t.totalValue}: ${valueLabel}${h.buyer ? ` · ${h.buyer}` : ''}`}
                    onPress={() => openEditHarvest(h)}
                    onDelete={() => onDeleteHarvestConfirm(h)}
                    lg={lg}
                  />
                );
              }}
            />
          ) : (
            <EmptyState title={t.noHarvestsYet} detail={t.addFirstHarvest} lg={lg} />
          )}
        </>
      )}

      <FinanceFormModal
        visible={financeModalVisible}
        isMobile={isMobile}
        isEdit={editingFinanceId !== null}
        t={t}
        language={language}
        state={financeForm}
        onChange={setFinanceForm}
        onSave={saveFinance}
        onClose={() => setFinanceModalVisible(false)}
        errors={financeErrors}
      />
      <HarvestFormModal
        visible={harvestModalVisible}
        isMobile={isMobile}
        isEdit={editingHarvestId !== null}
        t={t}
        language={language}
        state={harvestForm}
        crops={crops}
        plots={plots}
        onChange={setHarvestForm}
        onSave={saveHarvest}
        onClose={() => setHarvestModalVisible(false)}
        errors={harvestErrors}
      />
    </>
  );
}
