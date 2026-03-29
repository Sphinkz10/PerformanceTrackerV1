/**
 * API Route: Form Field Metric Links (by ID)
 * GET /api/form-metric-links/[id] - Get single link
 * PUT /api/form-metric-links/[id] - Update link
 * DELETE /api/form-metric-links/[id] - Delete link
 * 
 * Pages Router format (compatible with hybrid setup)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  UpdateFormFieldMetricLinkRequest,
} from '@/types/metrics';
import {
  getLinkById,
  updateLink,
  deleteLink,
} from '@/lib/mockFormMetricLinks';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid link ID' });
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

// ============================================================================
// GET - Get Single Link
// ============================================================================

async function handleGET(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const link = getLinkById(id);
    
    if (!link) {
      return res.status(404).json({
        success: false,
        error: 'Form metric link not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: link,
    });
    
  } catch (error: any) {
    console.error('[API] Error fetching form metric link:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch form metric link',
      message: error.message,
    });
  }
}

// ============================================================================
// PUT - Update Link
// ============================================================================

async function handlePUT(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body: UpdateFormFieldMetricLinkRequest = req.body;
    
    const updatedLink = updateLink(id, body);
    
    if (!updatedLink) {
      return res.status(404).json({
        success: false,
        error: 'Form metric link not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedLink,
    });
    
  } catch (error: any) {
    console.error('[API] Error updating form metric link:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update form metric link',
      message: error.message,
    });
  }
}

// ============================================================================
// DELETE - Delete Link
// ============================================================================

async function handleDELETE(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const deletedLink = deleteLink(id);
    
    if (!deletedLink) {
      return res.status(404).json({
        success: false,
        error: 'Form metric link not found',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: deletedLink,
      message: 'Form metric link deleted successfully',
    });
    
  } catch (error: any) {
    console.error('[API] Error deleting form metric link:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete form metric link',
      message: error.message,
    });
  }
}
