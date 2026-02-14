"use client";

// Column definitions for Employee External Work History
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { EmployeeExternalWorkHistory } from "../types/employee-external-work-history.js";

export const employeeExternalWorkHistoryColumns: ColumnDef<EmployeeExternalWorkHistory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company_name",
    header: "Company",
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => {
      const val = row.getValue("salary") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "total_experience",
    header: "Total Experience",
  },
];