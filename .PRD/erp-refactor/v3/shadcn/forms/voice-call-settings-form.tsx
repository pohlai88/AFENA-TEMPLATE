"use client";

// Form for Voice Call Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VoiceCallSettings } from "../types/voice-call-settings.js";
import { VoiceCallSettingsInsertSchema } from "../types/voice-call-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface VoiceCallSettingsFormProps {
  initialData?: Partial<VoiceCallSettings>;
  onSubmit: (data: Partial<VoiceCallSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function VoiceCallSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: VoiceCallSettingsFormProps) {
  const form = useForm<Partial<VoiceCallSettings>>({
    resolver: zodResolver(VoiceCallSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Voice Call Settings" : "New Voice Call Settings"}
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
            <FormField control={form.control} name="call_receiving_device" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Call Receiving Device</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Computer">Computer</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
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

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}