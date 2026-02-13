"use client";

// Column definitions for Competitor Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CompetitorDetail } from "../types/competitor-detail.js";

export const competitorDetailColumns: ColumnDef<CompetitorDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "competitor",
    header: "Competitor",
  },
];