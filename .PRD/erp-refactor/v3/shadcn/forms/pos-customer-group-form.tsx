"use client";

// Form for POS Customer Group
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PosCustomerGroup } from "../types/pos-customer-group.js";
import { PosCustomerGroupInsertSchema } from "../types/pos-customer-group.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PosCustomerGroupFormProps {
  initialData?: Partial<PosCustomerGroup>;
  onSubmit: (data: Partial<PosCustomerGroup>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PosCustomerGroupForm({ initialData = {}, onSubmit, mode, isLoading }: PosCustomerGroupFormProps) {
  const form = useForm<Partial<PosCustomerGroup>>({
    resolver: zodResolver(PosCustomerGroupInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "POS Customer Group" : "New POS Customer Group"}
        </h2>
            <FormField control={form.control} name="customer_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Group (→ Customer Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer Group..." {...f} value={(f.value as string) ?? ""} />
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