"use client";

// Form for Loyalty Program Collection
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoyaltyProgramCollection } from "../types/loyalty-program-collection.js";
import { LoyaltyProgramCollectionInsertSchema } from "../types/loyalty-program-collection.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LoyaltyProgramCollectionFormProps {
  initialData?: Partial<LoyaltyProgramCollection>;
  onSubmit: (data: Partial<LoyaltyProgramCollection>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LoyaltyProgramCollectionForm({ initialData = {}, onSubmit, mode, isLoading }: LoyaltyProgramCollectionFormProps) {
  const form = useForm<Partial<LoyaltyProgramCollection>>({
    resolver: zodResolver(LoyaltyProgramCollectionInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Loyalty Program Collection" : "New Loyalty Program Collection"}
        </h2>
            <FormField control={form.control} name="tier_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tier Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="min_spent" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Minimum Total Spent</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="collection_factor" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Collection Factor (=1 LP)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>For how much spent = 1 Loyalty Point</FormDescription>
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