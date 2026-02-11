import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@neondatabase/auth/react/ui';

export default function DashboardPage() {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-svh">
          <header className="flex items-center justify-between border-b px-6 py-4">
            <h1 className="text-lg font-semibold">Afena</h1>
            <UserButton />
          </header>
          <main className="px-6 py-8">
            <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Personal workspace
            </p>
          </main>
        </div>
      </SignedIn>
    </>
  );
}
