import type { Supplier, SupplierStatus } from "@/types/erp";

import {
  createRng,
  intBetween,
  moneyBetween,
  padNumber,
  personName,
  pick,
  SA_CITIES,
  STREET_NAMES,
  weighted,
} from "./random";

const SUPPLIER_NAMES = [
  "Aurora Components",
  "Blue Horizon Packaging",
  "Cedar Industrial Supplies",
  "Delta Cable Works",
  "Eastvale Plastics",
  "Ferrolink Metals",
  "Greenfield Chemicals",
  "Highveld Fasteners",
  "Ironwood Timber",
  "Junction Electrical",
  "Kalahari Freight Supplies",
  "Lumen Lighting Group",
  "Meridian Polymers",
  "Northgate Tooling",
  "Oceanic Trading",
  "Pinnacle Bearings",
  "Quartz Glassworks",
  "Redstone Adhesives",
  "Silvercrest Textiles",
  "Trident Hydraulics",
  "Umlazi Steelworks",
  "Vantage Office Supply",
  "Westbrook Motors Parts",
  "Xenon Power Systems",
  "Yellowwood Crates",
  "Zambezi Paper Mills",
  "Anchor Safety Gear",
  "Broadfield Automation",
  "Coastline Cold Chain",
  "Drakensberg Minerals",
  "Everest IT Distribution",
  "Falcon Print Media",
  "Goldreef Lubricants",
  "Harbour Logistics Services",
];

const SUPPLIER_CATEGORIES = [
  "Raw Materials",
  "Packaging",
  "Electrical Components",
  "Industrial Hardware",
  "Logistics Services",
  "IT & Equipment",
  "Facilities & Maintenance",
  "Professional Services",
  "Safety & Compliance",
  "Office Supplies",
];

const INTERNATIONAL = [
  { city: "Munich", country: "Germany", currency: "EUR" as const },
  { city: "Manchester", country: "United Kingdom", currency: "GBP" as const },
  { city: "Atlanta", country: "United States", currency: "USD" as const },
  { city: "Rotterdam", country: "Netherlands", currency: "EUR" as const },
];

const PAYMENT_TERMS = ["Net 30", "Net 45", "Net 60", "30 days EOM", "Cash on Delivery"];

function buildSuppliers(): Supplier[] {
  const rng = createRng(20260401);

  return SUPPLIER_NAMES.map((name, index) => {
    const isInternational = index % 9 === 4;
    const local = pick(rng, SA_CITIES);
    const abroad = INTERNATIONAL[index % INTERNATIONAL.length];
    const status = weighted<SupplierStatus>(rng, [
      ["Active", 68],
      ["Under Review", 14],
      ["Suspended", 8],
      ["Inactive", 10],
    ]);
    const slug = name.toLowerCase().replace(/[^a-z]+/g, "");

    return {
      id: `SUP-${padNumber(index + 1, 4)}`,
      name: `${name} (Pty) Ltd`,
      category: SUPPLIER_CATEGORIES[index % SUPPLIER_CATEGORIES.length],
      contactName: personName(rng),
      email: `procurement@${slug}.co.za`,
      phone: `+27 ${intBetween(rng, 11, 87)} ${intBetween(rng, 200, 899)} ${padNumber(intBetween(rng, 0, 9999), 4)}`,
      city: isInternational ? abroad.city : local.city,
      country: isInternational ? abroad.country : "South Africa",
      currency: isInternational ? abroad.currency : "ZAR",
      paymentTerms: pick(rng, PAYMENT_TERMS),
      leadTimeDays: intBetween(rng, 3, 42),
      totalOrders: intBetween(rng, 6, 148),
      totalSpend: moneyBetween(rng, 184000, 9840000),
      onTimeDeliveryRate: Math.round(moneyBetween(rng, 71, 99.4) * 10) / 10,
      qualityScore: Math.round(moneyBetween(rng, 3.1, 4.9) * 10) / 10,
      status,
      onboardedAt: `20${intBetween(rng, 15, 25)}-${padNumber(intBetween(rng, 1, 12), 2)}-${padNumber(intBetween(rng, 1, 28), 2)}`,
      vatNumber: `4${padNumber(intBetween(rng, 100000000, 999999999), 9)}`,
      address: {
        line1: `Unit ${intBetween(rng, 1, 48)}, ${name} Park`,
        line2: `${intBetween(rng, 2, 260)} ${pick(rng, STREET_NAMES)}`,
        city: isInternational ? abroad.city : local.city,
        province: isInternational ? "" : local.province,
        postalCode: isInternational ? padNumber(intBetween(rng, 10000, 99999), 5) : local.postalCode,
        country: isInternational ? abroad.country : "South Africa",
      },
    };
  });
}

export const suppliers: Supplier[] = buildSuppliers();

export const supplierById = (id: string) => suppliers.find((supplier) => supplier.id === id);
