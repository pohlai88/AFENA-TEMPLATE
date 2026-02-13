"use client";

// Form for Quality Meeting Agenda
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityMeetingAgenda } from "../types/quality-meeting-agenda.js";
import { QualityMeetingAgendaInsertSchema } from "../types/quality-meeting-agenda.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface QualityMeetingAgendaFormProps {
  initialData?: Partial<QualityMeetingAgenda>;
  onSubmit: (data: Partial<QualityMeetingAgenda>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityMeetingAgendaForm({ initialData = {}, onSubmit, mode, isLoading }: QualityMeetingAgendaFormProps) {
  const form = useForm<Partial<QualityMeetingAgenda>>({
    resolver: zodResolver(QualityMeetingAgendaInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Meeting Agenda" : "New Quality Meeting Agenda"}
        </h2>
            <FormField control={form.control} name="agenda" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Agenda</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
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