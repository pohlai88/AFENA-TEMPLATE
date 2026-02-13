"use client";

// Form for Closed Document
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ClosedDocument } from "../types/closed-document.js";
import { ClosedDocumentInsertSchema } from "../types/closed-document.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ClosedDocumentFormProps {
  initialData?: Partial<ClosedDocument>;
  onSubmit: (data: Partial<ClosedDocument>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ClosedDocumentForm({ initialData = {}, onSubmit, mode, isLoading }: ClosedDocumentFormProps) {
  const form = useForm<Partial<ClosedDocument>>({
    resolver: zodResolver(ClosedDocumentInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Closed Document" : "New Closed Document"}
        </h2>
            <FormField control={form.control} name="document_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Document Type (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="closed" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Closed</FormLabel>
                </div>
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