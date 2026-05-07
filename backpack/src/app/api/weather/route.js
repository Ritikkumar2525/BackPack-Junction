import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const location = searchParams.get("location") || "Kedarnath";

  // Weather data for Himalayan destinations
  const weatherData = {
    "Kedarnath": { temp: 4, feelsLike: -1, humidity: 78, wind: 22, condition: "Partly Cloudy", icon: "⛅", forecast: [
      { day: "Today", high: 6, low: -2, condition: "⛅" },
      { day: "Tomorrow", high: 8, low: 0, condition: "☀️" },
      { day: "Day 3", high: 3, low: -4, condition: "🌧️" },
      { day: "Day 4", high: 5, low: -3, condition: "⛅" },
      { day: "Day 5", high: 7, low: -1, condition: "☀️" },
    ]},
    "Kaza, Spiti": { temp: -2, feelsLike: -8, humidity: 25, wind: 35, condition: "Clear Sky", icon: "☀️", forecast: [
      { day: "Today", high: 5, low: -8, condition: "☀️" },
      { day: "Tomorrow", high: 3, low: -10, condition: "☀️" },
      { day: "Day 3", high: 2, low: -12, condition: "⛅" },
      { day: "Day 4", high: 4, low: -9, condition: "☀️" },
      { day: "Day 5", high: 6, low: -7, condition: "☀️" },
    ]},
    "Srinagar": { temp: 18, feelsLike: 16, humidity: 65, wind: 12, condition: "Sunny", icon: "☀️", forecast: [
      { day: "Today", high: 22, low: 12, condition: "☀️" },
      { day: "Tomorrow", high: 20, low: 11, condition: "⛅" },
      { day: "Day 3", high: 19, low: 10, condition: "🌧️" },
      { day: "Day 4", high: 21, low: 12, condition: "☀️" },
      { day: "Day 5", high: 23, low: 13, condition: "☀️" },
    ]},
    "Manali": { temp: 12, feelsLike: 9, humidity: 55, wind: 18, condition: "Partly Cloudy", icon: "⛅", forecast: [
      { day: "Today", high: 16, low: 5, condition: "⛅" },
      { day: "Tomorrow", high: 18, low: 6, condition: "☀️" },
      { day: "Day 3", high: 14, low: 4, condition: "🌧️" },
      { day: "Day 4", high: 15, low: 5, condition: "⛅" },
      { day: "Day 5", high: 17, low: 7, condition: "☀️" },
    ]},
  };

  const weather = weatherData[location] || weatherData["Kedarnath"];

  return NextResponse.json({
    location,
    ...weather,
    updatedAt: new Date().toISOString(),
  });
}
