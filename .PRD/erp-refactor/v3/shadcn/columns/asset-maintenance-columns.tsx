"use client";

// Column definitions for Asset Maintenance
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetMaintenance } from "../types/asset-maintenance.js";

export const assetMaintenanceColumns: ColumnDef<AssetMaintenance>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "asset_name",
    header: "Asset Name",
  },
  {
    accessorKey: "maintenance_team",
    header: "Maintenance Team",
  },
];