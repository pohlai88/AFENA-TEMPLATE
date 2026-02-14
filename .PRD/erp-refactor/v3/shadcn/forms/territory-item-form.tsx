"use client";

// Form for Territory Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TerritoryItem } from "../types/territory-item.js";
import { TerritoryItemInsertSchema } from "../types/territory-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TerritoryItemFormProps {
  initialData?: Partial<TerritoryItem>;
  onSubmit: (data: Partial<TerritoryItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TerritoryItemForm({ initialData = {}, onSubmit, mode, isLoading }: TerritoryItemFormProps) {
  const form = useForm<Partial<TerritoryItem>>({
    resolver: zodResolver(TerritoryItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Territory Item" : "New Territory Item"}
        </h2>
            <FormField control={form.control} name="territory" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Territory (→ Territory)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Territory..." {...f} value={(f.value as string) ?? ""} />
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