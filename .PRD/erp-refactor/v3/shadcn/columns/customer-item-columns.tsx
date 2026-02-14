"use client";

// Column definitions for Customer Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerItem } from "../types/customer-item.js";

export const customerItemColumns: ColumnDef<CustomerItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer",
    header: "Customer ",
  },
];