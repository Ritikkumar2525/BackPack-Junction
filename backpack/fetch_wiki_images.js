const fs = require('fs');
const https = require('https');
const path = require('path');

const places = [
  "Delhi", "Spiti Valley", "Kasol", "Manali", "Dharamshala", "Shimla", 
  "Kedarnath", "Badrinath", "Auli", "Mussoorie", "Nainital", "Rishikesh", 
  "Haridwar", "Jim Corbett National Park", "Agra", "Mathura", "Vrindavan", 
  "Morni Hills", "Kurukshetra", "Gurugram", "Amritsar", "Ranthambore National Park", 
  "Jaipur", "Udaipur", "Jaisalmer", "Mount Abu"
];

const destDir = path.join(__dirname, 'public', 'destinations');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

async function getWikiImage(place) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(place);
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&format=json&pithumbsize=800`;
    
    https.get(url, { headers: { 'User-Agent': 'BackpackJunction/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const results = {};
  for (const place of places) {
    const url = await getWikiImage(place);
    const id = place.toLowerCase().replace(/ /g, '-').replace('national-park', '').replace('-hills', '').replace(/-+$/, '');
    results[id] = url || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400&h=200";
    console.log(`"${id}": "${results[id]}",`);
  }
}

main();
