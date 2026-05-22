'use client';

import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    water: Palette['primary'];
  }
  interface PaletteOptions {
    water?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1D4ED8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F0F7FF',
      paper: '#ffffff',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    error: { main: '#EF4444' },
    success: { main: '#10B981' },
    divider: '#E2E8F0',
    water: {
      main: '#0EA5E9',
      light: '#BAE6FD',
      dark: '#0369A1',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.06)',
    '0px 1px 4px rgba(15, 23, 42, 0.08)',
    '0px 2px 8px rgba(15, 23, 42, 0.08)',
    '0px 4px 12px rgba(15, 23, 42, 0.08)',
    '0px 4px 16px rgba(15, 23, 42, 0.10)',
    '0px 8px 24px rgba(15, 23, 42, 0.10)',
    '0px 8px 32px rgba(15, 23, 42, 0.12)',
    '0px 12px 40px rgba(15, 23, 42, 0.12)',
    '0px 16px 48px rgba(15, 23, 42, 0.14)',
    '0px 20px 56px rgba(15, 23, 42, 0.14)',
    '0px 24px 64px rgba(15, 23, 42, 0.16)',
    '0px 28px 72px rgba(15, 23, 42, 0.16)',
    '0px 32px 80px rgba(15, 23, 42, 0.18)',
    '0px 36px 88px rgba(15, 23, 42, 0.18)',
    '0px 40px 96px rgba(15, 23, 42, 0.20)',
    '0px 44px 104px rgba(15, 23, 42, 0.20)',
    '0px 48px 112px rgba(15, 23, 42, 0.22)',
    '0px 52px 120px rgba(15, 23, 42, 0.22)',
    '0px 56px 128px rgba(15, 23, 42, 0.24)',
    '0px 60px 136px rgba(15, 23, 42, 0.24)',
    '0px 64px 144px rgba(15, 23, 42, 0.26)',
    '0px 68px 152px rgba(15, 23, 42, 0.26)',
    '0px 72px 160px rgba(15, 23, 42, 0.28)',
    '0px 76px 168px rgba(15, 23, 42, 0.28)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 transparent',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
            },
          },
          '&.MuiButton-sizeLarge': { padding: '13px 32px', fontSize: '1rem' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#F8FAFC',
            transition: 'all 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2563EB',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2563EB',
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 24px rgba(15, 23, 42, 0.06)',
          border: '1px solid #F1F5F9',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 99,
          backgroundColor: '#E2E8F0',
        },
        bar: {
          borderRadius: 99,
          background: 'linear-gradient(90deg, #2563EB 0%, #0EA5E9 100%)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
});

export default theme;
