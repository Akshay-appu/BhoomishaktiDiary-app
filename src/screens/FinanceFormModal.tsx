import React from 'react';
import { Text } from 'react-native';
import { ChipRow } from '../components/ChipRow';
import { PrimaryButton } from '../components/Buttons';
import { DateField } from '../components/DateField';
import { FormField } from '../components/FormField';
import { FormModal } from '../components/FormModal';
import { FinanceType } from '../db/schema';
import { Copy, Language } from '../i18n/copy';
import {
  expenseCategories, expenseCategoryLabel, incomeCategories, incomeCategoryLabel,
} from '../i18n/vocab';
import { shared } from '../styles/shared';

export type FinanceFormState = { type: FinanceType; amount: string; category: string; date: string; notes: string };

export function FinanceFormModal({
  visible, isMobile, isEdit, t, language, state, onChange, onSave, onClose, errors,
}: {
  visible: boolean;
  isMobile: boolean;
  isEdit: boolean;
  t: Copy;
  language: Language;
  state: FinanceFormState;
  onChange: (next: FinanceFormState) => void;
  onSave: () => void;
  onClose: () => void;
  errors: { amount?: string; date?: string };
}) {
  const categoryLabel = state.type === 'expense' ? expenseCategoryLabel : incomeCategoryLabel;
  const categoryKeys: string[] = state.type === 'expense' ? expenseCategories : incomeCategories;
  const categoryLabelOptions = categoryKeys.map(key => categoryLabel(language, key));
  const selectedCategoryLabel = categoryLabel(language, state.category);

  const title = isEdit
    ? (state.type === 'expense' ? t.editExpense : t.editIncome)
    : (state.type === 'expense' ? t.addExpense : t.addIncome);

  return (
    <FormModal visible={visible} title={title} isMobile={isMobile} onClose={onClose}>
      {!isEdit && (
        <ChipRow
          options={[t.expenses, t.income]}
          value={state.type === 'expense' ? t.expenses : t.income}
          onChange={label => {
            const type: FinanceType = label === t.expenses ? 'expense' : 'income';
            const nextCategories: string[] = type === 'expense' ? expenseCategories : incomeCategories;
            onChange({ ...state, type, category: nextCategories[0] });
          }}
        />
      )}
      <FormField
        label={t.amount} value={state.amount} onChangeText={amount => onChange({ ...state, amount })}
        placeholder={t.amountPlaceholder} keyboardType="decimal-pad" required error={errors.amount}
      />
      <Text style={shared.fieldLabel}>{t.financeCategory}</Text>
      <ChipRow
        options={categoryLabelOptions}
        value={selectedCategoryLabel}
        onChange={label => {
          const found = categoryKeys.find(c => categoryLabel(language, c) === label);
          if (found) onChange({ ...state, category: found });
        }}
      />
      <DateField label={t.financeDate} value={state.date} onChangeText={date => onChange({ ...state, date })} required error={errors.date} todayLabel={t.today} />
      <FormField label={t.notes} value={state.notes} onChangeText={notes => onChange({ ...state, notes })} placeholder={t.notesPlaceholder} multiline maxLength={500} />
      <PrimaryButton label={t.save} onPress={onSave} />
    </FormModal>
  );
}
