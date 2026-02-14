"use client";

// Form for Authorization Control
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AuthorizationControl } from "../types/authorization-control.js";
import { AuthorizationControlInsertSchema } from "../types/authorization-control.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AuthorizationControlFormProps {
  initialData?: Partial<AuthorizationControl>;
  onSubmit: (data: Partial<AuthorizationControl>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AuthorizationControlForm({ initialData = {}, onSubmit, mode, isLoading }: AuthorizationControlFormProps) {
  const form = useForm<Partial<AuthorizationControl>>({
    resolver: zodResolver(AuthorizationControlInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Authorization Control" : "New Authorization Control"}
        </h2>


        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}