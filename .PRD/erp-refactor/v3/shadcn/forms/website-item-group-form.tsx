"use client";

// Form for Website Item Group
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { WebsiteItemGroup } from "../types/website-item-group.js";
import { WebsiteItemGroupInsertSchema } from "../types/website-item-group.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface WebsiteItemGroupFormProps {
  initialData?: Partial<WebsiteItemGroup>;
  onSubmit: (data: Partial<WebsiteItemGroup>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function WebsiteItemGroupForm({ initialData = {}, onSubmit, mode, isLoading }: WebsiteItemGroupFormProps) {
  const form = useForm<Partial<WebsiteItemGroup>>({
    resolver: zodResolver(WebsiteItemGroupInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Website Item Group" : "New Website Item Group"}
        </h2>
            <FormField control={form.control} name="item_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Group (→ Item Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Group..." {...f} value={(f.value as string) ?? ""} />
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