import React from 'react';
import { Text } from 'react-native';
import { ChipRow } from '../components/ChipRow';
import { PrimaryButton } from '../components/Buttons';
import { FormField } from '../components/FormField';
import { FormModal } from '../components/FormModal';
import { Crop, Plot } from '../db/schema';
import { Copy } from '../i18n/copy';
import { shared } from '../styles/shared';

const CATEGORIES = ['General', 'Sowing', 'Irrigation', 'Labour', 'Inputs', 'Harvest'];

export function ActivityFormModal({
  visible, isMobile, isEdit, t, title, category, note, plotId, cropId, plots, crops,
  onTitleChange, onCategoryChange, onNoteChange, onPlotChange, onCropChange, onSave, onClose,
}: {
  visible: boolean;
  isMobile: boolean;
  isEdit: boolean;
  t: Copy;
  title: string;
  category: string;
  note: string;
  plotId: number | null;
  cropId: number | null;
  plots: Plot[];
  crops: Crop[];
  onTitleChange: (next: string) => void;
  onCategoryChange: (next: string) => void;
  onNoteChange: (next: string) => void;
  onPlotChange: (next: number | null) => void;
  onCropChange: (next: number | null) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const plotOptions = [t.noneOption, ...plots.map(p => p.name)];
  const selectedPlotLabel = plotId === null ? t.noneOption : (plots.find(p => p.id === plotId)?.name ?? t.noneOption);
  const cropOptions = [t.noneOption, ...crops.map(c => c.cropName)];
  const selectedCropLabel = cropId === null ? t.noneOption : (crops.find(c => c.id === cropId)?.cropName ?? t.noneOption);

  return (
    <FormModal visible={visible} title={isEdit ? t.editActivity : t.addActivity} isMobile={isMobile} onClose={onClose}>
      <FormField label={t.activityTitle} value={title} onChangeText={onTitleChange} placeholder={t.activityPlaceholder} required maxLength={120} />
      <Text style={shared.fieldLabel}>{t.category}</Text>
      <ChipRow options={CATEGORIES} value={category} onChange={onCategoryChange} />
      {plots.length > 0 && (
        <>
          <Text style={shared.fieldLabel}>{t.linkToPlot}</Text>
          <ChipRow
            options={plotOptions}
            value={selectedPlotLabel}
            onChange={label => {
              const plot = plots.find(p => p.name === label);
              onPlotChange(plot ? plot.id : null);
            }}
          />
        </>
      )}
      {crops.length > 0 && (
        <>
          <Text style={shared.fieldLabel}>{t.linkToCrop}</Text>
          <ChipRow
            options={cropOptions}
            value={selectedCropLabel}
            onChange={label => {
              const crop = crops.find(c => c.cropName === label);
              onCropChange(crop ? crop.id : null);
            }}
          />
        </>
      )}
      <FormField label={t.notes} value={note} onChangeText={onNoteChange} placeholder={t.notesPlaceholder} multiline maxLength={1000} />
      <PrimaryButton label={t.saveActivity} onPress={onSave} />
      <Text style={shared.localNote}>{t.localNote}</Text>
    </FormModal>
  );
}
