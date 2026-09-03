const REFRESH = 20000;
const TAX = 0.0125;
const MIN_WEEK = 20000;

let raw = [];
let sortBy = "pct";
let lastFetch = 0;


async function load() {
  try {
    const res = await fetch("/api/bazaar");
    if (!res.ok) throw new Error(res.status);
    const json = await res.json();
    raw = json.products;
    lastFetch = Date.now();
    setStatus("ok");
  } catch (e) {
    if (raw.length === 0) {
      raw = demo();
      lastFetch = Date.now();
      setStatus("demo");
    } else {
      setStatus("error");
    }
  }
  render();
}


function flips() {
  return raw
    .filter(i => i.buy > 0 && i.sell > 0)
    .filter(i => Math.min(i.buy_week, i.sell_week) >= MIN_WEEK)
    .map(i => {
      const profit = i.buy * (1 - TAX) - i.sell;
      return { ...i, profit, pct: (profit / i.sell) * 100 };
    })
    .filter(i => i.profit > 0)
    .sort((a, b) => sortBy === "pct" ? b.pct - a.pct : b.profit - a.profit)
    .slice(0, 12);
}


function render() {
  renderFlips();
  renderTable();
}


function renderFlips() {
  const list = flips();
  const box = document.getElementById("flips");

  if (list.length === 0) {
    box.innerHTML = '<p class="empty">Gerade kein Flip über der Umsatzgrenze.</p>';
    return;
  }

  const top = sortBy === "pct" ? list[0].pct : list[0].profit;

  box.innerHTML = list.map(i => {
    const w = ((sortBy === "pct" ? i.pct : i.profit) / top) * 100;
    const head = sortBy === "pct"
      ? i.pct.toFixed(1) + " %"
      : "+" + coins(i.profit);
    return `<article class="flip" style="--w:${w}%">
      <div class="name">${i.name}</div>
      <div class="profit num">${head}</div>
      <div class="legs num">${coins(i.sell)} → ${coins(i.buy)}</div>
      <div class="vol num">${short(Math.min(i.buy_week, i.sell_week))} / Woche</div>
    </article>`;
  }).join("");
}


function renderTable() {
  const q = document.getElementById("search").value.trim().toLowerCase();

  const hits = q
    ? raw.filter(i => i.name.toLowerCase().includes(q)).slice(0, 60)
    : raw.slice().sort((a, b) => b.buy_week - a.buy_week).slice(0, 25);

  document.getElementById("count").textContent = q
    ? `${hits.length} Treffer für „${q}"`
    : "Meistgehandelte Items – zum Filtern oben suchen";

  const body = document.getElementById("rows");

  body.innerHTML = hits.length === 0
    ? '<tr><td colspan="4" class="empty">Nichts gefunden. Anderen Namen probieren.</td></tr>'
    : hits.map(i => `<tr>
        <td>${i.name}</td>
        <td class="num buy">${coins(i.buy)}</td>
        <td class="num sell">${coins(i.sell)}</td>
        <td class="num dim">${short(i.buy_week)}</td>
      </tr>`).join("");
}


function coins(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + "M";
  if (n >= 1000)    return (n / 1000).toFixed(1) + "k";
  return n.toFixed(1);
}

function short(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000)    return Math.round(n / 1000) + "k";
  return String(n);
}

function setStatus(state) {
  const dot = document.getElementById("dot");
  const stamp = document.getElementById("stamp");
  dot.className = "dot" + (state === "error" ? " error" : state === "demo" ? " stale" : "");
  if (state === "demo")  stamp.textContent = "Beispieldaten, Backend antwortet nicht";
  if (state === "error") stamp.textContent = "Verbindung weg";
}

function tick() {
  if (!lastFetch) return;
  const dot = document.getElementById("dot");
  if (dot.classList.contains("error") || dot.classList.contains("stale")) return;
  const s = Math.round((Date.now() - lastFetch) / 1000);
  document.getElementById("stamp").textContent = s < 2 ? "gerade eben" : `vor ${s} s`;
}


document.getElementById("search").addEventListener("input", renderTable);
document.getElementById("byPct").addEventListener("click", () => setSort("pct"));
document.getElementById("byCoins").addEventListener("click", () => setSort("coins"));

function setSort(v) {
  sortBy = v;
  document.getElementById("byPct").setAttribute("aria-pressed", v === "pct");
  document.getElementById("byCoins").setAttribute("aria-pressed", v === "coins");
  renderFlips();
}


function demo() {
  return [
    ["ENCHANTED_DIAMOND", 1841, 1602, 2400000, 2100000],
    ["ENCHANTED_LAPIS_LAZULI", 3120, 2705, 890000, 940000],
    ["ENCHANTED_IRON", 1490, 1338, 3100000, 2800000],
    ["SUMMONING_EYE", 512000, 468000, 42000, 38000],
    ["ENCHANTED_GOLD", 1720, 1601, 1900000, 1750000],
    ["TARANTULA_WEB", 88, 74, 12000000, 11000000],
    ["ENCHANTED_REDSTONE", 1015, 902, 5400000, 5100000],
    ["ENCHANTED_BAKED_POTATO", 2260, 1988, 640000, 610000],
    ["REVENANT_FLESH", 141, 122, 8800000, 8200000],
    ["ENCHANTED_ENDER_PEARL", 3480, 3190, 410000, 395000],
    ["JACOBS_TICKET", 2050, 1880, 260000, 244000],
    ["ENCHANTED_CACTUS_GREEN", 1180, 1044, 1400000, 1330000],
    ["MITHRIL_ORE", 44, 37, 21000000, 19500000],
    ["ENCHANTED_BONE", 1610, 1502, 720000, 690000]
  ].map(([id, buy, sell, bw, sw]) => ({
    id,
    name: id.split("_").map(w => w[0] + w.slice(1).toLowerCase()).join(" "),
    buy, sell, buy_week: bw, sell_week: sw
  }));
}


load();
setInterval(load, REFRESH);
setInterval(tick, 1000);
