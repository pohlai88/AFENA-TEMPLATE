"use client";

// Form for Allowed To Transact With
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AllowedToTransactWith } from "../types/allowed-to-transact-with.js";
import { AllowedToTransactWithInsertSchema } from "../types/allowed-to-transact-with.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AllowedToTransactWithFormProps {
  initialData?: Partial<AllowedToTransactWith>;
  onSubmit: (data: Partial<AllowedToTransactWith>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AllowedToTransactWithForm({ initialData = {}, onSubmit, mode, isLoading }: AllowedToTransactWithFormProps) {
  const form = useForm<Partial<AllowedToTransactWith>>({
    resolver: zodResolver(AllowedToTransactWithInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Allowed To Transact With" : "New Allowed To Transact With"}
        </h2>
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
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