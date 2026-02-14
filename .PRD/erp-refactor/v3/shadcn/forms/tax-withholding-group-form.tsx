"use client";

// Form for Tax Withholding Group
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TaxWithholdingGroup } from "../types/tax-withholding-group.js";
import { TaxWithholdingGroupInsertSchema } from "../types/tax-withholding-group.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TaxWithholdingGroupFormProps {
  initialData?: Partial<TaxWithholdingGroup>;
  onSubmit: (data: Partial<TaxWithholdingGroup>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TaxWithholdingGroupForm({ initialData = {}, onSubmit, mode, isLoading }: TaxWithholdingGroupFormProps) {
  const form = useForm<Partial<TaxWithholdingGroup>>({
    resolver: zodResolver(TaxWithholdingGroupInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Tax Withholding Group" : "New Tax Withholding Group"}
        </h2>
            <FormField control={form.control} name="group_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Group Name</FormLabel>
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