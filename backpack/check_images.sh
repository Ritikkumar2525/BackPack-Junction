#!/bin/bash
urls=(
  "https://images.unsplash.com/photo-1587474260584-136574528ed5"
  "https://images.unsplash.com/photo-1626621331169-5f34be280ed9"
  "https://images.unsplash.com/photo-1623916972230-008b64e5fae5"
  "https://images.unsplash.com/photo-1605649487212-4dcf1b624ba1"
  "https://images.unsplash.com/photo-1621217088924-d92ea407c81a"
  "https://images.unsplash.com/photo-1596896225916-2fb9fdd94326"
  "https://images.unsplash.com/photo-1596489370002-39bd91bb5f37"
  "https://images.unsplash.com/photo-1623190807026-628d09616e62"
  "https://images.unsplash.com/photo-1562947087-0b0b87ab1ea1"
  "https://images.unsplash.com/photo-1621532133857-e6669eeceb16"
  "https://images.unsplash.com/photo-1563200008-012ab6df7b29"
  "https://images.unsplash.com/photo-1594954477382-b1318a6a12b8"
  "https://images.unsplash.com/photo-1594895786196-857e49eb8218"
  "https://images.unsplash.com/photo-1597520023414-b63de7b4587c"
  "https://images.unsplash.com/photo-1564507592208-0283bd78bc2b"
  "https://images.unsplash.com/photo-1598285521743-b9eb814421d0"
  "https://images.unsplash.com/photo-1627885746377-a8b27eb5c9f5"
  "https://images.unsplash.com/photo-1632128795085-f559bc811b3e"
  "https://images.unsplash.com/photo-1601618683259-2c672ab74516"
  "https://images.unsplash.com/photo-1595166258957-36e6f98fbac7"
  "https://images.unsplash.com/photo-1604104996924-81e8dbd7de60"
  "https://images.unsplash.com/photo-1610408544955-f54f67d30d17"
  "https://images.unsplash.com/photo-1477587458883-47145ed94245"
  "https://images.unsplash.com/photo-1582296181580-0a0f69a194eb"
  "https://images.unsplash.com/photo-1599384732152-78d103bda36e"
  "https://images.unsplash.com/photo-1624640498701-d7d8e8b09335"
)

for url in "${urls[@]}"; do
  status=$(curl -o /dev/null -s -w "%{http_code}\n" "$url")
  if [ "$status" -ne 200 ]; then
    echo "FAILED: $url (Status $status)"
  fi
done
echo "Done checking."
