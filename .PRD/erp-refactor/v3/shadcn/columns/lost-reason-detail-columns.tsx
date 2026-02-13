"use client";

// Column definitions for Lost Reason Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LostReasonDetail } from "../types/lost-reason-detail.js";

export const lostReasonDetailColumns: ColumnDef<LostReasonDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "lost_reason",
    header: "Opportunity Lost Reason",
  },
];