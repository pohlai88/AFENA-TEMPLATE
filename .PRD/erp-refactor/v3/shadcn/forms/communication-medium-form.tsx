"use client";

// Form for Communication Medium
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CommunicationMedium } from "../types/communication-medium.js";
import { CommunicationMediumInsertSchema } from "../types/communication-medium.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommunicationMediumFormProps {
  initialData?: Partial<CommunicationMedium>;
  onSubmit: (data: Partial<CommunicationMedium>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CommunicationMediumForm({ initialData = {}, onSubmit, mode, isLoading }: CommunicationMediumFormProps) {
  const form = useForm<Partial<CommunicationMedium>>({
    resolver: zodResolver(CommunicationMediumInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Communication Medium" : "New Communication Medium"}
        </h2>
            <FormField control={form.control} name="communication_channel" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Communication Channel</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="communication_medium_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Communication Medium Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Voice">Voice</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Chat">Chat</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="catch_all" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Catch All (→ Employee Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Employee Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>If there is no assigned timeslot, then communication will be handled by this group</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="provider" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Provider (→ Supplier)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Supplier..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="disabled" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Disabled</FormLabel>
                </div>
              </FormItem>
            )} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeslots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormLabel className="">Timeslots</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Communication Medium Timeslot — integrate with DataTable */}
                <p>Child table for Communication Medium Timeslot</p>
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