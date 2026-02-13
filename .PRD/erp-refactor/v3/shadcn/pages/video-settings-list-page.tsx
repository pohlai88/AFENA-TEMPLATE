"use client";

// List page for Video Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useVideoSettingsList } from "../hooks/video-settings.hooks.js";
import { videoSettingsColumns } from "../columns/video-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VideoSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useVideoSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Video Settings</h1>
        <Button onClick={() => router.push("/video-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={videoSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/video-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}