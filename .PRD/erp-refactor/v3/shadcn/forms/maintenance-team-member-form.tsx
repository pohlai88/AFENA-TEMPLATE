"use client";

// Form for Maintenance Team Member
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MaintenanceTeamMember } from "../types/maintenance-team-member.js";
import { MaintenanceTeamMemberInsertSchema } from "../types/maintenance-team-member.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface MaintenanceTeamMemberFormProps {
  initialData?: Partial<MaintenanceTeamMember>;
  onSubmit: (data: Partial<MaintenanceTeamMember>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function MaintenanceTeamMemberForm({ initialData = {}, onSubmit, mode, isLoading }: MaintenanceTeamMemberFormProps) {
  const form = useForm<Partial<MaintenanceTeamMember>>({
    resolver: zodResolver(MaintenanceTeamMemberInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Maintenance Team Member" : "New Maintenance Team Member"}
        </h2>
            <FormField control={form.control} name="team_member" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Team Member (→ User)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search User..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="full_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Full Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="maintenance_role" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Maintenance Role (→ Role)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Role..." {...f} value={(f.value as string) ?? ""} />
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