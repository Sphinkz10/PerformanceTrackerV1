-- ============================================
-- SPRINT 0 V2: CRITICAL FIXES - PRODUCTION READY
-- ============================================
-- All migrations with CRITICAL FIXES applied
-- Version: 2.0 (Post-Audit)
-- 
-- FIXES APPLIED:
-- ✅ Fix #1: Data loss prevention (orphan metrics check)
-- ✅ Fix #2: Materialized view crash (removed baseline_period_days)
-- ✅ Fix #3: Race condition (added trigger)
-- ✅ Fix #4: Aggregation logic (HRV uses max, not min)
-- 
-- Estimated time: 3-5 minutes
-- Tables affected: 4 existing + 2 new
-- Data migration: metric_packs → metric_pack_activations
-- ============================================

BEGIN;

-- ============================================
-- MIGRATION 1: Add tags to metrics
-- ============================================

ALTER TABLE metrics
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_metrics_tags ON metrics USING GIN(tags);

COMMENT ON COLUMN metrics.tags IS 'Tags for categorization: dashboard, critical, hidden, etc';

RAISE NOTICE '✓ Migration 1: Tags added to metrics';

-- ============================================
-- MIGRATION 2: Add aggregation_method to metrics
-- ============================================

ALTER TABLE metrics
  ADD COLUMN IF NOT EXISTS aggregation_method TEXT DEFAULT 'latest'
    CHECK (aggregation_method IN ('latest', 'average', 'sum', 'max', 'min'));

COMMENT ON COLUMN metrics.aggregation_method IS 
  'How to aggregate multiple values in same day: latest (default), average, sum, max, min';

-- Set sensible defaults for existing metrics based on name patterns

-- Training load metrics: SUM (accumulate volume)
UPDATE metrics SET aggregation_method = 'sum' 
WHERE (name ILIKE '%volume%' OR name ILIKE '%load%' OR name ILIKE '%distance%')
  AND aggregation_method = 'latest';

-- Intensity/effort metrics: MAX (worst case)
UPDATE metrics SET aggregation_method = 'max' 
WHERE (name ILIKE '%rpe%' OR name ILIKE '%pain%' OR name ILIKE '%stress%')
  AND aggregation_method = 'latest';

-- 🔧 FIX: HRV uses MAX (higher is better)
UPDATE metrics SET aggregation_method = 'max' 
WHERE name ILIKE '%hrv%'
  AND aggregation_method = 'latest';

-- RHR uses MIN (lower is better)
UPDATE metrics SET aggregation_method = 'min' 
WHERE name ILIKE '%rhr%'
  AND aggregation_method = 'latest';

-- Quality/recovery metrics: AVERAGE (typical value)
UPDATE metrics SET aggregation_method = 'average' 
WHERE (name ILIKE '%sleep%' OR name ILIKE '%recovery%' OR name ILIKE '%quality%')
  AND aggregation_method = 'latest';

RAISE NOTICE '✓ Migration 2: Aggregation methods configured';

-- ============================================
-- MIGRATION 3: Add source_priority to metric_updates
-- ============================================

ALTER TABLE metric_updates
  ADD COLUMN IF NOT EXISTS source_priority INTEGER DEFAULT 5;

COMMENT ON COLUMN metric_updates.source_priority IS 
  'Priority for conflict resolution: manual_entry=10, live_session=7, calculation=6, form_submission=5, sensor=3, import=1';

-- Set priorities for existing records based on source_type
UPDATE metric_updates SET source_priority = 10 WHERE source_type = 'manual_entry' AND source_priority = 5;
UPDATE metric_updates SET source_priority = 7 WHERE source_type = 'live_session' AND source_priority = 5;
UPDATE metric_updates SET source_priority = 6 WHERE source_type = 'calculation' AND source_priority = 5;
UPDATE metric_updates SET source_priority = 5 WHERE source_type = 'form_submission' AND source_priority = 5;
UPDATE metric_updates SET source_priority = 3 WHERE source_type = 'sensor' AND source_priority = 5;
UPDATE metric_updates SET source_priority = 1 WHERE source_type = 'import' AND source_priority = 5;

-- Create compound index for efficient queries (with tie-breaker)
CREATE INDEX IF NOT EXISTS idx_updates_priority_timestamp 
  ON metric_updates(metric_id, athlete_id, source_priority DESC, timestamp DESC, created_at DESC);

COMMENT ON INDEX idx_updates_priority_timestamp IS 
  'Optimized index for getLatestValue queries with tie-breaker on created_at';

RAISE NOTICE '✓ Migration 3: Source priorities configured';

-- ============================================
-- MIGRATION 4: Add cooldown_hours to belief_rules
-- ============================================

ALTER TABLE belief_rules
  ADD COLUMN IF NOT EXISTS cooldown_hours INTEGER DEFAULT 24;

COMMENT ON COLUMN belief_rules.cooldown_hours IS 
  'Minimum hours between rule triggers to prevent spam. Default: 24h';

-- Set sensible defaults based on rule priority (if priority column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name='belief_rules' AND column_name='priority') THEN
    
    UPDATE belief_rules SET cooldown_hours = 12 
    WHERE priority > 150 AND cooldown_hours = 24;  -- Critical: 2x/day
    
    UPDATE belief_rules SET cooldown_hours = 24 
    WHERE priority BETWEEN 100 AND 150 AND cooldown_hours = 24;  -- High: 1x/day
    
    UPDATE belief_rules SET cooldown_hours = 48 
    WHERE priority < 100 AND cooldown_hours = 24;  -- Medium/Low: 1x/2days
    
    RAISE NOTICE '✓ Cooldown hours set based on priority';
  ELSE
    RAISE NOTICE '✓ Priority column not found, using default cooldown (24h)';
  END IF;
END $$;

RAISE NOTICE '✓ Migration 4: Cooldown configured';

-- ============================================
-- MIGRATION 5: Create metric_pack_activations table
-- ============================================

-- Create table
CREATE TABLE IF NOT EXISTS metric_pack_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID NOT NULL REFERENCES metric_packs(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  
  is_active BOOLEAN DEFAULT TRUE,
  activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  activated_by UUID REFERENCES users(id),
  deactivated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(pack_id, workspace_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pack_activations_workspace ON metric_pack_activations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pack_activations_pack ON metric_pack_activations(pack_id);
CREATE INDEX IF NOT EXISTS idx_pack_activations_active ON metric_pack_activations(workspace_id, is_active) 
  WHERE is_active = TRUE;

-- RLS Policies
ALTER TABLE metric_pack_activations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view pack activations in their workspace" ON metric_pack_activations;
CREATE POLICY "Users can view pack activations in their workspace"
  ON metric_pack_activations FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM user_workspaces WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Coaches can manage pack activations" ON metric_pack_activations;
CREATE POLICY "Coaches can manage pack activations"
  ON metric_pack_activations FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM user_workspaces 
      WHERE user_id = auth.uid() AND role IN ('owner', 'coach')
    )
  );

COMMENT ON TABLE metric_pack_activations IS 'Tracks which packs are activated in which workspaces';

RAISE NOTICE '✓ Migration 5: metric_pack_activations table created';

-- ============================================
-- 🔧 FIX #1: SAFETY CHECK - Prevent orphan metrics
-- ============================================

DO $$
DECLARE
  orphan_count INTEGER;
  orphan_sample TEXT;
BEGIN
  -- Count metrics that would become orphans
  SELECT COUNT(*) INTO orphan_count
  FROM metrics m
  WHERE m.pack_id IS NOT NULL
    AND m.pack_id IN (SELECT id FROM metric_packs WHERE workspace_id IS NOT NULL AND is_global = FALSE)
    AND NOT EXISTS (
      SELECT 1 FROM metric_packs gp
      JOIN metric_packs wp ON wp.name = gp.name AND wp.category = gp.category
      WHERE wp.id = m.pack_id 
        AND gp.is_global = TRUE
    );
  
  -- Get sample of orphan metrics for debugging
  IF orphan_count > 0 THEN
    SELECT STRING_AGG(DISTINCT m.name || ' (pack: ' || wp.name || ')', ', ')
    INTO orphan_sample
    FROM metrics m
    JOIN metric_packs wp ON wp.id = m.pack_id
    WHERE m.pack_id IS NOT NULL
      AND m.pack_id IN (SELECT id FROM metric_packs WHERE workspace_id IS NOT NULL AND is_global = FALSE)
      AND NOT EXISTS (
        SELECT 1 FROM metric_packs gp
        WHERE gp.name = wp.name AND gp.category = wp.category AND gp.is_global = TRUE
      )
    LIMIT 5;
    
    RAISE EXCEPTION 'MIGRATION ABORTED: % metrics would become orphans. Sample: %. Create global packs first!', 
      orphan_count, orphan_sample;
  END IF;
  
  RAISE NOTICE '✓ Safety check passed: No orphan metrics detected';
END $$;

-- ============================================
-- MIGRATION 5 (continued): Migrate data
-- ============================================

-- Migrate existing workspace packs to activations
INSERT INTO metric_pack_activations (pack_id, workspace_id, is_active, activated_at, activated_by)
SELECT 
  -- Find original global pack by matching name and category
  (SELECT gp.id 
   FROM metric_packs gp 
   WHERE gp.name = wp.name 
     AND gp.category = wp.category
     AND gp.is_global = TRUE 
   LIMIT 1) as pack_id,
  wp.workspace_id,
  wp.is_active,
  COALESCE(wp.activated_at, wp.created_at),
  wp.activated_by
FROM metric_packs wp
WHERE wp.workspace_id IS NOT NULL
  AND wp.is_global = FALSE
  -- Only migrate if we can find corresponding global pack
  AND EXISTS (
    SELECT 1 FROM metric_packs gp 
    WHERE gp.name = wp.name 
      AND gp.category = wp.category
      AND gp.is_global = TRUE
  )
ON CONFLICT (pack_id, workspace_id) DO NOTHING;

-- Get migration stats
DO $$
DECLARE
  activation_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO activation_count FROM metric_pack_activations;
  RAISE NOTICE '✓ Migrated % pack activations', activation_count;
END $$;

-- Update metrics.pack_id to point to global packs (SAFE - checked above)
UPDATE metrics m
SET pack_id = (
  SELECT gp.id 
  FROM metric_packs gp
  JOIN metric_packs wp ON wp.name = gp.name AND wp.category = gp.category
  WHERE wp.id = m.pack_id
    AND gp.is_global = TRUE
  LIMIT 1
)
WHERE pack_id IS NOT NULL
  AND pack_id IN (SELECT id FROM metric_packs WHERE workspace_id IS NOT NULL AND is_global = FALSE)
  -- Double-check: only update if global pack exists
  AND EXISTS (
    SELECT 1 FROM metric_packs gp
    JOIN metric_packs wp ON wp.name = gp.name AND wp.category = gp.category
    WHERE wp.id = m.pack_id AND gp.is_global = TRUE
  );

-- Delete workspace pack copies (data migrated)
DELETE FROM metric_packs 
WHERE workspace_id IS NOT NULL
  AND is_global = FALSE;

RAISE NOTICE '✓ Migration 5: Pack data migrated successfully';

-- ============================================
-- MIGRATION 6: Add baseline configuration to metrics
-- ============================================

ALTER TABLE metrics
  ADD COLUMN IF NOT EXISTS baseline_method TEXT DEFAULT 'rolling-average' 
    CHECK (baseline_method IN ('rolling-average', 'manual', 'percentile')),
  ADD COLUMN IF NOT EXISTS baseline_period_days INTEGER DEFAULT 28,
  ADD COLUMN IF NOT EXISTS baseline_manual_value NUMERIC;

COMMENT ON COLUMN metrics.baseline_method IS 'How to calculate baseline: rolling-average, manual, percentile';
COMMENT ON COLUMN metrics.baseline_period_days IS 'Days to look back for rolling average (default: 28)';
COMMENT ON COLUMN metrics.baseline_manual_value IS 'Manual baseline value if baseline_method = manual';

-- Set appropriate baseline periods based on metric category
UPDATE metrics SET baseline_period_days = 14 
WHERE category IN ('readiness', 'psychological') AND baseline_period_days = 28;

UPDATE metrics SET baseline_period_days = 7 
WHERE update_frequency = 'per-session' AND baseline_period_days = 28;

RAISE NOTICE '✓ Migration 6: Baseline configuration added';

-- ============================================
-- MIGRATION 7: Create metric_baselines materialized view
-- ============================================

-- Drop if exists (for idempotency)
DROP MATERIALIZED VIEW IF EXISTS metric_baselines CASCADE;

-- 🔧 FIX #2: Create materialized view WITHOUT baseline_period_days
-- (prevents CONCURRENT refresh issues)
CREATE MATERIALIZED VIEW metric_baselines AS
SELECT 
  mu.metric_id,
  mu.athlete_id,
  AVG(mu.value_numeric) as baseline_avg,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY mu.value_numeric) as baseline_median,
  STDDEV_POP(mu.value_numeric) as baseline_stddev,
  MIN(mu.value_numeric) as baseline_min,
  MAX(mu.value_numeric) as baseline_max,
  COUNT(*) as sample_size,
  MAX(mu.timestamp) as last_updated
FROM metric_updates mu
JOIN metrics m ON m.id = mu.metric_id
WHERE mu.is_valid = TRUE
  AND mu.timestamp > NOW() - (COALESCE(m.baseline_period_days, 28) || ' days')::INTERVAL
  AND mu.value_numeric IS NOT NULL
  AND m.baseline_method IN ('rolling-average', 'percentile')  -- Only calculate for these methods
GROUP BY mu.metric_id, mu.athlete_id;

-- Indexes (UNIQUE required for CONCURRENT refresh)
CREATE UNIQUE INDEX idx_baselines_metric_athlete 
  ON metric_baselines(metric_id, athlete_id);

CREATE INDEX idx_baselines_athlete 
  ON metric_baselines(athlete_id);

CREATE INDEX idx_baselines_updated 
  ON metric_baselines(last_updated DESC);

COMMENT ON MATERIALIZED VIEW metric_baselines IS 
  'Pre-calculated baselines for metrics (refreshed daily via cron)';

-- Get baseline stats
DO $$
DECLARE
  baseline_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO baseline_count FROM metric_baselines;
  RAISE NOTICE '✓ Calculated % initial baselines', baseline_count;
END $$;

RAISE NOTICE '✓ Migration 7: Materialized view created';

-- ============================================
-- MIGRATION 8: Create refresh function
-- ============================================

CREATE OR REPLACE FUNCTION refresh_metric_baselines()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Refresh materialized view concurrently (requires unique index)
  -- CONCURRENT allows queries during refresh (zero downtime)
  REFRESH MATERIALIZED VIEW CONCURRENTLY metric_baselines;
  
  RAISE NOTICE 'Metric baselines refreshed at %', NOW();
  
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback to non-concurrent if concurrent fails
    RAISE WARNING 'Concurrent refresh failed, using non-concurrent: %', SQLERRM;
    REFRESH MATERIALIZED VIEW metric_baselines;
END;
$$;

COMMENT ON FUNCTION refresh_metric_baselines IS 
  'Refreshes the metric_baselines materialized view. Should be called daily via cron.';

RAISE NOTICE '✓ Migration 8: Refresh function created';

-- ============================================
-- 🔧 FIX #3: Add trigger for auto-setting source_priority
-- ============================================

CREATE OR REPLACE FUNCTION set_metric_update_priority()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-set priority based on source_type if not explicitly provided
  IF NEW.source_priority IS NULL OR NEW.source_priority = 5 THEN
    NEW.source_priority := CASE NEW.source_type
      WHEN 'manual_entry' THEN 10
      WHEN 'live_session' THEN 7
      WHEN 'calculation' THEN 6
      WHEN 'form_submission' THEN 5
      WHEN 'sensor' THEN 3
      WHEN 'import' THEN 1
      ELSE 5
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_update_priority ON metric_updates;
CREATE TRIGGER trg_set_update_priority
  BEFORE INSERT OR UPDATE ON metric_updates
  FOR EACH ROW
  EXECUTE FUNCTION set_metric_update_priority();

COMMENT ON FUNCTION set_metric_update_priority IS 
  'Auto-sets source_priority based on source_type to prevent race conditions';

RAISE NOTICE '✓ Migration 9: Priority trigger created';

-- ============================================
-- VALIDATION CHECKS
-- ============================================

-- Verify tags index
DO $$
DECLARE
  index_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'metrics' AND indexname = 'idx_metrics_tags'
  ) INTO index_exists;
  
  IF index_exists THEN
    RAISE NOTICE '✓ Tags index verified';
  ELSE
    RAISE WARNING '✗ Tags index not created';
  END IF;
END $$;

-- Verify source_priority consistency
DO $$
DECLARE
  inconsistent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO inconsistent_count 
  FROM metric_updates 
  WHERE (source_type = 'manual_entry' AND source_priority != 10)
     OR (source_type = 'live_session' AND source_priority != 7)
     OR (source_type = 'calculation' AND source_priority != 6)
     OR (source_type = 'form_submission' AND source_priority != 5)
     OR (source_type = 'sensor' AND source_priority != 3)
     OR (source_type = 'import' AND source_priority != 1);
  
  IF inconsistent_count = 0 THEN
    RAISE NOTICE '✓ Source priorities consistent';
  ELSE
    RAISE WARNING '✗ % records have inconsistent priorities', inconsistent_count;
  END IF;
END $$;

-- Verify materialized view
DO $$
DECLARE
  view_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_matviews WHERE matviewname = 'metric_baselines'
  ) INTO view_exists;
  
  IF view_exists THEN
    RAISE NOTICE '✓ Materialized view verified';
  ELSE
    RAISE WARNING '✗ Materialized view not created';
  END IF;
END $$;

-- Verify trigger
DO $$
DECLARE
  trigger_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_update_priority'
  ) INTO trigger_exists;
  
  IF trigger_exists THEN
    RAISE NOTICE '✓ Priority trigger verified';
  ELSE
    RAISE WARNING '✗ Priority trigger not created';
  END IF;
END $$;

COMMIT;

-- ============================================
-- POST-MIGRATION NOTES
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE '   SPRINT 0 V2 MIGRATION COMPLETE';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'NEXT STEPS:';
  RAISE NOTICE '1. Run VALIDATION_QUERIES.sql to verify everything';
  RAISE NOTICE '2. Set up cron job for baseline refresh (see docs)';
  RAISE NOTICE '3. Test with sample data';
  RAISE NOTICE '4. Monitor first 24h after deployment';
  RAISE NOTICE '';
  RAISE NOTICE 'CRON SETUP:';
  RAISE NOTICE '- Vercel: Add to vercel.json (see IMPLEMENTATION_GUIDE.md)';
  RAISE NOTICE '- pg_cron: See commented example below';
  RAISE NOTICE '';
END $$;

-- ============================================
-- CRON SETUP (pg_cron example - commented)
-- ============================================

-- If using pg_cron extension:
-- 
-- SELECT cron.schedule(
--   'refresh-metric-baselines',
--   '0 1 * * *',  -- Every day at 1 AM UTC
--   $$SELECT refresh_metric_baselines();$$
-- );
-- 
-- Verify:
-- SELECT * FROM cron.job WHERE jobname = 'refresh-metric-baselines';

-- ============================================
-- MIGRATION V2 COMPLETE
-- ============================================