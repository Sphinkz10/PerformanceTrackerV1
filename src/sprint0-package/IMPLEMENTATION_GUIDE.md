# 🚀 SPRINT 0: IMPLEMENTATION GUIDE

> **Step-by-step guide to implement Sprint 0 changes**  
> **Time:** ~1-2 hours  
> **Complexity:** Medium

---

## 📋 PRE-IMPLEMENTATION CHECKLIST

Before you start, make sure you have:

- [ ] ✅ Reviewed all files in `/sprint0-package`
- [ ] ✅ Read `AUDIT_COMPLETO_SPRINT_0.md`
- [ ] ✅ Supabase project ready (or will connect later)
- [ ] ✅ Git branch created: `sprint-0/critical-fixes`
- [ ] ✅ Database backup created (if existing data)
- [ ] ✅ 1-2 hours of focused time available

---

## ⏱️ TIMELINE

```
Phase 1: Setup (15min)
├─ Copy files to project
├─ Review & verify
└─ Git commit

Phase 2: Connect Supabase (10min)
├─ Setup env variables
├─ Test connection
└─ Verify access

Phase 3: Run Migrations (20min)
├─ Backup database
├─ Run MIGRATIONS_MASTER_V2_FINAL.sql
├─ Run VALIDATION_QUERIES.sql
└─ Verify results

Phase 4: Deploy Code (15min)
├─ Push to git
├─ Deploy to Vercel
├─ Setup cron secret
└─ Test cron endpoint

Phase 5: Validation (20min)
├─ Run manual tests
├─ Check baselines
├─ Monitor logs
└─ Celebrate! 🎉
```

---

## 📦 PHASE 1: SETUP (15min)

### **Step 1.1: Copy Files**

```bash
# Navigate to your project root
cd /path/to/performtrack

# Copy TypeScript files
cp -r sprint0-package/src/* ./src/

# Copy config files
cp sprint0-package/vercel.json ./vercel.json
cp sprint0-package/.env.example ./.env.example

# Copy SQL files to a migrations folder
mkdir -p ./supabase/migrations/sprint0
cp sprint0-package/MIGRATIONS_MASTER_V2_FINAL.sql ./supabase/migrations/sprint0/
cp sprint0-package/ROLLBACK_SPRINT_0.sql ./supabase/migrations/sprint0/
cp sprint0-package/VALIDATION_QUERIES.sql ./supabase/migrations/sprint0/
```

### **Step 1.2: Verify Files**

```bash
# List TypeScript files created
ls -la src/types/
ls -la src/lib/metrics/
ls -la src/lib/decision-engine/
ls -la src/app/api/cron/

# Should see:
# - src/types/metrics.ts (updated)
# - src/types/decisions.ts (updated)
# - src/lib/metrics/baselines.ts
# - src/lib/metrics/aggregation.ts
# - src/lib/metrics/queries.ts
# - src/lib/decision-engine/threshold-calculator.ts
# - src/app/api/cron/refresh-baselines/route.ts
# - src/app/api/metric-updates/route.ts
```

### **Step 1.3: Review Changes**

```bash
# Review type definitions
code src/types/metrics.ts
code src/types/decisions.ts

# Key changes to note:
# - New field: tags (array)
# - New field: aggregationMethod
# - New field: baselineMethod, baselinePeriodDays
# - New field: sourcePriority
# - New field: cooldownHours
# - Updated operators: below-baseline, above-baseline, outside-range
```

### **Step 1.4: Install Dependencies (if needed)**

```bash
# Check if Supabase client installed
npm list @supabase/supabase-js

# If not installed:
npm install @supabase/supabase-js

# Compile TypeScript to check for errors
npm run type-check

# Expected: No errors
```

### **Step 1.5: Git Commit**

```bash
# Create branch
git checkout -b sprint-0/critical-fixes

# Stage files
git add .

# Commit
git commit -m "feat(sprint-0): Add critical fixes for Data OS

- Add tags to metrics for categorization
- Add aggregation methods for multiple values per day
- Add source priority for conflict resolution
- Add baseline calculation with materialized view
- Add cooldown to belief rules
- Create metric_pack_activations table
- Add athlete-specific threshold operators
- Add comprehensive error handling

Implements fixes from AUDIT_COMPLETO_SPRINT_0.md"

# Push to remote
git push origin sprint-0/critical-fixes
```

✅ **Phase 1 Complete!** Files copied and committed.

---

## 🔌 PHASE 2: CONNECT SUPABASE (10min)

### **Step 2.1: Setup Environment Variables**

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local
code .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Generate a random cron secret
CRON_SECRET=$(openssl rand -base64 32)
```

### **Step 2.2: Verify Supabase Connection**

```bash
# Start dev server
npm run dev

# In another terminal, test connection
curl http://localhost:3000/api/health

# Expected: Should connect without errors
```

### **Step 2.3: Test Database Access**

Open Supabase SQL Editor and run:

```sql
-- Test query
SELECT 
  tablename,
  schemaname
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'metric%'
ORDER BY tablename;

-- Expected: List of existing metric tables
```

✅ **Phase 2 Complete!** Supabase connected.

---

## 🗄️ PHASE 3: RUN MIGRATIONS (20min)

### **Step 3.1: CRITICAL - Backup Database**

Via Supabase Dashboard:
1. Go to Settings → Database
2. Click "Create backup"
3. Wait for completion
4. **Download backup file to local machine**

Alternative (CLI):
```bash
supabase db dump > backup_before_sprint0_$(date +%Y%m%d_%H%M%S).sql
```

### **Step 3.2: Review Migration**

```bash
# Open migration file
code ./supabase/migrations/sprint0/MIGRATIONS_MASTER_V2_FINAL.sql

# Key things to verify:
# - Line 18: tags column added
# - Line 29: aggregation_method column added
# - Line 57: source_priority column added
# - Line 79: cooldown_hours column added
# - Line 95: metric_pack_activations table created
# - Line 140: Safety check for orphan metrics
# - Line 214: Materialized view created (WITHOUT baseline_period_days)
# - Line 252: Refresh function created
# - Line 273: Trigger created for auto-setting priority
```

### **Step 3.3: Run Migration**

**Option A: Supabase Dashboard (Recommended)**

1. Open Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy entire content of `MIGRATIONS_MASTER_V2_FINAL.sql`
4. Paste into editor
5. Click "Run"

Watch for output:
```
BEGIN
✓ Migration 1: Tags added to metrics
✓ Migration 2: Aggregation methods configured
✓ Migration 3: Source priorities configured
✓ Migration 4: Cooldown configured
✓ Migration 5: metric_pack_activations table created
✓ Safety check passed: No orphan metrics detected
✓ Migrated 5 pack activations
✓ Migration 5: Pack data migrated successfully
✓ Migration 6: Baseline configuration added
✓ Calculated 47 baselines
✓ Migration 7: Materialized view created
✓ Migration 8: Refresh function created
✓ Migration 9: Priority trigger created
✓ Tags index verified
✓ Source priorities consistent
✓ Materialized view verified
✓ Priority trigger verified
COMMIT

═══════════════════════════════════════════════════
   SPRINT 0 V2 MIGRATION COMPLETE
═══════════════════════════════════════════════════
```

**Option B: psql (Advanced)**

```bash
psql $DATABASE_URL < ./supabase/migrations/sprint0/MIGRATIONS_MASTER_V2_FINAL.sql
```

### **Step 3.4: Run Validation**

```bash
# Open validation file
code ./supabase/migrations/sprint0/VALIDATION_QUERIES.sql

# Run in Supabase SQL Editor (or psql)
# Should see:
# - ✓ All columns exist
# - ✓ All indexes created
# - ✓ Triggers exist
# - ✓ Data migrated
# - ✓ No orphan metrics
# - ✓ Priorities consistent
```

### **Step 3.5: Verify Results**

Quick verification query:

```sql
-- Run this in SQL Editor
SELECT 
  'metrics' as table_name,
  (SELECT COUNT(*) FROM metrics WHERE tags IS NOT NULL) as has_tags_count,
  (SELECT COUNT(*) FROM metrics WHERE aggregation_method IS NOT NULL) as has_aggregation_count,
  (SELECT COUNT(*) FROM metrics WHERE baseline_method IS NOT NULL) as has_baseline_count
UNION ALL
SELECT 
  'metric_updates',
  (SELECT COUNT(*) FROM metric_updates WHERE source_priority > 0),
  NULL,
  NULL
UNION ALL
SELECT 
  'metric_pack_activations',
  (SELECT COUNT(*) FROM metric_pack_activations),
  NULL,
  NULL
UNION ALL
SELECT 
  'metric_baselines',
  (SELECT COUNT(*) FROM metric_baselines),
  NULL,
  NULL;
```

Expected: All counts > 0

✅ **Phase 3 Complete!** Database migrated successfully.

---

## 🚀 PHASE 4: DEPLOY CODE (15min)

### **Step 4.1: Test Locally**

```bash
# Build project
npm run build

# Expected: No TypeScript errors
```

If errors occur:
- Check import paths
- Verify all types exist
- Check Supabase client setup

### **Step 4.2: Deploy to Vercel**

```bash
# Commit latest changes
git add .
git commit -m "fix: Resolve build errors"
git push origin sprint-0/critical-fixes

# Deploy to Vercel
vercel --prod

# Or via Vercel Dashboard:
# 1. Go to your project
# 2. Go to Deployments
# 3. Click "Deploy" on sprint-0/critical-fixes branch
```

### **Step 4.3: Setup Cron Secret**

Via Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add new variable:
   - **Key:** `CRON_SECRET`
   - **Value:** (paste your generated secret from .env.local)
   - **Environments:** Production, Preview
3. Click "Save"

### **Step 4.4: Redeploy**

```bash
# Trigger redeploy to pick up new env var
vercel --prod --force
```

### **Step 4.5: Test Cron Endpoint**

```bash
# Test the endpoint (replace with your domain)
curl -X GET https://your-app.vercel.app/api/cron/refresh-baselines \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Expected response:
# {
#   "success": true,
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "duration_ms": 1234,
#   "message": "Baselines refreshed successfully"
# }
```

✅ **Phase 4 Complete!** Code deployed and cron working.

---

## ✅ PHASE 5: VALIDATION (20min)

### **Step 5.1: Manual E2E Test**

**Test 1: Create metric with tag**

```bash
curl -X POST https://your-app.vercel.app/api/metrics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "workspaceId": "your-workspace-id",
    "name": "Test HRV",
    "type": "scale",
    "category": "wellness",
    "scaleMin": 0,
    "scaleMax": 100,
    "tags": ["dashboard", "critical"],
    "aggregationMethod": "max",
    "baselineMethod": "rolling-average",
    "baselinePeriodDays": 28
  }'
```

**Test 2: Create multiple updates (test aggregation)**

```bash
# Morning value
curl -X POST https://your-app.vercel.app/api/metric-updates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "metricId": "test-hrv-id",
    "athleteId": "athlete-id",
    "value": 65,
    "sourceType": "manual_entry",
    "timestamp": "2024-01-15T08:00:00Z"
  }'

# Afternoon value
curl -X POST https://your-app.vercel.app/api/metric-updates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "metricId": "test-hrv-id",
    "athleteId": "athlete-id",
    "value": 72,
    "sourceType": "sensor",
    "timestamp": "2024-01-15T14:00:00Z"
  }'

# Check aggregation (should return 65 - manual_entry has priority 10)
curl https://your-app.vercel.app/api/metric-updates?metricId=test-hrv-id&athleteId=athlete-id
```

**Test 3: Check baseline calculation**

After 24h (or trigger manually):

```sql
SELECT * FROM metric_baselines 
WHERE metric_id = 'test-hrv-id' 
AND athlete_id = 'athlete-id';

-- Should show baseline_avg, baseline_median, etc.
```

### **Step 5.2: Monitor Logs**

```bash
# Vercel logs
vercel logs --follow

# Look for:
# - ✓ Baseline refresh success
# - No errors in metric update creation
# - Source priority correctly set
```

### **Step 5.3: Check Supabase Logs**

1. Go to Supabase Dashboard → Logs
2. Filter by "Database"
3. Look for refresh function calls
4. Verify no errors

### **Step 5.4: Final Validation Checklist**

- [ ] ✅ All migrations applied (checked via validation queries)
- [ ] ✅ Tags working (can query metrics by tag)
- [ ] ✅ Aggregation working (multiple values → correct result)
- [ ] ✅ Source priority working (manual_entry wins over sensor)
- [ ] ✅ Baselines calculated (materialized view has data)
- [ ] ✅ Cron job working (can manually trigger refresh)
- [ ] ✅ Trigger working (new updates get correct priority)
- [ ] ✅ No orphan metrics (validation query returns 0)
- [ ] ✅ No console errors in application
- [ ] ✅ Vercel deployment successful

✅ **Phase 5 Complete!** Everything validated and working.

---

## 🎉 SUCCESS!

**Sprint 0 implementation complete!**

You now have:
- ✅ Tags for metric categorization
- ✅ Aggregation for multiple values per day
- ✅ Source priority for conflict resolution
- ✅ Baseline calculation with materialized view
- ✅ Cooldown for belief rules
- ✅ Better pack architecture
- ✅ Athlete-specific thresholds
- ✅ Comprehensive error handling

---

## 🔄 NEXT STEPS

1. **Monitor for 24-48h**
   - Watch baseline refresh jobs
   - Check for any errors
   - Verify performance

2. **Update Documentation**
   - Document new features for team
   - Update API docs
   - Add examples to wiki

3. **Training**
   - Show team how to use tags
   - Explain aggregation methods
   - Demo baseline-relative rules

4. **Start Fase 2!** 🚀
   - Metrics CRUD pages
   - Dashboard integration
   - Advanced features

---

## 🆘 TROUBLESHOOTING

### **Issue: Migration fails with "orphan metrics" error**

**Solution:**
1. Check which metrics would be orphaned:
   ```sql
   SELECT m.name, wp.name as pack_name
   FROM metrics m
   JOIN metric_packs wp ON wp.id = m.pack_id
   WHERE wp.workspace_id IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM metric_packs gp 
       WHERE gp.name = wp.name AND gp.is_global = TRUE
     );
   ```
2. Create missing global packs
3. Re-run migration

### **Issue: Baseline refresh fails**

**Solution:**
1. Check logs in Supabase
2. Manually run: `SELECT refresh_metric_baselines();`
3. Check for locks: `SELECT * FROM pg_locks WHERE relation = 'metric_baselines'::regclass;`
4. If locked, kill process or wait

### **Issue: Cron endpoint returns 401**

**Solution:**
1. Verify `CRON_SECRET` in Vercel env vars
2. Check authorization header format: `Bearer YOUR_SECRET`
3. Redeploy to pick up new env var

### **Issue: TypeScript errors after copying files**

**Solution:**
1. Check import paths (relative vs absolute)
2. Verify `@/` alias configured in `tsconfig.json`
3. Run `npm install` to ensure dependencies
4. Restart TypeScript server in IDE

---

## 📞 NEED HELP?

- Check `TESTING_GUIDE.md` for test cases
- Review `AUDIT_COMPLETO_SPRINT_0.md` for detailed explanations
- Check Supabase logs for database errors
- Check Vercel logs for runtime errors

---

**Made with 🚀 for PerformTrack Data OS**  
**Version:** Sprint 0 V2 (Post-Audit)  
**Last Updated:** 2024-12-30