"use client";

// Form for Stock Reposting Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StockRepostingSettings } from "../types/stock-reposting-settings.js";
import { StockRepostingSettingsInsertSchema } from "../types/stock-reposting-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockRepostingSettingsFormProps {
  initialData?: Partial<StockRepostingSettings>;
  onSubmit: (data: Partial<StockRepostingSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function StockRepostingSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: StockRepostingSettingsFormProps) {
  const form = useForm<Partial<StockRepostingSettings>>({
    resolver: zodResolver(StockRepostingSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Stock Reposting Settings" : "New Stock Reposting Settings"}
        </h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scheduling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="limit_reposting_timeslot" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Limit timeslot for Stock Reposting</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().limit_reposting_timeslot && (
            <FormField control={form.control} name="start_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().limit_reposting_timeslot && (
            <FormField control={form.control} name="end_time" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().limit_reposting_timeslot && (
            <FormField control={form.control} name="limits_dont_apply_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Limits don't apply on</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Monday">Monday</SelectItem>
                    <SelectItem value="Tuesday">Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Wednesday</SelectItem>
                    <SelectItem value="Thursday">Thursday</SelectItem>
                    <SelectItem value="Friday">Friday</SelectItem>
                    <SelectItem value="Saturday">Saturday</SelectItem>
                    <SelectItem value="Sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="item_based_reposting" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Use Item based reposting</FormLabel>
                </div>
              </FormItem>
            )} />
            {!!form.getValues().item_based_reposting && (
            <FormField control={form.control} name="enable_parallel_reposting" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Enable Parallel Reposting</FormLabel>
                </div>
              </FormItem>
            )} />
            )}
            {form.getValues().item_based_reposting ==== 1 && form.getValues().enable_parallel_reposting ==== 1 && (
            <FormField control={form.control} name="no_of_parallel_reposting" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">No of Parallel Reposting (Per Item)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Errors Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="notify_reposting_error_to_role" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Notify Reposting Error to Role (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
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