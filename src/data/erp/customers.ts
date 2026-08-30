import type { Contact, Customer, CustomerSegment, CustomerStatus } from "@/types/erp";

import {
  createRng,
  intBetween,
  isoDate,
  moneyBetween,
  padNumber,
  personName,
  pick,
  SA_CITIES,
  STREET_NAMES,
  weighted,
} from "./random";

const CUSTOMER_NAMES = [
  "Ardent Retail Group",
  "Bosveld Mining Services",
  "Cape Coastal Engineering",
  "Drakensview Construction",
  "Eastrand Fabrication",
  "Franschhoek Estates",
  "Gauteng Rail Works",
  "Highland Agri Solutions",
  "Isipingo Marine Services",
  "Jozi Facilities Management",
  "Karoo Energy Partners",
  "Lowveld Packing House",
  "Midrand Data Centres",
  "Newlands Manufacturing",
  "Overberg Cold Storage",
  "Phoenix Auto Assembly",
  "Quantum Utilities SA",
  "Rondebosch Property Group",
  "Sandton Commercial Interiors",
  "Table Bay Shipping",
  "Umhlanga Hospitality Group",
  "Vaal Chemical Works",
  "Waterberg Civils",
  "Xhariep Municipality Supply",
  "Yzerfontein Fisheries",
  "Zeerust Agri Depot",
  "Alberton Hardware Wholesale",
  "Benoni Tooling Centre",
  "Centurion Building Supplies",
  "Durban Port Services",
  "Emalahleni Power Contractors",
  "Fourways Retail Holdings",
  "Germiston Steel Traders",
  "Hillcrest Medical Facilities",
  "Illovo Consulting Partners",
  "Kloof Industrial Traders",
  "Linbro Logistics Park",
  "Mossel Bay Marine Supply",
  "Nelspruit Fresh Produce",
  "Ottery Print Works",
  "Paarl Bottling Company",
  "Randfontein Mining Supply",
  "Somerset Retail Networks",
  "Tshwane Metro Projects",
];

const INDUSTRIES = [
  "Mining",
  "Construction",
  "Manufacturing",
  "Retail",
  "Agriculture",
  "Logistics",
  "Utilities",
  "Public Sector",
  "Hospitality",
  "Healthcare",
];

const SEGMENTS: CustomerSegment[] = ["Enterprise", "Wholesale", "Retail", "Government", "Reseller"];
const PAYMENT_TERMS = ["Net 30", "Net 45", "Net 60", "30 days EOM", "Prepaid"];
const ACCOUNT_MANAGERS = [
  "Nomsa Radebe",
  "Grant Barnard",
  "Lerato Molefe",
  "Stefan Kruger",
  "Ayanda Zulu",
  "Chantelle Adams",
];

function buildContacts(rng: ReturnType<typeof createRng>, company: string, count: number): Contact[] {
  const roles = ["Procurement Manager", "Financial Manager", "Operations Director", "Site Foreman", "Accounts Payable"];
  const slug = company.toLowerCase().replace(/[^a-z]+/g, "");
  return Array.from({ length: count }, (_, index) => {
    const name = personName(rng);
    return {
      id: `CNT-${padNumber(intBetween(rng, 1000, 9999), 4)}-${index}`,
      name,
      role: roles[index % roles.length],
      email: `${name.split(" ")[0].toLowerCase()}@${slug}.co.za`,
      phone: `+27 ${intBetween(rng, 11, 87)} ${intBetween(rng, 200, 899)} ${padNumber(intBetween(rng, 0, 9999), 4)}`,
      primary: index === 0,
    };
  });
}

function buildCustomers(): Customer[] {
  const rng = createRng(20241109);

  return CUSTOMER_NAMES.map((name, index) => {
    const place = SA_CITIES[index % SA_CITIES.length];
    const totalOrders = intBetween(rng, 3, 96);
    const averageOrderValue = moneyBetween(rng, 8400, 184000);
    const totalRevenue = Math.round(totalOrders * averageOrderValue * 100) / 100;
    const status = weighted<CustomerStatus>(rng, [
      ["Active", 66],
      ["On Hold", 12],
      ["Prospect", 12],
      ["Inactive", 10],
    ]);
    const slug = name.toLowerCase().replace(/[^a-z]+/g, "");
    const address = {
      line1: `${intBetween(rng, 2, 240)} ${pick(rng, STREET_NAMES)}`,
      line2: `${pick(rng, ["Unit", "Block", "Suite"])} ${intBetween(rng, 1, 40)}`,
      city: place.city,
      province: place.province,
      postalCode: place.postalCode,
      country: "South Africa",
    };

    return {
      id: `CUS-${padNumber(index + 1, 4)}`,
      name: `${name} (Pty) Ltd`,
      tradingName: name,
      segment: SEGMENTS[index % SEGMENTS.length],
      status,
      industry: INDUSTRIES[index % INDUSTRIES.length],
      email: `accounts@${slug}.co.za`,
      phone: `+27 ${intBetween(rng, 11, 87)} ${intBetween(rng, 200, 899)} ${padNumber(intBetween(rng, 0, 9999), 4)}`,
      website: `www.${slug}.co.za`,
      vatNumber: `4${padNumber(intBetween(rng, 100000000, 999999999), 9)}`,
      currency: index % 13 === 6 ? "USD" : "ZAR",
      creditLimit: Math.round(moneyBetween(rng, 250000, 4500000) / 1000) * 1000,
      outstandingBalance: Math.round(moneyBetween(rng, 0, 1240000) * 100) / 100,
      totalRevenue,
      totalOrders,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      customerSince: isoDate(-intBetween(rng, 400, 3200)),
      lastOrderDate: isoDate(-intBetween(rng, 1, 180)),
      accountManager: ACCOUNT_MANAGERS[index % ACCOUNT_MANAGERS.length],
      paymentTerms: pick(rng, PAYMENT_TERMS),
      billingAddress: address,
      shippingAddress: { ...address, line2: `Receiving Bay ${intBetween(rng, 1, 12)}` },
      contacts: buildContacts(rng, name, intBetween(rng, 2, 4)),
      tags: [SEGMENTS[index % SEGMENTS.length], INDUSTRIES[index % INDUSTRIES.length]],
    };
  });
}

export const customers: Customer[] = buildCustomers();

export const customerById = (id: string) => customers.find((customer) => customer.id === id);
