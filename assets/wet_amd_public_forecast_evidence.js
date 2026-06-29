(async function () {
  "use strict";

  const DATA_URL = "assets/data/wet_amd_forecast_programs.json?v=six-program-framework";
  const engine = window.WetAmdForecastEngine;
  let data;

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    data = await response.json();
  } catch (error) {
    document.body.innerHTML = `<main class="page"><section class="section"><h1>Evidence data failed to load.</h1><p class="deck">Serve this static site through a local server or GitHub Pages so the JSON data file can be fetched. Error: ${esc(error.message)}</p></section></main>`;
    return;
  }

  const PROGRAMS = data.programs || [];
  const DRUG_ORDER = PROGRAMS.map(program => program.shortName);
  const COLORS = {
    "Model base case": "#000000",
    "Public wet AMD estimate": "#2e72dc",
    "Public adjusted wet AMD estimate": "#159788",
    "Public multi-indication estimate": "#c2170a",
    "Public benchmark": "#6A737B"
  };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function money(value) {
    if (value == null) return "Not quantified";
    return value >= 1000 ? "$" + (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + "B" : "$" + Math.round(value) + "M";
  }

  function cite(label, url) {
    return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
  }

  function modelPeaks() {
    return PROGRAMS.map(program => {
      if (program.lockedBaseline) {
        return {
          drug: program.shortName,
          value: program.lockedOutputs.peakWorldwideSalesM,
          year: program.lockedOutputs.peakYear,
          scope: "Wet AMD model",
          type: "Model base case",
          source: "This model",
          metric: "Base-case peak worldwide sales",
          note: "Locked standalone Ixo-vec baseline."
        };
      }
      const assumptions = engine.scenarioAssumptions(data, program, "Base");
      const model = engine.compute(data, program, assumptions, "Base");
      const summary = engine.summary(data, model, program);
      return {
        drug: program.shortName,
        value: Math.round(summary.peak.world),
        year: summary.peak.year,
        scope: "Wet AMD model",
        type: "Model base case",
        source: "This model",
        metric: "Base-case peak worldwide sales",
        note: `${program.mechanicType === "repeat_course" ? "Repeat-course" : "One-time"} if-approved commercial forecast.`
      };
    });
  }

  function publicRows() {
    const rows = [];
    for (const program of PROGRAMS) {
      if (program.lockedBaseline && program.schedule14d9Benchmark) {
        rows.push({
          drug: program.shortName,
          source: "Adverum Schedule 14D-9",
          date: "2025 transaction disclosure",
          metric: "2036 worldwide net-sales projection",
          value: program.lockedOutputs.schedule14d9SelectedYearM,
          year: program.lockedOutputs.selectedYear,
          scope: "Ixo-vec external benchmark",
          type: "Public benchmark",
          note: "External management projection shown for comparison only. It is not used to calculate the locked Ixo-vec model.",
          url: "https://www.sec.gov/Archives/edgar/data/1501756/000119312525272604/d91171dsc14d9.htm",
          evidenceImage: "",
          captureNote: "Schedule 14D-9 benchmark is documented in the Ixo-vec standalone model and shared schema."
        });
      }
      const estimates = ((data.publicSalesEstimates || {})[program.slug] || []);
      for (const estimate of estimates) {
        const productEvidence = (data.productEvidence || {})[program.slug] || {};
        const benchmark = productEvidence.benchmark || {};
        const firstLink = (benchmark.links || [])[0] || {};
        const firstCapture = (benchmark.captures || [])[0] || {};
        rows.push({
          drug: program.shortName,
          source: estimate.label,
          date: "Public source",
          metric: estimate.description || "Sales estimate",
          value: estimate.value,
          year: estimate.year,
          scope: estimate.scope,
          type: estimate.type === "adjusted" ? "Public adjusted wet AMD estimate" : estimate.type === "multi" ? "Public multi-indication estimate" : "Public wet AMD estimate",
          note: estimate.caveat || "",
          url: firstLink.url || (program.source && program.source.url) || "#",
          evidenceImage: firstCapture.src || "",
          captureNote: firstCapture.caption || "Source capture or derivation panel."
        });
      }
    }
    return rows;
  }

  function chartSvg(modelRows, externalRows) {
    const plotted = [...modelRows, ...externalRows.filter(row => row.value != null)];
    const width = 1120, height = 560, left = 82, right = 1068, top = 42, bottom = 430;
    const max = Math.max(3500, ...plotted.map(row => row.value || 0)) * 1.05;
    const band = (right - left) / DRUG_ORDER.length;
    const x = drug => left + (DRUG_ORDER.indexOf(drug) + 0.5) * band;
    const y = value => bottom - (value / max) * (bottom - top);
    const ticks = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000].filter(tick => tick <= max);
    const grid = ticks.map(tick => `<line x1="${left}" y1="${y(tick).toFixed(1)}" x2="${right}" y2="${y(tick).toFixed(1)}" class="grid-line"/><text x="66" y="${(y(tick) + 4).toFixed(1)}" text-anchor="end" class="axis-label">${tick === 0 ? "$0" : money(tick)}</text>`).join("");
    const guides = DRUG_ORDER.map(drug => `<line x1="${x(drug).toFixed(1)}" y1="${top}" x2="${x(drug).toFixed(1)}" y2="${bottom}" stroke="#d9e1e7"/><text x="${x(drug).toFixed(1)}" y="474" text-anchor="middle" class="evidence-axis-title">${esc(drug)}</text>`).join("");
    const ranked = {};
    for (const drug of DRUG_ORDER) ranked[drug] = plotted.filter(row => row.drug === drug).sort((a, b) => (a.value || 0) - (b.value || 0));
    const points = plotted.map(row => {
      const group = ranked[row.drug] || [];
      const rank = group.indexOf(row);
      const cx = x(row.drug);
      const cy = y(row.value);
      const label = `${money(row.value)}${row.year ? " " + row.year : " peak"}`;
      const side = rank % 2 === 0 ? -1 : 1;
      const anchor = side < 0 ? "end" : "start";
      const dx = side < 0 ? -12 : 12;
      const dy = (rank - (group.length - 1) / 2) * 8;
      return `<g><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${row.type === "Model base case" ? 7 : 6}" fill="${COLORS[row.type] || "#5b7282"}"/><text x="${(cx + dx).toFixed(1)}" y="${(cy + 4 + dy).toFixed(1)}" text-anchor="${anchor}" class="evidence-point-label">${esc(label)}</text></g>`;
    }).join("");
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Comparison of internal model peaks and public sales estimates">${grid}<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" class="axis"/><line x1="${left}" y1="${top}" x2="${left}" y2="${bottom}" class="axis"/>${guides}${points}</svg>`;
  }

  function legend() {
    return Object.entries(COLORS).map(([label, color]) => `<span class="evidence-legend-item"><i style="background:${color}"></i>${esc(label)}</span>`).join("");
  }

  function estimateCard(row, index) {
    const detailLabel = row.evidenceImage ? "Show evidence screenshot" : "Show capture note";
    const detailTitle = `${row.drug}: ${row.metric}`;
    return `<article class="evidence-card">
      <div>
        <div class="metric-label"><span class="input-code">${index + 1}</span>${esc(row.drug)}</div>
        <h3>${money(row.value)} ${esc(row.metric)}</h3>
        <p>${esc(row.scope)}. ${esc(row.note)} Source: ${cite(row.source, row.url)}.</p>
      </div>
      <button class="evidence-toggle" type="button" aria-haspopup="dialog" aria-controls="evidence-modal" data-evidence-title="${esc(detailTitle)}" data-evidence-note="${esc(row.captureNote)}" data-evidence-image="${esc(row.evidenceImage || "")}">${detailLabel}</button>
    </article>`;
  }

  function tableRows(modelRows, externalRows) {
    return [...modelRows, ...externalRows].map(row => `<tr><td>${esc(row.drug)}</td><td>${esc(row.source)}</td><td>${esc(row.metric)}</td><td>${money(row.value)}</td><td>${row.year || "Not disclosed"}</td><td>${esc(row.scope)}</td><td>${esc(row.note)}</td></tr>`).join("");
  }

  function render() {
    const modelRows = modelPeaks();
    const externalRows = publicRows();
    document.title = "Wet AMD Public Sales Forecasts";
    document.body.innerHTML = `<main class="page">
      <header>
        <div>
          <h1 class="evidence-title">Public Sales Forecasts</h1>
          <p class="deck">A view of publicly available wet AMD pipeline sales estimates, compared with the current base-case model peaks for six pipeline programs.</p>
        </div>
        <aside class="meta">
          <div><strong>Scope check</strong> Each estimate is labeled as wet AMD-only, probability-adjusted, multi-indication, or a transaction benchmark.</div>
          <div><strong>Evidence</strong> Inline citations link to sources; screenshots are hidden behind buttons to keep the page readable.</div>
        </aside>
      </header>
      <nav class="nav-tools" aria-label="Forecast evidence navigation"><a href="index.html">Forecast index</a><a href="#evidence-table">Evidence table</a></nav>
      <section class="section">
        <div class="section-head">
          <h2>Estimate comparison</h2>
          <p>Dots compare public numeric estimates with the current model peak for each drug. Public peak-year timing is shown when disclosed. A peak year of "not disclosed" means the public article gave a peak-sales figure without the year in the accessible text.</p>
        </div>
        <div class="chart-panel evidence-chart">
          ${chartSvg(modelRows, externalRows)}
          <div class="evidence-legend">${legend()}</div>
        </div>
      </section>
      <section class="section">
        <div class="section-head">
          <h2>Interpretation</h2>
          <p>Wet AMD-only estimates can be compared directly with the model's wet AMD sales. Adjusted estimates are probability-weighted. Multi-indication figures include additional diseases and should not be used to force the wet AMD model upward without adding those indications.</p>
        </div>
        <div class="definitions">
          <div class="definition"><strong>Wet AMD only</strong><p>Forecast covers neovascular age-related macular degeneration, the indication modeled in these pages.</p></div>
          <div class="definition"><strong>Adjusted sales</strong><p>Sales discounted for probability of clinical and regulatory success. These values can be lower than unadjusted commercial sales.</p></div>
          <div class="definition"><strong>Multi-indication</strong><p>Forecast or opportunity includes additional retinal diseases, such as diabetic retinopathy or diabetic macular edema.</p></div>
          <div class="definition"><strong>Public benchmark</strong><p>A transaction or company projection shown for comparison. It is not used to calculate the current model curve.</p></div>
        </div>
      </section>
      <section class="section">
        <div class="section-head">
          <h2>Source evidence</h2>
          <p>Each item includes a citation and a popup screenshot or capture note. Reader-rendered captures are used only when the original page blocks automated screenshot capture but the source text remains publicly accessible.</p>
        </div>
        <div class="evidence-grid">${externalRows.map(estimateCard).join("")}</div>
      </section>
      <section class="section" id="evidence-table">
        <div class="section-head">
          <h2>Forecast table</h2>
          <p>The table combines the current model peak with public numeric and qualitative estimates so readers can separate model output from external benchmarks.</p>
        </div>
        <div class="table-wrap"><table><thead><tr><th>Drug</th><th>Source</th><th>Metric</th><th>Value</th><th>Year</th><th>Scope</th><th>Context</th></tr></thead><tbody>${tableRows(modelRows, externalRows)}</tbody></table></div>
      </section>
    </main>
    <div class="evidence-modal" id="evidence-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="evidence-modal-title">
      <div class="evidence-modal-panel">
        <div class="evidence-modal-head">
          <div class="evidence-modal-title" id="evidence-modal-title">Source evidence</div>
          <button type="button" class="evidence-modal-close" id="evidence-modal-close">Close</button>
        </div>
        <div class="evidence-modal-body" id="evidence-modal-body"></div>
      </div>
    </div>`;

    const modal = document.getElementById("evidence-modal");
    const modalTitle = document.getElementById("evidence-modal-title");
    const modalBody = document.getElementById("evidence-modal-body");
    const modalClose = document.getElementById("evidence-modal-close");
    let lastTrigger = null;

    function closeModal() {
      modal.setAttribute("aria-hidden", "true");
      modalBody.innerHTML = "";
      if (lastTrigger) lastTrigger.focus();
    }

    document.querySelectorAll(".evidence-toggle").forEach(button => {
      button.addEventListener("click", () => {
        lastTrigger = button;
        const title = button.dataset.evidenceTitle || "Source evidence";
        const note = button.dataset.evidenceNote || "";
        const image = button.dataset.evidenceImage || "";
        modalTitle.textContent = title;
        modalBody.innerHTML = `<p class="source-note">${esc(note)}</p>${image ? `<img src="${esc(image)}" alt="Highlighted evidence screenshot for ${esc(title)}">` : ""}`;
        modal.setAttribute("aria-hidden", "false");
        modalClose.focus();
      });
    });
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
    });
  }

  render();
})();
