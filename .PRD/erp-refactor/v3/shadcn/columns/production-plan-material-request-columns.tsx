"use client";

// Column definitions for Production Plan Material Request
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProductionPlanMaterialRequest } from "../types/production-plan-material-request.js";

export const productionPlanMaterialRequestColumns: ColumnDef<ProductionPlanMaterialRequest>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "material_request",
    header: "Material Request",
  },
  {
    accessorKey: "material_request_date",
    header: "Material Request Date",
    cell: ({ row }) => {
      const val = row.getValue("material_request_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];