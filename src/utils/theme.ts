import type React from 'react'

export const colors = {
  primary: '#0369A1',
  primaryDark: '#075985',
  primaryLight: '#38BDF8',
  primarySurface: '#E0F2FE',
  accent: '#FBBF24',
  accentDark: '#D97706',
  success: '#16A34A',
  successLight: '#DCFCE7',
  successDark: '#166534',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  errorDark: '#991B1B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  disabled: '#E2E8F0',
  disabledText: '#94A3B8',
  optionDefault: '#FFFFFF',
  optionSelected: '#E0F2FE',
  optionCorrect: '#DCFCE7',
  optionIncorrect: '#FEE2E2',
  euGold: '#FFCC00',
  euBlue: '#003399',
}

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 }

export const fontSize = {
  xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 26, xxxl: 34,
}

export const radius = { sm: 8, md: 14, lg: 22, xl: 32, full: 999 }

export const shadow = {
  sm: { boxShadow: '0 1px 3px rgba(15,23,42,0.06)' } as React.CSSProperties,
  md: { boxShadow: '0 4px 12px rgba(15,23,42,0.08)' } as React.CSSProperties,
  lg: { boxShadow: '0 8px 24px rgba(3,105,161,0.15)' } as React.CSSProperties,
}
