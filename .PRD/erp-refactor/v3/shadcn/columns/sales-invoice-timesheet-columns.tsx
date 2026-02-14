"use client";

// Column definitions for Sales Invoice Timesheet
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SalesInvoiceTimesheet } from "../types/sales-invoice-timesheet.js";

export const salesInvoiceTimesheetColumns: ColumnDef<SalesInvoiceTimesheet>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "activity_type",
    header: "Activity Type",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "billing_hours",
    header: "Billing Hours",
  },
  {
    accessorKey: "billing_amount",
    header: "Billing Amount",
    cell: ({ row }) => {
      const val = row.getValue("billing_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "time_sheet",
    header: "Time Sheet",
  },
];