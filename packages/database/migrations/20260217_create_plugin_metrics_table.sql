/**
 * Database Migration: Quality Plugin Metrics Table
 *
 * Creates table for storing plugin metric results and analysis data.
 *
 * @since Sprint 6
 */

-- Create quality_plugin_metrics table
CREATE TABLE IF NOT EXISTS quality_plugin_metrics (
  id SERIAL PRIMARY KEY,
  plugin_name VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  git_sha VARCHAR(40) NOT NULL,
  git_branch VARCHAR(255) NOT NULL,
  metric_data JSONB NOT NULL,
  analysis_score FLOAT,
  analysis_issues INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_plugin_metrics_plugin_name ON quality_plugin_metrics(plugin_name);
CREATE INDEX IF NOT EXISTS idx_plugin_metrics_git_sha ON quality_plugin_metrics(git_sha);
CREATE INDEX IF NOT EXISTS idx_plugin_metrics_timestamp ON quality_plugin_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_plugin_metrics_git_branch ON quality_plugin_metrics(git_branch);

-- Create composite index for trend queries
CREATE INDEX IF NOT EXISTS idx_plugin_metrics_trend ON quality_plugin_metrics(plugin_name, timestamp DESC);

-- Add comments
COMMENT ON TABLE quality_plugin_metrics IS 'Stores quality plugin metric results for historical tracking';
COMMENT ON COLUMN quality_plugin_metrics.plugin_name IS 'Name of the quality plugin (e.g., code-smells, todo-tracker)';
COMMENT ON COLUMN quality_plugin_metrics.timestamp IS 'Timestamp when metrics were collected';
COMMENT ON COLUMN quality_plugin_metrics.git_sha IS 'Git commit SHA';
COMMENT ON COLUMN quality_plugin_metrics.git_branch IS 'Git branch name';
COMMENT ON COLUMN quality_plugin_metrics.metric_data IS 'JSON data containing plugin-specific metrics';
COMMENT ON COLUMN quality_plugin_metrics.analysis_score IS 'Overall analysis score (0-100)';
COMMENT ON COLUMN quality_plugin_metrics.analysis_issues IS 'Number of issues detected';
