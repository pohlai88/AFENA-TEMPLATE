"use client";

// Column definitions for Task Depends On
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TaskDependsOn } from "../types/task-depends-on.js";

export const taskDependsOnColumns: ColumnDef<TaskDependsOn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "task",
    header: "Task",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
];