'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Client-side logging example
    // eslint-disable-next-line no-console
    console.log('Page loaded at:', new Date().toISOString());
  }, []);

  const testApiLogging = async () => {
    setIsLoading(true);
    setLogs([]);

    try {
      // Test GET request
      const getResponse = await fetch('/api/example');
      const getData: unknown = await getResponse.json();
      setLogs(prev => [...prev, `GET: ${JSON.stringify(getData)}`]);

      // Test POST request
      const postResponse = await fetch('/api/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Afena User' }),
      });
      const postData: unknown = await postResponse.json();
      setLogs(prev => [...prev, `POST: ${JSON.stringify(postData)}`]);

      // Test error case
      const errorResponse = await fetch('/api/example', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const errorData: unknown = await errorResponse.json();
      setLogs(prev => [...prev, `Error: ${JSON.stringify(errorData)}`]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setLogs(prev => [...prev, `Client Error: ${message}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Afena Monorepo with Pino Logging
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Structured logging with Pino for improved diagnostics and debugging. Check the console for structured logs.
          </p>
        </div>

        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Test Logging</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Click the button below to test API endpoints with structured logging.
          </p>
          <button
            onClick={() => void testApiLogging()}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? 'Testing...' : 'Test API Logging'}
          </button>

          {logs.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">API Responses:</h4>
              <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded overflow-auto max-h-40">
                {logs.join('\n\n')}
              </pre>
            </div>
          )}
        </div>

        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Logging Features</h2>
          <ul className="text-sm space-y-1 text-zinc-600 dark:text-zinc-400">
            <li>• Structured JSON logs</li>
            <li>• Request ID tracking</li>
            <li>• Performance metrics</li>
            <li>• Error tracking with stack traces</li>
            <li>• Redacted sensitive data</li>
            <li>• Environment-specific configs</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
