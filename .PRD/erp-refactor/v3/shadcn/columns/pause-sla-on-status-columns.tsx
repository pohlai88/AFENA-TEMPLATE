"use client";

// Column definitions for Pause SLA On Status
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PauseSlaOnStatus } from "../types/pause-sla-on-status.js";

export const pauseSlaOnStatusColumns: ColumnDef<PauseSlaOnStatus>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];