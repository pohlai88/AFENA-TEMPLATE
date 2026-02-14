"use client";

// Form for Email Digest Recipient
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmailDigestRecipient } from "../types/email-digest-recipient.js";
import { EmailDigestRecipientInsertSchema } from "../types/email-digest-recipient.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EmailDigestRecipientFormProps {
  initialData?: Partial<EmailDigestRecipient>;
  onSubmit: (data: Partial<EmailDigestRecipient>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function EmailDigestRecipientForm({ initialData = {}, onSubmit, mode, isLoading }: EmailDigestRecipientFormProps) {
  const form = useForm<Partial<EmailDigestRecipient>>({
    resolver: zodResolver(EmailDigestRecipientInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Email Digest Recipient" : "New Email Digest Recipient"}
        </h2>
            <FormField control={form.control} name="recipient" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Recipient (→ User)</FormLabel>
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