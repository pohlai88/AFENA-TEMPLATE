"use client";

// Form for Party Link
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PartyLink } from "../types/party-link.js";
import { PartyLinkInsertSchema } from "../types/party-link.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PartyLinkFormProps {
  initialData?: Partial<PartyLink>;
  onSubmit: (data: Partial<PartyLink>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PartyLinkForm({ initialData = {}, onSubmit, mode, isLoading }: PartyLinkFormProps) {
  const form = useForm<Partial<PartyLink>>({
    resolver: zodResolver(PartyLinkInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.primary_party as string) ?? "Party Link" : "New Party Link"}
          </h2>
        </div>
            <FormField control={form.control} name="primary_role" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Primary Role (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().primary_role && (
            <FormField control={form.control} name="secondary_role" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Secondary Role (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().primary_role && (
            <FormField control={form.control} name="primary_party" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Primary Party</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().secondary_role && (
            <FormField control={form.control} name="secondary_party" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Secondary Party</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}