"use client";

// Column definitions for Sales Partner
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesPartner } from "../types/sales-partner.js";

export const salesPartnerColumns: ColumnDef<SalesPartner>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "partner_type",
    header: "Partner Type",
  },
  {
    accessorKey: "territory",
    header: "Territory",
  },
];