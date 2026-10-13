import React from 'react';
import { Text } from 'react-native';
import { ChipRow } from '../components/ChipRow';
import { PrimaryButton } from '../components/Buttons';
import { FormField } from '../components/FormField';
import { FormModal } from '../components/FormModal';
import { Copy, Language } from '../i18n/copy';
import { AreaUnit, areaUnits, areaUnitLabels } from '../i18n/vocab';
import { shared } from '../styles/shared';

export type PlotFormState = { name: string; area: string; areaUnit: AreaUnit; notes: string };

export function PlotFormModal({
  visible, isMobile, isEdit, t, language, state, onChange, onSave, onClose, nameError,
}: {
  visible: boolean;
  isMobile: boolean;
  isEdit: boolean;
  t: Copy;
  language: Language;
  state: PlotFormState;
  onChange: (next: PlotFormState) => void;
  onSave: () => void;
  onClose: () => void;
  nameError?: string;
}) {
  return (
    <FormModal visible={visible} title={isEdit ? t.editPlot : t.addPlot} isMobile={isMobile} onClose={onClose}>
      <FormField label={t.plotName} value={state.name} onChangeText={name => onChange({ ...state, name })} placeholder={t.plotNamePlaceholder} required error={nameError} maxLength={80} />
      <FormField label={t.plotArea} value={state.area} onChangeText={area => onChange({ ...state, area })} placeholder="e.g. 2.5" keyboardType="decimal-pad" />
      <Text style={shared.fieldLabel}>{t.unit}</Text>
      <ChipRow
        options={areaUnits.map(u => areaUnitLabels[language][u])}
        value={areaUnitLabels[language][state.areaUnit]}
        onChange={label => {
          const unit = areaUnits.find(u => areaUnitLabels[language][u] === label) ?? state.areaUnit;
          onChange({ ...state, areaUnit: unit });
        }}
      />
      <FormField label={t.notes} value={state.notes} onChangeText={notes => onChange({ ...state, notes })} placeholder={t.notesPlaceholder} multiline maxLength={500} />
      <PrimaryButton label={t.save} onPress={onSave} />
    </FormModal>
  );
}
