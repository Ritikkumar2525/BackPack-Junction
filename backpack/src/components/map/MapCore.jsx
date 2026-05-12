"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Clock, MapPin, ArrowRight } from "lucide-react";

// Beautiful, simple, high-performance custom marker
const createCustomIcon = (name) => {
  return new L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative flex items-center justify-center">
        <!-- Core Dot -->
        <div class="relative w-3 h-3 bg-burnt-orange rounded-full border border-[#0a0f18] shadow-[0_0_10px_rgba(198,122,60,0.8)] z-10"></div>
        <!-- Permanent Label -->
        <div class="absolute top-4 whitespace-nowrap text-[9px] font-bold tracking-wider text-cream/90 bg-[#0C1420]/90 px-1.5 py-0.5 rounded border border-cream/10 z-20 shadow-lg">
          ${name}
        </div>
      </div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const createHubIcon = (name) => {
  return new L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 bg-burnt-orange/20 rounded-full animate-ping" style="animation-duration: 3s;"></div>
        <div class="relative w-5 h-5 bg-white rounded-full border-2 border-burnt-orange shadow-[0_0_20px_rgba(198,122,60,1)] z-10 flex items-center justify-center">
          <div class="w-2 h-2 bg-burnt-orange rounded-full"></div>
        </div>
        <div class="absolute top-8 whitespace-nowrap text-[12px] font-black tracking-widest text-white bg-burnt-orange px-3 py-1 rounded-md shadow-xl border border-white/20 z-20">
          ${name}
        </div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const mapDestinations = [
  { id: "delhi", name: "Delhi", coords: [28.6139, 77.2090], dist: "Starting Point", time: "", image: "/destinations/delhi.jpg", desc: "The Capital Hub." },
  { id: "spiti", name: "Spiti Valley", coords: [32.2461, 78.0349], dist: "720 km", time: "12 hrs", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&h=200&fit=crop&q=80", desc: "A cold desert mountain valley." },
  { id: "kasol", name: "Kasol", coords: [32.0100, 77.3150], dist: "520 km", time: "11 hrs", image: "/destinations/kasol.jpg", desc: "A Himalayan hotspot for backpackers." },
  { id: "manali", name: "Manali", coords: [32.2396, 77.1887], dist: "540 km", time: "12 hrs", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=200&fit=crop&q=80", desc: "A high-altitude resort town." },
  { id: "dharamshala", name: "Dharamshala", coords: [32.2190, 76.3234], dist: "480 km", time: "10 hrs", image: "/destinations/dharamshala.jpg", desc: "Home to the Dalai Lama." },
  { id: "shimla", name: "Shimla", coords: [31.1048, 77.1734], dist: "350 km", time: "8 hrs", image: "/destinations/shimla.jpg", desc: "Capital of Himachal Pradesh." },
  { id: "kedarnath", name: "Kedarnath", coords: [30.7352, 79.0669], dist: "450 km", time: "11 hrs", image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&h=200&fit=crop&q=80", desc: "A revered Hindu temple." },
  { id: "badrinath", name: "Badrinath", coords: [30.7433, 79.4938], dist: "510 km", time: "12 hrs", image: "/destinations/badrinath.jpg", desc: "Holy shrine of Lord Vishnu." },
  { id: "auli", name: "Auli", coords: [30.5332, 79.5670], dist: "520 km", time: "12 hrs", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&q=80", desc: "Premier skiing destination." },
  { id: "mussoorie", name: "Mussoorie", coords: [30.4598, 78.0664], dist: "290 km", time: "7 hrs", image: "/destinations/mussoorie.jpg", desc: "Queen of the Hills." },
  { id: "nainital", name: "Nainital", coords: [29.3919, 79.4542], dist: "294 km", time: "7 hrs", image: "/destinations/nainital.jpg", desc: "City of lakes." },
  { id: "rishikesh", name: "Rishikesh", coords: [30.0869, 78.2676], dist: "240 km", time: "6 hrs", image: "/destinations/rishikesh.jpg", desc: "Yoga capital of the world." },
  { id: "haridwar", name: "Haridwar", coords: [29.9457, 78.1642], dist: "208 km", time: "5 hrs", image: "/destinations/haridwar.jpg", desc: "Ancient holy city." },
  { id: "corbett", name: "Corbett", coords: [29.5300, 78.7747], dist: "260 km", time: "6 hrs", image: "/destinations/corbett.jpg", desc: "Famous National Park." },
  { id: "agra", name: "Agra", coords: [27.1767, 78.0081], dist: "214 km", time: "5 hrs", image: "/destinations/agra.jpg", desc: "Home to the Taj Mahal." },
  { id: "mathura", name: "Mathura", coords: [27.4924, 77.6737], dist: "185 km", time: "4 hrs", image: "/destinations/mathura.jpg", desc: "Birthplace of Lord Krishna." },
  { id: "vrindavan", name: "Vrindavan", coords: [27.5650, 77.6593], dist: "159 km", time: "4 hrs", image: "/destinations/vrindavan.jpg", desc: "Holy city." },
  { id: "morni", name: "Morni Hills", coords: [30.6953, 77.0863], dist: "240 km", time: "5 hrs", image: "https://images.unsplash.com/photo-1580289437401-1a5b5be2dbe0?w=400&h=200&fit=crop&q=80", desc: "Scenic hills in Haryana." },
  { id: "kurukshetra", name: "Kurukshetra", coords: [29.9695, 76.8227], dist: "160 km", time: "4 hrs", image: "/destinations/kurukshetra.jpg", desc: "Historic city." },
  { id: "gurugram", name: "Gurugram", coords: [28.4595, 77.0266], dist: "30 km", time: "1 hr", image: "/destinations/gurugram.jpg", desc: "Millennium city." },
  { id: "amritsar", name: "Amritsar", coords: [31.6340, 74.8723], dist: "450 km", time: "9 hrs", image: "/destinations/amritsar.jpg", desc: "Home to the Golden Temple." },
  { id: "ranthambore", name: "Ranthambore", coords: [26.0173, 76.5026], dist: "380 km", time: "7 hrs", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=200&fit=crop&q=80", desc: "Wildlife reserve." },
  { id: "jaipur", name: "Jaipur", coords: [26.9124, 75.7873], dist: "280 km", time: "6 hrs", image: "/destinations/jaipur.jpg", desc: "The Pink City." },
  { id: "udaipur", name: "Udaipur", coords: [24.5854, 73.7125], dist: "660 km", time: "10 hrs", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=200&fit=crop&q=80", desc: "City of Lakes." },
  { id: "jaisalmer", name: "Jaisalmer", coords: [26.9157, 70.9083], dist: "820 km", time: "14 hrs", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=200&fit=crop&q=80", desc: "The Golden City." },
  { id: "mount-abu", name: "Mount Abu", coords: [24.5926, 72.7156], dist: "740 km", time: "14 hrs", image: "/destinations/mount-abu.jpg", desc: "Hill station in Rajasthan." }
];

export default function MapCore({ showRoute }) {
  // Center roughly between Delhi and Himalayas
  const mapCenter = [29.5, 76.5];

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={6} 
      scrollWheelZoom={false}
      zoomControl={true}
      attributionControl={false}
      className="w-full h-[500px] md:h-[650px] z-0 rounded-2xl bg-[#0a0f18] will-change-transform"
      style={{ transform: 'translateZ(0)', contain: 'layout style paint' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={12}
      />
      
      <div className="absolute inset-0 bg-[#0C1420]/30 pointer-events-none z-[400]" style={{ mixBlendMode: 'color' }} />

      {showRoute && mapDestinations.filter(d => d.id !== "delhi").map((dest) => (
        <Polyline 
          key={`route-${dest.id}`}
          positions={[ [28.6139, 77.2090], dest.coords ]} 
          pathOptions={{ 
            color: '#C67A3C', 
            weight: 1.5, 
            dashArray: '4, 6', 
            lineCap: 'round', 
            opacity: 0.6
          }} 
        />
      ))}

      {mapDestinations.map((dest) => (
        <Marker 
          key={dest.id} 
          position={dest.coords} 
          icon={dest.id === "delhi" ? createHubIcon(dest.name) : createCustomIcon(dest.name)}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup className="custom-leaflet-popup" closeButton={false}>
            <div className="w-56 p-0 flex flex-col overflow-hidden rounded-xl bg-[#0C1420] text-white shadow-xl relative border border-cream/10">
              <div className="relative h-28 overflow-hidden bg-[#0a0f18]">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400&h=200";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1420] to-transparent opacity-80" />
              </div>
              <div className="p-3 -mt-4 relative z-10">
                <h4 className="text-white font-bold text-base mb-1">{dest.name}</h4>
                <p className="text-cream/70 text-[11px] leading-snug line-clamp-2 mb-2">
                  {dest.desc}
                </p>
                
                {dest.id !== "delhi" && (
                  <div className="flex items-center gap-3 text-[9px] uppercase tracking-wider font-semibold text-cream/50">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-burnt-orange" />
                      {dest.dist}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-burnt-orange" />
                      {dest.time}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
