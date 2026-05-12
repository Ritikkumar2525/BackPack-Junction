"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createStopIcon = (index, total) => {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const color = isFirst ? "#22c55e" : isLast ? "#ef4444" : "#C67A3C";
  const label = isFirst ? "START" : isLast ? "END" : `${index + 1}`;
  
  return new L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative flex items-center justify-center">
        <div class="relative w-4 h-4 rounded-full border-2 border-white z-10 flex items-center justify-center"
          style="background:${color}; box-shadow: 0 0 12px ${color}80;">
        </div>
        <div class="absolute top-5 whitespace-nowrap text-[10px] font-bold tracking-wider text-cream/90 bg-[#0C1420]/90 px-2 py-0.5 rounded border border-cream/10 z-20 shadow-lg">
          ${label}
        </div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function TripRouteMap({ routeLocations, itineraryStops = [], pickupLocations = [], dropLocations = [] }) {
  const [locations, setLocations] = useState(routeLocations || []);
  const [loading, setLoading] = useState(!routeLocations && (itineraryStops.length > 0 || pickupLocations.length > 0));
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchCoordinates() {
      if (routeLocations && routeLocations.length > 0) {
        setLocations(routeLocations);
        setLoading(false);
        return;
      }

      // Compile the full list of stops to geocode
      const allStops = [];
      if (pickupLocations && pickupLocations.length > 0) {
        allStops.push(pickupLocations[0]); // Start point
      }
      if (itineraryStops && itineraryStops.length > 0) {
        allStops.push(...itineraryStops); // Journey stops
      }
      if (dropLocations && dropLocations.length > 0) {
        // Only add drop if it's different from the last itinerary stop
        if (allStops.length === 0 || allStops[allStops.length - 1] !== dropLocations[dropLocations.length - 1]) {
          allStops.push(dropLocations[dropLocations.length - 1]); // End point
        }
      }

      if (allStops.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const fetchedLocations = [];
        
        // Sequentially fetch coordinates to avoid rate limits (1 req / sec)
        for (let i = 0; i < allStops.length; i++) {
          if (!mounted) return;
          
          let stopName = allStops[i];
          // Strip out prefixes like "Arrival at " or "Delhi to " for better geocoding results
          const stopQuery = stopName.split(' to ').pop().replace(/Arrival at /gi, '').replace(/Darshan/gi, '').trim();

          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(stopQuery + ', India')}&limit=1`);
          const data = await res.json();
          
          if (data && data.length > 0) {
            fetchedLocations.push({
              name: stopName,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            });
          }
          
          if (i < allStops.length - 1) {
            await delay(1000); // 1 second delay
          }
        }

        if (mounted) {
          setLocations(fetchedLocations);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to geocode itinerary stops:", err);
        if (mounted) {
          setError("Failed to load map coordinates.");
          setLoading(false);
        }
      }
    }

    fetchCoordinates();

    return () => {
      mounted = false;
    };
  }, [routeLocations, itineraryStops, pickupLocations, dropLocations]);

  if (loading) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center bg-[#0a0f18] rounded-2xl border border-cream/5 gap-3">
        <div className="w-6 h-6 border-2 border-burnt-orange border-t-transparent rounded-full animate-spin"></div>
        <p className="text-cream/40 text-xs">Generating interactive map route...</p>
      </div>
    );
  }

  if (error || !locations || locations.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-cream/[0.02] rounded-2xl border border-cream/5">
        <p className="text-cream/30 text-sm">{error || "No route data available for this trip yet."}</p>
      </div>
    );
  }

  const positions = locations.map(loc => [loc.lat, loc.lng]);
  
  // Calculate center of all points
  const avgLat = positions.reduce((s, p) => s + p[0], 0) / positions.length;
  const avgLng = positions.reduce((s, p) => s + p[1], 0) / positions.length;

  return (
    <MapContainer
      center={[avgLat, avgLng]}
      zoom={7}
      scrollWheelZoom={false}
      zoomControl={true}
      attributionControl={false}
      className="w-full h-[400px] z-0 rounded-2xl bg-[#0a0f18] will-change-transform"
      style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={15}
      />

      {/* Route line */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: "#C67A3C",
          weight: 3,
          dashArray: "8, 6",
          lineCap: "round",
          opacity: 0.8,
        }}
      />

      {/* Markers */}
      {locations.map((loc, i) => (
        <Marker
          key={i}
          position={[loc.lat, loc.lng]}
          icon={createStopIcon(i, locations.length)}
        >
          <Popup className="custom-leaflet-popup" closeButton={false}>
            <div className="bg-[#0C1420] text-white p-3 rounded-lg border border-cream/10 min-w-[120px]">
              <p className="font-bold text-sm">{loc.name}</p>
              <p className="text-cream/40 text-[10px] mt-1">Stop {i + 1} of {locations.length}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
