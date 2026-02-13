"use client";

// Column definitions for Employee
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Employee } from "../types/employee.js";

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "employee_name",
    header: "Full Name",
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
];