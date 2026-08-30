"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import type { ErpColumns, ErpRow } from "@/components/erp/data-table";
import { StatusBadge } from "@/components/erp/status-badge";
import { formatDate, formatMoney, formatNumber, formatPercent } from "@/lib/erp/format";
import type { CurrencyCode } from "@/types/erp";

export type ColumnKind =
  | "text"
  | "muted"
  | "strong"
  | "money"
  | "number"
  | "percent"
  | "date"
  | "status"
  | "link"
  | "custom";

export interface ColumnSpec<T> {
  id: string;
  header: string;
  kind?: ColumnKind;
  value: (row: T) => string | number;
  href?: (row: T) => string;
  currency?: (row: T) => CurrencyCode;
  align?: "left" | "right";
  sortable?: boolean;
  hideable?: boolean;
  render?: (row: T) => ReactNode;
}

function renderCell<T>(spec: ColumnSpec<T>, row: T): ReactNode {
  const value = spec.value(row);
  switch (spec.kind) {
    case "money":
      return <span className="tabular-nums">{formatMoney(Number(value), spec.currency?.(row) ?? "ZAR")}</span>;
    case "number":
      return <span className="tabular-nums">{formatNumber(Number(value))}</span>;
    case "percent":
      return <span className="tabular-nums">{formatPercent(Number(value))}</span>;
    case "date":
      return <span className="text-muted-foreground">{formatDate(String(value))}</span>;
    case "status":
      return <StatusBadge status={String(value)} />;
    case "muted":
      return <span className="text-muted-foreground">{String(value)}</span>;
    case "strong":
      return <span className="font-medium">{String(value)}</span>;
    case "link":
      return (
        <Link
          prefetch={false}
          href={spec.href?.(row) ?? "#"}
          className="font-medium text-primary hover:underline"
          onClick={(event) => event.stopPropagation()}
        >
          {String(value)}
        </Link>
      );
    case "custom":
      return spec.render?.(row) ?? null;
    default:
      return String(value);
  }
}

export function createColumns<T>(specs: ColumnSpec<T>[]): ErpColumns<T> {
  return specs.map((spec) => ({
    id: spec.id,
    accessorFn: (row: ErpRow<T>) => spec.value(row as T),
    header: () => <span className={spec.align === "right" ? "block text-right" : undefined}>{spec.header}</span>,
    cell: ({ row }: { row: { original: ErpRow<T> } }) => (
      <div className={spec.align === "right" ? "text-right" : undefined}>{renderCell(spec, row.original as T)}</div>
    ),
    enableSorting: spec.sortable ?? true,
    enableHiding: spec.hideable ?? true,
  })) as ErpColumns<T>;
}

export function columnLabelsFrom<T>(specs: ColumnSpec<T>[]): Record<string, string> {
  return specs.reduce<Record<string, string>>((labels, spec) => {
    labels[spec.id] = spec.header;
    return labels;
  }, {});
}

export function uniqueValues<T>(rows: T[], getValue: (row: T) => string): string[] {
  return Array.from(new Set(rows.map(getValue)))
    .filter(Boolean)
    .sort();
}
