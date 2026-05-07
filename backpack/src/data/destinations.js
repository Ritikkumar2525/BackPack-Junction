export const destinations = [
  {
    id: "kashmir",
    name: "Kashmir",
    tagline: "Paradise on Earth",
    description:
      "Float on pristine Dal Lake, trek through meadows of wildflowers, and witness the snow-capped peaks that have inspired poets for centuries.",
    image:
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
    bestSeason: "March - October",
    difficulty: "Easy",
    altitude: "1,585m",
    duration: "5-7 Days",
    temperature: "2°C - 31°C",
    rating: 4.9,
    price: 12999,
    category: ["Spiritual", "Adventure", "Scenic"],
  },
  {
    id: "manali",
    name: "Manali",
    tagline: "Valley of the Gods",
    description:
      "Adventure capital of India — from Solang Valley snowboarding to Old Manali cafés perched above the rushing Beas River.",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    bestSeason: "October - June",
    difficulty: "Moderate",
    altitude: "2,050m",
    duration: "4-6 Days",
    temperature: "-7°C - 25°C",
    rating: 4.8,
    price: 8999,
    category: ["Adventure", "Trekking", "Snow"],
  },
  {
    id: "banaras",
    name: "Banaras",
    tagline: "City of Light",
    description:
      "The oldest living city in the world — witness the eternal Ganga Aarti, lose yourself in ancient lanes, and find spiritual awakening.",
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
    bestSeason: "October - March",
    difficulty: "Easy",
    altitude: "80m",
    duration: "3-5 Days",
    temperature: "5°C - 42°C",
    rating: 4.7,
    price: 6999,
    category: ["Spiritual", "Cultural", "Heritage"],
  },
  {
    id: "kedarnath",
    name: "Kedarnath",
    tagline: "Abode of Lord Shiva",
    description:
      "A pilgrimage that transforms souls — 16km trek through breathtaking landscapes to one of the holiest Jyotirlingas at 3,583m.",
    image:
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
    bestSeason: "May - June, Sep - Oct",
    difficulty: "Challenging",
    altitude: "3,583m",
    duration: "5-7 Days",
    temperature: "-8°C - 17°C",
    rating: 4.9,
    price: 9999,
    category: ["Spiritual", "Trekking", "Pilgrimage"],
  },
  {
    id: "spiti-valley",
    name: "Spiti Valley",
    tagline: "The Middle Land",
    description:
      "A cold desert mountain valley suspended between Tibet and India — moonlike landscapes, ancient monasteries, and starry skies.",
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80",
    bestSeason: "June - September",
    difficulty: "Challenging",
    altitude: "3,800m",
    duration: "8-10 Days",
    temperature: "-20°C - 20°C",
    rating: 4.8,
    price: 15999,
    category: ["Adventure", "Remote", "Scenic"],
  },
  {
    id: "leh-ladakh",
    name: "Leh Ladakh",
    tagline: "Land of High Passes",
    description:
      "Ride through the highest motorable passes, camp by pristine Pangong Lake, and experience raw Himalayan wilderness.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    bestSeason: "June - September",
    difficulty: "Extreme",
    altitude: "3,524m",
    duration: "7-10 Days",
    temperature: "-14°C - 25°C",
    rating: 4.9,
    price: 18999,
    category: ["Adventure", "Biking", "Extreme"],
  },
  {
    id: "tungnath",
    name: "Tungnath",
    tagline: "Highest Shiva Temple",
    description:
      "The highest Shiva temple in the world at 3,680m — a short but magical trek through rhododendron forests to Chandrashila peak.",
    image:
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
    bestSeason: "April - June, Sep - Nov",
    difficulty: "Moderate",
    altitude: "3,680m",
    duration: "3-4 Days",
    temperature: "-5°C - 15°C",
    rating: 4.8,
    price: 5999,
    category: ["Trekking", "Spiritual", "Nature"],
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    tagline: "Land of the Gods",
    description:
      "Dev Bhoomi — from the Valley of Flowers to Rishikesh rapids, every corner holds divine beauty and adventure.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    bestSeason: "March - June, Sep - Nov",
    difficulty: "Moderate",
    altitude: "Varies",
    duration: "5-8 Days",
    temperature: "-2°C - 35°C",
    rating: 4.7,
    price: 7999,
    category: ["Spiritual", "Adventure", "Nature"],
  },
  {
    id: "himachal",
    name: "Himachal",
    tagline: "Abode of Snow",
    description:
      "From Shimla's colonial charm to Kasol's hippie trails — Himachal Pradesh is a tapestry of cultures, mountains, and stories.",
    image:
      "https://images.unsplash.com/photo-1580289437401-1a5b5be2dbe0?w=800&q=80",
    bestSeason: "March - June",
    difficulty: "Easy",
    altitude: "Varies",
    duration: "4-7 Days",
    temperature: "-5°C - 30°C",
    rating: 4.8,
    price: 8499,
    category: ["Scenic", "Adventure", "Culture"],
  },
];

export const stats = [
  { value: 10000, suffix: "+", label: "Happy Travelers", icon: "🏔️" },
  { value: 500, suffix: "+", label: "Trips Completed", icon: "🎒" },
  { value: 4.9, suffix: "", label: "Average Rating", icon: "⭐" },
  { value: 100, suffix: "+", label: "Destinations", icon: "📍" },
];

export const upcomingTrips = [
  {
    id: "trip-1",
    title: "Kedarnath Spiritual Trek",
    destination: "Kedarnath",
    image:
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80",
    departureDate: "2026-06-15",
    duration: "6 Days",
    totalSeats: 25,
    bookedSeats: 18,
    price: 9999,
    difficulty: "Challenging",
    highlights: ["Temple Darshan", "Helicopter Option", "Guided Trek"],
  },
  {
    id: "trip-2",
    title: "Spiti Valley Road Trip",
    destination: "Spiti Valley",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    departureDate: "2026-07-01",
    duration: "9 Days",
    totalSeats: 15,
    bookedSeats: 11,
    price: 15999,
    difficulty: "Extreme",
    highlights: ["Key Monastery", "Chandratal Lake", "Kunzum Pass"],
  },
  {
    id: "trip-3",
    title: "Kashmir Paradise Escape",
    destination: "Kashmir",
    image:
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
    departureDate: "2026-06-20",
    duration: "5 Days",
    totalSeats: 20,
    bookedSeats: 14,
    price: 12999,
    difficulty: "Easy",
    highlights: ["Dal Lake Stay", "Gondola Ride", "Mughal Gardens"],
  },
  {
    id: "trip-4",
    title: "Leh Ladakh Bike Expedition",
    destination: "Leh Ladakh",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    departureDate: "2026-07-10",
    duration: "10 Days",
    totalSeats: 12,
    bookedSeats: 9,
    price: 18999,
    difficulty: "Extreme",
    highlights: ["Khardung La", "Pangong Lake", "Nubra Valley"],
  },
];

export const testimonials = [
  {
    id: "1",
    name: "Arjun Mehta",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "Mumbai",
    trip: "Kedarnath Trek",
    rating: 5,
    quote:
      "This wasn't just a trip — it was a spiritual awakening. The guides knew every trail, every story, every hidden waterfall. I came back a different person.",
    date: "March 2026",
  },
  {
    id: "2",
    name: "Priya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "Delhi",
    trip: "Spiti Valley",
    rating: 5,
    quote:
      "The Spiti road trip was like entering another planet. The team handled everything — from permits to camping under stars at Chandratal. Absolutely magical.",
    date: "February 2026",
  },
  {
    id: "3",
    name: "Rohan Kapoor",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    location: "Bangalore",
    trip: "Leh Ladakh",
    rating: 5,
    quote:
      "Riding through Khardung La at 18,380 ft with this crew was the peak of my life. The planning, the bonfire nights, the camaraderie — unforgettable.",
    date: "January 2026",
  },
  {
    id: "4",
    name: "Ananya Gupta",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    location: "Pune",
    trip: "Kashmir Escape",
    rating: 5,
    quote:
      "Kashmir through BackPack's eyes is a completely different experience. The houseboat, the shikara ride at sunset, the local cuisine — pure paradise.",
    date: "December 2025",
  },
  {
    id: "5",
    name: "Vikram Singh",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    location: "Jaipur",
    trip: "Manali Adventure",
    rating: 5,
    quote:
      "Solo traveler here, but I never felt alone. The group vibes were incredible, and the Old Manali nights with live music and bonfires — chef's kiss.",
    date: "November 2025",
  },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Trips", href: "/trips" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
