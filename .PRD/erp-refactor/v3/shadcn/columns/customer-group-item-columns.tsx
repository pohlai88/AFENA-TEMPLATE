"use client";

// Column definitions for Customer Group Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerGroupItem } from "../types/customer-group-item.js";

export const customerGroupItemColumns: ColumnDef<CustomerGroupItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer_group",
    header: "Customer Group",
  },
];