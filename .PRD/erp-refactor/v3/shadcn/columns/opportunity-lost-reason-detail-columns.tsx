"use client";

// Column definitions for Opportunity Lost Reason Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { OpportunityLostReasonDetail } from "../types/opportunity-lost-reason-detail.js";

export const opportunityLostReasonDetailColumns: ColumnDef<OpportunityLostReasonDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "lost_reason",
    header: "Opportunity Lost Reason",
  },
];