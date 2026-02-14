"use client";

// Column definitions for Prospect Opportunity
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProspectOpportunity } from "../types/prospect-opportunity.js";

export const prospectOpportunityColumns: ColumnDef<ProspectOpportunity>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "opportunity",
    header: "Opportunity",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const val = row.getValue("amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "stage",
    header: "Stage",
  },
  {
    accessorKey: "deal_owner",
    header: "Deal Owner",
  },
  {
    accessorKey: "probability",
    header: "Probability",
  },
  {
    accessorKey: "expected_closing",
    header: "Closing",
    cell: ({ row }) => {
      const val = row.getValue("expected_closing") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];