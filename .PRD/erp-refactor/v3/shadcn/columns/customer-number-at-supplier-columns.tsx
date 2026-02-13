"use client";

// Column definitions for Customer Number At Supplier
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerNumberAtSupplier } from "../types/customer-number-at-supplier.js";

export const customerNumberAtSupplierColumns: ColumnDef<CustomerNumberAtSupplier>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "customer_number",
    header: "Customer Number",
  },
];