import urllib.request
import json
import time
import os

destinations = [
  "Delhi", "Spiti Valley", "Kasol", "Manali", "Dharamshala", "Shimla", 
  "Kedarnath", "Badrinath", "Auli", "Mussoorie", "Nainital", "Rishikesh", 
  "Haridwar", "Jim Corbett National Park", "Agra", "Mathura", "Vrindavan", 
  "Morni Hills", "Kurukshetra", "Gurgaon", "Amritsar", "Ranthambore National Park", 
  "Jaipur", "Udaipur", "Jaisalmer", "Mount Abu"
]

for dest in destinations:
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles={urllib.parse.quote(dest)}"
    filename = f"public/destinations/{dest.replace(' ', '-').lower()}.jpg"
    if os.path.exists(filename):
        continue
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "MyTravelAppBot/1.0"})
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode())
            pages = res["query"]["pages"]
            for page_id in pages:
                if "original" in pages[page_id]:
                    img_url = pages[page_id]["original"]["source"]
                    req_img = urllib.request.Request(img_url, headers={"User-Agent": "MyTravelAppBot/1.0"})
                    with urllib.request.urlopen(req_img) as img_resp, open(filename, 'wb') as f:
                        f.write(img_resp.read())
                    print(f"Downloaded {dest}")
    except Exception as e:
        print(f"Failed {dest}: {e}")
    time.sleep(0.5)

