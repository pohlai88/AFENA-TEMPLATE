"use client";

// Column definitions for Landed Cost Vendor Invoice
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LandedCostVendorInvoice } from "../types/landed-cost-vendor-invoice.js";

export const landedCostVendorInvoiceColumns: ColumnDef<LandedCostVendorInvoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "vendor_invoice",
    header: "Vendor Invoice",
  },
  {
    accessorKey: "amount",
    header: "Amount (Company Currency)",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];