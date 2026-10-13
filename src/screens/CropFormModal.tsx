import React from 'react';
import { Text } from 'react-native';
import { ChipRow } from '../components/ChipRow';
import { PrimaryButton } from '../components/Buttons';
import { DateField } from '../components/DateField';
import { FormField } from '../components/FormField';
import { FormModal } from '../components/FormModal';
import { Plot } from '../db/schema';
import { Copy, Language } from '../i18n/copy';
import { Season, seasons, seasonLabels } from '../i18n/vocab';
import { shared } from '../styles/shared';

export type CropFormState = {
  cropName: string;
  season: Season;
  plotId: number | null;
  sowingDate: string;
  expectedHarvestDate: string;
};

export function CropFormModal({
  visible, isMobile, isEdit, t, language, state, plots, onChange, onSave, onClose, errors,
}: {
  visible: boolean;
  isMobile: boolean;
  isEdit: boolean;
  t: Copy;
  language: Language;
  state: CropFormState;
  plots: Plot[];
  onChange: (next: CropFormState) => void;
  onSave: () => void;
  onClose: () => void;
  errors: { cropName?: string; sowingDate?: string; expectedHarvestDate?: string };
}) {
  const plotOptions = [t.noneOption, ...plots.map(p => p.name)];
  const selectedPlotLabel = state.plotId === null ? t.noneOption : (plots.find(p => p.id === state.plotId)?.name ?? t.noneOption);

  return (
    <FormModal visible={visible} title={isEdit ? t.editCrop : t.addCrop} isMobile={isMobile} onClose={onClose}>
      <FormField label={t.cropName} value={state.cropName} onChangeText={cropName => onChange({ ...state, cropName })} placeholder={t.cropNamePlaceholder} required error={errors.cropName} maxLength={80} />
      <Text style={shared.fieldLabel}>{t.seasonField}</Text>
      <ChipRow
        options={seasons.map(s => seasonLabels[language][s])}
        value={seasonLabels[language][state.season]}
        onChange={label => {
          const season = seasons.find(s => seasonLabels[language][s] === label) ?? state.season;
          onChange({ ...state, season });
        }}
      />
      <Text style={shared.fieldLabel}>{t.linkToPlot}</Text>
      <ChipRow
        options={plotOptions}
        value={selectedPlotLabel}
        onChange={label => {
          const plot = plots.find(p => p.name === label);
          onChange({ ...state, plotId: plot ? plot.id : null });
        }}
      />
      <DateField label={t.sowingDate} value={state.sowingDate} onChangeText={sowingDate => onChange({ ...state, sowingDate })} required error={errors.sowingDate} todayLabel={t.today} />
      <DateField label={t.expectedHarvestDate} value={state.expectedHarvestDate} onChangeText={expectedHarvestDate => onChange({ ...state, expectedHarvestDate })} error={errors.expectedHarvestDate} todayLabel={t.today} />
      <PrimaryButton label={t.save} onPress={onSave} />
    </FormModal>
  );
}
