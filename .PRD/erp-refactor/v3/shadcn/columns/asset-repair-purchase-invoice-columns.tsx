"use client";

// Column definitions for Asset Repair Purchase Invoice
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetRepairPurchaseInvoice } from "../types/asset-repair-purchase-invoice.js";

export const assetRepairPurchaseInvoiceColumns: ColumnDef<AssetRepairPurchaseInvoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "purchase_invoice",
    header: "Purchase Invoice",
  },
  {
    accessorKey: "expense_account",
    header: "Expense Account",
  },
  {
    accessorKey: "repair_cost",
    header: "Repair Cost",
    cell: ({ row }) => {
      const val = row.getValue("repair_cost") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];