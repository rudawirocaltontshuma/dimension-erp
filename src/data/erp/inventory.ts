import type {
  AdjustmentReason,
  InventoryRecord,
  StockAdjustment,
  StockMovement,
  StockMovementType,
  StockStatus,
  StockTransfer,
  TransferStatus,
} from "@/types/erp";

import { warehouses } from "./organisation";
import { products } from "./products";
import { createRng, intBetween, isoDate, personName, pick, weighted } from "./random";

function buildInventory(): InventoryRecord[] {
  const rng = createRng(20260630);
  const records: InventoryRecord[] = [];

  products.forEach((product, productIndex) => {
    const warehouseCount = 2 + (productIndex % 3);
    for (let index = 0; index < warehouseCount; index++) {
      const warehouse = warehouses[(productIndex + index) % warehouses.length];
      const onHand = productIndex % 13 === 4 && index === 0 ? 0 : intBetween(rng, 0, 420);
      const reserved = Math.min(onHand, intBetween(rng, 0, 48));
      const available = onHand - reserved;
      const reorderLevel = intBetween(rng, 15, 110);

      let status: StockStatus = "In Stock";
      if (onHand === 0) status = "Out of Stock";
      else if (available <= reorderLevel) status = "Low Stock";
      else if (available > reorderLevel * 6) status = "Overstocked";

      records.push({
        id: `INV-${product.id}-${warehouse.id}`,
        productId: product.id,
        sku: product.sku,
        productName: product.name,
        category: product.category,
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        onHand,
        reserved,
        available,
        reorderLevel,
        unitCost: product.cost,
        stockValue: Math.round(onHand * product.cost * 100) / 100,
        binLocation: `${String.fromCharCode(65 + (index % 6))}${intBetween(rng, 1, 24)}-${intBetween(rng, 1, 9)}`,
        lastCountedAt: isoDate(-intBetween(rng, 1, 90)),
        status,
      });
    }
  });

  return records;
}

export const inventoryRecords: InventoryRecord[] = buildInventory();

export const inventorySummary = {
  totalRecords: inventoryRecords.length,
  totalUnits: inventoryRecords.reduce((sum, record) => sum + record.onHand, 0),
  totalValue: Math.round(inventoryRecords.reduce((sum, record) => sum + record.stockValue, 0) * 100) / 100,
  lowStock: inventoryRecords.filter((record) => record.status === "Low Stock").length,
  outOfStock: inventoryRecords.filter((record) => record.status === "Out of Stock").length,
  reserved: inventoryRecords.reduce((sum, record) => sum + record.reserved, 0),
  incoming: 4820,
};

const MOVEMENT_TYPES: StockMovementType[] = ["Receipt", "Shipment", "Transfer", "Adjustment", "Return"];

function buildMovements(): StockMovement[] {
  const rng = createRng(20260701);

  return Array.from({ length: 120 }, (_, index) => {
    const product = products[(index * 7) % products.length];
    const warehouse = warehouses[index % warehouses.length];
    const type = MOVEMENT_TYPES[index % MOVEMENT_TYPES.length];
    const magnitude = intBetween(rng, 1, 260);
    const quantity = type === "Shipment" || type === "Adjustment" ? -magnitude : magnitude;

    return {
      id: `SM-${30500 + index}`,
      reference: `SM-${30500 + index}`,
      date: isoDate(-intBetween(rng, 0, 120)),
      productSku: product.sku,
      productName: product.name,
      warehouseName: warehouse.name,
      quantity,
      type,
      status: weighted(rng, [
        ["Posted", 82],
        ["Draft", 12],
        ["Reversed", 6],
      ] as const),
      performedBy: personName(rng),
      sourceDocument:
        type === "Receipt"
          ? `GRN-${6100 + (index % 36)}`
          : type === "Shipment"
            ? `ORD-${10401 + (index % 92)}`
            : type === "Transfer"
              ? `TRF-${2100 + (index % 26)}`
              : `ADJ-${5300 + (index % 30)}`,
    };
  });
}

export const stockMovements: StockMovement[] = buildMovements();

function buildTransfers(): StockTransfer[] {
  const rng = createRng(20260222);

  return Array.from({ length: 26 }, (_, index) => {
    const source = warehouses[index % warehouses.length];
    const destination = warehouses[(index + 1) % warehouses.length];
    const requestedDay = -intBetween(rng, 1, 90);

    return {
      id: `TRF-${2100 + index}`,
      reference: `TRF-${2100 + index}`,
      sourceWarehouse: source.name,
      destinationWarehouse: destination.name,
      requestedDate: isoDate(requestedDay),
      expectedDate: isoDate(requestedDay + intBetween(rng, 2, 12)),
      itemCount: intBetween(rng, 1, 14),
      totalQuantity: intBetween(rng, 20, 640),
      requestedBy: personName(rng),
      status: weighted<TransferStatus>(rng, [
        ["Completed", 34],
        ["In Transit", 22],
        ["Approved", 18],
        ["Requested", 16],
        ["Draft", 10],
      ]),
    };
  });
}

export const stockTransfers: StockTransfer[] = buildTransfers();

const ADJUSTMENT_REASONS: AdjustmentReason[] = [
  "Cycle Count",
  "Damage",
  "Expiry",
  "Shrinkage",
  "Reclassification",
  "Found Stock",
];

function buildAdjustments(): StockAdjustment[] {
  const rng = createRng(20260415);

  return Array.from({ length: 30 }, (_, index) => {
    const product = products[(index * 5) % products.length];
    const warehouse = warehouses[index % warehouses.length];
    const delta = pick(rng, [-1, 1]) * intBetween(rng, 1, 84);

    return {
      id: `ADJ-${5300 + index}`,
      reference: `ADJ-${5300 + index}`,
      date: isoDate(-intBetween(rng, 1, 120)),
      warehouseName: warehouse.name,
      productSku: product.sku,
      productName: product.name,
      quantityDelta: delta,
      valueDelta: Math.round(delta * product.cost * 100) / 100,
      reason: ADJUSTMENT_REASONS[index % ADJUSTMENT_REASONS.length],
      approvedBy: personName(rng),
      status: weighted(rng, [
        ["Posted", 62],
        ["Approved", 24],
        ["Draft", 14],
      ] as const),
    };
  });
}

export const stockAdjustments: StockAdjustment[] = buildAdjustments();

export const inventoryByWarehouse = warehouses.map((warehouse) => {
  const records = inventoryRecords.filter((record) => record.warehouseId === warehouse.id);
  return {
    warehouse: warehouse.name,
    units: records.reduce((sum, record) => sum + record.onHand, 0),
    value: Math.round(records.reduce((sum, record) => sum + record.stockValue, 0) * 100) / 100,
  };
});

export const lowStockItems = inventoryRecords
  .filter((record) => record.status === "Low Stock" || record.status === "Out of Stock")
  .slice(0, 40);

export const inventoryByCategory = Array.from(
  inventoryRecords.reduce((map, record) => {
    map.set(record.category, Math.round(((map.get(record.category) ?? 0) + record.stockValue) * 100) / 100);
    return map;
  }, new Map<string, number>()),
)
  .map(([category, value]) => ({ category, value }))
  .sort((a, b) => b.value - a.value);

export const inventoryMovementValue =
  Math.round(stockMovements.reduce((sum, movement) => sum + Math.abs(movement.quantity), 0) * 100) / 100;
