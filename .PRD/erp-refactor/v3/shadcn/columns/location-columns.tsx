"use client";

// Column definitions for Location
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Location } from "../types/location.js";

export const locationColumns: ColumnDef<Location>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "location_name",
    header: "Location Name",
  },
  {
    accessorKey: "is_group",
    header: "Is Group",
    cell: ({ row }) => row.getValue("is_group") ? "Yes" : "No",
  },
];