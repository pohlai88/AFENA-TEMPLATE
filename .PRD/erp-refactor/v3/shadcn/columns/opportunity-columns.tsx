"use client";

// Column definitions for Opportunity
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Opportunity } from "../types/opportunity.js";

export const opportunityColumns: ColumnDef<Opportunity>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "naming_series",
    header: "Series",
  },
  {
    accessorKey: "opportunity_from",
    header: "Opportunity From",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "opportunity_type",
    header: "Opportunity Type",
  },
];