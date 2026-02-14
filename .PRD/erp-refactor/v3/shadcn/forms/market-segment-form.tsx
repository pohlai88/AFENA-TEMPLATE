"use client";

// Form for Market Segment
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MarketSegment } from "../types/market-segment.js";
import { MarketSegmentInsertSchema } from "../types/market-segment.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface MarketSegmentFormProps {
  initialData?: Partial<MarketSegment>;
  onSubmit: (data: Partial<MarketSegment>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function MarketSegmentForm({ initialData = {}, onSubmit, mode, isLoading }: MarketSegmentFormProps) {
  const form = useForm<Partial<MarketSegment>>({
    resolver: zodResolver(MarketSegmentInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Market Segment" : "New Market Segment"}
        </h2>
            <FormField control={form.control} name="market_segment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Market Segment</FormLabel>
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