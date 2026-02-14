"use client";

// Column definitions for Sales Partner Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesPartnerType } from "../types/sales-partner-type.js";

export const salesPartnerTypeColumns: ColumnDef<SalesPartnerType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sales_partner_type",
    header: "Sales Partner Type",
  },
];