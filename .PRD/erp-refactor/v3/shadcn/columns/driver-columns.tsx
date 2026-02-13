"use client";

// Column definitions for Driver
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Driver } from "../types/driver.js";

export const driverColumns: ColumnDef<Driver>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "employee",
    header: "Employee",
  },
  {
    accessorKey: "user",
    header: "User",
  },
];