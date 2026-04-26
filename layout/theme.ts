'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // 1. ADD YOUR COLORS HERE
  palette: {
    mode: 'dark', // Forces dark mode for MUI components
    primary: {
      main: '#059669', // Tailwind emerald-600
      light: '#10b981', // Tailwind emerald-500
      dark: '#047857', // Tailwind emerald-700
      contrastText: '#ffffff', // White text on the button
    },
    secondary: {
      main: '#0ea5e9', // Tailwind sky-500
      light: '#38bdf8', // Tailwind sky-400
      dark: '#0284c7', // Tailwind sky-600
      contrastText: '#ffffff',
    },
    background: {
      default: '#111827', // Tailwind gray-900
      paper: '#1f2937',   // Tailwind gray-800
    },
  },
  
  // 2. ADD BUTTON STYLING
  typography: {
    fontFamily: 'var(--font-roboto)', 
    button: {
      textTransform: 'none', // Disables MUI's default ALL CAPS
      fontWeight: 'bold',
    },
  },

  // 3. OVERRIDE COMPONENT STYLES
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#111827', // Matching palette.background.default
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Example: replaces `rounded-lg`
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          // In dark mode, MUI Paper has a gradient. This makes it a solid color.
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;