export type Language = 'en' | 'kn' | 'hi';

export const languages: Record<Language, string> = {
  en: 'English',
  kn: 'ಕನ್ನಡ',
  hi: 'हिन्दी',
};

export type Copy = {
  tagline: string; greeting: string; intro: string; addActivity: string;
  activities: string; plots: string; season: string; recentActivities: string;
  viewAll: string; noActivities: string; startDiary: string; farmerTools: string;
  toolsComingSoon: string; diary: string; diarySubtitle: string; home: string;
  farm: string; records: string; more: string; myFarm: string;
  settingsSubtitle: string; language: string;
  privacyTitle: string; privacyText: string; activityTitle: string;
  activityPlaceholder: string; category: string; notes: string; notesPlaceholder: string;
  saveActivity: string; localNote: string; requiredTitle: string; enterActivity: string;
  deleteEntry: string; deleteConfirm: string; cancel: string; delete: string;

  // Shared form chrome
  save: string; today: string; invalidDate: string; requiredField: string;
  deleteConfirmGeneric: string; editActivity: string; noneOption: string;

  // Farm screen: Profile / Plots / Crops
  profileTab: string; plotsTab: string; cropsTab: string;
  farmName: string; farmNamePlaceholder: string;
  farmerName: string; farmerNamePlaceholder: string;
  village: string; villagePlaceholder: string;
  district: string; districtPlaceholder: string;
  stateField: string; statePlaceholder: string;
  totalArea: string; unit: string; profileIntro: string;

  addPlot: string; editPlot: string; plotName: string; plotNamePlaceholder: string;
  plotArea: string; noPlotsYet: string; addFirstPlot: string; deletePlot: string; noPlotLinked: string;

  addCrop: string; editCrop: string; cropName: string; cropNamePlaceholder: string;
  seasonField: string; linkToPlot: string; linkToCrop: string; sowingDate: string; expectedHarvestDate: string;
  noCropsYet: string; addFirstCrop: string; deleteCrop: string; noCropLinked: string;

  // Finance
  expenses: string; income: string; addExpense: string; addIncome: string;
  editExpense: string; editIncome: string; amount: string; amountPlaceholder: string;
  financeCategory: string; financeDate: string; invalidAmount: string;
  noExpensesYet: string; addFirstExpense: string; noIncomeYet: string; addFirstIncome: string;
  deleteExpense: string; deleteIncome: string;
  totalExpenses: string; totalIncome: string; netBalance: string; netBalanceNote: string;

  // Harvest
  harvests: string; addHarvest: string; editHarvest: string; harvestDate: string; quantity: string;
  sellingPrice: string; buyer: string; noHarvestsYet: string; addFirstHarvest: string; deleteHarvest: string;
  totalValue: string; valueNotRecorded: string;

  // Records
  recordsOverviewTab: string; financeTab: string; harvestsTab: string;
  totalActivities: string; seasonalHistory: string; noDataYet: string;

  // Backup & restore
  backupRestore: string; exportData: string; exportDescription: string;
  shareBackup: string; copyToClipboard: string; copied: string;
  restoreData: string; restoreDescription: string; pasteBackupPlaceholder: string;
  previewRestore: string; restoreWarningTitle: string; replaceDataWarning: string;
  recordsFoundInBackup: string; currentRecordsOnDevice: string;
  invalidBackupFile: string; restoreSuccess: string; confirmRestore: string;

  // Account / authentication
  account: string; accountIntro: string; signedInAs: string; signOut: string;
  signIn: string; createAccount: string; emailField: string; emailPlaceholder: string;
  passwordField: string; passwordPlaceholder: string; forgotPassword: string;
  resetPasswordSent: string; orDivider: string; continueWithGoogle: string;
  switchToSignIn: string; switchToSignUp: string; cloudSyncNotConfigured: string;
  authErrorInvalidEmail: string; authErrorEmailInUse: string; authErrorWeakPassword: string;
  authErrorWrongCredentials: string; authErrorTooManyRequests: string; authErrorNetwork: string;
  authErrorPopupClosed: string; authErrorGeneric: string; authErrorGoogleNeedsDevBuild: string;

  // Claiming pre-existing local data on first sign-in
  claimLocalDataTitle: string; claimLocalDataMessage: string;
  claimLocalDataConfirm: string; claimLocalDataSkip: string;

  // Sync status
  syncNow: string; syncing: string; syncSuccess: string; syncError: string;
  lastSynced: string; neverSynced: string; syncDescription: string;

  // Account deletion
  deleteAccount: string; deleteAccountIntro: string; deleteAccountWarning: string;
  deleteAccountExportFirst: string; deleteAccountExportButton: string;
  deleteAccountPasswordPrompt: string; deleteAccountConfirmField: string;
  deleteAccountConfirmButton: string; deleteAccountCancel: string;
  deleteAccountStepReauth: string; deleteAccountStepCloud: string;
  deleteAccountStepLocal: string; deleteAccountStepAuth: string;
  deleteAccountSuccess: string; deleteAccountPartialFailure: string;
  deleteAccountNeedsPassword: string; deleteAccountGoogleNativeUnsupported: string; deleteAccountDone: string;
  deleteAccountExported: string; deleteAccountStepWaitingSync: string; deleteAccountSyncBusy: string;
  deleteAccountStepLock: string;
};

export const copy: Record<Language, Copy> = {
  en: {
    tagline: "Every Farm's Story, All in One Diary",
    greeting: 'Your farm, your story.',
    intro: 'Keep your daily farm activities, expenses and season records together.',
    addActivity: 'Add Activity', activities: 'Activities', plots: 'Plots', season: 'Current season',
    recentActivities: 'Recent activities', viewAll: 'View all', noActivities: 'No activities yet',
    startDiary: 'Add your first farm activity to start your diary.', farmerTools: 'Farmer tools',
    toolsComingSoon: 'Weather advice, land conversion and farm profit planning will be connected in a later phase.',
    diary: 'Farm Diary', diarySubtitle: 'A simple record of the work happening on your farm.',
    home: 'Home', farm: 'Farm', records: 'Records', more: 'More', myFarm: 'My Farm',
    settingsSubtitle: 'Language and app preferences', language: 'App language',
    privacyTitle: 'Your data, your control', privacyText: 'Diary entries are always stored on this device first and work fully offline. Signing in is optional and only backs up your records to your own account.',
    activityTitle: 'Activity name', activityPlaceholder: 'e.g. Watered soybean plot',
    category: 'Activity type', notes: 'Notes (optional)', notesPlaceholder: 'Quantity, cost or other details…',
    saveActivity: 'Save activity', localNote: 'Saved on this device, and backed up to your account if you are signed in.',
    requiredTitle: 'Activity required', enterActivity: 'Enter an activity name to continue.',
    deleteEntry: 'Delete activity?', deleteConfirm: 'This activity will be removed from this device.',
    cancel: 'Cancel', delete: 'Delete',

    save: 'Save', today: 'Today', invalidDate: 'Enter a valid date as YYYY-MM-DD.',
    requiredField: 'This field is required.',
    deleteConfirmGeneric: 'This record will be removed from this device.',
    editActivity: 'Edit Activity', noneOption: 'None',

    profileTab: 'Profile', plotsTab: 'Plots', cropsTab: 'Crops',
    farmName: 'Farm name', farmNamePlaceholder: 'e.g. Green Valley Farm',
    farmerName: 'Farmer name', farmerNamePlaceholder: 'e.g. Ramesh Kumar',
    village: 'Village', villagePlaceholder: 'e.g. Hosahalli',
    district: 'District', districtPlaceholder: 'e.g. Mysuru',
    stateField: 'State', statePlaceholder: 'e.g. Karnataka',
    totalArea: 'Total land area', unit: 'Unit',
    profileIntro: 'This information stays on this device and helps personalize your diary.',

    addPlot: 'Add Plot', editPlot: 'Edit Plot', plotName: 'Plot name', plotNamePlaceholder: 'e.g. North field',
    plotArea: 'Area', noPlotsYet: 'No plots yet', addFirstPlot: 'Add your first plot to start mapping your farm.',
    deletePlot: 'Delete plot?', noPlotLinked: 'No plot linked',

    addCrop: 'Add Crop', editCrop: 'Edit Crop', cropName: 'Crop name', cropNamePlaceholder: 'e.g. Soybean',
    seasonField: 'Season', linkToPlot: 'Plot (optional)', linkToCrop: 'Crop (optional)',
    sowingDate: 'Sowing date', expectedHarvestDate: 'Expected harvest date (optional)',
    noCropsYet: 'No crops yet', addFirstCrop: 'Add your first crop to start tracking a season.',
    deleteCrop: 'Delete crop?', noCropLinked: 'No crop linked',

    expenses: 'Expenses', income: 'Income', addExpense: 'Add Expense', addIncome: 'Add Income',
    editExpense: 'Edit Expense', editIncome: 'Edit Income', amount: 'Amount (₹)', amountPlaceholder: 'e.g. 1500',
    financeCategory: 'Category', financeDate: 'Date', invalidAmount: 'Enter a valid amount greater than zero.',
    noExpensesYet: 'No expenses yet', addFirstExpense: 'Add your first expense to track farm spending.',
    noIncomeYet: 'No income yet', addFirstIncome: 'Add your first income to track farm earnings.',
    deleteExpense: 'Delete expense?', deleteIncome: 'Delete income?',
    totalExpenses: 'Total expenses', totalIncome: 'Total income', netBalance: 'Net balance',
    netBalanceNote: 'Calculated from recorded expenses and income only.',

    harvests: 'Harvests', addHarvest: 'Add Harvest', editHarvest: 'Edit Harvest', harvestDate: 'Harvest date',
    quantity: 'Quantity', sellingPrice: 'Selling price per unit (optional)', buyer: 'Buyer (optional)',
    noHarvestsYet: 'No harvests yet', addFirstHarvest: 'Add your first harvest record after a crop is gathered.',
    deleteHarvest: 'Delete harvest?', totalValue: 'Total value', valueNotRecorded: 'Not recorded',

    recordsOverviewTab: 'Overview', financeTab: 'Expenses & Income', harvestsTab: 'Harvests',
    totalActivities: 'Total activities', seasonalHistory: 'Seasonal history', noDataYet: 'No data yet',

    backupRestore: 'Backup & Restore',
    exportData: 'Export backup',
    exportDescription: 'Creates a copy of all your farm data as text, so you can save it somewhere safe or move it to another device.',
    shareBackup: 'Share backup', copyToClipboard: 'Copy to clipboard', copied: 'Copied to clipboard.',
    restoreData: 'Restore from backup',
    restoreDescription: 'Paste a previously exported backup below to preview it before restoring.',
    pasteBackupPlaceholder: 'Paste backup text here…',
    previewRestore: 'Preview restore',
    restoreWarningTitle: 'Replace all data?',
    replaceDataWarning: 'This will permanently replace all existing data on this device with the contents of this backup. This cannot be undone.',
    recordsFoundInBackup: 'Records found in backup', currentRecordsOnDevice: 'Current records on this device',
    invalidBackupFile: "This doesn't look like a valid BhoomiShakti backup.", restoreSuccess: 'Data restored successfully.',
    confirmRestore: 'Replace and restore',

    account: 'Account', accountIntro: 'Sign in to back up your farm data to the cloud and use it on another device. The app keeps working offline either way.',
    signedInAs: 'Signed in as', signOut: 'Sign out',
    signIn: 'Sign in', createAccount: 'Create account', emailField: 'Email', emailPlaceholder: 'you@example.com',
    passwordField: 'Password', passwordPlaceholder: 'At least 6 characters', forgotPassword: 'Forgot password?',
    resetPasswordSent: 'If an account exists for this email, a reset link has been sent.',
    orDivider: 'or', continueWithGoogle: 'Continue with Google',
    switchToSignIn: 'Already have an account? Sign in', switchToSignUp: "Don't have an account? Create one",
    cloudSyncNotConfigured: 'Cloud sync is not set up for this app yet.',
    authErrorInvalidEmail: 'Enter a valid email address.',
    authErrorEmailInUse: 'An account with this email already exists. Try signing in instead.',
    authErrorWeakPassword: 'Choose a password with at least 6 characters.',
    authErrorWrongCredentials: 'Incorrect email or password.',
    authErrorTooManyRequests: 'Too many attempts. Please wait a bit and try again.',
    authErrorNetwork: 'Network error. Check your connection and try again.',
    authErrorPopupClosed: 'Sign-in was cancelled.',
    authErrorGeneric: 'Something went wrong. Please try again.',
    authErrorGoogleNeedsDevBuild: 'Google sign-in on this device needs a development build of the app, not Expo Go. It works on the web version right now.',

    claimLocalDataTitle: 'Use your existing data?',
    claimLocalDataMessage: 'You have farm records saved on this device from before signing in. Add them to your account so they back up to the cloud?',
    claimLocalDataConfirm: 'Yes, use this data', claimLocalDataSkip: 'No, start fresh',

    syncNow: 'Sync now', syncing: 'Syncing…', syncSuccess: 'Up to date', syncError: 'Sync failed, will retry',
    lastSynced: 'Last synced', neverSynced: 'Never synced',
    syncDescription: 'Your farm records are backed up to your account and available if you sign in on another device.',
    deleteAccount: 'Delete Account',
    deleteAccountIntro: 'This permanently deletes your account, your cloud backup, and this device\'s copy of your farm data. It cannot be undone.',
    deleteAccountWarning: 'We recommend exporting a backup before you continue.',
    deleteAccountExportFirst: 'Export a backup first',
    deleteAccountExportButton: 'Export backup',
    deleteAccountPasswordPrompt: 'Enter your password to confirm.',
    deleteAccountConfirmField: 'Current password',
    deleteAccountConfirmButton: 'Permanently delete my account',
    deleteAccountCancel: 'Cancel',
    deleteAccountStepReauth: 'Confirming your identity…',
    deleteAccountStepCloud: 'Deleting your cloud data…',
    deleteAccountStepLocal: 'Removing data from this device…',
    deleteAccountStepAuth: 'Deleting your account…',
    deleteAccountSuccess: 'Your account and data have been deleted.',
    deleteAccountPartialFailure: 'Some steps did not complete. It is safe to try again — nothing already deleted will be duplicated or lost.',
    deleteAccountNeedsPassword: 'Enter your password to continue.',
    deleteAccountGoogleNativeUnsupported: 'Deleting a Google-signed-in account from this device isn\'t supported yet. Please use the web app to delete this account.',
    deleteAccountDone: 'Done',
    deleteAccountExported: 'Backup exported.',
    deleteAccountStepWaitingSync: 'Finishing a pending sync before continuing…',
    deleteAccountSyncBusy: 'A sync is taking longer than expected to finish. Please try again in a moment.',
    deleteAccountStepLock: 'Securing your account for deletion…',
  },
  kn: {
    tagline: 'ಪ್ರತಿ ಹೊಲದ ಕಥೆ, ಒಂದೇ ಡೈರಿಯಲ್ಲಿ',
    greeting: 'ನಿಮ್ಮ ಹೊಲ, ನಿಮ್ಮ ಕಥೆ.',
    intro: 'ನಿಮ್ಮ ದೈನಂದಿನ ಕೃಷಿ ಕೆಲಸಗಳು, ಖರ್ಚುಗಳು ಮತ್ತು ಋತುವಿನ ದಾಖಲೆಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಇಡಿ.',
    addActivity: 'ಚಟುವಟಿಕೆ ಸೇರಿಸಿ', activities: 'ಚಟುವಟಿಕೆಗಳು', plots: 'ಹೊಲದ ಭಾಗಗಳು', season: 'ಪ್ರಸ್ತುತ ಋತು',
    recentActivities: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಗಳು', viewAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ', noActivities: 'ಇನ್ನೂ ಚಟುವಟಿಕೆಗಳಿಲ್ಲ',
    startDiary: 'ನಿಮ್ಮ ಡೈರಿಯನ್ನು ಪ್ರಾರಂಭಿಸಲು ಮೊದಲ ಕೃಷಿ ಚಟುವಟಿಕೆಯನ್ನು ಸೇರಿಸಿ.', farmerTools: 'ರೈತರ ಸಾಧನಗಳು',
    toolsComingSoon: 'ಹವಾಮಾನ ಸಲಹೆ, ಭೂಮಿ ಅಳತೆ ಪರಿವರ್ತನೆ ಮತ್ತು ಲಾಭ ಯೋಜನೆ ಮುಂದಿನ ಹಂತದಲ್ಲಿ ಸೇರಿಸಲಾಗುತ್ತದೆ.',
    diary: 'ಕೃಷಿ ಡೈರಿ', diarySubtitle: 'ನಿಮ್ಮ ಹೊಲದಲ್ಲಿ ನಡೆಯುವ ಕೆಲಸಗಳ ಸರಳ ದಾಖಲೆ.',
    home: 'ಮುಖಪುಟ', farm: 'ಹೊಲ', records: 'ದಾಖಲೆಗಳು', more: 'ಇನ್ನಷ್ಟು', myFarm: 'ನನ್ನ ಹೊಲ',
    settingsSubtitle: 'ಭಾಷೆ ಮತ್ತು ಅಪ್ಲಿಕೇಶನ್ ಆದ್ಯತೆಗಳು', language: 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ',
    privacyTitle: 'ನಿಮ್ಮ ಡೇಟಾ, ನಿಮ್ಮ ನಿಯಂತ್ರಣ', privacyText: 'ಡೈರಿ ನಮೂದುಗಳು ಯಾವಾಗಲೂ ಮೊದಲು ಈ ಸಾಧನದಲ್ಲಿ ಸಂಗ್ರಹವಾಗುತ್ತವೆ ಮತ್ತು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ. ಸೈನ್ ಇನ್ ಮಾಡುವುದು ಐಚ್ಛಿಕವಾಗಿದ್ದು, ಇದು ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ನಿಮ್ಮ ಸ್ವಂತ ಖಾತೆಗೆ ಮಾತ್ರ ಬ್ಯಾಕಪ್ ಮಾಡುತ್ತದೆ.',
    activityTitle: 'ಚಟುವಟಿಕೆಯ ಹೆಸರು', activityPlaceholder: 'ಉದಾ. ಸೋಯಾಬೀನ್ ಹೊಲಕ್ಕೆ ನೀರು ಹಾಕಿದೆ',
    category: 'ಚಟುವಟಿಕೆಯ ಪ್ರಕಾರ', notes: 'ಟಿಪ್ಪಣಿಗಳು (ಐಚ್ಛಿಕ)', notesPlaceholder: 'ಪ್ರಮಾಣ, ಖರ್ಚು ಅಥವಾ ಇತರ ವಿವರಗಳು…',
    saveActivity: 'ಚಟುವಟಿಕೆ ಉಳಿಸಿ', localNote: 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗುತ್ತದೆ, ಮತ್ತು ನೀವು ಸೈನ್ ಇನ್ ಆಗಿದ್ದರೆ ನಿಮ್ಮ ಖಾತೆಗೆ ಬ್ಯಾಕಪ್ ಆಗುತ್ತದೆ.',
    requiredTitle: 'ಚಟುವಟಿಕೆ ಅಗತ್ಯ', enterActivity: 'ಮುಂದುವರಿಯಲು ಚಟುವಟಿಕೆಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',
    deleteEntry: 'ಚಟುವಟಿಕೆಯನ್ನು ಅಳಿಸಬೇಕೇ?', deleteConfirm: 'ಈ ಸಾಧನದಿಂದ ಚಟುವಟಿಕೆಯನ್ನು ತೆಗೆದುಹಾಕಲಾಗುತ್ತದೆ.',
    cancel: 'ರದ್ದುಮಾಡಿ', delete: 'ಅಳಿಸಿ',

    save: 'ಉಳಿಸಿ', today: 'ಇಂದು', invalidDate: 'ಸರಿಯಾದ ದಿನಾಂಕವನ್ನು YYYY-MM-DD ರೂಪದಲ್ಲಿ ನಮೂದಿಸಿ.',
    requiredField: 'ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ.',
    deleteConfirmGeneric: 'ಈ ದಾಖಲೆಯನ್ನು ಈ ಸಾಧನದಿಂದ ತೆಗೆದುಹಾಕಲಾಗುತ್ತದೆ.',
    editActivity: 'ಚಟುವಟಿಕೆ ಸಂಪಾದಿಸಿ', noneOption: 'ಯಾವುದೂ ಇಲ್ಲ',

    profileTab: 'ಪ್ರೊಫೈಲ್', plotsTab: 'ಹೊಲದ ಭಾಗಗಳು', cropsTab: 'ಬೆಳೆಗಳು',
    farmName: 'ಹೊಲದ ಹೆಸರು', farmNamePlaceholder: 'ಉದಾ. ಹಸಿರು ಕಣಿವೆ ಫಾರ್ಮ್',
    farmerName: 'ರೈತರ ಹೆಸರು', farmerNamePlaceholder: 'ಉದಾ. ರಮೇಶ್ ಕುಮಾರ್',
    village: 'ಗ್ರಾಮ', villagePlaceholder: 'ಉದಾ. ಹೊಸಹಳ್ಳಿ',
    district: 'ಜಿಲ್ಲೆ', districtPlaceholder: 'ಉದಾ. ಮೈಸೂರು',
    stateField: 'ರಾಜ್ಯ', statePlaceholder: 'ಉದಾ. ಕರ್ನಾಟಕ',
    totalArea: 'ಒಟ್ಟು ಭೂಮಿಯ ವಿಸ್ತೀರ್ಣ', unit: 'ಅಳತೆ ಘಟಕ',
    profileIntro: 'ಈ ಮಾಹಿತಿ ಈ ಸಾಧನದಲ್ಲೇ ಉಳಿಯುತ್ತದೆ ಮತ್ತು ನಿಮ್ಮ ಡೈರಿಯನ್ನು ವೈಯಕ್ತಿಕಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',

    addPlot: 'ಹೊಲದ ಭಾಗ ಸೇರಿಸಿ', editPlot: 'ಹೊಲದ ಭಾಗ ಸಂಪಾದಿಸಿ', plotName: 'ಭಾಗದ ಹೆಸರು', plotNamePlaceholder: 'ಉದಾ. ಉತ್ತರ ಹೊಲ',
    plotArea: 'ವಿಸ್ತೀರ್ಣ', noPlotsYet: 'ಇನ್ನೂ ಹೊಲದ ಭಾಗಗಳಿಲ್ಲ', addFirstPlot: 'ನಿಮ್ಮ ಹೊಲವನ್ನು ಗುರುತಿಸಲು ಮೊದಲ ಭಾಗವನ್ನು ಸೇರಿಸಿ.',
    deletePlot: 'ಹೊಲದ ಭಾಗವನ್ನು ಅಳಿಸಬೇಕೇ?', noPlotLinked: 'ಯಾವುದೇ ಭಾಗ ಜೋಡಿಸಿಲ್ಲ',

    addCrop: 'ಬೆಳೆ ಸೇರಿಸಿ', editCrop: 'ಬೆಳೆ ಸಂಪಾದಿಸಿ', cropName: 'ಬೆಳೆಯ ಹೆಸರು', cropNamePlaceholder: 'ಉದಾ. ಸೋಯಾಬೀನ್',
    seasonField: 'ಋತು', linkToPlot: 'ಹೊಲದ ಭಾಗ (ಐಚ್ಛಿಕ)', linkToCrop: 'ಬೆಳೆ (ಐಚ್ಛಿಕ)',
    sowingDate: 'ಬಿತ್ತನೆ ದಿನಾಂಕ', expectedHarvestDate: 'ನಿರೀಕ್ಷಿತ ಕೊಯ್ಲು ದಿನಾಂಕ (ಐಚ್ಛಿಕ)',
    noCropsYet: 'ಇನ್ನೂ ಬೆಳೆಗಳಿಲ್ಲ', addFirstCrop: 'ಋತುವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಮೊದಲ ಬೆಳೆಯನ್ನು ಸೇರಿಸಿ.',
    deleteCrop: 'ಬೆಳೆಯನ್ನು ಅಳಿಸಬೇಕೇ?', noCropLinked: 'ಯಾವುದೇ ಬೆಳೆ ಜೋಡಿಸಿಲ್ಲ',

    expenses: 'ಖರ್ಚುಗಳು', income: 'ಆದಾಯ', addExpense: 'ಖರ್ಚು ಸೇರಿಸಿ', addIncome: 'ಆದಾಯ ಸೇರಿಸಿ',
    editExpense: 'ಖರ್ಚು ಸಂಪಾದಿಸಿ', editIncome: 'ಆದಾಯ ಸಂಪಾದಿಸಿ', amount: 'ಮೊತ್ತ (₹)', amountPlaceholder: 'ಉದಾ. 1500',
    financeCategory: 'ವರ್ಗ', financeDate: 'ದಿನಾಂಕ', invalidAmount: 'ಸೊನ್ನೆಗಿಂತ ಹೆಚ್ಚಿನ ಸರಿಯಾದ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ.',
    noExpensesYet: 'ಇನ್ನೂ ಖರ್ಚುಗಳಿಲ್ಲ', addFirstExpense: 'ಹೊಲದ ಖರ್ಚನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಮೊದಲ ಖರ್ಚನ್ನು ಸೇರಿಸಿ.',
    noIncomeYet: 'ಇನ್ನೂ ಆದಾಯವಿಲ್ಲ', addFirstIncome: 'ಹೊಲದ ಆದಾಯವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಮೊದಲ ಆದಾಯವನ್ನು ಸೇರಿಸಿ.',
    deleteExpense: 'ಖರ್ಚನ್ನು ಅಳಿಸಬೇಕೇ?', deleteIncome: 'ಆದಾಯವನ್ನು ಅಳಿಸಬೇಕೇ?',
    totalExpenses: 'ಒಟ್ಟು ಖರ್ಚು', totalIncome: 'ಒಟ್ಟು ಆದಾಯ', netBalance: 'ನಿವ್ವಳ ಬ್ಯಾಲೆನ್ಸ್',
    netBalanceNote: 'ದಾಖಲಿಸಿದ ಖರ್ಚು ಮತ್ತು ಆದಾಯದಿಂದ ಮಾತ್ರ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ.',

    harvests: 'ಕೊಯ್ಲುಗಳು', addHarvest: 'ಕೊಯ್ಲು ಸೇರಿಸಿ', editHarvest: 'ಕೊಯ್ಲು ಸಂಪಾದಿಸಿ', harvestDate: 'ಕೊಯ್ಲು ದಿನಾಂಕ',
    quantity: 'ಪ್ರಮಾಣ', sellingPrice: 'ಪ್ರತಿ ಘಟಕದ ಮಾರಾಟ ಬೆಲೆ (ಐಚ್ಛಿಕ)', buyer: 'ಖರೀದಿದಾರ (ಐಚ್ಛಿಕ)',
    noHarvestsYet: 'ಇನ್ನೂ ಕೊಯ್ಲುಗಳಿಲ್ಲ', addFirstHarvest: 'ಬೆಳೆ ಕೊಯ್ಲು ಮಾಡಿದ ನಂತರ ಮೊದಲ ದಾಖಲೆಯನ್ನು ಸೇರಿಸಿ.',
    deleteHarvest: 'ಕೊಯ್ಲನ್ನು ಅಳಿಸಬೇಕೇ?', totalValue: 'ಒಟ್ಟು ಮೌಲ್ಯ', valueNotRecorded: 'ದಾಖಲಾಗಿಲ್ಲ',

    recordsOverviewTab: 'ಸಾರಾಂಶ', financeTab: 'ಖರ್ಚು ಮತ್ತು ಆದಾಯ', harvestsTab: 'ಕೊಯ್ಲುಗಳು',
    totalActivities: 'ಒಟ್ಟು ಚಟುವಟಿಕೆಗಳು', seasonalHistory: 'ಋತುವಿನ ಇತಿಹಾಸ', noDataYet: 'ಇನ್ನೂ ಡೇಟಾ ಇಲ್ಲ',

    backupRestore: 'ಬ್ಯಾಕಪ್ ಮತ್ತು ಮರುಸ್ಥಾಪನೆ',
    exportData: 'ಬ್ಯಾಕಪ್ ರಫ್ತು ಮಾಡಿ',
    exportDescription: 'ನಿಮ್ಮ ಎಲ್ಲಾ ಹೊಲದ ಡೇಟಾದ ಪ್ರತಿಯನ್ನು ಪಠ್ಯವಾಗಿ ರಚಿಸುತ್ತದೆ, ಇದರಿಂದ ನೀವು ಅದನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಸಬಹುದು ಅಥವಾ ಇನ್ನೊಂದು ಸಾಧನಕ್ಕೆ ವರ್ಗಾಯಿಸಬಹುದು.',
    shareBackup: 'ಬ್ಯಾಕಪ್ ಹಂಚಿಕೊಳ್ಳಿ', copyToClipboard: 'ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ನಕಲಿಸಿ', copied: 'ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ನಕಲಿಸಲಾಗಿದೆ.',
    restoreData: 'ಬ್ಯಾಕಪ್‌ನಿಂದ ಮರುಸ್ಥಾಪಿಸಿ',
    restoreDescription: 'ಮರುಸ್ಥಾಪಿಸುವ ಮೊದಲು ಪೂರ್ವವೀಕ್ಷಿಸಲು ಹಿಂದೆ ರಫ್ತು ಮಾಡಿದ ಬ್ಯಾಕಪ್ ಅನ್ನು ಕೆಳಗೆ ಅಂಟಿಸಿ.',
    pasteBackupPlaceholder: 'ಬ್ಯಾಕಪ್ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ…',
    previewRestore: 'ಮರುಸ್ಥಾಪನೆ ಪೂರ್ವವೀಕ್ಷಿಸಿ',
    restoreWarningTitle: 'ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ಬದಲಾಯಿಸಬೇಕೇ?',
    replaceDataWarning: 'ಇದು ಈ ಸಾಧನದಲ್ಲಿರುವ ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ಈ ಬ್ಯಾಕಪ್‌ನ ವಿಷಯಗಳೊಂದಿಗೆ ಶಾಶ್ವತವಾಗಿ ಬದಲಾಯಿಸುತ್ತದೆ. ಇದನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ.',
    recordsFoundInBackup: 'ಬ್ಯಾಕಪ್‌ನಲ್ಲಿ ಕಂಡುಬಂದ ದಾಖಲೆಗಳು', currentRecordsOnDevice: 'ಈ ಸಾಧನದಲ್ಲಿರುವ ಪ್ರಸ್ತುತ ದಾಖಲೆಗಳು',
    invalidBackupFile: 'ಇದು ಮಾನ್ಯ BhoomiShakti ಬ್ಯಾಕಪ್‌ನಂತೆ ಕಾಣುತ್ತಿಲ್ಲ.', restoreSuccess: 'ಡೇಟಾ ಯಶಸ್ವಿಯಾಗಿ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ.',
    confirmRestore: 'ಬದಲಾಯಿಸಿ ಮತ್ತು ಮರುಸ್ಥಾಪಿಸಿ',

    account: 'ಖಾತೆ', accountIntro: 'ನಿಮ್ಮ ಕೃಷಿ ಡೇಟಾವನ್ನು ಕ್ಲೌಡ್‌ಗೆ ಬ್ಯಾಕಪ್ ಮಾಡಲು ಮತ್ತು ಇನ್ನೊಂದು ಸಾಧನದಲ್ಲಿ ಬಳಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ. ಆ್ಯಪ್ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಕೂಡ ಕೆಲಸ ಮಾಡುತ್ತಲೇ ಇರುತ್ತದೆ.',
    signedInAs: 'ಸೈನ್ ಇನ್ ಆಗಿದ್ದೀರಿ', signOut: 'ಸೈನ್ ಔಟ್',
    signIn: 'ಸೈನ್ ಇನ್', createAccount: 'ಖಾತೆ ರಚಿಸಿ', emailField: 'ಇಮೇಲ್', emailPlaceholder: 'you@example.com',
    passwordField: 'ಪಾಸ್‌ವರ್ಡ್', passwordPlaceholder: 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು', forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?',
    resetPasswordSent: 'ಈ ಇಮೇಲ್‌ಗೆ ಖಾತೆ ಇದ್ದರೆ, ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ.',
    orDivider: 'ಅಥವಾ', continueWithGoogle: 'Google ಮೂಲಕ ಮುಂದುವರಿಸಿ',
    switchToSignIn: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಸೈನ್ ಇನ್ ಮಾಡಿ', switchToSignUp: 'ಖಾತೆ ಇಲ್ಲವೇ? ಒಂದನ್ನು ರಚಿಸಿ',
    cloudSyncNotConfigured: 'ಈ ಆ್ಯಪ್‌ಗೆ ಕ್ಲೌಡ್ ಸಿಂಕ್ ಇನ್ನೂ ಹೊಂದಿಸಲಾಗಿಲ್ಲ.',
    authErrorInvalidEmail: 'ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.',
    authErrorEmailInUse: 'ಈ ಇಮೇಲ್‌ನೊಂದಿಗೆ ಖಾತೆ ಈಗಾಗಲೇ ಇದೆ. ಬದಲಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.',
    authErrorWeakPassword: 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳ ಪಾಸ್‌ವರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ.',
    authErrorWrongCredentials: 'ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.',
    authErrorTooManyRequests: 'ಹಲವು ಪ್ರಯತ್ನಗಳಾಗಿವೆ. ಸ್ವಲ್ಪ ಸಮಯ ಕಾದು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    authErrorNetwork: 'ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ನಿಮ್ಮ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    authErrorPopupClosed: 'ಸೈನ್ ಇನ್ ರದ್ದಾಯಿತು.',
    authErrorGeneric: 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    authErrorGoogleNeedsDevBuild: 'ಈ ಸಾಧನದಲ್ಲಿ Google ಸೈನ್ ಇನ್‌ಗೆ ಆ್ಯಪ್‌ನ ಡೆವಲಪ್‌ಮೆಂಟ್ ಬಿಲ್ಡ್ ಬೇಕು, Expo Go ಅಲ್ಲ. ಇದು ಈಗ ವೆಬ್ ಆವೃತ್ತಿಯಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ.',

    claimLocalDataTitle: 'ನಿಮ್ಮ ಈಗಿರುವ ಡೇಟಾವನ್ನು ಬಳಸಬೇಕೇ?',
    claimLocalDataMessage: 'ಸೈನ್ ಇನ್ ಮಾಡುವ ಮೊದಲು ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಕೃಷಿ ದಾಖಲೆಗಳು ನಿಮ್ಮಲ್ಲಿವೆ. ಅವುಗಳನ್ನು ನಿಮ್ಮ ಖಾತೆಗೆ ಸೇರಿಸಿ ಕ್ಲೌಡ್‌ಗೆ ಬ್ಯಾಕಪ್ ಮಾಡಬೇಕೇ?',
    claimLocalDataConfirm: 'ಹೌದು, ಈ ಡೇಟಾ ಬಳಸಿ', claimLocalDataSkip: 'ಬೇಡ, ಹೊಸದಾಗಿ ಪ್ರಾರಂಭಿಸಿ',

    syncNow: 'ಈಗ ಸಿಂಕ್ ಮಾಡಿ', syncing: 'ಸಿಂಕ್ ಆಗುತ್ತಿದೆ…', syncSuccess: 'ನವೀಕೃತವಾಗಿದೆ', syncError: 'ಸಿಂಕ್ ವಿಫಲವಾಗಿದೆ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸುತ್ತದೆ',
    lastSynced: 'ಕೊನೆಯ ಸಿಂಕ್', neverSynced: 'ಎಂದಿಗೂ ಸಿಂಕ್ ಆಗಿಲ್ಲ',
    syncDescription: 'ನಿಮ್ಮ ಕೃಷಿ ದಾಖಲೆಗಳು ನಿಮ್ಮ ಖಾತೆಗೆ ಬ್ಯಾಕಪ್ ಆಗಿವೆ ಮತ್ತು ಇನ್ನೊಂದು ಸಾಧನದಲ್ಲಿ ಸೈನ್ ಇನ್ ಮಾಡಿದಾಗ ಲಭ್ಯವಿರುತ್ತವೆ.',
    deleteAccount: 'ಖಾತೆ ಅಳಿಸಿ',
    deleteAccountIntro: 'ಇದು ನಿಮ್ಮ ಖಾತೆ, ನಿಮ್ಮ ಕ್ಲೌಡ್ ಬ್ಯಾಕಪ್ ಮತ್ತು ಈ ಸಾಧನದಲ್ಲಿರುವ ನಿಮ್ಮ ಕೃಷಿ ಡೇಟಾದ ಪ್ರತಿಯನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸುತ್ತದೆ. ಇದನ್ನು ರದ್ದುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    deleteAccountWarning: 'ಮುಂದುವರಿಯುವ ಮೊದಲು ಬ್ಯಾಕಪ್ ರಫ್ತು ಮಾಡಲು ನಾವು ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ.',
    deleteAccountExportFirst: 'ಮೊದಲು ಬ್ಯಾಕಪ್ ರಫ್ತು ಮಾಡಿ',
    deleteAccountExportButton: 'ಬ್ಯಾಕಪ್ ರಫ್ತು ಮಾಡಿ',
    deleteAccountPasswordPrompt: 'ದೃಢೀಕರಿಸಲು ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.',
    deleteAccountConfirmField: 'ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್',
    deleteAccountConfirmButton: 'ನನ್ನ ಖಾತೆಯನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಿ',
    deleteAccountCancel: 'ರದ್ದುಮಾಡಿ',
    deleteAccountStepReauth: 'ನಿಮ್ಮ ಗುರುತನ್ನು ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ…',
    deleteAccountStepCloud: 'ನಿಮ್ಮ ಕ್ಲೌಡ್ ಡೇಟಾವನ್ನು ಅಳಿಸಲಾಗುತ್ತಿದೆ…',
    deleteAccountStepLocal: 'ಈ ಸಾಧನದಿಂದ ಡೇಟಾವನ್ನು ತೆಗೆದುಹಾಕಲಾಗುತ್ತಿದೆ…',
    deleteAccountStepAuth: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಅಳಿಸಲಾಗುತ್ತಿದೆ…',
    deleteAccountSuccess: 'ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ಡೇಟಾವನ್ನು ಅಳಿಸಲಾಗಿದೆ.',
    deleteAccountPartialFailure: 'ಕೆಲವು ಹಂತಗಳು ಪೂರ್ಣಗೊಂಡಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸುವುದು ಸುರಕ್ಷಿತ — ಈಗಾಗಲೇ ಅಳಿಸಿದ್ದು ನಕಲಾಗುವುದಿಲ್ಲ ಅಥವಾ ಕಳೆದುಹೋಗುವುದಿಲ್ಲ.',
    deleteAccountNeedsPassword: 'ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.',
    deleteAccountGoogleNativeUnsupported: 'ಈ ಸಾಧನದಿಂದ Google ಖಾತೆಯನ್ನು ಅಳಿಸುವುದು ಇನ್ನೂ ಬೆಂಬಲಿತವಿಲ್ಲ. ದಯವಿಟ್ಟು ಈ ಖಾತೆಯನ್ನು ಅಳಿಸಲು ವೆಬ್ ಆ್ಯಪ್ ಬಳಸಿ.',
    deleteAccountDone: 'ಮುಗಿದಿದೆ',
    deleteAccountExported: 'ಬ್ಯಾಕಪ್ ರಫ್ತಾಗಿದೆ.',
    deleteAccountStepWaitingSync: 'ಮುಂದುವರಿಯುವ ಮೊದಲು ಬಾಕಿ ಇರುವ ಸಿಂಕ್ ಅನ್ನು ಪೂರ್ಣಗೊಳಿಸಲಾಗುತ್ತಿದೆ…',
    deleteAccountSyncBusy: 'ಸಿಂಕ್ ಪೂರ್ಣಗೊಳ್ಳಲು ನಿರೀಕ್ಷೆಗಿಂತ ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    deleteAccountStepLock: 'ಅಳಿಸುವಿಕೆಗಾಗಿ ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಲಾಗುತ್ತಿದೆ…',
  },
  hi: {
    tagline: 'हर खेत की कहानी, एक ही डायरी में',
    greeting: 'आपका खेत, आपकी कहानी।',
    intro: 'अपने रोज़ के कृषि कार्य, खर्च और मौसम के रिकॉर्ड एक जगह रखें।',
    addActivity: 'गतिविधि जोड़ें', activities: 'गतिविधियाँ', plots: 'खेत के हिस्से', season: 'वर्तमान सीज़न',
    recentActivities: 'हाल की गतिविधियाँ', viewAll: 'सभी देखें', noActivities: 'अभी कोई गतिविधि नहीं',
    startDiary: 'अपनी डायरी शुरू करने के लिए पहली कृषि गतिविधि जोड़ें।', farmerTools: 'किसान उपकरण',
    toolsComingSoon: 'मौसम सलाह, भूमि इकाई रूपांतरण और खेती के लाभ की योजना अगले चरण में जोड़ी जाएगी।',
    diary: 'खेत की डायरी', diarySubtitle: 'आपके खेत में होने वाले काम का सरल रिकॉर्ड।',
    home: 'होम', farm: 'खेत', records: 'रिकॉर्ड', more: 'और', myFarm: 'मेरा खेत',
    settingsSubtitle: 'भाषा और ऐप की प्राथमिकताएँ', language: 'ऐप की भाषा',
    privacyTitle: 'आपका डेटा, आपका नियंत्रण', privacyText: 'डायरी की प्रविष्टियाँ हमेशा पहले इसी डिवाइस पर सेव होती हैं और पूरी तरह ऑफ़लाइन काम करती हैं। साइन इन करना वैकल्पिक है और यह केवल आपके रिकॉर्ड को आपके अपने खाते में बैकअप करता है।',
    activityTitle: 'गतिविधि का नाम', activityPlaceholder: 'जैसे सोयाबीन के खेत में पानी दिया',
    category: 'गतिविधि का प्रकार', notes: 'नोट्स (वैकल्पिक)', notesPlaceholder: 'मात्रा, खर्च या अन्य जानकारी…',
    saveActivity: 'गतिविधि सेव करें', localNote: 'इसी डिवाइस पर सेव होगा, और साइन इन होने पर आपके खाते में बैकअप भी होगा।',
    requiredTitle: 'गतिविधि ज़रूरी है', enterActivity: 'आगे बढ़ने के लिए गतिविधि का नाम लिखें।',
    deleteEntry: 'गतिविधि हटाएँ?', deleteConfirm: 'यह गतिविधि इस डिवाइस से हट जाएगी।',
    cancel: 'रद्द करें', delete: 'हटाएँ',

    save: 'सेव करें', today: 'आज', invalidDate: 'सही तारीख़ YYYY-MM-DD रूप में लिखें।',
    requiredField: 'यह फ़ील्ड ज़रूरी है।',
    deleteConfirmGeneric: 'यह रिकॉर्ड इस डिवाइस से हट जाएगा।',
    editActivity: 'गतिविधि संपादित करें', noneOption: 'कोई नहीं',

    profileTab: 'प्रोफ़ाइल', plotsTab: 'खेत के हिस्से', cropsTab: 'फसलें',
    farmName: 'खेत का नाम', farmNamePlaceholder: 'जैसे ग्रीन वैली फ़ार्म',
    farmerName: 'किसान का नाम', farmerNamePlaceholder: 'जैसे रमेश कुमार',
    village: 'गाँव', villagePlaceholder: 'जैसे होसहल्ली',
    district: 'ज़िला', districtPlaceholder: 'जैसे मैसूर',
    stateField: 'राज्य', statePlaceholder: 'जैसे कर्नाटक',
    totalArea: 'कुल भूमि क्षेत्रफल', unit: 'इकाई',
    profileIntro: 'यह जानकारी इसी डिवाइस पर रहती है और आपकी डायरी को निजी बनाने में मदद करती है।',

    addPlot: 'हिस्सा जोड़ें', editPlot: 'हिस्सा संपादित करें', plotName: 'हिस्से का नाम', plotNamePlaceholder: 'जैसे उत्तरी खेत',
    plotArea: 'क्षेत्रफल', noPlotsYet: 'अभी कोई हिस्सा नहीं', addFirstPlot: 'अपने खेत को दर्ज करने के लिए पहला हिस्सा जोड़ें।',
    deletePlot: 'हिस्सा हटाएँ?', noPlotLinked: 'कोई हिस्सा नहीं जोड़ा गया',

    addCrop: 'फसल जोड़ें', editCrop: 'फसल संपादित करें', cropName: 'फसल का नाम', cropNamePlaceholder: 'जैसे सोयाबीन',
    seasonField: 'सीज़न', linkToPlot: 'हिस्सा (वैकल्पिक)', linkToCrop: 'फसल (वैकल्पिक)',
    sowingDate: 'बुवाई की तारीख़', expectedHarvestDate: 'अनुमानित कटाई तारीख़ (वैकल्पिक)',
    noCropsYet: 'अभी कोई फसल नहीं', addFirstCrop: 'सीज़न दर्ज करने के लिए पहली फसल जोड़ें।',
    deleteCrop: 'फसल हटाएँ?', noCropLinked: 'कोई फसल नहीं जोड़ी गई',

    expenses: 'खर्च', income: 'आय', addExpense: 'खर्च जोड़ें', addIncome: 'आय जोड़ें',
    editExpense: 'खर्च संपादित करें', editIncome: 'आय संपादित करें', amount: 'राशि (₹)', amountPlaceholder: 'जैसे 1500',
    financeCategory: 'श्रेणी', financeDate: 'तारीख़', invalidAmount: 'शून्य से बड़ी सही राशि लिखें।',
    noExpensesYet: 'अभी कोई खर्च नहीं', addFirstExpense: 'खेती का खर्च दर्ज करने के लिए पहला खर्च जोड़ें।',
    noIncomeYet: 'अभी कोई आय नहीं', addFirstIncome: 'खेती की आय दर्ज करने के लिए पहली आय जोड़ें।',
    deleteExpense: 'खर्च हटाएँ?', deleteIncome: 'आय हटाएँ?',
    totalExpenses: 'कुल खर्च', totalIncome: 'कुल आय', netBalance: 'शुद्ध शेष',
    netBalanceNote: 'केवल दर्ज किए गए खर्च और आय से गणना की गई।',

    harvests: 'कटाई', addHarvest: 'कटाई जोड़ें', editHarvest: 'कटाई संपादित करें', harvestDate: 'कटाई की तारीख़',
    quantity: 'मात्रा', sellingPrice: 'प्रति इकाई बिक्री मूल्य (वैकल्पिक)', buyer: 'ख़रीदार (वैकल्पिक)',
    noHarvestsYet: 'अभी कोई कटाई दर्ज नहीं', addFirstHarvest: 'फसल कटने के बाद पहला कटाई रिकॉर्ड जोड़ें।',
    deleteHarvest: 'कटाई रिकॉर्ड हटाएँ?', totalValue: 'कुल मूल्य', valueNotRecorded: 'दर्ज नहीं',

    recordsOverviewTab: 'सारांश', financeTab: 'खर्च और आय', harvestsTab: 'कटाई',
    totalActivities: 'कुल गतिविधियाँ', seasonalHistory: 'सीज़न इतिहास', noDataYet: 'अभी कोई डेटा नहीं',

    backupRestore: 'बैकअप और पुनर्स्थापना',
    exportData: 'बैकअप निर्यात करें',
    exportDescription: 'आपके सभी खेती डेटा की एक प्रति टेक्स्ट के रूप में बनाता है, ताकि आप इसे सुरक्षित रख सकें या किसी अन्य डिवाइस पर ले जा सकें।',
    shareBackup: 'बैकअप साझा करें', copyToClipboard: 'क्लिपबोर्ड पर कॉपी करें', copied: 'क्लिपबोर्ड पर कॉपी हो गया।',
    restoreData: 'बैकअप से पुनर्स्थापित करें',
    restoreDescription: 'पुनर्स्थापित करने से पहले पूर्वावलोकन के लिए नीचे पहले से निर्यात किया गया बैकअप पेस्ट करें।',
    pasteBackupPlaceholder: 'बैकअप टेक्स्ट यहाँ पेस्ट करें…',
    previewRestore: 'पुनर्स्थापना पूर्वावलोकन',
    restoreWarningTitle: 'सारा डेटा बदलें?',
    replaceDataWarning: 'यह इस डिवाइस के सारे मौजूदा डेटा को इस बैकअप की सामग्री से स्थायी रूप से बदल देगा। इसे पूर्ववत नहीं किया जा सकता।',
    recordsFoundInBackup: 'बैकअप में मिले रिकॉर्ड', currentRecordsOnDevice: 'इस डिवाइस पर मौजूदा रिकॉर्ड',
    invalidBackupFile: 'यह मान्य BhoomiShakti बैकअप नहीं लगता।', restoreSuccess: 'डेटा सफलतापूर्वक पुनर्स्थापित हुआ।',
    confirmRestore: 'बदलें और पुनर्स्थापित करें',

    account: 'खाता', accountIntro: 'अपने कृषि डेटा को क्लाउड पर बैकअप करने और दूसरे डिवाइस पर उपयोग करने के लिए साइन इन करें। ऐप ऑफ़लाइन भी काम करता रहेगा।',
    signedInAs: 'साइन इन है', signOut: 'साइन आउट',
    signIn: 'साइन इन', createAccount: 'खाता बनाएं', emailField: 'ईमेल', emailPlaceholder: 'you@example.com',
    passwordField: 'पासवर्ड', passwordPlaceholder: 'कम से कम 6 अक्षर', forgotPassword: 'पासवर्ड भूल गए?',
    resetPasswordSent: 'अगर इस ईमेल से खाता है, तो रीसेट लिंक भेज दिया गया है।',
    orDivider: 'या', continueWithGoogle: 'Google से जारी रखें',
    switchToSignIn: 'पहले से खाता है? साइन इन करें', switchToSignUp: 'खाता नहीं है? एक बनाएं',
    cloudSyncNotConfigured: 'इस ऐप के लिए क्लाउड सिंक अभी सेट नहीं है।',
    authErrorInvalidEmail: 'सही ईमेल पता लिखें।',
    authErrorEmailInUse: 'इस ईमेल से खाता पहले से मौजूद है। इसके बजाय साइन इन करें।',
    authErrorWeakPassword: 'कम से कम 6 अक्षरों का पासवर्ड चुनें।',
    authErrorWrongCredentials: 'ग़लत ईमेल या पासवर्ड।',
    authErrorTooManyRequests: 'बहुत ज़्यादा प्रयास हो गए। थोड़ी देर बाद फिर कोशिश करें।',
    authErrorNetwork: 'नेटवर्क त्रुटि। अपना कनेक्शन जांचें और फिर कोशिश करें।',
    authErrorPopupClosed: 'साइन-इन रद्द कर दिया गया।',
    authErrorGeneric: 'कुछ गलत हो गया। कृपया फिर कोशिश करें।',
    authErrorGoogleNeedsDevBuild: 'इस डिवाइस पर Google साइन-इन के लिए ऐप की डेवलपमेंट बिल्ड चाहिए, Expo Go नहीं। यह अभी वेब वर्शन पर काम करता है।',

    claimLocalDataTitle: 'अपना मौजूदा डेटा उपयोग करें?',
    claimLocalDataMessage: 'साइन इन करने से पहले इस डिवाइस पर सेव किए गए कृषि रिकॉर्ड आपके पास हैं। क्या इन्हें अपने खाते में जोड़कर क्लाउड पर बैकअप करें?',
    claimLocalDataConfirm: 'हां, यह डेटा उपयोग करें', claimLocalDataSkip: 'नहीं, नए सिरे से शुरू करें',

    syncNow: 'अभी सिंक करें', syncing: 'सिंक हो रहा है…', syncSuccess: 'अप टू डेट', syncError: 'सिंक विफल, फिर कोशिश होगी',
    lastSynced: 'आख़िरी सिंक', neverSynced: 'कभी सिंक नहीं हुआ',
    syncDescription: 'आपके कृषि रिकॉर्ड आपके खाते में बैकअप हैं और किसी अन्य डिवाइस पर साइन इन करने पर उपलब्ध होंगे।',
    deleteAccount: 'खाता हटाएं',
    deleteAccountIntro: 'इससे आपका खाता, आपका क्लाउड बैकअप, और इस डिवाइस पर मौजूद आपके कृषि डेटा की प्रति स्थायी रूप से हट जाएगी। इसे पूर्ववत नहीं किया जा सकता।',
    deleteAccountWarning: 'आगे बढ़ने से पहले बैकअप निर्यात करने की सलाह दी जाती है।',
    deleteAccountExportFirst: 'पहले बैकअप निर्यात करें',
    deleteAccountExportButton: 'बैकअप निर्यात करें',
    deleteAccountPasswordPrompt: 'पुष्टि के लिए अपना पासवर्ड दर्ज करें।',
    deleteAccountConfirmField: 'वर्तमान पासवर्ड',
    deleteAccountConfirmButton: 'मेरा खाता स्थायी रूप से हटाएं',
    deleteAccountCancel: 'रद्द करें',
    deleteAccountStepReauth: 'आपकी पहचान की पुष्टि हो रही है…',
    deleteAccountStepCloud: 'आपका क्लाउड डेटा हटाया जा रहा है…',
    deleteAccountStepLocal: 'इस डिवाइस से डेटा हटाया जा रहा है…',
    deleteAccountStepAuth: 'आपका खाता हटाया जा रहा है…',
    deleteAccountSuccess: 'आपका खाता और डेटा हटा दिया गया है।',
    deleteAccountPartialFailure: 'कुछ चरण पूरे नहीं हुए। दोबारा प्रयास करना सुरक्षित है — जो पहले ही हट चुका है वह न तो दोहराया जाएगा न ही खोएगा।',
    deleteAccountNeedsPassword: 'आगे बढ़ने के लिए अपना पासवर्ड दर्ज करें।',
    deleteAccountGoogleNativeUnsupported: 'इस डिवाइस से Google खाता हटाना अभी समर्थित नहीं है। कृपया इस खाते को हटाने के लिए वेब ऐप का उपयोग करें।',
    deleteAccountDone: 'पूर्ण हुआ',
    deleteAccountExported: 'बैकअप निर्यात हो गया।',
    deleteAccountStepWaitingSync: 'आगे बढ़ने से पहले लंबित सिंक पूरा किया जा रहा है…',
    deleteAccountSyncBusy: 'सिंक पूरा होने में अपेक्षा से अधिक समय लग रहा है। कृपया कुछ देर बाद फिर से प्रयास करें।',
    deleteAccountStepLock: 'हटाने के लिए आपका खाता सुरक्षित किया जा रहा है…',
  },
};
