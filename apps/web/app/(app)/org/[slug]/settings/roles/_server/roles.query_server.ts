import { cache } from 'react';

import { listRoles, getRole, listRolePermissions, listUserRoles } from '@/app/actions/roles';

import type { Role, RolePermission, UserRole } from 'afena-database';

export const fetchRoles = cache(async (): Promise<Role[]> => {
  const response = await listRoles();
  if (!response.ok) return [];
  return response.data as Role[];
});

export const fetchRole = cache(async (id: string): Promise<Role | null> => {
  const response = await getRole(id);
  if (!response.ok) return null;
  return response.data as Role;
});

export const fetchRolePermissions = cache(async (roleId: string): Promise<RolePermission[]> => {
  const response = await listRolePermissions(roleId);
  if (!response.ok) return [];
  return response.data as RolePermission[];
});

export const fetchUserRoleAssignments = cache(async (): Promise<UserRole[]> => {
  const response = await listUserRoles();
  if (!response.ok) return [];
  return response.data as UserRole[];
});
