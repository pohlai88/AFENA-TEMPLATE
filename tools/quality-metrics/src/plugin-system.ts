/**
 * Quality Metrics Plugin System
 *
 * Extensible framework for custom quality metrics plugins.
 * Plugins can hook into collection, analysis, and reporting phases.
 *
 * @module plugin-system
 * @since Sprint 6
 */

import { readdir, readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import type { QualitySnapshot } from './collector';

// --- Types ---

export interface CollectContext {
  workspaceRoot: string;
  packages: string[];
  gitBranch: string;
  gitSha: string;
  timestamp: string;
}

// Base type with index signature for plugin data storage
export type MetricData = Record<string, number | string | boolean | object>;

// Helper type to make custom metrics compatible with MetricData
export type AsMetricData<T extends object> = T & MetricData;

export interface Analysis {
  score: number;
  issues: Issue[];
  recommendations: string[];
}

export interface Issue {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  file?: string;
  line?: number;
}

export interface Report {
  title: string;
  summary: string;
  details: Record<string, unknown>;
}

export interface QualityPlugin<TMetric extends MetricData = MetricData> {
  /** Plugin name (must be unique) */
  name: string;

  /** Plugin version */
  version: string;

  /** Plugin description */
  description?: string;

  /** Plugin author */
  author?: string;

  /** Lifecycle hooks */
  hooks?: {
    /** Called during metric collection phase */
    onCollect?: (context: CollectContext) => Promise<TMetric>;

    /** Called during analysis phase */
    onAnalyze?: (snapshot: QualitySnapshot, data: TMetric) => Promise<Analysis>;

    /** Called during reporting phase */
    onReport?: (snapshot: QualitySnapshot, analysis: Analysis) => Promise<Report>;
  };

  /** Plugin configuration */
  config?: Record<string, unknown>;

  /** Plugin dependencies (other plugin names) */
  dependencies?: string[];

  /** Enabled by default? */
  enabled?: boolean;
}

export interface PluginExecutionResult<T = unknown> {
  pluginName: string;
  success: boolean;
  data?: T;
  error?: Error;
  duration: number;
}

// --- Plugin Manager ---

export class PluginManager {
  private plugins: Map<string, QualityPlugin> = new Map();
  private config: PluginConfig;
  private pluginConfigs: Map<string, Record<string, unknown>> = new Map();

  constructor(config: Partial<PluginConfig> = {}) {
    this.config = {
      pluginsDir: config.pluginsDir || resolve(process.cwd(), 'tools/quality-metrics/plugins'),
      timeout: config.timeout || 30000, // 30s default timeout
      enabled: config.enabled ?? true,
      disabled: config.disabled || [],
    };
  }

  /**
   * Load configuration from .quality-plugins.json
   */
  async loadConfig(configPath?: string): Promise<void> {
    const path = configPath || resolve(process.cwd(), '.quality-plugins.json');

    try {
      const content = await readFile(path, 'utf-8');
      const config = JSON.parse(content);

      if (config.enabled !== undefined) {
        this.config.enabled = config.enabled;
      }

      if (config.pluginsDir) {
        this.config.pluginsDir = resolve(process.cwd(), config.pluginsDir);
      }

      if (config.timeout) {
        this.config.timeout = config.timeout;
      }

      // Load plugin-specific configurations
      if (config.plugins) {
        for (const [pluginName, pluginConfig] of Object.entries(config.plugins)) {
          if (typeof pluginConfig === 'object' && pluginConfig !== null) {
            const cfg = pluginConfig as { enabled?: boolean; config?: Record<string, unknown> };

            // Check if plugin is disabled
            if (cfg.enabled === false) {
              this.config.disabled.push(pluginName);
            }

            // Store plugin config
            if (cfg.config) {
              this.pluginConfigs.set(pluginName, cfg.config);
            }
          }
        }
      }

      console.log(`✅ Loaded plugin configuration from: ${path}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(`ℹ️  No plugin config file found (${path}), using defaults`);
      } else {
        console.warn(`⚠️  Failed to load plugin config: ${error}`);
      }
    }
  }

  /**
   * Discover and load plugins from directory
   */
  async discover(): Promise<void> {
    console.log(`🔍 Discovering plugins in: ${this.config.pluginsDir}`);

    try {
      const files = await readdir(this.config.pluginsDir);

      for (const file of files) {
        if (extname(file) === '.ts' || extname(file) === '.js') {
          await this.loadPlugin(resolve(this.config.pluginsDir, file));
        }
      }

      console.log(`✅ Discovered ${this.plugins.size} plugin(s)`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.warn(`⚠️  Plugins directory not found: ${this.config.pluginsDir}`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Load a single plugin from file
   */
  private async loadPlugin(filePath: string): Promise<void> {
    try {
      const module = await import(filePath);
      const plugin: QualityPlugin = module.default || module.plugin;

      if (!plugin || !plugin.name) {
        console.warn(`⚠️  Invalid plugin at ${filePath}: missing name`);
        return;
      }

      // Check if plugin is disabled
      if (this.config.disabled.includes(plugin.name)) {
        console.log(`⏭️  Skipping disabled plugin: ${plugin.name}`);
        return;
      }

      if (plugin.enabled === false) {
        console.log(`⏭️  Skipping disabled plugin: ${plugin.name}`);
        return;
      }

      this.register(plugin);
      console.log(`✅ Loaded plugin: ${plugin.name}@${plugin.version}`);
    } catch (error) {
      console.error(`❌ Failed to load plugin from ${filePath}:`, error);
    }
  }

  /**
   * Register a plugin manually
   */
  register(plugin: QualityPlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`⚠️  Plugin already registered: ${plugin.name}`);
      return;
    }

    this.plugins.set(plugin.name, plugin);
  }

  /**
   * Unregister a plugin
   */
  unregister(pluginName: string): boolean {
    return this.plugins.delete(pluginName);
  }

  /**
   * Get registered plugin by name
   */
  get(pluginName: string): QualityPlugin | undefined {
    return this.plugins.get(pluginName);
  }

  /**
   * Get all registered plugins
   */
  getAll(): QualityPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Execute onCollect hook for all plugins
   */
  async executeCollect(context: CollectContext): Promise<PluginExecutionResult<MetricData>[]> {
    return this.executeHook('onCollect', context);
  }

  /**
   * Execute onAnalyze hook for all plugins
   */
  async executeAnalyze(
    snapshot: QualitySnapshot,
    data: MetricData,
  ): Promise<PluginExecutionResult<Analysis>[]> {
    return this.executeHook('onAnalyze', snapshot, data);
  }

  /**
   * Execute onReport hook for all plugins
   */
  async executeReport(
    snapshot: QualitySnapshot,
    analysis: Analysis,
  ): Promise<PluginExecutionResult<Report>[]> {
    return this.executeHook('onReport', snapshot, analysis);
  }

  /**
   * Execute a specific hook for all plugins
   */
  private async executeHook<T>(
    hookName: 'onCollect' | 'onAnalyze' | 'onReport',
    ...args: unknown[]
  ): Promise<PluginExecutionResult<T>[]> {
    const results: PluginExecutionResult<T>[] = [];

    for (const plugin of this.plugins.values()) {
      const hook = plugin.hooks?.[hookName];

      if (!hook) {
        continue; // Plugin doesn't implement this hook
      }

      const startTime = Date.now();

      try {
        // Execute with timeout
        const data = await Promise.race([
          // @ts-expect-error - Dynamic hook execution
          hook(...args),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Plugin timeout')), this.config.timeout),
          ),
        ]);

        results.push({
          pluginName: plugin.name,
          success: true,
          data: data as T,
          duration: Date.now() - startTime,
        });
      } catch (error) {
        console.error(`❌ Plugin ${plugin.name} failed on ${hookName}:`, error);

        results.push({
          pluginName: plugin.name,
          success: false,
          error: error as Error,
          duration: Date.now() - startTime,
        });
      }
    }

    return results;
  }

  /**
   * Get execution summary
   */
  getSummary(results: PluginExecutionResult[]): PluginExecutionSummary {
    const total = results.length;
    const success = results.filter((r) => r.success).length;
    const failed = total - success;
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / total || 0;

    return { total, success, failed, avgDuration };
  }
}

// --- Configuration ---

export interface PluginConfig {
  /** Directory to discover plugins from */
  pluginsDir: string;

  /** Plugin execution timeout (ms) */
  timeout: number;

  /** Enable plugin system */
  enabled: boolean;

  /** List of disabled plugin names */
  disabled: string[];
}

export interface PluginExecutionSummary {
  total: number;
  success: number;
  failed: number;
  avgDuration: number;
}

// --- Factory ---

/**
 * Create a new plugin manager
 */
export function createPluginManager(config?: Partial<PluginConfig>): PluginManager {
  return new PluginManager(config);
}
