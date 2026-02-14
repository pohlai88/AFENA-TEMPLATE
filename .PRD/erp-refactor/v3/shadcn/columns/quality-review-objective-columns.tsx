"use client";

// Column definitions for Quality Review Objective
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityReviewObjective } from "../types/quality-review-objective.js";

export const qualityReviewObjectiveColumns: ColumnDef<QualityReviewObjective>[] = [
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
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "review",
    header: "Review",
  },
];