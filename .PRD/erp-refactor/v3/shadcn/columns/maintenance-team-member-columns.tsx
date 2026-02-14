"use client";

// Column definitions for Maintenance Team Member
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MaintenanceTeamMember } from "../types/maintenance-team-member.js";

export const maintenanceTeamMemberColumns: ColumnDef<MaintenanceTeamMember>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "team_member",
    header: "Team Member",
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "maintenance_role",
    header: "Maintenance Role",
  },
];