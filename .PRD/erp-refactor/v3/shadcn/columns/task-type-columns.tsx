"use client";

// Column definitions for Task Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TaskType } from "../types/task-type.js";

export const taskTypeColumns: ColumnDef<TaskType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];