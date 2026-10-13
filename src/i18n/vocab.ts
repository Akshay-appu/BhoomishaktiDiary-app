import { Language } from './copy';

// Stored DB values are always the English key (e.g. 'acres', 'kharif') so
// data stays language-independent; only the displayed label is translated.

export type AreaUnit = 'acres' | 'hectares' | 'guntas';
export const areaUnits: AreaUnit[] = ['acres', 'hectares', 'guntas'];
export const areaUnitLabels: Record<Language, Record<AreaUnit, string>> = {
  en: { acres: 'Acres', hectares: 'Hectares', guntas: 'Guntas' },
  kn: { acres: 'ಎಕರೆ', hectares: 'ಹೆಕ್ಟೇರ್', guntas: 'ಗುಂಟೆ' },
  hi: { acres: 'एकड़', hectares: 'हेक्टेयर', guntas: 'गुंटा' },
};

export type QuantityUnit = 'kg' | 'quintal' | 'tonnes' | 'bags';
export const quantityUnits: QuantityUnit[] = ['kg', 'quintal', 'tonnes', 'bags'];
export const quantityUnitLabels: Record<Language, Record<QuantityUnit, string>> = {
  en: { kg: 'Kg', quintal: 'Quintal', tonnes: 'Tonnes', bags: 'Bags' },
  kn: { kg: 'ಕೆ.ಜಿ.', quintal: 'ಕ್ವಿಂಟಲ್', tonnes: 'ಟನ್', bags: 'ಚೀಲ' },
  hi: { kg: 'किलो', quintal: 'क्विंटल', tonnes: 'टन', bags: 'बोरी' },
};

export type Season = 'kharif' | 'rabi' | 'zaid' | 'perennial';
export const seasons: Season[] = ['kharif', 'rabi', 'zaid', 'perennial'];
export const seasonLabels: Record<Language, Record<Season, string>> = {
  en: { kharif: 'Kharif', rabi: 'Rabi', zaid: 'Zaid', perennial: 'Perennial' },
  kn: { kharif: 'ಮುಂಗಾರು', rabi: 'ಹಿಂಗಾರು', zaid: 'ಬೇಸಿಗೆ', perennial: 'ವರ್ಷಪೂರ್ತಿ' },
  hi: { kharif: 'खरीफ', rabi: 'रबी', zaid: 'जायद', perennial: 'बारहमासी' },
};

export type ExpenseCategory = 'seeds' | 'fertilizer' | 'pesticide' | 'labour' | 'equipment' | 'irrigation' | 'other';
export const expenseCategories: ExpenseCategory[] = ['seeds', 'fertilizer', 'pesticide', 'labour', 'equipment', 'irrigation', 'other'];
export const expenseCategoryLabels: Record<Language, Record<ExpenseCategory, string>> = {
  en: { seeds: 'Seeds', fertilizer: 'Fertilizer', pesticide: 'Pesticide', labour: 'Labour', equipment: 'Equipment', irrigation: 'Irrigation', other: 'Other' },
  kn: { seeds: 'ಬೀಜಗಳು', fertilizer: 'ಗೊಬ್ಬರ', pesticide: 'ಕೀಟನಾಶಕ', labour: 'ಕೂಲಿ', equipment: 'ಉಪಕರಣ', irrigation: 'ನೀರಾವರಿ', other: 'ಇತರೆ' },
  hi: { seeds: 'बीज', fertilizer: 'खाद', pesticide: 'कीटनाशक', labour: 'मज़दूरी', equipment: 'उपकरण', irrigation: 'सिंचाई', other: 'अन्य' },
};

export type IncomeCategory = 'produceSale' | 'subsidy' | 'other';
export const incomeCategories: IncomeCategory[] = ['produceSale', 'subsidy', 'other'];
export const incomeCategoryLabels: Record<Language, Record<IncomeCategory, string>> = {
  en: { produceSale: 'Produce sale', subsidy: 'Subsidy', other: 'Other' },
  kn: { produceSale: 'ಬೆಳೆ ಮಾರಾಟ', subsidy: 'ಸಹಾಯಧನ', other: 'ಇತರೆ' },
  hi: { produceSale: 'उपज बिक्री', subsidy: 'सब्सिडी', other: 'अन्य' },
};

// DB columns store these as plain TEXT, so a stored value might in principle
// not match the known vocab (e.g. data edited outside the app). These lookups
// fall back to the raw stored string instead of crashing on an unknown key.
export function areaUnitLabel(language: Language, unit: string): string {
  return areaUnitLabels[language][unit as AreaUnit] ?? unit;
}
export function quantityUnitLabel(language: Language, unit: string): string {
  return quantityUnitLabels[language][unit as QuantityUnit] ?? unit;
}
export function seasonLabel(language: Language, season: string): string {
  return seasonLabels[language][season as Season] ?? season;
}
export function expenseCategoryLabel(language: Language, category: string): string {
  return expenseCategoryLabels[language][category as ExpenseCategory] ?? category;
}
export function incomeCategoryLabel(language: Language, category: string): string {
  return incomeCategoryLabels[language][category as IncomeCategory] ?? category;
}
