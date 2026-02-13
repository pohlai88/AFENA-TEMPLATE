"use client";

// Column definitions for Routing
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Routing } from "../types/routing.js";

export const routingColumns: ColumnDef<Routing>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "routing_name",
    header: "Routing Name",
  },
  {
    accessorKey: "disabled",
    header: "Disabled",
    cell: ({ row }) => row.getValue("disabled") ? "Yes" : "No",
  },
];