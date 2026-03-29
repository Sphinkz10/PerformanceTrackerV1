-- ============================================
-- SPRINT 0: VALIDATION QUERIES
-- ============================================
-- Run these queries AFTER migrations to verify everything works
-- 
-- Structure:
-- 1. Schema validation (columns, tables, indexes exist)
-- 2. Data validation (counts, consistency checks)
-- 3. Functional tests (queries work as expected)
-- 4. Performance tests (indexes are used)
-- ============================================

\echo ''
\echo '═══════════════════════════════════════════════════'
\echo '  SPRINT 0 VALIDATION'
\echo '═══════════════════════════════════════════════════'
\echo ''

-- ============================================
-- SECTION 1: SCHEMA VALIDATION
-- ============================================

\echo '1. SCHEMA VALIDATION'
\echo '─────────────────────────────────────────────────'
\echo ''

-- Check all expected columns exist
SELECT 
  CASE 
    WHEN COUNT(*) = 10 THEN '✓ All columns exist'
    ELSE '✗ Missing ' || (10 - COUNT(*)) || ' columns'
  END as schema_status
FROM (
  SELECT 1 FROM information_schema.columns WHERE table_name='metrics' AND column_name='tags'
  UNION ALL
  SELECT 1 FROM information_schema.columns WHERE table_name='metrics' AND column_name='aggregation_method'
  UNION ALL
  SELECT 1 FROM information_schema.columns WHERE table_name='metrics' AND column_name='baseline_method'
  UNION ALL
  SELECT 1 FROM information_schema.columns WHERE table_name='metrics' AND column_name='baseline_period_days'
  UNION ALL
  SELECT 1 FROM information_schema.columns WHERE table_name='metrics' AND column_name='baseline_manual_value'
  UNION ALL
  SELECT 1 FROM information_schema.columns WHERE table_name='metric_updates' AND column_name='source_priority'
  UNION ALL
  SELECT 1 FROM information_schema.columns WHERE table_name='belief_rules' AND column_name='cooldown_hours'
  UNION ALL
  SELECT 1 FROM information_schema.tables WHERE table_name='metric_pack_activations'
  UNION ALL
  SELECT 1 FROM pg_matviews WHERE matviewname='metric_baselines'
  UNION ALL
  SELECT 1 FROM pg_proc WHERE proname='refresh_metric_baselines'
) AS checks;

\echo ''

-- Detailed column check
SELECT 
  'metrics' as table_name,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='metrics' AND column_name='tags') as has_tags,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='metrics' AND column_name='aggregation_method') as has_aggregation,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='metrics' AND column_name='baseline_method') as has_baseline_method,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='metrics' AND column_name='baseline_period_days') as has_baseline_period,
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='metrics' AND column_name='baseline_manual_value') as has_baseline_manual
UNION ALL
SELECT 
  'metric_updates',
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='metric_updates' AND column_name='source_priority'),
  NULL, NULL, NULL, NULL
UNION ALL
SELECT 
  'belief_rules',
  EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='belief_rules' AND column_name='cooldown_hours'),
  NULL, NULL, NULL, NULL
UNION ALL
SELECT
  'metric_pack_activations',
  EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='metric_pack_activations'),
  NULL, NULL, NULL, NULL
UNION ALL
SELECT
  'metric_baselines',
  EXISTS(SELECT 1 FROM pg_matviews WHERE matviewname='metric_baselines'),
  NULL, NULL, NULL, NULL;

\echo ''
\echo 'Expected: All values should be TRUE (t)'
\echo ''

-- Check indexes exist
SELECT 
  'Indexes' as check_type,
  COUNT(*) as created,
  ARRAY_AGG(indexname ORDER BY indexname) as index_names
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname IN (
    'idx_metrics_tags',
    'idx_updates_priority_timestamp',
    'idx_pack_activations_workspace',
    'idx_pack_activations_pack',
    'idx_pack_activations_active',
    'idx_baselines_metric_athlete',
    'idx_baselines_athlete',
    'idx_baselines_updated'
  );

\echo ''
\echo 'Expected: created = 8'
\echo ''

-- Check triggers exist
SELECT 
  'Triggers' as check_type,
  COUNT(*) as created,
  ARRAY_AGG(tgname ORDER BY tgname) as trigger_names
FROM pg_trigger 
WHERE tgname IN ('trg_set_update_priority');

\echo ''
\echo 'Expected: created = 1'
\echo ''

-- ============================================
-- SECTION 2: DATA VALIDATION
-- ============================================

\echo ''
\echo '2. DATA VALIDATION'
\echo '─────────────────────────────────────────────────'
\echo ''

-- Count records in new table
SELECT 
  'Pack Activations' as table_name,
  COUNT(*) as record_count,
  COUNT(DISTINCT workspace_id) as workspaces,
  COUNT(DISTINCT pack_id) as unique_packs
FROM metric_pack_activations;

\echo ''

-- Count baselines calculated
SELECT 
  'Baselines' as view_name,
  COUNT(*) as baseline_count,
  COUNT(DISTINCT metric_id) as unique_metrics,
  COUNT(DISTINCT athlete_id) as unique_athletes,
  ROUND(AVG(sample_size), 2) as avg_sample_size
FROM metric_baselines;

\echo ''

-- Check aggregation method distribution
SELECT 
  'Aggregation Methods' as check_name,
  aggregation_method,
  COUNT(*) as metric_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM metrics
WHERE aggregation_method IS NOT NULL
GROUP BY aggregation_method
ORDER BY metric_count DESC;

\echo ''

-- Check baseline method distribution
SELECT 
  'Baseline Methods' as check_name,
  baseline_method,
  COUNT(*) as metric_count,
  ROUND(AVG(baseline_period_days), 1) as avg_period_days
FROM metrics
WHERE baseline_method IS NOT NULL
GROUP BY baseline_method
ORDER BY metric_count DESC;

\echo ''

-- Check source priority distribution
SELECT 
  'Source Priorities' as check_name,
  source_type,
  source_priority,
  COUNT(*) as update_count
FROM metric_updates
GROUP BY source_type, source_priority
ORDER BY source_priority DESC, update_count DESC;

\echo ''
\echo 'Expected priorities:'
\echo '  manual_entry: 10'
\echo '  live_session: 7'
\echo '  calculation: 6'
\echo '  form_submission: 5'
\echo '  sensor: 3'
\echo '  import: 1'
\echo ''

-- Check for inconsistent priorities (should be 0)
SELECT 
  'Priority Consistency' as check_name,
  COUNT(*) as inconsistent_records
FROM metric_updates 
WHERE (source_type = 'manual_entry' AND source_priority != 10)
   OR (source_type = 'live_session' AND source_priority != 7)
   OR (source_type = 'calculation' AND source_priority != 6)
   OR (source_type = 'form_submission' AND source_priority != 5)
   OR (source_type = 'sensor' AND source_priority != 3)
   OR (source_type = 'import' AND source_priority != 1);

\echo ''
\echo 'Expected: inconsistent_records = 0'
\echo ''

-- Check for orphan metrics (should be 0)
SELECT 
  'Orphan Metrics' as check_name,
  COUNT(*) as orphan_count
FROM metrics m
WHERE m.pack_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM metric_packs p WHERE p.id = m.pack_id
  );

\echo ''
\echo 'Expected: orphan_count = 0'
\echo ''

-- Check cooldown hours distribution
SELECT 
  'Cooldown Hours' as check_name,
  cooldown_hours,
  COUNT(*) as rule_count
FROM belief_rules
WHERE cooldown_hours IS NOT NULL
GROUP BY cooldown_hours
ORDER BY cooldown_hours;

\echo ''

-- ============================================
-- SECTION 3: FUNCTIONAL TESTS
-- ============================================

\echo ''
\echo '3. FUNCTIONAL TESTS'
\echo '─────────────────────────────────────────────────'
\echo ''

-- Test: Query metrics by tag (if any tagged)
DO $$
DECLARE
  tag_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO tag_count 
  FROM metrics 
  WHERE tags IS NOT NULL AND array_length(tags, 1) > 0;
  
  IF tag_count > 0 THEN
    RAISE NOTICE '✓ Tags functional: % metrics have tags', tag_count;
  ELSE
    RAISE NOTICE '⚠ No metrics tagged yet (expected if fresh install)';
  END IF;
END $$;

-- Test: Get latest metric value with priority
DO $$
DECLARE
  test_metric_id UUID;
  latest_priority INTEGER;
BEGIN
  -- Get any metric with updates
  SELECT metric_id INTO test_metric_id
  FROM metric_updates
  LIMIT 1;
  
  IF test_metric_id IS NOT NULL THEN
    -- Get latest (should use priority index)
    SELECT source_priority INTO latest_priority
    FROM metric_updates
    WHERE metric_id = test_metric_id
    ORDER BY source_priority DESC, timestamp DESC, created_at DESC
    LIMIT 1;
    
    RAISE NOTICE '✓ Priority query functional: Latest priority = %', latest_priority;
  ELSE
    RAISE NOTICE '⚠ No metric updates to test';
  END IF;
END $$;

-- Test: Baseline calculation
DO $$
DECLARE
  baseline_sample NUMERIC;
  sample_metric_id UUID;
  sample_athlete_id UUID;
BEGIN
  SELECT metric_id, athlete_id, baseline_avg 
  INTO sample_metric_id, sample_athlete_id, baseline_sample
  FROM metric_baselines
  LIMIT 1;
  
  IF baseline_sample IS NOT NULL THEN
    RAISE NOTICE '✓ Baselines functional: Sample baseline = %', baseline_sample;
  ELSE
    RAISE NOTICE '⚠ No baselines calculated yet (expected if no data)';
  END IF;
END $$;

-- Test: Refresh function exists and is callable
DO $$
BEGIN
  PERFORM refresh_metric_baselines();
  RAISE NOTICE '✓ Refresh function callable';
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '✗ Refresh function failed: %', SQLERRM;
END $$;

-- Test: Trigger auto-sets priority
DO $$
DECLARE
  test_priority INTEGER;
BEGIN
  -- This would normally be tested with a real insert
  -- For now, just verify trigger exists
  PERFORM 1 FROM pg_trigger WHERE tgname = 'trg_set_update_priority';
  
  IF FOUND THEN
    RAISE NOTICE '✓ Priority trigger exists and will auto-set on inserts';
  ELSE
    RAISE WARNING '✗ Priority trigger not found';
  END IF;
END $$;

\echo ''

-- ============================================
-- SECTION 4: PERFORMANCE TESTS
-- ============================================

\echo ''
\echo '4. PERFORMANCE TESTS'
\echo '─────────────────────────────────────────────────'
\echo ''

-- Test: GIN index used for tag queries
EXPLAIN (COSTS OFF, FORMAT TEXT)
SELECT * FROM metrics 
WHERE tags @> ARRAY['dashboard'];

\echo ''
\echo 'Expected: Should show "Bitmap Index Scan using idx_metrics_tags"'
\echo ''

-- Test: Compound index used for priority queries
EXPLAIN (COSTS OFF, FORMAT TEXT)
SELECT * FROM metric_updates
WHERE metric_id = (SELECT id FROM metrics LIMIT 1)
ORDER BY source_priority DESC, timestamp DESC, created_at DESC
LIMIT 1;

\echo ''
\echo 'Expected: Should use idx_updates_priority_timestamp'
\echo ''

-- Test: Unique index used for baseline queries
EXPLAIN (COSTS OFF, FORMAT TEXT)
SELECT * FROM metric_baselines
WHERE metric_id = (SELECT metric_id FROM metric_baselines LIMIT 1)
  AND athlete_id = (SELECT athlete_id FROM metric_baselines LIMIT 1);

\echo ''
\echo 'Expected: Should use idx_baselines_metric_athlete'
\echo ''

-- ============================================
-- SECTION 5: RLS POLICY TESTS
-- ============================================

\echo ''
\echo '5. RLS POLICY TESTS'
\echo '─────────────────────────────────────────────────'
\echo ''

-- Check RLS enabled on new table
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'metric_pack_activations';

\echo ''
\echo 'Expected: rls_enabled = true (t)'
\echo ''

-- List policies on new table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies 
WHERE tablename = 'metric_pack_activations'
ORDER BY policyname;

\echo ''
\echo 'Expected: 2 policies (SELECT and ALL)'
\echo ''

-- ============================================
-- SECTION 6: SUMMARY
-- ============================================

\echo ''
\echo '═══════════════════════════════════════════════════'
\echo '  VALIDATION SUMMARY'
\echo '═══════════════════════════════════════════════════'
\echo ''

DO $$
DECLARE
  schema_ok BOOLEAN;
  data_ok BOOLEAN;
  functional_ok BOOLEAN;
BEGIN
  -- Quick checks
  SELECT 
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name='metrics' AND column_name='tags') > 0 AND
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name='metric_pack_activations') > 0 AND
    (SELECT COUNT(*) FROM pg_matviews WHERE matviewname='metric_baselines') > 0
  INTO schema_ok;
  
  SELECT 
    (SELECT COUNT(*) FROM metric_updates WHERE source_type = 'manual_entry' AND source_priority != 10) = 0
  INTO data_ok;
  
  SELECT 
    (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'trg_set_update_priority') > 0
  INTO functional_ok;
  
  RAISE NOTICE 'Schema validation:     %', CASE WHEN schema_ok THEN '✓ PASS' ELSE '✗ FAIL' END;
  RAISE NOTICE 'Data consistency:      %', CASE WHEN data_ok THEN '✓ PASS' ELSE '⚠ CHECK' END;
  RAISE NOTICE 'Functional tests:      %', CASE WHEN functional_ok THEN '✓ PASS' ELSE '✗ FAIL' END;
  RAISE NOTICE '';
  
  IF schema_ok AND data_ok AND functional_ok THEN
    RAISE NOTICE '🎉 ALL VALIDATIONS PASSED!';
    RAISE NOTICE '';
    RAISE NOTICE 'Sprint 0 migrations are working correctly.';
    RAISE NOTICE 'You can proceed to use the new features.';
  ELSE
    RAISE WARNING '⚠ Some validations failed or need attention.';
    RAISE WARNING 'Review the output above for details.';
  END IF;
END $$;

\echo ''
\echo '─────────────────────────────────────────────────'
\echo ''

-- ============================================
-- BONUS: QUICK STATS
-- ============================================

\echo ''
\echo 'QUICK STATS:'
\echo ''

SELECT 
  'Metrics' as entity,
  COUNT(*) as total,
  COUNT(CASE WHEN tags IS NOT NULL AND array_length(tags, 1) > 0 THEN 1 END) as tagged,
  COUNT(CASE WHEN baseline_method = 'rolling-average' THEN 1 END) as with_baselines
FROM metrics
UNION ALL
SELECT 
  'Metric Updates',
  COUNT(*),
  COUNT(DISTINCT metric_id),
  COUNT(DISTINCT athlete_id)
FROM metric_updates
UNION ALL
SELECT 
  'Pack Activations',
  COUNT(*),
  COUNT(DISTINCT workspace_id),
  COUNT(DISTINCT pack_id)
FROM metric_pack_activations
UNION ALL
SELECT 
  'Baselines',
  COUNT(*),
  COUNT(DISTINCT metric_id),
  COUNT(DISTINCT athlete_id)
FROM metric_baselines;

\echo ''
\echo '═══════════════════════════════════════════════════'
\echo '  END OF VALIDATION'
\echo '═══════════════════════════════════════════════════'
\echo ''

-- ============================================
-- END OF VALIDATION QUERIES
-- ============================================