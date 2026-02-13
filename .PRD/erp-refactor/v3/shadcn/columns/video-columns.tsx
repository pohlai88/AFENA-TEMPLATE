"use client";

// Column definitions for Video
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Video } from "../types/video.js";

export const videoColumns: ColumnDef<Video>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "provider",
    header: "Provider",
  },
  {
    accessorKey: "publish_date",
    header: "Publish Date",
    cell: ({ row }) => {
      const val = row.getValue("publish_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "like_count",
    header: "Likes",
  },
  {
    accessorKey: "view_count",
    header: "Views",
  },
];