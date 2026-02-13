"use client";

// Form for Rename Tool
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RenameTool } from "../types/rename-tool.js";
import { RenameToolInsertSchema } from "../types/rename-tool.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RenameToolFormProps {
  initialData?: Partial<RenameTool>;
  onSubmit: (data: Partial<RenameTool>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function RenameToolForm({ initialData = {}, onSubmit, mode, isLoading }: RenameToolFormProps) {
  const form = useForm<Partial<RenameTool>>({
    resolver: zodResolver(RenameToolInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Rename Tool" : "New Rename Tool"}
        </h2>
            <FormField control={form.control} name="select_doctype" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Select DocType (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Type of document to rename.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="file_to_rename" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">File to Rename</FormLabel>
                <FormControl>
                  <Input type="file" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Attach a comma separated .csv file with two columns, one for the old name and one for the new name.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="rename_log" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Rename Log</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
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