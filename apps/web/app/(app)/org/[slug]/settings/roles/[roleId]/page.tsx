import { notFound } from 'next/navigation';

import { Badge } from 'afena-ui/components/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'afena-ui/components/card';
import { ShieldCheck } from 'lucide-react';

import { PageHeader } from '../../../_components/crud/client/page-header';
import { getOrgContext } from '../../../_server/org-context_server';

import { fetchRole, fetchRolePermissions } from '../_server/roles.query_server';

import { PermissionsTable } from './_components/permissions-table_client';

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ slug: string; roleId: string }>;
}) {
  const { slug, roleId } = await params;
  const [role, permissions, ctx] = await Promise.all([
    fetchRole(roleId),
    fetchRolePermissions(roleId),
    getOrgContext(slug),
  ]);

  if (!ctx || !role) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={role.name}
        description={`Role key: ${role.key}`}
      >
        {role.isSystem && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            System Role
          </Badge>
        )}
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permissions</CardTitle>
          <CardDescription>
            Entity-level verb grants for this role. Each permission specifies what actions
            users with this role can perform on a given entity type.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionsTable
            permissions={permissions}
            roleId={roleId}
            isSystem={role.isSystem}
          />
        </CardContent>
      </Card>
    </div>
  );
}
