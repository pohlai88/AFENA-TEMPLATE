"use client";

// Column definitions for Plant Floor
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PlantFloor } from "../types/plant-floor.js";

export const plantFloorColumns: ColumnDef<PlantFloor>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "plant_dashboard",
    header: "Plant Dashboard",
  },
  {
    accessorKey: "stock_summary",
    header: "Stock Summary",
  },
  {
    accessorKey: "floor_name",
    header: "Floor Name",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
];