"use client";

// Column definitions for Quality Review
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityReview } from "../types/quality-review.js";

export const qualityReviewColumns: ColumnDef<QualityReview>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "goal",
    header: "Goal",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];