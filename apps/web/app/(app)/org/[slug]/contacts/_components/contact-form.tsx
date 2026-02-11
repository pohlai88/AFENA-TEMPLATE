'use client';

import { useRouter } from 'next/navigation';

import { Button } from 'afena-ui/components/button';
import { Card, CardContent, CardFooter } from 'afena-ui/components/card';
import { Input } from 'afena-ui/components/input';
import { Label } from 'afena-ui/components/label';
import { Textarea } from 'afena-ui/components/textarea';
import { Building2, FileText, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';

import { createContact, updateContact } from '@/app/actions/contacts';

import type { ApiResponse } from 'afena-canon';

interface ContactFormProps {
  orgSlug: string;
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

export function ContactForm({ orgSlug, contact }: ContactFormProps) {
  const router = useRouter();
  const isEdit = !!contact;

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const company = formData.get('company') as string;
    const notes = formData.get('notes') as string;

    // Build input — only include non-empty optional fields
    const createInput: Record<string, string> = { name };
    if (email) createInput['email'] = email;
    if (phone) createInput['phone'] = phone;
    if (company) createInput['company'] = company;
    if (notes) createInput['notes'] = notes;

    let result: ApiResponse;

    if (isEdit) {
      result = await updateContact(contact.id, contact.version, createInput);
    } else {
      result = await createContact(createInput as { name: string });
    }

    setPending(false);

    if (result.ok) {
      const entityId = result.meta?.receipt?.entityId;
      if (entityId) {
        router.push(`/org/${orgSlug}/contacts/${entityId}`);
      } else {
        router.push(`/org/${orgSlug}/contacts`);
      }
      router.refresh();
    } else {
      setError(result.error?.message ?? 'Something went wrong');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={contact?.name ?? ''}
              placeholder="Full name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={contact?.email ?? ''}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={contact?.phone ?? ''}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Company
            </Label>
            <Input
              id="company"
              name="company"
              defaultValue={contact?.company ?? ''}
              placeholder="Company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={contact?.notes ?? ''}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : isEdit ? 'Update Contact' : 'Create Contact'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
