"use client";

// Column definitions for Project User
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProjectUser } from "../types/project-user.js";

export const projectUserColumns: ColumnDef<ProjectUser>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "view_attachments",
    header: "View attachments",
    cell: ({ row }) => row.getValue("view_attachments") ? "Yes" : "No",
  },
];