"use client";

// List page for Video
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useVideoList } from "../hooks/video.hooks.js";
import { videoColumns } from "../columns/video-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VideoListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useVideoList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Video</h1>
        <Button onClick={() => router.push("/video/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={videoColumns}
              data={data}
              onRowClick={(row) => router.push(`/video/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}