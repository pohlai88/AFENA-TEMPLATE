"use client";

// Form for Dunning Letter Text
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DunningLetterText } from "../types/dunning-letter-text.js";
import { DunningLetterTextInsertSchema } from "../types/dunning-letter-text.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DunningLetterTextFormProps {
  initialData?: Partial<DunningLetterText>;
  onSubmit: (data: Partial<DunningLetterText>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function DunningLetterTextForm({ initialData = {}, onSubmit, mode, isLoading }: DunningLetterTextFormProps) {
  const form = useForm<Partial<DunningLetterText>>({
    resolver: zodResolver(DunningLetterTextInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Dunning Letter Text" : "New Dunning Letter Text"}
        </h2>
            <FormField control={form.control} name="language" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Language (→ Language)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Language..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_default_language" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Default Language</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="body_text" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Body Text</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Letter or Email Body Text</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="closing_text" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Closing Text</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Letter or Email Closing Text</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="body_and_closing_text_help" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Body and Closing Text Help</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}