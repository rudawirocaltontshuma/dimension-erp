"use client";

import { useState } from "react";

import { toast } from "sonner";

import { SectionCard } from "@/components/erp/detail-panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SEQUENCES = [
  { id: "order", document: "Sales order", prefix: "ORD-", next: "10493", example: "ORD-10493" },
  { id: "quote", document: "Quotation", prefix: "QTE-", next: "5138", example: "QTE-5138" },
  { id: "invoice", document: "Customer invoice", prefix: "INV-", next: "2026063", example: "INV-2026063" },
  { id: "po", document: "Purchase order", prefix: "PO-", next: "7348", example: "PO-7348" },
  { id: "pr", document: "Purchase request", prefix: "PR-", next: "4234", example: "PR-4234" },
  { id: "grn", document: "Goods receipt", prefix: "GRN-", next: "6136", example: "GRN-6136" },
  { id: "shipment", document: "Shipment", prefix: "SHP-", next: "44164", example: "SHP-44164" },
  { id: "transfer", document: "Stock transfer", prefix: "TRF-", next: "2126", example: "TRF-2126" },
  { id: "adjustment", document: "Stock adjustment", prefix: "ADJ-", next: "5330", example: "ADJ-5330" },
  { id: "expense", document: "Expense claim", prefix: "EXP-", next: "7768", example: "EXP-7768" },
];

export default function NumberingSettingsPage() {
  const [values, setValues] = useState<Record<string, { prefix: string; next: string }>>(() =>
    Object.fromEntries(SEQUENCES.map((sequence) => [sequence.id, { prefix: sequence.prefix, next: sequence.next }])),
  );

  return (
    <SectionCard
      title="Document numbering"
      description="Prefixes and next sequence numbers applied when a document is created."
      action={
        <Button
          size="sm"
          onClick={() =>
            toast.success("Demo changes applied.", {
              description: "Numbering rules are not persisted in this demonstration.",
            })
          }
        >
          Save Demo
        </Button>
      }
    >
      <div className="w-full overflow-x-auto rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Next number</TableHead>
              <TableHead>Preview</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SEQUENCES.map((sequence) => {
              const value = values[sequence.id];
              return (
                <TableRow key={sequence.id}>
                  <TableCell className="font-medium">{sequence.document}</TableCell>
                  <TableCell>
                    <Input
                      className="w-28"
                      aria-label={`${sequence.document} prefix`}
                      value={value.prefix}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [sequence.id]: { ...current[sequence.id], prefix: event.target.value },
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      className="w-32"
                      aria-label={`${sequence.document} next number`}
                      value={value.next}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [sequence.id]: { ...current[sequence.id], next: event.target.value },
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground text-sm">
                    {value.prefix}
                    {value.next}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
