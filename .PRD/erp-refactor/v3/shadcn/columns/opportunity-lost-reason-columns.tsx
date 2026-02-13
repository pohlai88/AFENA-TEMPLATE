"use client";

// Column definitions for Opportunity Lost Reason
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { OpportunityLostReason } from "../types/opportunity-lost-reason.js";

export const opportunityLostReasonColumns: ColumnDef<OpportunityLostReason>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "lost_reason",
    header: "Lost Reason",
  },
];