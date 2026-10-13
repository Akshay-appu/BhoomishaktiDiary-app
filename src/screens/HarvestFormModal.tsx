import React from 'react';
import { Text } from 'react-native';
import { ChipRow } from '../components/ChipRow';
import { PrimaryButton } from '../components/Buttons';
import { DateField } from '../components/DateField';
import { FormField } from '../components/FormField';
import { FormModal } from '../components/FormModal';
import { Crop, Plot } from '../db/schema';
import { Copy, Language } from '../i18n/copy';
import { QuantityUnit, quantityUnitLabel, quantityUnits } from '../i18n/vocab';
import { shared } from '../styles/shared';

export type HarvestFormState = {
  cropId: number | null;
  plotId: number | null;
  harvestDate: string;
  quantity: string;
  quantityUnit: QuantityUnit;
  sellingPrice: string;
  buyer: string;
  notes: string;
};

export function HarvestFormModal({
  visible, isMobile, isEdit, t, language, state, crops, plots, onChange, onSave, onClose, errors,
}: {
  visible: boolean;
  isMobile: boolean;
  isEdit: boolean;
  t: Copy;
  language: Language;
  state: HarvestFormState;
  crops: Crop[];
  plots: Plot[];
  onChange: (next: HarvestFormState) => void;
  onSave: () => void;
  onClose: () => void;
  errors: { quantity?: string; harvestDate?: string };
}) {
  const cropOptions = [t.noneOption, ...crops.map(c => c.cropName)];
  const selectedCropLabel = state.cropId === null ? t.noneOption : (crops.find(c => c.id === state.cropId)?.cropName ?? t.noneOption);
  const plotOptions = [t.noneOption, ...plots.map(p => p.name)];
  const selectedPlotLabel = state.plotId === null ? t.noneOption : (plots.find(p => p.id === state.plotId)?.name ?? t.noneOption);

  return (
    <FormModal visible={visible} title={isEdit ? t.editHarvest : t.addHarvest} isMobile={isMobile} onClose={onClose}>
      <Text style={shared.fieldLabel}>{t.linkToCrop}</Text>
      <ChipRow
        options={cropOptions}
        value={selectedCropLabel}
        onChange={label => {
          const crop = crops.find(c => c.cropName === label);
          onChange({ ...state, cropId: crop ? crop.id : null });
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
      <DateField label={t.harvestDate} value={state.harvestDate} onChangeText={harvestDate => onChange({ ...state, harvestDate })} required error={errors.harvestDate} todayLabel={t.today} />
      <FormField label={t.quantity} value={state.quantity} onChangeText={quantity => onChange({ ...state, quantity })} placeholder="e.g. 12" keyboardType="decimal-pad" required error={errors.quantity} />
      <Text style={shared.fieldLabel}>{t.unit}</Text>
      <ChipRow
        options={quantityUnits.map(u => quantityUnitLabel(language, u))}
        value={quantityUnitLabel(language, state.quantityUnit)}
        onChange={label => {
          const unit = quantityUnits.find(u => quantityUnitLabel(language, u) === label) ?? state.quantityUnit;
          onChange({ ...state, quantityUnit: unit });
        }}
      />
      <FormField label={t.sellingPrice} value={state.sellingPrice} onChangeText={sellingPrice => onChange({ ...state, sellingPrice })} placeholder={t.amountPlaceholder} keyboardType="decimal-pad" />
      <FormField label={t.buyer} value={state.buyer} onChangeText={buyer => onChange({ ...state, buyer })} />
      <FormField label={t.notes} value={state.notes} onChangeText={notes => onChange({ ...state, notes })} placeholder={t.notesPlaceholder} multiline maxLength={500} />
      <PrimaryButton label={t.save} onPress={onSave} />
    </FormModal>
  );
}
