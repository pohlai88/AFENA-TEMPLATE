"use client";

// Column definitions for Lead
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Lead } from "../types/lead.js";

export const leadColumns: ColumnDef<Lead>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "job_title",
    header: "Job Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "company_name",
    header: "Organization Name",
  },
  {
    accessorKey: "territory",
    header: "Territory",
  },
];