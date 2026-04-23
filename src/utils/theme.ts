export const colors = {
  // EU-inspired navy + sky blue palette
  primary: '#0369A1',       // EU sky blue (more vibrant, better contrast)
  primaryDark: '#075985',
  primaryLight: '#38BDF8',
  primarySurface: '#E0F2FE',
  accent: '#FBBF24',        // EU gold/amber
  accentDark: '#D97706',

  success: '#16A34A',
  successLight: '#DCFCE7',
  successDark: '#166534',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  errorDark: '#991B1B',

  background: '#F8FAFC',    // Near-white, clean
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',    // Card backgrounds, secondary surfaces

  textPrimary: '#0F172A',   // Slate-900 — max contrast
  textSecondary: '#475569', // Slate-600 — readable muted
  textMuted: '#94A3B8',     // Slate-400
  textInverse: '#FFFFFF',

  border: '#E2E8F0',        // Slate-200
  borderStrong: '#CBD5E1',  // Slate-300

  disabled: '#E2E8F0',
  disabledText: '#94A3B8',

  optionDefault: '#FFFFFF',
  optionSelected: '#E0F2FE',   // Light blue selected
  optionCorrect: '#DCFCE7',
  optionIncorrect: '#FEE2E2',

  // EU stars gold for decorative elements
  euGold: '#FFCC00',
  euBlue: '#003399',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 34,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 32,
  full: 999,
};

export const shadow = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0369A1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
};
