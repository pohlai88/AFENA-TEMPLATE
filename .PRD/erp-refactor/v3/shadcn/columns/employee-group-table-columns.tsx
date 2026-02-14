"use client";

// Column definitions for Employee Group Table
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { EmployeeGroupTable } from "../types/employee-group-table.js";

export const employeeGroupTableColumns: ColumnDef<EmployeeGroupTable>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "employee",
    header: "Employee",
  },
  {
    accessorKey: "employee_name",
    header: "Employee Name",
  },
  {
    accessorKey: "user_id",
    header: "ERPNext User ID",
  },
];