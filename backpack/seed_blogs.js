import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://localhost:27017/backpack";

const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  content: String,
  coverImage: String,
  author: String,
  category: String,
  tags: [String],
  isFeatured: Boolean,
  status: String,
  readTime: Number,
  views: Number,
  seoTitle: String,
  seoDescription: String
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

const blogPosts = [
  {
    title: "The Complete Kedarnath Trek Guide 2026",
    slug: "the-complete-kedarnath-trek-guide-2026",
    excerpt: "Everything you need to know before embarking on the sacred 16km trek — fitness prep, packing, route options, and hidden gems along the way.",
    content: `
<h2>Overview</h2>
<p>The Kedarnath Trek is not just a physical journey; it is a spiritual awakening. Nestled at an altitude of 3,583 meters in the Garhwal Himalayas, the Kedarnath Temple stands as a testament to faith and resilience. The 16km trek from Gaurikund to Kedarnath is a blend of breathtaking mountain vistas, steep ascents, and the rhythmic chanting of fellow pilgrims.</p>

<h2>Best Time to Visit</h2>
<p>The temple opens during the auspicious occasion of Akshaya Tritiya (April/May) and closes on Bhai Dooj (October/November). The absolute best months for the trek are <strong>May to June</strong> and <strong>September to October</strong>. We strongly advise against trekking during the monsoon (July-August) due to frequent landslides and slippery trails.</p>

<h2>Difficulty Level & Fitness Requirements</h2>
<p><strong>Difficulty: Moderate to Difficult</strong></p>
<p>The steep incline demands good cardiovascular endurance. To prepare, start your fitness routine at least a month prior. Focus on:<br>
• Brisk walking or jogging for 4-5 km daily<br>
• Stair climbing (10-15 minutes a day)<br>
• Basic stretching and core exercises</p>

<h2>Weather Conditions</h2>
<ul>
  <li><strong>Summer (May-June):</strong> Pleasant days (15°C to 20°C), cool nights (5°C to 10°C).</li>
  <li><strong>Autumn (Sep-Oct):</strong> Chilly days (10°C to 15°C), freezing nights (0°C to -5°C).</li>
</ul>

<h2>Packing Essentials</h2>
<ul>
  <li><strong>Clothing:</strong> Moisture-wicking base layers, fleece jacket, windproof/waterproof jacket, and thermal innerwear.</li>
  <li><strong>Footwear:</strong> Sturdy, well-broken-in trekking shoes with good grip and ankle support. Woolen socks are a must.</li>
  <li><strong>Gear:</strong> Trekking pole, headlamp, UV-protection sunglasses, and a comfortable 30-40L backpack.</li>
  <li><strong>Medical:</strong> Basic first-aid kit, altitude sickness medication (Diamox), painkillers, and personal medications.</li>
</ul>

<h2>Transportation & Itinerary</h2>
<p><strong>Starting Point:</strong> Haridwar/Rishikesh<br>
<strong>Base Camp:</strong> Gaurikund</p>
<p>Most travelers hire a taxi or take a shared jeep from Haridwar/Rishikesh to Sonprayag (approx. 8-9 hours). From Sonprayag, local shuttles take you to Gaurikund, where the 16km trek begins. You can complete the trek in a single day (6-8 hours) or take a break at Lincholi.</p>

<h2>Accommodation & Food</h2>
<p>There are GMVN guest houses, private tents, and dharamshalas at the Kedarnath base camp. It is highly recommended to book your stay well in advance, especially during peak season. Along the trek route, you will find numerous small stalls serving Maggi, parathas, hot tea, and basic thalis. Prices increase as you gain altitude.</p>

<h2>Safety Tips</h2>
<ul>
  <li>Pace yourself. Do not rush the ascent.</li>
  <li>Stay hydrated. Drink plenty of water throughout the trek.</li>
  <li>Respect the mountains. Do not litter and stick to the designated trail.</li>
  <li>Listen to your body. If you experience symptoms of AMS (Acute Mountain Sickness) like severe headache or nausea, descend immediately.</li>
</ul>
    `,
    coverImage: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=1200&q=80",
    category: "Trek Guide",
    author: "Arjun Nair",
    readTime: 12,
    isFeatured: true,
    status: "published",
    tags: ["kedarnath", "trekking", "himalayas", "spiritual"],
    views: 1450,
    seoTitle: "Complete Kedarnath Trek Guide 2026 | Route, Packing & Tips",
    seoDescription: "The ultimate guide to the Kedarnath Trek in 2026. Discover the route, best time to visit, weather, packing essentials, and fitness tips."
  },
  {
    title: "10 Hidden Gems in Spiti Valley You Must Visit",
    slug: "10-hidden-gems-in-spiti-valley",
    excerpt: "Beyond Key Monastery and Chandratal — discover Spiti's secret villages, ancient caves, and trails that most tourists never find.",
    content: `
<h2>The Untold Spiti</h2>
<p>While the iconic Key Monastery and the crescent-shaped Chandratal Lake dominate Instagram feeds, the true magic of Spiti Valley lies hidden in its remote villages, ancient meditation caves, and desolate mountain trails. Here are the hidden gems you shouldn't miss.</p>

<h2>1. Demul Village</h2>
<p>Demul is a sustainable, eco-friendly village that operates a strict homestay rotation policy. This ensures equal income distribution among villagers and provides an authentic, unbiased cultural experience. The view of the Milky Way from here is unmatched.</p>

<h2>2. Dhankar Lake Trek</h2>
<p>Most visitors stop at the Dhankar Monastery, but a breathless 45-minute trek uphill takes you to Dhankar Lake. The pristine, aquamarine lake set against the barren, eroded landscape is surreal.</p>

<h2>3. Lhalung Monastery</h2>
<p>Known as the 'Golden Temple' of Spiti, Lhalung is older and less commercialized than Tabo Monastery. Local legends claim that the complex was built in a single night by angels.</p>

<h2>4. Langza's Fossil Hunting</h2>
<p>While the giant Buddha statue is famous, the real hidden gem in Langza is the abundance of marine fossils (Ammonites) dating back millions of years when the Himalayas were under the Tethys Sea.</p>

<h2>5. Giu Mummy</h2>
<p>In the tiny village of Giu, near the Indo-Tibet border, sits the naturally preserved mummy of a Buddhist monk, Sangha Tenzin, believed to be over 500 years old. It's an eerie yet fascinating sight.</p>

<h2>Best Time to Explore</h2>
<p><strong>June to September</strong> is the ideal window. During these months, the roads connecting Manali and Kaza are fully open, and the weather is bearable (15°C during the day, dipping to 0°C at night).</p>

<h2>Travel Tips & Logistics</h2>
<ul>
  <li><strong>Permits:</strong> Indian citizens do not need permits for the standard Spiti circuit. Foreign nationals require an Inner Line Permit.</li>
  <li><strong>Connectivity:</strong> BSNL is the only network that barely works here. Prepare for a digital detox.</li>
  <li><strong>Cash:</strong> ATMs are virtually non-existent beyond Kaza. Carry sufficient cash.</li>
  <li><strong>Altitude:</strong> Spiti sits high (avg. 12,500 ft). Acclimatize properly in Kalpa or Kaza before exploring further.</li>
</ul>

<h2>Local Cuisine</h2>
<p>Don't leave without trying authentic Spitian food: Thukpa (noodle soup), Momos, Tingmo (steamed bread), and Butter Tea. Sea buckthorn juice is a local specialty rich in vitamins.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    category: "Hidden Destinations",
    author: "Riya Sharma",
    readTime: 8,
    isFeatured: false,
    status: "published",
    tags: ["spiti", "hidden gems", "offbeat", "himalayas"],
    views: 890,
    seoTitle: "10 Hidden Gems in Spiti Valley | Offbeat Himalayan Travel",
    seoDescription: "Discover the secret villages, ancient caves, and offbeat trails of Spiti Valley beyond the usual tourist spots."
  },
  {
    title: "Solo Female Travel in the Himalayas: A Honest Guide",
    slug: "solo-female-travel-in-the-himalayas",
    excerpt: "Real talk about safety, logistics, and the transformative experience of exploring the mountains alone as a woman.",
    content: `
<h2>Why the Himalayas?</h2>
<p>Traveling solo as a woman is empowering, but doing it in the Himalayas is transformative. The mountain communities are known for their warmth, hospitality, and respect. However, traversing remote terrains requires preparation, intuition, and practical knowledge.</p>

<h2>Is it Safe?</h2>
<p>Statistically and experientially, the Indian Himalayas (Himachal, Uttarakhand, Ladakh) are incredibly safe for solo female travelers. Crime rates against tourists are low. However, "safe" doesn't mean "careless."</p>

<h2>Essential Safety Tips</h2>
<ul>
  <li><strong>Share Your Itinerary:</strong> Always let your homestay host or a trusted friend know your daily plans, especially before heading out on a hike.</li>
  <li><strong>Trust Your Gut:</strong> If a situation, a trail, or a person feels off, walk away. Your intuition is your best guide.</li>
  <li><strong>Dress Culturally Appropriate:</strong> While the mountains are chill, traditional villages appreciate modesty. Dress in layers.</li>
  <li><strong>Arrive Before Dark:</strong> Always aim to reach your destination by 4 PM. Mountain roads are unpredictable after sunset.</li>
</ul>

<h2>Navigating Transportation</h2>
<p>Public HRTC or UTC buses are the lifelines of the mountains. They are safe, cheap, and offer a great way to interact with locals. For remote areas, shared taxis (Sumos/Boleros) are the norm. Always try to grab a window seat, and don't hesitate to sit next to other local women.</p>

<h2>Choosing Accommodation</h2>
<p>Opt for homestays over commercial hotels. Not only does this support the local economy, but you also get a "mountain family" looking out for you. Platforms like Airbnb or specialized trekking groups are great for finding vetted homestays.</p>

<h2>Packing for Solo Travel</h2>
<p>Pack light. You will be carrying your own luggage on steep slopes. Essentials include:<br>
• A reliable power bank (cold drains batteries fast)<br>
• A versatile scarf or shawl<br>
• Basic self-defense items (pepper spray, just for peace of mind)<br>
• A journal and a good book</p>

<h2>The Emotional Journey</h2>
<p>You will face moments of loneliness, exhaustion, and doubt. But pushing past these will reward you with unparalleled self-confidence and a deep connection to the mountains. The Himalayas teach you that you are much stronger than you think.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    category: "Travel Tips",
    author: "Priya Desai",
    readTime: 10,
    isFeatured: false,
    status: "published",
    tags: ["solo travel", "female travel", "tips", "himalayas"],
    views: 2200,
    seoTitle: "Solo Female Travel Guide to the Himalayas | Safety & Tips",
    seoDescription: "An honest guide to solo female travel in the Himalayas covering safety, transportation, packing, and homestays."
  },
  {
    title: "Banaras: A Spiritual Journey Beyond the Ghats",
    slug: "banaras-spiritual-journey-beyond-ghats",
    excerpt: "The ancient city holds secrets in every lane. From hidden temples to midnight aarti — experience Kashi like a local.",
    content: `
<h2>The City of Light</h2>
<p>Varanasi, Banaras, Kashi—the city goes by many names, but the essence remains the same: a profound confrontation with life, death, and eternity. While the grand Ganga Aarti at Dashashwamedh Ghat is a spectacle, the true pulse of Banaras beats in its labyrinthine alleys.</p>

<h2>Exploring the Ghats (The Right Way)</h2>
<p>Don't just stick to the main ghats. Start your walk from Assi Ghat in the early morning. Take a slow boat ride at sunrise to witness the city waking up. Continue your walk towards Manikarnika Ghat, the burning ghat, where the stark reality of mortality is embraced as a step towards liberation (Moksha).</p>

<h2>Hidden Temples and Akharas</h2>
<p>Beyond the Kashi Vishwanath temple, seek out the hidden shrines. The Lolark Kund, an ancient stepwell dedicated to the Sun God, is a fascinating architectural marvel. Visit a traditional Kushti Akhara (mud wrestling arena) at Tulsi Ghat in the early morning to witness an age-old physical discipline.</p>

<h2>The Culinary Trail</h2>
<p>Banaras is a haven for street food lovers. You must try:<br>
• <strong>Kachori Sabzi</strong> at Ram Bhandar for breakfast.<br>
• <strong>Malaiyyo</strong> (only in winter), a delicate, frothy milk dessert.<br>
• <strong>Blue Lassi Shop</strong>, offering dozens of lassi flavors.<br>
• A traditional <strong>Banarasi Paan</strong> to end your meal.</p>

<h2>Best Time to Visit</h2>
<p><strong>October to March</strong>. The weather is pleasant. Dev Deepawali (usually in November) is magical, with the ghats illuminated by millions of earthen lamps.</p>

<h2>Travel Tips</h2>
<ul>
  <li><strong>Navigation:</strong> Getting lost in the "Galis" (alleys) is part of the experience. Just keep walking towards the river to find your bearings.</li>
  <li><strong>Photography:</strong> Be highly respectful, especially at Manikarnika Ghat. Taking photos of cremations is strictly prohibited and highly offensive.</li>
</ul>
    `,
    coverImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80",
    category: "Spiritual Journeys",
    author: "Karan Mehta",
    readTime: 9,
    isFeatured: false,
    status: "published",
    tags: ["banaras", "varanasi", "spiritual", "india"],
    views: 1100,
    seoTitle: "Banaras Spiritual Journey | Hidden Temples & Ghats Guide",
    seoDescription: "Experience Kashi like a local. Discover hidden temples, authentic street food, and the profound spirituality of Banaras."
  },
  {
    title: "Ultimate Packing List for Himalayan Treks",
    slug: "ultimate-packing-list-himalayan-treks",
    excerpt: "Stop overpacking. Here's the exact gear list our trek leaders use — weight-optimized, weather-tested, budget-friendly.",
    content: `
<h2>The Art of Layering</h2>
<p>In the Himalayas, the weather can shift from a blistering sunburn to a freezing snowstorm within hours. The key to surviving and enjoying the trek is layering. Do not bring thick, heavy jackets; instead, bring multiple thin layers.</p>

<h2>1. Base Layers (The Foundation)</h2>
<p>You need 2-3 pairs of moisture-wicking synthetic or merino wool t-shirts. Avoid cotton at all costs—it traps sweat, stays wet, and makes you cold.</p>

<h2>2. Insulation Layers (The Warmth)</h2>
<p>Carry 1-2 fleece jackets or woolen sweaters. Fleece is lightweight, breathable, and provides excellent warmth even when slightly damp.</p>

<h2>3. Outer Layer (The Shield)</h2>
<p>A good quality windproof and waterproof jacket (Hard Shell) is non-negotiable. Pair it with waterproof trekking pants.</p>

<h2>Footwear</h2>
<ul>
  <li><strong>Trekking Shoes:</strong> High-ankle shoes with deep lugs (grip). Must be broken-in before the trek to avoid blisters.</li>
  <li><strong>Camp Shoes:</strong> A lightweight pair of sandals or slip-ons for the campsite.</li>
  <li><strong>Socks:</strong> 3-4 pairs of quick-dry trekking socks and 1 pair of thick woolen socks strictly for sleeping.</li>
</ul>

<h2>Essential Gear</h2>
<ul>
  <li><strong>Backpack:</strong> A 40-50L rucksack with a rain cover.</li>
  <li><strong>Daypack:</strong> A small 10-15L bag if you are offloading your main bag to mules.</li>
  <li><strong>Trekking Pole:</strong> Saves up to 20% of the energy expended on your knees during descents.</li>
  <li><strong>Headlamp:</strong> Essential for early morning summit pushes and navigating the campsite at night.</li>
</ul>

<h2>Hydration & Nutrition</h2>
<p>Carry two 1-liter reusable water bottles (preferably insulated). Water bladders are great but the tube can freeze at high altitudes. Pack energy bars, dry fruits, and electoral/ORS packets.</p>

<h2>First Aid Kit</h2>
<p>Diamox (for altitude), paracetamol, blister tape/Band-Aids, antiseptic cream, crepe bandage, and water purification tablets.</p>
    `,
    coverImage: "https://images.unsplash.com/photo-1580289437401-1a5b5be2dbe0?w=1200&q=80",
    category: "Packing Lists",
    author: "Arjun Nair",
    readTime: 7,
    isFeatured: false,
    status: "published",
    tags: ["packing", "gear", "trekking", "himalayas"],
    views: 3400,
    seoTitle: "Ultimate Himalayan Trek Packing List | Gear & Clothing Guide",
    seoDescription: "The exact weight-optimized gear and clothing list our trek leaders use for Himalayan expeditions. Stop overpacking."
  },
  {
    title: "Ladakh by Bike: The Ultimate Road Trip Playlist",
    slug: "ladakh-by-bike-ultimate-road-trip-playlist",
    excerpt: "Routes, rest stops, altitude tips, and the songs that make every mountain pass feel like a movie scene.",
    content: `
<h2>The Ultimate Ride</h2>
<p>Riding a motorcycle to Ladakh is considered a rite of passage for Indian bikers. Traversing the Manali-Leh highway or the Srinagar-Leh highway offers some of the most dramatic, unforgiving, and beautiful landscapes on Earth.</p>

<h2>The Route: Manali to Leh</h2>
<p>This 470km stretch crosses five high-altitude passes, including the infamous Rohtang La, Baralacha La, and Tanglang La (17,480 ft). </p>
<p><strong>Suggested Itinerary:</strong><br>
Day 1: Manali to Jispa (Acclimatization stop)<br>
Day 2: Jispa to Sarchu (Rough terrain, water crossings)<br>
Day 3: Sarchu to Leh (The final, breathtaking push)</p>

<h2>Bike Preparation</h2>
<ul>
  <li><strong>Service:</strong> Get a complete overhaul. Check clutch plates, chain sprockets, and brake pads.</li>
  <li><strong>Spares:</strong> Carry clutch/accelerator cables, spark plugs, puncture kits, an air pump, and a basic toolkit.</li>
  <li><strong>Fuel:</strong> The stretch from Tandi to Karu (approx. 365 km) has NO petrol pumps. Carry at least 10 liters of extra fuel in Jerry cans.</li>
</ul>

<h2>Physical & Mental Preparation</h2>
<p>You will face sub-zero temperatures, freezing water crossings (Nalas), and low oxygen. Hydration is crucial. Drink water even if you aren't thirsty. Do not push yourself; if you feel dizzy, stop and rest.</p>

<h2>The Playlist</h2>
<p>The vast emptiness of the More Plains or the daunting climb of Gata Loops requires a soundtrack. Here are a few must-haves for your Ladakh playlist:</p>
<ul>
  <li><em>"Safarnama"</em> – Tamasha (For the breezy start)</li>
  <li><em>"Khaabon Ke Parinday"</em> – ZNMD (For the endless straight roads)</li>
  <li><em>"Ilahi"</em> – YJHD (For the high-altitude euphoria)</li>
  <li><em>"Roze Roze Aankhon Tale"</em> (For the chilly evenings by the campfire)</li>
  <li><em>Pink Floyd – Shine On You Crazy Diamond</em> (For the surreal, barren landscapes)</li>
</ul>
    `,
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
    category: "Travel Tips",
    author: "Karan Mehta",
    readTime: 6,
    isFeatured: false,
    status: "published",
    tags: ["ladakh", "biking", "road trip", "adventure"],
    views: 1850,
    seoTitle: "Ladakh Bike Trip Guide & Route | The Ultimate Road Trip",
    seoDescription: "Planning a bike trip to Ladakh? Discover the best routes, bike prep tips, acclimatization advice, and the perfect playlist."
  }
];

async function seedBlogs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");
    
    // Clear existing
    await Blog.deleteMany({});
    
    // Insert new
    await Blog.insertMany(blogPosts);
    console.log("Blogs seeded successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedBlogs();
