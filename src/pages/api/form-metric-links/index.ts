/**
 * API Route: Form Field Metric Links
 * GET /api/form-metric-links - List links
 * POST /api/form-metric-links - Create link
 * 
 * Pages Router format (compatible with hybrid setup)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Metric } from '@/types/metrics';
import {
  FormFieldMetricLink,
  FormFieldMetricLinkWithDetails,
  CreateFormFieldMetricLinkRequest,
  checkFieldMetricCompatibility,
} from '@/types/metrics';
import {
  getAllLinks,
  createLink,
  linkExists,
} from '@/lib/mockFormMetricLinks';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return handleGET(req, res);
  } else if (req.method === 'POST') {
    return handlePOST(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// ============================================================================
// GET - List Form Field Metric Links
// ============================================================================

async function handleGET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { workspaceId, formId, fieldId, metricId, isActive } = req.query;
    
    // Get filtered links
    const links = getAllLinks({
      workspaceId: workspaceId as string | undefined,
      formId: formId as string | undefined,
      fieldId: fieldId as string | undefined,
      metricId: metricId as string | undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
    
    return res.status(200).json({
      success: true,
      data: links,
      total: links.length,
    });
    
  } catch (error: any) {
    console.error('[API] Error fetching form metric links:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch form metric links',
      message: error.message,
    });
  }
}

// ============================================================================
// POST - Create Form Field Metric Link
// ============================================================================

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body: CreateFormFieldMetricLinkRequest = req.body;
    
    // Validation
    const errors: string[] = [];
    
    if (!body.workspaceId) errors.push('workspaceId is required');
    if (!body.formId) errors.push('formId is required');
    if (!body.fieldId) errors.push('fieldId is required');
    if (!body.metricId) errors.push('metricId is required');
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }
    
    // Check for duplicates
    if (linkExists(body.fieldId, body.metricId)) {
      return res.status(409).json({
        success: false,
        error: 'Link already exists for this field and metric',
      });
    }
    
    // Get metric details (mock - in real app, fetch from DB)
    const { mockMetrics } = await import('@/lib/mockDataSprint0');
    const metric = mockMetrics.find((m: Metric) => m.id === body.metricId);
    
    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found',
      });
    }
    
    // Create link with full details
    const newLink: FormFieldMetricLinkWithDetails = {
      id: `link-${Date.now()}`,
      workspaceId: body.workspaceId,
      formId: body.formId,
      fieldId: body.fieldId,
      metricId: body.metricId,
      mappingType: body.mappingType || 'direct',
      transformConfig: body.transformConfig || null,
      autoCreateOnSubmit: body.autoCreateOnSubmit !== false,
      isActive: body.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metric: metric,
      fieldName: body.fieldName || 'Unknown Field',
      fieldType: body.fieldType || 'text',
    };
    
    createLink(newLink);
    
    return res.status(201).json({
      success: true,
      data: newLink,
    });
    
  } catch (error: any) {
    console.error('[API] Error creating form metric link:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create form metric link',
      message: error.message,
    });
  }
}