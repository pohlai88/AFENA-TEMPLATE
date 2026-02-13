"use client";

// Column definitions for POS Customer Group
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosCustomerGroup } from "../types/pos-customer-group.js";

export const posCustomerGroupColumns: ColumnDef<PosCustomerGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer_group",
    header: "Customer Group",
  },
];