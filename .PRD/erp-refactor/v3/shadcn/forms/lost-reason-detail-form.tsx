"use client";

// Form for Lost Reason Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LostReasonDetail } from "../types/lost-reason-detail.js";
import { LostReasonDetailInsertSchema } from "../types/lost-reason-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LostReasonDetailFormProps {
  initialData?: Partial<LostReasonDetail>;
  onSubmit: (data: Partial<LostReasonDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LostReasonDetailForm({ initialData = {}, onSubmit, mode, isLoading }: LostReasonDetailFormProps) {
  const form = useForm<Partial<LostReasonDetail>>({
    resolver: zodResolver(LostReasonDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Lost Reason Detail" : "New Lost Reason Detail"}
        </h2>
            <FormField control={form.control} name="lost_reason" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Opportunity Lost Reason (→ Opportunity Lost Reason)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Opportunity Lost Reason..." {...f} value={(f.value as string) ?? ""} />
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