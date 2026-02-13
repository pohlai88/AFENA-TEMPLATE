"use client";

// Column definitions for Coupon Code
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CouponCode } from "../types/coupon-code.js";

export const couponCodeColumns: ColumnDef<CouponCode>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "coupon_type",
    header: "Coupon Type",
  },
  {
    accessorKey: "valid_from",
    header: "Valid From",
    cell: ({ row }) => {
      const val = row.getValue("valid_from") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];