"use client";

// Form for Repost Allowed Types
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RepostAllowedTypes } from "../types/repost-allowed-types.js";
import { RepostAllowedTypesInsertSchema } from "../types/repost-allowed-types.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface RepostAllowedTypesFormProps {
  initialData?: Partial<RepostAllowedTypes>;
  onSubmit: (data: Partial<RepostAllowedTypes>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function RepostAllowedTypesForm({ initialData = {}, onSubmit, mode, isLoading }: RepostAllowedTypesFormProps) {
  const form = useForm<Partial<RepostAllowedTypes>>({
    resolver: zodResolver(RepostAllowedTypesInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Repost Allowed Types" : "New Repost Allowed Types"}
        </h2>
            <FormField control={form.control} name="document_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Doctype (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="allowed" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Allowed</FormLabel>
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