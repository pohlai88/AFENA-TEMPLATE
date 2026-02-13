"use client";

// Form for Quality Action Resolution
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { QualityActionResolution } from "../types/quality-action-resolution.js";
import { QualityActionResolutionInsertSchema } from "../types/quality-action-resolution.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface QualityActionResolutionFormProps {
  initialData?: Partial<QualityActionResolution>;
  onSubmit: (data: Partial<QualityActionResolution>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function QualityActionResolutionForm({ initialData = {}, onSubmit, mode, isLoading }: QualityActionResolutionFormProps) {
  const form = useForm<Partial<QualityActionResolution>>({
    resolver: zodResolver(QualityActionResolutionInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Quality Action Resolution" : "New Quality Action Resolution"}
        </h2>
            <FormField control={form.control} name="problem" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Problem</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="resolution" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Resolution</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="responsible" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Responsible (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="completion_by" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Completion By</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
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