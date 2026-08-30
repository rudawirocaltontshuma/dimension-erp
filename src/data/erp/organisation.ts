import type { Address, CurrencyCode, Warehouse } from "@/types/erp";

export const NEXORA = {
  name: "NEXORA ERP",
  subtitle: "Enterprise Resource Planning Platform",
  legalName: "Nexora Holdings (Pty) Ltd",
  registration: "2014/118304/07",
  vatNumber: "4820158376",
  email: "operations@nexora-demo.co.za",
  phone: "+27 11 482 6100",
  website: "www.nexora-demo.co.za",
  baseCurrency: "ZAR" as CurrencyCode,
  fiscalYearStart: "1 March",
  headOffice: {
    line1: "Nexora Corporate Park, Block C",
    line2: "144 Rivonia Road, Sandton",
    city: "Johannesburg",
    province: "Gauteng",
    postalCode: "2196",
    country: "South Africa",
  } satisfies Address,
};

export interface CompanyEntity {
  id: string;
  name: string;
  description: string;
  registration: string;
  baseCurrency: CurrencyCode;
  employees: number;
  headquarters: string;
}

export const companies: CompanyEntity[] = [
  {
    id: "co-holdings",
    name: "Nexora Holdings",
    description: "Group holding entity covering shared services, finance and corporate governance.",
    registration: "2014/118304/07",
    baseCurrency: "ZAR",
    employees: 46,
    headquarters: "Sandton, Johannesburg",
  },
  {
    id: "co-distribution",
    name: "Nexora Distribution",
    description: "National distribution and wholesale operation servicing retail and trade customers.",
    registration: "2016/226741/07",
    baseCurrency: "ZAR",
    employees: 128,
    headquarters: "Kempton Park, Gauteng",
  },
  {
    id: "co-manufacturing",
    name: "Nexora Manufacturing",
    description: "Assembly and light manufacturing division producing the Nexora branded product range.",
    registration: "2018/304922/07",
    baseCurrency: "ZAR",
    employees: 94,
    headquarters: "Pinetown, KwaZulu-Natal",
  },
];

export const demoUser = {
  name: "Alex Morgan",
  role: "Enterprise Administrator",
  email: "alex.morgan@nexora-demo.co.za",
  initials: "AM",
  location: "Sandton, Johannesburg",
  phone: "+27 82 441 0193",
  department: "Group Operations",
};

export interface CurrencySetting {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateToZar: number;
  isBase: boolean;
  status: "Active" | "Inactive";
}

export const currencies: CurrencySetting[] = [
  { code: "ZAR", name: "South African Rand", symbol: "R", rateToZar: 1, isBase: true, status: "Active" },
  { code: "USD", name: "United States Dollar", symbol: "$", rateToZar: 18.42, isBase: false, status: "Active" },
  { code: "EUR", name: "Euro", symbol: "€", rateToZar: 19.87, isBase: false, status: "Active" },
  { code: "GBP", name: "Pound Sterling", symbol: "£", rateToZar: 23.15, isBase: false, status: "Active" },
];

export interface TaxRate {
  id: string;
  name: string;
  code: string;
  rate: number;
  type: "Output" | "Input" | "Exempt";
  jurisdiction: string;
  status: "Active" | "Inactive";
}

export const taxRates: TaxRate[] = [
  {
    id: "tax-1",
    name: "Standard Rated VAT",
    code: "VAT-15",
    rate: 15,
    type: "Output",
    jurisdiction: "South Africa",
    status: "Active",
  },
  {
    id: "tax-2",
    name: "Zero Rated Supplies",
    code: "VAT-0",
    rate: 0,
    type: "Output",
    jurisdiction: "South Africa",
    status: "Active",
  },
  {
    id: "tax-3",
    name: "Exempt Supplies",
    code: "VAT-EX",
    rate: 0,
    type: "Exempt",
    jurisdiction: "South Africa",
    status: "Active",
  },
  {
    id: "tax-4",
    name: "Input VAT Claimable",
    code: "VAT-IN15",
    rate: 15,
    type: "Input",
    jurisdiction: "South Africa",
    status: "Active",
  },
  {
    id: "tax-5",
    name: "Export Sales",
    code: "EXP-0",
    rate: 0,
    type: "Output",
    jurisdiction: "SADC Region",
    status: "Active",
  },
  {
    id: "tax-6",
    name: "EU Reverse Charge",
    code: "EU-RC",
    rate: 0,
    type: "Output",
    jurisdiction: "European Union",
    status: "Inactive",
  },
];

export interface LocationRecord {
  id: string;
  name: string;
  type: "Head Office" | "Distribution Centre" | "Warehouse" | "Manufacturing" | "Branch";
  city: string;
  province: string;
  manager: string;
  headcount: number;
  status: "Operational" | "Limited Capacity" | "Maintenance";
}

export const locations: LocationRecord[] = [
  {
    id: "loc-1",
    name: "Sandton Head Office",
    type: "Head Office",
    city: "Johannesburg",
    province: "Gauteng",
    manager: "Alex Morgan",
    headcount: 46,
    status: "Operational",
  },
  {
    id: "loc-2",
    name: "Johannesburg Distribution Centre",
    type: "Distribution Centre",
    city: "Kempton Park",
    province: "Gauteng",
    manager: "Sipho Nkosi",
    headcount: 62,
    status: "Operational",
  },
  {
    id: "loc-3",
    name: "Cape Town Distribution Centre",
    type: "Distribution Centre",
    city: "Cape Town",
    province: "Western Cape",
    manager: "Marlene Botha",
    headcount: 41,
    status: "Operational",
  },
  {
    id: "loc-4",
    name: "Durban Distribution Centre",
    type: "Distribution Centre",
    city: "Durban",
    province: "KwaZulu-Natal",
    manager: "Zanele Dlamini",
    headcount: 38,
    status: "Limited Capacity",
  },
  {
    id: "loc-5",
    name: "Pretoria Warehouse",
    type: "Warehouse",
    city: "Pretoria",
    province: "Gauteng",
    manager: "Riaan Steyn",
    headcount: 19,
    status: "Operational",
  },
  {
    id: "loc-6",
    name: "Pinetown Manufacturing Plant",
    type: "Manufacturing",
    city: "Pinetown",
    province: "KwaZulu-Natal",
    manager: "Bongani Khumalo",
    headcount: 94,
    status: "Operational",
  },
  {
    id: "loc-7",
    name: "Gqeberha Branch",
    type: "Branch",
    city: "Gqeberha",
    province: "Eastern Cape",
    manager: "Deidre Petersen",
    headcount: 12,
    status: "Operational",
  },
];

export const warehouses: Warehouse[] = [
  {
    id: "WH-JHB",
    code: "JHB-DC",
    name: "Johannesburg Distribution Centre",
    city: "Kempton Park",
    province: "Gauteng",
    manager: "Sipho Nkosi",
    phone: "+27 11 482 6142",
    capacityPallets: 9600,
    usedPallets: 7824,
    utilization: 81.5,
    productCount: 58,
    stockValue: 24816430.75,
    inboundThisWeek: 46,
    outboundThisWeek: 128,
    lowStockItems: 11,
    status: "Operational",
    address: {
      line1: "Unit 14, Nexora Logistics Park",
      line2: "22 Commerce Park Drive, Spartan",
      city: "Kempton Park",
      province: "Gauteng",
      postalCode: "1619",
      country: "South Africa",
    },
  },
  {
    id: "WH-CPT",
    code: "CPT-DC",
    name: "Cape Town Distribution Centre",
    city: "Cape Town",
    province: "Western Cape",
    manager: "Marlene Botha",
    phone: "+27 21 551 8820",
    capacityPallets: 7200,
    usedPallets: 5112,
    utilization: 71,
    productCount: 52,
    stockValue: 16394208.4,
    inboundThisWeek: 33,
    outboundThisWeek: 97,
    lowStockItems: 8,
    status: "Operational",
    address: {
      line1: "Building 6, Montague Gardens Industrial",
      line2: "18 Marine Drive",
      city: "Cape Town",
      province: "Western Cape",
      postalCode: "7441",
      country: "South Africa",
    },
  },
  {
    id: "WH-DBN",
    code: "DBN-DC",
    name: "Durban Distribution Centre",
    city: "Durban",
    province: "KwaZulu-Natal",
    manager: "Zanele Dlamini",
    phone: "+27 31 303 4471",
    capacityPallets: 6400,
    usedPallets: 5760,
    utilization: 90,
    productCount: 47,
    stockValue: 13270884.15,
    inboundThisWeek: 28,
    outboundThisWeek: 84,
    lowStockItems: 14,
    status: "Limited Capacity",
    address: {
      line1: "Warehouse 3, Riverhorse Valley",
      line2: "41 Umgeni Road",
      city: "Durban",
      province: "KwaZulu-Natal",
      postalCode: "4017",
      country: "South Africa",
    },
  },
  {
    id: "WH-PTA",
    code: "PTA-WH",
    name: "Pretoria Warehouse",
    city: "Pretoria",
    province: "Gauteng",
    manager: "Riaan Steyn",
    phone: "+27 12 662 9014",
    capacityPallets: 3800,
    usedPallets: 2318,
    utilization: 61,
    productCount: 39,
    stockValue: 7942165.9,
    inboundThisWeek: 17,
    outboundThisWeek: 52,
    lowStockItems: 6,
    status: "Operational",
    address: {
      line1: "Erf 221, Silverton Industrial",
      line2: "9 Foundry Lane",
      city: "Pretoria",
      province: "Gauteng",
      postalCode: "0184",
      country: "South Africa",
    },
  },
];

export const warehouseById = (id: string) => warehouses.find((warehouse) => warehouse.id === id);
