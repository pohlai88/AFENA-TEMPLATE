"use client";

// Column definitions for Subcontracting Receipt Supplied Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubcontractingReceiptSuppliedItem } from "../types/subcontracting-receipt-supplied-item.js";

export const subcontractingReceiptSuppliedItemColumns: ColumnDef<SubcontractingReceiptSuppliedItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "main_item_code",
    header: "Item Code",
  },
  {
    accessorKey: "rm_item_code",
    header: "Raw Material Item Code",
  },
  {
    accessorKey: "bom_detail_no",
    header: "BOM Detail No",
  },
  {
    accessorKey: "reference_name",
    header: "Reference Name",
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
    accessorKey: "required_qty",
    header: "Required Qty",
  },
  {
    accessorKey: "consumed_qty",
    header: "Consumed Qty",
  },
  {
    accessorKey: "serial_and_batch_bundle",
    header: "Serial / Batch Bundle",
  },
];