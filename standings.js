// ==== DỮ LIỆU GỐC ===================================================
const standingsData = {
  drivers: [
    { pos: 1,  name: "Lando Norris",      team: "McLaren",        teamClass: "mclaren",      pts: 390 },
    { pos: 2,  name: "Oscar Piastri",     team: "McLaren",        teamClass: "mclaren",      pts: 366 },
    { pos: 3,  name: "Max Verstappen",    team: "Red Bull Racing",teamClass: "redbull",      pts: 341 },
    { pos: 4,  name: "George Russell",    team: "Mercedes",       teamClass: "mercedes",     pts: 276 },
    { pos: 5,  name: "Charles Leclerc",   team: "Ferrari",        teamClass: "ferrari",      pts: 214 },
    { pos: 6,  name: "Lewis Hamilton",    team: "Ferrari",        teamClass: "ferrari",      pts: 148 },
    { pos: 7,  name: "Kimi Antonelli",    team: "Mercedes",       teamClass: "mercedes",     pts: 122 },
    { pos: 8,  name: "Alexander Albon",   team: "Williams",       teamClass: "williams",     pts: 73  },
    { pos: 9,  name: "Nico Hülkenberg",   team: "Kick Sauber",    teamClass: "sauber",       pts: 43  },
    { pos: 10, name: "Isack Hadjar",      team: "Racing Bulls",   teamClass: "racingbulls",  pts: 43  }
  ],
  teams: [
    { pos: 1,  name: "McLaren",        teamClass: "mclaren",      pts: 756 },
    { pos: 2,  name: "Mercedes",       teamClass: "mercedes",     pts: 398 },
    { pos: 3,  name: "Red Bull Racing",teamClass: "redbull",      pts: 366 },
    { pos: 4,  name: "Ferrari",        teamClass: "ferrari",      pts: 362 },
    { pos: 5,  name: "Williams",       teamClass: "williams",     pts: 111 },
    { pos: 6,  name: "Racing Bulls",   teamClass: "racingbulls",  pts: 82  },
    { pos: 7,  name: "Aston Martin",   teamClass: "astonmartin",  pts: 72  },
    { pos: 8,  name: "Haas F1 Team",   teamClass: "haas",         pts: 70  },
    { pos: 9,  name: "Kick Sauber",    teamClass: "sauber",       pts: 62  },
    { pos: 10, name: "Alpine",         teamClass: "alpine",       pts: 22  }
  ]
};

// ==== STATE ==========================================================
const state = {
  driversSort: { key: "pos", dir: "asc" },
  teamsSort:   { key: "pos", dir: "asc" },
  searchText: "",
  teamFilter: "all",
  hoverTeam: null
};

let driverRows = [];
let teamRows = [];

// ==== UTILS =========================================================
function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getSortConfig(table, key) {
  const cfgKey = table === "drivers" ? "driversSort" : "teamsSort";
  const cfg = state[cfgKey];
  if (cfg.key === key) {
    cfg.dir = cfg.dir === "asc" ? "desc" : "asc";
  } else {
    cfg.key = key;
    cfg.dir = key === "name" ? "asc" : "desc";
  }
  return cfg;
}

function sortData(data, cfg) {
  const { key, dir } = cfg;
  const factor = dir === "asc" ? 1 : -1;
  return [...data].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    if (typeof va === "number" && typeof vb === "number") {
      return (va - vb) * factor;
    }
    const sa = normalize(String(va));
    const sb = normalize(String(vb));
    if (sa < sb) return -1 * factor;
    if (sa > sb) return 1 * factor;
    return 0;
  });
}

// ==== RENDER DRIVERS =================================================
function renderDrivers() {
  const container = document.getElementById("driversStandings");
  container.innerHTML = "";
  driverRows = [];

  const search = normalize(state.searchText);
  const teamFilter = state.teamFilter;

  let data = standingsData.drivers.filter(d => {
    const matchText = !search || normalize(d.name).includes(search);
    const matchTeam = teamFilter === "all" || d.teamClass === teamFilter;
    return matchText && matchTeam;
  });

  data = sortData(data, state.driversSort);

  data.forEach((d, index) => {
    const row = document.createElement("div");
    row.className = `standings-row standings-row--${d.teamClass} standings-row--enter`;
    row.dataset.team = d.teamClass;
    row.style.animationDelay = `${index * 40}ms`;

    row.innerHTML = `
      <span class="standings-cell standings-cell--pos">${d.pos}</span>
      <span class="standings-cell standings-cell--name">
        <span class="team-dot team-dot--${d.teamClass}"></span>
        <span class="driver-main">${d.name}</span>
        <span class="driver-sub">${d.team}</span>
      </span>
      <span class="standings-cell standings-cell--pts">${d.pts}</span>
    `;

    row.addEventListener("mouseenter", () => {
      state.hoverTeam = d.teamClass;
      updateHighlight();
    });
    row.addEventListener("mouseleave", () => {
      state.hoverTeam = null;
      updateHighlight();
    });

    row.addEventListener("animationend", () => {
      row.classList.remove("standings-row--enter");
      row.style.animationDelay = "";
    });

    container.appendChild(row);
    driverRows.push(row);
  });
}

// ==== RENDER TEAMS ===================================================
function renderTeams() {
  const container = document.getElementById("teamsStandings");
  container.innerHTML = "";
  teamRows = [];

  let data = sortData(standingsData.teams, state.teamsSort);

  data.forEach((t, index) => {
    const row = document.createElement("div");
    row.className = `standings-row standings-row--${t.teamClass} standings-row--enter`;
    row.dataset.team = t.teamClass;
    row.style.animationDelay = `${index * 40}ms`;

    row.innerHTML = `
      <span class="standings-cell standings-cell--pos">${t.pos}</span>
      <span class="standings-cell standings-cell--name">
        <span class="team-dot team-dot--${t.teamClass}"></span>
        <span class="team-main">${t.name}</span>
      </span>
      <span class="standings-cell standings-cell--pts">${t.pts}</span>
    `;

    row.addEventListener("mouseenter", () => {
      state.hoverTeam = t.teamClass;
      updateHighlight();
    });
    row.addEventListener("mouseleave", () => {
      state.hoverTeam = null;
      updateHighlight();
    });

    row.addEventListener("animationend", () => {
      row.classList.remove("standings-row--enter");
      row.style.animationDelay = "";
    });

    container.appendChild(row);
    teamRows.push(row);
  });
}

// ==== HIGHLIGHT CÙNG ĐỘI ============================================
function updateHighlight() {
  const allRows = [...driverRows, ...teamRows];
  allRows.forEach(r => {
    if (!state.hoverTeam) {
      r.classList.remove("standings-row--related");
    } else {
      if (r.dataset.team === state.hoverTeam) {
        r.classList.add("standings-row--related");
      } else {
        r.classList.remove("standings-row--related");
      }
    }
  });
}

// ==== TOOLBAR: FILTER + SEARCH ======================================
function initToolbar() {
  const searchInput = document.getElementById("driverSearch");
  const teamSelect  = document.getElementById("teamFilter");
  const resetBtn    = document.getElementById("resetFilters");

  const teamClasses = new Map();
  standingsData.drivers.forEach(d => {
    if (!teamClasses.has(d.teamClass)) {
      teamClasses.set(d.teamClass, d.team);
    }
  });
  for (const [teamClass, teamName] of teamClasses.entries()) {
    const opt = document.createElement("option");
    opt.value = teamClass;
    opt.textContent = teamName;
    teamSelect.appendChild(opt);
  }

  searchInput.addEventListener("input", () => {
    state.searchText = searchInput.value;
    renderDrivers();
    updateHighlight();
    resetSortIndicators(); // giữ icon sort
  });

  teamSelect.addEventListener("change", () => {
    state.teamFilter = teamSelect.value;
    renderDrivers();
    updateHighlight();
    resetSortIndicators();
  });

  resetBtn.addEventListener("click", () => {
    state.searchText = "";
    state.teamFilter = "all";
    state.driversSort = { key: "pos", dir: "asc" };
    state.teamsSort   = { key: "pos", dir: "asc" };
    searchInput.value = "";
    teamSelect.value  = "all";
    renderDrivers();
    renderTeams();
    updateHighlight();
    resetSortIndicators();
  });
}

// ==== SORT BUTTONS ==================================================
function resetSortIndicators() {
  document.querySelectorAll(".js-sort").forEach(btn => {
    btn.classList.remove("js-sort--asc", "js-sort--desc");
  });

  const update = (table, cfg) => {
    document
      .querySelectorAll(`.js-sort[data-table="${table}"]`)
      .forEach(btn => {
        if (btn.dataset.key === cfg.key) {
          btn.classList.add(cfg.dir === "asc" ? "js-sort--asc" : "js-sort--desc");
        }
      });
  };

  update("drivers", state.driversSort);
  update("teams", state.teamsSort);
}

function initSorting() {
  document.querySelectorAll(".js-sort").forEach(btn => {
    btn.addEventListener("click", () => {
      const table = btn.dataset.table;
      const key   = btn.dataset.key;
      const cfg   = getSortConfig(table, key);

      if (table === "drivers") {
        state.driversSort = cfg;
        renderDrivers();
      } else {
        state.teamsSort = cfg;
        renderTeams();
      }
      resetSortIndicators();
      updateHighlight();
    });
  });
}

// ==== INIT ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  initToolbar();
  initSorting();
  renderDrivers();
  renderTeams();
  resetSortIndicators();
});
