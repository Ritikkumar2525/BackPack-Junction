import { NextResponse } from "next/server";

function getWeatherInfo(code) {
  if (code === 0) return { condition: "Clear Sky", icon: "☀️" };
  if (code === 1 || code === 2) return { condition: "Partly Cloudy", icon: "⛅" };
  if (code === 3) return { condition: "Overcast", icon: "☁️" };
  if (code >= 45 && code <= 48) return { condition: "Foggy", icon: "🌫️" };
  if (code >= 51 && code <= 67) return { condition: "Rain", icon: "🌧️" };
  if (code >= 71 && code <= 86) return { condition: "Snow", icon: "❄️" };
  if (code >= 95) return { condition: "Thunderstorm", icon: "⛈️" };
  return { condition: "Clear", icon: "☀️" };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location") || "Kedarnath";

  const mapDestinations = [
    { name: "Delhi", coords: [28.6139, 77.2090] },
    { name: "Spiti Valley", coords: [32.2461, 78.0349] },
    { name: "Kasol", coords: [32.0100, 77.3150] },
    { name: "Manali", coords: [32.2396, 77.1887] },
    { name: "Dharamshala", coords: [32.2190, 76.3234] },
    { name: "Shimla", coords: [31.1048, 77.1734] },
    { name: "Kedarnath", coords: [30.7352, 79.0669] },
    { name: "Badrinath", coords: [30.7433, 79.4938] },
    { name: "Auli", coords: [30.5332, 79.5670] },
    { name: "Mussoorie", coords: [30.4598, 78.0664] },
    { name: "Nainital", coords: [29.3919, 79.4542] },
    { name: "Rishikesh", coords: [30.0869, 78.2676] },
    { name: "Haridwar", coords: [29.9457, 78.1642] },
    { name: "Corbett", coords: [29.5300, 78.7747] },
    { name: "Agra", coords: [27.1767, 78.0081] },
    { name: "Mathura", coords: [27.4924, 77.6737] },
    { name: "Vrindavan", coords: [27.5650, 77.6593] },
    { name: "Morni Hills", coords: [30.6953, 77.0863] },
    { name: "Kurukshetra", coords: [29.9695, 76.8227] },
    { name: "Gurugram", coords: [28.4595, 77.0266] },
    { name: "Amritsar", coords: [31.6340, 74.8723] },
    { name: "Ranthambore", coords: [26.0173, 76.5026] },
    { name: "Jaipur", coords: [26.9124, 75.7873] },
    { name: "Udaipur", coords: [24.5854, 73.7125] },
    { name: "Jaisalmer", coords: [26.9157, 70.9083] },
    { name: "Mount Abu", coords: [24.5926, 72.7156] }
  ];

  if (searchParams.get("all") === "true") {
    try {
      const lats = mapDestinations.map(d => d.coords[0]).join(',');
      const lngs = mapDestinations.map(d => d.coords[1]).join(',');
      
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
      const data = await res.json();
      
      const allWeather = mapDestinations.map((dest, index) => {
        const itemData = Array.isArray(data) ? data[index] : data;
        if (!itemData || !itemData.current) return null;
        
        const current = itemData.current;
        const daily = itemData.daily;
        const { condition, icon } = getWeatherInfo(current.weather_code);
        
        const forecast = [];
        for (let i = 0; i < 5; i++) {
          let dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : `Day ${i + 1}`;
          const { icon: dIcon } = getWeatherInfo(daily.weather_code[i]);
          forecast.push({
            day: dayName,
            high: Math.round(daily.temperature_2m_max[i]),
            low: Math.round(daily.temperature_2m_min[i]),
            condition: dIcon
          });
        }
        
        return {
          location: dest.name,
          temp: Math.round(current.temperature_2m),
          feelsLike: Math.round(current.apparent_temperature),
          humidity: current.relative_humidity_2m,
          wind: Math.round(current.wind_speed_10m),
          condition,
          icon,
          forecast,
          updatedAt: new Date().toISOString()
        };
      }).filter(Boolean);
      
      return NextResponse.json({ weatherList: allWeather });
    } catch (e) {
      console.error("Weather API Error:", e);
      return NextResponse.json({ error: "Failed to fetch live weather" }, { status: 500 });
    }
  }

  // Fallback for single location (not used currently since dashboard requests all)
  return NextResponse.json({ location, error: "Use ?all=true to fetch live data." });
}
