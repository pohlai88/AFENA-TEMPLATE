"use client";

// Form for Party Type
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PartyType } from "../types/party-type.js";
import { PartyTypeInsertSchema } from "../types/party-type.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface PartyTypeFormProps {
  initialData?: Partial<PartyType>;
  onSubmit: (data: Partial<PartyType>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PartyTypeForm({ initialData = {}, onSubmit, mode, isLoading }: PartyTypeFormProps) {
  const form = useForm<Partial<PartyType>>({
    resolver: zodResolver(PartyTypeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Party Type" : "New Party Type"}
        </h2>
            <FormField control={form.control} name="party_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Party Type (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="account_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Payable">Payable</SelectItem>
                    <SelectItem value="Receivable">Receivable</SelectItem>
                  </SelectContent>
                </Select>
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