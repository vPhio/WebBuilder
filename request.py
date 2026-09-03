#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Sep  3 17:23:05 2026

@author: karthago
"""

import requests

status = 1
itemId = "ENCHANTED_DIAMOND"
response = requests.get("https://api.hypixel.net/v2/skyblock/bazaar")
rawDataDictionary = response.json()

product_data = rawDataDictionary["products"][itemId]


print("Status = " + str(response.status_code))

product_id = product_data["product_id"]
sell_summary = product_data["sell_summary"]
buy_summary = product_data["buy_summary"]
quick_status = product_data["quick_status"]

print(f"Sell Price: {quick_status['sellPrice']}")




