"use client";

// Column definitions for Project Template Task
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProjectTemplateTask } from "../types/project-template-task.js";

export const projectTemplateTaskColumns: ColumnDef<ProjectTemplateTask>[] = [
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