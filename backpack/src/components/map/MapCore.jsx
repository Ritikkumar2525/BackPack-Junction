"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Thermometer, Mountain } from "lucide-react";

// Beautiful, glowing custom marker with a ripple effect
const createCustomIcon = (name) => {
  return new L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative flex items-center justify-center">
        <!-- Expanding Ripple -->
        <div class="absolute w-8 h-8 bg-burnt-orange/40 rounded-full animate-ping" style="animation-duration: 2.5s;"></div>
        <!-- Core Dot -->
        <div class="relative w-4 h-4 bg-burnt-orange rounded-full border-2 border-[#0a0f18] shadow-[0_0_15px_rgba(198,122,60,0.8)] z-10"></div>
        <!-- Permanent Label (Optional, but looks premium) -->
        <div class="absolute top-6 whitespace-nowrap text-[10px] font-bold tracking-widest text-cream/90 bg-[#0C1420]/80 backdrop-blur-md px-2 py-1 rounded shadow-lg border border-cream/10 z-20">
          ${name}
        </div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const mapDestinations = [
  {
    id: "kashmir",
    name: "Kashmir",
    coords: [34.0836, 74.7973],
    temp: "2°C - 31°C",
    difficulty: "Easy",
    altitude: "1,585m",
    image: "https://picsum.photos/id/10/400/200",
    desc: "Paradise on Earth, known for beautiful lakes."
  },
  {
    id: "gulmarg",
    name: "Gulmarg",
    coords: [34.0484, 74.3805],
    temp: "-8°C - 20°C",
    difficulty: "Moderate",
    altitude: "2,650m",
    image: "https://picsum.photos/id/1015/400/200",
    desc: "A globally renowned skiing destination with the famous Gulmarg Gondola."
  },
  {
    id: "leh-ladakh",
    name: "Leh Ladakh",
    coords: [34.1526, 77.5771],
    temp: "-14°C - 25°C",
    difficulty: "Extreme",
    altitude: "3,524m",
    image: "https://picsum.photos/id/1036/400/200",
    desc: "A high-altitude desert with stunning monasteries."
  },
  {
    id: "spiti-valley",
    name: "Spiti Valley",
    coords: [32.2461, 78.0349],
    temp: "-20°C - 20°C",
    difficulty: "Challenging",
    altitude: "3,800m",
    image: "https://picsum.photos/id/1044/400/200",
    desc: "A cold desert mountain valley located high in the Himalayas."
  },
  {
    id: "manali",
    name: "Manali",
    coords: [32.2396, 77.1887],
    temp: "-7°C - 25°C",
    difficulty: "Moderate",
    altitude: "2,050m",
    image: "https://picsum.photos/id/1050/400/200",
    desc: "A high-altitude resort town known for backpacking."
  },
  {
    id: "kasol",
    name: "Kasol",
    coords: [32.0100, 77.3150],
    temp: "2°C - 22°C",
    difficulty: "Moderate",
    altitude: "1,580m",
    image: "https://picsum.photos/id/29/400/200",
    desc: "A Himalayan hotspot for backpackers, famous for the Kheerganga trek."
  },
  {
    id: "valley-of-flowers",
    name: "Valley of Flowers",
    coords: [30.7280, 79.6053],
    temp: "8°C - 17°C",
    difficulty: "Challenging",
    altitude: "3,658m",
    image: "https://picsum.photos/id/28/400/200",
    desc: "A UNESCO World Heritage site known for its meadows of endemic alpine flowers."
  },
  {
    id: "auli",
    name: "Auli",
    coords: [30.5332, 79.5670],
    temp: "-4°C - 15°C",
    difficulty: "Moderate",
    altitude: "2,800m",
    image: "https://picsum.photos/id/16/400/200",
    desc: "India's premier skiing destination surrounded by oak forests."
  },
  {
    id: "kedarnath",
    name: "Kedarnath",
    coords: [30.7352, 79.0669],
    temp: "-8°C - 17°C",
    difficulty: "Challenging",
    altitude: "3,583m",
    image: "https://picsum.photos/id/1036/400/200",
    desc: "A highly revered Hindu temple dedicated to Lord Shiva."
  },
  {
    id: "tungnath",
    name: "Tungnath",
    coords: [30.4888, 79.2173],
    temp: "-5°C - 15°C",
    difficulty: "Moderate",
    altitude: "3,680m",
    image: "https://picsum.photos/id/17/400/200",
    desc: "The highest Shiva temple in the world."
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    coords: [30.0869, 78.2676],
    temp: "10°C - 35°C",
    difficulty: "Easy",
    altitude: "372m",
    image: "https://picsum.photos/id/15/400/200",
    desc: "Adventure capital of India, famous for river rafting and bungee jumping."
  },
  {
    id: "banaras",
    name: "Banaras",
    coords: [25.3176, 82.9739],
    temp: "5°C - 42°C",
    difficulty: "Easy",
    altitude: "80m",
    image: "https://picsum.photos/id/14/400/200",
    desc: "The spiritual capital of India, famous for its ancient ghats."
  },
];

// Reorder for an epic Himalayan route
const routeOrder = [
  "banaras", 
  "rishikesh", 
  "tungnath", 
  "kedarnath", 
  "auli", 
  "valley-of-flowers", 
  "kasol", 
  "manali", 
  "spiti-valley", 
  "leh-ladakh", 
  "gulmarg",
  "kashmir"
];
const routeCoordinates = routeOrder.map(id => mapDestinations.find(d => d.id === id).coords);

export default function MapCore({ showRoute }) {
  // Center over North India/Himalayas, slightly zoomed out
  const mapCenter = [31.5, 78.5];

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={6} 
      scrollWheelZoom={false}
      zoomControl={true} // Enabled zoom controls
      attributionControl={false} // Removed the Leaflet OSM CARTO attribution
      className="w-full h-[500px] md:h-[650px] z-0 rounded-2xl bg-[#0a0f18]"
    >
      {/* 
        CartoDB Dark Matter Base Map 
        This provides a stunning, high-contrast, minimalist dark theme that fits perfectly with Awwwards designs.
        No noisy satellite textures, just clean dark vectors where the glowing route and pins truly pop.
      */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={12}
      />
      
      {/* A very subtle blue tint to match the #0C1420 brand exactly */}
      <div className="absolute inset-0 bg-[#0C1420]/30 pointer-events-none z-[400]" style={{ mixBlendMode: 'color' }} />

      {/* The glowing trip route */}
      {showRoute && (
        <Polyline 
          positions={routeCoordinates} 
          pathOptions={{ 
            color: '#C67A3C', 
            weight: 2, 
            dashArray: '8, 8', 
            lineCap: 'round', 
            opacity: 0.9 
          }} 
          className="drop-shadow-[0_0_8px_rgba(198,122,60,0.8)]"
        />
      )}

      {/* Map Markers with Popups */}
      {mapDestinations.map((dest) => (
        <Marker 
          key={dest.id} 
          position={dest.coords} 
          icon={createCustomIcon(dest.name)}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup className="custom-leaflet-popup" closeButton={false}>
            <div className="w-56 p-1 flex flex-col gap-2">
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="w-full h-28 object-cover rounded-lg"
              />
              <h4 className="text-[#0a0f18] font-bold text-base mt-1">{dest.name}</h4>
              <p className="text-[#0a0f18]/70 text-xs leading-relaxed line-clamp-2 m-0">
                {dest.desc}
              </p>
              
              <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] uppercase tracking-wider font-semibold">
                <div className="bg-gray-100 rounded px-2 py-1.5 flex items-center gap-1.5 text-gray-700">
                  <Thermometer size={12} className="text-burnt-orange" />
                  {dest.temp}
                </div>
                <div className="bg-gray-100 rounded px-2 py-1.5 flex items-center gap-1.5 text-gray-700">
                  <Mountain size={12} className="text-burnt-orange" />
                  {dest.altitude}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
