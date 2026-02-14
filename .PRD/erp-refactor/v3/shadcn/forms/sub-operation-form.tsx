"use client";

// Form for Sub Operation
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubOperation } from "../types/sub-operation.js";
import { SubOperationInsertSchema } from "../types/sub-operation.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SubOperationFormProps {
  initialData?: Partial<SubOperation>;
  onSubmit: (data: Partial<SubOperation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SubOperationForm({ initialData = {}, onSubmit, mode, isLoading }: SubOperationFormProps) {
  const form = useForm<Partial<SubOperation>>({
    resolver: zodResolver(SubOperationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Sub Operation" : "New Sub Operation"}
        </h2>
            <FormField control={form.control} name="operation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operation (→ Operation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Operation..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="time_in_mins" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operation Time</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Time in mins</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Description</FormLabel>
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