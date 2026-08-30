import type {
  FulfillmentStatus,
  Invoice,
  InvoiceStatus,
  LineItem,
  Order,
  OrderStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Quote,
  QuoteStatus,
  SalesChannel,
  TimelineEvent,
} from "@/types/erp";

import { customers } from "./customers";
import { warehouses } from "./organisation";
import { products } from "./products";
import {
  createRng,
  intBetween,
  isoDate,
  isoDateTime,
  moneyBetween,
  padNumber,
  pick,
  type Rng,
  weighted,
} from "./random";

const SALES_REPS = [
  "Nomsa Radebe",
  "Grant Barnard",
  "Lerato Molefe",
  "Stefan Kruger",
  "Ayanda Zulu",
  "Chantelle Adams",
  "Devan Pillay",
];

const CHANNELS: SalesChannel[] = ["Direct Sales", "Field Sales", "Online Portal", "Distributor", "Tender"];

function buildLineItems(rng: Rng, count: number, prefix: string): LineItem[] {
  return Array.from({ length: count }, (_, index) => {
    const product = products[intBetween(rng, 0, products.length - 1)];
    const quantity = intBetween(rng, 1, 24);
    const discountPercent = pick(rng, [0, 0, 0, 2.5, 5, 7.5, 10]);
    const gross = product.price * quantity;
    const net = gross * (1 - discountPercent / 100);
    return {
      id: `${prefix}-L${index + 1}`,
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity,
      unitPrice: product.price,
      discountPercent,
      taxPercent: 15,
      lineTotal: Math.round(net * 100) / 100,
    };
  });
}

function totalsFor(items: LineItem[], shipping = 0) {
  const gross = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const discount = Math.round((gross - subtotal) * 100) / 100;
  const tax = Math.round(subtotal * 0.15 * 100) / 100;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount,
    tax,
    shipping,
    total: Math.round((subtotal + tax + shipping) * 100) / 100,
  };
}

function orderTimeline(reference: string, status: OrderStatus, rep: string): TimelineEvent[] {
  const base: TimelineEvent[] = [
    {
      id: `${reference}-t1`,
      title: "Order captured",
      description: `${reference} was captured on the sales desk and validated against the customer credit limit.`,
      timestamp: isoDateTime(-96),
      actor: rep,
      tone: "info",
    },
    {
      id: `${reference}-t2`,
      title: "Credit check cleared",
      description: "Finance approved the order value against the available credit limit.",
      timestamp: isoDateTime(-88),
      actor: "Finance Control",
      tone: "success",
    },
  ];

  if (status === "Cancelled") {
    base.push({
      id: `${reference}-t3`,
      title: "Order cancelled",
      description: "The customer withdrew the order before picking commenced.",
      timestamp: isoDateTime(-72),
      actor: rep,
      tone: "danger",
    });
    return base;
  }

  if (status !== "Pending") {
    base.push({
      id: `${reference}-t3`,
      title: "Warehouse picking started",
      description: "Pick list released to the distribution centre floor.",
      timestamp: isoDateTime(-64),
      actor: "Warehouse Operations",
      tone: "info",
    });
  }

  if (status === "Completed") {
    base.push(
      {
        id: `${reference}-t4`,
        title: "Dispatched",
        description: "Consignment loaded and dispatched with the assigned carrier.",
        timestamp: isoDateTime(-40),
        actor: "Logistics Control",
        tone: "info",
      },
      {
        id: `${reference}-t5`,
        title: "Delivered and signed",
        description: "Proof of delivery captured at the customer receiving bay.",
        timestamp: isoDateTime(-12),
        actor: "Delivery Team",
        tone: "success",
      },
    );
  }

  return base;
}

function buildOrders(): Order[] {
  const rng = createRng(20260118);

  return Array.from({ length: 92 }, (_, index) => {
    const customer = customers[index % customers.length];
    const warehouse = warehouses[index % warehouses.length];
    const reference = `ORD-${10401 + index}`;
    const items = buildLineItems(rng, intBetween(rng, 1, 6), reference);
    const shipping = pick(rng, [0, 450, 780, 1250, 1980]);
    const totals = totalsFor(items, shipping);
    const status = weighted<OrderStatus>(rng, [
      ["Completed", 44],
      ["Processing", 26],
      ["Pending", 20],
      ["Cancelled", 10],
    ]);
    const paymentStatus: PaymentStatus =
      status === "Completed"
        ? weighted<PaymentStatus>(rng, [
            ["Paid", 72],
            ["Partially Paid", 18],
            ["Refunded", 10],
          ])
        : weighted<PaymentStatus>(rng, [
            ["Unpaid", 60],
            ["Partially Paid", 40],
          ]);
    const fulfillmentStatus: FulfillmentStatus =
      status === "Completed"
        ? "Delivered"
        : status === "Cancelled"
          ? "Unfulfilled"
          : weighted<FulfillmentStatus>(rng, [
              ["Picking", 34],
              ["Packed", 28],
              ["Shipped", 22],
              ["Unfulfilled", 16],
            ]);
    const rep = SALES_REPS[index % SALES_REPS.length];
    const orderDay = -intBetween(rng, 1, 240);

    return {
      id: reference,
      reference,
      customerId: customer.id,
      customerName: customer.tradingName,
      orderDate: isoDate(orderDay),
      requiredDate: isoDate(orderDay + intBetween(rng, 5, 30)),
      channel: CHANNELS[index % CHANNELS.length],
      salesRep: rep,
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      currency: customer.currency,
      status,
      paymentStatus,
      fulfillmentStatus,
      items,
      ...totals,
      billingAddress: customer.billingAddress,
      shippingAddress: customer.shippingAddress,
      notes:
        index % 4 === 0
          ? "Deliver to goods receiving between 08:00 and 14:00. Booking reference required at the gate."
          : "Standard trade terms apply. Contact the account manager for consolidated delivery requests.",
      timeline: orderTimeline(reference, status, rep),
    };
  });
}

export const orders: Order[] = buildOrders();
export const orderById = (id: string) => orders.find((order) => order.id === id);

function invoiceTimeline(reference: string, status: InvoiceStatus): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${reference}-i1`,
      title: "Invoice generated",
      description: `${reference} generated from the linked sales order.`,
      timestamp: isoDateTime(-120),
      actor: "Billing Automation",
      tone: "info",
    },
  ];
  if (status !== "Draft") {
    events.push({
      id: `${reference}-i2`,
      title: "Invoice sent to customer",
      description: "Delivered to the registered accounts payable mailbox.",
      timestamp: isoDateTime(-110),
      actor: "Accounts Receivable",
      tone: "info",
    });
  }
  if (status === "Partially Paid" || status === "Paid") {
    events.push({
      id: `${reference}-i3`,
      title: "Payment received",
      description: "Remittance matched against the customer account.",
      timestamp: isoDateTime(-36),
      actor: "Treasury",
      tone: "success",
    });
  }
  if (status === "Overdue") {
    events.push({
      id: `${reference}-i4`,
      title: "Reminder issued",
      description: "First overdue reminder issued to the customer.",
      timestamp: isoDateTime(-24),
      actor: "Credit Control",
      tone: "warning",
    });
  }
  if (status === "Cancelled") {
    events.push({
      id: `${reference}-i5`,
      title: "Invoice cancelled",
      description: "Cancelled and replaced with a corrected document.",
      timestamp: isoDateTime(-18),
      actor: "Credit Control",
      tone: "danger",
    });
  }
  return events;
}

function buildInvoices(): Invoice[] {
  const rng = createRng(20255522);

  return Array.from({ length: 62 }, (_, index) => {
    const order = orders[(index * 3) % orders.length];
    const customer = customers.find((entry) => entry.id === order.customerId) ?? customers[0];
    const reference = `INV-${2026000 + index + 1}`;
    const items = order.items;
    const totals = totalsFor(items);
    const status = weighted<InvoiceStatus>(rng, [
      ["Paid", 38],
      ["Sent", 20],
      ["Partially Paid", 14],
      ["Overdue", 16],
      ["Draft", 7],
      ["Cancelled", 5],
    ]);
    const amountPaid =
      status === "Paid"
        ? totals.total
        : status === "Partially Paid"
          ? Math.round(totals.total * moneyBetween(rng, 0.2, 0.75) * 100) / 100
          : 0;
    const issueDay = -intBetween(rng, 2, 200);

    return {
      id: reference,
      reference,
      orderId: order.id,
      customerId: customer.id,
      customerName: customer.tradingName,
      issueDate: isoDate(issueDay),
      dueDate: isoDate(issueDay + 30),
      currency: customer.currency,
      status,
      items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
      amountPaid,
      balanceDue: Math.round((totals.total - amountPaid) * 100) / 100,
      notes: "Payment is due within 30 days of the invoice date. Reference the invoice number on all remittances.",
      billingAddress: customer.billingAddress,
      timeline: invoiceTimeline(reference, status),
    };
  });
}

export const invoices: Invoice[] = buildInvoices();
export const invoiceById = (id: string) => invoices.find((invoice) => invoice.id === id);

function buildQuotes(): Quote[] {
  const rng = createRng(20261212);

  return Array.from({ length: 38 }, (_, index) => {
    const customer = customers[(index * 5) % customers.length];
    const reference = `QTE-${5100 + index}`;
    const items = buildLineItems(rng, intBetween(rng, 2, 7), reference);
    const totals = totalsFor(items);
    const createdDay = -intBetween(rng, 1, 120);
    const status = weighted<QuoteStatus>(rng, [
      ["Sent", 24],
      ["Viewed", 18],
      ["Accepted", 22],
      ["Draft", 12],
      ["Rejected", 13],
      ["Expired", 11],
    ]);

    return {
      id: reference,
      reference,
      customerId: customer.id,
      customerName: customer.tradingName,
      createdDate: isoDate(createdDay),
      expiryDate: isoDate(createdDay + 30),
      salesRep: SALES_REPS[index % SALES_REPS.length],
      currency: customer.currency,
      status,
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      probability: intBetween(rng, 10, 95),
      notes: "Pricing is valid for 30 days and excludes delivery outside the listed metro regions.",
    };
  });
}

export const quotes: Quote[] = buildQuotes();
export const quoteById = (id: string) => quotes.find((quote) => quote.id === id);

const PAYMENT_METHODS: PaymentMethod[] = ["Bank Transfer", "Card", "Cash", "Electronic Transfer", "Debit Order"];

function buildPayments(): Payment[] {
  const rng = createRng(20250808);

  return Array.from({ length: 74 }, (_, index) => {
    const isCustomer = index % 3 !== 2;
    const invoice = invoices[index % invoices.length];
    const reference = `PAY-${88100 + index}`;

    return {
      id: reference,
      reference,
      date: isoDate(-intBetween(rng, 1, 180)),
      party: isCustomer ? invoice.customerName : `Supplier Account ${padNumber(intBetween(rng, 1, 34), 4)}`,
      partyType: isCustomer ? "Customer" : "Supplier",
      documentRef: isCustomer ? invoice.reference : `SINV-${9200 + index}`,
      amount: Math.round(moneyBetween(rng, 4800, 840000) * 100) / 100,
      currency: "ZAR",
      method: PAYMENT_METHODS[index % PAYMENT_METHODS.length],
      status: weighted(rng, [
        ["Cleared", 72],
        ["Pending", 16],
        ["Failed", 6],
        ["Reversed", 6],
      ] as const),
      account: pick(rng, [
        "Enterprise Current Account",
        "Enterprise Collections Account",
        "Enterprise Payables Account",
      ]),
    };
  });
}

export const payments: Payment[] = buildPayments();

export const salesReps = SALES_REPS;
