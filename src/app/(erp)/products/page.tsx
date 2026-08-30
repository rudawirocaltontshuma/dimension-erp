"use client";

import { Boxes, Package, Plus, TrendingUp } from "lucide-react";

import { DataTable } from "@/components/erp/data-table";
import { DemoFormDialog } from "@/components/erp/demo-form-dialog";
import { SectionCard } from "@/components/erp/detail-panels";
import { KpiCard } from "@/components/erp/kpi-card";
import { PageHeader } from "@/components/erp/page-header";
import { type ColumnSpec, columnLabelsFrom, createColumns, uniqueValues } from "@/components/erp/table-columns";
import { Button } from "@/components/ui/button";
import { productCategories, products } from "@/data/erp/products";
import { suppliers } from "@/data/erp/suppliers";
import { formatMoney, formatNumber } from "@/lib/erp/format";
import type { Product } from "@/types/erp";

const specs: ColumnSpec<Product>[] = [
  { id: "sku", header: "SKU", kind: "link", value: (row) => row.sku, href: (row) => `/products/${row.id}` },
  { id: "name", header: "Product", kind: "strong", value: (row) => row.name },
  { id: "category", header: "Category", kind: "muted", value: (row) => row.category },
  { id: "supplier", header: "Supplier", kind: "muted", value: (row) => row.supplierName },
  { id: "price", header: "Price", kind: "money", align: "right", value: (row) => row.price },
  { id: "cost", header: "Cost", kind: "money", align: "right", value: (row) => row.cost },
  { id: "margin", header: "Margin", kind: "percent", align: "right", value: (row) => row.margin },
  { id: "stock", header: "On hand", kind: "number", align: "right", value: (row) => row.stockOnHand },
  { id: "available", header: "Available", kind: "number", align: "right", value: (row) => row.available },
  { id: "reorder", header: "Reorder level", kind: "number", align: "right", value: (row) => row.reorderLevel },
  { id: "status", header: "Status", kind: "status", value: (row) => row.status },
];

const columns = createColumns(specs);
const columnLabels = columnLabelsFrom(specs);

export default function ProductsPage() {
  const stockValue = products.reduce((sum, product) => sum + product.stockOnHand * product.cost, 0);
  const lowStock = products.filter((product) => product.status === "Low Stock").length;
  const outOfStock = products.filter((product) => product.status === "Out of Stock").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="The full Enterprise catalogue across power tools, electrical, automation, safety, packaging and materials handling."
        breadcrumbs={[{ label: "Operations", href: "/dashboard" }, { label: "Products" }]}
        actions={
          <DemoFormDialog
            title="New product"
            description="Add a demonstration catalogue item with pricing and replenishment settings."
            trigger={
              <Button size="sm">
                <Plus data-icon="inline-start" />
                New product
              </Button>
            }
            fields={[
              { name: "name", label: "Product name", required: true },
              { name: "sku", label: "SKU", required: true, placeholder: "NX-CAT-0000" },
              { name: "category", label: "Category", type: "select", required: true, options: productCategories },
              {
                name: "supplier",
                label: "Preferred supplier",
                type: "select",
                options: suppliers.slice(0, 20).map((supplier) => supplier.name),
              },
              { name: "price", label: "Selling price (ZAR)", type: "number", required: true },
              { name: "cost", label: "Standard cost (ZAR)", type: "number", required: true },
              { name: "reorder", label: "Reorder level", type: "number" },
            ]}
          />
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Catalogue items"
          value={formatNumber(products.length)}
          hint={`${productCategories.length} categories`}
          icon={Package}
        />
        <KpiCard label="Catalogue stock value" value={formatMoney(stockValue)} hint="At standard cost" icon={Boxes} />
        <KpiCard
          label="Low stock lines"
          value={formatNumber(lowStock)}
          hint="At or below reorder level"
          icon={TrendingUp}
        />
        <KpiCard label="Out of stock" value={formatNumber(outOfStock)} hint="Requires replenishment" icon={Package} />
      </section>

      <SectionCard title="Product catalogue" description="Select a row to open the product detail screen.">
        <DataTable
          data={products}
          columns={columns}
          columnLabels={columnLabels}
          getRowId={(row) => row.id}
          getSearchText={(row) => `${row.sku} ${row.name} ${row.category} ${row.supplierName} ${row.brand}`}
          searchPlaceholder="Search products, SKUs or suppliers"
          rowHref={(row) => `/products/${row.id}`}
          filters={[
            { id: "category", label: "Category", options: productCategories, getValue: (row) => row.category },
            {
              id: "status",
              label: "Status",
              options: uniqueValues(products, (row) => row.status),
              getValue: (row) => row.status,
            },
            {
              id: "brand",
              label: "Brand",
              options: uniqueValues(products, (row) => row.brand),
              getValue: (row) => row.brand,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}
