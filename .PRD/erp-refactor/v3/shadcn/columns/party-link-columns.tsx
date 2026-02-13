"use client";

// Column definitions for Party Link
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PartyLink } from "../types/party-link.js";

export const partyLinkColumns: ColumnDef<PartyLink>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "primary_role",
    header: "Primary Role",
  },
];