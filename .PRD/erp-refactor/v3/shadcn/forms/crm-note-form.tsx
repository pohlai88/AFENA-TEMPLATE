"use client";

// Form for CRM Note
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CrmNote } from "../types/crm-note.js";
import { CrmNoteInsertSchema } from "../types/crm-note.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CrmNoteFormProps {
  initialData?: Partial<CrmNote>;
  onSubmit: (data: Partial<CrmNote>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CrmNoteForm({ initialData = {}, onSubmit, mode, isLoading }: CrmNoteFormProps) {
  const form = useForm<Partial<CrmNote>>({
    resolver: zodResolver(CrmNoteInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "CRM Note" : "New CRM Note"}
        </h2>
            <FormField control={form.control} name="note" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Note</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="added_by" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Added By (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="added_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Added On</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...f} value={(f.value as string) ?? ""} />
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