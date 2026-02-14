"use client";

// Column definitions for Landed Cost Purchase Receipt
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LandedCostPurchaseReceipt } from "../types/landed-cost-purchase-receipt.js";

export const landedCostPurchaseReceiptColumns: ColumnDef<LandedCostPurchaseReceipt>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "receipt_document_type",
    header: "Receipt Document Type",
  },
  {
    accessorKey: "receipt_document",
    header: "Receipt Document",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "grand_total",
    header: "Grand Total",
    cell: ({ row }) => {
      const val = row.getValue("grand_total") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];