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
  },
  
  // 2. ADD BUTTON STYLING
  typography: {
    fontFamily: 'var(--font-roboto)', 
    button: {
      textTransform: 'none', // Disables MUI's default ALL CAPS
      fontWeight: 'bold',
    },
  },
});

export default theme;