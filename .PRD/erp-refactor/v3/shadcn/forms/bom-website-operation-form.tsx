"use client";

// Form for BOM Website Operation
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BomWebsiteOperation } from "../types/bom-website-operation.js";
import { BomWebsiteOperationInsertSchema } from "../types/bom-website-operation.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BomWebsiteOperationFormProps {
  initialData?: Partial<BomWebsiteOperation>;
  onSubmit: (data: Partial<BomWebsiteOperation>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BomWebsiteOperationForm({ initialData = {}, onSubmit, mode, isLoading }: BomWebsiteOperationFormProps) {
  const form = useForm<Partial<BomWebsiteOperation>>({
    resolver: zodResolver(BomWebsiteOperationInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "BOM Website Operation" : "New BOM Website Operation"}
        </h2>
            <FormField control={form.control} name="operation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operation (→ Operation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Operation..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="workstation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Workstation (→ Workstation)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Workstation..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="time_in_mins" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Operation Time</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="website_image" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Image</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="thumbnail" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Thumbnail</FormLabel>
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