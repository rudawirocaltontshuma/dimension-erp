import type {
  Delivery,
  DeliveryRoute,
  Shipment,
  ShipmentStatus,
  TimelineEvent,
  Vehicle,
  VehicleStatus,
} from "@/types/erp";

import { warehouses } from "./organisation";
import {
  createRng,
  intBetween,
  isoDate,
  isoDateTime,
  moneyBetween,
  padNumber,
  personName,
  pick,
  SA_CITIES,
  weighted,
} from "./random";
import { orders } from "./sales";

const CARRIERS = [
  "Nexora Fleet",
  "Skynet Freight",
  "Cape Express Logistics",
  "Highveld Couriers",
  "Coastal Line Haulage",
];

const DRIVERS = [
  "Vusi Mtshali",
  "Barend Snyman",
  "Neo Sibanda",
  "Farhaan Adams",
  "Tumelo Gumede",
  "Shaun Petersen",
  "Lwazi Mnisi",
  "Willem Venter",
  "Keshia Naidoo",
  "Tebogo Maseko",
];

function shipmentTimeline(reference: string, status: ShipmentStatus): TimelineEvent[] {
  const stages: { title: string; description: string; hours: number; tone: TimelineEvent["tone"] }[] = [
    {
      title: "Order received",
      description: "Consignment created from the linked sales order.",
      hours: -96,
      tone: "info",
    },
    {
      title: "Packed",
      description: "Items picked, packed and labelled at the distribution centre.",
      hours: -80,
      tone: "info",
    },
    {
      title: "Dispatched",
      description: "Consignment loaded and released from the dispatch bay.",
      hours: -64,
      tone: "info",
    },
    { title: "In transit", description: "Vehicle en route to the destination region.", hours: -40, tone: "info" },
    { title: "Out for delivery", description: "Loaded onto the final delivery run.", hours: -16, tone: "warning" },
    {
      title: "Delivered",
      description: "Proof of delivery captured and signed by the receiver.",
      hours: -2,
      tone: "success",
    },
  ];

  const cutoff =
    status === "Preparing"
      ? 2
      : status === "In Transit"
        ? 4
        : status === "Out for Delivery"
          ? 5
          : status === "Delivered"
            ? 6
            : 4;

  const events = stages.slice(0, cutoff).map((stage, index) => ({
    id: `${reference}-s${index + 1}`,
    title: stage.title,
    description: stage.description,
    timestamp: isoDateTime(stage.hours),
    actor: index < 2 ? "Warehouse Operations" : "Logistics Control",
    tone: stage.tone,
  }));

  if (status === "Delayed") {
    events.push({
      id: `${reference}-delay`,
      title: "Delivery delayed",
      description: "Delay reported due to road conditions on the assigned route. Customer notified.",
      timestamp: isoDateTime(-12),
      actor: "Logistics Control",
      tone: "danger",
    });
  }

  return events;
}

function buildShipments(): Shipment[] {
  const rng = createRng(20260427);

  return Array.from({ length: 64 }, (_, index) => {
    const order = orders[(index * 2) % orders.length];
    const warehouse = warehouses[index % warehouses.length];
    const destination = SA_CITIES[(index * 3) % SA_CITIES.length];
    const reference = `SHP-${44100 + index}`;
    const status = weighted<ShipmentStatus>(rng, [
      ["Delivered", 40],
      ["In Transit", 22],
      ["Preparing", 16],
      ["Out for Delivery", 12],
      ["Delayed", 10],
    ]);
    const dispatchDay = -intBetween(rng, 0, 60);

    return {
      id: reference,
      reference,
      orderRef: order.reference,
      customerName: order.customerName,
      origin: warehouse.name,
      destination: `${destination.city}, ${destination.province}`,
      carrier: CARRIERS[index % CARRIERS.length],
      driver: DRIVERS[index % DRIVERS.length],
      vehicleId: `VEH-${padNumber((index % 18) + 1, 3)}`,
      dispatchDate: isoDate(dispatchDay),
      expectedDelivery: isoDate(dispatchDay + intBetween(rng, 1, 8)),
      weightKg: Math.round(moneyBetween(rng, 24, 8400) * 10) / 10,
      packages: intBetween(rng, 1, 48),
      status,
      serviceLevel: pick(rng, ["Standard", "Express", "Overnight", "Economy"]),
      timeline: shipmentTimeline(reference, status),
    };
  });
}

export const shipments: Shipment[] = buildShipments();
export const shipmentById = (id: string) => shipments.find((shipment) => shipment.id === id);

function buildDeliveries(): Delivery[] {
  const rng = createRng(20260602);

  return Array.from({ length: 48 }, (_, index) => {
    const shipment = shipments[index % shipments.length];
    return {
      id: `DLV-${5500 + index}`,
      reference: `DLV-${5500 + index}`,
      shipmentRef: shipment.reference,
      customerName: shipment.customerName,
      address: shipment.destination,
      region: shipment.destination.split(", ")[1] ?? "Gauteng",
      scheduledDate: isoDate(intBetween(rng, -20, 14)),
      timeWindow: pick(rng, ["08:00 — 12:00", "10:00 — 14:00", "12:00 — 16:00", "14:00 — 18:00"]),
      driver: shipment.driver,
      status: weighted(rng, [
        ["Completed", 46],
        ["Scheduled", 24],
        ["In Progress", 14],
        ["Rescheduled", 10],
        ["Failed", 6],
      ] as const),
      proofOfDelivery:
        index % 3 === 0 ? "Signed — electronic POD" : index % 3 === 1 ? "Signed — paper waybill" : "Awaiting capture",
    };
  });
}

export const deliveries: Delivery[] = buildDeliveries();

function buildRoutes(): DeliveryRoute[] {
  const rng = createRng(20260215);
  const routeNames = [
    "Gauteng Metro North",
    "Gauteng Metro South",
    "Cape Peninsula Circuit",
    "Winelands Run",
    "KZN North Coast",
    "KZN South Coast",
    "Garden Route Line",
    "Eastern Cape Corridor",
    "Free State Interlink",
    "Limpopo Northbound",
    "Mpumalanga Lowveld",
    "North West Circuit",
  ];

  return routeNames.map((name, index) => ({
    id: `RTE-${300 + index}`,
    code: `RTE-${300 + index}`,
    name,
    region: SA_CITIES[index % SA_CITIES.length].province,
    driver: DRIVERS[index % DRIVERS.length],
    vehicleId: `VEH-${padNumber((index % 18) + 1, 3)}`,
    stops: intBetween(rng, 4, 22),
    distanceKm: intBetween(rng, 48, 940),
    estimatedHours: Math.round(moneyBetween(rng, 2.4, 14.5) * 10) / 10,
    status: weighted(rng, [
      ["Active", 40],
      ["Planned", 30],
      ["Completed", 24],
      ["Cancelled", 6],
    ] as const),
    departureTime: `0${intBetween(rng, 4, 9)}:${padNumber(intBetween(rng, 0, 5) * 10, 2)}`,
  }));
}

export const deliveryRoutes: DeliveryRoute[] = buildRoutes();

function buildVehicles(): Vehicle[] {
  const rng = createRng(20260130);
  const types = ["Panel Van", "Rigid Truck", "Refrigerated Truck", "Bakkie", "Interlink"] as const;
  const makes = [
    { make: "Isuzu", model: "FTR 850" },
    { make: "Hino", model: "500 Series" },
    { make: "Mercedes-Benz", model: "Sprinter 519" },
    { make: "Toyota", model: "Hilux 2.4 GD-6" },
    { make: "Volvo", model: "FH 440" },
    { make: "Ford", model: "Transit 350" },
  ];

  return Array.from({ length: 18 }, (_, index) => {
    const spec = makes[index % makes.length];
    const place = SA_CITIES[index % SA_CITIES.length];
    const mileage = intBetween(rng, 18400, 428000);

    return {
      id: `VEH-${padNumber(index + 1, 3)}`,
      registration: `${["JH", "CA", "ND", "GP", "EC"][index % 5]} ${intBetween(rng, 10, 99)} ${["ABC", "DXK", "MNP", "TRV", "LWZ"][index % 5]} GP`,
      type: types[index % types.length],
      make: spec.make,
      model: spec.model,
      driver: DRIVERS[index % DRIVERS.length],
      currentLocation: `${place.city}, ${place.province}`,
      mileageKm: mileage,
      capacityKg: intBetween(rng, 800, 32000),
      lastServiceDate: isoDate(-intBetween(rng, 10, 240)),
      nextServiceKm: mileage + intBetween(rng, 2000, 18000),
      status: weighted<VehicleStatus>(rng, [
        ["Available", 38],
        ["In Transit", 34],
        ["Maintenance", 18],
        ["Inactive", 10],
      ]),
    };
  });
}

export const vehicles: Vehicle[] = buildVehicles();

export const logisticsSummary = {
  totalShipments: shipments.length,
  inTransit: shipments.filter((shipment) => shipment.status === "In Transit").length,
  delivered: shipments.filter((shipment) => shipment.status === "Delivered").length,
  delayed: shipments.filter((shipment) => shipment.status === "Delayed").length,
  outForDelivery: shipments.filter((shipment) => shipment.status === "Out for Delivery").length,
  activeVehicles: vehicles.filter((vehicle) => vehicle.status !== "Inactive").length,
  activeRoutes: deliveryRoutes.filter((route) => route.status === "Active").length,
  onTimeRate: 92.4,
};

export const shipmentsByRegion = Array.from(
  shipments.reduce((map, shipment) => {
    const region = shipment.destination.split(", ")[1] ?? "Gauteng";
    map.set(region, (map.get(region) ?? 0) + 1);
    return map;
  }, new Map<string, number>()),
).map(([region, count]) => ({ region, count }));

export const carriers = CARRIERS;
export const drivers = DRIVERS;

export const upcomingDeliveries = deliveries
  .filter((delivery) => delivery.status === "Scheduled" || delivery.status === "In Progress")
  .slice(0, 6);

export const deliveryPerformance = [
  { week: "W22", onTime: 88, late: 12 },
  { week: "W23", onTime: 91, late: 9 },
  { week: "W24", onTime: 87, late: 13 },
  { week: "W25", onTime: 93, late: 7 },
  { week: "W26", onTime: 94, late: 6 },
  { week: "W27", onTime: 92, late: 8 },
];

export const driverRoster = DRIVERS.map((driver, index) => ({
  driver,
  vehicle: `VEH-${padNumber((index % 18) + 1, 3)}`,
  contact: `+27 8${index} ${400 + index} ${1000 + index * 7}`,
  assignedRoute: `RTE-${300 + (index % 12)}`,
  shift: index % 2 === 0 ? "Day shift" : "Late shift",
}));

export const fleetOwner = personName(createRng(11));
