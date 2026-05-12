import urllib.request
import json
import time

destinations = ["Auli", "Manali", "Spiti Valley", "Morni Hills", "Udaipur", "Jaisalmer", "Ranthambore National Park"]

for dest in destinations:
    url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=600&titles={urllib.parse.quote(dest)}"
    filename = f"public/destinations/{dest.replace(' ', '-').lower()}.jpg"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "MyTravelAppBot/1.0"})
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode())
            pages = res["query"]["pages"]
            for page_id in pages:
                if "thumbnail" in pages[page_id]:
                    img_url = pages[page_id]["thumbnail"]["source"]
                    req_img = urllib.request.Request(img_url, headers={"User-Agent": "MyTravelAppBot/1.0"})
                    with urllib.request.urlopen(req_img) as img_resp, open(filename, 'wb') as f:
                        f.write(img_resp.read())
                    print(f"Downloaded Thumb {dest}")
    except Exception as e:
        print(f"Failed {dest}: {e}")
    time.sleep(1)

