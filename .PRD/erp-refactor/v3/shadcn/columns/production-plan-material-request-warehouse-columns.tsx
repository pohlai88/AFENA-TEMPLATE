"use client";

// Column definitions for Production Plan Material Request Warehouse
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProductionPlanMaterialRequestWarehouse } from "../types/production-plan-material-request-warehouse.js";

export const productionPlanMaterialRequestWarehouseColumns: ColumnDef<ProductionPlanMaterialRequestWarehouse>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
];