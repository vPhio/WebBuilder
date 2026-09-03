import sqlite3

import config


def connect():
    raise NotImplementedError


def save_snapshot(products):
    raise NotImplementedError


def rollup_hour(hour_ts):
    raise NotImplementedError


def cleanup():
    raise NotImplementedError


def get_history(item_id, hours):
    raise NotImplementedError
