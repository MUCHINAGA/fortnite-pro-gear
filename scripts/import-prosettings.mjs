import { readFile, writeFile } from "node:fs/promises";

const html = await readFile("prosettings-fortnite.html", "utf8");
const today = new Date().toISOString().slice(0, 10);

const priorityNames = [
  "Merstach",
  "Swizzy",
  "Queasy",
  "Pixie",
  "Khanada",
  "Clix",
  "Veno",
  "Pollo",
  "Acorn",
  "Kami",
  "Peterbot",
  "Bugha",
  "MrSavage",
  "Mongraal",
  "Setty",
  "Tayson",
  "Cold",
  "Eomzo",
  "Ajerss",
  "Cooper",
  "Bucke",
  "Muz",
  "EpikWhale",
  "Ark",
  "Reet",
  "MariusCOW",
  "Vanyak3k",
  "japko",
  "Flickzy",
  "IDrop",
  "charyy",
  "Boltz",
  "Rapid",
  "Higgs",
  "Fredoxie",
  "Tjino",
  "PabloWingu"
];

const canonicalNames = new Map(priorityNames.map((name) => [name.toLowerCase(), name]));
const priorityKeys = priorityNames.map((name) => name.toLowerCase());

const body = html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? "";
const rows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((match) => match[1]);

const players = rows.map((row, index) => {
  const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((match) => match[1]);
  const playerCell = cells[2] ?? "";
  const rawPlayerName = text(playerCell);
  const playerName = canonicalNames.get(rawPlayerName.toLowerCase()) ?? rawPlayerName;
  const playerUrl = href(playerCell) || "https://prosettings.net/lists/fortnite/";
  const country = attr(playerCell, "alt") || "Unknown";
  const team = text(cells[1] ?? "") || "Free Agent / Unknown";
  const mouse = text(cells[3] ?? "");
  const dpi = text(cells[4] ?? "");
  const xSens = text(cells[5] ?? "");
  const ySens = text(cells[6] ?? "");

  return {
    name: playerName,
    team,
    country,
    status: priorityKeys.includes(playerName.toLowerCase())
      ? "世界大会経験優先掲載"
      : "ProSettings掲載プロ",
    input: mouse ? "mnk" : "unknown",
    note: buildNote(mouse, text(cells[14] ?? ""), text(cells[9] ?? "")),
    gear: {
      mouse,
      sensitivity: buildSensitivity(dpi, xSens, ySens),
      monitor: text(cells[9] ?? ""),
      keyboard: text(cells[14] ?? ""),
      mousepad: text(cells[13] ?? ""),
      headset: text(cells[15] ?? "")
    },
    checkedAt: today,
    source: "ProSettings.net",
    sourceUrl: playerUrl,
    _priority: priorityKeys.includes(playerName.toLowerCase()) ? priorityKeys.indexOf(playerName.toLowerCase()) : 1000 + index
  };
}).filter((player) => player.name);

const deduped = [...new Map(players.map((player) => [player.name.toLowerCase(), player])).values()]
  .sort((a, b) => a._priority - b._priority)
  .slice(0, 200)
  .map(({ _priority, ...player }) => player);

const output = {
  updatedAt: today,
  sourcePolicy: "ProSettings.netのFortnite一覧を元に、世界大会経験者・上位経験者として把握している選手を優先表示。未確認項目は空欄として扱う。",
  players: deduped
};

await writeFile("data/players.json", `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Wrote ${deduped.length} players to data/players.json`);

function buildSensitivity(dpi, xSens, ySens) {
  const parts = [];
  if (dpi) parts.push(`${dpi} DPI`);
  if (xSens) parts.push(`X ${xSens}%`);
  if (ySens) parts.push(`Y ${ySens}%`);
  return parts.join(" / ");
}

function buildNote(mouse, keyboard, monitor) {
  const bits = [];
  if (mouse) bits.push(mouse);
  if (keyboard) bits.push(keyboard);
  if (monitor) bits.push(monitor);
  return bits.length ? `公開リスト上の主な構成: ${bits.slice(0, 3).join(" / ")}` : "公開リスト上で一部デバイスが未確認です。";
}

function text(value) {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function href(value) {
  return decodeEntities(value.match(/<a[^>]+href="([^"]+)"/)?.[1] ?? "");
}

function attr(value, name) {
  return decodeEntities(value.match(new RegExp(`${name}="([^"]+)"`))?.[1] ?? "");
}

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#8217;", "'")
    .replaceAll("&#8211;", "-")
    .replaceAll("&#215;", "x")
    .replaceAll("&nbsp;", " ");
}
