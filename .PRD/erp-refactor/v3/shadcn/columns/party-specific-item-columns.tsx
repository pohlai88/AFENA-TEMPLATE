"use client";

// Column definitions for Party Specific Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PartySpecificItem } from "../types/party-specific-item.js";

export const partySpecificItemColumns: ColumnDef<PartySpecificItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "party_type",
    header: "Party Type",
  },
  {
    accessorKey: "party",
    header: "Party Name",
  },
  {
    accessorKey: "restrict_based_on",
    header: "Restrict Items Based On",
  },
  {
    accessorKey: "based_on_value",
    header: "Based On Value",
  },
];