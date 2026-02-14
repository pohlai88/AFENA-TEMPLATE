"use client";

// Form for Repost Accounting Ledger Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RepostAccountingLedgerSettings } from "../types/repost-accounting-ledger-settings.js";
import { RepostAccountingLedgerSettingsInsertSchema } from "../types/repost-accounting-ledger-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface RepostAccountingLedgerSettingsFormProps {
  initialData?: Partial<RepostAccountingLedgerSettings>;
  onSubmit: (data: Partial<RepostAccountingLedgerSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function RepostAccountingLedgerSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: RepostAccountingLedgerSettingsFormProps) {
  const form = useForm<Partial<RepostAccountingLedgerSettings>>({
    resolver: zodResolver(RepostAccountingLedgerSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Repost Accounting Ledger Settings" : "New Repost Accounting Ledger Settings"}
        </h2>
            <div className="col-span-2">
              <FormLabel className="">Allowed Doctypes</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Repost Allowed Types — integrate with DataTable */}
                <p>Child table for Repost Allowed Types</p>
              </div>
            </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}