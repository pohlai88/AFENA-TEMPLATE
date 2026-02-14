"use client";

// Column definitions for Portal User
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PortalUser } from "../types/portal-user.js";

export const portalUserColumns: ColumnDef<PortalUser>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user",
    header: "User",
  },
];