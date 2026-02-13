"use client";

// Form for UAE VAT Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UaeVatSettings } from "../types/uae-vat-settings.js";
import { UaeVatSettingsInsertSchema } from "../types/uae-vat-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface UaeVatSettingsFormProps {
  initialData?: Partial<UaeVatSettings>;
  onSubmit: (data: Partial<UaeVatSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function UaeVatSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: UaeVatSettingsFormProps) {
  const form = useForm<Partial<UaeVatSettings>>({
    resolver: zodResolver(UaeVatSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "UAE VAT Settings" : "New UAE VAT Settings"}
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
            <div className="col-span-2">
              <FormLabel className="">UAE VAT Accounts</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: UAE VAT Account — integrate with DataTable */}
                <p>Child table for UAE VAT Account</p>
              </div>
            </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}