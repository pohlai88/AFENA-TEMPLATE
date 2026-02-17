import { db, sql } from 'afenda-database';
import { Badge } from 'afenda-ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'afenda-ui/components/card';
import { FileText, Shield, Users } from 'lucide-react';

import { getOrgContext } from './_server/org-context_server';

/**
 * Org dashboard — /org/[slug]
 * Shows quick stats: contacts, audit entries, open advisories.
 * All reads — no domain writes.
 */
export default async function OrgDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ctx = await getOrgContext(slug);

  // Fetch stats in parallel (all reads, safe)
  const [contactCount, auditCount, advisoryCount] = await Promise.all([
    countRows('contacts', ctx?.org.id),
    countRows('audit_logs', ctx?.org.id),
    countOpenAdvisories(ctx?.org.id),
  ]);

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">{ctx?.org.name ?? slug}</h1>
        {ctx?.actor.orgRole && (
          <Badge variant="outline" className="mt-1">
            {ctx.actor.orgRole}
          </Badge>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          title="Contacts"
          value={contactCount}
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          title="Audit Entries"
          value={auditCount}
        />
        <StatCard
          icon={<Shield className="h-5 w-5" />}
          title="Open Advisories"
          value={advisoryCount}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

async function countRows(table: string, orgId: string | undefined): Promise<number> {
  if (!orgId) return 0;
  try {
    const result = await db.execute<{ cnt: string }>(
      sql.raw(`SELECT COUNT(*)::text AS cnt FROM "${table}" WHERE org_id = '${orgId}'`)
    );
    return parseInt(result.rows[0]?.cnt ?? '0', 10);
  } catch {
    return 0;
  }
}

async function countOpenAdvisories(orgId: string | undefined): Promise<number> {
  if (!orgId) return 0;
  try {
    const result = await db.execute<{ cnt: string }>(
      sql.raw(`SELECT COUNT(*)::text AS cnt FROM "advisories" WHERE org_id = '${orgId}' AND status IN ('open', 'ack')`)
    );
    return parseInt(result.rows[0]?.cnt ?? '0', 10);
  } catch {
    return 0;
  }
}
