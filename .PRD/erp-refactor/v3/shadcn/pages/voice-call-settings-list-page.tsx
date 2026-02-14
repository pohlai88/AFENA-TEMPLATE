"use client";

// List page for Voice Call Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useVoiceCallSettingsList } from "../hooks/voice-call-settings.hooks.js";
import { voiceCallSettingsColumns } from "../columns/voice-call-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VoiceCallSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useVoiceCallSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Voice Call Settings</h1>
        <Button onClick={() => router.push("/voice-call-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={voiceCallSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/voice-call-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}