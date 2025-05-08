import { createTheme } from '@mui/material/styles';

export const getTheme = (modoOscuro) => createTheme({
  palette: {
    mode: modoOscuro ? 'dark' : 'light',
    primary: {
      main: '#1976d2', // Azul MUI
    },
    secondary: {
      main: '#f50057', // Rosa
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
  },
});
