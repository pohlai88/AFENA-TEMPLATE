"use client";

// Column definitions for Opportunity Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { OpportunityType } from "../types/opportunity-type.js";

export const opportunityTypeColumns: ColumnDef<OpportunityType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];