"use client";

// Column definitions for Employee Internal Work History
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { EmployeeInternalWorkHistory } from "../types/employee-internal-work-history.js";

export const employeeInternalWorkHistoryColumns: ColumnDef<EmployeeInternalWorkHistory>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "from_date",
    header: "From Date",
    cell: ({ row }) => {
      const val = row.getValue("from_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "to_date",
    header: "To Date",
    cell: ({ row }) => {
      const val = row.getValue("to_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];