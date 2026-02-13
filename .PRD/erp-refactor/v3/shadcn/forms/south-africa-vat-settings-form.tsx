"use client";

// Form for South Africa VAT Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SouthAfricaVatSettings } from "../types/south-africa-vat-settings.js";
import { SouthAfricaVatSettingsInsertSchema } from "../types/south-africa-vat-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SouthAfricaVatSettingsFormProps {
  initialData?: Partial<SouthAfricaVatSettings>;
  onSubmit: (data: Partial<SouthAfricaVatSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SouthAfricaVatSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: SouthAfricaVatSettingsFormProps) {
  const form = useForm<Partial<SouthAfricaVatSettings>>({
    resolver: zodResolver(SouthAfricaVatSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "South Africa VAT Settings" : "New South Africa VAT Settings"}
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
              <FormLabel className="">VAT Accounts</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: South Africa VAT Account — integrate with DataTable */}
                <p>Child table for South Africa VAT Account</p>
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