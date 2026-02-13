"use client";

// Form for POS Search Fields
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PosSearchFields } from "../types/pos-search-fields.js";
import { PosSearchFieldsInsertSchema } from "../types/pos-search-fields.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface PosSearchFieldsFormProps {
  initialData?: Partial<PosSearchFields>;
  onSubmit: (data: Partial<PosSearchFields>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PosSearchFieldsForm({ initialData = {}, onSubmit, mode, isLoading }: PosSearchFieldsFormProps) {
  const form = useForm<Partial<PosSearchFields>>({
    resolver: zodResolver(PosSearchFieldsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "POS Search Fields" : "New POS Search Fields"}
        </h2>
            <FormField control={form.control} name="field" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Field</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
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