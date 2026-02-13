"use client";

// Column definitions for Ledger Health Monitor Company
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LedgerHealthMonitorCompany } from "../types/ledger-health-monitor-company.js";

export const ledgerHealthMonitorCompanyColumns: ColumnDef<LedgerHealthMonitorCompany>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];