/**
 * FASE 3: Metric Updates API - POST (Single Entry) & GET (List)
 * 
 * VERSION 1 (ACTIVE): Works with mock data
 * VERSION 2 (COMMENTED): Ready for Supabase (uncomment when connecting DB)
 * 
 * Pages Router format (compatible with hybrid setup)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
// import { createClient } from '@/lib/supabase/server'; // UNCOMMENT when connecting Supabase
import type { MetricUpdate } from '@/types/metrics';

// ============================================
// MOCK DATA VERSION (ACTIVE)
// ============================================

// In-memory store for metric updates (mock)
let metricUpdatesStore: MetricUpdate[] = [];
let idCounter = 1;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return handlePOST(req, res);
  } else if (req.method === 'GET') {
    return handleGET(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * POST /api/metric-updates
 * Create a single metric update
 */
async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      metricId,
      athleteId,
      value,
      timestamp,
      notes,
      sourceType = 'manual_entry',
      sourceId,
    } = req.body;

    // Validation
    if (!metricId || !athleteId || value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: metricId, athleteId, value'
      });
    }

    // Mock: Get metric to validate type
    const mockMetric = {
      id: metricId,
      type: 'numeric' as const,
      scaleMin: 0,
      scaleMax: 100,
      category: 'recovery' as const,
    };

    // Type-specific validation
    let validatedValue: number | boolean | string = value;

    if (mockMetric.type === 'numeric' || mockMetric.type === 'scale') {
      const numValue = typeof value === 'number' ? value : parseFloat(value);
      
      if (isNaN(numValue)) {
        return res.status(400).json({
          success: false,
          error: 'Value must be a number for numeric/scale metrics'
        });
      }

      // Check scale range
      if (mockMetric.scaleMin !== undefined && numValue < mockMetric.scaleMin) {
        return res.status(400).json({
          success: false,
          error: `Value below minimum (${mockMetric.scaleMin})`
        });
      }

      if (mockMetric.scaleMax !== undefined && numValue > mockMetric.scaleMax) {
        return res.status(400).json({
          success: false,
          error: `Value above maximum (${mockMetric.scaleMax})`
        });
      }

      validatedValue = numValue;
    } else if (mockMetric.type === 'boolean') {
      validatedValue = Boolean(value);
    }

    // Mock: Calculate baseline and zone
    const mockBaseline = mockMetric.type === 'numeric' || mockMetric.type === 'scale'
      ? (mockMetric.scaleMin + mockMetric.scaleMax) / 2
      : null;

    let zone: 'green' | 'yellow' | 'red' | null = null;
    let zoneReason: string | undefined;

    if (mockBaseline !== null && typeof validatedValue === 'number') {
      const difference = ((validatedValue - mockBaseline) / mockBaseline) * 100;
      
      if (Math.abs(difference) <= 10) {
        zone = 'green';
        zoneReason = 'Within 10% of baseline';
      } else if (Math.abs(difference) <= 20) {
        zone = 'yellow';
        zoneReason = `${difference > 0 ? '+' : ''}${difference.toFixed(1)}% vs baseline`;
      } else {
        zone = 'red';
        zoneReason = `${difference > 0 ? '+' : ''}${difference.toFixed(1)}% vs baseline (significant deviation)`;
      }
    }

    // Create metric update
    const newUpdate: MetricUpdate = {
      id: `update-${idCounter++}`,
      metricId,
      athleteId,
      value: validatedValue,
      timestamp: timestamp || new Date().toISOString(),
      sourceType,
      sourceId,
      notes,
      zone,
      createdAt: new Date().toISOString(),
      createdBy: 'mock-user-1', // In real version, get from auth
    };

    metricUpdatesStore.push(newUpdate);

    // Return success with calculated info
    return res.status(201).json({
      success: true,
      update: newUpdate,
      analysis: {
        baseline: mockBaseline,
        zone,
        zoneReason,
        previousValue: mockBaseline, // Mock - would query last update
        trend: validatedValue > (mockBaseline || 0) ? 'increasing' : 'decreasing',
      },
    });

  } catch (error) {
    console.error('Error creating metric update:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create metric update'
    });
  }
}

/**
 * GET /api/metric-updates
 * List metric updates with filters
 */
async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      metricId,
      athleteId,
      startDate,
      endDate,
      limit = '100'
    } = req.query;

    const limitNum = parseInt(limit as string);

    let filteredUpdates = [...metricUpdatesStore];

    // Apply filters
    if (metricId && typeof metricId === 'string') {
      filteredUpdates = filteredUpdates.filter(u => u.metricId === metricId);
    }

    if (athleteId && typeof athleteId === 'string') {
      filteredUpdates = filteredUpdates.filter(u => u.athleteId === athleteId);
    }

    if (startDate && typeof startDate === 'string') {
      filteredUpdates = filteredUpdates.filter(u => u.timestamp >= startDate);
    }

    if (endDate && typeof endDate === 'string') {
      filteredUpdates = filteredUpdates.filter(u => u.timestamp <= endDate);
    }

    // Sort by timestamp descending
    filteredUpdates.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit
    filteredUpdates = filteredUpdates.slice(0, limitNum);

    return res.status(200).json({
      success: true,
      updates: filteredUpdates,
      total: filteredUpdates.length,
    });

  } catch (error) {
    console.error('Error fetching metric updates:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch metric updates'
    });
  }
}
