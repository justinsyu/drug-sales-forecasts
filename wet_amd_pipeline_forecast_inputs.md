# Wet AMD Six-Program Forecast Inputs

Date prepared: 2026-06-29

## Source Of Truth

The canonical model input file is `assets/data/wet_amd_forecast_programs.json`.

The browser calculators, infographics, and evidence page now read from that JSON file through `assets/wet_amd_forecast_engine.js`. The CSV file is a base-case snapshot for review, not a separate source of assumptions.

## Common Schema

All six programs use the same wet AMD input concepts:

| Input | Plain-language meaning |
|---|---|
| `active_eyes` | US wet AMD eyes currently receiving treatment. This is the starting treated-eye denominator. |
| `incident_cases` | New wet AMD patients per year before converting patients to treated eyes. |
| `treat_init` | Share of new wet AMD patients assumed to start treatment within a year. |
| `eyes_per_patient` | Conversion from treated patients to treated eyes. |
| `high_burden_share` | Share of actively treated eyes with high treatment burden. |
| `branded_share` | Share of treated eyes sourced from branded anti-VEGF use rather than low-cost/off-label use. |
| `lower_burden_share` | Product-specific expansion beyond the high-burden core into broader lower-burden branded-source eyes. |
| `refractory_share` | Early launch share of the high-burden pool considered for the new durable option. |
| `validated_hb_candidate_share` | Mature share of the high-burden pool considered clinically and commercially plausible. |
| `drug_durable_share` | Product allocation within modeled durable-option use. This is not market share. |
| `clinical_*` | Share of each source pool clinically suitable for the treatment. |
| `access_*` | Share reachable after payer, site, and logistical access constraints. |
| `capture_*` | Durable-option adoption within accessible eyes before product-specific allocation. |
| `price_*` | US net revenue per treatment course or treated-eye-year, depending on product mechanics. |
| `ex_us_factor` | Non-US volume/access contribution as a multiple of US sales before price and uptake adjustments. |
| `ex_us_price_index` | Ex-US net price as a ratio to US net price. |
| `ex_us_delay_years` | Delay between US commercial launch and ex-US contribution. |
| `price_erosion` | Annual post-peak net-price decline. |

## Treatment Units

The framework separates:

| Unit | Meaning |
|---|---|
| New starts | Eyes newly assigned to the program in a given year after durable-option adoption and product allocation. |
| Treated-eye-years | Annualized time on therapy for repeat-course products. This includes continuing treated eyes plus partial-year new starts. |
| Treatment courses | One-time courses for gene therapies, or repeat courses derived from treated-eye-years and retreatment interval for repeatable products. |
| Worldwide sales | US sales plus explicit ex-US sales after delay, ex-US price index, and uptake timing. |

## Base-Case Product Inputs

| Program | Mechanics | Launch | Revenue unit | Product-specific rationale |
|---|---:|---:|---|---|
| Ixo-vec | Locked standalone gene-therapy baseline | 2029 | Treatment course | Represented in the shared schema for documentation and parity. The standalone Ixo-vec model remains unchanged. |
| AXPAXLI / OTX-TKI | Repeat-course intravitreal TKI implant | 2028 | Treated-eye-year | Positive SOL-1 and planned fourth-quarter 2026 NDA support a broad durable TKI profile, but repeat-course stock effects require lower product allocation and annual revenue than one-time gene therapy. |
| DURAVYU / EYP-1901 | Repeat-course intravitreal TKI insert | 2028 | Treated-eye-year | LUGANO and LUCIA support a six-month repeat-course model. Allocation remains below AXPAXLI until pivotal data are public. |
| RGX-314 / ABBV-RGX-314 | One-time gene therapy | 2029 | Treatment course | High upfront price is offset by narrower subretinal access and route-specific site constraints, while AbbVie/Regenxbio scale supports meaningful adoption if pivotal data are positive. |
| 4D-150 | One-time intravitreal gene therapy | 2029 | Treatment course | Intravitreal delivery and dual anti-angiogenic payload support broader access than subretinal gene therapy, but AAV monitoring, payer friction, and 2027 readout risk constrain allocation. |
| CLS-AX | Repeat-course suprachoroidal TKI | 2031 | Treated-eye-year | Modeled as a conservative reactivation case because Phase 3 continuity depends on post-bankruptcy asset ownership and restart decisions. |

## Base-Case Output Check

| Program | Peak worldwide sales | Peak year | Unit shown at peak |
|---|---:|---:|---:|
| Ixo-vec | $1.71B | 2034 | Locked standalone model |
| AXPAXLI / OTX-TKI | $1.33B | 2038 | 53.5k treated-eye-years |
| DURAVYU / EYP-1901 | $1.68B | 2037 | 55.6k treated-eye-years |
| RGX-314 / ABBV-RGX-314 | $870M | 2036 | 6.6k treatment courses |
| 4D-150 | $2.28B | 2034 | 19.4k treatment courses |
| CLS-AX | $187M | 2040 | 9.4k treated-eye-years |

## Evidence Notes

Product-specific assumptions are supported by the evidence links and screenshots referenced in `assets/data/wet_amd_forecast_programs.json`.

Key current-source anchors include:

| Program | Current-source anchor |
|---|---|
| AXPAXLI | FDA alignment for an NDA submission planned in the fourth quarter of 2026, SOL-1 positive Week 52 data, and SOL-R repeat-dosing context. |
| DURAVYU | Phase 3 LUGANO and LUCIA enrollment and mid-2026 topline timing, with six-month dosing. |
| RGX-314 | Pivotal subretinal wet AMD trials, Q4 2026 topline timing, and 2027 regulatory-submission expectation. |
| 4D-150 | 4FRONT-1 and 4FRONT-2 Phase 3 enrollment completion, intravitreal delivery, and 2027 topline timing. |
| CLS-AX | ODYSSEY Phase 2b results, Phase 3 alignment, and subsequent sale/restart uncertainty. |

## Modeling Caveats

The base cases are if-approved commercial forecasts, not probability-weighted forecasts and not rNPV estimates.

The shared schema makes the programs comparable. It does not imply that assumptions are shared. Values may overlap only where the same market evidence or reasoning supports the overlap.
