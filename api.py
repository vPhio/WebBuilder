import time
import requests

import config


_cache = {"data": None, "fetched_at": 0}


def get_bazaar():
    age = time.time() - _cache["fetched_at"]

    if _cache["data"] is None or age > config.CACHE_SECONDS:
        res = requests.get(config.BAZAAR_URL, timeout=config.REQUEST_TIMEOUT)
        res.raise_for_status()
        _cache["data"] = res.json()
        _cache["fetched_at"] = time.time()

    return _cache["data"]


def get_products():
    data = get_bazaar()
    out = []

    for item_id, product in data["products"].items():
        q = product["quick_status"]
        out.append({
            "id": item_id,
            "name": pretty_name(item_id),
            "buy": q["buyPrice"],
            "sell": q["sellPrice"],
            "buy_week": q["buyMovingWeek"],
            "sell_week": q["sellMovingWeek"],
        })

    return out


def pretty_name(item_id):
    words = item_id.replace(":", " ").split("_")
    return " ".join(w.capitalize() for w in words)


def load_display_names():
    raise NotImplementedError
