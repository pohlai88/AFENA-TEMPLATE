"use client";

// Column definitions for Market Segment
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { MarketSegment } from "../types/market-segment.js";

export const marketSegmentColumns: ColumnDef<MarketSegment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "market_segment",
    header: "Market Segment",
  },
];