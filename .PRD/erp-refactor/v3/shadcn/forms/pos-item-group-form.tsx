"use client";

// Form for POS Item Group
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PosItemGroup } from "../types/pos-item-group.js";
import { PosItemGroupInsertSchema } from "../types/pos-item-group.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PosItemGroupFormProps {
  initialData?: Partial<PosItemGroup>;
  onSubmit: (data: Partial<PosItemGroup>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PosItemGroupForm({ initialData = {}, onSubmit, mode, isLoading }: PosItemGroupFormProps) {
  const form = useForm<Partial<PosItemGroup>>({
    resolver: zodResolver(PosItemGroupInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "POS Item Group" : "New POS Item Group"}
        </h2>
            <FormField control={form.control} name="item_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Group (→ Item Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Group..." {...f} value={(f.value as string) ?? ""} />
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