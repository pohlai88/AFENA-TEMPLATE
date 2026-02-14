"use client";

// Column definitions for Quality Goal Objective
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityGoalObjective } from "../types/quality-goal-objective.js";

export const qualityGoalObjectiveColumns: ColumnDef<QualityGoalObjective>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "objective",
    header: "Objective",
  },
  {
    accessorKey: "target",
    header: "Target",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },
];