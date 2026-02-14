"use client";

// Form for Customs Tariff Number
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CustomsTariffNumber } from "../types/customs-tariff-number.js";
import { CustomsTariffNumberInsertSchema } from "../types/customs-tariff-number.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CustomsTariffNumberFormProps {
  initialData?: Partial<CustomsTariffNumber>;
  onSubmit: (data: Partial<CustomsTariffNumber>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CustomsTariffNumberForm({ initialData = {}, onSubmit, mode, isLoading }: CustomsTariffNumberFormProps) {
  const form = useForm<Partial<CustomsTariffNumber>>({
    resolver: zodResolver(CustomsTariffNumberInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Customs Tariff Number" : "New Customs Tariff Number"}
        </h2>
            <FormField control={form.control} name="tariff_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tariff Number</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Description</FormLabel>
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