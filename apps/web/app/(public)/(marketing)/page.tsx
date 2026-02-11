import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-lg flex-col items-center gap-8 px-8 py-32 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Afena
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          The modern ERP platform for growing businesses.
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/sign-in"
            className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Sign in
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-md border border-zinc-300 px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
          >
            Get started
          </Link>
        </div>
      </main>
    </div>
  );
}
