const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "assets", "data", "wet_amd_forecast_programs.json");
const outDir = path.join(root, "assets", "evidence", "pipeline-sources");
const tempDir = path.join(root, ".playwright-mcp", "pipeline-input-panels");

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const programIds = ["axpaxli", "duravyu", "rgx_314", "four_d_150", "cls_ax"];
const outputNames = {
  axpaxli: "axpaxli-model-assumption-derivation.png",
  duravyu: "duravyu-model-assumption-derivation.png",
  rgx_314: "rgx_314-model-assumption-derivation.png",
  four_d_150: "four_d_150-model-assumption-derivation.png",
  cls_ax: "cls_ax-model-assumption-derivation.png"
};

const segmentLabels = {
  "HB branded": "High-burden branded anti-VEGF source",
  "HB low-cost": "High-burden low-cost anti-VEGF source",
  "Lower-burden branded": "Lower-burden branded anti-VEGF source"
};

const scenarioName = "Base";

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function percent(value) {
  const v = num(value) * 100;
  const precision = Math.abs(v) >= 10 || Number.isInteger(v) ? 0 : 1;
  return `${v.toFixed(precision).replace(/\.0$/, "")}%`;
}

function currencyK(value) {
  return `$${Math.round(num(value) / 1000).toLocaleString("en-US")}k`;
}

function numberCompact(value, suffix = "") {
  const v = num(value);
  if (Math.abs(v) >= 1000000) return `${(v / 1000000).toFixed(2).replace(/\.00$/, "")}M${suffix}`;
  if (Math.abs(v) >= 1000) return `${Math.round(v / 1000).toLocaleString("en-US")}k${suffix}`;
  return `${v.toLocaleString("en-US")}${suffix}`;
}

function accessMult(yearsOut) {
  return Math.min(1, 0.35 + 0.16 * yearsOut);
}

function captureMult(segment, yearsOut) {
  let start = segment === "HB branded" ? 0.22 : 0.12;
  if (segment === "Lower-burden branded") start = 0.08;
  return Math.min(1, start + 0.14 * yearsOut);
}

function candidateMult(yearsOut) {
  if (yearsOut < 3) return 0.55 + 0.15 * yearsOut;
  if (yearsOut < 6) return 1 + 0.08 * (yearsOut - 2);
  return 1.24;
}

function getProgram(id) {
  const program = data.programs.find((p) => p.id === id);
  if (!program) throw new Error(`Missing program ${id}`);
  return program;
}

function commonRows(a) {
  return [
    ["Active treated-eye denominator", numberCompact(a.active_eyes, " eyes")],
    ["Incident wet AMD patients", numberCompact(a.incident_cases, " per year")],
    ["Treatment initiation", percent(a.treat_init)],
    ["Eyes per patient", num(a.eyes_per_patient).toFixed(2).replace(/\.00$/, "")],
    ["High-burden source share", percent(a.high_burden_share)],
    ["Incident high-burden share", percent(a.incident_hb_share)],
    ["Branded anti-VEGF source share", percent(a.branded_share)],
    ["Refractory launch share", percent(a.refractory_share)],
    ["Mature high-burden considered pool", percent(a.validated_hb_candidate_share)],
    ["Lower-burden branded expansion", percent(a.lower_burden_share)],
    ["Product allocation after competitors", percent(a.drug_durable_share)],
    ["Mortality attrition", percent(a.mortality_attrition)],
    ["Clinical-loss attrition", percent(a.clinical_loss)],
    ["Competitive-loss attrition", percent(a.competitive_loss)],
    ["Fellow-eye conversion", percent(a.fellow_conversion)],
    ["Fellow-eye at-risk share", percent(a.fellow_at_risk_share)],
    ["Ex-U.S. treated-eye factor", percent(a.ex_us_factor)],
    ["Ex-U.S. price index", percent(a.ex_us_price_index)],
    ["Ex-U.S. delay", `${num(a.ex_us_delay_years)} years`],
    ["Annual price erosion", percent(a.price_erosion)]
  ];
}

function mechanicRows(program) {
  const m = program.mechanics || {};
  if (program.mechanicType === "one_time") {
    return [
      ["Revenue unit", "One-time treatment course"],
      ["Durability success", percent(m.durabilitySuccess)],
      ["Durability-failure return rate", percent(m.durabilityFailureReturnRate)],
      ["Rescue anti-VEGF share", percent(m.rescueAntiVegfShare)],
      ["Monitoring burden factor", percent(m.monitoringBurden)],
      ["Workflow friction factor", percent(m.workflowFriction)]
    ];
  }
  return [
    ["Revenue unit", "Treated-eye-year"],
    ["Retreatment interval", `${num(m.retreatmentIntervalMonths)} months`],
    ["Annual persistence", percent(m.annualPersistence)],
    ["Annual discontinuation", percent(m.annualDiscontinuation)],
    ["Switch-back share", percent(m.switchBackShare)],
    ["New-course year fraction", percent(m.newCourseYearFraction)],
    ["Workflow friction factor", percent(m.workflowFriction)]
  ];
}

function rowsHtml(rows) {
  return rows.map(([label, value]) => `<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`).join("");
}

function segmentRowsHtml(program) {
  const a = program.assumptions;
  return Object.keys(segmentLabels).map((segment) => `
    <tr>
      <th>${esc(segmentLabels[segment])}</th>
      <td>${percent(a.clinical[segment])}</td>
      <td>${percent(a.access[segment])}</td>
      <td>${percent(a.capture[segment])}</td>
      <td>${currencyK(a.price[segment])}</td>
    </tr>
  `).join("");
}

function rampRowsHtml() {
  return [0, 1, 2, 3, 4, 5, 6].map((yearsOut) => `
    <tr>
      <th>${yearsOut === 6 ? "6+" : yearsOut}</th>
      <td>${percent(candidateMult(yearsOut))}</td>
      <td>${percent(accessMult(yearsOut))}</td>
      <td>${percent(captureMult("HB branded", yearsOut))}</td>
      <td>${percent(captureMult("HB low-cost", yearsOut))}</td>
      <td>${percent(captureMult("Lower-burden branded", yearsOut))}</td>
    </tr>
  `).join("");
}

function sourceUse(program) {
  if (program.id === "axpaxli") return "Program evidence supports 2028 launch, intravitreal hydrogel route, and q24-week repeat dosing. Public peak-sales benchmarks frame reasonableness, while the values below are the exact base-case model inputs.";
  if (program.id === "duravyu") return "Program evidence supports 2028 launch conditional on positive Phase 3 data, intravitreal insert delivery, and six-month dosing. The values below are the exact base-case model inputs.";
  if (program.id === "rgx_314") return "Program evidence supports a 2029 launch assumption, subretinal pivotal route, one-time AAV gene therapy mechanics, and narrower route-constrained access. The values below are the exact base-case model inputs.";
  if (program.id === "four_d_150") return "Program evidence supports 2029 launch after 2027 readouts, intravitreal R100 AAV delivery, and one-time gene therapy mechanics. The values below are the exact base-case model inputs.";
  return "Program evidence supports a conservative 2031 reactivation case, suprachoroidal SCS Microinjector delivery, and repeat-course TKI mechanics. The values below are the exact base-case model inputs.";
}

function htmlForProgram(program) {
  const a = program.assumptions;
  const unitLabel = program.mechanicType === "one_time" ? "Net revenue per treatment course" : "Net revenue per treated-eye-year";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${esc(program.shortName)} model-input derivation panel</title>
  <style>
    :root {
      --ink: #071426;
      --muted: #435061;
      --line: #f59f00;
      --soft: #fff7dd;
      --wash: ${esc((program.palette && program.palette.wash) || "#eef7fb")};
      --accent: ${esc(program.primaryColor || "#0f766e")};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #ffffff;
      color: var(--ink);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.34;
    }
    .panel {
      width: 1500px;
      padding: 44px 54px 54px;
      border: 5px solid #111827;
      background: #fff;
    }
    h1 {
      margin: 0;
      font-size: 41px;
      font-weight: 500;
      letter-spacing: 0;
    }
    .kicker {
      margin-top: 6px;
      color: #1e3150;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 17px;
      text-transform: uppercase;
      letter-spacing: .04em;
    }
    .lead {
      margin: 28px 0 24px;
      max-width: 1360px;
      font-size: 23px;
    }
    .source {
      margin: 0 0 22px;
      padding: 17px 22px;
      border-left: 5px solid var(--accent);
      background: var(--wash);
      font-size: 19px;
    }
    .source strong {
      display: block;
      margin-bottom: 8px;
      text-transform: uppercase;
      font-size: 14px;
      letter-spacing: .05em;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      align-items: start;
    }
    .card {
      border: 2px solid var(--line);
      background: var(--soft);
      border-radius: 8px;
      overflow: hidden;
    }
    .card h2 {
      margin: 0;
      padding: 13px 18px;
      font-size: 22px;
      background: rgba(255,255,255,.72);
      border-bottom: 1px solid rgba(245,159,0,.55);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 17px;
    }
    th, td {
      text-align: left;
      vertical-align: top;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(245,159,0,.34);
    }
    th {
      width: 48%;
      font-weight: 700;
    }
    .segment-card {
      margin-top: 18px;
    }
    .segment-card table, .ramp-card table {
      font-size: 16px;
    }
    .segment-card th:first-child {
      width: 34%;
    }
    .segment-card th:not(:first-child),
    .segment-card td:not(:first-child),
    .ramp-card th:not(:first-child),
    .ramp-card td:not(:first-child) {
      text-align: right;
    }
    .note {
      margin: 16px 0 0;
      color: var(--muted);
      font-size: 15px;
    }
    .formula {
      margin-top: 18px;
      padding: 14px 16px;
      border: 2px solid var(--line);
      border-radius: 8px;
      background: #fffdfa;
      font-size: 17px;
    }
    .formula strong {
      display: block;
      margin-bottom: 6px;
    }
  </style>
</head>
<body>
  <section class="panel">
    <h1>${esc(program.shortName)} full model-input derivation panel</h1>
    <div class="kicker">Modeled assumption / derivation</div>
    <p class="lead">${esc(sourceUse(program))}</p>
    <div class="source"><strong>Sources</strong>Program evidence, public wet AMD benchmark context, and current visible forecast assumptions. No direct source is treated as providing every modeled percentage below.</div>
    <div class="grid">
      <div class="card">
        <h2>Program and commercial setup</h2>
        <table>
          <tbody>
            <tr><th>Launch year</th><td>${esc(program.launchYear)}</td></tr>
            <tr><th>Route and modality</th><td>${esc(program.routeClass)}</td></tr>
            <tr><th>Calculation type</th><td>${esc(program.mechanicType === "one_time" ? "One-time durable therapy" : "Repeat-course durable therapy")}</td></tr>
            <tr><th>Evidence maturity</th><td>${esc(program.evidenceMaturity)}</td></tr>
            <tr><th>Assumption confidence</th><td>${esc(program.assumptionConfidence)}</td></tr>
            <tr><th>${esc(unitLabel)}</th><td>Segment-specific values shown in the segment table below</td></tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <h2>Product mechanics</h2>
        <table>
          <tbody>${mechanicRows(program).map(([label, value]) => `<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`).join("")}</tbody>
        </table>
      </div>
    </div>
    <div class="card segment-card">
      <h2>Segment-level values used in the base-case calculation</h2>
      <table>
        <thead>
          <tr>
            <th>Source-of-business segment</th>
            <th>Clinical candidate share</th>
            <th>Access share</th>
            <th>Treatment capture share</th>
            <th>${esc(unitLabel)}</th>
          </tr>
        </thead>
        <tbody>${segmentRowsHtml(program)}</tbody>
      </table>
    </div>
    <div class="grid" style="margin-top:18px;">
      <div class="card">
        <h2>Population, allocation, attrition, and ex-U.S. inputs</h2>
        <table>
          <tbody>${rowsHtml(commonRows(a))}</tbody>
        </table>
      </div>
      <div class="card ramp-card">
        <h2>Base-case ramp multipliers by years after launch</h2>
        <table>
          <thead>
            <tr>
              <th>Years after launch</th>
              <th>Candidate expansion</th>
              <th>Access ramp</th>
              <th>HB branded capture ramp</th>
              <th>HB low-cost capture ramp</th>
              <th>Lower-burden capture ramp</th>
            </tr>
          </thead>
          <tbody>${rampRowsHtml()}</tbody>
        </table>
        <div class="formula">
          <strong>Segment calculation trace</strong>
          Source pool x clinical candidate share x candidate expansion ramp x access share x access ramp x treatment capture share x capture ramp x product allocation. Revenue then applies the segment price to treated-eye-years or one-time treatment courses, with price erosion and ex-U.S. timing applied after launch.
        </div>
      </div>
    </div>
    <p class="note">Clinical candidate share means the portion of a source pool considered clinically plausible for the modeled durable option. Access share means reachable after route, payer, site, and workflow constraints. Treatment capture share means the modeled durable-option uptake within accessible eyes before product allocation across competitors.</p>
  </section>
</body>
</html>`;
}

function fileUrl(filePath) {
  return `file:///${filePath.replace(/\\/g, "/").replace(/ /g, "%20")}`;
}

fs.mkdirSync(tempDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

for (const id of programIds) {
  const program = getProgram(id);
  const htmlPath = path.join(tempDir, `${id}.html`);
  const pngPath = path.join(outDir, outputNames[id]);
  fs.writeFileSync(htmlPath, htmlForProgram(program), "utf8");
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  execFileSync(npx, [
    "--no-install",
    "playwright",
    "screenshot",
    "--full-page",
    "--viewport-size",
    "1500,1700",
    fileUrl(htmlPath),
    pngPath
  ], { stdio: "inherit", cwd: root, shell: true });
}

fs.rmSync(tempDir, { recursive: true, force: true });
