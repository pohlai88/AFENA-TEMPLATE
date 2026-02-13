"use client";

// Column definitions for Task
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Task } from "../types/task.js";

export const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "project",
    header: "Project",
  },
  {
    accessorKey: "is_group",
    header: "Is Group",
    cell: ({ row }) => row.getValue("is_group") ? "Yes" : "No",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "is_milestone",
    header: "Is Milestone",
    cell: ({ row }) => row.getValue("is_milestone") ? "Yes" : "No",
  },
];