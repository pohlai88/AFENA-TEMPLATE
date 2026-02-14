"use client";

// Form for Appointment
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Appointment } from "../types/appointment.js";
import { AppointmentInsertSchema } from "../types/appointment.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AppointmentFormProps {
  initialData?: Partial<Appointment>;
  onSubmit: (data: Partial<Appointment>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AppointmentForm({ initialData = {}, onSubmit, mode, isLoading }: AppointmentFormProps) {
  const form = useForm<Partial<Appointment>>({
    resolver: zodResolver(AppointmentInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Appointment" : "New Appointment"}
        </h2>
            <FormField control={form.control} name="scheduled_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Scheduled Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Unverified">Unverified</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="customer_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer_phone_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Phone Number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer_skype" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Skype ID</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer_email" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Email</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer_details" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Details</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Linked Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="appointment_with" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Appointment With (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="party" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Party</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="calendar_event" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Calendar Event (→ Event)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Event..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
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