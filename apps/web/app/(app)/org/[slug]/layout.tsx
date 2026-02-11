/**
 * Org-scoped layout — wraps all /org/[slug]/... routes.
 * Provides org context from the URL slug parameter.
 */
export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div data-org-slug={slug}>
      {children}
    </div>
  );
}
