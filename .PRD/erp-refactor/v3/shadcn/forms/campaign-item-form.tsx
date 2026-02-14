"use client";

// Form for Campaign Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CampaignItem } from "../types/campaign-item.js";
import { CampaignItemInsertSchema } from "../types/campaign-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CampaignItemFormProps {
  initialData?: Partial<CampaignItem>;
  onSubmit: (data: Partial<CampaignItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CampaignItemForm({ initialData = {}, onSubmit, mode, isLoading }: CampaignItemFormProps) {
  const form = useForm<Partial<CampaignItem>>({
    resolver: zodResolver(CampaignItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Campaign Item" : "New Campaign Item"}
        </h2>
            <FormField control={form.control} name="campaign" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Campaign (→ UTM Campaign)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UTM Campaign..." {...f} value={(f.value as string) ?? ""} />
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