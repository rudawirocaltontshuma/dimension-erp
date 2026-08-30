/**
 * Deterministic pseudo-random helpers.
 *
 * All NEXORA ERP demo data is generated from fixed seeds so that the server render
 * and the client render always produce identical values (no hydration mismatch)
 * and the demo looks the same on every visit.
 */

export function createRng(seed: number) {
  let state = seed >>> 0;
  return function next(): number {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = ReturnType<typeof createRng>;

export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

export function pickMany<T>(rng: Rng, items: readonly T[], count: number): T[] {
  const pool = [...items];
  const result: T[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const index = Math.floor(rng() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

export function intBetween(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function moneyBetween(rng: Rng, min: number, max: number): number {
  return Math.round((rng() * (max - min) + min) * 100) / 100;
}

export function weighted<T extends string>(rng: Rng, entries: readonly (readonly [T, number])[]): T {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let threshold = rng() * total;
  for (const [value, weight] of entries) {
    threshold -= weight;
    if (threshold <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

/** Fixed "today" for the demo dataset. */
export const DEMO_TODAY = new Date("2026-06-30T09:00:00.000Z");

export function isoDate(daysFromToday: number): string {
  const date = new Date(DEMO_TODAY.getTime() + daysFromToday * 86400000);
  return date.toISOString().slice(0, 10);
}

export function isoDateTime(hoursFromToday: number): string {
  return new Date(DEMO_TODAY.getTime() + hoursFromToday * 3600000).toISOString();
}

export function padNumber(value: number, length: number): string {
  return String(value).padStart(length, "0");
}

export const FIRST_NAMES = [
  "Alex",
  "Thandiwe",
  "Sipho",
  "Marlene",
  "Johan",
  "Naledi",
  "Pieter",
  "Zanele",
  "Riaan",
  "Lerato",
  "Ayanda",
  "Michelle",
  "Kagiso",
  "Duncan",
  "Nomsa",
  "Ruan",
  "Precious",
  "Hendrik",
  "Bongani",
  "Carla",
  "Tebogo",
  "Adriaan",
  "Refilwe",
  "Willem",
  "Palesa",
  "Devan",
  "Anthea",
  "Mpho",
  "Shaun",
  "Nandi",
  "Grant",
  "Yolanda",
  "Sizwe",
  "Elmarie",
  "Farhaan",
  "Kirsten",
  "Lwazi",
  "Deidre",
  "Neo",
  "Stefan",
  "Zinhle",
  "Warrick",
  "Amina",
  "Chantelle",
  "Tumelo",
  "Barend",
  "Keshia",
  "Vusi",
];

export const LAST_NAMES = [
  "Morgan",
  "Nkosi",
  "van der Merwe",
  "Botha",
  "Mokoena",
  "Pillay",
  "Dlamini",
  "Naidoo",
  "Steyn",
  "Khumalo",
  "Fourie",
  "Maseko",
  "Coetzee",
  "Mahlangu",
  "Jacobs",
  "Ndlovu",
  "Erasmus",
  "Sithole",
  "Petersen",
  "Zulu",
  "Venter",
  "Mabaso",
  "Meyer",
  "Radebe",
  "Kruger",
  "Molefe",
  "Abrahams",
  "Tshabalala",
  "Louw",
  "Mtshali",
  "Barnard",
  "Mnisi",
  "Snyman",
  "Gumede",
  "Adams",
  "Sibanda",
];

export const SA_CITIES = [
  { city: "Johannesburg", province: "Gauteng", postalCode: "2001" },
  { city: "Cape Town", province: "Western Cape", postalCode: "8001" },
  { city: "Durban", province: "KwaZulu-Natal", postalCode: "4001" },
  { city: "Pretoria", province: "Gauteng", postalCode: "0002" },
  { city: "Gqeberha", province: "Eastern Cape", postalCode: "6001" },
  { city: "Bloemfontein", province: "Free State", postalCode: "9301" },
  { city: "Polokwane", province: "Limpopo", postalCode: "0699" },
  { city: "Nelspruit", province: "Mpumalanga", postalCode: "1200" },
  { city: "Kimberley", province: "Northern Cape", postalCode: "8301" },
  { city: "East London", province: "Eastern Cape", postalCode: "5201" },
  { city: "Rustenburg", province: "North West", postalCode: "0299" },
  { city: "George", province: "Western Cape", postalCode: "6529" },
];

export const STREET_NAMES = [
  "Rivonia Road",
  "Jan Smuts Avenue",
  "Voortrekker Street",
  "Umgeni Road",
  "Church Street",
  "Marine Drive",
  "Beyers Naude Drive",
  "Main Reef Road",
  "Nelson Mandela Boulevard",
  "Albert Road",
  "Kruis Street",
  "Klip Road",
  "Industria Crescent",
  "Foundry Lane",
  "Commerce Park Drive",
];

export function personName(rng: Rng): string {
  return `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;
}
