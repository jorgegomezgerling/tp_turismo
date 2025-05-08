import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Circle } from 'react-leaflet';


// Fix para los íconos que no cargan bien por defecto en Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

function MapaLugares({ lugares, centro: centroProps }) {
    const centro = [centroProps.lat, centroProps.lon];

  return (
    <MapContainer center={centro} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {centroProps.lat && centroProps.lon && (
        <Circle
          center={[centroProps.lat, centroProps.lon]}
          radius={5000}
          pathOptions={{
            color: '#60a5fa',       
            fillColor: '#bfdbfe',  
            fillOpacity: 0.15,
            weight: 0.8,
            dashArray: '4,6'
          }}
        />
      )}


      {lugares.map((lugar) => (
        <Marker
          key={lugar.id}
          position={[parseFloat(lugar.lat), parseFloat(lugar.lon)]}
        >
          <Popup>
            <strong>{lugar.nombre}</strong><br />
            {lugar.grupo}<br />
            Distancia: {lugar.distancia.toFixed(2)} km
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapaLugares;
