/**
 * Custom Metrics Validation API - Data OS V3
 * 
 * POST /api/custom-metrics/validate - Validate formula before saving
 * 
 * @author PerformTrack Team
 * @since Week 2 Day 3-4
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Import formula validator (when ready)
// For now, basic validation

// ============================================================================
// POST /api/custom-metrics/validate - Validate formula
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.formula) {
      return NextResponse.json(
        { error: 'formula is required' },
        { status: 400 }
      );
    }

    if (!body.workspace_id) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formula = body.formula.trim();
    const workspaceId = body.workspace_id;

    // ============================================================
    // STEP 1: Fetch available metrics
    // ============================================================

    const { data: metrics, error: metricsError } = await supabase
      .from('metrics')
      .select('id, key, name')
      .eq('workspace_id', workspaceId);

    if (metricsError) {
      console.error('Error fetching metrics:', metricsError);
      return NextResponse.json(
        { error: 'Failed to fetch metrics', details: metricsError.message },
        { status: 500 }
      );
    }

    const availableMetricIds = new Set(metrics?.map(m => m.key) || []);

    // ============================================================
    // STEP 2: Validate formula
    // ============================================================

    const errors: Array<{ type: string; message: string; position?: number }> = [];
    const warnings: Array<{ type: string; message: string }> = [];
    const dependencies: string[] = [];

    // Check if formula is empty
    if (!formula) {
      errors.push({
        type: 'syntax',
        message: 'Fórmula vazia'
      });

      return NextResponse.json({
        isValid: false,
        errors,
        warnings,
        dependencies
      });
    }

    // Extract metric references
    const metricRegex = /metric_[a-zA-Z0-9_]+/g;
    const metricMatches = formula.match(metricRegex);

    if (metricMatches) {
      metricMatches.forEach(metricKey => {
        if (!availableMetricIds.has(metricKey)) {
          errors.push({
            type: 'reference',
            message: `Métrica "${metricKey}" não existe no workspace`
          });
        } else {
          if (!dependencies.includes(metricKey)) {
            dependencies.push(metricKey);
          }
        }
      });
    } else {
      // No metrics found, check if it's just numbers/operators
      if (!/^[0-9+\-*/().\s]+$/.test(formula)) {
        warnings.push({
          type: 'reference',
          message: 'Nenhuma métrica encontrada na fórmula'
        });
      }
    }

    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (let i = 0; i < formula.length; i++) {
      if (formula[i] === '(') parenthesesCount++;
      if (formula[i] === ')') parenthesesCount--;
      
      if (parenthesesCount < 0) {
        errors.push({
          type: 'syntax',
          message: 'Parênteses não balanceados',
          position: i
        });
        break;
      }
    }

    if (parenthesesCount !== 0) {
      errors.push({
        type: 'syntax',
        message: `Parênteses não balanceados (${parenthesesCount > 0 ? 'faltam ' + parenthesesCount + ' fechar' : 'sobram ' + Math.abs(parenthesesCount)})`
      });
    }

    // Check for division by zero
    if (formula.includes('/ 0') || formula.includes('/0')) {
      errors.push({
        type: 'syntax',
        message: 'Divisão por zero detectada'
      });
    }

    // Check for invalid characters
    const validCharsRegex = /^[a-zA-Z0-9_+\-*/().\s]+$/;
    if (!validCharsRegex.test(formula)) {
      errors.push({
        type: 'syntax',
        message: 'Fórmula contém caracteres inválidos'
      });
    }

    // Check complexity
    if (dependencies.length > 10) {
      warnings.push({
        type: 'performance',
        message: 'Fórmula complexa com muitas dependências (pode ser lenta)'
      });
    }

    // Check for common mistakes
    if (formula.includes('metric_old_') || formula.includes('_deprecated')) {
      warnings.push({
        type: 'deprecated',
        message: 'Fórmula pode estar usando métricas obsoletas'
      });
    }

    // ============================================================
    // STEP 3: Return validation result
    // ============================================================

    const isValid = errors.length === 0;

    return NextResponse.json({
      isValid,
      errors,
      warnings,
      dependencies,
      metrics: dependencies.map(key => {
        const metric = metrics?.find(m => m.key === key);
        return {
          key,
          name: metric?.name || key,
          exists: true
        };
      })
    });

  } catch (error: any) {
    console.error('Unexpected error in POST /api/custom-metrics/validate:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
