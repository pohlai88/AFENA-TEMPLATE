"use client";

// Form for Price List Country
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PriceListCountry } from "../types/price-list-country.js";
import { PriceListCountryInsertSchema } from "../types/price-list-country.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PriceListCountryFormProps {
  initialData?: Partial<PriceListCountry>;
  onSubmit: (data: Partial<PriceListCountry>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PriceListCountryForm({ initialData = {}, onSubmit, mode, isLoading }: PriceListCountryFormProps) {
  const form = useForm<Partial<PriceListCountry>>({
    resolver: zodResolver(PriceListCountryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Price List Country" : "New Price List Country"}
        </h2>
            <FormField control={form.control} name="country" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Country (→ Country)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Country..." {...f} value={(f.value as string) ?? ""} />
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