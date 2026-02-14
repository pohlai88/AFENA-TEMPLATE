"use client";

// Column definitions for Ledger Health Monitor
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LedgerHealthMonitor } from "../types/ledger-health-monitor.js";

export const ledgerHealthMonitorColumns: ColumnDef<LedgerHealthMonitor>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "monitor_for_last_x_days",
    header: "Monitor for Last 'X' days",
  },
];