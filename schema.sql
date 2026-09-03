CREATE TABLE IF NOT EXISTS products (
    id       INTEGER PRIMARY KEY,
    item_id  TEXT NOT NULL UNIQUE,
    name     TEXT
);


CREATE TABLE IF NOT EXISTS prices_raw (
    product_id  INTEGER NOT NULL REFERENCES products(id),
    ts          INTEGER NOT NULL,
    buy         REAL NOT NULL,
    sell        REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_product_ts ON prices_raw (product_id, ts);


CREATE TABLE IF NOT EXISTS prices_hourly (
    product_id  INTEGER NOT NULL REFERENCES products(id),
    hour        INTEGER NOT NULL,
    buy_avg     REAL,
    buy_min     REAL,
    buy_max     REAL,
    sell_avg    REAL,
    PRIMARY KEY (product_id, hour)
);
