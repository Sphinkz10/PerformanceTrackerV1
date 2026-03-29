/**
 * Custom Metrics Calculate API - Data OS V3
 * 
 * POST /api/custom-metrics/calculate
 * Calcula valor de uma custom metric para um atleta específico
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.custom_metric_id) {
      return NextResponse.json({ error: 'custom_metric_id is required' }, { status: 400 });
    }

    if (!body.athlete_id) {
      return NextResponse.json({ error: 'athlete_id is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch custom metric
    const { data: customMetric, error: metricError } = await supabase
      .from('custom_metrics')
      .select('*')
      .eq('id', body.custom_metric_id)
      .single();

    if (metricError || !customMetric) {
      return NextResponse.json({ error: 'Custom metric not found' }, { status: 404 });
    }

    // Fetch source metric values
    const sourceMetrics = customMetric.source_metrics || [];
    const metricValues: Record<string, number> = {};

    for (const metricKey of sourceMetrics) {
      // Fetch latest value for this athlete and metric
      const { data: metricData } = await supabase
        .from('metrics')
        .select('id')
        .eq('key', metricKey)
        .eq('workspace_id', customMetric.workspace_id)
        .single();

      if (metricData) {
        const { data: updateData } = await supabase
          .from('metric_updates')
          .select('value')
          .eq('metric_id', metricData.id)
          .eq('athlete_id', body.athlete_id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (updateData) {
          metricValues[metricKey] = updateData.value;
        }
      }
    }

    // Calculate value using formula
    let processedFormula = customMetric.formula;
    
    for (const [metricKey, value] of Object.entries(metricValues)) {
      const metricPattern = new RegExp(metricKey, 'g');
      processedFormula = processedFormula.replace(metricPattern, String(value));
    }

    // Evaluate (simple math only for safety)
    let calculatedValue = 0;
    try {
      if (/^[0-9+\-*/().\s]+$/.test(processedFormula)) {
        calculatedValue = Function(`'use strict'; return (${processedFormula})`)();
      }
    } catch (error) {
      return NextResponse.json({ error: 'Failed to calculate formula' }, { status: 500 });
    }

    // Store calculated value
    const { data: storedValue, error: storeError } = await supabase
      .from('custom_metric_values')
      .insert({
        custom_metric_id: customMetric.id,
        athlete_id: body.athlete_id,
        value: calculatedValue,
        computed_at: new Date().toISOString(),
        source_data: metricValues
      })
      .select()
      .single();

    if (storeError) {
      console.error('Error storing value:', storeError);
    }

    return NextResponse.json({
      value: calculatedValue,
      sourceData: metricValues,
      formula: customMetric.formula,
      processedFormula,
      storedValue
    });

  } catch (error: any) {
    console.error('Calculate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
