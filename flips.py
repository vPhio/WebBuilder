import config


def calculate(products):
    result = []

    for item in products:
        if item["buy"] <= 0 or item["sell"] <= 0:
            continue

        if not has_enough_volume(item):
            continue

        profit = profit_per_item(item["buy"], item["sell"])

        if profit <= 0:
            continue

        result.append({
            **item,
            "profit": profit,
            "percent": (profit / item["sell"]) * 100,
        })

    result.sort(key=lambda i: i["percent"], reverse=True)
    return result[:config.TOP_FLIPS]


def profit_per_item(buy, sell):
    return buy * (1 - config.BAZAAR_TAX) - sell


def has_enough_volume(item):
    return min(item["buy_week"], item["sell_week"]) >= config.MIN_WEEKLY_VOLUME


def sort_by(flips, key):
    raise NotImplementedError
