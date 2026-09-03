# bazaar-flipper

Bazaar-Preise von Hypixel SkyBlock nachschlagen, plus eine Liste mit den Flips die sich grad am meisten lohnen.

Schulprojekt Informatik.

## Wie es funktionieren soll

Man tippt ein Item ein und sieht was es grad kostet. Und auf der Startseite steht eine Liste mit den besten Flips, die sich automatisch aktualisiert.

## API

```
https://api.hypixel.net/v2/skyblock/bazaar
```

Kein Key nötig, einfach im Browser aufmachen und man sieht das JSON. Sind so ~1900 Items drin.

Die Daten sind gecacht und ändern sich nur ca. alle 20 Sekunden, also öfter abfragen bringt nichts.

Preise stehen unter `products.ENCHANTED_DIAMOND.quick_status` (Item-ID austauschen).

## Stack

Python + Flask hinten, normales HTML/CSS vorne. Bisschen JS für das Neuladen. SQLite und Chart.js kommen später dazu, am Anfang brauch ich das nicht.

## Roadmap

### 1. Erstmal überhaupt Daten holen

Noch keine Website, nur ein Skript in der Konsole.

- [ ] Request machen und JSON ausgeben
- [ ] Angucken was in `quick_status` alles drinsteht
- [ ] **Wichtig:** rausfinden ob `buyPrice` der Preis ist den ich zahle oder den ich bekomme. Die Benennung ist verwirrend und wenn ich das falsch rum habe ist später die ganze Flip-Rechnung invertiert. Am besten im Spiel gegenchecken
- [ ] 2-3 Items per Hand vergleichen ob die Zahlen stimmen

### 2. Website die live Preise zeigt

Noch nichts speichern. Reicht schon um was zu zeigen.

- [ ] Flask mit einem Endpoint `/api/bazaar`
- [ ] Cache im Server einbauen, max 1 Anfrage pro 20 Sek an Hypixel. Sonst fragt jeder Browser einzeln und das sind bei 5 Leuten schon 15 Requests die Minute für die exakt gleichen Daten
- [ ] Tabelle mit Item, Buy, Sell
- [ ] JS lädt alle 20 Sek neu
- [ ] Suchfeld. 1900 Zeilen gleichzeitig kann keiner lesen
- [ ] Item-Namen lesbar machen, `ENCHANTED_BAKED_POTATO` sieht scheiße aus. Entweder mit replace oder einmalig `/v2/resources/skyblock/items` abfragen, da stehen die richtigen Namen drin
- [ ] Preise runden, die kommen mit gefühlt 10 Nachkommastellen

Ab hier läuft schon was im Browser.

### 3. Flips berechnen

Das ist eigentlich der Punkt vom ganzen Projekt.

- [ ] Spread = Sell minus Buy
- [ ] Bazaar-Steuer abziehen. Sind irgendwas um 1,25% beim Verkauf, hängt aber vom Rang ab → nachgucken und als Konstante reinschreiben
- [ ] Profit in Prozent UND in Coins. Beides zeigen, weil 200% Profit auf ein 3-Coin-Item nichts bringt
- [ ] Volumen-Filter, sonst ist die Liste nur Müll. Wenn ein Item 400% Spread hat aber die Woche 6 mal verkauft wird ist das kein Flip. Über `buyMovingWeek` / `sellMovingWeek` filtern, Mindestwert muss ich ausprobieren
- [ ] Sortierung umschaltbar zwischen Prozent und Coins

Danach im Spiel prüfen ob die Top-Flips wirklich Sinn machen.

### 4. Preisverlauf

Jetzt kommt die DB.

- [ ] Tabelle `products` für ID + Name
- [ ] Tabelle `prices_raw`, jede Minute alles rein, nach 1-2 Tagen löschen
- [ ] Tabelle `prices_hourly`, einmal pro Stunde die Rohdaten zusammenrechnen (Durchschnitt/Min/Max), das bleibt für immer
- [ ] Index auf `(product_id, timestamp)`, ohne wird's langsam
- [ ] Chart.js pro Item
- [ ] Zeitraum 24h / 7 Tage / 30 Tage

Warum zwei Tabellen und nicht einfach alles behalten: 1900 Items mal 1440 Minuten sind 2,7 Mio Zeilen am Tag. Nach 30 Tagen wären das 80 Mio. Und minutengenaue Daten von vor 3 Wochen guckt sich eh keiner an, außerdem kann Chart.js keine 43000 Punkte zeichnen ohne dass der Browser hängt. Nennt sich Downsampling, machen Prometheus und InfluxDB genauso.

### 5. Falls noch Zeit ist

Nur anfangen wenn 1-4 laufen.

- [ ] Craft-Profit (Zutaten kaufen, craften, teurer verkaufen) – braucht aber Rezeptdaten
- [ ] Order Book anzeigen, in `buy_summary` / `sell_summary` stehen die einzelnen Preisstufen
- [ ] Watchlist über localStorage
- [ ] Handy-Layout
- [ ] Anzeigen wie alt die Daten grad sind
