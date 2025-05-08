import React, { useEffect, useState } from 'react';

function LugaresCercanos() {
  const [lugares, setLugares] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/lugares_cercanos/?lat=-32.48&lon=-58.24')

      .then(respuesta => respuesta.json())
      .then(data => {
        setLugares(data);     
        setCargando(false);    
      })
      .catch(error => {
        console.error('Error al obtener lugares:', error);
        setCargando(false);     
      });
  }, []);

  if (cargando) return <p>Cargando lugares...</p>;

  return (
    <div>
      <h2>Lugares cercanos</h2>
      <ul>
        {lugares.map(lugar => (
          <li key={lugar.id}>
            {lugar.nombre} ({lugar.grupo}) - {lugar.distancia.toFixed(2)} km
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LugaresCercanos;