import React, { useState } from 'react';

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
        setMensaje('Lugar agregado exitosamente!');
        onLugarAgregado(); // refresca lista
        setNombre('');
        setLat('');
        setLon('');
        setGrupo('cervecerías');
      })
      .catch(() => {
        setMensaje('Error al agregar lugar');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar nuevo lugar</h3>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Latitud"
        value={lat}
        onChange={e => setLat(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Longitud"
        value={lon}
        onChange={e => setLon(e.target.value)}
        required
      />
      <select value={grupo} onChange={e => setGrupo(e.target.value)}>
        {grupos.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
      <button type="submit">Agregar lugar</button>

      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}

export default FormularioLugar;
