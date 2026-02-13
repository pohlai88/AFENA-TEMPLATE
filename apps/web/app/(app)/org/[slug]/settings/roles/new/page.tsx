import { notFound } from 'next/navigation';

import { getOrgContext } from '../../../_server/org-context_server';
import { PageHeader } from '../../../_components/crud/client/page-header';

import { NewRoleForm } from './_components/new-role-form_client';

export default async function NewRolePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ctx = await getOrgContext(slug);
  if (!ctx) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Role"
        description="Create a new role for your organization"
      />
      <NewRoleForm orgSlug={slug} />
    </div>
  );
}
