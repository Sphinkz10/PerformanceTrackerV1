/**
 * Decision Engine - Runner
 * 
 * FASE 8 DAY 5: Engine orchestration
 * 
 * The main engine runner that orchestrates the entire decision-making process:
 * 1. Get all active athletes in workspace
 * 2. Build metric context for each athlete
 * 3. Evaluate all rules
 * 4. Collect triggered decisions
 * 5. Save decisions to storage
 * 6. Return execution report
 * 
 * This is designed to be called by:
 * - Cron job (daily automated run)
 * - Manual trigger (API endpoint)
 * - Webhook (after metric update)
 */

import type { Decision, EngineRunResult, MetricContext, RuleEvaluationResult } from './types';
import { buildMetricContext, buildMetricContextBatch } from './aggregator';
import { evaluateRules, evaluateAndGetDecisions, sortDecisionsByPriority } from './evaluator';
import { getEnabledRules } from './rules';
import { mockDecisions } from '@/data/mock/mockDecisions';

// ============================================================================
// MAIN ENGINE RUNNER
// ============================================================================

/**
 * Run decision engine for entire workspace
 * 
 * This is the main entry point for automated decision generation.
 * Called by cron job or manual trigger.
 * 
 * @param workspaceId - Workspace to process
 * @param options - Configuration options
 * @returns Execution report with statistics
 */
export async function runDecisionEngine(
  workspaceId: string,
  options?: {
    athleteIds?: string[];      // Specific athletes (or all)
    ruleIds?: string[];         // Specific rules (or all enabled)
    skipCooldown?: boolean;     // Force re-evaluation (testing)
    skipDeduplication?: boolean;// Allow duplicate decisions (testing)
    dryRun?: boolean;           // Don't save decisions, just return them
  }
): Promise<EngineRunResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];
  
  console.log(`[Decision Engine] Starting run for workspace: ${workspaceId}`);
  
  try {
    // ========================================================================
    // STEP 1: Get Athletes
    // ========================================================================
    
    let athleteIds: string[];
    
    if (options?.athleteIds && options.athleteIds.length > 0) {
      // Use provided athlete IDs
      athleteIds = options.athleteIds;
      console.log(`[Decision Engine] Processing ${athleteIds.length} specified athletes`);
    } else {
      // Get all active athletes in workspace
      athleteIds = await getActiveAthletes(workspaceId);
      console.log(`[Decision Engine] Found ${athleteIds.length} active athletes`);
    }
    
    if (athleteIds.length === 0) {
      warnings.push('No active athletes found in workspace');
      return {
        workspaceId,
        athletesEvaluated: 0,
        rulesEvaluated: 0,
        decisionsCreated: 0,
        decisionsSkipped: 0,
        errors,
        warnings,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
    }
    
    // ========================================================================
    // STEP 2: Build Metric Contexts
    // ========================================================================
    
    console.log('[Decision Engine] Building metric contexts...');
    
    const contexts = await buildMetricContextBatch(athleteIds, workspaceId);
    
    console.log(`[Decision Engine] Built ${contexts.size} metric contexts`);
    
    // ========================================================================
    // STEP 3: Get Rules to Evaluate
    // ========================================================================
    
    const rules = options?.ruleIds && options.ruleIds.length > 0
      ? getEnabledRules().filter(rule => options.ruleIds!.includes(rule.id))
      : getEnabledRules();
    
    console.log(`[Decision Engine] Evaluating ${rules.length} rules`);
    
    if (rules.length === 0) {
      warnings.push('No enabled rules found');
    }
    
    // ========================================================================
    // STEP 4: Evaluate Rules for Each Athlete
    // ========================================================================
    
    console.log('[Decision Engine] Evaluating rules...');
    
    const allDecisions: Decision[] = [];
    const allResults: RuleEvaluationResult[] = [];
    let decisionsSkipped = 0;
    
    let processedAthletes = 0;
    
    for (const [athleteId, context] of contexts) {
      try {
        const results = evaluateRules(context, {
          rules,
          skipCooldown: options?.skipCooldown,
          skipDeduplication: options?.skipDeduplication,
        });
        
        allResults.push(...results);
        
        // Collect triggered decisions
        const decisions = results
          .filter(r => r.triggered && r.decision)
          .map(r => r.decision!);
        
        allDecisions.push(...decisions);
        
        // Count skipped
        decisionsSkipped += results.filter(r => !r.triggered).length;
        
        processedAthletes++;
        
        if (decisions.length > 0) {
          console.log(
            `[Decision Engine] Athlete ${athleteId}: ${decisions.length} decision(s) generated`
          );
        }
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Athlete ${athleteId}: ${errorMsg}`);
        console.error(`[Decision Engine] Error processing athlete ${athleteId}:`, error);
      }
    }
    
    console.log(`[Decision Engine] Generated ${allDecisions.length} decisions`);
    
    // ========================================================================
    // STEP 5: Sort Decisions by Priority
    // ========================================================================
    
    const sortedDecisions = sortDecisionsByPriority(allDecisions);
    
    // ========================================================================
    // STEP 6: Save Decisions (if not dry run)
    // ========================================================================
    
    if (!options?.dryRun && sortedDecisions.length > 0) {
      console.log('[Decision Engine] Saving decisions...');
      
      try {
        await saveDecisions(sortedDecisions, workspaceId);
        console.log(`[Decision Engine] Saved ${sortedDecisions.length} decisions`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to save decisions';
        errors.push(`Save failed: ${errorMsg}`);
        console.error('[Decision Engine] Error saving decisions:', error);
      }
    } else if (options?.dryRun) {
      console.log('[Decision Engine] Dry run - decisions not saved');
    }
    
    // ========================================================================
    // STEP 7: Calculate Breakdown
    // ========================================================================
    
    const breakdown = calculateBreakdown(sortedDecisions);
    
    // ========================================================================
    // STEP 8: Return Results
    // ========================================================================
    
    const duration = Date.now() - startTime;
    
    console.log(`[Decision Engine] Completed in ${duration}ms`);
    console.log(`[Decision Engine] Summary: ${processedAthletes} athletes, ${allDecisions.length} decisions, ${errors.length} errors`);
    
    return {
      workspaceId,
      athletesEvaluated: processedAthletes,
      rulesEvaluated: rules.length,
      decisionsCreated: allDecisions.length,
      decisionsSkipped,
      errors,
      warnings,
      duration,
      timestamp: new Date().toISOString(),
      breakdown,
    };
    
  } catch (error) {
    // Fatal error - entire run failed
    const errorMsg = error instanceof Error ? error.message : 'Unknown fatal error';
    errors.push(`Fatal: ${errorMsg}`);
    console.error('[Decision Engine] Fatal error:', error);
    
    return {
      workspaceId,
      athletesEvaluated: 0,
      rulesEvaluated: 0,
      decisionsCreated: 0,
      decisionsSkipped: 0,
      errors,
      warnings,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Run decision engine for a single athlete
 * 
 * Convenience function for manual triggers or testing.
 */
export async function runDecisionEngineForAthlete(
  athleteId: string,
  workspaceId: string,
  options?: {
    skipCooldown?: boolean;
    skipDeduplication?: boolean;
    dryRun?: boolean;
  }
): Promise<Decision[]> {
  const result = await runDecisionEngine(workspaceId, {
    athleteIds: [athleteId],
    skipCooldown: options?.skipCooldown,
    skipDeduplication: options?.skipDeduplication,
    dryRun: options?.dryRun,
  });
  
  // Return decisions from mock data if dry run
  // In production, query from database
  return mockDecisions.filter(d => 
    d.athleteId === athleteId && 
    d.workspaceId === workspaceId
  );
}

// ============================================================================
// DATA ACCESS HELPERS
// ============================================================================

/**
 * Get all active athletes in workspace
 * 
 * MOCK IMPLEMENTATION:
 * Returns hardcoded athlete IDs for testing
 * 
 * PRODUCTION:
 * Query Supabase athletes table
 */
async function getActiveAthletes(workspaceId: string): Promise<string[]> {
  // TODO: Replace with real Supabase query
  // 
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from('athletes')
  //   .select('id')
  //   .eq('workspace_id', workspaceId)
  //   .eq('status', 'active');
  // 
  // if (error) throw error;
  // return data?.map(a => a.id) || [];
  
  // MOCK: Return 20 athlete IDs (matching our mock decisions)
  return Array.from({ length: 20 }, (_, i) => 
    `athlete-${String(i + 1).padStart(3, '0')}`
  );
}

/**
 * Save decisions to storage
 * 
 * MOCK IMPLEMENTATION:
 * Just logs decisions (doesn't actually save)
 * 
 * PRODUCTION:
 * Bulk insert into Supabase decisions table
 */
async function saveDecisions(
  decisions: Decision[],
  workspaceId: string
): Promise<void> {
  // TODO: Replace with real Supabase insert
  // 
  // const supabase = createClient();
  // const { error } = await supabase
  //   .from('decisions')
  //   .insert(decisions);
  // 
  // if (error) throw error;
  
  // MOCK: Just log
  console.log(`[Mock] Would save ${decisions.length} decisions to database`);
  
  // Log critical decisions
  const critical = decisions.filter(d => d.priority === 'critical');
  if (critical.length > 0) {
    console.log(`[Mock] ${critical.length} CRITICAL decisions:`);
    critical.forEach(d => {
      console.log(`  - ${d.athleteName}: ${d.recommendation}`);
    });
  }
}

// ============================================================================
// STATISTICS & BREAKDOWN
// ============================================================================

/**
 * Calculate decision breakdown by priority, type, and rule
 */
function calculateBreakdown(decisions: Decision[]) {
  const byPriority: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  
  const byType: Record<string, number> = {};
  const byRule: Record<string, number> = {};
  
  decisions.forEach(decision => {
    // By priority
    byPriority[decision.priority] = (byPriority[decision.priority] || 0) + 1;
    
    // By type
    byType[decision.type] = (byType[decision.type] || 0) + 1;
    
    // By rule
    if (decision.ruleId) {
      byRule[decision.ruleId] = (byRule[decision.ruleId] || 0) + 1;
    }
  });
  
  return {
    byPriority: byPriority as Record<Decision['priority'], number>,
    byType: byType as Record<Decision['type'], number>,
    byRule,
  };
}

/**
 * Get engine execution statistics
 */
export function getEngineStats(result: EngineRunResult) {
  const decisionsPerAthlete = result.athletesEvaluated > 0
    ? result.decisionsCreated / result.athletesEvaluated
    : 0;
  
  const successRate = result.athletesEvaluated > 0
    ? ((result.athletesEvaluated - result.errors.length) / result.athletesEvaluated) * 100
    : 100;
  
  const avgTimePerAthlete = result.athletesEvaluated > 0
    ? result.duration / result.athletesEvaluated
    : 0;
  
  return {
    decisionsPerAthlete: Math.round(decisionsPerAthlete * 100) / 100,
    successRate: Math.round(successRate * 10) / 10,
    avgTimePerAthlete: Math.round(avgTimePerAthlete),
    errorRate: result.athletesEvaluated > 0
      ? (result.errors.length / result.athletesEvaluated) * 100
      : 0,
  };
}

// ============================================================================
// SCHEDULING HELPERS
// ============================================================================

/**
 * Should the engine run now?
 * 
 * Helper for cron job logic.
 * Default: Run daily at 6 AM local time
 */
export function shouldRunEngine(): boolean {
  const now = new Date();
  const hour = now.getHours();
  
  // Run between 6 AM and 7 AM
  return hour === 6;
}

/**
 * Get next scheduled run time
 */
export function getNextRunTime(): Date {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(6, 0, 0, 0);
  
  return tomorrow;
}

/**
 * Calculate time until next run
 */
export function getTimeUntilNextRun(): number {
  const now = new Date();
  const next = getNextRunTime();
  
  return next.getTime() - now.getTime();
}

// ============================================================================
// MONITORING & HEALTH CHECKS
// ============================================================================

/**
 * Check engine health
 * 
 * Validates that all components are working
 */
export async function checkEngineHealth(): Promise<{
  healthy: boolean;
  checks: Record<string, boolean>;
  errors: string[];
}> {
  const checks: Record<string, boolean> = {};
  const errors: string[] = [];
  
  // Check 1: Rules loaded
  try {
    const rules = getEnabledRules();
    checks.rulesLoaded = rules.length > 0;
    if (rules.length === 0) {
      errors.push('No enabled rules found');
    }
  } catch (error) {
    checks.rulesLoaded = false;
    errors.push('Failed to load rules');
  }
  
  // Check 2: Can build metric context
  try {
    const context = await buildMetricContext('test-athlete', 'test-workspace');
    checks.contextBuilder = context !== null;
  } catch (error) {
    checks.contextBuilder = false;
    errors.push('Failed to build metric context');
  }
  
  // Check 3: Can evaluate rules
  try {
    const context = await buildMetricContext('test-athlete', 'test-workspace');
    const results = evaluateRules(context, { skipCooldown: true });
    checks.evaluator = results.length > 0;
  } catch (error) {
    checks.evaluator = false;
    errors.push('Failed to evaluate rules');
  }
  
  const healthy = Object.values(checks).every(check => check);
  
  return {
    healthy,
    checks,
    errors,
  };
}

/**
 * Get engine configuration
 */
export function getEngineConfig() {
  const rules = getEnabledRules();
  
  return {
    version: '1.0.0',
    rulesEnabled: rules.length,
    rulesTotal: 5, // Hardcoded rules count
    scheduledRunTime: '06:00',
    features: {
      cooldowns: true,
      deduplication: true,
      prioritySort: true,
      batchProcessing: true,
    },
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  getActiveAthletes,
  saveDecisions,
  calculateBreakdown,
};

export default runDecisionEngine;
