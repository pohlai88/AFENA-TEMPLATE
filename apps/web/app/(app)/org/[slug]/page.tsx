/**
 * Org dashboard — placeholder for /org/[slug]
 * Will be replaced with actual org dashboard in later phases.
 */
export default async function OrgDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Organization: {slug}</h1>
        <p className="mt-2 text-zinc-500">Org dashboard — Phase 1 placeholder</p>
      </div>
    </div>
  );
}
