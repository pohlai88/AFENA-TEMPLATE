"use client";

// Column definitions for Projects Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProjectsSettings } from "../types/projects-settings.js";

export const projectsSettingsColumns: ColumnDef<ProjectsSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "ignore_workstation_time_overlap",
    header: "Ignore Workstation Time Overlap",
    cell: ({ row }) => row.getValue("ignore_workstation_time_overlap") ? "Yes" : "No",
  },
  {
    accessorKey: "ignore_user_time_overlap",
    header: "Ignore User Time Overlap",
    cell: ({ row }) => row.getValue("ignore_user_time_overlap") ? "Yes" : "No",
  },
  {
    accessorKey: "ignore_employee_time_overlap",
    header: "Ignore Employee Time Overlap",
    cell: ({ row }) => row.getValue("ignore_employee_time_overlap") ? "Yes" : "No",
  },
  {
    accessorKey: "fetch_timesheet_in_sales_invoice",
    header: "Fetch Timesheet in Sales Invoice",
    cell: ({ row }) => row.getValue("fetch_timesheet_in_sales_invoice") ? "Yes" : "No",
  },
];