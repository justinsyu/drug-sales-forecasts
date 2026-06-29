(function (global) {
  "use strict";

  function buildYears(config) {
    const start = Number(config && config.start) || 2025;
    const end = Number(config && config.end) || 2045;
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function num(value) {
    return Number(value) || 0;
  }

  function segmentIds(data) {
    return (data.segments || []).map(segment => segment.id);
  }

  function scenarioAssumptions(data, program, scenarioName) {
    if (program.lockedBaseline) {
      const scenario = program.assumptionScenarios && program.assumptionScenarios[scenarioName];
      return clone(scenario || (program.assumptionScenarios && program.assumptionScenarios.Base) || {});
    }
    const base = clone(program.assumptions || {});
    const factors = (data.scenarioFactors && data.scenarioFactors[scenarioName]) || (data.scenarioFactors && data.scenarioFactors.Base) || {};
    const segments = segmentIds(data);

    base.active_eyes = Math.round(num(base.active_eyes) * (factors.market == null ? 1 : factors.market));
    base.incident_cases = Math.round(num(base.incident_cases) * (factors.market == null ? 1 : factors.market));
    base.validated_hb_candidate_share = clamp(num(base.validated_hb_candidate_share) + num(factors.candidate), 0, 1);
    base.drug_durable_share = clamp(num(base.drug_durable_share) + num(factors.share), 0, 1);
    base.ex_us_factor = Math.max(0, num(base.ex_us_factor) * (factors.exus == null ? 1 : factors.exus));
    base.price_erosion = Math.max(0, num(base.price_erosion) + num(factors.erosion));

    base.clinical = base.clinical || {};
    base.access = base.access || {};
    base.capture = base.capture || {};
    base.price = base.price || {};

    for (const segment of segments) {
      base.access[segment] = clamp(num(base.access[segment]) + num(factors.access), 0, 1);
      base.capture[segment] = clamp(num(base.capture[segment]) + num(factors.capture), 0, 1);
      base.price[segment] = Math.round(num(base.price[segment]) * (factors.price == null ? 1 : factors.price) / 100) * 100;
    }

    if (program.mechanics && base.mechanics == null) base.mechanics = clone(program.mechanics);
    if (base.mechanics && factors.persistence) {
      base.mechanics.annualPersistence = clamp(num(base.mechanics.annualPersistence) + num(factors.persistence), 0, 1);
    }
    return base;
  }

  function sourceValues(a, segment) {
    const lowCost = 1 - num(a.branded_share);
    let initial;
    let inflow;
    if (segment === "HB branded") {
      initial = num(a.active_eyes) * num(a.high_burden_share) * num(a.branded_share) * num(a.clinical && a.clinical[segment]);
      inflow = num(a.incident_cases) * num(a.treat_init) * num(a.eyes_per_patient) * num(a.incident_hb_share) * num(a.branded_share) * num(a.clinical && a.clinical[segment]);
    } else if (segment === "HB low-cost") {
      initial = num(a.active_eyes) * num(a.high_burden_share) * lowCost * num(a.clinical && a.clinical[segment]);
      inflow = num(a.incident_cases) * num(a.treat_init) * num(a.eyes_per_patient) * num(a.incident_hb_share) * lowCost * num(a.clinical && a.clinical[segment]);
    } else {
      initial = num(a.active_eyes) * (1 - num(a.high_burden_share)) * num(a.branded_share) * num(a.lower_burden_share) * num(a.clinical && a.clinical[segment]);
      inflow = num(a.incident_cases) * num(a.treat_init) * num(a.eyes_per_patient) * (1 - num(a.incident_hb_share)) * num(a.branded_share) * num(a.lower_burden_share) * num(a.clinical && a.clinical[segment]);
    }
    return {
      initial,
      inflow,
      fellowInitial: initial / num(a.eyes_per_patient) * num(a.fellow_at_risk_share)
    };
  }

  function launchRamp(launchYear, year, values, after) {
    const offset = year - launchYear;
    if (offset < 0) return 0;
    if (Object.prototype.hasOwnProperty.call(values, offset)) return values[offset];
    return after;
  }

  function accessMult(scenarioName, launchYear, year) {
    const adjust = scenarioName === "Bull" ? 0.05 : scenarioName === "Bear" ? -0.10 : scenarioName === "SEC Stress" ? 0.03 : 0;
    const base = launchRamp(launchYear, year, { 0: 0.70, 1: 0.80, 2: 0.90, 3: 0.95, 4: 0.98, 5: 1, 6: 1, 7: 1 }, Math.max(0.85, 1 - 0.01 * (year - (launchYear + 7))));
    return clamp(base + adjust, 0, 1);
  }

  function captureMult(scenarioName, launchYear, segment, year) {
    const segmentFactor = segment === "HB low-cost" ? 0.5 : segment === "Lower-burden branded" ? 0.35 : 1;
    const base = launchRamp(launchYear, year, { 0: 0.15, 1: 0.25, 2: 0.40, 3: 0.70, 4: 0.85, 5: 0.95, 6: 1, 7: 1 }, Math.max(0.55, 1 - 0.04 * (year - (launchYear + 7))));
    const adjust = scenarioName === "Bull" ? 0.10 : scenarioName === "Bear" ? -0.10 : scenarioName === "SEC Stress" ? 0.06 : 0;
    return clamp(base * segmentFactor + adjust, 0, 1);
  }

  function candidateMult(a, launchYear, segment, year) {
    if (year < launchYear) return 0;
    const offset = year - launchYear;
    if (segment === "Lower-burden branded") {
      const curve = { 0: 0, 1: 0, 2: 0.10, 3: 0.25, 4: 0.50, 5: 0.75, 6: 1, 7: 1 };
      return num(a.lower_burden_share) * (curve[offset] == null ? 1 : curve[offset]);
    }
    const target = num(a.validated_hb_candidate_share);
    const launch = num(a.refractory_share);
    const curve = {
      0: launch,
      1: launch,
      2: launch,
      3: launch + 0.35 * (target - launch),
      4: launch + 0.70 * (target - launch),
      5: target,
      6: target,
      7: target
    };
    const value = curve[offset] == null ? target : curve[offset];
    return segment === "HB low-cost" ? value * 0.5 : value;
  }

  function priceIdx(a, launchYear, year) {
    if (year < launchYear) return 0;
    const erosionStart = launchYear + 7;
    return year <= erosionStart ? 1 : Math.pow(1 - num(a.price_erosion), year - erosionStart);
  }

  function exusMult(a, launchYear, year) {
    const start = launchYear + num(a.ex_us_delay_years);
    if (year < start) return 0;
    const ramp = { 0: 0.25, 1: 0.40, 2: 0.55, 3: 0.70, 4: 0.85 };
    return ramp[year - start] == null ? 1 : ramp[year - start];
  }

  function defaultMechanics(program, a) {
    return Object.assign({
      revenueUnit: program.mechanicType === "repeat_course" ? "treated_eye_year" : "treatment_course",
      durabilitySuccess: 1,
      durabilityFailureReturnRate: 0,
      rescueAntiVegfShare: 0,
      annualPersistence: 0,
      annualDiscontinuation: 0,
      switchBackShare: 0,
      retreatmentIntervalMonths: 12,
      newCourseYearFraction: 1,
      workflowFriction: 0
    }, program.mechanics || {}, a.mechanics || {});
  }

  function compute(data, program, assumptions, scenarioName) {
    if (program.lockedBaseline) {
      return null;
    }

    const years = buildYears(data.years);
    const segments = segmentIds(data);
    const a = assumptions;
    const mechanics = defaultMechanics(program, a);
    const sales = Object.fromEntries(years.map(year => [year, {
      treated: 0,
      treatedEyeYears: 0,
      treatmentCourses: 0,
      durableSuccessEyes: 0,
      durabilityFailureEyes: 0,
      rescueAntiVegfEyes: 0,
      us: 0,
      exus: 0,
      world: 0,
      cumulative: 0,
      cumulativeActivePenetration: 0,
      cumulativeInitialPoolPenetration: 0
    }]));
    const flows = {};
    let initialTotal = 0;

    for (const segment of segments) {
      flows[segment] = {};
      const source = sourceValues(a, segment);
      let opening = source.initial;
      let fellowOpening = source.fellowInitial;
      let persistentOpening = 0;
      initialTotal += source.initial;

      for (const year of years) {
        const active = year >= program.launchYear;
        const newClinicalInflow = active ? source.inflow : 0;
        const newFellowAtRisk = active ? newClinicalInflow / num(a.eyes_per_patient) * num(a.fellow_at_risk_share) : 0;
        const fellowConversions = active ? Math.min(fellowOpening + newFellowAtRisk, (fellowOpening + newFellowAtRisk) * num(a.fellow_conversion)) : 0;
        const discontinuationReturn = active && program.mechanicType === "repeat_course"
          ? persistentOpening * (1 - num(mechanics.annualPersistence)) * num(mechanics.switchBackShare)
          : 0;
        const available = opening + newClinicalInflow + fellowConversions + discontinuationReturn;
        const candidate = candidateMult(a, program.launchYear, segment, year);
        const accessRamp = accessMult(scenarioName, program.launchYear, year);
        const accessible = available * candidate * num(a.access && a.access[segment]) * accessRamp;
        const captureRamp = captureMult(scenarioName, program.launchYear, segment, year);
        const durableUse = accessible * num(a.capture && a.capture[segment]) * captureRamp;
        const newTreated = Math.min(available, durableUse * num(a.drug_durable_share));
        const attritionRate = active ? num(a.mortality_attrition) + num(a.clinical_loss) + num(a.competitive_loss) : 0;
        const durabilityFailureEyes = program.mechanicType === "one_time" ? newTreated * (1 - num(mechanics.durabilitySuccess)) : 0;
        const durabilityFailureReturn = durabilityFailureEyes * num(mechanics.durabilityFailureReturnRate);
        const rescueAntiVegfEyes = durabilityFailureEyes * num(mechanics.rescueAntiVegfShare);
        const attrition = Math.max(0, (available - newTreated) * attritionRate);
        const ending = Math.max(0, available - newTreated - attrition + durabilityFailureReturn);
        const fellowEnding = Math.max(0, fellowOpening + newFellowAtRisk - fellowConversions - ((fellowOpening + newFellowAtRisk - fellowConversions) * attritionRate));

        const continuedTreatedEyes = program.mechanicType === "repeat_course" && active ? persistentOpening * num(mechanics.annualPersistence) : 0;
        const treatedEyeYears = program.mechanicType === "repeat_course"
          ? continuedTreatedEyes + newTreated * num(mechanics.newCourseYearFraction)
          : newTreated;
        const treatmentCourses = program.mechanicType === "repeat_course"
          ? treatedEyeYears * (12 / Math.max(1, num(mechanics.retreatmentIntervalMonths)))
          : newTreated;
        const revenueUnits = mechanics.revenueUnit === "treatment_course" ? treatmentCourses : treatedEyeYears;
        const usSales = revenueUnits * num(a.price && a.price[segment]) * priceIdx(a, program.launchYear, year) / 1000000;
        const persistentEnding = program.mechanicType === "repeat_course" ? continuedTreatedEyes + newTreated : 0;

        flows[segment][year] = {
          opening,
          newClinicalInflow,
          fellowOpening,
          newFellowAtRisk,
          fellowConversions,
          discontinuationReturn,
          available,
          candidate,
          peakAccess: num(a.access && a.access[segment]),
          accessRamp,
          accessible,
          peakDurable: num(a.capture && a.capture[segment]),
          captureRamp,
          productShare: num(a.drug_durable_share),
          durableUse,
          treated: newTreated,
          continuedTreatedEyes,
          treatedEyeYears,
          treatmentCourses,
          durableSuccessEyes: program.mechanicType === "one_time" ? newTreated * num(mechanics.durabilitySuccess) : 0,
          durabilityFailureEyes,
          rescueAntiVegfEyes,
          attritionRate,
          attrition,
          ending,
          fellowEnding,
          persistentOpening,
          persistentEnding,
          price: num(a.price && a.price[segment]),
          priceIndex: priceIdx(a, program.launchYear, year),
          usSales
        };

        opening = ending;
        fellowOpening = fellowEnding;
        persistentOpening = persistentEnding;
        sales[year].treated += newTreated;
        sales[year].treatedEyeYears += treatedEyeYears;
        sales[year].treatmentCourses += treatmentCourses;
        sales[year].durableSuccessEyes += flows[segment][year].durableSuccessEyes;
        sales[year].durabilityFailureEyes += durabilityFailureEyes;
        sales[year].rescueAntiVegfEyes += rescueAntiVegfEyes;
        sales[year].us += usSales;
      }
    }

    let cumulative = 0;
    for (const year of years) {
      const exus = sales[year].us * num(a.ex_us_factor) * num(a.ex_us_price_index) * exusMult(a, program.launchYear, year);
      cumulative += sales[year].treated;
      sales[year].exus = exus;
      sales[year].world = sales[year].us + exus;
      sales[year].cumulative = cumulative;
      sales[year].cumulativeActivePenetration = num(a.active_eyes) ? cumulative / num(a.active_eyes) : 0;
      sales[year].cumulativeInitialPoolPenetration = initialTotal ? cumulative / initialTotal : 0;
    }

    return { sales, flows, initialTotal, mechanics };
  }

  function summary(data, model, program) {
    if (program.lockedBaseline) {
      const locked = program.lockedOutputs || {};
      return {
        peak: { year: locked.peakYear, world: locked.peakWorldwideSalesM, treated: locked.selectedUsTreatedEyes || 0 },
        firstB: locked.firstYearAbove1B ? { year: locked.firstYearAbove1B } : null,
        selectedYear: locked.selectedYear || 2036,
        selected: {
          treated: locked.selectedUsTreatedEyes || 0,
          us: locked.selectedUsSalesM || 0,
          exus: locked.selectedExUsSalesM || 0,
          world: locked.selectedWorldwideSalesM || 0
        }
      };
    }
    const years = buildYears(data.years);
    const rows = years.map(year => ({ year, ...model.sales[year] }));
    const peak = rows.reduce((a, b) => b.world > a.world ? b : a, rows[0]);
    const firstB = rows.find(row => row.world >= 1000) || null;
    const selectedYear = Math.min(years[years.length - 1], program.launchYear + 7);
    return { peak, firstB, selectedYear, selected: model.sales[selectedYear] };
  }

  global.WetAmdForecastEngine = {
    buildYears,
    scenarioAssumptions,
    compute,
    summary,
    sourceValues,
    accessMult,
    captureMult,
    candidateMult,
    priceIdx,
    exusMult
  };
})(window);
