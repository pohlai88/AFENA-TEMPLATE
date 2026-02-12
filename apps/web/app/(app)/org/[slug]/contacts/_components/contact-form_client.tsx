'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'afena-ui/components/form';
import { Input } from 'afena-ui/components/input';
import { Textarea } from 'afena-ui/components/textarea';
import { Building2, FileText, Mail, Phone, User } from 'lucide-react';
import { useForm } from 'react-hook-form';

import {
  EntityFormShell,
} from '../../_components/crud/client/entity-form-shell_client';
import { executeContactAction } from '../_server/contacts.server-actions';

import { contactFormSchema } from './contact-fields';

import type { ContactFormValues } from './contact-fields';
import type { FormState } from '../../_components/crud/client/entity-form-shell_client';
import type { ActionEnvelope } from 'afena-canon';

interface ContactFormProps {
  orgSlug: string;
  orgId: string;
  contact?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    notes: string | null;
    version: number;
  };
}

export function ContactForm({ orgSlug, orgId, contact }: ContactFormProps) {
  const router = useRouter();
  const isEdit = !!contact;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: contact?.name ?? '',
      email: contact?.email ?? '',
      phone: contact?.phone ?? '',
      company: contact?.company ?? '',
      notes: contact?.notes ?? '',
    },
  });

  async function serverAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const raw = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      notes: formData.get('notes') as string,
    };

    const parsed = contactFormSchema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' };
    }

    const input: Record<string, string> = { name: parsed.data.name };
    if (parsed.data.email) input['email'] = parsed.data.email;
    if (parsed.data.phone) input['phone'] = parsed.data.phone;
    if (parsed.data.company) input['company'] = parsed.data.company;
    if (parsed.data.notes) input['notes'] = parsed.data.notes;

    const envelope: ActionEnvelope = {
      clientActionId: crypto.randomUUID(),
      orgId,
      entityType: 'contacts',
      kind: isEdit ? 'update' : 'create',
      ...(isEdit ? { entityId: contact.id } : {}),
    };

    const result = await executeContactAction(envelope, {
      input,
      orgSlug,
      ...(isEdit ? { expectedVersion: contact.version } : {}),
    });

    if (result.ok) {
      const entityId = result.meta?.receipt?.entityId;
      if (entityId) {
        router.push(`/org/${orgSlug}/contacts/${entityId}`);
      } else {
        router.push(`/org/${orgSlug}/contacts`);
      }
      router.refresh();
      return { ok: true };
    }

    return { ok: false, error: result.error?.message ?? 'Something went wrong' };
  }

  return (
    <Form {...form}>
      <EntityFormShell
        action={serverAction}
        submitLabel={isEdit ? 'Update Contact' : 'Create Contact'}
        onCancel={() => router.back()}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Company
              </FormLabel>
              <FormControl>
                <Input placeholder="Company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Notes
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EntityFormShell>
    </Form>
  );
}
