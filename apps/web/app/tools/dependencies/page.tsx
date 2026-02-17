'use client';

/**
 * Dependency Graph Visualization
 *
 * Visualizes internal dependencies between workspace packages
 * Uses ReactFlow for interactive graph rendering
 */

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'reactflow/dist/style.css';

// Dynamically import ReactFlow to avoid SSR issues
const ReactFlow = dynamic(() => import('reactflow').then((mod) => mod.default), { ssr: false });

const MiniMap = dynamic(() => import('reactflow').then((mod) => mod.MiniMap), { ssr: false });

const Controls = dynamic(() => import('reactflow').then((mod) => mod.Controls), { ssr: false });

const Background = dynamic(() => import('reactflow').then((mod) => mod.Background), { ssr: false });

interface GraphStats {
  totalPackages: number;
  totalDependencies: number;
  internalDependencies: number;
  externalDependencies: number;
}

export default function DependencyGraphPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGraph() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/tools/dependency-graph');

        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        if (data.error) {
          throw new Error(data.message || data.error);
        }

        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setStats(data.stats || null);
      } catch (err) {
        console.error('Failed to fetch dependency graph:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchGraph();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 text-4xl">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Loading Dependency Graph...
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Analyzing workspace packages</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md text-center">
          <div className="mb-4 text-4xl">❌</div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Failed to Load Graph
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 text-4xl">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">No Packages Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            No workspace packages detected in packages/ or apps/
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            📊 Dependency Graph
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Interactive visualization of workspace package dependencies
          </p>
        </div>
      </header>

      {/* Stats Bar */}
      {stats && (
        <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalPackages}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Packages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.internalDependencies}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Internal Dependencies
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.externalDependencies}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  External Dependencies
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.totalDependencies}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Dependencies</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graph Container */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
          className="bg-gray-50 dark:bg-gray-900"
        >
          <Background />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable className="bg-white dark:bg-gray-800" />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Workspace Package</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-8 bg-gray-400"></div>
                <span className="text-gray-600 dark:text-gray-400">Dependency</span>
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-500">
              💡 Drag to pan • Scroll to zoom • Click node for details
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
