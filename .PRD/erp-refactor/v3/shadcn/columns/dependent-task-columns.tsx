"use client";

// Column definitions for Dependent Task
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DependentTask } from "../types/dependent-task.js";

export const dependentTaskColumns: ColumnDef<DependentTask>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "task",
    header: "Task",
  },
];