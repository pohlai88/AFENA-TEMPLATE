"use client";

// Form for Linked Location
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LinkedLocation } from "../types/linked-location.js";
import { LinkedLocationInsertSchema } from "../types/linked-location.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LinkedLocationFormProps {
  initialData?: Partial<LinkedLocation>;
  onSubmit: (data: Partial<LinkedLocation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LinkedLocationForm({ initialData = {}, onSubmit, mode, isLoading }: LinkedLocationFormProps) {
  const form = useForm<Partial<LinkedLocation>>({
    resolver: zodResolver(LinkedLocationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Linked Location" : "New Linked Location"}
        </h2>
            <FormField control={form.control} name="location" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Location (→ Location)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Location..." {...f} value={(f.value as string) ?? ""} />
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