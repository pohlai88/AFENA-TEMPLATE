"use client";

// Form for Industry Type
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IndustryType } from "../types/industry-type.js";
import { IndustryTypeInsertSchema } from "../types/industry-type.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface IndustryTypeFormProps {
  initialData?: Partial<IndustryType>;
  onSubmit: (data: Partial<IndustryType>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function IndustryTypeForm({ initialData = {}, onSubmit, mode, isLoading }: IndustryTypeFormProps) {
  const form = useForm<Partial<IndustryType>>({
    resolver: zodResolver(IndustryTypeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Industry Type" : "New Industry Type"}
        </h2>
            <FormField control={form.control} name="industry" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Industry</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
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