"use client";

// Column definitions for SMS Center
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SmsCenter } from "../types/sms-center.js";

export const smsCenterColumns: ColumnDef<SmsCenter>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "send_to",
    header: "Send To",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
];