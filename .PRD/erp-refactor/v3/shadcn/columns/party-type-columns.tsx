"use client";

// Column definitions for Party Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PartyType } from "../types/party-type.js";

export const partyTypeColumns: ColumnDef<PartyType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "party_type",
    header: "Party Type",
  },
  {
    accessorKey: "account_type",
    header: "Account Type",
  },
];