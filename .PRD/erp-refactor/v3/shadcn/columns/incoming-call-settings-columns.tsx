"use client";

// Column definitions for Incoming Call Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { IncomingCallSettings } from "../types/incoming-call-settings.js";

export const incomingCallSettingsColumns: ColumnDef<IncomingCallSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "call_routing",
    header: "Call Routing",
  },
];