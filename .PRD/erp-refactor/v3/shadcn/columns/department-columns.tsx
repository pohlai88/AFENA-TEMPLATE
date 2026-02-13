"use client";

// Column definitions for Department
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Department } from "../types/department.js";

export const departmentColumns: ColumnDef<Department>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "department_name",
    header: "Department",
  },
  {
    accessorKey: "parent_department",
    header: "Parent Department",
  },
  {
    accessorKey: "is_group",
    header: "Is Group",
    cell: ({ row }) => row.getValue("is_group") ? "Yes" : "No",
  },
];