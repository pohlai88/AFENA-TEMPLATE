"use client";

// Column definitions for Employee Group
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { EmployeeGroup } from "../types/employee-group.js";

export const employeeGroupColumns: ColumnDef<EmployeeGroup>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "employee_group_name",
    header: "Name",
  },
];