"use client";

// Column definitions for Customer Group
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CustomerGroup } from "../types/customer-group.js";

export const customerGroupColumns: ColumnDef<CustomerGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer_group_name",
    header: "Customer Group Name",
  },
  {
    accessorKey: "parent_customer_group",
    header: "Parent Customer Group",
  },
  {
    accessorKey: "is_group",
    header: "Is Group",
    cell: ({ row }) => row.getValue("is_group") ? "Yes" : "No",
  },
];