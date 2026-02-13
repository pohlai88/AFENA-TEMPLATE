"use client";

// Column definitions for Telephony Call Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TelephonyCallType } from "../types/telephony-call-type.js";
import { Badge } from "@/components/ui/badge";

export const telephonyCallTypeColumns: ColumnDef<TelephonyCallType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "call_type",
    header: "Call Type",
  },
  {
    id: "docstatus",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).docstatus;
      return (
        <Badge variant={status === 1 ? "default" : "secondary"}>
          {status === 0 ? "Draft" : status === 1 ? "Submitted" : "Cancelled"}
        </Badge>
      );
    },
  },
];