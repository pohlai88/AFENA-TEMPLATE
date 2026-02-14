"use client";

// Column definitions for Driving License Category
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DrivingLicenseCategory } from "../types/driving-license-category.js";

export const drivingLicenseCategoryColumns: ColumnDef<DrivingLicenseCategory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "class",
    header: "Driver licence class",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "issuing_date",
    header: "Issuing Date",
    cell: ({ row }) => {
      const val = row.getValue("issuing_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "expiry_date",
    header: "Expiry Date",
    cell: ({ row }) => {
      const val = row.getValue("expiry_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];