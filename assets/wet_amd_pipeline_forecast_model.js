(async function () {
  "use strict";

  const DATA_URL = "assets/data/wet_amd_forecast_programs.json?v=six-program-framework";
  const engine = window.WetAmdForecastEngine;
  if (!engine) {
    document.body.innerHTML = "<main class=\"page\"><section class=\"section\"><h1>Forecast engine failed to load.</h1></section></main>";
    return;
  }

  let data;
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    data = await response.json();
  } catch (error) {
    document.body.innerHTML = `<main class="page"><section class="section"><h1>Forecast data failed to load.</h1><p class="deck">Serve this static site through a local server or GitHub Pages so the JSON data file can be fetched. Error: ${esc(error.message)}</p></section></main>`;
    return;
  }

  const YEARS = engine.buildYears(data.years);
  const SEGMENTS = (data.segments || []).map(segment => segment.id);
  const PROGRAMS = Object.fromEntries((data.programs || []).map(program => [program.id, program]));

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function num(value) { return Number(value) || 0; }
  function fmtMoney(value) { return Math.abs(value) >= 1000 ? "$" + (value / 1000).toFixed(2) + "B" : "$" + Math.round(value).toLocaleString() + "M"; }
  function fmtSignedMoney(value) { return (value < 0 ? "-" : "") + fmtMoney(Math.abs(value)); }
  function fmtEyes(value) { return Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + "k" : Math.round(value).toLocaleString(); }
  function fmtPct(value) { return (value * 100).toFixed(value < 0.1 && value > 0 ? 1 : 0) + "%"; }
  function fmtUnit(program) { return program.mechanicType === "repeat_course" ? "treated-eye-year" : "treatment course"; }

  function publicEstimatesForDrug(program) {
    return ((data.publicSalesEstimates || {})[program.slug] || []).filter(estimate => estimate.value != null);
  }

  function publicEstimateClass(estimate) {
    return estimate.type === "adjusted" ? "estimate-adjusted" : estimate.type === "multi" ? "estimate-multi" : "estimate-wet";
  }

  function publicEstimateLegend(program) {
    const labels = {
      wet: "Public wet AMD estimate",
      adjusted: "Public adjusted estimate",
      multi: "Public multi-indication estimate"
    };
    const seen = new Set();
    return publicEstimatesForDrug(program).map(estimate => {
      if (seen.has(estimate.type)) return "";
      seen.add(estimate.type);
      return `<span class="${publicEstimateClass(estimate)}">${labels[estimate.type]}</span>`;
    }).join("");
  }

  function publicEstimateNote(program, peakYear) {
    const estimates = publicEstimatesForDrug(program);
    if (!estimates.length) return "";
    const items = estimates.map(estimate => {
      const timing = estimate.year ? `in ${estimate.year}` : `peak estimate, plotted at the model peak year ${peakYear} because the public peak year was not disclosed`;
      return `${estimate.label} ${fmtMoney(estimate.value)} ${timing}`;
    }).join("; ");
    const sourceCaveats = estimates.map(estimate => estimate.caveat).filter(Boolean).join(" ");
    const hasAdjusted = estimates.some(estimate => estimate.type === "adjusted");
    const hasMulti = estimates.some(estimate => estimate.type === "multi");
    const caveats = [
      "External estimate markers are not used to calculate the model curve.",
      sourceCaveats,
      hasAdjusted ? "Adjusted estimates are probability-weighted." : "",
      hasMulti ? "Multi-indication estimates include diseases beyond wet AMD." : ""
    ].filter(Boolean).join(" ");
    return `<p class="chart-note"><strong>External estimate markers:</strong> ${esc(items)}. ${esc(caveats)}</p>`;
  }

  function publicEstimateMarkers(program, peakYear, x, yy, left, right, top, bottom) {
    const estimates = publicEstimatesForDrug(program);
    if (!estimates.length) return "";
    const counts = {};
    for (const estimate of estimates) {
      const plotYear = estimate.year || peakYear;
      counts[plotYear] = (counts[plotYear] || 0) + 1;
    }
    const positions = {};
    return estimates.map(estimate => {
      const plotYear = estimate.year || peakYear;
      if (plotYear < YEARS[0] || plotYear > YEARS[YEARS.length - 1]) return "";
      positions[plotYear] = positions[plotYear] || 0;
      const index = positions[plotYear]++;
      const cx = x(plotYear);
      const cy = yy(estimate.value);
      const anchor = plotYear >= 2041 ? "text-anchor=\"end\"" : "";
      const dx = plotYear >= 2041 ? -10 : 10;
      const labelY = clamp(cy - 20 - index * 18, top + 12, bottom - 8);
      const klass = publicEstimateClass(estimate);
      const timing = estimate.year ? estimate.year : "peak";
      const label = `${estimate.label} ${fmtMoney(estimate.value)} ${timing}`;
      return `<line x1="${left}" y1="${cy.toFixed(1)}" x2="${right}" y2="${cy.toFixed(1)}" class="estimate-guide ${klass}"/><path d="M ${cx.toFixed(1)} ${(cy - 6).toFixed(1)} L ${(cx + 6).toFixed(1)} ${cy.toFixed(1)} L ${cx.toFixed(1)} ${(cy + 6).toFixed(1)} L ${(cx - 6).toFixed(1)} ${cy.toFixed(1)} Z" class="estimate-dot ${klass}"/><text x="${(cx + dx).toFixed(1)}" y="${labelY.toFixed(1)}" ${anchor} class="estimate-label">${esc(label)}</text>`;
    }).join("");
  }

  function mergeEvidence(title, ...sets) {
    const links = [];
    const captures = [];
    const seenLinks = new Set();
    const seenCaptures = new Set();
    for (const set of sets.filter(Boolean)) {
      for (const link of set.links || []) {
        const key = `${link.label}|${link.url}`;
        if (!seenLinks.has(key)) {
          links.push(link);
          seenLinks.add(key);
        }
      }
      for (const capture of set.captures || []) {
        if (!seenCaptures.has(capture.src)) {
          captures.push(capture);
          seenCaptures.add(capture.src);
        }
      }
    }
    return { title, links, captures };
  }

  function metricEvidence(program, key) {
    const common = data.commonEvidence || {};
    const product = ((data.productEvidence || {})[program.slug]) || {};
    const assumption = product.benchmark;
    const map = {
      activeEyes: mergeEvidence("Active treated nAMD eyes evidence", common.activeEyes),
      candidate: mergeEvidence("High-burden pool and product-candidate evidence", common.highBurden, common.launchPool, product.program, assumption),
      allocation: mergeEvidence(`${program.shortName} durable-option allocation evidence`, product.program, assumption),
      access: mergeEvidence(`${program.shortName} access and route evidence`, product.program, assumption),
      adoption: mergeEvidence(`${program.shortName} durable-option adoption evidence`, common.adoptionAnalog, product.program, assumption),
      units: mergeEvidence(`${program.shortName} treatment-unit evidence`, product.program),
      price: mergeEvidence(`${program.shortName} net-revenue evidence and assumption`, common.pricingContext, assumption),
      exus: mergeEvidence(`${program.shortName} ex-US assumption evidence`, product.program, assumption),
      delay: mergeEvidence(`${program.shortName} launch-timing evidence`, product.program, assumption)
    };
    return map[key] || null;
  }

  function sourceRow(program, key) {
    const set = metricEvidence(program, key);
    if (!set) return "";
    const links = (set.links || []).map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.label)}</a>`).join(", ") || "Explicit model assumption";
    const button = (set.captures || []).length
      ? `<div class="source-actions"><button type="button" class="source-evidence-button" data-source-key="${esc(key)}">View evidence and derivation</button></div>`
      : "";
    return `<dt>Sources</dt><dd>${links}${button}</dd>`;
  }

  function applyPalette(program) {
    const palette = program.palette || {};
    const root = document.documentElement;
    const vars = {
      "--blue": palette.primary,
      "--teal": palette.secondary,
      "--gray": palette.tertiary,
      "--wash": palette.wash,
      "--company-primary": palette.primary
    };
    for (const [name, value] of Object.entries(vars)) {
      if (value) root.style.setProperty(name, value);
    }
  }

  function hexToRgb(hex) {
    const value = String(hex || "#000000").replace("#", "");
    return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
  }

  function mixHex(startHex, endHex, t) {
    const start = hexToRgb(startHex), end = hexToRgb(endHex);
    const mix = channel => Math.round(start[channel] + (end[channel] - start[channel]) * t);
    return `rgb(${mix("r")}, ${mix("g")}, ${mix("b")})`;
  }

  function relativeLuminance(rgb) {
    const channel = value => {
      const c = value / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
  }

  function contrastRatio(a, b) {
    const la = relativeLuminance(a), lb = relativeLuminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  function textColorForBackground(color) {
    const match = color.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
    if (!match) return "#061e1b";
    const rgb = { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
    const dark = { r: 0, g: 0, b: 0 };
    const white = { r: 255, g: 255, b: 255 };
    return contrastRatio(white, rgb) > contrastRatio(dark, rgb) ? "#fff" : "#000";
  }

  function modelFor(program, scenarioName, assumptionsOverride) {
    const assumptions = assumptionsOverride || engine.scenarioAssumptions(data, program, scenarioName);
    const model = engine.compute(data, program, assumptions, scenarioName);
    const summary = engine.summary(data, model, program);
    return { assumptions, model, summary };
  }

  function chartSvg(model, markYears, program, summary) {
    const left = 58, right = 922, top = 42, bottom = 360;
    const estimates = publicEstimatesForDrug(program);
    const values = YEARS.flatMap(year => [model.sales[year].world, model.sales[year].us, model.sales[year].exus]).concat(estimates.map(estimate => estimate.value));
    const max = Math.max(...values, 1000) * 1.16;
    const x = year => left + (YEARS.indexOf(year) / (YEARS.length - 1)) * (right - left);
    const yy = value => bottom - (value / max) * (bottom - top);
    const path = key => YEARS.map(year => `${x(year).toFixed(1)},${yy(key(year)).toFixed(1)}`).join(" ");
    const tickStep = max > 3000 ? 1000 : 500;
    const ticks = Array.from({ length: Math.ceil(max / tickStep) + 1 }, (_, index) => index * tickStep).filter(value => value <= max);
    const grid = ticks.map(tick => `<line x1="${left}" y1="${yy(tick).toFixed(1)}" x2="${right}" y2="${yy(tick).toFixed(1)}" class="grid-line"/><text x="46" y="${(yy(tick) + 4).toFixed(1)}" text-anchor="end" class="axis-label">${tick === 0 ? "$0" : "$" + (tick / 1000).toFixed(tickStep >= 1000 ? 0 : 1) + "B"}</text>`).join("");
    const labels = markYears.map(year => {
      const row = model.sales[year];
      const labelAnchor = year >= 2043 ? "text-anchor=\"end\"" : "";
      const dx = year >= 2043 ? -8 : 8;
      return `<circle cx="${x(year).toFixed(1)}" cy="${yy(row.exus).toFixed(1)}" r="4.5" class="exus-dot"/><circle cx="${x(year).toFixed(1)}" cy="${yy(row.us).toFixed(1)}" r="4.5" class="us-dot"/><circle cx="${x(year).toFixed(1)}" cy="${yy(row.world).toFixed(1)}" r="4.5" class="world-dot"/><text x="${(x(year) + dx).toFixed(1)}" y="${(yy(row.world) - 9).toFixed(1)}" ${labelAnchor} class="series-label">${year}: ${fmtMoney(row.world)}</text>`;
    }).join("");
    const estimatesSvg = publicEstimateMarkers(program, summary.peak.year, x, yy, left, right, top, bottom);
    return `<svg viewBox="0 0 980 420" role="img" aria-label="Base case sales forecast chart with public external estimate markers">${grid}<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" class="axis"/><polyline points="${path(year => model.sales[year].exus)}" class="line exus-line"/><polyline points="${path(year => model.sales[year].us)}" class="line us-line"/><polyline points="${path(year => model.sales[year].world)}" class="line world-line"/>${estimatesSvg}${labels}${YEARS.filter(year => [2025, 2028, 2030, 2033, 2036, 2039, 2042, 2045].includes(year)).map(year => `<text x="${x(year).toFixed(1)}" y="395" text-anchor="middle" class="axis-label">${year}</text>`).join("")}</svg>`;
  }

  function metricCards(program, assumptions) {
    const mechanics = program.mechanics || {};
    const unitLabel = program.mechanicType === "repeat_course" ? "Treated-eye-years and courses" : "Treatment courses";
    const cards = [
      { key: "activeEyes", letter: "A", label: "Active treated nAMD eyes", value: fmtEyes(assumptions.active_eyes), text: "Estimated US treated-eye denominator used before narrowing to source-of-business segments.", basis: "Assumption informed by prevalence and treated-population context.", calculation: `${fmtEyes(assumptions.active_eyes)} active treated eyes x ${fmtPct(assumptions.high_burden_share)} high-burden share = ${fmtEyes(assumptions.active_eyes * assumptions.high_burden_share)} high-burden eyes before source filters.`, rationale: "The denominator is common across pipeline programs so differences come from route, access, adoption, allocation, pricing, and launch timing." },
      { key: "candidate", letter: "B", label: "Mature high-burden pool considered", value: fmtPct(assumptions.validated_hb_candidate_share), text: "Mature share of high-burden source eyes considered clinically and commercially plausible for durable-option use.", basis: "Assumption informed by anti-VEGF burden evidence, switching evidence, and product-specific route/stage context.", calculation: `Launch starts at ${fmtPct(assumptions.refractory_share)} refractory/high-burden consideration and ramps to ${fmtPct(assumptions.validated_hb_candidate_share)} mature consideration.`, rationale: `${program.routeClass} supports this product-specific candidate-pool assumption.` },
      { key: "allocation", letter: "C", label: `${program.shortName} allocation within durable options`, value: fmtPct(assumptions.drug_durable_share), text: `Modeled portion of durable-option use assigned to ${program.shortName} after allowing for other long-duration competitors.`, basis: "Competitive allocation assumption informed by product profile and public benchmark context.", calculation: `Durable-option use x ${fmtPct(assumptions.drug_durable_share)} ${program.shortName} allocation = new starts assigned to ${program.shortName}.`, rationale: "This is not market share. It is product allocation within modeled durable-treatment use after access and adoption are applied." },
      { key: "access", letter: "D", label: "HB branded eligible/access share", value: fmtPct(assumptions.access["HB branded"]), text: "Peak share of high-burden branded-source eyes reachable after clinical suitability, payer access, site readiness, and logistics.", basis: "Route, administration workflow, and evidence maturity assumption.", calculation: `The high-burden branded source pool is multiplied by ${fmtPct(assumptions.access["HB branded"])} peak eligible/access share and the annual access timing ramp.`, rationale: `${program.routeClass} informs the access ceiling.` },
      { key: "adoption", letter: "E", label: "HB branded durable-option adoption", value: fmtPct(assumptions.capture["HB branded"]), text: "Mature durable-option adoption within eligible and accessible high-burden branded-source eyes before product allocation.", basis: "Analog-informed assumption based on branded retina uptake context plus product-specific durability and workflow.", calculation: `Eligible/access eyes x ${fmtPct(assumptions.capture["HB branded"])} durable-option adoption x annual adoption ramp = durable-option use before ${program.shortName} allocation.`, rationale: `Durable-option use is then multiplied by ${fmtPct(assumptions.drug_durable_share)} to estimate ${program.shortName} new starts.` },
      { key: "units", letter: "F", label: unitLabel, value: program.mechanicType === "repeat_course" ? `${mechanics.retreatmentIntervalMonths || 6} mo` : "One-time", text: program.mechanicType === "repeat_course" ? "Repeatable products track new starts, continuing treated-eye-years, and treatment courses separately." : "One-time gene therapies track treatment courses, durable success, durability failure, and rescue anti-VEGF context.", basis: "Modality-specific model mechanics.", calculation: program.mechanicType === "repeat_course" ? `Treatment courses = treated-eye-years x 12 / ${mechanics.retreatmentIntervalMonths || 6} months.` : `Treatment courses = new treated eyes. Durable successes = courses x ${fmtPct(mechanics.durabilitySuccess || 1)} success assumption.`, rationale: "This prevents one-time gene therapy courses and repeat-course treated-eye-years from being treated as the same unit." },
      { key: "price", letter: "G", label: `US net revenue per ${fmtUnit(program)}`, value: "$" + assumptions.price["HB branded"].toLocaleString(), text: `Scenario net revenue per ${fmtUnit(program)} for high-burden branded-source eyes.`, basis: "Modeled net-revenue assumption, not a published product price.", calculation: `US sales = revenue units x $${assumptions.price["HB branded"].toLocaleString()} HB branded net revenue x annual price index / 1,000,000.`, rationale: "The value reflects product class, expected treatment-duration economics, payer controls, and public benchmark reasonableness." },
      { key: "exus", letter: "H", label: "Ex-US sales factor vs US", value: assumptions.ex_us_factor.toFixed(2) + "x", text: "Volume/access factor used to add ex-US revenue after launch delay and ex-US price haircut.", basis: "Explicit global gross-up assumption.", calculation: `Ex-US sales = US sales x ${assumptions.ex_us_factor.toFixed(2)} volume/access factor x ${assumptions.ex_us_price_index.toFixed(2)} price index x annual ex-US uptake.`, rationale: "Used as a simple global contribution factor while the model remains above country-level launch, price, and access detail." },
      { key: "delay", letter: "I", label: "Ex-US delay", value: `${assumptions.ex_us_delay_years} years`, text: "Delay between modeled US launch and ex-US contribution.", basis: "Explicit launch-sequencing assumption.", calculation: `Commercial launch is modeled from ${program.launchYear}; ex-US contribution begins in ${program.launchYear + assumptions.ex_us_delay_years}.`, rationale: "The model treats ex-US launch as delayed and ramped rather than simultaneous with the US commercial year." }
    ];
    return cards.map(card => `<article class="metric-card"><div class="metric-label"><span class="input-code">${card.letter}</span>${esc(card.label)}</div><div class="metric-value">${card.value}</div><p>${esc(card.text)}</p><dl class="card-proof"><dt>Basis</dt><dd>${esc(card.basis)}</dd><dt>Calculation</dt><dd><span class="calc-ref">${card.letter}</span> ${card.calculation}</dd><dt>Rationale</dt><dd>${esc(card.rationale)}</dd>${sourceRow(program, card.key)}</dl></article>`).join("");
  }

  function setupSourceModal(program) {
    const modal = document.getElementById("source-modal");
    const title = document.getElementById("source-modal-title");
    const body = document.getElementById("source-modal-body");
    const close = document.getElementById("source-modal-close");
    if (!modal || !title || !body || !close) return;
    let lastTrigger = null;
    let lockedScrollY = 0;

    function closeModal() {
      modal.setAttribute("aria-hidden", "true");
      body.innerHTML = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, lockedScrollY);
      if (lastTrigger) lastTrigger.focus();
    }

    document.querySelectorAll(".source-evidence-button").forEach(button => {
      button.addEventListener("click", () => {
        lastTrigger = button;
        const set = metricEvidence(program, button.dataset.sourceKey);
        const captures = (set && set.captures) || [];
        title.textContent = (set && set.title) || "Highlighted source capture";
        body.innerHTML = captures.length
          ? captures.map(capture => {
              const caption = capture.caption || title.textContent;
              return `<figure class="source-capture"><figcaption>${esc(caption)}</figcaption><img src="${esc(capture.src)}" alt="${esc(caption)}"></figure>`;
            }).join("")
          : "<p>No source capture is available for this item.</p>";
        lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
        document.body.style.position = "fixed";
        document.body.style.top = `-${lockedScrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.width = "100%";
        document.documentElement.style.overflow = "hidden";
        modal.setAttribute("aria-hidden", "false");
        close.focus();
      });
    });
    close.addEventListener("click", closeModal);
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
    });
  }

  function calcKey(program, hb, total, assumptions, year) {
    const unitLine = program.mechanicType === "repeat_course"
      ? `${fmtEyes(total.treated)} new starts and ${fmtEyes(total.treatedEyeYears)} treated-eye-years convert to ${fmtEyes(total.treatmentCourses)} treatment courses.`
      : `${fmtEyes(total.treatmentCourses)} one-time treatment courses include ${fmtEyes(total.durableSuccessEyes)} modeled durable successes and ${fmtEyes(total.rescueAntiVegfEyes)} rescue anti-VEGF eyes.`;
    const rows = [
      ["J", "Available source eyes", `Opening untreated pool ${fmtEyes(hb.opening)} + new inflow ${fmtEyes(hb.newClinicalInflow)} + fellow-eye conversions ${fmtEyes(hb.fellowConversions)} + treatment discontinuation return ${fmtEyes(hb.discontinuationReturn)} = ${fmtEyes(hb.available)} available source eyes.`],
      ["K", "Eligible and accessible eyes", `${fmtEyes(hb.available)} x ${fmtPct(hb.candidate)} considered x ${fmtPct(hb.peakAccess)} access ceiling x ${fmtPct(hb.accessRamp)} timing ramp = ${fmtEyes(hb.accessible)} eligible and accessible eyes.`],
      ["L", "Durable-option use", `${fmtEyes(hb.accessible)} x ${fmtPct(hb.peakDurable)} durable-option adoption x ${fmtPct(hb.captureRamp)} adoption timing = ${fmtEyes(hb.durableUse)} durable-option use.`],
      ["M", `${program.shortName} units`, `${fmtEyes(hb.durableUse)} durable-option use x ${fmtPct(hb.productShare)} ${program.shortName} allocation = ${fmtEyes(hb.treated)} new starts. ${unitLine}`],
      ["N", "US sales", `Across all source pools: ${fmtEyes(total.treatmentCourses)} treatment courses and ${fmtEyes(total.treatedEyeYears)} treated-eye-years convert to ${fmtMoney(total.us)} US sales after segment prices and annual price index.`],
      ["O", "Worldwide sales", `${fmtMoney(total.us)} US sales + ${fmtMoney(total.exus)} ex-US sales = ${fmtMoney(total.world)} worldwide sales in ${year}.`]
    ];
    return rows.map(row => `<div class="calc-var"><strong><span class="calc-ref">${row[0]}</span>${esc(row[1])}</strong><p class="derivation">${row[2]}</p></div>`).join("");
  }

  function funnel(hb, program) {
    const otherMgmt = Math.max(0, hb.accessible - hb.durableUse);
    const otherDurable = Math.max(0, hb.durableUse - hb.treated);
    const unitText = program.mechanicType === "repeat_course"
      ? `${fmtEyes(hb.treatedEyeYears)} treated-eye-years and ${fmtEyes(hb.treatmentCourses)} treatment courses are revenue units.`
      : `${fmtEyes(hb.durableSuccessEyes)} durable successes and ${fmtEyes(hb.rescueAntiVegfEyes)} rescue anti-VEGF eyes are tracked as gene-therapy outcome context.`;
    return `<div class="definitions"><div class="definition"><strong>Available source eyes</strong><p>${fmtEyes(hb.available)} high-burden branded anti-VEGF source eyes before consideration, access, adoption, and competition.</p></div><div class="definition"><strong>Eligible/access</strong><p>${fmtEyes(hb.accessible)} eyes remain after ${fmtPct(hb.candidate)} consideration, ${fmtPct(hb.peakAccess)} peak access, and ${fmtPct(hb.accessRamp)} timing ramp.</p></div><div class="definition"><strong>Durable option</strong><p>${fmtEyes(hb.durableUse)} eyes move to durable-option use before assigning a product-specific allocation.</p></div><div class="definition"><strong>${esc(program.shortName)} model units</strong><p>${fmtEyes(hb.treated)} new starts equal durable-option use x ${fmtPct(hb.productShare)} product allocation. ${unitText} Other durable options: ${fmtEyes(otherDurable)}. Other management: ${fmtEyes(otherMgmt)}.</p></div></div>`;
  }

  function heatColor(value, palette) {
    const t = clamp(value, 0, 1);
    return mixHex(palette.heatLow || "#ecf2f9", palette.heatHigh || "#2e72dc", t);
  }

  function heatRow(label, values, palette) {
    const cells = YEARS.slice(4).map(year => {
      const background = heatColor(values[year], palette || {});
      return `<span class="heat-cell" style="background:${background};color:${textColorForBackground(background)}" title="${esc(label)}, ${year}: ${values[year].toFixed(2)}">${values[year].toFixed(2)}</span>`;
    }).join("");
    return `<div class="driver-row"><div class="driver-name">${esc(label)}</div><div class="heat-grid">${cells}</div></div>`;
  }

  function heatRows(program, assumptions) {
    const candidate = Object.fromEntries(YEARS.map(year => [year, engine.candidateMult(assumptions, program.launchYear, "HB branded", year)]));
    const access = Object.fromEntries(YEARS.map(year => [year, engine.accessMult("Base", program.launchYear, year)]));
    const capture = Object.fromEntries(YEARS.map(year => [year, engine.captureMult("Base", program.launchYear, "HB branded", year)]));
    const price = Object.fromEntries(YEARS.map(year => [year, engine.priceIdx(assumptions, program.launchYear, year)]));
    const exus = Object.fromEntries(YEARS.map(year => [year, engine.exusMult(assumptions, program.launchYear, year)]));
    return heatRow("High-burden pool considered", candidate, program.palette) + heatRow("Access ramp", access, program.palette) + heatRow("Adoption ramp", capture, program.palette) + heatRow("Price index", price, program.palette) + heatRow("Ex-US uptake", exus, program.palette);
  }

  function formulaSteps(program) {
    const unitStep = program.mechanicType === "repeat_course"
      ? "Repeatable products convert new starts and continuing therapy into treated-eye-years and treatment courses."
      : "One-time gene therapies convert new starts into treatment courses and track durable success, failure, and rescue context.";
    return [
      ["01", "Start with source eyes", "Active treated eyes and incident wet AMD inflow create source pools by current treatment source."],
      ["02", "Apply consideration and access", "The source pool is multiplied by the year-specific considered share, access ceiling, and launch timing ramp."],
      ["03", "Estimate durable-option use", "Eligible and accessible eyes are multiplied by durable-option adoption and adoption timing."],
      ["04", "Allocate to product", `Durable-option use x ${program.shortName} allocation within the durable-treatment class produces product new starts.`],
      ["05", "Separate treatment units", unitStep],
      ["06", "Convert units to sales", `Revenue units x net revenue per ${fmtUnit(program)} x annual price index / 1,000,000 produce US sales. Ex-US sales are added after delay, price, and uptake assumptions.`]
    ].map(step => `<div class="formula-step"><div class="num">${step[0]}</div><strong>${esc(step[1])}</strong><p>${esc(step[2])}</p></div>`).join("");
  }

  function segmentMix(model, year) {
    const total = SEGMENTS.reduce((sum, segment) => sum + model.flows[segment][year].usSales, 0) || 1;
    return SEGMENTS.map((segment, index) => {
      const value = model.flows[segment][year].usSales;
      const cls = index === 0 ? "mix-hb" : index === 1 ? "mix-low" : "mix-lower";
      return `<div class="mix-row"><div>${year}</div><div><div>${esc(segment)}</div><div class="mix-bar"><span class="${cls}" style="width:${Math.max(1, value / total * 100).toFixed(1)}%"></span></div></div><div class="mix-total">${fmtMoney(value)}</div></div>`;
    }).join("");
  }

  function caveats(program) {
    const extra = program.mechanicType === "repeat_course"
      ? "This model uses repeat-course persistence, treatment-course, and treated-eye-year outputs."
      : "This model uses one-time treatment-course logic and tracks durability success, durability failure, and rescue anti-VEGF context.";
    return `<div class="caveat"><strong>Directly anchored context</strong><p>Company and clinical-program context support the modality, route, and development-stage rationale.</p></div><div class="caveat"><strong>Triangulated estimates</strong><p>Eligible/access, source-pool breadth, and durable-option allocation are stated assumptions for external review.</p></div><div class="caveat"><strong>Why this forecast differs</strong><p>${esc(program.rationale)} ${esc(extra)}</p></div>`;
  }

  function annualTable(model) {
    const head = `<thead><tr><th>Year</th>${YEARS.map(year => `<th>${year}</th>`).join("")}</tr></thead>`;
    const row = (label, key, formatter) => `<tr><td>${esc(label)}</td>${YEARS.map(year => `<td>${formatter(model.sales[year][key])}</td>`).join("")}</tr>`;
    return `${head}<tbody>${row("US new starts", "treated", fmtEyes)}${row("US treated-eye-years", "treatedEyeYears", fmtEyes)}${row("Treatment courses", "treatmentCourses", fmtEyes)}${row("US sales", "us", fmtMoney)}${row("Ex-US sales", "exus", fmtMoney)}${row("Worldwide sales", "world", fmtMoney)}${row("Cumulative US new starts", "cumulative", fmtEyes)}${row("Cumulative penetration of active treated eyes", "cumulativeActivePenetration", fmtPct)}</tbody>`;
  }

  function renderInfographic(program) {
    applyPalette(program);
    const { assumptions, model, summary } = modelFor(program, "Base");
    const markYears = [...new Set([program.launchYear, program.launchYear + 3, summary.peak.year, summary.selectedYear, 2045].filter(year => year >= YEARS[0] && year <= YEARS[YEARS.length - 1]))].sort((a, b) => a - b);
    const hb = model.flows["HB branded"][summary.selectedYear];
    const total = model.sales[summary.selectedYear];
    document.title = `${program.shortName} Base Case Sales Forecast Infographic`;
    document.body.innerHTML = `<main class="page">
      <header><div><h1>${esc(program.shortName)} Base Case Sales Forecast</h1><p class="deck">A model view of how source pools, annual adoption ramps, durable-treatment competition, treatment units, pricing, and ex-US launch timing convert into a year-by-year if-approved worldwide sales forecast.</p></div><aside class="meta"><div><strong>Base case</strong> If-approved commercial forecast using public data plus stated assumptions.</div><div><strong>Model period</strong> ${YEARS[0]}-${YEARS[YEARS.length - 1]}, with commercial launch modeled from ${program.launchYear}.</div><div><strong>Program</strong> ${esc(program.company)}; ${esc(program.modality)}.</div></aside></header>
      <nav class="nav-tools" aria-label="Related model tools"><a href="${program.slug}_interactive_model_calculator.html">Open interactive model calculator</a><a href="index.html">Forecast index</a></nav>
      <section class="kpi-strip" aria-label="Base case summary metrics"><div class="kpi"><div class="label">Peak worldwide sales</div><div class="value">${fmtMoney(summary.peak.world)}</div><p>${summary.peak.year}</p></div><div class="kpi"><div class="label">Base-case forecast for ${summary.selectedYear}</div><div class="value">${fmtMoney(summary.selected.world)}</div><p>Worldwide sales in launch year ${summary.selectedYear - program.launchYear + 1}.</p></div><div class="kpi"><div class="label">First year above $1B</div><div class="value">${summary.firstB ? summary.firstB.year : "Not reached"}</div><p>Worldwide sales threshold in the base case.</p></div><div class="kpi"><div class="label">${program.mechanicType === "repeat_course" ? "Peak treated-eye-years" : "Peak treatment courses"}</div><div class="value">${fmtEyes(program.mechanicType === "repeat_course" ? summary.peak.treatedEyeYears : summary.peak.treatmentCourses)}</div><p>US revenue units across source-of-business segments.</p></div></section>
      <section class="section"><div class="section-head"><h2>Sales curve</h2><p>The forecast is shifted to the estimated ${program.launchYear} commercial launch and uses product-specific assumptions for eligible/access, durable-option allocation, treatment units, pricing, ex-US timing, and erosion. Source-of-business segments are patient pools by current treatment source, not market share or disease-burden pricing tiers.</p></div><div class="chart-panel"><div class="legend"><span>Worldwide sales</span><span class="us">US sales</span><span class="exus">Ex-US sales</span>${publicEstimateLegend(program)}</div>${chartSvg(model, markYears, program, summary)}${publicEstimateNote(program, summary.peak.year)}</div></section>
      <section class="section"><div class="section-head"><h2>Core inputs</h2><p>These base-case assumptions shape the annual calculation. Market-wide denominators use a common schema, while product-specific route, access, adoption, allocation, pricing, launch timing, and persistence assumptions differ.</p></div><div class="metric-grid">${metricCards(program, assumptions)}</div><div class="calc-key"><h3>Calculation variable key</h3><div class="calc-key-grid">${calcKey(program, hb, total, assumptions, summary.selectedYear)}</div></div></section>
      <section class="section"><div class="section-head"><h2>${summary.selectedYear} patient funnel</h2><p>This worked example shows how the high-burden branded anti-VEGF source pool narrows to ${esc(program.shortName)} model units. Eligible/access means eyes that remain reachable after clinical suitability, payer/site access, and that year's access timing are applied.</p></div>${funnel(hb, program)}</section>
      <section class="section"><div class="section-head"><h2>What changes each year</h2><p>The annual sales curve is mainly driven by five moving variables: high-burden pool considered, access ramp, adoption ramp, price index, and ex-US uptake.</p></div><div class="driver-board"><div class="year-head"><div></div><div class="heat-grid">${YEARS.slice(4).map(year => `<span>${year}</span>`).join("")}</div></div>${heatRows(program, assumptions)}</div></section>
      <section class="section"><div class="section-head"><h2>How the math works</h2><p>Each year repeats the same calculation logic, then rolls forward source pools and treatment-unit stocks according to the product modality.</p></div><div class="formula">${formulaSteps(program)}</div></section>
      <section class="section"><div class="section-head"><h2>Segment mix</h2><p>The base case separates high-burden branded anti-VEGF, high-burden low-cost anti-VEGF, and lower-burden branded anti-VEGF source pools. These labels describe source-of-business, not market share or price by disease severity.</p></div><div class="two-col"><div class="mix-card">${segmentMix(model, summary.peak.year)}</div><div class="caveat-grid">${caveats(program)}</div></div></section>
      <section class="section"><div class="section-head"><h2>Year-by-year bridge</h2><p>This table shows annual outputs for external review and separates new starts, treated-eye-years, treatment courses, and sales.</p></div><div class="table-wrap"><table>${annualTable(model)}</table></div><p class="source-note">Source context: <a href="${esc(program.source.url)}" target="_blank" rel="noopener">${esc(program.source.label)}</a>. Forecast values are model-ready assumptions and are intended for sensitivity analysis.</p></section>
    </main>
    <div class="source-modal" id="source-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="source-modal-title"><div class="source-modal-panel"><div class="source-modal-head"><div class="source-modal-title" id="source-modal-title">Highlighted source capture</div><button type="button" class="source-modal-close" id="source-modal-close">Close</button></div><div class="source-modal-body" id="source-modal-body"></div></div></div>`;
    setupSourceModal(program);
  }

  function renderCalculator(program) {
    applyPalette(program);
    let activeScenario = "Base";
    let selectedYearValue = Math.min(YEARS[YEARS.length - 1], program.launchYear + 7);
    let assumptions = engine.scenarioAssumptions(data, program, activeScenario);
    let model = engine.compute(data, program, assumptions, activeScenario);
    document.title = `${program.shortName} Interactive Model Calculator`;
    document.body.innerHTML = `<main class="page"><header><div><h1>${esc(program.shortName)} Interactive Model Calculator</h1><p class="deck">A browser-side version of the forecast logic. Change assumptions, choose any model year, and inspect how source pools, eligible/access, durable-option use, treatment units, and sales are calculated.</p></div><aside class="meta"><div><strong>Model period</strong> ${YEARS[0]}-${YEARS[YEARS.length - 1]}, with commercial launch modeled from ${program.launchYear}.</div><div><strong>Traceability</strong> The table exposes each annual calculation step.</div></aside></header><nav class="toolbar" aria-label="Model pages"><a href="${program.slug}_base_case_sales_forecast_infographic.html">Open infographic</a><a href="index.html">Forecast index</a><button type="button" class="active" data-jump="#calculator">Calculator</button><button type="button" data-jump="#matrix">Calculation table</button><button type="button" data-jump="#definitions">Definitions</button></nav><section class="kpi-strip" aria-label="Interactive scenario summary"><div class="kpi"><div class="label">Selected year worldwide sales</div><div class="value" id="kpi-world"></div><p id="kpi-world-note"></p></div><div class="kpi"><div class="label">Peak worldwide sales</div><div class="value" id="kpi-peak"></div><p id="kpi-peak-note"></p></div><div class="kpi"><div class="label">${program.mechanicType === "repeat_course" ? "Treated-eye-years" : "Treatment courses"}</div><div class="value" id="kpi-units"></div><p>US revenue units across modeled source-of-business segments.</p></div><div class="kpi"><div class="label">Scenario</div><div class="value" id="kpi-scenario"></div><p>Current editable assumption set.</p></div></section><section class="section" id="calculator"><div class="section-head"><h2>Inputs and results</h2><p>These controls adjust the selected scenario directly in the browser. Product allocation within durable options is not market share; it is the share of durable-option use assigned to ${esc(program.shortName)} after access and adoption gates.</p></div><div class="app-grid"><div class="panel"><div class="control-grid">${controls()}</div><div class="button-row"><button type="button" class="primary" id="applyInputs">Apply changes</button><button type="button" id="resetScenario">Reset scenario</button></div></div><div><div class="chart-panel"><div class="chart-head"><h3>Annual model output</h3><p>Worldwide, US, ex-US, and public external estimates, $M</p></div><svg id="salesChart" viewBox="0 0 760 390" role="img" aria-label="Annual sales forecast chart with public external estimate markers"></svg><div class="legend"><span>Worldwide sales</span><span class="us">US sales</span><span class="exus">Ex-US sales</span>${publicEstimateLegend(program)}</div><div id="calculator-estimate-note"></div></div><div class="trace-grid" id="formulaTrace" aria-label="Selected year formula trace"></div></div></div></section><section class="section" id="matrix"><div class="section-head"><h2>Calculation table</h2><p>The table shows the annual calculation path for the selected scenario, including treatment-unit separation.</p></div><div class="table-tools"><label for="tableView" class="label" style="margin:0;">Table view</label><select id="tableView"><option value="summary">Total forecast rows</option><option value="hb">High-burden branded source rows</option><option value="allSegments">All source segment rows</option></select></div><div class="table-wrap"><table id="calcTable"></table></div></section><section class="section" id="definitions"><div class="section-head"><h2>Model definitions</h2><p>These labels separate model mechanics from market share, disease burden, and pricing categories.</p></div><div class="definitions"><div class="definition"><strong>Source eyes</strong><p>Eyes grouped by current treatment source before durable-option consideration, access, adoption, and competition.</p></div><div class="definition"><strong>Eligible/access</strong><p>Considered eyes that remain reachable after clinical suitability, payer/site access, and that year's access timing are applied.</p></div><div class="definition"><strong>Durable option</strong><p>A longer-duration wet AMD treatment choice, including gene therapies, long-interval biologics, higher-dose anti-VEGF, and sustained-delivery approaches.</p></div><div class="definition"><strong>Treatment units</strong><p>New starts, treated-eye-years, and treatment courses are shown separately so one-time gene therapy and repeat-course products are not conflated.</p></div></div></section></main>`;

    function controls() {
      const mechanics = program.mechanics || {};
      return `<div class="control"><label for="scenario">Scenario</label><select id="scenario"></select><small>Loads the starting assumption set.</small></div><div class="control"><label for="selectedYear">Selected year</label><select id="selectedYear"></select><small>Updates KPI and formula trace.</small></div><div class="control"><label for="activeEyes">US actively treated nAMD eyes</label><input id="activeEyes" type="number" step="10000"><small>Starting treated-eye denominator.</small></div><div class="control"><label for="incidentCases">Incident wet AMD cases per year</label><input id="incidentCases" type="number" step="5000"><small>Annual incident patient input.</small></div><div class="control"><label for="candidateShare">Mature high-burden pool considered</label><input id="candidateShare" type="number" step="0.01" min="0" max="1"><small>Post-validation source pool considered for durable-option use.</small></div><div class="control"><label for="productShare">${esc(program.shortName)} allocation within durable options</label><input id="productShare" type="number" step="0.01" min="0" max="1"><small>Share of durable-option use assigned to ${esc(program.shortName)}.</small></div><div class="control"><label for="hbAccess">HB branded eligible/access share</label><input id="hbAccess" type="number" step="0.01" min="0" max="1"><small>Clinical eligibility and access ceiling for the largest source pool.</small></div><div class="control"><label for="hbCapture">HB branded durable-option adoption</label><input id="hbCapture" type="number" step="0.01" min="0" max="1"><small>Mature durable-option use before product allocation.</small></div><div class="control"><label for="hbPrice">HB branded US net revenue per ${fmtUnit(program)}</label><input id="hbPrice" type="number" step="1000"><small>Scenario assumption, not a sourced product price.</small></div><div class="control"><label for="exUsFactor">Ex-US volume/access factor vs US</label><input id="exUsFactor" type="number" step="0.01" min="0"><small>Explicit non-US sales factor before price and uptake.</small></div><div class="control"><label for="exUsPrice">Ex-US price index vs US</label><input id="exUsPrice" type="number" step="0.01" min="0"><small>Modeled ex-US net revenue as a ratio to US net revenue.</small></div><div class="control"><label for="priceErosion">Annual price erosion after launch year 8</label><input id="priceErosion" type="number" step="0.005" min="0" max="1"><small>Post-peak annual net-price decline.</small></div>${program.mechanicType === "repeat_course" ? `<div class="control"><label for="persistence">Annual persistence on therapy</label><input id="persistence" type="number" step="0.01" min="0" max="1"><small>Share of prior treated eyes continuing ${esc(program.shortName)} into the next year.</small></div><div class="control"><label for="interval">Retreatment interval in months</label><input id="interval" type="number" step="1" min="1"><small>Base interval: ${mechanics.retreatmentIntervalMonths || 6} months.</small></div>` : `<div class="control"><label for="durabilitySuccess">Durability success share</label><input id="durabilitySuccess" type="number" step="0.01" min="0" max="1"><small>Share of one-time courses modeled as durable successes.</small></div><div class="control"><label for="rescueShare">Rescue anti-VEGF share</label><input id="rescueShare" type="number" step="0.01" min="0" max="1"><small>Share of durability failures needing rescue anti-VEGF context.</small></div>`}`;
    }

    function populateSelectors() {
      document.getElementById("scenario").innerHTML = Object.keys(data.scenarioFactors || { Base: {} }).map(scenario => `<option value="${scenario}">${scenario}</option>`).join("");
      document.getElementById("selectedYear").innerHTML = YEARS.map(year => `<option value="${year}">${year}</option>`).join("");
    }

    function syncInputs() {
      const ids = { activeEyes: "active_eyes", incidentCases: "incident_cases", candidateShare: "validated_hb_candidate_share", productShare: "drug_durable_share", exUsFactor: "ex_us_factor", exUsPrice: "ex_us_price_index", priceErosion: "price_erosion" };
      for (const [id, key] of Object.entries(ids)) document.getElementById(id).value = assumptions[key];
      document.getElementById("hbAccess").value = assumptions.access["HB branded"];
      document.getElementById("hbCapture").value = assumptions.capture["HB branded"];
      document.getElementById("hbPrice").value = assumptions.price["HB branded"];
      const mechanics = assumptions.mechanics || program.mechanics || {};
      if (program.mechanicType === "repeat_course") {
        document.getElementById("persistence").value = mechanics.annualPersistence || 0;
        document.getElementById("interval").value = mechanics.retreatmentIntervalMonths || 6;
      } else {
        document.getElementById("durabilitySuccess").value = mechanics.durabilitySuccess || 1;
        document.getElementById("rescueShare").value = mechanics.rescueAntiVegfShare || 0;
      }
      document.getElementById("scenario").value = activeScenario;
      document.getElementById("selectedYear").value = selectedYearValue;
    }

    function readInputs() {
      assumptions.active_eyes = num(document.getElementById("activeEyes").value);
      assumptions.incident_cases = num(document.getElementById("incidentCases").value);
      assumptions.validated_hb_candidate_share = num(document.getElementById("candidateShare").value);
      assumptions.drug_durable_share = num(document.getElementById("productShare").value);
      assumptions.ex_us_factor = num(document.getElementById("exUsFactor").value);
      assumptions.ex_us_price_index = num(document.getElementById("exUsPrice").value);
      assumptions.price_erosion = num(document.getElementById("priceErosion").value);
      assumptions.access["HB branded"] = num(document.getElementById("hbAccess").value);
      assumptions.capture["HB branded"] = num(document.getElementById("hbCapture").value);
      assumptions.price["HB branded"] = num(document.getElementById("hbPrice").value);
      assumptions.mechanics = clone(assumptions.mechanics || program.mechanics || {});
      if (program.mechanicType === "repeat_course") {
        assumptions.mechanics.annualPersistence = num(document.getElementById("persistence").value);
        assumptions.mechanics.retreatmentIntervalMonths = num(document.getElementById("interval").value);
      } else {
        assumptions.mechanics.durabilitySuccess = num(document.getElementById("durabilitySuccess").value);
        assumptions.mechanics.rescueAntiVegfShare = num(document.getElementById("rescueShare").value);
      }
    }

    function drawChart() {
      const svg = document.getElementById("salesChart");
      const left = 58, right = 724, top = 34, bottom = 322;
      const summary = engine.summary(data, model, program);
      const estimates = publicEstimatesForDrug(program);
      const values = YEARS.flatMap(year => [model.sales[year].world, model.sales[year].us, model.sales[year].exus]).concat(estimates.map(estimate => estimate.value));
      const max = Math.max(...values, 1000) * 1.12;
      const x = year => left + (YEARS.indexOf(year) / (YEARS.length - 1)) * (right - left);
      const yy = value => bottom - (value / max) * (bottom - top);
      const path = key => YEARS.map(year => `${x(year).toFixed(1)},${yy(key(year)).toFixed(1)}`).join(" ");
      const ticks = [0, 500, 1000, 2000, 3000, 4000, 6000].filter(value => value <= max);
      const grid = ticks.map(tick => `<line x1="${left}" y1="${yy(tick).toFixed(1)}" x2="${right}" y2="${yy(tick).toFixed(1)}" class="grid-line"/><text x="46" y="${(yy(tick) + 4).toFixed(1)}" text-anchor="end" class="axis-label">${tick === 0 ? "$0" : "$" + (tick / 1000).toFixed(tick >= 1000 ? 0 : 1) + "B"}</text>`).join("");
      const marks = [...new Set([program.launchYear, program.launchYear + 3, selectedYearValue, 2045].filter(year => year >= YEARS[0] && year <= YEARS[YEARS.length - 1]))];
      svg.innerHTML = `${grid}<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" class="axis"/><line x1="${left}" y1="${top}" x2="${left}" y2="${bottom}" class="axis"/><polyline points="${path(year => model.sales[year].exus)}" class="line exus-line"/><polyline points="${path(year => model.sales[year].us)}" class="line us-line"/><polyline points="${path(year => model.sales[year].world)}" class="line world-line"/>${publicEstimateMarkers(program, summary.peak.year, x, yy, left, right, top, bottom)}${marks.map(year => `<circle cx="${x(year).toFixed(1)}" cy="${yy(model.sales[year].world).toFixed(1)}" r="4.5" class="world-dot"/><text x="${(x(year) + 8).toFixed(1)}" y="${(yy(model.sales[year].world) - 8).toFixed(1)}" class="axis-label">${year}: ${fmtMoney(model.sales[year].world)}</text>`).join("")}<circle cx="${x(selectedYearValue).toFixed(1)}" cy="${yy(model.sales[selectedYearValue].world).toFixed(1)}" r="7" class="world-dot"/>${YEARS.filter(year => [2025, 2028, 2030, 2033, 2036, 2039, 2042, 2045].includes(year)).map(year => `<text x="${x(year).toFixed(1)}" y="354" text-anchor="middle" class="axis-label">${year}</text>`).join("")}`;
      document.getElementById("calculator-estimate-note").innerHTML = publicEstimateNote(program, summary.peak.year);
    }

    function renderKpis() {
      const row = model.sales[selectedYearValue];
      const summary = engine.summary(data, model, program);
      document.getElementById("kpi-world").textContent = fmtMoney(row.world);
      document.getElementById("kpi-world-note").textContent = `${selectedYearValue} model forecast value.`;
      document.getElementById("kpi-peak").textContent = fmtMoney(summary.peak.world);
      document.getElementById("kpi-peak-note").textContent = `${summary.peak.year} peak year in current scenario.`;
      document.getElementById("kpi-units").textContent = fmtEyes(program.mechanicType === "repeat_course" ? row.treatedEyeYears : row.treatmentCourses);
      document.getElementById("kpi-scenario").textContent = activeScenario;
    }

    function renderTrace() {
      const hb = model.flows["HB branded"][selectedYearValue];
      const total = model.sales[selectedYearValue];
      const unitText = program.mechanicType === "repeat_course"
        ? `${fmtEyes(total.treated)} new starts plus continuing therapy produce ${fmtEyes(total.treatedEyeYears)} treated-eye-years and ${fmtEyes(total.treatmentCourses)} treatment courses.`
        : `${fmtEyes(total.treatmentCourses)} one-time treatment courses include ${fmtEyes(total.durableSuccessEyes)} durable successes and ${fmtEyes(total.rescueAntiVegfEyes)} rescue anti-VEGF eyes.`;
      const traces = [
        ["A", "Available source eyes", `Opening untreated pool ${fmtEyes(hb.opening)} + new inflow ${fmtEyes(hb.newClinicalInflow)} + fellow-eye conversions ${fmtEyes(hb.fellowConversions)} + treatment discontinuation return ${fmtEyes(hb.discontinuationReturn)} = ${fmtEyes(hb.available)} available source eyes.`],
        ["B", "Eligible and accessible eyes", `${fmtEyes(hb.available)} x ${fmtPct(hb.candidate)} considered x ${fmtPct(hb.peakAccess)} eligible/access share x ${fmtPct(hb.accessRamp)} annual access timing = ${fmtEyes(hb.accessible)} eligible and accessible eyes.`],
        ["C", `${program.shortName} model units`, `${fmtEyes(hb.accessible)} x ${fmtPct(hb.peakDurable)} durable-option adoption x ${fmtPct(hb.captureRamp)} timing ramp x ${fmtPct(hb.productShare)} product allocation = ${fmtEyes(hb.treated)} new starts from high-burden branded source. ${unitText}`],
        ["D", "US sales", `Across all source pools: ${fmtEyes(total.treatmentCourses)} treatment courses and ${fmtEyes(total.treatedEyeYears)} treated-eye-years convert to ${fmtMoney(total.us)} US sales after segment prices and annual price index.`],
        ["E", "Ex-US sales", `${fmtMoney(total.us)} US sales x ${assumptions.ex_us_factor.toFixed(2)} volume/access factor x ${assumptions.ex_us_price_index.toFixed(2)} price index x ${fmtPct(engine.exusMult(assumptions, program.launchYear, selectedYearValue))} uptake = ${fmtMoney(total.exus)} ex-US sales.`],
        ["F", "Worldwide sales", `${fmtMoney(total.us)} US sales + ${fmtMoney(total.exus)} ex-US sales = ${fmtMoney(total.world)} worldwide sales.`]
      ];
      document.getElementById("formulaTrace").innerHTML = traces.map(trace => `<div class="trace"><span class="badge">${trace[0]}</span><div><strong>${esc(trace[1])}</strong><p>${trace[2]}</p></div></div>`).join("");
    }

    function tableRow(label, values, formatter, klass = "") {
      return `<tr><td class="${klass}">${esc(label)}</td>${YEARS.map(year => `<td>${formatter(values[year])}</td>`).join("")}</tr>`;
    }

    function segmentRows(segment) {
      const f = model.flows[segment];
      const get = key => Object.fromEntries(YEARS.map(year => [year, f[year][key]]));
      return [
        tableRow(`${segment}: opening untreated clinical pool`, get("opening"), fmtEyes, "metric-group"),
        tableRow(`${segment}: new clinical inflow`, get("newClinicalInflow"), fmtEyes),
        tableRow(`${segment}: fellow-eye conversions`, get("fellowConversions"), fmtEyes),
        tableRow(`${segment}: available source eyes`, get("available"), fmtEyes),
        tableRow(`${segment}: pool considered for durable-option use`, get("candidate"), fmtPct),
        tableRow(`${segment}: eligible and accessible eyes`, get("accessible"), fmtEyes),
        tableRow(`${segment}: durable-option use`, get("durableUse"), fmtEyes),
        tableRow(`${segment}: ${program.shortName} new starts`, get("treated"), fmtEyes),
        tableRow(`${segment}: treated-eye-years`, get("treatedEyeYears"), fmtEyes),
        tableRow(`${segment}: treatment courses`, get("treatmentCourses"), fmtEyes),
        tableRow(`${segment}: US sales`, get("usSales"), fmtMoney),
        tableRow(`${segment}: ending untreated clinical pool`, get("ending"), fmtEyes)
      ].join("");
    }

    function renderTable() {
      const s = model.sales;
      const getSales = key => Object.fromEntries(YEARS.map(year => [year, s[year][key]]));
      let body = "";
      const view = document.getElementById("tableView").value;
      if (view === "summary") {
        body += tableRow("US new starts", getSales("treated"), fmtEyes, "metric-group") + tableRow("US treated-eye-years", getSales("treatedEyeYears"), fmtEyes) + tableRow("Treatment courses", getSales("treatmentCourses"), fmtEyes) + tableRow("Durable successes", getSales("durableSuccessEyes"), fmtEyes) + tableRow("Rescue anti-VEGF eyes", getSales("rescueAntiVegfEyes"), fmtEyes) + tableRow("US sales", getSales("us"), fmtMoney) + tableRow("Ex-US sales", getSales("exus"), fmtMoney) + tableRow("Worldwide sales", getSales("world"), fmtMoney) + tableRow("Cumulative US new starts", getSales("cumulative"), fmtEyes) + tableRow("Cumulative penetration of active treated eyes", getSales("cumulativeActivePenetration"), fmtPct);
      } else if (view === "hb") {
        body += segmentRows("HB branded");
      } else {
        body += SEGMENTS.map(segmentRows).join("");
      }
      document.getElementById("calcTable").innerHTML = `<thead><tr><th>Calculation row</th>${YEARS.map(year => `<th>${year}</th>`).join("")}</tr></thead><tbody>${body}</tbody>`;
    }

    function renderAll() {
      model = engine.compute(data, program, assumptions, activeScenario);
      renderKpis();
      drawChart();
      renderTrace();
      renderTable();
    }

    populateSelectors();
    syncInputs();
    renderAll();
    document.getElementById("scenario").addEventListener("change", event => {
      activeScenario = event.target.value;
      assumptions = engine.scenarioAssumptions(data, program, activeScenario);
      syncInputs();
      renderAll();
    });
    document.getElementById("selectedYear").addEventListener("change", event => {
      selectedYearValue = Number(event.target.value);
      renderAll();
    });
    document.getElementById("applyInputs").addEventListener("click", () => {
      readInputs();
      renderAll();
    });
    document.getElementById("resetScenario").addEventListener("click", () => {
      assumptions = engine.scenarioAssumptions(data, program, activeScenario);
      syncInputs();
      renderAll();
    });
    document.getElementById("tableView").addEventListener("change", renderTable);
    document.querySelectorAll("[data-jump]").forEach(button => button.addEventListener("click", event => document.querySelector(event.currentTarget.dataset.jump).scrollIntoView({ behavior: "smooth", block: "start" })));
  }

  function landingCard(program) {
    if (program.lockedBaseline) {
      const locked = program.lockedOutputs || {};
      const links = program.links || {};
      return `<article class="landing-card" style="--company-primary:${esc(program.primaryColor)}"><strong>${esc(program.shortName)}</strong><p>${esc(program.company)}</p><p>Locked baseline represented in the shared six-program schema. Current standalone output: peak worldwide sales ${fmtMoney(locked.peakWorldwideSalesM || 0)} in ${locked.peakYear}; 2036 worldwide sales ${fmtMoney(locked.selectedWorldwideSalesM || 0)}.</p><div class="links"><a href="${esc(links.infographic || "ixo_vec_base_case_sales_forecast_infographic.html")}">Infographic</a><a href="${esc(links.calculator || "ixo_vec_interactive_model_calculator.html")}">Calculator</a></div></article>`;
    }
    const { model, summary } = modelFor(program, "Base");
    const unitLabel = program.mechanicType === "repeat_course" ? `${fmtEyes(summary.peak.treatedEyeYears)} treated-eye-years` : `${fmtEyes(summary.peak.treatmentCourses)} treatment courses`;
    return `<article class="landing-card" style="--company-primary:${esc(program.primaryColor)}"><strong>${esc(program.shortName)}</strong><p>${esc(program.company)}</p><p>${esc(program.modality)}. Launch modeled from ${program.launchYear}; peak worldwide sales ${fmtMoney(summary.peak.world)} in ${summary.peak.year}; peak revenue units ${unitLabel}.</p><div class="links"><a href="${program.slug}_base_case_sales_forecast_infographic.html">Infographic</a><a href="${program.slug}_interactive_model_calculator.html">Calculator</a></div></article>`;
  }

  function renderLanding() {
    document.title = "Wet AMD Pipeline Sales Forecast Models";
    const cards = (data.programs || []).map(landingCard).join("");
    document.body.innerHTML = `<main class="page"><header class="landing-header"><div><h1 class="landing-title" aria-label="Wet AMD Pipeline Sales Forecast Models"><span>Wet AMD Pipeline Sales</span><span>Forecast Models</span></h1><p class="deck">Public-facing base-case forecast pages and interactive calculators for six wet AMD pipeline programs, using a shared source-of-business schema and product-specific assumptions.</p></div><aside class="meta"><div><strong>Model set</strong> Six pipeline programs with paired infographic and calculator pages.</div><div><strong>Traceability</strong> Assumptions, formulas, source context, and treatment-unit definitions are visible in each page.</div></aside></header><nav class="nav-tools" aria-label="Forecast evidence"><a href="wet_amd_public_sales_forecast_evidence.html">Public forecast evidence</a></nav><div class="landing-grid">${cards}</div></main>`;
  }

  const config = window.PIPELINE_FORECAST_PAGE || { pageType: "landing" };
  if (config.pageType === "landing") {
    renderLanding();
  } else {
    const program = PROGRAMS[config.drugId];
    if (!program) throw new Error(`Unknown drug id: ${config.drugId}`);
    if (program.lockedBaseline) {
      window.location.href = program.links && program.links[config.pageType === "calculator" ? "calculator" : "infographic"] || "index.html";
      return;
    }
    if (config.pageType === "calculator") renderCalculator(program);
    else renderInfographic(program);
  }
})();
