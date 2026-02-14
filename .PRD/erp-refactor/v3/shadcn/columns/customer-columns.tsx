"use client";

// Column definitions for Customer
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Customer } from "../types/customer.js";

export const customerColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer_group",
    header: "Customer Group",
  },
  {
    accessorKey: "territory",
    header: "Territory",
  },
];