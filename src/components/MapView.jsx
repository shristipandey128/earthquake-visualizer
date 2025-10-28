import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const [quakes, setQuakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
      .then(res => res.json())
      .then(data => {
        setQuakes(data.features);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-8">Loading quakes...</p>;

  return (
    <div className="h-[80vh] w-full">
      <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        {quakes.map((q, i) => {
          const [lng, lat, depth] = q.geometry.coordinates;
          const { mag, place, time } = q.properties;
          return (
            <Marker key={i} position={[lat, lng]}>
              <Popup>
                <div>
                  <p><strong>{place}</strong></p>
                  <p>Magnitude: {mag}</p>
                  <p>Depth: {depth} km</p>
                  <p>{new Date(time).toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
