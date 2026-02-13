"use client";

// Form for Ledger Health Monitor Company
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LedgerHealthMonitorCompany } from "../types/ledger-health-monitor-company.js";
import { LedgerHealthMonitorCompanyInsertSchema } from "../types/ledger-health-monitor-company.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LedgerHealthMonitorCompanyFormProps {
  initialData?: Partial<LedgerHealthMonitorCompany>;
  onSubmit: (data: Partial<LedgerHealthMonitorCompany>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LedgerHealthMonitorCompanyForm({ initialData = {}, onSubmit, mode, isLoading }: LedgerHealthMonitorCompanyFormProps) {
  const form = useForm<Partial<LedgerHealthMonitorCompany>>({
    resolver: zodResolver(LedgerHealthMonitorCompanyInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Ledger Health Monitor Company" : "New Ledger Health Monitor Company"}
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