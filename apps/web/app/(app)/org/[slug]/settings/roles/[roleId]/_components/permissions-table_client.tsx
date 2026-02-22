'use client';

import { useRouter } from 'next/navigation';

import { Badge } from 'afenda-ui/components/badge';
import { Button } from 'afenda-ui/components/button';
import { Input } from 'afenda-ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'afenda-ui/components/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'afenda-ui/components/table';
import { Plus, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

import { addRolePermission, removeRolePermission } from '@/app/actions/roles';

import type { RolePermission } from 'afenda-database';

const VERBS = ['create', 'update', 'delete', 'submit', 'cancel', 'amend', 'approve', 'reject', 'restore', '*'] as const;
const SCOPES = ['org', 'self', 'company', 'site', 'team'] as const;

interface PermissionsTableProps {
  permissions: RolePermission[];
  roleId: string;
  orgSlug?: string;
  isSystem: boolean;
}

export function PermissionsTable({ permissions, roleId, isSystem }: PermissionsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [entityType, setEntityType] = useState('');
  const [verb, setVerb] = useState<string>('');
  const [scope, setScope] = useState<string>('org');

  function handleAdd() {
    if (!entityType || !verb) return;
    startTransition(async () => {
      await addRolePermission({ roleId, entityType, verb, scope });
      setEntityType('');
      setVerb('');
      setScope('org');
      router.refresh();
    });
  }

  function handleRemove(permissionId: string) {
    startTransition(async () => {
      await removeRolePermission(permissionId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entity Type</TableHead>
            <TableHead>Verb</TableHead>
            <TableHead>Scope</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((perm) => (
            <TableRow key={perm.id}>
              <TableCell className="font-mono text-sm">{perm.entityType}</TableCell>
              <TableCell>
                <Badge variant={perm.verb === '*' ? 'default' : 'outline'}>
                  {perm.verb}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{perm.scope}</Badge>
              </TableCell>
              <TableCell>
                {!isSystem && (
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    onClick={() => { handleRemove(perm.id); }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {permissions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                No permissions granted yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!isSystem && (
        <div className="flex items-end gap-3 rounded-lg border p-4">
          <div className="flex-1 space-y-1">
            <label htmlFor="perm-entity-type" className="text-xs font-medium text-muted-foreground">Entity Type</label>
            <Input
              id="perm-entity-type"
              placeholder="e.g. contacts, invoices"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
            />
          </div>
          <div className="w-[140px] space-y-1">
            <label htmlFor="perm-verb" className="text-xs font-medium text-muted-foreground">Verb</label>
            <Select value={verb} onValueChange={setVerb}>
              <SelectTrigger>
                <SelectValue placeholder="Select verb" />
              </SelectTrigger>
              <SelectContent>
                {VERBS.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-[120px] space-y-1">
            <label htmlFor="perm-scope" className="text-xs font-medium text-muted-foreground">Scope</label>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCOPES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="sm"
            disabled={isPending || !entityType || !verb}
            onClick={handleAdd}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
