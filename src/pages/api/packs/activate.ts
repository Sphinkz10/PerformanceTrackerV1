// ============================================
// API: POST /api/packs/activate
// ============================================
// Activates a metric pack by creating all its metrics
// Pages Router version (compatible with hybrid setup)

import type { NextApiRequest, NextApiResponse } from 'next';
import type { PackActivationResponse } from '@/types/packs';

// ============================================
// PACK METRIC DEFINITIONS (shortened for brevity)
// ============================================

const PACK_METRICS_COUNT: Record<string, number> = {
  'pack-recovery': 5,
  'pack-load': 7,
  'pack-readiness': 6,
  'pack-psychological': 7,
  'pack-injury': 6,
};

// ============================================
// API HANDLER
// ============================================

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { packId, workspaceId, createForm, createReport } = req.body;

    // Validate input
    if (!packId || !workspaceId) {
      return res.status(400).json({
        error: 'Missing required fields: packId, workspaceId'
      });
    }

    // Get pack metrics count
    const metricsCount = PACK_METRICS_COUNT[packId];
    if (!metricsCount) {
      return res.status(404).json({
        error: `Pack not found: ${packId}`
      });
    }

    // MOCK: Simulate creating metrics
    const createdMetrics: string[] = [];
    const timestamp = Date.now();

    for (let i = 0; i < metricsCount; i++) {
      const metricId = `metric-${packId}-${i}-${timestamp}`;
      createdMetrics.push(metricId);
      console.log('Creating metric:', metricId);
    }

    // MOCK: Simulate creating form
    let formId: string | undefined;
    if (createForm) {
      formId = `form-${packId}-${timestamp}`;
      console.log('Creating suggested form:', formId);
    }

    // MOCK: Simulate creating report
    let reportId: string | undefined;
    if (createReport) {
      reportId = `report-${packId}-${timestamp}`;
      console.log('Creating suggested report:', reportId);
    }

    // Build response
    const response: PackActivationResponse = {
      success: true,
      packId,
      metricsCreated: metricsCount,
      metricIds: createdMetrics,
      formCreated: !!formId,
      formId,
      reportCreated: !!reportId,
      reportId,
    };

    return res.status(201).json(response);

  } catch (error) {
    console.error('Error activating pack:', error);
    return res.status(500).json({
      error: 'Failed to activate pack'
    });
  }
}
