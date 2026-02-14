"use client";

// Form for Appointment Booking Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppointmentBookingSettings } from "../types/appointment-booking-settings.js";
import { AppointmentBookingSettingsInsertSchema } from "../types/appointment-booking-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AppointmentBookingSettingsFormProps {
  initialData?: Partial<AppointmentBookingSettings>;
  onSubmit: (data: Partial<AppointmentBookingSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AppointmentBookingSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: AppointmentBookingSettingsFormProps) {
  const form = useForm<Partial<AppointmentBookingSettings>>({
    resolver: zodResolver(AppointmentBookingSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Appointment Booking Settings" : "New Appointment Booking Settings"}
        </h2>
            <FormField control={form.control} name="enable_scheduling" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Appointment Scheduling</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agent Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Availability Of Slots</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Appointment Booking Slots — integrate with DataTable */}
                <p>Child table for Appointment Booking Slots</p>
              </div>
            </div>
            <div className="col-span-2">
              <FormLabel className="">Agents</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Assignment Rule User — integrate with DataTable */}
                <p>Child table for Assignment Rule User</p>
              </div>
            </div>
            <FormField control={form.control} name="holiday_list" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Holiday List (→ Holiday List)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Holiday List..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="appointment_duration" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Appointment Duration (In Minutes)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email_reminders" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Notify Via Email</FormLabel>
                  <FormDescription>Notify customer and agent via email on the day of the appointment.</FormDescription>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="advance_booking_days" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Number of days appointments can be booked in advance</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Success Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="success_redirect_url" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Success Redirect URL</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Leave blank for home.
This is relative to site URL, for example &quot;about&quot; will redirect to &quot;https://yoursitename.com/about&quot;</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}