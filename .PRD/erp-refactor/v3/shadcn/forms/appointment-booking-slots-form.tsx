"use client";

// Form for Appointment Booking Slots
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppointmentBookingSlots } from "../types/appointment-booking-slots.js";
import { AppointmentBookingSlotsInsertSchema } from "../types/appointment-booking-slots.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface AppointmentBookingSlotsFormProps {
  initialData?: Partial<AppointmentBookingSlots>;
  onSubmit: (data: Partial<AppointmentBookingSlots>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AppointmentBookingSlotsForm({ initialData = {}, onSubmit, mode, isLoading }: AppointmentBookingSlotsFormProps) {
  const form = useForm<Partial<AppointmentBookingSlots>>({
    resolver: zodResolver(AppointmentBookingSlotsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Appointment Booking Slots" : "New Appointment Booking Slots"}
        </h2>
            <FormField control={form.control} name="day_of_week" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Day Of Week</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Time </FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Time</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}