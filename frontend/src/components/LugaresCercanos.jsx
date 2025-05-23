import React, { useState } from 'react';
import FormularioLugar from './FormularioLugar';
import MapaLugares from './MapaLugares';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';

import PlaceIcon from '@mui/icons-material/Place';

function LugaresCercanos() {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [lugares, setLugares] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const buscarLugaresCon = (latitud, longitud) => {
    setCargando(true);
    setError(null);
  
    fetch(`http://localhost:8000/lugares_cercanos/?lat=${latitud}&lon=${longitud}`)
      .then(res => res.json())
      .then(data => {
        setLugares(data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo obtener los lugares');
        setCargando(false);
      });
  };
  

  const buscarLugares = () => {
    if (!lat || !lon) {
      setError('Coordenadas incompletas');
      return;
    }

    setCargando(true);
    setError(null);

    fetch(`http://localhost:8000/lugares_cercanos/?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => {
        setLugares(data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo obtener los lugares');
        setCargando(false);
      });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center">
        Lugares cercanos
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Buscador:
        </Typography>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            buscarLugares();
          }}
          sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}
        >
          <TextField
            label="Latitud"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
          <TextField
            label="Longitud"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            required
          />
          <Button variant="contained" type="submit">
            Buscar
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const latitud = pos.coords.latitude.toFixed(6);
                    const longitud = pos.coords.longitude.toFixed(6);
                    setLat(latitud);
                    setLon(longitud);
                    buscarLugaresCon(latitud, longitud);
                  },
                  () => {
                    setError('No se pudo obtener tu ubicación');
                  }
                );
              } else {
                setError('Geolocalización no soportada');
              }
            }}
          >
            Usar mi ubicación
          </Button>

        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>

      {cargando && <Typography>Cargando lugares...</Typography>}
      {!cargando && lugares.length === 0 && (
        <Typography>No se encontraron lugares</Typography>
      )}

      {lugares.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Resultados
          </Typography>
          <List>
            {lugares.map((lugar) => (
              <ListItem key={lugar.id} divider>
                <ListItemIcon>
                  <PlaceIcon />
                </ListItemIcon>
                <ListItemText
                  primary={lugar.nombre}
                  secondary={`${lugar.grupo} – ${lugar.distancia.toFixed(2)} km`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {lugares.length > 0 && (
        <MapaLugares lugares={lugares} centro={{ lat: parseFloat(lat), lon: parseFloat(lon) }} />
      )}

      <FormularioLugar onLugarAgregado={buscarLugares} />
    </div>
  );
}

export default LugaresCercanos;