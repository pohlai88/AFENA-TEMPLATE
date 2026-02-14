"use client";

// Column definitions for Quality Goal
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityGoal } from "../types/quality-goal.js";

export const qualityGoalColumns: ColumnDef<QualityGoal>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "frequency",
    header: "Monitoring Frequency",
  },
  {
    accessorKey: "procedure",
    header: "Procedure",
  },
];