import { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Switch, Box } from '@mui/material';
import { getTheme } from './theme';
import LugaresCercanos from './components/LugaresCercanos';

function App() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const theme = getTheme(modoOscuro);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Switch
              checked={modoOscuro}
              onChange={() => setModoOscuro(!modoOscuro)}
              inputProps={{ 'aria-label': 'Modo oscuro' }}
            />
          </Box>
          <LugaresCercanos />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
