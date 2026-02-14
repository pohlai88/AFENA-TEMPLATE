"use client";

// Column definitions for Sales Partner Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesPartnerItem } from "../types/sales-partner-item.js";

export const salesPartnerItemColumns: ColumnDef<SalesPartnerItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sales_partner",
    header: "Sales Partner ",
  },
];