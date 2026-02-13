"use client";

// Column definitions for Prospect Lead
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProspectLead } from "../types/prospect-lead.js";

export const prospectLeadColumns: ColumnDef<ProspectLead>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "lead",
    header: "Lead",
  },
  {
    accessorKey: "lead_name",
    header: "Lead Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "mobile_no",
    header: "Mobile No",
  },
  {
    accessorKey: "lead_owner",
    header: "Lead Owner",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];