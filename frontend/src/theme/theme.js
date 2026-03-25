import { createTheme } from '@mui/material/styles';

const baseTypography = {
  fontFamily: '"Sora", "Segoe UI", sans-serif',
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 600 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0.3 },
};

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#1A6EFF', dark: '#0D4FC2', light: '#4D8FFF' },
            secondary: { main: '#FF5E6C' },
            background: { default: '#F4F6FB', paper: '#FFFFFF' },
            success: { main: '#22C55E' },
            warning: { main: '#F59E0B' },
            text: { primary: '#0F1729', secondary: '#5A6480' },
          }
        : {
            primary: { main: '#4D8FFF', dark: '#1A6EFF', light: '#7AADFF' },
            secondary: { main: '#FF7585' },
            background: { default: '#0B0F1A', paper: '#131929' },
            success: { main: '#34D399' },
            warning: { main: '#FBBF24' },
            text: { primary: '#E8EDF7', secondary: '#8C96B0' },
          }),
    },
    typography: baseTypography,
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          containedPrimary: {
            background: mode === 'light'
              ? 'linear-gradient(135deg, #1A6EFF 0%, #0D4FC2 100%)'
              : 'linear-gradient(135deg, #4D8FFF 0%, #1A6EFF 100%)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'light'
              ? '0 2px 12px rgba(26,110,255,0.08), 0 1px 3px rgba(0,0,0,0.06)'
              : '0 2px 12px rgba(0,0,0,0.4)',
            border: mode === 'light' ? '1px solid rgba(26,110,255,0.08)' : '1px solid rgba(255,255,255,0.06)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 600, fontSize: '0.72rem' },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 6, height: 8 },
          bar: { borderRadius: 6 },
        },
      },
    },
  });
