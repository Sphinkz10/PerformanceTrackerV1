-- ============================================================================
-- WEEK 1: RLS VALIDATION QUERIES
-- ============================================================================
-- Validates Row Level Security policies for new API tables
-- 
-- Tables covered:
-- 1. personal_records
-- 2. metrics
-- 3. metric_packs
-- 4. metric_pack_activations
--
-- @author PerformTrack Team
-- @since Semana 1 - Backend Essencial
-- ============================================================================

-- ============================================================================
-- 1. CHECK IF RLS IS ENABLED
-- ============================================================================

DO $$
DECLARE
  tables_checked INTEGER := 0;
  tables_without_rls INTEGER := 0;
  table_name TEXT;
BEGIN
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE 'CHECKING RLS STATUS';
  RAISE NOTICE '════════════════════════════════════════';
  
  -- Check personal_records
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'personal_records') THEN
    RAISE WARNING '❌ RLS NOT ENABLED on personal_records';
    tables_without_rls := tables_without_rls + 1;
  ELSE
    RAISE NOTICE '✅ RLS ENABLED on personal_records';
  END IF;
  tables_checked := tables_checked + 1;
  
  -- Check metrics
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'metrics') THEN
    RAISE WARNING '❌ RLS NOT ENABLED on metrics';
    tables_without_rls := tables_without_rls + 1;
  ELSE
    RAISE NOTICE '✅ RLS ENABLED on metrics';
  END IF;
  tables_checked := tables_checked + 1;
  
  -- Check metric_packs
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'metric_packs') THEN
    RAISE WARNING '❌ RLS NOT ENABLED on metric_packs';
    tables_without_rls := tables_without_rls + 1;
  ELSE
    RAISE NOTICE '✅ RLS ENABLED on metric_packs';
  END IF;
  tables_checked := tables_checked + 1;
  
  -- Check metric_pack_activations
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'metric_pack_activations') THEN
    RAISE WARNING '❌ RLS NOT ENABLED on metric_pack_activations';
    tables_without_rls := tables_without_rls + 1;
  ELSE
    RAISE NOTICE '✅ RLS ENABLED on metric_pack_activations';
  END IF;
  tables_checked := tables_checked + 1;
  
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE 'Summary: %/% tables have RLS enabled', tables_checked - tables_without_rls, tables_checked;
  
  IF tables_without_rls > 0 THEN
    RAISE WARNING 'ACTION REQUIRED: Enable RLS on % tables', tables_without_rls;
  END IF;
END $$;

-- ============================================================================
-- 2. LIST EXISTING RLS POLICIES
-- ============================================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd, -- SELECT, INSERT, UPDATE, DELETE, ALL
  qual, -- USING expression
  with_check -- WITH CHECK expression
FROM pg_policies
WHERE tablename IN ('personal_records', 'metrics', 'metric_packs', 'metric_pack_activations')
ORDER BY tablename, cmd, policyname;

-- ============================================================================
-- 3. RECOMMENDED RLS POLICIES
-- ============================================================================

-- These are RECOMMENDED policies. Review and apply as needed.
-- Adjust based on your specific security requirements.

-- ─────────────────────────────────────────────────────────────────────────
-- 3.1. PERSONAL_RECORDS POLICIES
-- ─────────────────────────────────────────────────────────────────────────

-- Policy: Users can view records in their workspace
CREATE POLICY IF NOT EXISTS "personal_records_select_policy"
  ON personal_records FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert records in their workspace
CREATE POLICY IF NOT EXISTS "personal_records_insert_policy"
  ON personal_records FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'coach')
    )
  );

-- Policy: Users can update records in their workspace (coaches/admins only)
CREATE POLICY IF NOT EXISTS "personal_records_update_policy"
  ON personal_records FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'coach')
    )
  );

-- Policy: Users can delete records in their workspace (admins only)
CREATE POLICY IF NOT EXISTS "personal_records_delete_policy"
  ON personal_records FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- ─────────────────────────────────────────────────────────────────────────
-- 3.2. METRICS POLICIES
-- ─────────────────────────────────────────────────────────────────────────

-- Policy: Users can view metrics in their workspace OR global metrics
CREATE POLICY IF NOT EXISTS "metrics_select_policy"
  ON metrics FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM metric_packs mp
      WHERE mp.id = metrics.pack_id
        AND mp.is_global = TRUE
    )
  );

-- Policy: Users can insert metrics in their workspace
CREATE POLICY IF NOT EXISTS "metrics_insert_policy"
  ON metrics FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'coach')
    )
  );

-- Policy: Users can update metrics in their workspace
CREATE POLICY IF NOT EXISTS "metrics_update_policy"
  ON metrics FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'coach')
    )
  );

-- Policy: Users can delete metrics in their workspace (admins only)
CREATE POLICY IF NOT EXISTS "metrics_delete_policy"
  ON metrics FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- ─────────────────────────────────────────────────────────────────────────
-- 3.3. METRIC_PACKS POLICIES
-- ─────────────────────────────────────────────────────────────────────────

-- Policy: Users can view packs in their workspace OR global packs
CREATE POLICY IF NOT EXISTS "metric_packs_select_policy"
  ON metric_packs FOR SELECT
  USING (
    is_global = TRUE
    OR workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert packs in their workspace
CREATE POLICY IF NOT EXISTS "metric_packs_insert_policy"
  ON metric_packs FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'coach')
    )
    AND is_global = FALSE  -- Only admins can create global packs via separate policy
  );

-- Policy: Admins can create global packs
CREATE POLICY IF NOT EXISTS "metric_packs_insert_global_policy"
  ON metric_packs FOR INSERT
  WITH CHECK (
    is_global = TRUE
    AND auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE)
  );

-- Policy: Users can update packs in their workspace
CREATE POLICY IF NOT EXISTS "metric_packs_update_policy"
  ON metric_packs FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'coach')
    )
    AND is_global = FALSE
  );

-- Policy: Admins can update global packs
CREATE POLICY IF NOT EXISTS "metric_packs_update_global_policy"
  ON metric_packs FOR UPDATE
  USING (
    is_global = TRUE
    AND auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE)
  );

-- Policy: Users can delete packs in their workspace (admins only)
CREATE POLICY IF NOT EXISTS "metric_packs_delete_policy"
  ON metric_packs FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
    AND is_global = FALSE  -- Global packs cannot be deleted
  );

-- ─────────────────────────────────────────────────────────────────────────
-- 3.4. METRIC_PACK_ACTIVATIONS POLICIES
-- ─────────────────────────────────────────────────────────────────────────

-- Policy: Users can view activations for their workspace
CREATE POLICY IF NOT EXISTS "metric_pack_activations_select_policy"
  ON metric_pack_activations FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert activations for their workspace
CREATE POLICY IF NOT EXISTS "metric_pack_activations_insert_policy"
  ON metric_pack_activations FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'coach')
    )
  );

-- Policy: Users can update activations for their workspace
CREATE POLICY IF NOT EXISTS "metric_pack_activations_update_policy"
  ON metric_pack_activations FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'coach')
    )
  );

-- Policy: Users can delete activations for their workspace
CREATE POLICY IF NOT EXISTS "metric_pack_activations_delete_policy"
  ON metric_pack_activations FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_memberships 
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- 4. ENABLE RLS (IF NOT ALREADY ENABLED)
-- ============================================================================

ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE metric_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE metric_pack_activations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. VERIFY POLICIES ARE WORKING
-- ============================================================================

-- Test queries (run as authenticated user)
-- These should return only data the user has access to:

-- Test 1: Can user see their workspace records?
-- SELECT * FROM personal_records LIMIT 5;

-- Test 2: Can user see their workspace metrics?
-- SELECT * FROM metrics LIMIT 5;

-- Test 3: Can user see global packs?
-- SELECT * FROM metric_packs WHERE is_global = TRUE LIMIT 5;

-- Test 4: Can user see workspace activations?
-- SELECT * FROM metric_pack_activations LIMIT 5;

-- ============================================================================
-- 6. AUDIT POLICY COVERAGE
-- ============================================================================

DO $$
DECLARE
  coverage_report TEXT;
BEGIN
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE 'RLS POLICY COVERAGE REPORT';
  RAISE NOTICE '════════════════════════════════════════';
  
  -- Check personal_records coverage
  SELECT string_agg(cmd::text, ', ') INTO coverage_report
  FROM pg_policies
  WHERE tablename = 'personal_records';
  
  RAISE NOTICE 'personal_records: %', COALESCE(coverage_report, 'NO POLICIES');
  
  -- Check metrics coverage
  SELECT string_agg(cmd::text, ', ') INTO coverage_report
  FROM pg_policies
  WHERE tablename = 'metrics';
  
  RAISE NOTICE 'metrics: %', COALESCE(coverage_report, 'NO POLICIES');
  
  -- Check metric_packs coverage
  SELECT string_agg(cmd::text, ', ') INTO coverage_report
  FROM pg_policies
  WHERE tablename = 'metric_packs';
  
  RAISE NOTICE 'metric_packs: %', COALESCE(coverage_report, 'NO POLICIES');
  
  -- Check metric_pack_activations coverage
  SELECT string_agg(cmd::text, ', ') INTO coverage_report
  FROM pg_policies
  WHERE tablename = 'metric_pack_activations';
  
  RAISE NOTICE 'metric_pack_activations: %', COALESCE(coverage_report, 'NO POLICIES');
  
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE 'Recommended coverage: SELECT, INSERT, UPDATE, DELETE';
END $$;

-- ============================================================================
-- 7. PERFORMANCE CHECK - INDEX RECOMMENDATIONS
-- ============================================================================

-- Check if workspace_id indexes exist for RLS performance
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('personal_records', 'metrics', 'metric_packs', 'metric_pack_activations')
  AND indexdef LIKE '%workspace_id%'
ORDER BY tablename;

-- Recommend indexes if missing
DO $$
BEGIN
  -- Index for personal_records
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'personal_records' 
      AND indexdef LIKE '%workspace_id%'
  ) THEN
    RAISE NOTICE '⚠️  RECOMMENDED: CREATE INDEX idx_personal_records_workspace ON personal_records(workspace_id);';
  END IF;
  
  -- Index for metrics
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'metrics' 
      AND indexdef LIKE '%workspace_id%'
  ) THEN
    RAISE NOTICE '⚠️  RECOMMENDED: CREATE INDEX idx_metrics_workspace ON metrics(workspace_id);';
  END IF;
  
  -- Index for metric_packs
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'metric_packs' 
      AND indexdef LIKE '%workspace_id%'
  ) THEN
    RAISE NOTICE '⚠️  RECOMMENDED: CREATE INDEX idx_metric_packs_workspace ON metric_packs(workspace_id);';
  END IF;
  
  -- Index for metric_pack_activations
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'metric_pack_activations' 
      AND indexdef LIKE '%workspace_id%'
  ) THEN
    RAISE NOTICE '⚠️  RECOMMENDED: CREATE INDEX idx_metric_pack_activations_workspace ON metric_pack_activations(workspace_id);';
  END IF;
END $$;

-- ============================================================================
-- 8. FINAL SUMMARY
-- ============================================================================

DO $$
DECLARE
  total_tables INTEGER := 4;
  tables_with_rls INTEGER;
  total_policies INTEGER;
BEGIN
  -- Count tables with RLS enabled
  SELECT COUNT(*) INTO tables_with_rls
  FROM pg_class
  WHERE relname IN ('personal_records', 'metrics', 'metric_packs', 'metric_pack_activations')
    AND relrowsecurity = TRUE;
  
  -- Count total policies
  SELECT COUNT(*) INTO total_policies
  FROM pg_policies
  WHERE tablename IN ('personal_records', 'metrics', 'metric_packs', 'metric_pack_activations');
  
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE 'FINAL RLS VALIDATION SUMMARY';
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE 'Tables with RLS: %/%', tables_with_rls, total_tables;
  RAISE NOTICE 'Total Policies: %', total_policies;
  
  IF tables_with_rls = total_tables AND total_policies >= 12 THEN
    RAISE NOTICE '✅ RLS VALIDATION PASSED';
  ELSE
    RAISE WARNING '⚠️  RLS VALIDATION INCOMPLETE';
    IF tables_with_rls < total_tables THEN
      RAISE WARNING '   - Enable RLS on % tables', total_tables - tables_with_rls;
    END IF;
    IF total_policies < 12 THEN
      RAISE WARNING '   - Create missing policies (recommended: 3-4 per table)';
    END IF;
  END IF;
  RAISE NOTICE '════════════════════════════════════════';
END $$;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Review WARNINGS and apply recommended policies
-- 3. Test policies with real user authentication
-- 4. Adjust role checks based on your workspace_memberships structure
-- 5. Consider performance impact of complex policies on large tables
-- ============================================================================
