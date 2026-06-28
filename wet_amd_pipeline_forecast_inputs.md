# Wet AMD Pipeline Forecast Input Recommendations

Date prepared: 2026-06-28

This file translates the existing ixo-vec source-of-business forecast model into base-case inputs for other wet AMD pipeline programs represented in `C:\Users\Justin\Desktop\retina-data`. The values below are model-ready recommendations, not sourced facts. They should be treated as starting assumptions for sensitivity analysis.

## Pipeline Treatments Identified

I excluded ixo-vec because it is the existing forecast target. I also excluded marketed products and biosimilars such as Lucentis, Vabysmo, Susvimo, Avastin off-label, Beovu, Eylea/Eylea HD, and ranibizumab/aflibercept biosimilars.

| Program | Company | Modality and route | Local support |
|---|---|---|---|
| 4D-150 | 4D Molecular Therapeutics / 4DMT | Intravitreal R100 AAV gene therapy carrying aflibercept expression plus VEGF-C RNAi. | `C:\Users\Justin\Desktop\retina-data\programs\4d-150.md:17`; `C:\Users\Justin\Desktop\retina-data\topics\4d-150-retinal-gene-therapy-evidence.md:13,25`; `C:\Users\Justin\Desktop\retina-data\_data\clinicaltrials_updates.json` records NCT05197270, NCT06864988, NCT07064759. |
| AXPAXLI / OTX-TKI | Ocular Therapeutix | Bioresorbable intravitreal PEG hydrogel axitinib implant. | `C:\Users\Justin\Desktop\retina-data\topics\ocular-therapeutix.md:15,28,47,65-66`; CT.gov records NCT06223958, NCT06495918, NCT07516132 in `clinicaltrials_updates.json`. |
| CLS-AX | Clearside Biomedical | Suprachoroidal axitinib injectable suspension via SCS Microinjector. | `C:\Users\Justin\Desktop\retina-data\topics\cls-ax-evidence-map.md:15,35,40`; `C:\Users\Justin\Desktop\retina-data\topics\cls-ax-suprachoroidal-axitinib-wet-amd.md:80,101,107-109`; CT.gov records NCT04626128, NCT05891548. |
| DURAVYU / EYP-1901 | EyePoint Pharmaceuticals | Intravitreal bioerodible insert delivering vorolanib. | `C:\Users\Justin\Desktop\retina-data\_data\company_profiles.json:82-93`; `C:\Users\Justin\Desktop\retina-data\_data\company_press_releases.yml:64-71,316-324,424-431`; CT.gov records NCT06668064, NCT06683742. |
| RGX-314 / ABBV-RGX-314 / surabgene lomparvovec | REGENXBIO / AbbVie | AAV8 anti-VEGF Fab gene therapy, subretinal and suprachoroidal delivery routes. | `C:\Users\Justin\Desktop\retina-data\topics\rgx-314-evidence-map.md:26,40-54`; `C:\Users\Justin\Desktop\retina-data\topics\rgx-314-subretinal-suprachoroidal-wet-amd.md:13,25`; CT.gov records NCT04704921, NCT05407636, NCT07007065. |

## How To Use These Inputs

The current interactive ixo-vec calculator models commercial launch from 2029. For a comparable normalized forecast, use 2029 as "launch year 1" for each product and apply the base-case values below. For calendar-specific forecasts, add a `launch_year` input and shift the model's 2029 ramp curves to the recommended launch year in the table.

Plain-language variable definitions:

| Variable | Meaning |
|---|---|
| `active_eyes` | US wet AMD eyes currently receiving treatment; this is the starting treated-eye denominator. |
| `incident_cases` | New wet AMD patients per year before converting patients to treated eyes. |
| `treat_init` | Share of new wet AMD patients who start treatment within a year. |
| `eyes_per_patient` | Converts treated patients into treated eyes. |
| `high_burden_share` | Share of actively treated eyes with high treatment burden. |
| `branded_share` | Share of treated eyes sourced from branded anti-VEGF use rather than low-cost/off-label use. |
| `lower_burden_share` | Expansion beyond the high-burden core into broader lower-burden branded-source eyes. |
| `refractory_share` | Early launch share of the high-burden pool considered for the new treatment. |
| `validated_hb_candidate_share` | Mature share of the high-burden pool considered clinically and commercially plausible. |
| `drug_durable_share` | Product allocation within the durable-treatment class; this is the ixo-vec model's `ixovec_durable_share` renamed for other drugs. |
| `clinical_*` | Share of each source pool clinically suitable for the treatment. |
| `access_*` | Share reachable after payer, site, and logistical access constraints. |
| `capture_*` | Durable-option adoption within accessible eyes before assigning product-specific share. |
| `price_*` | US net revenue per treated eye per year or treatment course for that source segment. |
| `ex_us_factor` | Non-US volume/access contribution as a multiple of US sales before price and uptake adjustments. |
| `ex_us_price_index` | Ex-US net price as a ratio to US net price. |
| `ex_us_delay_years` | Delay between US commercial launch and ex-US contribution. |
| `price_erosion` | Annual post-peak net-price decline. |

## Market-Wide Inputs Held Constant

These stay aligned to the ixo-vec base case so product differences do not get confounded with market-size differences.

| Input | Base value |
|---|---:|
| `active_eyes` | 1,150,000 |
| `incident_cases` | 200,000 |
| `treat_init` | 0.78 |
| `eyes_per_patient` | 1.15 |
| `high_burden_share` | 0.20 |
| `incident_hb_share` | 0.10 |
| `branded_share` | 0.62 |
| `mortality_attrition` | 0.03 |
| `clinical_loss` | 0.015 |
| `competitive_loss` | 0.015 |
| `fellow_conversion` | 0.10 |
| `fellow_at_risk_share` | 0.35 |

## Base-Case Product Inputs

| Program | Launch year | `lower_burden_share` | `refractory_share` | `validated_hb_candidate_share` | `drug_durable_share` | `ex_us_factor` | `ex_us_price_index` | `ex_us_delay_years` | `price_erosion` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| AXPAXLI / OTX-TKI | 2028 | 0.035 | 0.25 | 0.80 | 0.40 | 0.70 | 0.60 | 2 | 0.040 |
| DURAVYU / EYP-1901 | 2028 | 0.025 | 0.22 | 0.75 | 0.30 | 0.65 | 0.60 | 2 | 0.040 |
| RGX-314 / ABBV-RGX-314 | 2029 | 0.005 | 0.18 | 0.60 | 0.25 | 0.75 | 0.50 | 2 | 0.035 |
| 4D-150 | 2030 | 0.010 | 0.18 | 0.70 | 0.30 | 0.667 | 0.50 | 2 | 0.030 |
| CLS-AX | 2031 | 0.015 | 0.20 | 0.55 | 0.15 | 0.55 | 0.60 | 3 | 0.040 |

## Segment Inputs

| Program | `clinical_hb_branded` | `clinical_hb_low_cost` | `clinical_lower_burden` | `access_hb_branded` | `access_hb_low_cost` | `access_lower_burden` | `capture_hb_branded` | `capture_hb_low_cost` | `capture_lower_burden` | `price_hb_branded` | `price_hb_low_cost` | `price_lower_burden` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| AXPAXLI / OTX-TKI | 0.90 | 0.55 | 0.35 | 0.90 | 0.80 | 0.55 | 0.75 | 0.45 | 0.30 | 22000 | 15000 | 20000 |
| DURAVYU / EYP-1901 | 0.85 | 0.50 | 0.30 | 0.85 | 0.75 | 0.50 | 0.70 | 0.40 | 0.25 | 20000 | 14000 | 18000 |
| RGX-314 / ABBV-RGX-314 | 0.75 | 0.20 | 0.08 | 0.70 | 0.55 | 0.20 | 0.60 | 0.20 | 0.10 | 95000 | 55000 | 75000 |
| 4D-150 | 0.80 | 0.25 | 0.10 | 0.85 | 0.70 | 0.30 | 0.70 | 0.25 | 0.15 | 85000 | 50000 | 70000 |
| CLS-AX | 0.80 | 0.45 | 0.20 | 0.75 | 0.65 | 0.40 | 0.60 | 0.35 | 0.20 | 18000 | 12000 | 16000 |

## Rationale By Program

### AXPAXLI / OTX-TKI

Use the broadest candidate pool and highest durable-class share among the non-gene-therapy programs. The local topic page describes a sustained-release intravitreal hydrogel implant administered by 25G needle, with 8-9 month bioresorption, 89% anti-VEGF burden reduction at Week 52, and Phase 3 development under SOL-1 and SOL-R. Because this is an intravitreal implant rather than gene therapy, use lower net revenue per treated eye than ixo-vec but broader lower-burden expansion and stronger low-cost-source access.

### DURAVYU / EYP-1901

Use a similar but slightly more conservative profile than AXPAXLI. DURAVYU has active Phase 3 LUGANO/LUCIA wet AMD programs and Phase 2 data, but the local evidence package supports a durable insert thesis rather than clear superiority. Use broad access and moderate-high durable-class adoption, with annual/course net price below gene therapy and close to other durable TKI approaches.

### RGX-314 / ABBV-RGX-314

Use high gene-therapy pricing but lower access and candidate breadth than intravitreal TKI implants. The local evidence map describes subretinal and suprachoroidal routes for an AAV8 anti-VEGF Fab gene therapy. Route complexity, steroid/monitoring requirements, and coexistence of subretinal and suprachoroidal evidence justify lower access and lower lower-burden expansion than intravitreal-office products, despite AbbVie/Regenxbio development scale.

### 4D-150

Use a gene-therapy price and access profile between ixo-vec and RGX-314. The local archive presents 4D-150 as an intravitreal R100 AAV program with aflibercept expression plus VEGF-C RNAi, and Phase 3 nAMD trials are present in the local CT.gov data. Intravitreal delivery supports better access than subretinal gene therapy, but AAV/steroid monitoring and durable-class competition keep product share below the current ixo-vec base case.

### CLS-AX

Use the narrowest durable-class share and later launch. The local evidence map shows Phase 2 ODYSSEY completion and Phase 3 design, with suprachoroidal 1 mg dosing at 12-24 week intervals. It is an in-office approach, but requires a specialized suprachoroidal delivery workflow and currently has less late-stage evidence than AXPAXLI, DURAVYU, RGX-314, or 4D-150. Price should be below gene therapy and slightly below the more advanced intravitreal TKI implants.

## Sensitivity Guidance

The first sensitivity run should not change market-wide denominators. Instead vary these drug-specific levers:

| Lever | Bear direction | Bull direction |
|---|---|---|
| `validated_hb_candidate_share` | Reduce by 15-25 points if label or safety limits use to persistent high-burden patients. | Increase by 10-15 points if pivotal data support broad durable substitution. |
| `drug_durable_share` | Reduce by 10-15 points for crowded launch timing or weaker differentiation. | Increase by 10 points for first-to-market or clearly superior burden reduction. |
| `access_*` | Reduce for subretinal surgery, steroid monitoring, site training, or payer step edits. | Increase for routine intravitreal administration and strong payer economics. |
| `price_*` | Reduce for repeat TKI implants or biosimilar-like payer pressure. | Increase for one-time gene therapy with strong anti-VEGF offset economics. |
| `lower_burden_share` | Set near zero if use is limited to refractory or persistent active disease. | Increase if the product can replace branded anti-VEGF in stable patients. |

