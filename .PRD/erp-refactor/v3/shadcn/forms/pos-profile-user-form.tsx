"use client";

// Form for POS Profile User
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PosProfileUser } from "../types/pos-profile-user.js";
import { PosProfileUserInsertSchema } from "../types/pos-profile-user.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface PosProfileUserFormProps {
  initialData?: Partial<PosProfileUser>;
  onSubmit: (data: Partial<PosProfileUser>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PosProfileUserForm({ initialData = {}, onSubmit, mode, isLoading }: PosProfileUserFormProps) {
  const form = useForm<Partial<PosProfileUser>>({
    resolver: zodResolver(PosProfileUserInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "POS Profile User" : "New POS Profile User"}
        </h2>
            <FormField control={form.control} name="default" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Default</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="user" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">User (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
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