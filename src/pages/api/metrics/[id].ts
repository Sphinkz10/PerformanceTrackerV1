/**
 * FASE 2: Metrics API - GET by ID, PUT, DELETE
 * 
 * VERSION 1 (ACTIVE): Works with mock data
 * VERSION 2 (COMMENTED): Ready for Supabase (uncomment when connecting DB)
 * 
 * Pages Router format (compatible with hybrid setup)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
// import { createClient } from '@/lib/supabase/server'; // UNCOMMENT when connecting Supabase
import type { Metric } from '@/types/metrics';
import { validateMetric } from '@/types/metrics';
import { mockMetrics, mockMetricUpdates } from '@/lib/mockDataSprint0';

// ============================================
// MOCK DATA VERSION (ACTIVE)
// ============================================

let metricsStore: Metric[] = [...mockMetrics];

/**
 * API Handler for /api/metrics/[id]
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid metric ID' });
  }

  if (req.method === 'GET') {
    return handleGET(id, req, res);
  } else if (req.method === 'PUT') {
    return handlePUT(id, req, res);
  } else if (req.method === 'DELETE') {
    return handleDELETE(id, req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * GET /api/metrics/:id
 * Get single metric by ID
 */
async function handleGET(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const metric = metricsStore.find(m => m.id === id);
  
  if (!metric) {
    return res.status(404).json({ error: 'Metric not found' });
  }
  
  return res.status(200).json({ 
    success: true,
    data: metric 
  });
}

/**
 * PUT /api/metrics/:id
 * Update metric
 */
async function handlePUT(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body = req.body;
    
    const existingIndex = metricsStore.findIndex(m => m.id === id);
    
    if (existingIndex === -1) {
      return res.status(404).json({ error: 'Metric not found' });
    }
    
    // Merge with existing
    const updatedMetric: Metric = {
      ...metricsStore[existingIndex],
      ...body,
      id, // Keep original ID
      updatedAt: new Date().toISOString(),
    };
    
    // Validate
    const validation = validateMetric(updatedMetric);
    if (!validation.valid) {
      return res.status(400).json({ 
        success: false,
        errors: validation.errors 
      });
    }
    
    // Update in store
    metricsStore[existingIndex] = updatedMetric;
    
    return res.status(200).json({ 
      success: true,
      data: updatedMetric 
    });
    
  } catch (error) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid request body' 
    });
  }
}

/**
 * DELETE /api/metrics/:id
 * Delete metric (soft delete if has data)
 */
async function handleDELETE(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const metricIndex = metricsStore.findIndex(m => m.id === id);
  
  if (metricIndex === -1) {
    return res.status(404).json({ error: 'Metric not found' });
  }
  
  // Check if metric has data
  const hasUpdates = mockMetricUpdates.some(u => u.metricId === id);
  
  if (hasUpdates) {
    // Soft delete (mark as inactive)
    metricsStore[metricIndex] = {
      ...metricsStore[metricIndex],
      isActive: false,
      updatedAt: new Date().toISOString(),
    };
    
    return res.status(200).json({ 
      success: true,
      message: 'Metric deactivated (has data)',
      softDelete: true 
    });
  }
  
  // Hard delete (no data)
  metricsStore.splice(metricIndex, 1);
  
  return res.status(200).json({ 
    success: true,
    message: 'Metric deleted',
    softDelete: false 
  });
}

// ============================================
// SUPABASE VERSION (COMMENTED - Uncomment when ready)
// ============================================

/*
async function handleGET_SUPABASE(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('[GET /api/metrics/:id] Error:', error);
    return res.status(404).json({ error: error.message });
  }
  
  return res.status(200).json({ data });
}

async function handlePUT_SUPABASE(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient();
  
  try {
    const body = req.body;
    
    // Validate
    const validation = validateMetric({ ...body, id });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    // Update
    const { data, error } = await supabase
      .from('metrics')
      .update({
        name: body.name,
        description: body.description,
        unit: body.unit,
        tags: body.tags,
        scale_min: body.scaleMin,
        scale_max: body.scaleMax,
        aggregation_method: body.aggregationMethod,
        baseline_method: body.baselineMethod,
        baseline_period_days: body.baselinePeriodDays,
        baseline_manual_value: body.baselineManualValue,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('[PUT /api/metrics/:id] Error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(200).json({ data });
    
  } catch (error) {
    console.error('[PUT /api/metrics/:id] Unexpected error:', error);
    return res.status(400).json({ error: 'Invalid request body' });
  }
}

async function handleDELETE_SUPABASE(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createClient();
  
  // Check if metric has data
  const { count: updatesCount } = await supabase
    .from('metric_updates')
    .select('*', { count: 'exact', head: true })
    .eq('metric_id', id);
  
  if (updatesCount && updatesCount > 0) {
    // Soft delete (mark as inactive)
    const { error } = await supabase
      .from('metrics')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    if (error) {
      console.error('[DELETE /api/metrics/:id] Soft delete error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Metric deactivated (has data)',
      softDelete: true,
      updatesCount 
    });
  }
  
  // Hard delete (no data)
  const { error } = await supabase
    .from('metrics')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('[DELETE /api/metrics/:id] Hard delete error:', error);
    return res.status(500).json({ error: error.message });
  }
  
  return res.status(200).json({ 
    success: true,
    message: 'Metric deleted',
    softDelete: false 
  });
}
*/
