"use client";

// Column definitions for Quality Meeting Agenda
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { QualityMeetingAgenda } from "../types/quality-meeting-agenda.js";

export const qualityMeetingAgendaColumns: ColumnDef<QualityMeetingAgenda>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "agenda",
    header: "Agenda",
  },
];