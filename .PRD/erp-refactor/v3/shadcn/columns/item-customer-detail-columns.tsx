"use client";

// Column definitions for Item Customer Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemCustomerDetail } from "../types/item-customer-detail.js";

export const itemCustomerDetailColumns: ColumnDef<ItemCustomerDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
  },
  {
    accessorKey: "customer_group",
    header: "Customer Group",
  },
  {
    accessorKey: "ref_code",
    header: "Ref Code",
  },
];