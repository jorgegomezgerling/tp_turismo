import React, { useEffect, useState } from 'react';
import FormularioLugar from './FormularioLugar';

function LugaresCercanos() {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [lugares, setLugares] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

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
      <h2>Lugares cercanos</h2>

      <div>
        <label>
          Latitud:  
          <input type="text" value={lat} onChange={e => setLat(e.target.value)} />
        </label>
        <label>
          Longitud:
          <input type="text" value={lon} onChange={e => setLon(e.target.value)} />
        </label>
        <button onClick={buscarLugares}>Buscar lugares</button>
      </div>

      {cargando && <p>Cargando lugares...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {(!cargando && lugares.length === 0) && <p>No se encontraron lugares</p>}

      <ul>
        {lugares.map(lugar => (
          <li key={lugar.id}>
            {lugar.nombre} ({lugar.grupo}) - {lugar.distancia.toFixed(2)} km
          </li>
        ))}
      </ul>
      <FormularioLugar onLugarAgregado={buscarLugares} />
    </div>
  );
}

export default LugaresCercanos;
