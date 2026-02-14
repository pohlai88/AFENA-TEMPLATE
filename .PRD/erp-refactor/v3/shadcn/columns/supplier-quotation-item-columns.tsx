"use client";

// Column definitions for Supplier Quotation Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierQuotationItem } from "../types/supplier-quotation-item.js";

export const supplierQuotationItemColumns: ColumnDef<SupplierQuotationItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      const val = row.getValue("rate") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
];