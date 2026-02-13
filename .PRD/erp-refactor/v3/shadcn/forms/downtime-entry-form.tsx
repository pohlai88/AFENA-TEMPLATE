"use client";

// Form for Downtime Entry
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DowntimeEntry } from "../types/downtime-entry.js";
import { DowntimeEntryInsertSchema } from "../types/downtime-entry.js";

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

interface DowntimeEntryFormProps {
  initialData?: Partial<DowntimeEntry>;
  onSubmit: (data: Partial<DowntimeEntry>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function DowntimeEntryForm({ initialData = {}, onSubmit, mode, isLoading }: DowntimeEntryFormProps) {
  const form = useForm<Partial<DowntimeEntry>>({
    resolver: zodResolver(DowntimeEntryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.workstation as string) ?? "Downtime Entry" : "New Downtime Entry"}
          </h2>
        </div>
            <FormField control={form.control} name="naming_series" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Naming Series</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="workstation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Workstation / Machine (→ Workstation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Workstation..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="operator" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operator (→ Employee)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Employee..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="from_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="downtime" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Downtime</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormDescription>In Mins</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Downtime Reason</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="stop_reason" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Stop Reason</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Excessive machine set up time">Excessive machine set up time</SelectItem>
                    <SelectItem value="Unplanned machine maintenance">Unplanned machine maintenance</SelectItem>
                    <SelectItem value="On-machine press checks">On-machine press checks</SelectItem>
                    <SelectItem value="Machine operator errors">Machine operator errors</SelectItem>
                    <SelectItem value="Machine malfunction">Machine malfunction</SelectItem>
                    <SelectItem value="Electricity down">Electricity down</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="remarks" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Remarks</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
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