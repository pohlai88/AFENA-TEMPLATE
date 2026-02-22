import { QualityDashboard } from '@/src/components/quality-dashboard-enhanced';

export const dynamic = 'force-dynamic';

export default async function QualityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
            📊 Quality Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Real-time code quality metrics and insights
          </p>
        </header>

        <QualityDashboard />
      </div>
    </div>
  );
}
