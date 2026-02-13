"use client";

// Form for Process Statement Of Accounts CC
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProcessStatementOfAccountsCc } from "../types/process-statement-of-accounts-cc.js";
import { ProcessStatementOfAccountsCcInsertSchema } from "../types/process-statement-of-accounts-cc.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProcessStatementOfAccountsCcFormProps {
  initialData?: Partial<ProcessStatementOfAccountsCc>;
  onSubmit: (data: Partial<ProcessStatementOfAccountsCc>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProcessStatementOfAccountsCcForm({ initialData = {}, onSubmit, mode, isLoading }: ProcessStatementOfAccountsCcFormProps) {
  const form = useForm<Partial<ProcessStatementOfAccountsCc>>({
    resolver: zodResolver(ProcessStatementOfAccountsCcInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Process Statement Of Accounts CC" : "New Process Statement Of Accounts CC"}
        </h2>
            <FormField control={form.control} name="cc" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">CC (→ User)</FormLabel>
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