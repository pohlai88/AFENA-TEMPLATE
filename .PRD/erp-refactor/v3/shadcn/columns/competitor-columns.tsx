"use client";

// Column definitions for Competitor
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Competitor } from "../types/competitor.js";

export const competitorColumns: ColumnDef<Competitor>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "competitor_name",
    header: "Competitor Name",
  },
  {
    accessorKey: "website",
    header: "Website",
  },
];