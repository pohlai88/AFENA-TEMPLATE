"use client";

// Column definitions for Sales Stage
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesStage } from "../types/sales-stage.js";

export const salesStageColumns: ColumnDef<SalesStage>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "stage_name",
    header: "Stage Name",
  },
];