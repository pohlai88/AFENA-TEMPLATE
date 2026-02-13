"use client";

// Column definitions for Voice Call Settings
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { VoiceCallSettings } from "../types/voice-call-settings.js";

export const voiceCallSettingsColumns: ColumnDef<VoiceCallSettings>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user",
    header: "User",
  },
];