"use client";

// Form for SMS Center
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SmsCenter } from "../types/sms-center.js";
import { SmsCenterInsertSchema } from "../types/sms-center.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface SmsCenterFormProps {
  initialData?: Partial<SmsCenter>;
  onSubmit: (data: Partial<SmsCenter>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SmsCenterForm({ initialData = {}, onSubmit, mode, isLoading }: SmsCenterFormProps) {
  const form = useForm<Partial<SmsCenter>>({
    resolver: zodResolver(SmsCenterInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "SMS Center" : "New SMS Center"}
        </h2>
            <FormField control={form.control} name="send_to" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Send To</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="All Contact">All Contact</SelectItem>
                    <SelectItem value="All Customer Contact">All Customer Contact</SelectItem>
                    <SelectItem value="All Supplier Contact">All Supplier Contact</SelectItem>
                    <SelectItem value="All Sales Partner Contact">All Sales Partner Contact</SelectItem>
                    <SelectItem value="All Lead (Open)">All Lead (Open)</SelectItem>
                    <SelectItem value="All Employee (Active)">All Employee (Active)</SelectItem>
                    <SelectItem value="All Sales Person">All Sales Person</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().send_to==='All Customer Contact' && (
            <FormField control={form.control} name="customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().send_to==='All Supplier Contact' && (
            <FormField control={form.control} name="supplier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().send_to==='All Sales Partner Contact' && (
            <FormField control={form.control} name="sales_partner" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Partner (→ Sales Partner)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Partner..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().send_to==='All Employee (Active)' && (
            <FormField control={form.control} name="department" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Department (→ Department)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Department..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {form.getValues().send_to==='All Employee (Active)' && (
            <FormField control={form.control} name="branch" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Branch (→ Branch)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Branch..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="receiver_list" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Receiver List</FormLabel>
                <FormControl>
                  <Textarea className="font-mono text-sm" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="message" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Message</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Messages greater than 160 characters will be split into multiple messages</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_characters" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Characters</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_messages" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Message(s)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} disabled />
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