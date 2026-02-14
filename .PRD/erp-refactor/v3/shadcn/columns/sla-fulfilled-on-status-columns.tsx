"use client";

// Column definitions for SLA Fulfilled On Status
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SlaFulfilledOnStatus } from "../types/sla-fulfilled-on-status.js";

export const slaFulfilledOnStatusColumns: ColumnDef<SlaFulfilledOnStatus>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];