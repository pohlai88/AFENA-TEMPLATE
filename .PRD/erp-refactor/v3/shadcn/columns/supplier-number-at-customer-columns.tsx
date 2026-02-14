"use client";

// Column definitions for Supplier Number At Customer
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierNumberAtCustomer } from "../types/supplier-number-at-customer.js";

export const supplierNumberAtCustomerColumns: ColumnDef<SupplierNumberAtCustomer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "supplier_number",
    header: "Supplier Number",
  },
];