import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quality Dashboard | afenda',
  description: 'Real-time code quality metrics and insights',
};

export default function QualityDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
