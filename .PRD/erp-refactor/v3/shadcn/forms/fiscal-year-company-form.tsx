"use client";

// Form for Fiscal Year Company
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FiscalYearCompany } from "../types/fiscal-year-company.js";
import { FiscalYearCompanyInsertSchema } from "../types/fiscal-year-company.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FiscalYearCompanyFormProps {
  initialData?: Partial<FiscalYearCompany>;
  onSubmit: (data: Partial<FiscalYearCompany>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function FiscalYearCompanyForm({ initialData = {}, onSubmit, mode, isLoading }: FiscalYearCompanyFormProps) {
  const form = useForm<Partial<FiscalYearCompany>>({
    resolver: zodResolver(FiscalYearCompanyInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Fiscal Year Company" : "New Fiscal Year Company"}
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