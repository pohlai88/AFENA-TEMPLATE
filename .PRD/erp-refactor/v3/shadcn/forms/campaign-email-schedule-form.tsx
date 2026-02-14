"use client";

// Form for Campaign Email Schedule
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CampaignEmailSchedule } from "../types/campaign-email-schedule.js";
import { CampaignEmailScheduleInsertSchema } from "../types/campaign-email-schedule.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CampaignEmailScheduleFormProps {
  initialData?: Partial<CampaignEmailSchedule>;
  onSubmit: (data: Partial<CampaignEmailSchedule>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CampaignEmailScheduleForm({ initialData = {}, onSubmit, mode, isLoading }: CampaignEmailScheduleFormProps) {
  const form = useForm<Partial<CampaignEmailSchedule>>({
    resolver: zodResolver(CampaignEmailScheduleInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Campaign Email Schedule" : "New Campaign Email Schedule"}
        </h2>
            <FormField control={form.control} name="email_template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Email Template (→ Email Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Email Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="send_after_days" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Send After (days)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
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