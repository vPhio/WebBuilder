import json
import requests

URL = "https://api.hypixel.net/v2/skyblock/bazaar"

res = requests.get(URL, timeout=10)
data = res.json()

print("Anzahl Items:", len(data["products"]))
print()

item = "ENCHANTED_DIAMOND"
print(f"--- {item} ---")
print(json.dumps(data["products"][item]["quick_status"], indent=2))
