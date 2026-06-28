(function () {
  const MODEL_PEAKS = [
    { drug: "AXPAXLI", value: 783, year: 2033, scope: "Wet AMD model", type: "Model base case" },
    { drug: "DURAVYU", value: 452, year: 2034, scope: "Wet AMD model", type: "Model base case" },
    { drug: "RGX-314", value: 989, year: 2036, scope: "Wet AMD model", type: "Model base case" },
    { drug: "4D-150", value: 1620, year: 2036, scope: "Wet AMD model", type: "Model base case" },
    { drug: "CLS-AX", value: 120, year: 2038, scope: "Wet AMD model", type: "Model base case" }
  ];

  const PUBLIC_ESTIMATES = [
    {
      drug: "AXPAXLI",
      source: "Needham, quoted by Sahm/Benzinga",
      date: "Mar. 11, 2025",
      metric: "Peak sales",
      value: 1500,
      year: null,
      scope: "Wet AMD only",
      type: "Public wet AMD estimate",
      note: "Second-line wet AMD patients treated with anti-VEGF who are dissatisfied with injection burden or not adequately controlled.",
      url: "https://www.sahmcapital.com/news/content/ocular-therapeutix-axpaxli-advances-in-phase-3-for-wet-amd-analyst-forecasts-huge-upside-2025-03-11",
      evidenceImage: "assets/evidence/axpaxli-needham.png",
      captureNote: "Direct source capture with highlighted forecast text."
    },
    {
      drug: "AXPAXLI",
      source: "TD Cowen, quoted by Investing.com",
      date: "Oct. 30, 2025",
      metric: "Peak sales",
      value: 1000,
      year: null,
      scope: "Wet AMD only; separate NPDR estimate excluded from the chart",
      type: "Public wet AMD estimate",
      note: "The article reports a $1.0B wAMD opportunity and a separate $800M NPDR opportunity. NPDR is non-proliferative diabetic retinopathy.",
      url: "https://www.investing.com/news/analyst-ratings/ocular-therapeutix-stock-price-target-raised-to-20-from-14-at-td-cowen-93CH-4320422",
      evidenceImage: "assets/evidence/axpaxli-td-cowen.png",
      captureNote: "Saved-text evidence panel from source article text; used because clean live-page screenshots are not consistently available for this article."
    },
    {
      drug: "DURAVYU",
      source: "Jefferies, quoted by Investing.com",
      date: "Oct. 25, 2024",
      metric: "Peak adjusted sales",
      value: 1100,
      year: null,
      scope: "Wet AMD only; U.S. plus EU",
      type: "Public adjusted wet AMD estimate",
      note: "Reported as $600M U.S. plus $500M EU peak adjusted sales, with 65% probability of success. Adjusted means probability-weighted rather than a full unadjusted commercial forecast.",
      url: "https://www.investing.com/news/company-news/eyepoint-stock-gains-traction-with-new-amd-trials-jefferies-sees-65-upside-93CH-3682827",
      evidenceImage: "assets/evidence/duravyu-jefferies.png",
      captureNote: "Saved-text evidence panel from source article text; used because clean live-page screenshots are not consistently available for this article."
    },
    {
      drug: "RGX-314",
      source: "REGENXBIO company release",
      date: "Mar. 28, 2024",
      metric: "Commercial opportunity",
      value: null,
      year: null,
      scope: "Wet AMD plus diabetic retinopathy",
      type: "Qualitative multi-indication opportunity",
      note: "Company language describes multi-billion-dollar potential across wet AMD and diabetic retinopathy, not a wet AMD-only forecast.",
      url: "https://regenxbio.gcs-web.com/news-releases/news-release-details/regenxbio-announces-lancet-publication-phase-iiia-study",
      evidenceImage: "assets/evidence/rgx-314-regenxbio.png",
      captureNote: "Reader-rendered source capture with highlighted multi-indication language; used because the direct release blocked automated capture."
    },
    {
      drug: "RGX-314",
      source: "Motley Fool contributor model",
      date: "Sep. 27, 2021",
      metric: "Annual sales by 2030",
      value: 2100,
      year: 2030,
      scope: "Wet AMD plus diabetic retinopathy",
      type: "Public multi-indication estimate",
      note: "Older contributor-derived model based on assumed share across wet AMD and diabetic retinopathy.",
      url: "https://www.fool.com/investing/2021/09/27/could-abbvies-new-collaboration-be-a-blockbuster/",
      evidenceImage: "assets/evidence/rgx-314-motley-fool.png",
      captureNote: "Direct source capture with highlighted forecast text."
    },
    {
      drug: "4D-150",
      source: "BofA, quoted by TipRanks/The Fly",
      date: "Feb. 8, 2024",
      metric: "Risk-adjusted peak sales",
      value: 2800,
      year: null,
      scope: "Wet AMD only",
      type: "Public adjusted wet AMD estimate",
      note: "Risk-adjusted forecast after positive Phase 2 PRISM data. Risk-adjusted means the analyst discounts sales for development and approval risk.",
      url: "https://www.tipranks.com/news/the-fly/4d-molecular-price-target-raised-to-82-from-33-at-bofa",
      evidenceImage: "assets/evidence/four-d-150-bofa.png",
      captureNote: "Reader-rendered source capture with highlighted forecast text."
    },
    {
      drug: "4D-150",
      source: "Goldman Sachs, quoted by Investing.com",
      date: "Jan. 2024",
      metric: "Peak sales",
      value: 2400,
      year: null,
      scope: "Wet AMD only",
      type: "Public wet AMD estimate",
      note: "The public article reports a $2.4B peak sales estimate, with the underlying analyst model not public.",
      url: "https://www.investing.com/news/stock-market-news/goldman-sachs-sets-81-target-on-4d-molecular-upgrades-to-buy-93CH-3295809",
      evidenceImage: "assets/evidence/four-d-150-goldman.png",
      captureNote: "Saved-text evidence panel from source article text; used because clean live-page screenshots are not consistently available for this article."
    },
    {
      drug: "CLS-AX",
      source: "GlobalData, quoted by Clinical Trials Arena",
      date: "Oct. 2024",
      metric: "2030 annual sales if approved",
      value: 204,
      year: 2030,
      scope: "Appears wet AMD only",
      type: "Public wet AMD estimate",
      note: "The article is framed around Clearside's wet AMD drug-device program; the underlying GlobalData model is not fully public.",
      url: "https://www.clinicaltrialsarena.com/news/clearsides-wet-amd-drug-device-combo-shines-in-phase-iib-study/",
      evidenceImage: "assets/evidence/cls-ax-globaldata.png",
      captureNote: "Direct source capture with highlighted forecast text."
    }
  ];

  const DRUG_ORDER = ["AXPAXLI", "DURAVYU", "RGX-314", "4D-150", "CLS-AX"];
  const COLORS = {
    "Model base case": "#000000",
    "Public wet AMD estimate": "#2e72dc",
    "Public adjusted wet AMD estimate": "#159788",
    "Public multi-indication estimate": "#c2170a",
    "Qualitative multi-indication opportunity": "#8d8f91"
  };

  function money(value) {
    if (value == null) return "Not quantified";
    return value >= 1000 ? "$" + (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + "B" : "$" + value + "M";
  }

  function cite(label, url) {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  }

  function chartSvg() {
    const plotted = [
      ...MODEL_PEAKS.map(d => ({ ...d, source: "This model", metric: "Base-case peak sales" })),
      ...PUBLIC_ESTIMATES.filter(d => d.value != null)
    ];
    const width = 1040, height = 520, left = 138, right = 990, top = 54, rowGap = 78;
    const max = 3000;
    const x = value => left + (value / max) * (right - left);
    const y = drug => top + DRUG_ORDER.indexOf(drug) * rowGap;
    const ticks = [0, 500, 1000, 1500, 2000, 2500, 3000];
    const grid = ticks.map(t => `<line x1="${x(t)}" y1="28" x2="${x(t)}" y2="420" class="grid-line"/><text x="${x(t)}" y="452" text-anchor="middle" class="axis-label">${t === 0 ? "$0" : money(t)}</text>`).join("");
    const rows = DRUG_ORDER.map(drug => `<line x1="${left}" y1="${y(drug)}" x2="${right}" y2="${y(drug)}" stroke="#e3e8ec"/><text x="118" y="${y(drug) + 5}" text-anchor="end" class="evidence-axis-title">${drug}</text>`).join("");
    const points = plotted.map(d => {
      const offset = d.type === "Model base case" ? -16 : d.type.includes("adjusted") ? 14 : d.type.includes("multi") ? 28 : 0;
      const cy = y(d.drug) + offset;
      const label = `${money(d.value)}${d.year ? " " + d.year : " peak"}`;
      const anchor = d.value > 2400 ? "end" : "start";
      const dx = d.value > 2400 ? -10 : 10;
      return `<g><circle cx="${x(d.value)}" cy="${cy}" r="${d.type === "Model base case" ? 7 : 6}" fill="${COLORS[d.type] || "#5b7282"}"/><text x="${x(d.value) + dx}" y="${cy + 4}" text-anchor="${anchor}" class="evidence-point-label">${label}</text></g>`;
    }).join("");
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Comparison of internal model peaks and public sales estimates">${grid}<line x1="${left}" y1="420" x2="${right}" y2="420" class="axis"/>${rows}${points}</svg>`;
  }

  function legend() {
    return Object.entries(COLORS).map(([label, color]) => `<span class="evidence-legend-item"><i style="background:${color}"></i>${label}</span>`).join("");
  }

  function estimateCard(row, index) {
    const screenshot = row.evidenceImage
      ? `<div class="evidence-shot-panel" id="evidence-shot-${index}" hidden><p class="source-note">${row.captureNote}</p><img src="${row.evidenceImage}" alt="Highlighted evidence screenshot for ${row.drug} ${row.source}"></div>`
      : `<div class="evidence-shot-panel" id="evidence-shot-${index}" hidden><p class="source-note">${row.captureNote}</p></div>`;
    return `<article class="evidence-card">
      <div>
        <div class="metric-label"><span class="input-code">${index + 1}</span>${row.drug}</div>
        <h3>${money(row.value)} ${row.metric}</h3>
        <p>${row.scope}. ${row.note} Source: ${cite(row.source, row.url)}.</p>
      </div>
      <button class="evidence-toggle" type="button" aria-expanded="false" aria-controls="evidence-shot-${index}">${row.evidenceImage ? "Show evidence screenshot" : "Show capture note"}</button>
      ${screenshot}
    </article>`;
  }

  function tableRows() {
    const rows = [
      ...MODEL_PEAKS.map(row => ({ ...row, source: "This model", metric: "Base-case peak worldwide sales", note: "Wet AMD-only base case." })),
      ...PUBLIC_ESTIMATES
    ];
    return rows.map(row => `<tr><td>${row.drug}</td><td>${row.source}</td><td>${row.metric}</td><td>${money(row.value)}</td><td>${row.year || "Not disclosed"}</td><td>${row.scope}</td><td>${row.note}</td></tr>`).join("");
  }

  function render() {
    document.title = "Wet AMD Public Sales Forecast Evidence";
    document.body.innerHTML = `<main class="page">
      <header>
        <div>
          <h1>Public Sales Forecast Evidence</h1>
          <p class="deck">A source-backed view of publicly available wet AMD pipeline sales estimates, compared with the current base-case model peaks for the five non-ixo-vec programs.</p>
        </div>
        <aside class="meta">
          <div><strong>Scope check</strong> Each estimate is labeled as wet AMD-only, probability-adjusted, or multi-indication.</div>
          <div><strong>Evidence</strong> Inline citations link to sources; screenshots are hidden behind buttons to keep the page readable.</div>
        </aside>
      </header>
      <nav class="nav-tools" aria-label="Forecast evidence navigation"><a href="index.html">Forecast index</a><a href="ixo_vec_base_case_sales_forecast_infographic.html">Ixo-vec reference</a><a href="#evidence-table">Evidence table</a></nav>
      <section class="section">
        <div class="section-head">
          <h2>Estimate comparison</h2>
          <p>Dots compare public numeric estimates with the current model peak for each drug. Public peak-year timing is shown when disclosed. A peak year of "not disclosed" means the public article gave a peak-sales figure without the year in the accessible text.</p>
        </div>
        <div class="chart-panel evidence-chart">
          ${chartSvg()}
          <div class="evidence-legend">${legend()}</div>
        </div>
      </section>
      <section class="section">
        <div class="section-head">
          <h2>Interpretation</h2>
          <p>Wet AMD-only estimates can be compared directly with the model's wet AMD sales. Multi-indication figures include additional diseases such as diabetic retinopathy, diabetic macular edema, or broader VEGF-driven retinopathy and should not be used to force the wet AMD model upward without adding those indications.</p>
        </div>
        <div class="definitions">
          <div class="definition"><strong>Wet AMD only</strong><p>Forecast covers neovascular age-related macular degeneration, the indication modeled in these pages.</p></div>
          <div class="definition"><strong>Adjusted sales</strong><p>Sales discounted for probability of clinical and regulatory success. These values can be lower than unadjusted commercial sales.</p></div>
          <div class="definition"><strong>Multi-indication</strong><p>Forecast or opportunity includes additional retinal diseases, such as diabetic retinopathy or diabetic macular edema.</p></div>
          <div class="definition"><strong>Peak year</strong><p>The year when a forecast reaches its maximum annual sales. Some public snippets disclose peak sales without giving the year.</p></div>
        </div>
      </section>
      <section class="section">
        <div class="section-head">
          <h2>Source evidence</h2>
          <p>Each item includes a citation and a collapsible screenshot or capture note. Reader-rendered captures are used only when the original page blocks automated screenshot capture but the source text remains publicly accessible.</p>
        </div>
        <div class="evidence-grid">${PUBLIC_ESTIMATES.map(estimateCard).join("")}</div>
      </section>
      <section class="section" id="evidence-table">
        <div class="section-head">
          <h2>Forecast table</h2>
          <p>The table combines the current model peak with public numeric and qualitative estimates so readers can separate model output from external benchmarks.</p>
        </div>
        <div class="table-wrap"><table><thead><tr><th>Drug</th><th>Source</th><th>Metric</th><th>Value</th><th>Year</th><th>Scope</th><th>Context</th></tr></thead><tbody>${tableRows()}</tbody></table></div>
      </section>
    </main>`;
    document.querySelectorAll(".evidence-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const target = document.getElementById(button.getAttribute("aria-controls"));
        const open = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!open));
        target.hidden = open;
        button.textContent = open ? (target.querySelector("img") ? "Show evidence screenshot" : "Show capture note") : "Hide details";
      });
    });
  }

  render();
})();
