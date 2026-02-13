"use client";

// Column definitions for Asset Maintenance Team
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetMaintenanceTeam } from "../types/asset-maintenance-team.js";

export const assetMaintenanceTeamColumns: ColumnDef<AssetMaintenanceTeam>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "maintenance_team_name",
    header: "Maintenance Team Name",
  },
];