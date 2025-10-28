import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const App = () => {
  const [earthquakes, setEarthquakes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        );
        const data = await response.json();
        setEarthquakes(data.features);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Custom marker icon (default Leaflet marker breaks in React)
  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535130.png",
    iconSize: [25, 25],
  });

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-4 mb-2">Earthquake Visualizer 🌍</h1>

      <MapContainer
        center={[20, 80]}
        zoom={3}
        style={{ height: "80vh", width: "90vw", borderRadius: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {earthquakes.map((quake) => (
          <Marker
            key={quake.id}
            position={[
              quake.geometry.coordinates[1],
              quake.geometry.coordinates[0],
            ]}
            icon={customIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{quake.properties.place}</h3>
                <p>Magnitude: {quake.properties.mag}</p>
                <p>
                  Time:{" "}
                  {new Date(quake.properties.time).toLocaleString("en-IN")}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default App;
