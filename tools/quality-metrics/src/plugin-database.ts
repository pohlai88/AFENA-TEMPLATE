/**
 * Database Integration for Quality Plugins
 *
 * Stores plugin metric results and analysis data for historical tracking.
 *
 * @module plugin-database
 * @since Sprint 6
 */

import { db } from 'afenda-database';
import type { Analysis, MetricData } from './plugin-system';

// --- Types ---

export interface PluginMetricRecord {
  id?: number;
  pluginName: string;
  timestamp: string;
  gitSha: string;
  gitBranch: string;
  metricData: Record<string, unknown>;
  analysisScore?: number;
  analysisIssues?: number;
  createdAt?: Date;
}

export interface DatabaseConfig {
  enabled: boolean;
  savePluginMetrics: boolean;
  tableName: string;
}

// --- Database Service ---

export class PluginDatabase {
  private config: DatabaseConfig;

  constructor(config?: Partial<DatabaseConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      savePluginMetrics: config?.savePluginMetrics ?? true,
      tableName: config?.tableName || 'quality_plugin_metrics',
    };
  }

  /**
   * Initialize database table for plugin metrics
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.log('📊 Plugin database disabled');
      return;
    }

    try {
      // Check if table exists (simple approach)
      await db.execute(`
        CREATE TABLE IF NOT EXISTS ${this.config.tableName} (
          id SERIAL PRIMARY KEY,
          plugin_name VARCHAR(255) NOT NULL,
          timestamp TIMESTAMP NOT NULL,
          git_sha VARCHAR(40) NOT NULL,
          git_branch VARCHAR(255) NOT NULL,
          metric_data JSONB NOT NULL,
          analysis_score FLOAT,
          analysis_issues INTEGER,
          created_at TIMESTAMP DEFAULT NOW(),
          INDEX idx_plugin_name (plugin_name),
          INDEX idx_git_sha (git_sha),
          INDEX idx_timestamp (timestamp)
        );
      `);

      console.log(`✅ Plugin database table initialized: ${this.config.tableName}`);
    } catch (error) {
      console.error('❌ Failed to initialize plugin database:', error);
    }
  }

  /**
   * Save plugin metric result to database
   */
  async saveMetric(record: Omit<PluginMetricRecord, 'id' | 'createdAt'>): Promise<number | null> {
    if (!this.config.enabled || !this.config.savePluginMetrics) {
      return null;
    }

    try {
      const result = await db.execute(
        `INSERT INTO ${this.config.tableName} (
          plugin_name, timestamp, git_sha, git_branch,
          metric_data, analysis_score, analysis_issues
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id`,
        [
          record.pluginName,
          record.timestamp,
          record.gitSha,
          record.gitBranch,
          JSON.stringify(record.metricData),
          record.analysisScore || null,
          record.analysisIssues || null,
        ],
      );

      const id = result.rows[0]?.id;
      console.log(`💾 Saved plugin metric: ${record.pluginName} (ID: ${id})`);
      return id;
    } catch (error) {
      console.error(`❌ Failed to save plugin metric for ${record.pluginName}:`, error);
      return null;
    }
  }

  /**
   * Get historical metrics for a plugin
   */
  async getHistory(pluginName: string, limit = 30): Promise<PluginMetricRecord[]> {
    if (!this.config.enabled) {
      return [];
    }

    try {
      const result = await db.execute(
        `SELECT
          id, plugin_name, timestamp, git_sha, git_branch,
          metric_data, analysis_score, analysis_issues, created_at
        FROM ${this.config.tableName}
        WHERE plugin_name = $1
        ORDER BY timestamp DESC
        LIMIT $2`,
        [pluginName, limit],
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        pluginName: row.plugin_name,
        timestamp: row.timestamp,
        gitSha: row.git_sha,
        gitBranch: row.git_branch,
        metricData: row.metric_data,
        analysisScore: row.analysis_score,
        analysisIssues: row.analysis_issues,
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error(`❌ Failed to retrieve history for ${pluginName}:`, error);
      return [];
    }
  }

  /**
   * Get latest metric for a plugin
   */
  async getLatest(pluginName: string): Promise<PluginMetricRecord | null> {
    const history = await this.getHistory(pluginName, 1);
    return history[0] || null;
  }

  /**
   * Get trend data for a plugin metric
   */
  async getTrend(pluginName: string, days = 30): Promise<PluginMetricRecord[]> {
    if (!this.config.enabled) {
      return [];
    }

    try {
      const result = await db.execute(
        `SELECT
          id, plugin_name, timestamp, git_sha, git_branch,
          metric_data, analysis_score, analysis_issues, created_at
        FROM ${this.config.tableName}
        WHERE plugin_name = $1
          AND timestamp >= NOW() - INTERVAL '${days} days'
        ORDER BY timestamp ASC`,
        [pluginName],
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        pluginName: row.plugin_name,
        timestamp: row.timestamp,
        gitSha: row.git_sha,
        gitBranch: row.git_branch,
        metricData: row.metric_data,
        analysisScore: row.analysis_score,
        analysisIssues: row.analysis_issues,
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error(`❌ Failed to retrieve trend for ${pluginName}:`, error);
      return [];
    }
  }

  /**
   * Delete old records (cleanup)
   */
  async cleanup(retentionDays = 90): Promise<number> {
    if (!this.config.enabled) {
      return 0;
    }

    try {
      const result = await db.execute(
        `DELETE FROM ${this.config.tableName}
        WHERE timestamp < NOW() - INTERVAL '${retentionDays} days'
        RETURNING id`,
      );

      const deletedCount = result.rowCount || 0;
      console.log(`🧹 Cleaned up ${deletedCount} old plugin metric records`);
      return deletedCount;
    } catch (error) {
      console.error('❌ Failed to cleanup plugin metrics:', error);
      return 0;
    }
  }
}

// --- Helper Functions ---

/**
 * Create plugin database instance from config
 */
export async function createPluginDatabase(
  config?: Partial<DatabaseConfig>,
): Promise<PluginDatabase> {
  const pluginDb = new PluginDatabase(config);
  await pluginDb.initialize();
  return pluginDb;
}

/**
 * Save plugin execution results to database
 */
export async function savePluginResults(
  pluginDb: PluginDatabase,
  pluginName: string,
  metricData: MetricData,
  analysis: Analysis | null,
  context: { gitSha: string; gitBranch: string; timestamp: string },
): Promise<void> {
  await pluginDb.saveMetric({
    pluginName,
    timestamp: context.timestamp,
    gitSha: context.gitSha,
    gitBranch: context.gitBranch,
    metricData: metricData as Record<string, unknown>,
    analysisScore: analysis?.score ?? 0,
    analysisIssues: analysis?.issues.length ?? 0,
  });
}
