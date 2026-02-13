"use client";

// Column definitions for Subscription
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Subscription } from "../types/subscription.js";

export const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "party",
    header: "Party",
  },
];