"use client";

// Column definitions for Sales Forecast
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesForecast } from "../types/sales-forecast.js";
import { Badge } from "@/components/ui/badge";

export const salesForecastColumns: ColumnDef<SalesForecast>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "posting_date",
    header: "Posting Date",
    cell: ({ row }) => {
      const val = row.getValue("posting_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "docstatus",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).docstatus;
      return (
        <Badge variant={status === 1 ? "default" : "secondary"}>
          {status === 0 ? "Draft" : status === 1 ? "Submitted" : "Cancelled"}
        </Badge>
      );
    },
  },
];