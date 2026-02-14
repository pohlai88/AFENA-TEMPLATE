"use client";

// Column definitions for Communication Medium
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { CommunicationMedium } from "../types/communication-medium.js";

export const communicationMediumColumns: ColumnDef<CommunicationMedium>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "communication_medium_type",
    header: "Communication Medium Type",
  },
];