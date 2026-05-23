const state = {
  players: [],
  activeFilter: "all"
};

const grid = document.querySelector("#playerGrid");
const searchInput = document.querySelector("#searchInput");
const segmentButtons = document.querySelectorAll(".segment");

async function loadPlayers() {
  try {
    const response = await fetch("data/players.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.players = data.players;
    updateStats(data);
    renderPlayers();
  } catch (error) {
    grid.innerHTML = `<div class="empty">データを読み込めませんでした。ローカルサーバー経由で開いてください。</div>`;
    console.error(error);
  }
}

function updateStats(data) {
  const unique = (key) => new Set(state.players.map((player) => player.gear[key]).filter(Boolean)).size;
  document.querySelector("#playerCount").textContent = state.players.length;
  document.querySelector("#mouseCount").textContent = unique("mouse");
  document.querySelector("#keyboardCount").textContent = unique("keyboard");
  document.querySelector("#lastUpdated").textContent = data.updatedAt;
  document.querySelector("#footerUpdated").textContent = data.updatedAt;
}

function renderPlayers() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = state.players.filter((player) => {
    const haystack = JSON.stringify(player).toLowerCase();
    const matchesSearch = !keyword || haystack.includes(keyword);
    const matchesFilter = state.activeFilter === "all" || player.input === state.activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (!filtered.length) {
    grid.innerHTML = '<div class="empty">条件に合う選手が見つかりません。検索語を短くしてみてください。</div>';
    return;
  }

  grid.innerHTML = filtered.map((player) => `
    <article class="player-card">
      <div class="card-top">
        <div>
          <h3 class="player-name">${escapeHtml(player.name)}</h3>
          <p class="team">${escapeHtml(player.team)} / ${escapeHtml(player.country)}</p>
        </div>
        <span class="rank-pill">${escapeHtml(player.status)}</span>
      </div>
      <span class="input-pill">${player.input === "mnk" ? "Keyboard & Mouse" : "Controller"}</span>
      <p class="note">${escapeHtml(player.note)}</p>
      <div class="gear-list">
        ${gearRow("Mouse", player.gear.mouse)}
        ${gearRow("DPI / Sens", player.gear.sensitivity)}
        ${gearRow("Monitor", player.gear.monitor)}
        ${gearRow("Keyboard", player.gear.keyboard)}
        ${gearRow("Mousepad", player.gear.mousepad)}
        ${gearRow("Headset", player.gear.headset)}
      </div>
      <div class="meta-row">
        <span>確認日: ${escapeHtml(player.checkedAt)}</span>
        <a href="${player.sourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(player.source)}</a>
      </div>
    </article>
  `).join("");
}

function gearRow(label, value) {
  return `
    <div class="gear-row">
      <span class="gear-label">${label}</span>
      <span class="gear-value">${escapeHtml(value || "未確認")}</span>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

segmentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeFilter = button.dataset.filter;
    segmentButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderPlayers();
  });
});

searchInput.addEventListener("input", renderPlayers);

loadPlayers();
