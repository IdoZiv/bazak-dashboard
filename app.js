/* Bazak Ecosystem Analytics — standalone bundle (base dashboard + v3 KPI layer) */
const MOCK = {
  kpis: {
    aiAttributedRevenue: { value: 48200, delta: 18.4, tooltip: "Revenue credited across all AI surfaces using Bazak's AI-Driven Attribution model." },
    aiInfluencedConversions: { value: 1247, delta: 12.1, tooltip: "Total conversions where at least one AI surface contributed." },
    blendedCvr: { value: 4.8, delta: 0.6, tooltip: "Conversion rate across all journeys involving one or more AI surfaces." },
    costPerConversion: { value: 38.6, delta: -8.2, tooltip: "Estimated cost to generate one attributed conversion across AI journeys.", invertDelta: true },
    assistedRevenueShare: { value: 34, delta: 5.1, tooltip: "Share of revenue where the final closer was not the only meaningful contributor." },
  },
  sparklines: [
    [32, 38, 35, 42, 40, 45, 48],
    [980, 1020, 1050, 1100, 1150, 1200, 1247],
    [3.9, 4.1, 4.2, 4.5, 4.6, 4.7, 4.8],
    [44, 42, 41, 40, 39, 38.5, 38.6],
    [28, 29, 30, 31, 32, 33, 34],
  ],
  channels: [
    { id: "website", surface: "Website Agent", icon: "WA", lastTouch: 50000, aiDriven: 35000, direct: "High", assisted: "Medium", intent: 82, handoff: 38, confidence: "high", trend: "up" },
    { id: "chatgpt", surface: "ChatGPT App", icon: "GPT", lastTouch: 0, aiDriven: 12000, direct: "Low", assisted: "High", intent: 71, handoff: 24, confidence: "medium", trend: "up" },
    { id: "claude", surface: "Claude MCP", icon: "CL", lastTouch: 0, aiDriven: 3000, direct: "Low", assisted: "Medium", intent: 63, handoff: 19, confidence: "medium", trend: "flat" },
    { id: "other", surface: "Direct / Other", icon: "DO", lastTouch: 8200, aiDriven: 2100, direct: "Medium", assisted: "Low", intent: 55, handoff: 12, confidence: "low", trend: "down" },
  ],
  insights: {
    working: [
      "ChatGPT App drives strong discovery volume and high assisted revenue, but low direct close rate.",
      "Website Agent converts efficiently when users arrive with high intent.",
      "Claude MCP generates fewer journeys, but above-average revenue per assisted conversion.",
    ],
    actions: [
      "Improve hand-off from ChatGPT App to branded landing page.",
      "Test a stronger pricing prompt in Website Agent flows.",
      "Expand Claude MCP coverage for high-converting product categories.",
    ],
  },
  drawerDetails: {
    website: {
      role: "Closer / Converter",
      journeys: ["Discovery → Website Agent → Revenue", "ChatGPT → Hand-off → Website Agent → Revenue"],
      intents: ["pricing", "checkout", "product comparison"],
      dropoffs: ["Cart abandonment after pricing reveal", "Session timeout before checkout"],
      guardrail: "High confidence stitching — 94% of journeys have deterministic session links.",
    },
    chatgpt: {
      role: "Initiator / Nurturer",
      journeys: ["ChatGPT App → Discovery → Hand-off → Revenue", "ChatGPT App → Consideration → Drop-off"],
      intents: ["comparison", "pricing", "feature discovery"],
      dropoffs: ["Strong discovery, weak hand-off completion", "Users stay in-app without site visit"],
      guardrail: "Medium confidence — cross-app identity relies on UTM + deferred deep links.",
    },
    claude: {
      role: "Initiator",
      journeys: ["Claude MCP → Consideration → Hand-off", "Claude MCP → Return visit → Revenue"],
      intents: ["technical specs", "integration questions", "ROI calculation"],
      dropoffs: ["Low volume but high intent — optimize MCP tool descriptions"],
      guardrail: "Medium confidence — limited journey sample in last 30 days (n=412).",
    },
    other: {
      role: "Mixed",
      journeys: ["Direct → Revenue", "Other AI → Direct"],
      intents: ["brand search", "returning customer"],
      dropoffs: ["Attribution overlap with organic — review last-touch rules"],
      guardrail: "Low confidence — manual review recommended for revenue claims.",
    },
  },
  sankey: {
    nodes: [
      { id: "chatgpt", name: "ChatGPT App", column: 0 },
      { id: "claude", name: "Claude MCP", column: 0 },
      { id: "website", name: "Website Agent", column: 0 },
      { id: "direct", name: "Direct / Other", column: 0 },
      { id: "discovery", name: "Discovery", column: 1 },
      { id: "consideration", name: "Consideration", column: 1 },
      { id: "handoff", name: "Hand-off", column: 1 },
      { id: "return", name: "Return visit", column: 1 },
      { id: "revenue", name: "Revenue conversion", column: 2 },
      { id: "lead", name: "Qualified lead", column: 2 },
      { id: "checkout", name: "Checkout hand-off", column: 2 },
      { id: "dropoff", name: "Drop-off", column: 2 },
    ],
    /* Bipartite only: entry → journey → outcome (matches wireframe volumes) */
    links: [
      { source: "chatgpt", target: "discovery", value: 4200, revenue: 8200, cvr: 2.1, intent: 68, confidence: "medium" },
      { source: "chatgpt", target: "consideration", value: 2800, revenue: 5400, cvr: 2.8, intent: 72, confidence: "medium" },
      { source: "chatgpt", target: "handoff", value: 1500, revenue: 3600, cvr: 3.2, intent: 70, confidence: "medium" },
      { source: "claude", target: "discovery", value: 890, revenue: 1200, cvr: 1.8, intent: 61, confidence: "medium" },
      { source: "website", target: "discovery", value: 2090, revenue: 4500, cvr: 3.4, intent: 75, confidence: "high" },
      { source: "website", target: "consideration", value: 3500, revenue: 12000, cvr: 4.2, intent: 80, confidence: "high" },
      { source: "website", target: "handoff", value: 2400, revenue: 6200, cvr: 4.8, intent: 79, confidence: "high" },
      { source: "website", target: "return", value: 2040, revenue: 8500, cvr: 6.1, intent: 85, confidence: "high" },
      { source: "direct", target: "discovery", value: 1800, revenue: 3200, cvr: 2.8, intent: 58, confidence: "low" },
      { source: "direct", target: "handoff", value: 1100, revenue: 2100, cvr: 3.6, intent: 62, confidence: "low" },
      { source: "discovery", target: "dropoff", value: 3830, revenue: 0, cvr: 0, intent: 45, confidence: "medium" },
      { source: "discovery", target: "checkout", value: 1260, revenue: 0, cvr: 6.8, intent: 74, confidence: "medium" },
      { source: "discovery", target: "lead", value: 3900, revenue: 0, cvr: 8.0, intent: 58, confidence: "medium" },
      { source: "consideration", target: "dropoff", value: 4700, revenue: 0, cvr: 0, intent: 52, confidence: "medium" },
      { source: "consideration", target: "lead", value: 1600, revenue: 0, cvr: 12.4, intent: 76, confidence: "high" },
      { source: "handoff", target: "revenue", value: 1850, revenue: 18500, cvr: 8.2, intent: 84, confidence: "high" },
      { source: "handoff", target: "dropoff", value: 3150, revenue: 0, cvr: 0, intent: 48, confidence: "low" },
      { source: "return", target: "revenue", value: 1420, revenue: 14200, cvr: 9.1, intent: 88, confidence: "high" },
      { source: "return", target: "lead", value: 620, revenue: 0, cvr: 10.2, intent: 81, confidence: "high" },
    ],
  },
};

const state = {
  dateRange: "30",
  surface: "all",
  outcome: "revenue",
  attribution: "comparison",
  confidence: "all",
  tableMode: "absolute",
  sortKey: "aiDriven",
  sortDir: "desc",
  selectedChannel: null,
  activeJourneyFilter: null,
};

function formatCurrency(n) {
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `$${n.toLocaleString()}`;
}

function formatNumber(n) {
  return n.toLocaleString();
}

function renderSparkline(points) {
  const w = 120;
  const h = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline fill="none" stroke="var(--accent)" stroke-width="1.5" points="${coords}"/></svg>`;
}

function renderKpis() {
  const cards = [
    { label: "AI-Attributed Revenue", format: (v) => formatCurrency(v), ...MOCK.kpis.aiAttributedRevenue },
    { label: "AI-Influenced Conversions", format: (v) => `${formatNumber(v)}`, suffix: " conv.", ...MOCK.kpis.aiInfluencedConversions },
    { label: "Blended Conversion Rate", format: (v) => `${v}%`, ...MOCK.kpis.blendedCvr },
    { label: "Cost per Attributed Conversion", format: (v) => `$${v}`, ...MOCK.kpis.costPerConversion },
    { label: "Share of Assisted Revenue", format: (v) => `${v}%`, ...MOCK.kpis.assistedRevenueShare },
  ];

  document.getElementById("kpi-strip").innerHTML = cards
    .map((card, i) => {
      const invert = card.invertDelta;
      const isPos = invert ? card.delta < 0 : card.delta > 0;
      const deltaClass = card.delta === 0 ? "" : isPos ? "positive" : "negative";
      const deltaSign = card.delta > 0 ? "+" : "";
      const val = card.format(card.value) + (card.suffix || "");
      return `
        <div class="kpi-card">
          <div class="label">${card.label}</div>
          <div class="value">${val}</div>
          <div class="delta ${deltaClass}">${deltaSign}${card.delta}% vs prev. period</div>
          <div class="sparkline">${renderSparkline(MOCK.sparklines[i])}</div>
          <div class="kpi-tooltip">${card.tooltip}</div>
        </div>`;
    })
    .join("");
}

function getFilteredChannels() {
  let rows = [...MOCK.channels];
  if (state.surface !== "all") {
    rows = rows.filter((r) => r.id === state.surface);
  }
  if (state.confidence === "high") {
    rows = rows.filter((r) => r.confidence === "high");
  } else if (state.confidence === "high-medium") {
    rows = rows.filter((r) => r.confidence === "high" || r.confidence === "medium");
  }
  const key = state.sortKey;
  rows.sort((a, b) => {
    let av = a[key];
    let bv = b[key];
    if (typeof av === "string") {
      av = av.toLowerCase();
      bv = bv.toLowerCase();
    }
    if (av < bv) return state.sortDir === "asc" ? -1 : 1;
    if (av > bv) return state.sortDir === "asc" ? 1 : -1;
    return 0;
  });
  return rows;
}

function trendLabel(trend) {
  if (trend === "up") return "↑ Up";
  if (trend === "down") return "↓ Down";
  return "→ Flat";
}

function renderTable() {
  const rows = getFilteredChannels();
  const comparison = state.attribution === "comparison";
  const pctMode = state.tableMode === "percent";
  const totalAi = MOCK.channels.reduce((s, r) => s + r.aiDriven, 0);

  const headers = [
    { key: "surface", label: "Surface" },
    { key: "lastTouch", label: "Last-Touch Revenue" },
    { key: "aiDriven", label: "AI-Driven Revenue" },
    { key: "direct", label: "Direct Conversions" },
    { key: "assisted", label: "Assisted Conversions" },
    { key: "intent", label: "Avg. Intent Score" },
    { key: "handoff", label: "Hand-off Rate" },
    { key: "confidence", label: "Confidence" },
    { key: "trend", label: "Trend" },
  ];

  document.getElementById("channel-table-head").innerHTML = `<tr>${headers
    .map(
      (h) =>
        `<th class="${state.sortKey === h.key ? "sorted" : ""}" data-sort="${h.key}">${h.label}<span class="sort-icon">${state.sortKey === h.key ? (state.sortDir === "asc" ? "↑" : "↓") : ""}</span></th>`
    )
    .join("")}</tr>`;

  document.getElementById("channel-table-body").innerHTML = rows
    .map((r) => {
      const selected = state.selectedChannel === r.id ? "selected" : "";
      const lt = pctMode ? `${((r.lastTouch / (totalAi || 1)) * 100).toFixed(0)}%` : formatCurrency(r.lastTouch);
      const ai = pctMode ? `${((r.aiDriven / totalAi) * 100).toFixed(0)}%` : formatCurrency(r.aiDriven);

      const aiCell =
        comparison && !pctMode
          ? `<td class="numeric"><div class="comparison-cell"><span class="ai-driven">${ai}</span><span class="last-touch">LT: ${lt}</span></div></td>`
          : `<td class="numeric">${ai}</td>`;

      return `
        <tr class="data-row ${selected}" data-channel="${r.id}">
          <td><div class="surface-cell"><span class="surface-icon">${r.icon}</span>${r.surface}</div></td>
          <td class="numeric">${lt}</td>
          ${aiCell}
          <td><span class="level">${r.direct}</span></td>
          <td><span class="level">${r.assisted}</span></td>
          <td class="numeric">${r.intent}</td>
          <td class="numeric">${r.handoff}%</td>
          <td><span class="confidence ${r.confidence}">${r.confidence}</span></td>
          <td><span class="trend ${r.trend}">${trendLabel(r.trend)}</span></td>
        </tr>`;
    })
    .join("");
}

function renderInsights() {
  document.getElementById("insights-working").innerHTML = MOCK.insights.working.map((t) => `<li>${t}</li>`).join("");
  document.getElementById("insights-actions").innerHTML = MOCK.insights.actions.map((t) => `<li>${t}</li>`).join("");
}

let mermaidReady = false;

function nodeName(id) {
  const n = MOCK.sankey.nodes.find((x) => x.id === id);
  return n ? n.name : id;
}

function csvCell(label) {
  if (/[",\n]/.test(label)) return `"${label.replace(/"/g, '""')}"`;
  return label;
}

/** High-contrast node colors so ribbons stay visible on dark background */
const SANKEY_NODE_COLORS = {
  "ChatGPT App": "#2dd4bf",
  "Claude MCP": "#c4b5fd",
  "Website Agent": "#38bdf8",
  "Direct / Other": "#e2e8f0",
  Discovery: "#14b8a6",
  Consideration: "#a78bfa",
  "Hand-off": "#22d3ee",
  "Return visit": "#f8fafc",
  "Revenue conversion": "#4ade80",
  "Qualified lead": "#facc15",
  "Checkout hand-off": "#60a5fa",
  "Drop-off": "#f87171",
};

function buildSankeyNodeColors() {
  const colors = { ...SANKEY_NODE_COLORS };
  MOCK.sankey.nodes.forEach((n) => {
    if (!colors[n.name]) colors[n.name] = "#3dd6c6";
  });
  return colors;
}

function buildMermaidSankeyDefinition() {
  const nameById = Object.fromEntries(MOCK.sankey.nodes.map((n) => [n.id, n.name]));
  const rows = MOCK.sankey.links.map((link) => {
    const src = csvCell(nameById[link.source] || link.source);
    const tgt = csvCell(nameById[link.target] || link.target);
    return `${src},${tgt},${link.value}`;
  });
  return ["sankey-beta", "", ...rows].join("\n");
}

const JOURNEY_NODE_NAMES = new Set(["Discovery", "Consideration", "Hand-off", "Return visit"]);

function labelNodeName(textEl) {
  const raw = (textEl.textContent || "").trim();
  return raw.split("\n")[0].trim();
}

function isJourneyLabel(textEl) {
  return JOURNEY_NODE_NAMES.has(labelNodeName(textEl));
}

function styleSankeyLabelPair(bg, fg) {
  const halo = "6";
  [bg, fg].forEach((text) => {
    if (!text) return;
    text.setAttribute("stroke", "#0a0e14");
    text.setAttribute("stroke-width", halo);
    text.setAttribute("stroke-linejoin", "round");
    text.setAttribute("paint-order", "stroke fill");
  });
  if (bg) bg.setAttribute("fill", "#0a0e14");
  if (fg) {
    fg.setAttribute("fill", "#f8fafc");
    fg.setAttribute("font-weight", "600");
    fg.setAttribute("font-size", "13");
  }
}

function getMiddleColumnRects(svg) {
  const nodeRects = [...svg.querySelectorAll("g.node rect")];
  const xs = nodeRects.map((r) => parseFloat(r.getAttribute("x") || "0")).filter(Number.isFinite);
  if (!xs.length) return [];
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const midLo = minX + (maxX - minX) * 0.22;
  const midHi = minX + (maxX - minX) * 0.72;
  return nodeRects
    .filter((r) => {
      const x = parseFloat(r.getAttribute("x") || "0");
      return x >= midLo && x <= midHi;
    })
    .sort((a, b) => parseFloat(a.getAttribute("y")) - parseFloat(b.getAttribute("y")));
}

function journeyNodesByVolume() {
  const incoming = {};
  MOCK.sankey.links.forEach((l) => {
    incoming[l.target] = (incoming[l.target] || 0) + l.value;
  });
  return MOCK.sankey.nodes
    .filter((n) => n.column === 1)
    .map((n) => ({ name: n.name, volume: incoming[n.id] || 0 }))
    .sort((a, b) => b.volume - a.volume);
}

function hideJourneySvgLabels(svg) {
  svg.querySelectorAll("g.node-labels text, .sankey-label-fg, .sankey-label-bg").forEach((text) => {
    if (JOURNEY_NODE_NAMES.has(labelNodeName(text))) {
      text.setAttribute("visibility", "hidden");
    }
  });
}

/** HTML labels above journey bars — SVG labels sit inside the ribbon fan. */
function mountJourneyHtmlLabels(container, svg) {
  container.querySelector(".sankey-journey-labels")?.remove();

  const midRects = getMiddleColumnRects(svg).sort(
    (a, b) => parseFloat(b.getAttribute("height")) - parseFloat(a.getAttribute("height"))
  );
  const nodes = journeyNodesByVolume();
  if (!midRects.length || !nodes.length) return;

  const hostRect = container.getBoundingClientRect();
  const overlay = document.createElement("div");
  overlay.className = "sankey-journey-labels";
  overlay.setAttribute("aria-hidden", "true");

  nodes.forEach((node, i) => {
    const rect = midRects[i];
    if (!rect) return;
    const box = rect.getBoundingClientRect();
    const left = box.left + box.width / 2 - hostRect.left;
    const top = Math.max(6, box.top - hostRect.top - 6);

    const pill = document.createElement("span");
    pill.className = "sankey-journey-label";
    pill.style.left = `${left}px`;
    pill.style.top = `${top}px`;
    pill.innerHTML = `<strong>${node.name}</strong><span>${node.volume}</span>`;
    overlay.appendChild(pill);
  });

  container.appendChild(overlay);
}

function enhanceSankeyVisuals(container) {
  const svg = container.querySelector("svg");
  if (!svg) return;

  /* Mermaid draws links after labels — ribbons cover middle-column text */
  const linksGroup = svg.querySelector("g.links");
  const labelsGroup = svg.querySelector("g.node-labels");
  const nodesGroup = svg.querySelector("g.nodes");
  if (linksGroup && labelsGroup) {
    svg.insertBefore(linksGroup, labelsGroup);
    svg.appendChild(labelsGroup);
  }
  if (nodesGroup && linksGroup) {
    svg.insertBefore(nodesGroup, linksGroup);
  }

  if (linksGroup) {
    linksGroup.setAttribute("stroke-opacity", "1");
    linksGroup.style.strokeOpacity = "1";
    linksGroup.style.mixBlendMode = "normal";
  }

  svg.querySelectorAll("g.link").forEach((link) => {
    link.style.mixBlendMode = "normal";
  });

  svg.querySelectorAll("g.links path, g.link path").forEach((path) => {
    const w = parseFloat(path.getAttribute("stroke-width") || "1");
    if (w > 0 && w < 3) path.setAttribute("stroke-width", String(Math.max(3, w)));
    path.setAttribute("stroke-opacity", "0.95");
    path.style.strokeOpacity = "0.95";
    path.style.filter = "brightness(1.15) saturate(1.2)";
    path.style.mixBlendMode = "normal";
  });

  svg.querySelectorAll("rect").forEach((rect) => {
    rect.setAttribute("stroke", "rgba(255, 255, 255, 0.35)");
    rect.setAttribute("stroke-width", "1");
  });

  svg.querySelectorAll(".sankey-label-fg").forEach((fg) => {
    const bg = fg.previousElementSibling?.classList?.contains("sankey-label-bg")
      ? fg.previousElementSibling
      : null;
    styleSankeyLabelPair(bg, fg);
  });

  svg.querySelectorAll("g.node-labels text:not(.sankey-label-fg):not(.sankey-label-bg)").forEach((text) => {
    text.setAttribute("fill", "#f8fafc");
    text.setAttribute("font-weight", "600");
    text.setAttribute("font-size", "13");
  });

  hideJourneySvgLabels(svg);
  requestAnimationFrame(() => {
    hideJourneySvgLabels(svg);
    mountJourneyHtmlLabels(container, svg);
  });
}

function initMermaid() {
  if (mermaidReady || typeof mermaid === "undefined") return;
  const width = document.getElementById("sankey-chart")?.clientWidth || 900;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    themeVariables: {
      darkMode: true,
      background: "#121820",
      fontFamily: "DM Sans, system-ui, sans-serif",
      primaryColor: "#243044",
      primaryBorderColor: "#3dd6c6",
      primaryTextColor: "#e8edf4",
      secondaryColor: "#1a2330",
      tertiaryColor: "#2a3544",
      lineColor: "#5eead4",
    },
    sankey: {
      width,
      height: 480,
      linkColor: "gradient",
      nodeAlignment: "justify",
      labelStyle: "outlined",
      showValues: true,
      nodeWidth: 16,
      nodePadding: 22,
      nodeColors: buildSankeyNodeColors(),
    },
  });
  mermaidReady = true;
}

async function renderSankey() {
  const container = document.getElementById("sankey-chart");
  if (!container) return;

  if (typeof mermaid === "undefined") {
    container.innerHTML =
      "<p style='color:var(--muted);padding:2rem'>Mermaid failed to load. Check your network connection.</p>";
    return;
  }

  initMermaid();
  const diagramId = `journey-sankey-${Date.now()}`;
  const definition = buildMermaidSankeyDefinition();

  container.innerHTML = `<pre class="mermaid" id="${diagramId}">${definition}</pre>`;
  const el = document.getElementById(diagramId);

  try {
    await mermaid.run({ nodes: [el] });
    enhanceSankeyVisuals(container);
  } catch (err) {
    console.error("Mermaid sankey failed", err);
    container.innerHTML = `<p style='color:var(--muted);padding:2rem'>Could not render Sankey diagram.</p><pre style='font-size:0.7rem;color:var(--muted);overflow:auto'>${err.message || err}</pre>`;
  }
}

function openDrawer(channelId) {
  const ch = MOCK.channels.find((c) => c.id === channelId);
  const detail = MOCK.drawerDetails[channelId];
  if (!ch || !detail) return;

  state.selectedChannel = channelId;
  document.getElementById("drawer-title").textContent = ch.surface;
  document.getElementById("drawer-role").textContent = detail.role;
  document.getElementById("drawer-journeys").innerHTML = detail.journeys.map((j) => `<li>${j}</li>`).join("");
  document.getElementById("drawer-intents").innerHTML = detail.intents.map((i) => `<li>${i}</li>`).join("");
  document.getElementById("drawer-dropoffs").innerHTML = detail.dropoffs.map((d) => `<li>${d}</li>`).join("");
  document.getElementById("drawer-stats").innerHTML = `
    <div class="stat"><div class="val">${formatCurrency(ch.aiDriven)}</div><div class="lbl">AI-Driven Revenue</div></div>
    <div class="stat"><div class="val">${ch.handoff}%</div><div class="lbl">Hand-off Rate</div></div>
    <div class="stat"><div class="val">${ch.intent}</div><div class="lbl">Avg. Intent</div></div>
    <div class="stat"><div class="val">${ch.direct}</div><div class="lbl">Direct Conv.</div></div>`;
  document.getElementById("drawer-guardrail").textContent = detail.guardrail;
  document.getElementById("drawer-overlay").classList.add("open");
  renderTable();
}

function closeDrawer() {
  state.selectedChannel = null;
  document.getElementById("drawer-overlay").classList.remove("open");
  renderTable();
}

function bindEvents() {
  const filterMap = {
    "date-range": "dateRange",
    "surface-filter": "surface",
    "outcome-filter": "outcome",
    "attribution-filter": "attribution",
    "confidence-filter": "confidence",
  };

  Object.keys(filterMap).forEach((id) => {
    document.getElementById(id).addEventListener("change", (e) => {
      state[filterMap[id]] = e.target.value;
      if (id === "attribution-filter") {
        document.querySelector(".filter-group.highlight")?.classList.remove("highlight");
        if (e.target.value === "comparison") {
          e.target.closest(".filter-group")?.classList.add("highlight");
        }
      }
      renderTable();
    });
  });

  document.getElementById("attribution-filter").closest(".filter-group")?.classList.add("highlight");

  document.querySelectorAll("[data-table-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.tableMode = btn.dataset.tableMode;
      document.querySelectorAll("[data-table-mode]").forEach((b) => b.classList.toggle("active", b === btn));
      renderTable();
    });
  });

  document.getElementById("channel-table-head").addEventListener("click", (e) => {
    const th = e.target.closest("th[data-sort]");
    if (!th) return;
    const key = th.dataset.sort;
    if (state.sortKey === key) {
      state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
    } else {
      state.sortKey = key;
      state.sortDir = key === "surface" ? "asc" : "desc";
    }
    renderTable();
  });

  document.getElementById("channel-table-body").addEventListener("click", (e) => {
    const row = e.target.closest("tr[data-channel]");
    if (row) openDrawer(row.dataset.channel);
  });

  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  document.getElementById("drawer-overlay").addEventListener("click", (e) => {
    if (e.target.id === "drawer-overlay") closeDrawer();
  });

  document.getElementById("clear-journey-filter").addEventListener("click", () => {
    state.activeJourneyFilter = null;
    document.getElementById("journey-filter-hint").style.display = "none";
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      mermaidReady = false;
      renderSankey();
    }, 250);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}

function init() {
  renderKpis();
  renderSankey();
  renderTable();
  renderInsights();
  bindEvents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/* --- v3: confidence score KPI + renderKpis override --- */
/* V3 keeps the original dashboard behavior and only replaces the KPI strip. */
MOCK.kpis.trustworthyEnoughToAct = {
  value: 82,
  delta: 6.0,
  deterministic: 78,
  probabilistic: 14,
  unassigned: 8,
  tooltip:
    "Bazak.ai Confidence Score measures how reliable this attribution story is, based on provable stitching, modeled stitching, and unassigned influence.",
};

MOCK.sparklines.push([68, 70, 72, 74, 76, 79, 82]);

function renderTrustGauge(card) {
  const score = Math.max(0, Math.min(100, card.value));
  const angle = -90 + score * 1.8;

  return `
    <div class="trust-gauge" aria-label="Trust score ${score} out of 100">
      <div class="trust-gauge-fill" style="--score:${score}%;"></div>
      <div class="trust-gauge-needle" style="--angle:${angle}deg;"></div>
      <div class="trust-gauge-label">${score}/100</div>
    </div>
    <div class="trust-breakdown" aria-label="Attribution confidence breakdown">
      <span>${card.deterministic}% deterministic</span>
      <span>${card.probabilistic}% probabilistic</span>
      <span>${card.unassigned}% unassigned</span>
    </div>
  `;
}

function renderKpis() {
  const cards = [
    { label: "AI-Attributed Revenue", format: (v) => formatCurrency(v), ...MOCK.kpis.aiAttributedRevenue },
    { label: "AI-Influenced Conversions", format: (v) => `${formatNumber(v)}`, suffix: " conv.", ...MOCK.kpis.aiInfluencedConversions },
    { label: "Blended Conversion Rate", format: (v) => `${v}%`, ...MOCK.kpis.blendedCvr },
    { label: "Cost per Attributed Conversion", format: (v) => `$${v}`, ...MOCK.kpis.costPerConversion },
    { label: "Share of Assisted Revenue", format: (v) => `${v}%`, ...MOCK.kpis.assistedRevenueShare },
    {
      label: "Bazak.ai Confidence Score",
      format: (v) => `${v}/100`,
      isTrustCard: true,
      ...MOCK.kpis.trustworthyEnoughToAct,
    },
  ];

  document.getElementById("kpi-strip").innerHTML = cards
    .map((card, i) => {
      const invert = card.invertDelta;
      const isPos = invert ? card.delta < 0 : card.delta > 0;
      const deltaClass = card.delta === 0 ? "" : isPos ? "positive" : "negative";
      const deltaSign = card.delta > 0 ? "+" : "";
      const val = card.format(card.value) + (card.suffix || "");
      const trustMarkup = card.isTrustCard ? renderTrustGauge(card) : `<div class="value">${val}</div>`;

      return `
        <div class="kpi-card ${card.isTrustCard ? "trust-card" : ""}">
          <div class="label">${card.label}</div>
          ${trustMarkup}
          <div class="delta ${deltaClass}">${deltaSign}${card.delta}% vs prev. period</div>
          ${card.isTrustCard ? "" : `<div class="sparkline">${renderSparkline(MOCK.sparklines[i])}</div>`}
          <div class="kpi-tooltip">${card.tooltip}</div>
        </div>`;
    })
    .join("");
}
