import { serviceCities } from "./site-data";

export type CalculatorInput = {
  pincode: string;
  monthlyBill: number;
};

export type CalculatorResult = {
  city: string;
  state: string;
  serviceable: boolean;
  systemSizeKw: number;
  roofAreaSqft: number;
  monthlySavings: number;
  yearlySavings: number;
  lifetimeSavings: number;
  estimatedCost: number;
  subsidy: number;
  emi: number;
  co2MitigatedKg: number;
  treesEquivalent: number;
  distanceEquivalentKm: number;
};

const tariffPerUnit = 8;
const generationPerKwPerMonth = 120;
const roofAreaPerKw = 100;
const costPerKw = 62000;
const annualInflation = 0.03;
const annualDegradation = 0.01;

export function getServiceLocation(pincode: string) {
  return serviceCities.find((entry) => entry.pincodes.includes(pincode));
}

export function isValidPincode(pincode: string) {
  return /^\d{6}$/.test(pincode);
}

export function calculateSolarSavings(input: CalculatorInput): CalculatorResult {
  const location = getServiceLocation(input.pincode);
  const clampedBill = Math.min(Math.max(input.monthlyBill, 500), 1000000);
  const monthlyUnits = clampedBill / tariffPerUnit;
  const rawSystemSize = monthlyUnits / generationPerKwPerMonth;
  const systemSizeKw = roundTo(rawSystemSize, 1);
  const monthlySavings = Math.round(Math.min(clampedBill * 0.9, systemSizeKw * generationPerKwPerMonth * tariffPerUnit));
  const yearlySavings = monthlySavings * 12;
  const lifetimeSavings = projectLifetimeSavings(yearlySavings);
  const estimatedCost = Math.round(systemSizeKw * costPerKw);
  const subsidy = getResidentialSubsidy(systemSizeKw);
  const emi = Math.max(0, Math.round((estimatedCost - subsidy) / 60));

  return {
    city: location?.city ?? "Not serviceable yet",
    state: location?.state ?? "Coming soon",
    serviceable: Boolean(location),
    systemSizeKw,
    roofAreaSqft: Math.ceil(systemSizeKw * roofAreaPerKw),
    monthlySavings,
    yearlySavings,
    lifetimeSavings,
    estimatedCost,
    subsidy,
    emi,
    co2MitigatedKg: Math.round(systemSizeKw * 1440 * 0.82),
    treesEquivalent: Math.round(systemSizeKw * 15),
    distanceEquivalentKm: Math.round(systemSizeKw * 4800),
  };
}

function projectLifetimeSavings(firstYearSavings: number) {
  let total = 0;
  let annualSavings = firstYearSavings;

  for (let year = 1; year <= 25; year += 1) {
    total += annualSavings;
    annualSavings *= 1 + annualInflation - annualDegradation;
  }

  return Math.round(total);
}

function getResidentialSubsidy(systemSizeKw: number) {
  if (systemSizeKw < 1) return 0;
  if (systemSizeKw < 2) return 30000;
  if (systemSizeKw < 3) return 60000;
  return 78000;
}

function roundTo(value: number, precision: number) {
  const multiplier = 10 ** precision;
  return Math.max(1, Math.round(value * multiplier) / multiplier);
}
