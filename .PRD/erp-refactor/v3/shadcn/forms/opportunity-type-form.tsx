"use client";

// Form for Opportunity Type
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OpportunityType } from "../types/opportunity-type.js";
import { OpportunityTypeInsertSchema } from "../types/opportunity-type.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface OpportunityTypeFormProps {
  initialData?: Partial<OpportunityType>;
  onSubmit: (data: Partial<OpportunityType>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function OpportunityTypeForm({ initialData = {}, onSubmit, mode, isLoading }: OpportunityTypeFormProps) {
  const form = useForm<Partial<OpportunityType>>({
    resolver: zodResolver(OpportunityTypeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Opportunity Type" : "New Opportunity Type"}
        </h2>
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