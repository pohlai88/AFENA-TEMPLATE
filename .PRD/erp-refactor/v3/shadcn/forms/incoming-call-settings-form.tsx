"use client";

// Form for Incoming Call Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IncomingCallSettings } from "../types/incoming-call-settings.js";
import { IncomingCallSettingsInsertSchema } from "../types/incoming-call-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IncomingCallSettingsFormProps {
  initialData?: Partial<IncomingCallSettings>;
  onSubmit: (data: Partial<IncomingCallSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function IncomingCallSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: IncomingCallSettingsFormProps) {
  const form = useForm<Partial<IncomingCallSettings>>({
    resolver: zodResolver(IncomingCallSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Incoming Call Settings" : "New Incoming Call Settings"}
        </h2>
            <FormField control={form.control} name="call_routing" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Call Routing</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sequential">Sequential</SelectItem>
                    <SelectItem value="Simultaneous">Simultaneous</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="greeting_message" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Greeting Message</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="agent_busy_message" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Agent Busy Message</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="agent_unavailable_message" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Agent Unavailable Message</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
      <Card>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Call Handling Schedule</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Incoming Call Handling Schedule — integrate with DataTable */}
                <p>Child table for Incoming Call Handling Schedule</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}