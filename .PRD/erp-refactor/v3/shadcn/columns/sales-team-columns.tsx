"use client";

// Column definitions for Sales Team
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesTeam } from "../types/sales-team.js";

export const salesTeamColumns: ColumnDef<SalesTeam>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "sales_person",
    header: "Sales Person",
  },
  {
    accessorKey: "contact_no",
    header: "Contact No.",
  },
  {
    accessorKey: "allocated_percentage",
    header: "Contribution (%)",
  },
  {
    accessorKey: "allocated_amount",
    header: "Contribution to Net Total",
    cell: ({ row }) => {
      const val = row.getValue("allocated_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "commission_rate",
    header: "Commission Rate",
  },
  {
    accessorKey: "incentives",
    header: "Incentives",
    cell: ({ row }) => {
      const val = row.getValue("incentives") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];