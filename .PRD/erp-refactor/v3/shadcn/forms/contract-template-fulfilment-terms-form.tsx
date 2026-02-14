"use client";

// Form for Contract Template Fulfilment Terms
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContractTemplateFulfilmentTerms } from "../types/contract-template-fulfilment-terms.js";
import { ContractTemplateFulfilmentTermsInsertSchema } from "../types/contract-template-fulfilment-terms.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ContractTemplateFulfilmentTermsFormProps {
  initialData?: Partial<ContractTemplateFulfilmentTerms>;
  onSubmit: (data: Partial<ContractTemplateFulfilmentTerms>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ContractTemplateFulfilmentTermsForm({ initialData = {}, onSubmit, mode, isLoading }: ContractTemplateFulfilmentTermsFormProps) {
  const form = useForm<Partial<ContractTemplateFulfilmentTerms>>({
    resolver: zodResolver(ContractTemplateFulfilmentTermsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Contract Template Fulfilment Terms" : "New Contract Template Fulfilment Terms"}
        </h2>
            <FormField control={form.control} name="requirement" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Requirement</FormLabel>
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