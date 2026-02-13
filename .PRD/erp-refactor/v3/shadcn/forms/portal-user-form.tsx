"use client";

// Form for Portal User
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PortalUser } from "../types/portal-user.js";
import { PortalUserInsertSchema } from "../types/portal-user.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PortalUserFormProps {
  initialData?: Partial<PortalUser>;
  onSubmit: (data: Partial<PortalUser>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PortalUserForm({ initialData = {}, onSubmit, mode, isLoading }: PortalUserFormProps) {
  const form = useForm<Partial<PortalUser>>({
    resolver: zodResolver(PortalUserInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Portal User" : "New Portal User"}
        </h2>
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