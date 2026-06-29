(function () {
  const YEARS = Array.from({ length: 21 }, (_, i) => 2025 + i);
  const SEGMENTS = ["HB branded", "HB low-cost", "Lower-burden branded"];
  const DRUGS = {
    axpaxli: {
      name: "AXPAXLI / OTX-TKI",
      shortName: "AXPAXLI",
      company: "Ocular Therapeutix",
      modality: "Intravitreal axitinib hydrogel implant",
      routeClass: "Office-based intravitreal durable TKI implant",
      primaryColor: "#001840",
      palette: { primary:"#021844", secondary:"#34BEED", tertiary:"#FF7A81", wash:"#EEF7FB", heatLow:"#EEF7FB", heatHigh:"#021844" },
      launchYear: 2028,
      slug: "axpaxli",
      rationale: "Broadest modeled candidate pool among non-gene-therapy programs. The forecast uses lower net revenue per treated eye than gene therapy, but broader eligible/access assumptions and more lower-burden expansion because administration is intravitreal rather than surgical gene therapy.",
      source: { label: "Ocular AXPAXLI wet AMD clinical-trial page", url: "https://www.ocutx.com/pipeline/clinical-trials/" },
      assumptions: { active_eyes:1150000, incident_cases:200000, treat_init:.78, eyes_per_patient:1.15, high_burden_share:.20, incident_hb_share:.10, branded_share:.62, lower_burden_share:.035, refractory_share:.25, validated_hb_candidate_share:.80, drug_durable_share:.45, mortality_attrition:.03, clinical_loss:.015, competitive_loss:.015, fellow_conversion:.10, fellow_at_risk_share:.35, ex_us_factor:.70, ex_us_price_index:.60, ex_us_delay_years:2, price_erosion:.040, clinical:{"HB branded":.90,"HB low-cost":.55,"Lower-burden branded":.35}, access:{"HB branded":.90,"HB low-cost":.80,"Lower-burden branded":.55}, capture:{"HB branded":.75,"HB low-cost":.45,"Lower-burden branded":.30}, price:{"HB branded":24000,"HB low-cost":16000,"Lower-burden branded":22000} }
    },
    duravyu: {
      name: "DURAVYU / EYP-1901",
      shortName: "DURAVYU",
      company: "EyePoint Pharmaceuticals",
      modality: "Intravitreal vorolanib bioerodible insert",
      routeClass: "Intravitreal sustained-release TKI insert",
      primaryColor: "#6F1D91",
      palette: { primary:"#4A1268", secondary:"#8821BF", tertiary:"#FC814A", wash:"#F8F1FA", heatLow:"#F8F1FA", heatHigh:"#4A1268" },
      launchYear: 2028,
      slug: "duravyu",
      rationale: "Similar to AXPAXLI but slightly more conservative. The modeled product has broad intravitreal access and repeatable durable-treatment use, while candidate breadth, capture, and net revenue remain modestly below AXPAXLI.",
      source: { label: "EyePoint DURAVYU program page", url: "https://eyepoint.bio/our-programs/" },
      assumptions: { active_eyes:1150000, incident_cases:200000, treat_init:.78, eyes_per_patient:1.15, high_burden_share:.20, incident_hb_share:.10, branded_share:.62, lower_burden_share:.025, refractory_share:.22, validated_hb_candidate_share:.75, drug_durable_share:.38, mortality_attrition:.03, clinical_loss:.015, competitive_loss:.015, fellow_conversion:.10, fellow_at_risk_share:.35, ex_us_factor:.65, ex_us_price_index:.60, ex_us_delay_years:2, price_erosion:.040, clinical:{"HB branded":.85,"HB low-cost":.50,"Lower-burden branded":.30}, access:{"HB branded":.85,"HB low-cost":.75,"Lower-burden branded":.50}, capture:{"HB branded":.70,"HB low-cost":.40,"Lower-burden branded":.25}, price:{"HB branded":22000,"HB low-cost":15000,"Lower-burden branded":20000} }
    },
    rgx_314: {
      name: "RGX-314 / ABBV-RGX-314",
      shortName: "RGX-314",
      company: "REGENXBIO / AbbVie",
      modality: "AAV8 anti-VEGF Fab gene therapy",
      routeClass: "Subretinal and suprachoroidal gene-therapy program",
      primaryColor: "#212F3D",
      palette: { primary:"#212F3D", secondary:"#55A3AB", tertiary:"#7A8A99", wash:"#F2F5F6", heatLow:"#F2F5F6", heatHigh:"#212F3D" },
      launchYear: 2029,
      slug: "rgx_314",
      rationale: "High one-time gene-therapy pricing is offset by narrower access and candidate breadth. The base case keeps lower-burden expansion very limited because route complexity, monitoring, and payer controls can constrain broad substitution.",
      source: { label: "REGENXBIO ABBV-RGX-314 program page", url: "https://www.regenxbio.com/therapeutic-programs/rgx-314/" },
      assumptions: { active_eyes:1150000, incident_cases:200000, treat_init:.78, eyes_per_patient:1.15, high_burden_share:.20, incident_hb_share:.10, branded_share:.62, lower_burden_share:.005, refractory_share:.18, validated_hb_candidate_share:.60, drug_durable_share:.25, mortality_attrition:.03, clinical_loss:.015, competitive_loss:.015, fellow_conversion:.10, fellow_at_risk_share:.35, ex_us_factor:.75, ex_us_price_index:.50, ex_us_delay_years:2, price_erosion:.035, clinical:{"HB branded":.75,"HB low-cost":.20,"Lower-burden branded":.08}, access:{"HB branded":.70,"HB low-cost":.55,"Lower-burden branded":.20}, capture:{"HB branded":.60,"HB low-cost":.20,"Lower-burden branded":.10}, price:{"HB branded":95000,"HB low-cost":55000,"Lower-burden branded":75000} }
    },
    four_d_150: {
      name: "4D-150",
      shortName: "4D-150",
      company: "4D Molecular Therapeutics / 4DMT",
      modality: "Intravitreal R100 AAV dual anti-angiogenic gene therapy",
      routeClass: "Intravitreal gene therapy with dual anti-angiogenic payload",
      primaryColor: "#06254A",
      palette: { primary:"#06254A", secondary:"#00B3CD", tertiary:"#8FD4E2", wash:"#EEF8FB", heatLow:"#EEF8FB", heatHigh:"#06254A" },
      launchYear: 2030,
      slug: "four_d_150",
      rationale: "The model places 4D-150 between intravitreal implants and more complex gene-therapy routes. Intravitreal delivery improves eligible/access assumptions relative to subretinal gene therapy, while AAV monitoring and durable-class competition keep allocation below broad implant-style products.",
      source: { label: "4DMT pipeline page", url: "https://4dmoleculartherapeutics.com/pipeline/" },
      assumptions: { active_eyes:1150000, incident_cases:200000, treat_init:.78, eyes_per_patient:1.15, high_burden_share:.20, incident_hb_share:.10, branded_share:.62, lower_burden_share:.010, refractory_share:.18, validated_hb_candidate_share:.70, drug_durable_share:.37, mortality_attrition:.03, clinical_loss:.015, competitive_loss:.015, fellow_conversion:.10, fellow_at_risk_share:.35, ex_us_factor:.667, ex_us_price_index:.50, ex_us_delay_years:2, price_erosion:.030, clinical:{"HB branded":.80,"HB low-cost":.25,"Lower-burden branded":.10}, access:{"HB branded":.88,"HB low-cost":.70,"Lower-burden branded":.30}, capture:{"HB branded":.75,"HB low-cost":.25,"Lower-burden branded":.15}, price:{"HB branded":90000,"HB low-cost":52000,"Lower-burden branded":75000} }
    },
    cls_ax: {
      name: "CLS-AX",
      shortName: "CLS-AX",
      company: "Clearside Biomedical",
      modality: "Suprachoroidal axitinib injectable suspension",
      routeClass: "Suprachoroidal TKI delivery via specialized microinjector",
      primaryColor: "#003A70",
      palette: { primary:"#B85F00", secondary:"#67AFDD", tertiary:"#32373C", wash:"#FFF4E6", heatLow:"#FFF4E6", heatHigh:"#B85F00" },
      launchYear: 2031,
      slug: "cls_ax",
      rationale: "Latest launch and narrowest product allocation in the base case. The approach is in-office but uses a specialized suprachoroidal workflow and has less mature pivotal evidence, so the forecast uses more constrained access and durable-class allocation than intravitreal TKI implants.",
      source: { label: "Clearside CLS-AX pipeline page", url: "https://www.clearsidebio.com/pipeline/cls-ax/" },
      assumptions: { active_eyes:1150000, incident_cases:200000, treat_init:.78, eyes_per_patient:1.15, high_burden_share:.20, incident_hb_share:.10, branded_share:.62, lower_burden_share:.015, refractory_share:.20, validated_hb_candidate_share:.55, drug_durable_share:.20, mortality_attrition:.03, clinical_loss:.015, competitive_loss:.015, fellow_conversion:.10, fellow_at_risk_share:.35, ex_us_factor:.55, ex_us_price_index:.60, ex_us_delay_years:3, price_erosion:.040, clinical:{"HB branded":.80,"HB low-cost":.45,"Lower-burden branded":.20}, access:{"HB branded":.75,"HB low-cost":.65,"Lower-burden branded":.40}, capture:{"HB branded":.60,"HB low-cost":.35,"Lower-burden branded":.20}, price:{"HB branded":18000,"HB low-cost":12000,"Lower-burden branded":16000} }
    }
  };
  const COMMON_EVIDENCE = {
    activeEyes: {
      title: "Active treated nAMD eyes evidence",
      links: [
        { label: "Medicare FFS prevalence context", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12705084/" },
        { label: "Medicare Advantage prevalence context", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11695844/" }
      ],
      captures: [
        { src: "assets/evidence/ixo-vec-sources/active-treated-eyes-medicare-ffs.png", caption: "Medicare FFS prevalence source capture highlighting the 24,129,807 beneficiary denominator and 2.14% wet AMD prevalence used as denominator context." },
        { src: "assets/evidence/ixo-vec-sources/active-treated-eyes-medicare-advantage.png", caption: "Medicare Advantage prevalence source capture highlighting the 1.2%-1.3% wet AMD prevalence range used as denominator context." },
        { src: "assets/evidence/ixo-vec-sources/active-treated-eyes-derivation-note.png", caption: "Derivation note clarifying that the 1.15M active treated-eye estimate is triangulated, not directly quoted." }
      ]
    },
    highBurden: {
      title: "High-burden treated-eye share evidence",
      links: [
        { label: "IRIS Registry burden and switching study", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10767511/" },
        { label: "USRetina switching evidence", url: "https://www.aaojournal.org/article/S0161-6420(20)30192-5/fulltext" }
      ],
      captures: [
        { src: "assets/evidence/ixo-vec-sources/high-burden-iris-registry.png", caption: "IRIS Registry source capture highlighting injection frequency, discontinuation, and switching context that informs the high-burden treated-eye share." },
        { src: "assets/evidence/ixo-vec-sources/mature-pool-usretina-switching.png", caption: "USRetina source capture highlighting 10,131 eyes (27.4%) switched during follow-up, used as pathway-fluidity context." },
        { src: "assets/evidence/ixo-vec-sources/mature-pool-derivation-note.png", caption: "Derivation note clarifying that mature consideration shares are model assumptions, not observed switching rates." }
      ]
    },
    launchPool: {
      title: "Launch high-burden pool evidence",
      links: [
        { label: "Faricimab prior-agent proxy", url: "https://veranahealth.com/wp-content/uploads/2023/07/Verana_Health_ARVO_2023_FAR_Durga_Borkar_FINAL_042823.pdf" }
      ],
      captures: [
        { src: "assets/evidence/ixo-vec-sources/initial-pool-faricimab-prior-agents.png", caption: "PDF poster crop highlighting prior anti-VEGF agent counts among faricimab initiators, used as a proxy for launch-stage treatment-experienced use." }
      ]
    },
    adoptionAnalog: {
      title: "Durable adoption analog evidence",
      links: [
        { label: "Roche Vabysmo sales context", url: "https://www.roche.com/media/releases/med-cor-2026-01-29" },
        { label: "Regeneron EYLEA HD sales context", url: "https://www.sec.gov/Archives/edgar/data/872589/000087258926000004/exhibit991q42025.htm" }
      ],
      captures: [
        { src: "assets/evidence/ixo-vec-sources/durable-adoption-roche-vabysmo.png", caption: "Roche source capture highlighting Vabysmo as part of a large branded growth-driver group, used as retina scale context rather than a direct share input." },
        { src: "assets/evidence/ixo-vec-sources/durable-adoption-regeneron-eylea-hd.png", caption: "Regeneron source capture highlighting EYLEA HD full-year US net sales and growth, used as a durability-switch analog." }
      ]
    },
    pricingContext: {
      title: "Net revenue source-context evidence",
      links: [
        { label: "CMS ASP pricing source context", url: "https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files" }
      ],
      captures: [
        { src: "assets/evidence/ixo-vec-sources/net-revenue-cms-asp.png", caption: "CMS ASP pricing page capture highlighting Medicare Part B ASP pricing-file context for physician-administered drugs." },
        { src: "assets/evidence/ixo-vec-sources/net-revenue-assumption-note.png", caption: "Assumption note clarifying that modeled product net revenue is not directly sourced from CMS." }
      ]
    }
  };
  const PRODUCT_EVIDENCE = {
    axpaxli: {
      program: {
        title: "AXPAXLI program context",
        links: [{ label: "Ocular AXPAXLI clinical-trial page", url: "https://www.ocutx.com/pipeline/clinical-trials/" }],
        captures: [
          { src: "assets/evidence/pipeline-sources/axpaxli-program-context.png", caption: "Ocular clinical-trials page capture highlighting AXPAXLI, wet AMD, and SOL registrational trial context." },
          { src: "assets/evidence/ixo-vec-sources/durable-allocation-axpaxli.png", caption: "AXPAXLI pipeline capture showing axitinib, Phase 3 wet AMD context, and reduced injection-frequency positioning." }
        ]
      },
      benchmark: {
        title: "AXPAXLI public benchmark context",
        links: [{ label: "Needham estimate quoted by Sahm/Benzinga", url: "https://www.sahmcapital.com/news/content/ocular-therapeutix-axpaxli-advances-in-phase-3-for-wet-amd-analyst-forecasts-huge-upside-2025-03-11" }],
        captures: [
          { src: "assets/evidence/axpaxli-needham.png", caption: "Public article capture highlighting a roughly $1.5B peak-sales benchmark and second-line wet AMD source population context." },
          { src: "assets/evidence/pipeline-sources/axpaxli-model-assumption-derivation.png", caption: "Derivation panel translating program and benchmark context into AXPAXLI-specific model assumptions." }
        ]
      }
    },
    duravyu: {
      program: {
        title: "DURAVYU program context",
        links: [{ label: "EyePoint DURAVYU program page", url: "https://eyepoint.bio/our-programs/" }],
        captures: [
          { src: "assets/evidence/pipeline-sources/duravyu-program-context.png", caption: "EyePoint program-page capture highlighting DURAVYU, wet AMD, Phase 3, and vorolanib intravitreal insert context." }
        ]
      },
      benchmark: {
        title: "DURAVYU public benchmark context",
        links: [{ label: "Jefferies estimate quoted by Investing.com", url: "https://www.investing.com/news/company-news/eyepoint-stock-gains-traction-with-new-amd-trials-jefferies-sees-65-upside-93CH-3682827" }],
        captures: [
          { src: "assets/evidence/duravyu-jefferies.png", caption: "Saved-text evidence panel highlighting Jefferies' $600M US plus $500M EU peak adjusted sales context." },
          { src: "assets/evidence/pipeline-sources/duravyu-model-assumption-derivation.png", caption: "Derivation panel translating DURAVYU program and benchmark context into model assumptions." }
        ]
      }
    },
    rgx_314: {
      program: {
        title: "RGX-314 program context",
        links: [{ label: "REGENXBIO ABBV-RGX-314 program page", url: "https://www.regenxbio.com/therapeutic-programs/rgx-314/" }],
        captures: [
          { src: "assets/evidence/pipeline-sources/rgx-314-program-context.png", caption: "REGENXBIO program-page capture highlighting ABBV-RGX-314, one-time wet AMD positioning, and subretinal/suprachoroidal routes." },
          { src: "assets/evidence/ixo-vec-sources/durable-allocation-rgx314.png", caption: "RGX-314 / ABBV-RGX-314 capture showing one-time wet AMD treatment positioning." }
        ]
      },
      benchmark: {
        title: "RGX-314 public benchmark context",
        links: [{ label: "REGENXBIO company release", url: "https://regenxbio.gcs-web.com/news-releases/news-release-details/regenxbio-announces-lancet-publication-phase-iiia-study" }],
        captures: [
          { src: "assets/evidence/rgx-314-regenxbio.png", caption: "Reader-rendered source capture highlighting multi-billion-dollar potential across wet AMD and diabetic retinopathy; this is not a wet AMD-only sales forecast." },
          { src: "assets/evidence/pipeline-sources/rgx_314-model-assumption-derivation.png", caption: "Derivation panel explaining why the wet AMD model remains conservative versus multi-indication opportunity language." }
        ]
      }
    },
    four_d_150: {
      program: {
        title: "4D-150 program context",
        links: [{ label: "4DMT pipeline page", url: "https://4dmoleculartherapeutics.com/pipeline/" }],
        captures: [
          { src: "assets/evidence/pipeline-sources/four-d-150-program-context.png", caption: "4DMT pipeline capture highlighting 4D-150, intravitreal delivery, wet AMD, Phase 3, and 4FRONT context." },
          { src: "assets/evidence/ixo-vec-sources/durable-allocation-4d150-saved-text.png", caption: "Saved-text evidence panel for the 4D-150 Phase 3 wet AMD enrollment source." }
        ]
      },
      benchmark: {
        title: "4D-150 public benchmark context",
        links: [{ label: "BofA estimate quoted by TipRanks/The Fly", url: "https://www.tipranks.com/news/the-fly/4d-molecular-price-target-raised-to-82-from-33-at-bofa" }],
        captures: [
          { src: "assets/evidence/four-d-150-bofa.png", caption: "Public article capture highlighting a $2.8B risk-adjusted peak-sales benchmark for 4D-150 in wet AMD." },
          { src: "assets/evidence/pipeline-sources/four_d_150-model-assumption-derivation.png", caption: "Derivation panel translating 4D-150 program and benchmark context into model assumptions." }
        ]
      }
    },
    cls_ax: {
      program: {
        title: "CLS-AX program context",
        links: [{ label: "Clearside CLS-AX pipeline page", url: "https://www.clearsidebio.com/pipeline/cls-ax/" }],
        captures: [
          { src: "assets/evidence/pipeline-sources/cls-ax-program-context.png", caption: "Clearside program-page capture highlighting CLS-AX, wet AMD, Phase 3-ready language, suprachoroidal delivery, and Phase 2b context." }
        ]
      },
      benchmark: {
        title: "CLS-AX public benchmark context",
        links: [{ label: "GlobalData estimate quoted by Clinical Trials Arena", url: "https://www.clinicaltrialsarena.com/news/clearsides-wet-amd-drug-device-combo-shines-in-phase-iib-study/" }],
        captures: [
          { src: "assets/evidence/cls-ax-globaldata.png", caption: "Public article capture highlighting the GlobalData 2030 sales estimate if approved." },
          { src: "assets/evidence/pipeline-sources/cls_ax-model-assumption-derivation.png", caption: "Derivation panel explaining the later-launch, lower-allocation CLS-AX model assumptions." }
        ]
      }
    }
  };
  const SCENARIO_FACTORS = {
    Bear: { market:.90, candidate:-.15, share:-.10, access:-.10, capture:-.10, price:.85, exus:.80, erosion:.02 },
    Base: { market:1, candidate:0, share:0, access:0, capture:0, price:1, exus:1, erosion:0 },
    Bull: { market:1.08, candidate:.10, share:.08, access:.05, capture:.08, price:1.12, exus:1.18, erosion:-.01 }
  };
  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
  function scenarioAssumptions(drug, scenario) {
    const base = clone(drug.assumptions);
    const f = SCENARIO_FACTORS[scenario] || SCENARIO_FACTORS.Base;
    base.active_eyes = Math.round(base.active_eyes * f.market);
    base.incident_cases = Math.round(base.incident_cases * f.market);
    base.validated_hb_candidate_share = clamp(base.validated_hb_candidate_share + f.candidate, 0, 1);
    base.drug_durable_share = clamp(base.drug_durable_share + f.share, 0, 1);
    base.ex_us_factor = Math.max(0, base.ex_us_factor * f.exus);
    base.price_erosion = Math.max(0, base.price_erosion + f.erosion);
    for (const seg of SEGMENTS) {
      base.access[seg] = clamp(base.access[seg] + f.access, 0, 1);
      base.capture[seg] = clamp(base.capture[seg] + f.capture, 0, 1);
      base.price[seg] = Math.round(base.price[seg] * f.price / 100) * 100;
    }
    return base;
  }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function fmtMoney(v) { return Math.abs(v) >= 1000 ? "$" + (v / 1000).toFixed(2) + "B" : "$" + Math.round(v).toLocaleString() + "M"; }
  function fmtSignedMoney(v) { return (v < 0 ? "-" : "") + fmtMoney(Math.abs(v)); }
  function fmtEyes(v) { return Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + "k" : Math.round(v).toLocaleString(); }
  function fmtPct(v) { return (v * 100).toFixed(v < .1 && v > 0 ? 1 : 0) + "%"; }
  function num(v) { return Number(v) || 0; }
  function esc(value) {
    return String(value || "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
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
        const key = capture.src;
        if (!seenCaptures.has(key)) {
          captures.push(capture);
          seenCaptures.add(key);
        }
      }
    }
    return { title, links, captures };
  }
  function metricEvidence(drug, key) {
    const product = PRODUCT_EVIDENCE[drug.slug] || {};
    const assumption = product.benchmark;
    const map = {
      activeEyes: mergeEvidence("Active treated nAMD eyes evidence", COMMON_EVIDENCE.activeEyes),
      candidate: mergeEvidence("High-burden pool and product-candidate evidence", COMMON_EVIDENCE.highBurden, COMMON_EVIDENCE.launchPool, product.program, assumption),
      allocation: mergeEvidence(`${drug.shortName} durable-option allocation evidence`, product.program, assumption),
      access: mergeEvidence(`${drug.shortName} access and route evidence`, product.program, assumption),
      adoption: mergeEvidence(`${drug.shortName} durable-option adoption evidence`, COMMON_EVIDENCE.adoptionAnalog, product.program, assumption),
      price: mergeEvidence(`${drug.shortName} net-revenue evidence and assumption`, COMMON_EVIDENCE.pricingContext, assumption),
      exus: mergeEvidence(`${drug.shortName} ex-US assumption evidence`, assumption),
      delay: mergeEvidence(`${drug.shortName} launch-timing evidence`, product.program, assumption)
    };
    return map[key] || null;
  }
  function sourceRow(drug, key) {
    const set = metricEvidence(drug, key);
    if (!set) return "";
    const links = (set.links || []).map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.label)}</a>`).join(", ") || "Explicit model assumption";
    const button = (set.captures || []).length
      ? `<div class="source-actions"><button type="button" class="source-evidence-button" data-source-key="${esc(key)}">View evidence and derivation</button></div>`
      : "";
    return `<dt>Sources</dt><dd>${links}${button}</dd>`;
  }
  function applyPalette(drug) {
    const p = drug.palette || {};
    const root = document.documentElement;
    const vars = {
      "--blue": p.primary,
      "--teal": p.secondary,
      "--gray": p.tertiary,
      "--wash": p.wash,
      "--company-primary": p.primary
    };
    for (const [name, value] of Object.entries(vars)) {
      if (value) root.style.setProperty(name, value);
    }
  }
  function hexToRgb(hex) {
    const value = hex.replace("#", "");
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }
  function mixHex(startHex, endHex, t) {
    const start = hexToRgb(startHex), end = hexToRgb(endHex);
    const mix = channel => Math.round(start[channel] + (end[channel] - start[channel]) * t);
    return `rgb(${mix("r")}, ${mix("g")}, ${mix("b")})`;
  }
  function relativeLuminance(rgb) {
    const channel = v => {
      const c = v / 255;
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
    const rgb = { r:Number(match[1]), g:Number(match[2]), b:Number(match[3]) };
    const dark = { r:0, g:0, b:0 };
    const white = { r:255, g:255, b:255 };
    return contrastRatio(white, rgb) > contrastRatio(dark, rgb) ? "#fff" : "#000";
  }
  function sourceValues(a, seg) {
    const lowCost = 1 - a.branded_share;
    let initial, inflow;
    if (seg === "HB branded") {
      initial = a.active_eyes * a.high_burden_share * a.branded_share * a.clinical[seg];
      inflow = a.incident_cases * a.treat_init * a.eyes_per_patient * a.incident_hb_share * a.branded_share * a.clinical[seg];
    } else if (seg === "HB low-cost") {
      initial = a.active_eyes * a.high_burden_share * lowCost * a.clinical[seg];
      inflow = a.incident_cases * a.treat_init * a.eyes_per_patient * a.incident_hb_share * lowCost * a.clinical[seg];
    } else {
      initial = a.active_eyes * (1 - a.high_burden_share) * a.branded_share * a.lower_burden_share * a.clinical[seg];
      inflow = a.incident_cases * a.treat_init * a.eyes_per_patient * (1 - a.incident_hb_share) * a.branded_share * a.lower_burden_share * a.clinical[seg];
    }
    return { initial, inflow, fellowInitial: initial / a.eyes_per_patient * a.fellow_at_risk_share };
  }
  function launchRamp(launchYear, year, values, after) {
    const offset = year - launchYear;
    if (offset < 0) return 0;
    if (Object.prototype.hasOwnProperty.call(values, offset)) return values[offset];
    return after;
  }
  function accessMult(scenario, launchYear, year) {
    const adjust = scenario === "Bull" ? .05 : scenario === "Bear" ? -.10 : 0;
    const base = launchRamp(launchYear, year, {0:.70,1:.80,2:.90,3:.95,4:.98,5:1,6:1,7:1}, Math.max(.85, 1 - .01 * (year - (launchYear + 7))));
    return clamp(base + adjust, 0, 1);
  }
  function captureMult(scenario, launchYear, seg, year) {
    let base = launchRamp(launchYear, year, {0:.15,1:.25,2:.40,3:.70,4:.85,5:.95,6:1,7:1}, Math.max(.55, 1 - .04 * (year - (launchYear + 7))));
    const segFactor = seg === "HB low-cost" ? .5 : seg === "Lower-burden branded" ? .35 : 1;
    const adjust = scenario === "Bull" ? .10 : scenario === "Bear" ? -.10 : 0;
    return clamp(base * segFactor + adjust, 0, 1);
  }
  function candidateMult(a, launchYear, seg, year) {
    if (year < launchYear) return 0;
    const offset = year - launchYear;
    if (seg === "Lower-burden branded") {
      const curve = {0:0,1:0,2:.10,3:.25,4:.50,5:.75,6:1,7:1};
      return a.lower_burden_share * (curve[offset] ?? 1);
    }
    const target = a.validated_hb_candidate_share;
    const launch = a.refractory_share;
    const curve = {0:launch,1:launch,2:launch,3:launch + .35 * (target - launch),4:launch + .70 * (target - launch),5:target,6:target,7:target};
    const value = curve[offset] ?? target;
    return seg === "HB low-cost" ? value * .5 : value;
  }
  function priceIdx(a, launchYear, year) {
    if (year < launchYear) return 0;
    const erosionStart = launchYear + 7;
    return year <= erosionStart ? 1 : Math.pow(1 - a.price_erosion, year - erosionStart);
  }
  function exusMult(a, launchYear, year) {
    const start = launchYear + a.ex_us_delay_years;
    if (year < start) return 0;
    const ramp = {0:.25,1:.40,2:.55,3:.70,4:.85};
    return ramp[year - start] ?? 1;
  }
  function compute(drug, a, scenarioName) {
    const sales = Object.fromEntries(YEARS.map(y => [y, { treated:0, us:0, exus:0, world:0, cumulative:0 }]));
    const flows = {};
    let initialTotal = 0;
    for (const seg of SEGMENTS) {
      flows[seg] = {};
      const source = sourceValues(a, seg);
      let opening = source.initial;
      let fellowOpening = source.fellowInitial;
      initialTotal += source.initial;
      for (const year of YEARS) {
        const active = year >= drug.launchYear;
        const newClinicalInflow = active ? source.inflow : 0;
        const newFellowAtRisk = active ? newClinicalInflow / a.eyes_per_patient * a.fellow_at_risk_share : 0;
        const fellowConversions = active ? Math.min(fellowOpening + newFellowAtRisk, (fellowOpening + newFellowAtRisk) * a.fellow_conversion) : 0;
        const available = opening + newClinicalInflow + fellowConversions;
        const candidate = candidateMult(a, drug.launchYear, seg, year);
        const accessRamp = accessMult(scenarioName, drug.launchYear, year);
        const accessible = available * candidate * a.access[seg] * accessRamp;
        const captureRamp = captureMult(scenarioName, drug.launchYear, seg, year);
        const durableUse = accessible * a.capture[seg] * captureRamp;
        const treated = Math.min(available, durableUse * a.drug_durable_share);
        const attritionRate = active ? a.mortality_attrition + a.clinical_loss + a.competitive_loss : 0;
        const attrition = Math.max(0, (available - treated) * attritionRate);
        const ending = Math.max(0, available - treated - attrition);
        const fellowEnding = Math.max(0, fellowOpening + newFellowAtRisk - fellowConversions - ((fellowOpening + newFellowAtRisk - fellowConversions) * attritionRate));
        const usSales = treated * a.price[seg] * priceIdx(a, drug.launchYear, year) / 1_000_000;
        flows[seg][year] = { opening, newClinicalInflow, fellowConversions, available, candidate, peakAccess:a.access[seg], accessRamp, accessible, peakDurable:a.capture[seg], captureRamp, productShare:a.drug_durable_share, durableUse, treated, ending, price:a.price[seg], priceIndex:priceIdx(a, drug.launchYear, year), usSales };
        opening = ending;
        fellowOpening = fellowEnding;
        sales[year].treated += treated;
        sales[year].us += usSales;
      }
    }
    let cumulative = 0;
    for (const year of YEARS) {
      const exus = sales[year].us * a.ex_us_factor * a.ex_us_price_index * exusMult(a, drug.launchYear, year);
      cumulative += sales[year].treated;
      sales[year].exus = exus;
      sales[year].world = sales[year].us + exus;
      sales[year].cumulative = cumulative;
      sales[year].cumulativeActivePenetration = a.active_eyes ? cumulative / a.active_eyes : 0;
      sales[year].cumulativeInitialPoolPenetration = initialTotal ? cumulative / initialTotal : 0;
    }
    return { sales, flows, initialTotal };
  }
  function summary(model, drug) {
    const rows = YEARS.map(y => ({ year:y, ...model.sales[y] }));
    const peak = rows.reduce((a, b) => b.world > a.world ? b : a, rows[0]);
    const firstB = rows.find(r => r.world >= 1000);
    const selectedYear = Math.min(2045, drug.launchYear + 7);
    return { peak, firstB, selectedYear, selected: model.sales[selectedYear] };
  }
  function chartSvg(model, markYears) {
    const left = 58, right = 922, top = 42, bottom = 360;
    const values = YEARS.flatMap(y => [model.sales[y].world, model.sales[y].us, model.sales[y].exus]);
    const max = Math.max(...values, 1000) * 1.16;
    const x = y => left + (YEARS.indexOf(y) / (YEARS.length - 1)) * (right - left);
    const yy = v => bottom - (v / max) * (bottom - top);
    const path = key => YEARS.map(y => `${x(y).toFixed(1)},${yy(key(y)).toFixed(1)}`).join(" ");
    const tickStep = max > 3000 ? 1000 : 500;
    const ticks = Array.from({ length: Math.ceil(max / tickStep) + 1 }, (_, i) => i * tickStep).filter(v => v <= max);
    const grid = ticks.map(t => `<line x1="${left}" y1="${yy(t).toFixed(1)}" x2="${right}" y2="${yy(t).toFixed(1)}" class="grid-line"/><text x="46" y="${(yy(t)+4).toFixed(1)}" text-anchor="end" class="axis-label">${t===0?"$0":"$"+(t/1000).toFixed(tickStep >= 1000 ? 0 : 1)+"B"}</text>`).join("");
    const labels = markYears.map(y => {
      const row = model.sales[y];
      const labelAnchor = y >= 2043 ? `text-anchor="end"` : "";
      const dx = y >= 2043 ? -8 : 8;
      return `<circle cx="${x(y).toFixed(1)}" cy="${yy(row.exus).toFixed(1)}" r="4.5" class="exus-dot"/><circle cx="${x(y).toFixed(1)}" cy="${yy(row.us).toFixed(1)}" r="4.5" class="us-dot"/><circle cx="${x(y).toFixed(1)}" cy="${yy(row.world).toFixed(1)}" r="4.5" class="world-dot"/><text x="${(x(y)+dx).toFixed(1)}" y="${(yy(row.world)-9).toFixed(1)}" ${labelAnchor} class="series-label">${y}: ${fmtMoney(row.world)}</text>`;
    }).join("");
    return `<svg viewBox="0 0 980 420" role="img" aria-label="Base case sales forecast chart">${grid}<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" class="axis"/><polyline points="${path(y => model.sales[y].exus)}" class="line exus-line"/><polyline points="${path(y => model.sales[y].us)}" class="line us-line"/><polyline points="${path(y => model.sales[y].world)}" class="line world-line"/>${labels}${YEARS.filter(y => [2025,2028,2030,2033,2036,2039,2042,2045].includes(y)).map(y => `<text x="${x(y).toFixed(1)}" y="395" text-anchor="middle" class="axis-label">${y}</text>`).join("")}</svg>`;
  }
  function heatColor(v, palette) {
    const t = clamp(v, 0, 1);
    return mixHex(palette.heatLow || "#ecf2f9", palette.heatHigh || "#2e72dc", t);
  }
  function heatRow(label, values, palette) {
    const cells = YEARS.slice(4).map(y => {
      const background = heatColor(values[y], palette);
      return `<span class="heat-cell" style="background:${background};color:${textColorForBackground(background)}" title="${label}, ${y}: ${values[y].toFixed(2)}">${values[y].toFixed(2)}</span>`;
    }).join("");
    return `<div class="driver-row"><div class="driver-name">${label}</div><div class="heat-grid">${cells}</div></div>`;
  }
  function renderInfographic(drug) {
    applyPalette(drug);
    const assumptions = scenarioAssumptions(drug, "Base");
    const model = compute(drug, assumptions, "Base");
    const s = summary(model, drug);
    const markYears = [...new Set([drug.launchYear, drug.launchYear + 3, s.peak.year, s.selectedYear, 2045].filter(y => y >= 2025 && y <= 2045))].sort((a,b)=>a-b);
    const hb = model.flows["HB branded"][s.selectedYear];
    const total = model.sales[s.selectedYear];
    document.title = `${drug.shortName} Base Case Sales Forecast Infographic`;
    document.body.innerHTML = `<main class="page">
      <header><div><h1>${drug.shortName} Base Case Sales Forecast</h1><p class="deck">A model view of how patient opportunity, annual adoption ramps, durable-treatment competition, pricing, and ex-US launch timing convert into a year-by-year worldwide sales forecast.</p></div><aside class="meta"><div><strong>Base case</strong> Most realistic estimate using available public data plus stated assumptions.</div><div><strong>Model period</strong> 2025-2045, with commercial launch modeled from ${drug.launchYear}.</div><div><strong>Program</strong> ${drug.company}; ${drug.modality}.</div></aside></header>
      <nav class="nav-tools" aria-label="Related model tools"><a href="${drug.slug}_interactive_model_calculator.html">Open interactive model calculator</a><a href="index.html">Forecast index</a></nav>
      <section class="kpi-strip" aria-label="Base case summary metrics"><div class="kpi"><div class="label">Peak worldwide sales</div><div class="value">${fmtMoney(s.peak.world)}</div><p>${s.peak.year}</p></div><div class="kpi"><div class="label">Base-case forecast for ${s.selectedYear}</div><div class="value">${fmtMoney(s.selected.world)}</div><p>Worldwide sales in launch year ${s.selectedYear - drug.launchYear + 1}.</p></div><div class="kpi"><div class="label">First year above $1B</div><div class="value">${s.firstB ? s.firstB.year : "Not reached"}</div><p>Worldwide sales threshold in the base case.</p></div><div class="kpi"><div class="label">Peak US treated eyes</div><div class="value">${fmtEyes(s.peak.treated)}</div><p>US treated eyes across source-of-business segments.</p></div></section>
      <section class="section"><div class="section-head"><h2>Sales curve</h2><p>The forecast is shifted to the estimated ${drug.launchYear} commercial launch and uses product-specific assumptions for eligible/access, durable-option allocation, pricing, ex-US timing, and erosion. Source-of-business segments are patient pools by current treatment source, not market share or disease-burden pricing tiers.</p></div><div class="chart-panel"><div class="legend"><span>Worldwide sales</span><span class="us">US sales</span><span class="exus">Ex-US sales</span></div>${chartSvg(model, markYears)}</div></section>
      <section class="section"><div class="section-head"><h2>Core inputs</h2><p>These base-case assumptions shape the annual calculation. Market-wide denominators are held constant across pipeline programs so differences come from product characteristics and launch timing.</p></div><div class="metric-grid">${metricCards(drug, assumptions)}</div><div class="calc-key"><h3>Calculation variable key</h3><div class="calc-key-grid">${calcKey(drug, hb, total, assumptions, s.selectedYear)}</div></div></section>
      <section class="section"><div class="section-head"><h2>${s.selectedYear} patient funnel</h2><p>This worked example shows how the high-burden branded anti-VEGF source pool narrows to ${drug.shortName} treated eyes. Eligible/access means eyes that remain reachable after clinical suitability, payer/site access, and that year's access timing are applied.</p></div>${funnel(hb, drug)}</section>
      <section class="section"><div class="section-head"><h2>What changes each year</h2><p>The annual sales curve is mainly driven by five moving variables: high-burden pool considered, access ramp, adoption ramp, price index, and ex-US uptake.</p></div><div class="driver-board"><div class="year-head"><div></div><div class="heat-grid">${YEARS.slice(4).map(y => `<span>${y}</span>`).join("")}</div></div>${heatRows(drug, assumptions)}</div></section>
      <section class="section"><div class="section-head"><h2>How the math works</h2><p>Each year repeats the same calculation logic, then rolls forward the remaining untreated source pools.</p></div><div class="formula">${formulaSteps(drug)}</div></section>
      <section class="section"><div class="section-head"><h2>Segment mix</h2><p>The base case separates high-burden branded anti-VEGF, high-burden low-cost anti-VEGF, and lower-burden branded anti-VEGF source pools. These labels describe source-of-business, not market share or price by disease severity.</p></div><div class="two-col"><div class="mix-card">${segmentMix(model, s.peak.year)}</div><div class="caveat-grid">${caveats(drug)}</div></div></section>
      <section class="section"><div class="section-head"><h2>Year-by-year bridge</h2><p>This table shows the annual outputs most useful for external review.</p></div><div class="table-wrap"><table>${annualTable(model)}</table></div><p class="source-note">Source context: <a href="${drug.source.url}" target="_blank" rel="noopener">${drug.source.label}</a>. Forecast values are model-ready assumptions from the wet AMD pipeline input file and are intended for sensitivity analysis.</p></section>
    </main>
    <div class="source-modal" id="source-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="source-modal-title">
      <div class="source-modal-panel">
        <div class="source-modal-head">
          <div class="source-modal-title" id="source-modal-title">Highlighted source capture</div>
          <button type="button" class="source-modal-close" id="source-modal-close">Close</button>
        </div>
        <div class="source-modal-body" id="source-modal-body"></div>
      </div>
    </div>`;
    setupSourceModal(drug);
  }
  function metricCards(drug, a) {
    const cards = [
      { key:"activeEyes", letter:"A", label:"Active treated nAMD eyes", value:fmtEyes(a.active_eyes), text:"Estimated US treated-eye denominator used before narrowing to source-of-business segments.", basis:"Assumption informed by prevalence and treated-population context.", calculation:`1.15M active treated eyes x ${fmtPct(a.high_burden_share)} high-burden share = ${fmtEyes(a.active_eyes * a.high_burden_share)} high-burden eyes before source filters.`, rationale:"Held constant across the five pipeline programs so product differences come from route, access, adoption, allocation, pricing, and launch timing." },
      { key:"candidate", letter:"B", label:"Mature high-burden pool considered", value:fmtPct(a.validated_hb_candidate_share), text:"Mature share of high-burden source eyes considered clinically and commercially plausible for durable-option use.", basis:"Assumption informed by anti-VEGF burden evidence, switching evidence, and product-specific route/stage context.", calculation:`Launch starts at ${fmtPct(a.refractory_share)} refractory/high-burden consideration and ramps to ${fmtPct(a.validated_hb_candidate_share)} mature consideration.`, rationale:`${drug.routeClass} supports this product-specific mature candidate-pool assumption.` },
      { key:"allocation", letter:"C", label:`${drug.shortName} allocation within durable options`, value:fmtPct(a.drug_durable_share), text:`Modeled portion of durable-option use assigned to ${drug.shortName} after allowing for other long-duration competitors.`, basis:"Competitive allocation assumption informed by the product profile and public benchmark context.", calculation:`Durable-option use x ${fmtPct(a.drug_durable_share)} ${drug.shortName} allocation = treated eyes assigned to ${drug.shortName}.`, rationale:"This is not market share. It is product allocation within modeled durable-treatment use after access and adoption are applied." },
      { key:"access", letter:"D", label:"HB branded eligible/access share", value:fmtPct(a.access["HB branded"]), text:"Peak share of high-burden branded-source eyes reachable after clinical suitability, payer access, site readiness, and logistics.", basis:"Route, administration workflow, and evidence maturity assumption.", calculation:`The high-burden branded source pool is multiplied by ${fmtPct(a.access["HB branded"])} peak eligible/access share and the annual access timing ramp.`, rationale:`${drug.routeClass} informs the access ceiling.` },
      { key:"adoption", letter:"E", label:"HB branded durable-option adoption", value:fmtPct(a.capture["HB branded"]), text:"Mature durable-option adoption within eligible and accessible high-burden branded-source eyes before product allocation.", basis:"Analog-informed assumption based on branded retina uptake context plus product-specific durability and workflow.", calculation:`Eligible/access eyes x ${fmtPct(a.capture["HB branded"])} durable-option adoption x annual adoption ramp = durable-option use before ${drug.shortName} allocation.`, rationale:`Durable-option use is then multiplied by ${fmtPct(a.drug_durable_share)} to estimate ${drug.shortName} treated eyes.` },
      { key:"price", letter:"F", label:"US net revenue per HB branded eye", value:"$" + a.price["HB branded"].toLocaleString(), text:"Scenario net revenue per treated eye or treatment course for high-burden branded-source eyes.", basis:"Modeled net-revenue assumption, not a published product price.", calculation:`US sales in each segment = treated eyes x $${a.price["HB branded"].toLocaleString()} HB branded net revenue x annual price index / 1,000,000.`, rationale:"The value reflects product class, expected treatment duration economics, payer controls, and public benchmark reasonableness rather than a directly sourced price." },
      { key:"exus", letter:"G", label:"Ex-US sales factor vs US", value:a.ex_us_factor.toFixed(2) + "x", text:"Volume/access factor used to add ex-US revenue after launch delay and ex-US price haircut.", basis:"Explicit global gross-up assumption.", calculation:`Ex-US sales = US sales x ${a.ex_us_factor.toFixed(2)} volume/access factor x ${a.ex_us_price_index.toFixed(2)} price index x annual ex-US uptake.`, rationale:"Used as a simple global contribution factor while the model remains above country-level launch, price, and access detail." },
      { key:"delay", letter:"H", label:"Ex-US delay", value:`${a.ex_us_delay_years} years`, text:"Delay between modeled US launch and ex-US contribution.", basis:"Explicit launch-sequencing assumption.", calculation:`Commercial launch is modeled from ${drug.launchYear}; ex-US contribution begins in ${drug.launchYear + a.ex_us_delay_years}.`, rationale:"The model treats ex-US launch as delayed and ramped rather than simultaneous with the US commercial year." }
    ];
    return cards.map(c => `<article class="metric-card"><div class="metric-label"><span class="input-code">${c.letter}</span>${c.label}</div><div class="metric-value">${c.value}</div><p>${c.text}</p><dl class="card-proof"><dt>Basis</dt><dd>${c.basis}</dd><dt>Calculation</dt><dd><span class="calc-ref">${c.letter}</span> ${c.calculation}</dd><dt>Rationale</dt><dd>${c.rationale}</dd>${sourceRow(drug, c.key)}</dl></article>`).join("");
  }
  function setupSourceModal(drug) {
    const modal = document.getElementById("source-modal");
    const title = document.getElementById("source-modal-title");
    const body = document.getElementById("source-modal-body");
    const close = document.getElementById("source-modal-close");
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
        const set = metricEvidence(drug, button.dataset.sourceKey);
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
  function calcKey(drug, hb, total, a, y) {
    const rows = [
      ["I", "Available source eyes", `Opening untreated pool ${fmtEyes(hb.opening)} + new inflow ${fmtEyes(hb.newClinicalInflow)} + fellow-eye conversions ${fmtEyes(hb.fellowConversions)} = ${fmtEyes(hb.available)} available source eyes.`],
      ["J", "Eligible and accessible eyes", `${fmtEyes(hb.available)} x ${fmtPct(hb.candidate)} considered x ${fmtPct(hb.peakAccess)} access ceiling x ${fmtPct(hb.accessRamp)} timing ramp = ${fmtEyes(hb.accessible)} eligible and accessible eyes.`],
      ["K", "Durable-option use", `${fmtEyes(hb.accessible)} x ${fmtPct(hb.peakDurable)} durable-option adoption x ${fmtPct(hb.captureRamp)} adoption timing = ${fmtEyes(hb.durableUse)} durable-option use.`],
      ["L", `${drug.shortName} treated eyes`, `${fmtEyes(hb.durableUse)} durable-option use x ${fmtPct(hb.productShare)} ${drug.shortName} allocation = ${fmtEyes(hb.treated)} treated eyes from the high-burden branded source.`],
      ["M", "US sales", `Across all source pools: ${fmtEyes(total.treated)} treated eyes convert to ${fmtMoney(total.us)} US sales after segment prices and annual price index.`],
      ["N", "Worldwide sales", `${fmtMoney(total.us)} US sales + ${fmtMoney(total.exus)} ex-US sales = ${fmtMoney(total.world)} worldwide sales in ${y}.`]
    ];
    return rows.map(r => `<div class="calc-var"><strong><span class="calc-ref">${r[0]}</span>${r[1]}</strong><p class="derivation">${r[2]}</p></div>`).join("");
  }
  function funnel(hb, drug) {
    const otherMgmt = Math.max(0, hb.accessible - hb.durableUse);
    const otherDurable = Math.max(0, hb.durableUse - hb.treated);
    return `<div class="definitions"><div class="definition"><strong>Available source eyes</strong><p>${fmtEyes(hb.available)} high-burden branded anti-VEGF source eyes before consideration, access, adoption, and competition.</p></div><div class="definition"><strong>Eligible/access</strong><p>${fmtEyes(hb.accessible)} eyes remain after ${fmtPct(hb.candidate)} consideration, ${fmtPct(hb.peakAccess)} peak access, and ${fmtPct(hb.accessRamp)} timing ramp.</p></div><div class="definition"><strong>Durable option</strong><p>${fmtEyes(hb.durableUse)} eyes move to durable-option use before assigning a product-specific share.</p></div><div class="definition"><strong>${drug.shortName} treated eyes</strong><p>${fmtEyes(hb.treated)} eyes equal durable-option use x ${fmtPct(hb.productShare)} product allocation. Other durable options: ${fmtEyes(otherDurable)}. Other management: ${fmtEyes(otherMgmt)}.</p></div></div>`;
  }
  function heatRows(drug, a) {
    const candidate = Object.fromEntries(YEARS.map(y => [y, candidateMult(a, drug.launchYear, "HB branded", y)]));
    const access = Object.fromEntries(YEARS.map(y => [y, accessMult("Base", drug.launchYear, y)]));
    const capture = Object.fromEntries(YEARS.map(y => [y, captureMult("Base", drug.launchYear, "HB branded", y)]));
    const price = Object.fromEntries(YEARS.map(y => [y, priceIdx(a, drug.launchYear, y)]));
    const exus = Object.fromEntries(YEARS.map(y => [y, exusMult(a, drug.launchYear, y)]));
    return heatRow("High-burden pool considered", candidate, drug.palette) + heatRow("Access ramp", access, drug.palette) + heatRow("Adoption ramp", capture, drug.palette) + heatRow("Price index", price, drug.palette) + heatRow("Ex-US uptake", exus, drug.palette);
  }
  function formulaSteps(drug) {
    return [["01","Start with source eyes","Active treated eyes and incident wet AMD inflow create source pools by current treatment source."],["02","Apply consideration and access","The source pool is multiplied by the year-specific considered share, access ceiling, and launch timing ramp."],["03","Estimate durable-option use","Eligible and accessible eyes are multiplied by durable-option adoption and adoption timing."],["04","Allocate to product",`Durable-option use x ${drug.shortName} allocation within the durable-treatment class produces treated eyes.`],["05","Convert to US sales","Treated eyes x segment net revenue per treated eye x annual price index / 1,000,000 produces US sales in millions."],["06","Add ex-US sales","US sales x ex-US volume/access factor x ex-US price index x annual ex-US uptake produces worldwide sales."]].map(s => `<div class="formula-step"><div class="num">${s[0]}</div><strong>${s[1]}</strong><p>${s[2]}</p></div>`).join("");
  }
  function segmentMix(model, year) {
    const total = SEGMENTS.reduce((sum, seg) => sum + model.flows[seg][year].usSales, 0) || 1;
    return SEGMENTS.map((seg, i) => {
      const value = model.flows[seg][year].usSales;
      const cls = i === 0 ? "mix-hb" : i === 1 ? "mix-low" : "mix-lower";
      return `<div class="mix-row"><div>${year}</div><div><div>${seg}</div><div class="mix-bar"><span class="${cls}" style="width:${Math.max(1, value / total * 100).toFixed(1)}%"></span></div></div><div class="mix-total">${fmtMoney(value)}</div></div>`;
    }).join("");
  }
  function caveats(drug) {
    return `<div class="caveat"><strong>Directly anchored context</strong><p>Company and clinical-program context support the modality, route, and development-stage rationale.</p></div><div class="caveat"><strong>Triangulated estimates</strong><p>Eligible/access, source-pool breadth, and durable-option allocation are stated assumptions for external review.</p></div><div class="caveat"><strong>Why this forecast differs</strong><p>${drug.rationale}</p></div>`;
  }
  function annualTable(model) {
    const head = `<thead><tr><th>Year</th>${YEARS.map(y => `<th>${y}</th>`).join("")}</tr></thead>`;
    const row = (label, key, fmt) => `<tr><td>${label}</td>${YEARS.map(y => `<td>${fmt(model.sales[y][key])}</td>`).join("")}</tr>`;
    return `${head}<tbody>${row("US treated eyes","treated",fmtEyes)}${row("US sales","us",fmtMoney)}${row("Ex-US sales","exus",fmtMoney)}${row("Worldwide sales","world",fmtMoney)}${row("Cumulative US treated eyes","cumulative",fmtEyes)}${row("Cumulative penetration of active treated eyes","cumulativeActivePenetration",fmtPct)}</tbody>`;
  }
  function renderCalculator(drug) {
    applyPalette(drug);
    let activeScenario = "Base";
    let selectedYearValue = Math.min(2045, drug.launchYear + 7);
    let assumptions = scenarioAssumptions(drug, activeScenario);
    let model = compute(drug, assumptions, activeScenario);
    document.title = `${drug.shortName} Interactive Model Calculator`;
    document.body.innerHTML = `<main class="page"><header><div><h1>${drug.shortName} Interactive Model Calculator</h1><p class="deck">A browser-side version of the forecast logic. Change assumptions, choose any model year, and inspect how source pools, eligible/access, durable-option use, ${drug.shortName} treated eyes, and sales are calculated.</p></div><aside class="meta"><div><strong>Model period</strong> 2025-2045, with commercial launch modeled from ${drug.launchYear}.</div><div><strong>Traceability</strong> The table exposes each annual calculation step.</div></aside></header><nav class="toolbar" aria-label="Model pages"><a href="${drug.slug}_base_case_sales_forecast_infographic.html">Open infographic</a><a href="index.html">Forecast index</a><button type="button" class="active" data-jump="#calculator">Calculator</button><button type="button" data-jump="#matrix">Calculation table</button><button type="button" data-jump="#definitions">Definitions</button></nav><section class="kpi-strip" aria-label="Interactive scenario summary"><div class="kpi"><div class="label">Selected year worldwide sales</div><div class="value" id="kpi-world"></div><p id="kpi-world-note"></p></div><div class="kpi"><div class="label">Peak worldwide sales</div><div class="value" id="kpi-peak"></div><p id="kpi-peak-note"></p></div><div class="kpi"><div class="label">${drug.shortName} treated eyes</div><div class="value" id="kpi-eyes"></div><p>US treated eyes across modeled source-of-business segments.</p></div><div class="kpi"><div class="label">Scenario</div><div class="value" id="kpi-scenario"></div><p>Current editable assumption set.</p></div></section><section class="section" id="calculator"><div class="section-head"><h2>Inputs and results</h2><p>These controls adjust the selected scenario directly in the browser. Product allocation within durable options is not market share; it is the share of durable-option use assigned to ${drug.shortName} after access and adoption gates.</p></div><div class="app-grid"><div class="panel"><div class="control-grid">${controls()}</div><div class="button-row"><button type="button" class="primary" id="applyInputs">Apply changes</button><button type="button" id="resetScenario">Reset scenario</button></div></div><div><div class="chart-panel"><div class="chart-head"><h3>Annual model output</h3><p>Worldwide, US, and ex-US sales, $M</p></div><svg id="salesChart" viewBox="0 0 760 390" role="img" aria-label="Annual sales forecast chart"></svg><div class="legend"><span>Worldwide sales</span><span class="us">US sales</span><span class="exus">Ex-US sales</span></div></div><div class="trace-grid" id="formulaTrace" aria-label="Selected year formula trace"></div></div></div></section><section class="section" id="matrix"><div class="section-head"><h2>Calculation table</h2><p>The table shows the annual calculation path for the selected scenario.</p></div><div class="table-tools"><label for="tableView" class="label" style="margin:0;">Table view</label><select id="tableView"><option value="summary">Total forecast rows</option><option value="hb">High-burden branded source rows</option><option value="allSegments">All source segment rows</option></select></div><div class="table-wrap"><table id="calcTable"></table></div></section><section class="section" id="definitions"><div class="section-head"><h2>Model definitions</h2><p>These labels separate model mechanics from market share, disease burden, and pricing categories.</p></div><div class="definitions"><div class="definition"><strong>Source eyes</strong><p>Eyes grouped by current treatment source before durable-option consideration, access, adoption, and competition.</p></div><div class="definition"><strong>Eligible/access</strong><p>Considered eyes that remain reachable after clinical suitability, payer/site access, and that year's access timing are applied.</p></div><div class="definition"><strong>Durable option</strong><p>A longer-duration wet AMD treatment choice, including gene therapies, long-interval biologics, higher-dose anti-VEGF, and sustained-delivery approaches.</p></div><div class="definition"><strong>${drug.shortName} treated eyes</strong><p>Modeled treatment courses assigned to ${drug.shortName} after durable-option use and competitor allocation. This is not market share.</p></div></div></section></main>`;
    function controls() {
      return `<div class="control"><label for="scenario">Scenario</label><select id="scenario"></select><small>Loads the starting assumption set.</small></div><div class="control"><label for="selectedYear">Selected year</label><select id="selectedYear"></select><small>Updates KPI and formula trace.</small></div><div class="control"><label for="activeEyes">US actively treated nAMD eyes</label><input id="activeEyes" type="number" step="10000"><small>Starting treated-eye denominator.</small></div><div class="control"><label for="incidentCases">Incident wet AMD cases per year</label><input id="incidentCases" type="number" step="5000"><small>Annual incident patient input.</small></div><div class="control"><label for="candidateShare">Mature high-burden pool considered</label><input id="candidateShare" type="number" step="0.01" min="0" max="1"><small>Post-validation source pool considered for durable-option use.</small></div><div class="control"><label for="productShare">${drug.shortName} allocation within durable options</label><input id="productShare" type="number" step="0.01" min="0" max="1"><small>Share of durable-option use assigned to ${drug.shortName}.</small></div><div class="control"><label for="hbAccess">HB branded eligible/access share</label><input id="hbAccess" type="number" step="0.01" min="0" max="1"><small>Clinical eligibility and access ceiling for the largest source pool.</small></div><div class="control"><label for="hbCapture">HB branded durable-option adoption</label><input id="hbCapture" type="number" step="0.01" min="0" max="1"><small>Mature durable-option use before product allocation.</small></div><div class="control"><label for="hbPrice">HB branded US net revenue per treated eye</label><input id="hbPrice" type="number" step="1000"><small>Scenario assumption, not a sourced product price.</small></div><div class="control"><label for="exUsFactor">Ex-US volume/access factor vs US</label><input id="exUsFactor" type="number" step="0.01" min="0"><small>Explicit non-US sales factor before price and uptake.</small></div><div class="control"><label for="exUsPrice">Ex-US price index vs US</label><input id="exUsPrice" type="number" step="0.01" min="0"><small>Modeled ex-US net revenue as a ratio to US net revenue.</small></div><div class="control"><label for="priceErosion">Annual price erosion after launch year 8</label><input id="priceErosion" type="number" step="0.005" min="0" max="1"><small>Post-peak annual net-price decline.</small></div>`;
    }
    function populateSelectors() {
      document.getElementById("scenario").innerHTML = Object.keys(SCENARIO_FACTORS).map(s => `<option value="${s}">${s}</option>`).join("");
      document.getElementById("selectedYear").innerHTML = YEARS.map(y => `<option value="${y}">${y}</option>`).join("");
    }
    function syncInputs() {
      const ids = { activeEyes:"active_eyes", incidentCases:"incident_cases", candidateShare:"validated_hb_candidate_share", productShare:"drug_durable_share", exUsFactor:"ex_us_factor", exUsPrice:"ex_us_price_index", priceErosion:"price_erosion" };
      for (const [id, key] of Object.entries(ids)) document.getElementById(id).value = assumptions[key];
      document.getElementById("hbAccess").value = assumptions.access["HB branded"];
      document.getElementById("hbCapture").value = assumptions.capture["HB branded"];
      document.getElementById("hbPrice").value = assumptions.price["HB branded"];
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
    }
    function drawChart() {
      const svg = document.getElementById("salesChart");
      const left=58, right=724, top=34, bottom=322;
      const values = YEARS.flatMap(y => [model.sales[y].world, model.sales[y].us, model.sales[y].exus]);
      const max = Math.max(...values, 1000) * 1.12;
      const x = y => left + (YEARS.indexOf(y)/(YEARS.length-1))*(right-left);
      const yy = v => bottom - (v/max)*(bottom-top);
      const path = key => YEARS.map(y => `${x(y).toFixed(1)},${yy(key(y)).toFixed(1)}`).join(" ");
      const ticks = [0,500,1000,2000,3000,4000,6000].filter(v => v <= max);
      const grid = ticks.map(t => `<line x1="${left}" y1="${yy(t).toFixed(1)}" x2="${right}" y2="${yy(t).toFixed(1)}" class="grid-line"/><text x="46" y="${(yy(t)+4).toFixed(1)}" text-anchor="end" class="axis-label">${t===0?"$0":"$"+(t/1000).toFixed(t >= 1000 ? 0 : 1)+"B"}</text>`).join("");
      const marks = [...new Set([drug.launchYear, drug.launchYear + 3, selectedYearValue, 2045].filter(y => y >= 2025 && y <= 2045))];
      svg.innerHTML = `${grid}<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}" class="axis"/><line x1="${left}" y1="${top}" x2="${left}" y2="${bottom}" class="axis"/><polyline points="${path(y=>model.sales[y].exus)}" class="line exus-line"/><polyline points="${path(y=>model.sales[y].us)}" class="line us-line"/><polyline points="${path(y=>model.sales[y].world)}" class="line world-line"/>${marks.map(y=>`<circle cx="${x(y).toFixed(1)}" cy="${yy(model.sales[y].world).toFixed(1)}" r="4.5" class="world-dot"/><text x="${(x(y)+8).toFixed(1)}" y="${(yy(model.sales[y].world)-8).toFixed(1)}" class="axis-label">${y}: ${fmtMoney(model.sales[y].world)}</text>`).join("")}<circle cx="${x(selectedYearValue).toFixed(1)}" cy="${yy(model.sales[selectedYearValue].world).toFixed(1)}" r="7" class="world-dot"/>${YEARS.filter(y=>[2025,2028,2030,2033,2036,2039,2042,2045].includes(y)).map(y=>`<text x="${x(y).toFixed(1)}" y="354" text-anchor="middle" class="axis-label">${y}</text>`).join("")}`;
    }
    function renderKpis() {
      const row = model.sales[selectedYearValue];
      const s = summary(model, drug);
      document.getElementById("kpi-world").textContent = fmtMoney(row.world);
      document.getElementById("kpi-world-note").textContent = `${selectedYearValue} model forecast value.`;
      document.getElementById("kpi-peak").textContent = fmtMoney(s.peak.world);
      document.getElementById("kpi-peak-note").textContent = `${s.peak.year} peak year in current scenario.`;
      document.getElementById("kpi-eyes").textContent = fmtEyes(row.treated);
      document.getElementById("kpi-scenario").textContent = activeScenario;
    }
    function renderTrace() {
      const hb = model.flows["HB branded"][selectedYearValue];
      const total = model.sales[selectedYearValue];
      const traces = [["A","Available source eyes",`Opening untreated pool ${fmtEyes(hb.opening)} + new inflow ${fmtEyes(hb.newClinicalInflow)} + fellow-eye conversions ${fmtEyes(hb.fellowConversions)} = ${fmtEyes(hb.available)} available source eyes.`],["B","Eligible and accessible eyes",`${fmtEyes(hb.available)} x ${fmtPct(hb.candidate)} considered x ${fmtPct(hb.peakAccess)} eligible/access share x ${fmtPct(hb.accessRamp)} annual access timing = ${fmtEyes(hb.accessible)} eligible and accessible eyes.`],["C",`${drug.shortName} treated eyes`,`${fmtEyes(hb.accessible)} x ${fmtPct(hb.peakDurable)} durable-option adoption x ${fmtPct(hb.captureRamp)} timing ramp x ${fmtPct(hb.productShare)} product allocation = ${fmtEyes(hb.treated)} treated eyes from the high-burden branded source.`],["D","US sales",`Across all source pools: ${fmtEyes(total.treated)} treated eyes convert to ${fmtMoney(total.us)} US sales after segment prices and annual price index.`],["E","Ex-US sales",`${fmtMoney(total.us)} US sales x ${assumptions.ex_us_factor.toFixed(2)} volume/access factor x ${assumptions.ex_us_price_index.toFixed(2)} price index x ${fmtPct(exusMult(assumptions, drug.launchYear, selectedYearValue))} uptake = ${fmtMoney(total.exus)} ex-US sales.`],["F","Worldwide sales",`${fmtMoney(total.us)} US sales + ${fmtMoney(total.exus)} ex-US sales = ${fmtMoney(total.world)} worldwide sales.`]];
      document.getElementById("formulaTrace").innerHTML = traces.map(t => `<div class="trace"><span class="badge">${t[0]}</span><div><strong>${t[1]}</strong><p>${t[2]}</p></div></div>`).join("");
    }
    function tableRow(label, values, formatter, klass="") { return `<tr><td class="${klass}">${label}</td>${YEARS.map(y => `<td>${formatter(values[y])}</td>`).join("")}</tr>`; }
    function segmentRows(seg) {
      const f = model.flows[seg];
      const get = key => Object.fromEntries(YEARS.map(y => [y, f[y][key]]));
      return [tableRow(`${seg}: opening untreated clinical pool`, get("opening"), fmtEyes, "metric-group"), tableRow(`${seg}: new clinical inflow`, get("newClinicalInflow"), fmtEyes), tableRow(`${seg}: fellow-eye conversions`, get("fellowConversions"), fmtEyes), tableRow(`${seg}: available source eyes`, get("available"), fmtEyes), tableRow(`${seg}: pool considered for durable-option use`, get("candidate"), fmtPct), tableRow(`${seg}: eligible and accessible eyes`, get("accessible"), fmtEyes), tableRow(`${seg}: durable-option use`, get("durableUse"), fmtEyes), tableRow(`${seg}: ${drug.shortName} treated eyes`, get("treated"), fmtEyes), tableRow(`${seg}: US sales`, get("usSales"), fmtMoney), tableRow(`${seg}: ending untreated clinical pool`, get("ending"), fmtEyes)].join("");
    }
    function renderTable() {
      const s = model.sales;
      const getSales = key => Object.fromEntries(YEARS.map(y => [y, s[y][key]]));
      let body = "";
      const view = document.getElementById("tableView").value;
      if (view === "summary") {
        body += tableRow("US treated eyes", getSales("treated"), fmtEyes, "metric-group") + tableRow("US sales", getSales("us"), fmtMoney) + tableRow("Ex-US sales", getSales("exus"), fmtMoney) + tableRow("Worldwide sales", getSales("world"), fmtMoney) + tableRow("Cumulative US treated eyes", getSales("cumulative"), fmtEyes) + tableRow("Cumulative penetration of active treated eyes", getSales("cumulativeActivePenetration"), fmtPct);
      } else if (view === "hb") body += segmentRows("HB branded");
      else body += SEGMENTS.map(segmentRows).join("");
      document.getElementById("calcTable").innerHTML = `<thead><tr><th>Calculation row</th>${YEARS.map(y => `<th>${y}</th>`).join("")}</tr></thead><tbody>${body}</tbody>`;
    }
    function renderAll() { model = compute(drug, assumptions, activeScenario); renderKpis(); drawChart(); renderTrace(); renderTable(); }
    populateSelectors(); syncInputs(); renderAll();
    document.getElementById("scenario").addEventListener("change", e => { activeScenario = e.target.value; assumptions = scenarioAssumptions(drug, activeScenario); syncInputs(); renderAll(); });
    document.getElementById("selectedYear").addEventListener("change", e => { selectedYearValue = Number(e.target.value); renderAll(); });
    document.getElementById("applyInputs").addEventListener("click", () => { readInputs(); renderAll(); });
    document.getElementById("resetScenario").addEventListener("click", () => { assumptions = scenarioAssumptions(drug, activeScenario); syncInputs(); renderAll(); });
    document.getElementById("tableView").addEventListener("change", renderTable);
    document.querySelectorAll("[data-jump]").forEach(button => button.addEventListener("click", e => document.querySelector(e.currentTarget.dataset.jump).scrollIntoView({ behavior:"smooth", block:"start" })));
  }
  function renderLanding() {
    document.title = "Wet AMD Pipeline Sales Forecast Models";
    const cards = Object.values(DRUGS).map(drug => {
      const model = compute(drug, scenarioAssumptions(drug, "Base"), "Base");
      const s = summary(model, drug);
      return `<article class="landing-card" style="--company-primary:${drug.primaryColor}"><strong>${drug.shortName}</strong><p>${drug.company}</p><p>${drug.modality}. Launch modeled from ${drug.launchYear}; peak worldwide sales ${fmtMoney(s.peak.world)} in ${s.peak.year}.</p><div class="links"><a href="${drug.slug}_base_case_sales_forecast_infographic.html">Infographic</a><a href="${drug.slug}_interactive_model_calculator.html">Calculator</a></div></article>`;
    }).join("");
    document.body.innerHTML = `<main class="page"><header class="landing-header"><div><h1 class="landing-title" aria-label="Wet AMD Pipeline Sales Forecast Models"><span>Wet AMD Pipeline Sales</span><span>Forecast Models</span></h1><p class="deck">Public-facing base-case forecast pages and interactive calculators for wet AMD pipeline programs, using a shared source-of-business model and product-specific assumptions.</p></div><aside class="meta"><div><strong>Model set</strong> Six pipeline programs with paired infographic and calculator pages.</div><div><strong>Traceability</strong> Assumptions, formulas, and program context are visible in each page.</div></aside></header><nav class="nav-tools" aria-label="Forecast evidence"><a href="wet_amd_public_sales_forecast_evidence.html">Public forecast evidence</a></nav><div class="landing-grid">${cards}<article class="landing-card" style="--company-primary:#109890"><strong>Ixo-vec</strong><p>Adverum / Lilly transaction context</p><p>Existing model pages retained as the original format reference.</p><div class="links"><a href="ixo_vec_base_case_sales_forecast_infographic.html">Infographic</a><a href="ixo_vec_interactive_model_calculator.html">Calculator</a></div></article></div></main>`;
  }
  const config = window.PIPELINE_FORECAST_PAGE || { pageType:"landing" };
  if (config.pageType === "landing") renderLanding();
  else {
    const drug = DRUGS[config.drugId];
    if (!drug) throw new Error(`Unknown drug id: ${config.drugId}`);
    if (config.pageType === "calculator") renderCalculator(drug);
    else renderInfographic(drug);
  }
})();
