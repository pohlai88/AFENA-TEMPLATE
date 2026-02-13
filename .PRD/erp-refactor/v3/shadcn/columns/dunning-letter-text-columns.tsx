"use client";

// Column definitions for Dunning Letter Text
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { DunningLetterText } from "../types/dunning-letter-text.js";

export const dunningLetterTextColumns: ColumnDef<DunningLetterText>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "language",
    header: "Language",
  },
  {
    accessorKey: "body_text",
    header: "Body Text",
  },
  {
    accessorKey: "closing_text",
    header: "Closing Text",
  },
];