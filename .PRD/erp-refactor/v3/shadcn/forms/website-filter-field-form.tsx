"use client";

// Form for Website Filter Field
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { WebsiteFilterField } from "../types/website-filter-field.js";
import { WebsiteFilterFieldInsertSchema } from "../types/website-filter-field.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface WebsiteFilterFieldFormProps {
  initialData?: Partial<WebsiteFilterField>;
  onSubmit: (data: Partial<WebsiteFilterField>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function WebsiteFilterFieldForm({ initialData = {}, onSubmit, mode, isLoading }: WebsiteFilterFieldFormProps) {
  const form = useForm<Partial<WebsiteFilterField>>({
    resolver: zodResolver(WebsiteFilterFieldInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Website Filter Field" : "New Website Filter Field"}
        </h2>
            <FormField control={form.control} name="fieldname" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Fieldname</FormLabel>
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