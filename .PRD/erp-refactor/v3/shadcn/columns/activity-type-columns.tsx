"use client";

// Column definitions for Activity Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ActivityType } from "../types/activity-type.js";

export const activityTypeColumns: ColumnDef<ActivityType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "activity_type",
    header: "Activity Type",
  },
];