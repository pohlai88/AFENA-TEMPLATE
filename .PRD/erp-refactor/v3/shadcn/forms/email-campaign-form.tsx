"use client";

// Form for Email Campaign
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmailCampaign } from "../types/email-campaign.js";
import { EmailCampaignInsertSchema } from "../types/email-campaign.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface EmailCampaignFormProps {
  initialData?: Partial<EmailCampaign>;
  onSubmit: (data: Partial<EmailCampaign>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function EmailCampaignForm({ initialData = {}, onSubmit, mode, isLoading }: EmailCampaignFormProps) {
  const form = useForm<Partial<EmailCampaign>>({
    resolver: zodResolver(EmailCampaignInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Email Campaign" : "New Email Campaign"}
        </h2>
            <FormField control={form.control} name="campaign_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Campaign (→ Campaign)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Campaign..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email_campaign_for" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Email Campaign For </FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Contact">Contact</SelectItem>
                    <SelectItem value="Email Group">Email Group</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="recipient" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Recipient</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="sender" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sender (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="start_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="end_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Unsubscribed">Unsubscribed</SelectItem>
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