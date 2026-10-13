import React, { useState } from 'react';
import { ActivityIndicator, DimensionValue, Text } from 'react-native';
import { PrimaryButton } from '../components/Buttons';
import { ChipRow } from '../components/ChipRow';
import { EmptyState } from '../components/EmptyState';
import { FormField } from '../components/FormField';
import { GridList } from '../components/GridList';
import { ListCard } from '../components/ListCard';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { Crop, Plot } from '../db/schema';
import { Copy, Language } from '../i18n/copy';
import { areaUnitLabel, areaUnitLabels, areaUnits, seasonLabel } from '../i18n/vocab';
import { CropFormModal, CropFormState } from './CropFormModal';
import { PlotFormModal, PlotFormState } from './PlotFormModal';
import { shared } from '../styles/shared';
import { isValidDateString, parseAmount, todayDateString } from '../utils/format';

type FarmSection = 'profile' | 'plots' | 'crops';

type ProfileDraft = {
  farmName: string; farmerName: string; village: string; district: string; state: string;
  totalArea: string; areaUnit: string;
};

const EMPTY_PROFILE_DRAFT: ProfileDraft = {
  farmName: '', farmerName: '', village: '', district: '', state: '', totalArea: '', areaUnit: 'acres',
};

const EMPTY_PLOT: PlotFormState = { name: '', area: '', areaUnit: 'acres', notes: '' };
const EMPTY_CROP: CropFormState = { cropName: '', season: 'kharif', plotId: null, sowingDate: todayDateString(), expectedHarvestDate: '' };

export function FarmScreen({
  t, language, lg, isMobile, gridColumns, cardWidth,
  profile, plots, crops, onDeletePlotConfirm, onDeleteCropConfirm, onError,
}: {
  t: Copy;
  language: Language;
  lg: boolean;
  isMobile: boolean;
  gridColumns: number;
  cardWidth: DimensionValue;
  profile: { profile: { farmName: string; farmerName: string; village: string; district: string; state: string; totalArea: number | null; areaUnit: string } | null; loading: boolean; save: (input: ProfileDraftParsed) => Promise<void> };
  plots: { items: Plot[]; loading: boolean; add: (input: { name: string; area: number | null; areaUnit: string; notes: string }) => Promise<void>; update: (id: number, input: { name: string; area: number | null; areaUnit: string; notes: string }) => Promise<void> };
  crops: { items: Crop[]; loading: boolean; add: (input: { cropName: string; season: string; plotId: number | null; sowingDate: string; expectedHarvestDate: string | null }) => Promise<void>; update: (id: number, input: { cropName: string; season: string; plotId: number | null; sowingDate: string; expectedHarvestDate: string | null }) => Promise<void> };
  onDeletePlotConfirm: (plot: Plot) => void;
  onDeleteCropConfirm: (crop: Crop) => void;
  onError: (message: string) => void;
}) {
  const [section, setSection] = useState<FarmSection>('profile');

  // --- Profile ---
  // Seed the editable draft from the loaded record the moment it arrives,
  // without wiping the user's in-progress edits on every re-render. This is
  // React's documented "adjusting state during render" pattern rather than an
  // effect, since an effect-based sync would commit an extra render.
  //
  // `syncedProfile` starts at the sentinel `undefined` rather than
  // `profile.profile` itself: the profile load (in App.tsx) starts as soon as
  // the DB is ready, regardless of which tab is active, so by the time a user
  // navigates to this screen `profile.profile` is often already populated.
  // Seeding the baseline from that already-loaded value would make the first
  // render "already in sync" and permanently skip populating the draft.
  const [syncedProfile, setSyncedProfile] = useState<typeof profile.profile | undefined>(undefined);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>(EMPTY_PROFILE_DRAFT);
  if (profile.profile !== syncedProfile) {
    setSyncedProfile(profile.profile);
    if (profile.profile) {
      setProfileDraft({
        farmName: profile.profile.farmName,
        farmerName: profile.profile.farmerName,
        village: profile.profile.village,
        district: profile.profile.district,
        state: profile.profile.state,
        totalArea: profile.profile.totalArea != null ? String(profile.profile.totalArea) : '',
        areaUnit: profile.profile.areaUnit,
      });
    }
  }

  const saveProfile = async () => {
    try {
      await profile.save({
        farmName: profileDraft.farmName.trim(),
        farmerName: profileDraft.farmerName.trim(),
        village: profileDraft.village.trim(),
        district: profileDraft.district.trim(),
        state: profileDraft.state.trim(),
        totalArea: parseAmount(profileDraft.totalArea),
        areaUnit: profileDraft.areaUnit,
      });
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    }
  };

  // --- Plots ---
  const [plotModalVisible, setPlotModalVisible] = useState(false);
  const [editingPlotId, setEditingPlotId] = useState<number | null>(null);
  const [plotForm, setPlotForm] = useState<PlotFormState>(EMPTY_PLOT);
  const [plotNameError, setPlotNameError] = useState<string | undefined>();

  const openAddPlot = () => { setEditingPlotId(null); setPlotForm(EMPTY_PLOT); setPlotNameError(undefined); setPlotModalVisible(true); };
  const openEditPlot = (plot: Plot) => {
    setEditingPlotId(plot.id);
    setPlotForm({ name: plot.name, area: plot.area != null ? String(plot.area) : '', areaUnit: plot.areaUnit as PlotFormState['areaUnit'], notes: plot.notes });
    setPlotNameError(undefined);
    setPlotModalVisible(true);
  };
  const savePlot = async () => {
    const name = plotForm.name.trim();
    if (!name) { setPlotNameError(t.requiredField); return; }
    const input = { name, area: parseAmount(plotForm.area), areaUnit: plotForm.areaUnit, notes: plotForm.notes.trim() };
    try {
      if (editingPlotId === null) await plots.add(input); else await plots.update(editingPlotId, input);
      setPlotModalVisible(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    }
  };

  // --- Crops ---
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [editingCropId, setEditingCropId] = useState<number | null>(null);
  const [cropForm, setCropForm] = useState<CropFormState>(EMPTY_CROP);
  const [cropErrors, setCropErrors] = useState<{ cropName?: string; sowingDate?: string; expectedHarvestDate?: string }>({});

  const openAddCrop = () => { setEditingCropId(null); setCropForm(EMPTY_CROP); setCropErrors({}); setCropModalVisible(true); };
  const openEditCrop = (crop: Crop) => {
    setEditingCropId(crop.id);
    setCropForm({
      cropName: crop.cropName, season: crop.season as CropFormState['season'], plotId: crop.plotId,
      sowingDate: crop.sowingDate, expectedHarvestDate: crop.expectedHarvestDate ?? '',
    });
    setCropErrors({});
    setCropModalVisible(true);
  };
  const saveCrop = async () => {
    const cropName = cropForm.cropName.trim();
    const errors: typeof cropErrors = {};
    if (!cropName) errors.cropName = t.requiredField;
    if (!isValidDateString(cropForm.sowingDate)) errors.sowingDate = t.invalidDate;
    if (cropForm.expectedHarvestDate && !isValidDateString(cropForm.expectedHarvestDate)) errors.expectedHarvestDate = t.invalidDate;
    if (Object.keys(errors).length) { setCropErrors(errors); return; }
    const input = {
      cropName, season: cropForm.season, plotId: cropForm.plotId, sowingDate: cropForm.sowingDate,
      expectedHarvestDate: cropForm.expectedHarvestDate || null,
    };
    try {
      if (editingCropId === null) await crops.add(input); else await crops.update(editingCropId, input);
      setCropModalVisible(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <>
      <Text style={[shared.pageTitle, lg && shared.pageTitleLg]}>{t.myFarm}</Text>
      <SegmentedTabs
        options={[
          { key: 'profile', label: t.profileTab },
          { key: 'plots', label: t.plotsTab },
          { key: 'crops', label: t.cropsTab },
        ]}
        value={section}
        onChange={setSection}
      />

      {section === 'profile' && (
        profile.loading ? <ActivityIndicator /> : (
          <>
            <Text style={shared.pageSubtitle}>{t.profileIntro}</Text>
            <FormField label={t.farmName} value={profileDraft.farmName} onChangeText={v => setProfileDraft({ ...profileDraft, farmName: v })} placeholder={t.farmNamePlaceholder} />
            <FormField label={t.farmerName} value={profileDraft.farmerName} onChangeText={v => setProfileDraft({ ...profileDraft, farmerName: v })} placeholder={t.farmerNamePlaceholder} />
            <FormField label={t.village} value={profileDraft.village} onChangeText={v => setProfileDraft({ ...profileDraft, village: v })} placeholder={t.villagePlaceholder} />
            <FormField label={t.district} value={profileDraft.district} onChangeText={v => setProfileDraft({ ...profileDraft, district: v })} placeholder={t.districtPlaceholder} />
            <FormField label={t.stateField} value={profileDraft.state} onChangeText={v => setProfileDraft({ ...profileDraft, state: v })} placeholder={t.statePlaceholder} />
            <FormField label={t.totalArea} value={profileDraft.totalArea} onChangeText={v => setProfileDraft({ ...profileDraft, totalArea: v })} placeholder="e.g. 5" keyboardType="decimal-pad" />
            <Text style={shared.fieldLabel}>{t.unit}</Text>
            <ChipRow
              options={areaUnits.map(u => areaUnitLabels[language][u])}
              value={areaUnitLabel(language, profileDraft.areaUnit)}
              onChange={label => {
                const unit = areaUnits.find(u => areaUnitLabels[language][u] === label) ?? profileDraft.areaUnit;
                setProfileDraft({ ...profileDraft, areaUnit: unit });
              }}
            />
            <PrimaryButton label={t.save} onPress={saveProfile} />
          </>
        )
      )}

      {section === 'plots' && (
        <>
          <PrimaryButton label={`＋ ${t.addPlot}`} onPress={openAddPlot} />
          {plots.loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : plots.items.length ? (
            <GridList
              items={plots.items}
              gridColumns={gridColumns}
              cardWidth={cardWidth}
              renderItem={plot => (
                <ListCard
                  icon="🧭"
                  title={plot.name}
                  meta={plot.area != null ? `${plot.area} ${areaUnitLabel(language, plot.areaUnit)}` : areaUnitLabel(language, plot.areaUnit)}
                  note={plot.notes}
                  onPress={() => openEditPlot(plot)}
                  onDelete={() => onDeletePlotConfirm(plot)}
                  lg={lg}
                />
              )}
            />
          ) : <EmptyState title={t.noPlotsYet} detail={t.addFirstPlot} lg={lg} />}
        </>
      )}

      {section === 'crops' && (
        <>
          <PrimaryButton label={`＋ ${t.addCrop}`} onPress={openAddCrop} />
          {crops.loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : crops.items.length ? (
            <GridList
              items={crops.items}
              gridColumns={gridColumns}
              cardWidth={cardWidth}
              renderItem={crop => (
                <ListCard
                  icon="🌱"
                  title={crop.cropName}
                  meta={`${seasonLabel(language, crop.season)} · ${plots.items.find(p => p.id === crop.plotId)?.name ?? t.noPlotLinked}`}
                  note={crop.expectedHarvestDate ? `${t.expectedHarvestDate}: ${crop.expectedHarvestDate}` : undefined}
                  onPress={() => openEditCrop(crop)}
                  onDelete={() => onDeleteCropConfirm(crop)}
                  lg={lg}
                />
              )}
            />
          ) : <EmptyState title={t.noCropsYet} detail={t.addFirstCrop} lg={lg} />}
        </>
      )}

      <PlotFormModal
        visible={plotModalVisible}
        isMobile={isMobile}
        isEdit={editingPlotId !== null}
        t={t}
        language={language}
        state={plotForm}
        onChange={setPlotForm}
        onSave={savePlot}
        onClose={() => setPlotModalVisible(false)}
        nameError={plotNameError}
      />
      <CropFormModal
        visible={cropModalVisible}
        isMobile={isMobile}
        isEdit={editingCropId !== null}
        t={t}
        language={language}
        state={cropForm}
        plots={plots.items}
        onChange={setCropForm}
        onSave={saveCrop}
        onClose={() => setCropModalVisible(false)}
        errors={cropErrors}
      />
    </>
  );
}

type ProfileDraftParsed = {
  farmName: string; farmerName: string; village: string; district: string; state: string;
  totalArea: number | null; areaUnit: string;
};
