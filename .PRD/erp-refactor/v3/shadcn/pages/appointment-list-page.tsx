"use client";

// List page for Appointment
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAppointmentList } from "../hooks/appointment.hooks.js";
import { appointmentColumns } from "../columns/appointment-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AppointmentListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAppointmentList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Appointment</h1>
        <Button onClick={() => router.push("/appointment/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={appointmentColumns}
              data={data}
              onRowClick={(row) => router.push(`/appointment/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}