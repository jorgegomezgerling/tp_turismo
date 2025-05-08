import React, { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  Box,
  Paper,
} from '@mui/material';

function FormularioLugar({ onLugarAgregado }) {
  const [nombre, setNombre] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [grupo, setGrupo] = useState('cervecerías');
  const [mensaje, setMensaje] = useState(null);

  const grupos = ['cervecerías', 'universidades', 'farmacias', 'emergencias', 'supermercados'];

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8000/agregar_lugar/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        grupo
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo agregar el lugar');
        return res.json();
      })
      .then(data => {
        setMensaje({ type: 'success', text: 'Lugar agregado exitosamente!' });
        onLugarAgregado();
        setNombre('');
        setLat('');
        setLon('');
        setGrupo('cervecerías');
      })
      .catch(() => {
        setMensaje({ type: 'error', text: 'Error al agregar lugar' });
      });
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 500, margin: '2rem auto' }}>
      <Typography variant="h6" gutterBottom>
        Agregar nuevo lugar
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Latitud"
            value={lat}
            onChange={e => setLat(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Longitud"
            value={lon}
            onChange={e => setLon(e.target.value)}
            required
            fullWidth
          />
        </Box>

        <TextField
          select
          label="Grupo"
          value={grupo}
          onChange={e => setGrupo(e.target.value)}
        >
          {grupos.map((g) => (
            <MenuItem key={g} value={g}>{g}</MenuItem>
          ))}
        </TextField>

        <Button variant="contained" type="submit">
          Agregar lugar
        </Button>

        {mensaje && (
          <Alert severity={mensaje.type}>
            {mensaje.text}
          </Alert>
        )}
      </Box>
    </Paper>
  );
}

export default FormularioLugar;
