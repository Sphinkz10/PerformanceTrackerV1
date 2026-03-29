-- ============================================
-- SPRINT 0: ROLLBACK SCRIPT
-- ============================================
-- Use this to UNDO all Sprint 0 migrations
-- 
-- ⚠️  WARNING: This will DELETE data!
-- ⚠️  Make sure you have a backup before running!
-- 
-- What this script does:
-- 1. Drops new tables (metric_pack_activations)
-- 2. Drops materialized view (metric_baselines)
-- 3. Drops functions and triggers
-- 4. Removes new columns from existing tables
-- 5. Drops indexes
-- 
-- What this script CANNOT do:
-- - Restore workspace pack copies (deleted in migration)
-- - Restore old pack_id associations
-- 
-- Recommendation: Restore from backup instead of using this
-- ============================================

BEGIN;

-- ============================================
-- CONFIRM ROLLBACK
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  ═══════════════════════════════════════════════════';
  RAISE NOTICE '⚠️  ROLLBACK STARTING - THIS WILL DELETE DATA';
  RAISE NOTICE '⚠️  ═══════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'If you want to STOP, press Ctrl+C NOW!';
  RAISE NOTICE 'Waiting 5 seconds...';
  RAISE NOTICE '';
  
  -- Give user time to cancel
  PERFORM pg_sleep(5);
  
  RAISE NOTICE 'Proceeding with rollback...';
END $$;

-- ============================================
-- STEP 1: Drop triggers and functions
-- ============================================

DROP TRIGGER IF EXISTS trg_set_update_priority ON metric_updates;
DROP FUNCTION IF EXISTS set_metric_update_priority();

RAISE NOTICE '✓ Dropped trigger and priority function';

-- ============================================
-- STEP 2: Drop refresh function
-- ============================================

DROP FUNCTION IF EXISTS refresh_metric_baselines();

RAISE NOTICE '✓ Dropped refresh function';

-- ============================================
-- STEP 3: Drop materialized view
-- ============================================

DROP MATERIALIZED VIEW IF EXISTS metric_baselines CASCADE;

RAISE NOTICE '✓ Dropped metric_baselines materialized view';

-- ============================================
-- STEP 4: Drop new table
-- ============================================

DROP TABLE IF EXISTS metric_pack_activations CASCADE;

RAISE NOTICE '✓ Dropped metric_pack_activations table';

-- ============================================
-- STEP 5: Remove columns from metrics table
-- ============================================

ALTER TABLE metrics 
  DROP COLUMN IF EXISTS tags,
  DROP COLUMN IF EXISTS aggregation_method,
  DROP COLUMN IF EXISTS baseline_method,
  DROP COLUMN IF EXISTS baseline_period_days,
  DROP COLUMN IF EXISTS baseline_manual_value;

-- Drop associated indexes
DROP INDEX IF EXISTS idx_metrics_tags;

RAISE NOTICE '✓ Removed columns from metrics table';

-- ============================================
-- STEP 6: Remove source_priority from metric_updates
-- ============================================

ALTER TABLE metric_updates
  DROP COLUMN IF EXISTS source_priority;

-- Drop associated index
DROP INDEX IF EXISTS idx_updates_priority_timestamp;

RAISE NOTICE '✓ Removed source_priority from metric_updates';

-- ============================================
-- STEP 7: Remove cooldown_hours from belief_rules
-- ============================================

ALTER TABLE belief_rules
  DROP COLUMN IF EXISTS cooldown_hours;

RAISE NOTICE '✓ Removed cooldown_hours from belief_rules';

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
DECLARE
  tables_exist BOOLEAN;
  columns_exist BOOLEAN;
BEGIN
  -- Check if new tables still exist
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'metric_pack_activations'
  ) INTO tables_exist;
  
  -- Check if new columns still exist
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'metrics' AND column_name = 'tags'
  ) INTO columns_exist;
  
  IF NOT tables_exist AND NOT columns_exist THEN
    RAISE NOTICE '✓ Rollback verification passed';
  ELSE
    RAISE WARNING '✗ Some objects still exist - rollback may be incomplete';
  END IF;
END $$;

COMMIT;

-- ============================================
-- ROLLBACK COMPLETE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE '   ROLLBACK COMPLETE';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'Sprint 0 migrations have been rolled back.';
  RAISE NOTICE '';
  RAISE NOTICE 'NEXT STEPS:';
  RAISE NOTICE '1. Verify your data is intact';
  RAISE NOTICE '2. Check application still works';
  RAISE NOTICE '3. If issues persist, restore from backup';
  RAISE NOTICE '';
  RAISE NOTICE 'LIMITATIONS:';
  RAISE NOTICE '- Workspace pack copies were deleted (cannot restore)';
  RAISE NOTICE '- If you need those, restore from backup';
  RAISE NOTICE '';
END $$;

-- ============================================
-- POST-ROLLBACK QUERIES
-- ============================================

-- Verify metrics table structure
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE 'Metrics table columns:';
END $$;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'metrics'
ORDER BY ordinal_position;

-- Verify metric_updates table structure
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE 'Metric_updates table columns:';
END $$;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'metric_updates'
ORDER BY ordinal_position;

-- List remaining tables
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE 'Remaining metric-related tables:';
END $$;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'metric%'
ORDER BY table_name;

-- ============================================
-- END OF ROLLBACK SCRIPT
-- ============================================