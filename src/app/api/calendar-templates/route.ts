/**
 * Calendar Templates API
 * 
 * GET /api/calendar-templates
 * Query params:
 * - workspaceId (required)
 * - category (optional)
 * - favoritesOnly (optional)
 * 
 * POST /api/calendar-templates
 * Body: { workspaceId, name, description, category, defaults, ... }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET - List templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const category = searchParams.get('category');
    const favoritesOnly = searchParams.get('favoritesOnly') === 'true';
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    let query = supabase
      .from('calendar_templates')
      .select('*')
      .eq('workspace_id', workspaceId);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (favoritesOnly) {
      query = query.eq('is_favorite', true);
    }
    
    const { data: templates, error } = await query
      .order('usage_count', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({ templates: templates || [] });
    
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST - Create template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: template, error } = await supabase
      .from('calendar_templates')
      .insert({
        ...body,
        created_by: user?.id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, template });
    
  } catch (error: any) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create template' },
      { status: 500 }
    );
  }
}
