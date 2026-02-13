"use client";

// Form for Sales Partner Type
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SalesPartnerType } from "../types/sales-partner-type.js";
import { SalesPartnerTypeInsertSchema } from "../types/sales-partner-type.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SalesPartnerTypeFormProps {
  initialData?: Partial<SalesPartnerType>;
  onSubmit: (data: Partial<SalesPartnerType>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SalesPartnerTypeForm({ initialData = {}, onSubmit, mode, isLoading }: SalesPartnerTypeFormProps) {
  const form = useForm<Partial<SalesPartnerType>>({
    resolver: zodResolver(SalesPartnerTypeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Sales Partner Type" : "New Sales Partner Type"}
        </h2>
            <FormField control={form.control} name="sales_partner_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Partner Type</FormLabel>
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