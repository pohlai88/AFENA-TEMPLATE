"use client";

// Column definitions for Import Supplier Invoice
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ImportSupplierInvoice } from "../types/import-supplier-invoice.js";

export const importSupplierInvoiceColumns: ColumnDef<ImportSupplierInvoice>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "item_code",
    header: "Item Code",
  },
  {
    accessorKey: "supplier_group",
    header: "Supplier Group",
  },
  {
    accessorKey: "tax_account",
    header: "Tax Account",
  },
];