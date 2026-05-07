/**
 * Trips data store — comprehensive trip info for BackPack Junction.
 * Each trip includes: itinerary, captain, kit, route, emergency contacts.
 */

const trips = new Map();

const tripData = [
  {
    id: "kedarnath-spiritual-trek",
    title: "Kedarnath Spiritual Trek",
    destination: "Kedarnath",
    slug: "kedarnath",
    image: "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    price: 12999,
    duration: "6 Days / 5 Nights",
    difficulty: "Challenging",
    altitude: "3,583m",
    groupSize: 25,
    booked: 18,
    departureDate: "2026-06-15",
    returnDate: "2026-06-20",
    status: "upcoming",
    description: "Experience the divine energy of Kedarnath, one of the 12 Jyotirlingas. Trek through breathtaking valleys, ancient forests, and witness the majestic Mandakini river along the way.",
    highlights: [
      "Visit the sacred Kedarnath Temple at 3,583m",
      "Trek through Gaurikund to Kedarnath (16km)",
      "Witness sunrise at Chorabari Tal (Gandhi Sarovar)",
      "Evening aarti at Kedarnath Temple",
      "Visit Bhairavnath Temple",
    ],
    itinerary: [
      { day: 1, title: "Delhi to Haridwar", description: "Depart from Delhi at 6 AM. Reach Haridwar by afternoon. Visit Har Ki Pauri for Ganga Aarti. Overnight stay at riverside camp.", distance: "230 km", transport: "AC Tempo Traveler" },
      { day: 2, title: "Haridwar to Guptkashi", description: "Early morning departure. Drive through scenic Devprayag and Rudraprayag. Reach Guptkashi by evening. Visit Vishwanath Temple.", distance: "195 km", transport: "AC Tempo Traveler" },
      { day: 3, title: "Guptkashi to Gaurikund to Kedarnath", description: "Drive to Gaurikund (30 km). Begin the sacred trek to Kedarnath (16 km). Trek through lush forests and mountain trails. Reach Kedarnath by evening.", distance: "16 km trek", transport: "On foot" },
      { day: 4, title: "Kedarnath Exploration", description: "Early morning temple darshan. Visit Chorabari Tal (Gandhi Sarovar). Explore Bhairavnath Temple. Evening aarti ceremony. Rest and acclimatization.", distance: "5 km", transport: "On foot" },
      { day: 5, title: "Kedarnath to Guptkashi", description: "Early morning trek down to Gaurikund. Drive back to Guptkashi. Rest and shopping. Farewell dinner with team.", distance: "16 km trek + 30 km drive", transport: "On foot + Vehicle" },
      { day: 6, title: "Guptkashi to Delhi", description: "Early morning departure. Drive back through scenic routes. Reach Delhi by late evening. Trip ends with lifelong memories.", distance: "425 km", transport: "AC Tempo Traveler" },
    ],
    captain: {
      name: "Vikram Singh",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      experience: "8 years",
      tripsLed: 156,
      rating: 4.9,
      speciality: "High Altitude Treks",
      phone: "+91 98765 11111",
      certifications: ["Wilderness First Responder", "Mountain Leadership Certificate", "Basic Life Support"],
    },
    kit: [
      { item: "Trekking Backpack (50-60L)", provided: false, essential: true },
      { item: "Trekking Shoes (Waterproof)", provided: false, essential: true },
      { item: "Warm Jacket / Down Jacket", provided: false, essential: true },
      { item: "Rain Poncho / Raincoat", provided: false, essential: true },
      { item: "Thermal Inner Wear (2 sets)", provided: false, essential: true },
      { item: "Woolen Socks (3 pairs)", provided: false, essential: true },
      { item: "Sunglasses (UV protected)", provided: false, essential: false },
      { item: "Sunscreen SPF 50+", provided: false, essential: false },
      { item: "Water Bottle (1L)", provided: false, essential: true },
      { item: "Personal Medical Kit", provided: false, essential: true },
      { item: "Sleeping Bag", provided: true, essential: true },
      { item: "Tent (shared 3-person)", provided: true, essential: true },
      { item: "Trekking Poles", provided: true, essential: false },
      { item: "First Aid Kit", provided: true, essential: true },
    ],
    route: {
      coordinates: [
        { lat: 28.6139, lng: 77.2090, label: "Delhi (Start)" },
        { lat: 29.9457, lng: 78.1642, label: "Haridwar" },
        { lat: 30.3165, lng: 78.7811, label: "Rudraprayag" },
        { lat: 30.5177, lng: 79.0744, label: "Guptkashi" },
        { lat: 30.5941, lng: 79.0655, label: "Gaurikund" },
        { lat: 30.7346, lng: 79.0669, label: "Kedarnath (End)" },
      ],
      totalDistance: "445 km + 16 km trek",
      estimatedTime: "12 hours drive + 8 hours trek",
    },
    emergency: {
      tripHelpline: "+91 82870 54501",
      localPolice: "01364-252100",
      nearestHospital: "District Hospital Rudraprayag — +91 01364-233100",
      ambulance: "108",
      rescueTeam: "SDRF Uttarakhand — 1070",
      altitude_sickness: "Descend immediately. Contact trip captain.",
    },
    inclusions: ["Transport (Delhi-Delhi)", "Accommodation", "Meals (Veg)", "Trekking Permits", "First Aid", "Trip Captain", "Sleeping Bags"],
    exclusions: ["Personal Expenses", "Travel Insurance", "Pony/Palki Ride", "Any entry fees not mentioned"],
    weather: { location: "Kedarnath", lat: 30.7346, lng: 79.0669 },
  },
  {
    id: "spiti-valley-road-trip",
    title: "Spiti Valley Road Trip",
    destination: "Spiti Valley",
    slug: "spiti-valley",
    image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    price: 18999,
    duration: "9 Days / 8 Nights",
    difficulty: "Extreme",
    altitude: "3,800m",
    groupSize: 15,
    booked: 11,
    departureDate: "2026-07-01",
    returnDate: "2026-07-09",
    status: "upcoming",
    description: "The cold desert of Spiti Valley — where the sky touches the earth. Drive through the most dramatic landscapes, visit ancient monasteries, and experience life in one of the remotest inhabited places on earth.",
    highlights: [
      "Visit the 1000-year-old Key Monastery",
      "World's highest post office at Hikkim",
      "Chandratal Lake camping under stars",
      "Kunzum Pass at 4,590m",
      "Stay at traditional Spitian homestays",
    ],
    itinerary: [
      { day: 1, title: "Delhi to Shimla", description: "Overnight bus from Delhi to Shimla. Arrive early morning. Explore Mall Road and Christ Church.", distance: "350 km", transport: "Volvo Bus" },
      { day: 2, title: "Shimla to Sangla", description: "Drive through Narkanda and Rampur to the beautiful Sangla Valley. Stop at Karcham for photos.", distance: "220 km", transport: "Tempo Traveler" },
      { day: 3, title: "Sangla to Chitkul to Kalpa", description: "Visit Chitkul, the last Indian village before Tibet. Drive to Kalpa with stunning Kinner Kailash views.", distance: "90 km", transport: "Tempo Traveler" },
      { day: 4, title: "Kalpa to Tabo", description: "Enter Spiti Valley via Nako Lake. Visit Tabo Monastery (1000+ years old). Caves meditation session.", distance: "170 km", transport: "Tempo Traveler" },
      { day: 5, title: "Tabo to Kaza", description: "Drive to Kaza, the sub-divisional HQ of Spiti. Visit Dhankar Monastery perched on a cliff.", distance: "50 km", transport: "Tempo Traveler" },
      { day: 6, title: "Kaza — Key, Kibber, Chicham", description: "Visit Key Monastery, Kibber village, and the thrilling Chicham Bridge. World's highest post office at Hikkim.", distance: "60 km", transport: "Tempo Traveler" },
      { day: 7, title: "Kaza to Chandratal", description: "Drive via Kunzum Pass (4,590m). Camp beside the magical Chandratal Lake. Stargazing night.", distance: "80 km", transport: "Tempo Traveler" },
      { day: 8, title: "Chandratal to Manali", description: "Cross Rohtang Pass. Drive through Atal Tunnel. Arrive in Manali. Celebration dinner.", distance: "130 km", transport: "Tempo Traveler" },
      { day: 9, title: "Manali to Delhi", description: "Overnight Volvo bus to Delhi. Trip ends. Memories forever.", distance: "540 km", transport: "Volvo Bus" },
    ],
    captain: {
      name: "Aarav Thakur",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      experience: "6 years",
      tripsLed: 89,
      rating: 4.8,
      speciality: "Road Expeditions & Cold Deserts",
      phone: "+91 98765 22222",
      certifications: ["4x4 Off-Road Driving", "Wilderness First Aid", "High Altitude Medicine"],
    },
    kit: [
      { item: "Warm Jacket / Down Jacket", provided: false, essential: true },
      { item: "Thermal Inner Wear (3 sets)", provided: false, essential: true },
      { item: "Trekking/Hiking Shoes", provided: false, essential: true },
      { item: "Sunglasses (Category 4)", provided: false, essential: true },
      { item: "Sunscreen SPF 50+", provided: false, essential: true },
      { item: "Personal Medicine Kit", provided: false, essential: true },
      { item: "Powerbank (10,000 mAh+)", provided: false, essential: true },
      { item: "Cash (ATMs rare)", provided: false, essential: true },
      { item: "Sleeping Bag (-10°C)", provided: true, essential: true },
      { item: "Tent at Chandratal", provided: true, essential: true },
    ],
    route: {
      coordinates: [
        { lat: 28.6139, lng: 77.2090, label: "Delhi" },
        { lat: 31.1048, lng: 77.1734, label: "Shimla" },
        { lat: 31.4230, lng: 78.2651, label: "Sangla" },
        { lat: 31.5401, lng: 78.2582, label: "Chitkul" },
        { lat: 31.5310, lng: 78.3082, label: "Kalpa" },
        { lat: 32.0935, lng: 78.3868, label: "Tabo" },
        { lat: 32.2296, lng: 78.0715, label: "Kaza" },
        { lat: 32.4600, lng: 77.6150, label: "Chandratal Lake" },
        { lat: 32.2396, lng: 77.1887, label: "Manali" },
      ],
      totalDistance: "1,200+ km",
      estimatedTime: "40+ hours total drive time",
    },
    emergency: {
      tripHelpline: "+91 82870 54501",
      localPolice: "01906-222233",
      nearestHospital: "PHC Kaza — +91 01906-222266",
      ambulance: "108",
      rescueTeam: "ITBP Rescue — 01906-222244",
      altitude_sickness: "Descend to lower altitude. Administer Diamox if available.",
    },
    inclusions: ["Transport", "Accommodation (Hotels + Camps)", "Meals", "All permits", "First Aid", "Trip Captain"],
    exclusions: ["Personal Expenses", "Travel Insurance", "Monastery Donations", "Pony Rides"],
    weather: { location: "Kaza, Spiti", lat: 32.2296, lng: 78.0715 },
  },
  {
    id: "kashmir-paradise-tour",
    title: "Kashmir Paradise Tour",
    destination: "Kashmir",
    slug: "kashmir",
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80",
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
    ],
    price: 14999,
    duration: "7 Days / 6 Nights",
    difficulty: "Easy",
    altitude: "1,585m",
    groupSize: 30,
    booked: 22,
    departureDate: "2026-06-20",
    returnDate: "2026-06-26",
    status: "upcoming",
    description: "Discover why Kashmir is called Paradise on Earth. From Mughal Gardens to Dal Lake shikaras, from Gulmarg meadows to Pahalgam valleys — experience the most beautiful landscape in India.",
    highlights: [
      "Shikara ride on Dal Lake at sunset",
      "Gondola ride in Gulmarg (Phase 1 & 2)",
      "Betaab Valley & Aru Valley exploration",
      "Stay in traditional Kashmiri Houseboats",
      "Visit Mughal Gardens — Nishat, Shalimar, Chashme Shahi",
    ],
    itinerary: [
      { day: 1, title: "Arrival in Srinagar", description: "Airport pickup. Check-in to houseboat on Dal Lake. Evening shikara ride. Welcome dinner with Wazwan cuisine.", distance: "Airport transfer", transport: "Private Vehicle" },
      { day: 2, title: "Srinagar — Mughal Gardens", description: "Visit Nishat Bagh, Shalimar Bagh, Chashme Shahi. Afternoon at Shankaracharya Temple for panoramic views.", distance: "25 km", transport: "Private Vehicle" },
      { day: 3, title: "Srinagar to Gulmarg", description: "Drive to Gulmarg (Meadow of Flowers). Gondola ride Phase 1 & 2. Enjoy snow activities. Return to Srinagar.", distance: "50 km", transport: "Private Vehicle" },
      { day: 4, title: "Srinagar to Pahalgam", description: "Drive to Pahalgam (Valley of Shepherds). Visit Betaab Valley and Aru Valley. Riverside picnic.", distance: "90 km", transport: "Private Vehicle" },
      { day: 5, title: "Pahalgam Exploration", description: "Horse riding to Baisaran (Mini Switzerland). Visit Lidder River. Local market exploration.", distance: "15 km", transport: "Horse + Walking" },
      { day: 6, title: "Pahalgam to Srinagar", description: "Drive back via Awantipora ruins. Evening at Boulevard Road. Farewell dinner on houseboat.", distance: "90 km", transport: "Private Vehicle" },
      { day: 7, title: "Departure", description: "Morning Dal Lake walk. Airport drop. Trip ends.", distance: "Airport transfer", transport: "Private Vehicle" },
    ],
    captain: {
      name: "Faisal Ahmed",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      experience: "10 years",
      tripsLed: 230,
      rating: 4.95,
      speciality: "Kashmir & Cultural Tours",
      phone: "+91 98765 33333",
      certifications: ["Tourism Management Diploma", "First Aid Certified", "Licensed Tour Guide J&K"],
    },
    kit: [
      { item: "Light Warm Jacket", provided: false, essential: true },
      { item: "Comfortable Walking Shoes", provided: false, essential: true },
      { item: "Sunscreen & Sunglasses", provided: false, essential: false },
      { item: "Rain Jacket (light)", provided: false, essential: false },
      { item: "Camera / Phone with storage", provided: false, essential: false },
      { item: "Personal Medicines", provided: false, essential: true },
    ],
    route: {
      coordinates: [
        { lat: 34.0837, lng: 74.7973, label: "Srinagar" },
        { lat: 34.0484, lng: 74.3805, label: "Gulmarg" },
        { lat: 34.0161, lng: 75.3150, label: "Pahalgam" },
      ],
      totalDistance: "~300 km",
      estimatedTime: "8 hours total",
    },
    emergency: {
      tripHelpline: "+91 82870 54501",
      localPolice: "0194-2452000",
      nearestHospital: "SKIMS Srinagar — 0194-2401013",
      ambulance: "108",
      rescueTeam: "SDRF J&K — 112",
      altitude_sickness: "Not applicable — low altitude destination.",
    },
    inclusions: ["Airport Transfers", "Houseboat Stay", "Hotel Accommodation", "All Meals", "Shikara Ride", "Gondola Ticket", "Trip Captain"],
    exclusions: ["Flights", "Personal Expenses", "Horse Riding", "Pony Ride charges", "Travel Insurance"],
    weather: { location: "Srinagar", lat: 34.0837, lng: 74.7973 },
  },
  {
    id: "manali-adventure-camp",
    title: "Manali Adventure Camp",
    destination: "Manali",
    slug: "manali",
    image: "https://images.unsplash.com/photo-1626686007697-5f0c9100e449?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626686007697-5f0c9100e449?w=800&q=80",
    ],
    price: 8999,
    duration: "4 Days / 3 Nights",
    difficulty: "Moderate",
    altitude: "2,050m",
    groupSize: 20,
    booked: 14,
    departureDate: "2026-06-10",
    returnDate: "2026-06-13",
    status: "upcoming",
    description: "Adventure awaits in the valley of the gods. Paragliding over Solang, river rafting on Beas, and trekking to Jogini Falls — Manali is the ultimate adventure hub.",
    highlights: [
      "Paragliding in Solang Valley",
      "River Rafting on Beas River",
      "Jogini Waterfall Trek",
      "Old Manali exploration & cafes",
      "Hadimba Temple visit",
    ],
    itinerary: [
      { day: 1, title: "Delhi to Manali", description: "Overnight Volvo bus. Arrive Manali by morning. Check-in. Explore Old Manali & Hadimba Temple.", distance: "540 km", transport: "Volvo Bus" },
      { day: 2, title: "Solang Valley Adventures", description: "Paragliding, zorbing, and snow activities. Afternoon river rafting on Beas River (14 km). Evening bonfire.", distance: "20 km", transport: "Private Vehicle" },
      { day: 3, title: "Jogini Falls Trek & Exploration", description: "Morning trek to Jogini Waterfall (3 km). Visit Vashisht Hot Springs. Mall Road shopping. Farewell dinner.", distance: "10 km", transport: "On foot + Vehicle" },
      { day: 4, title: "Manali to Delhi", description: "Morning free time. Departure by Volvo bus. Arrive Delhi by night.", distance: "540 km", transport: "Volvo Bus" },
    ],
    captain: {
      name: "Priya Sharma",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
      experience: "5 years",
      tripsLed: 112,
      rating: 4.85,
      speciality: "Adventure Sports & Group Activities",
      phone: "+91 98765 44444",
      certifications: ["Adventure Tourism Guide", "CPR & First Aid", "River Rafting Instructor"],
    },
    kit: [
      { item: "Comfortable Trekking Shoes", provided: false, essential: true },
      { item: "Light Jacket / Fleece", provided: false, essential: true },
      { item: "Quick-dry clothes for rafting", provided: false, essential: true },
      { item: "Sunscreen & Sunglasses", provided: false, essential: false },
      { item: "Life Jacket (for rafting)", provided: true, essential: true },
      { item: "Helmet (for rafting)", provided: true, essential: true },
    ],
    route: {
      coordinates: [
        { lat: 28.6139, lng: 77.2090, label: "Delhi" },
        { lat: 32.2396, lng: 77.1887, label: "Manali" },
        { lat: 32.3175, lng: 77.1590, label: "Solang Valley" },
      ],
      totalDistance: "~540 km one way",
      estimatedTime: "12 hours",
    },
    emergency: {
      tripHelpline: "+91 82870 54501",
      localPolice: "01902-252340",
      nearestHospital: "Lady Willingdon Hospital Manali — 01902-252049",
      ambulance: "108",
      rescueTeam: "SDRF HP — 1077",
      altitude_sickness: "Unlikely at this altitude.",
    },
    inclusions: ["Volvo Bus (Delhi-Manali-Delhi)", "Accommodation", "Meals", "Paragliding", "River Rafting", "All Activities", "Trip Captain"],
    exclusions: ["Personal Expenses", "Travel Insurance", "Extra adventure activities"],
    weather: { location: "Manali", lat: 32.2396, lng: 77.1887 },
  },
];

// Initialize trips
tripData.forEach((trip) => trips.set(trip.id, trip));

export function getTrip(id) {
  return trips.get(id) || null;
}

export function getAllTrips() {
  return Array.from(trips.values());
}

export function getUpcomingTrips() {
  return getAllTrips().filter((t) => t.status === "upcoming");
}

export function createTrip(tripData) {
  const id = tripData.id || `trip-${Date.now()}`;
  const trip = { ...tripData, id };
  trips.set(id, trip);
  return trip;
}

export function updateTrip(id, updates) {
  const trip = trips.get(id);
  if (!trip) return null;
  const updated = { ...trip, ...updates };
  trips.set(id, updated);
  return updated;
}

export function deleteTrip(id) {
  return trips.delete(id);
}
