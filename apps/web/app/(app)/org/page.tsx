import { redirect } from 'next/navigation';

import { ensurePersonalOrg, listUserOrgs } from '@/lib/org';

/**
 * /org entry point — redirects to the user's first org.
 * If user has no orgs, creates a personal workspace first.
 */
export default async function OrgIndexPage() {
  // Ensure user has at least one org (idempotent)
  const newSlug = await ensurePersonalOrg();

  if (newSlug) {
    redirect(`/org/${newSlug}`);
  }

  // User already has orgs — redirect to first one
  const orgs = await listUserOrgs();

  if (orgs.length > 0) {
    redirect(`/org/${orgs[0]?.orgSlug}`);
  }

  // Fallback — should not happen
  redirect('/');
}
