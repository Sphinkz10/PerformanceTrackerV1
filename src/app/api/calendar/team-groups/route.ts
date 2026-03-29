/**
 * TEAM GROUPS API
 * Endpoints for managing team groups
 */

import { NextRequest, NextResponse } from 'next/server';

// GET /api/calendar/team-groups - List all team groups
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspace_id');
    
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspace_id is required' },
        { status: 400 }
      );
    }
    
    // TODO: Replace with actual Supabase query
    // For now, return mock data
    const mockGroups = [
      {
        id: 'team-group-1',
        workspace_id: workspaceId,
        name: 'Equipa Sub-21',
        description: 'Atletas da categoria Sub-21',
        color: '#10b981',
        athlete_ids: ['athlete-1', 'athlete-2', 'athlete-3', 'athlete-4'],
        coach_ids: ['coach-1'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'user-1',
        meta: {
          category: 'U21',
          sport: 'Football',
        },
      },
      {
        id: 'team-group-2',
        workspace_id: workspaceId,
        name: 'Elite Squad',
        description: 'Atletas de elite',
        color: '#8b5cf6',
        athlete_ids: ['athlete-5', 'athlete-6', 'athlete-7'],
        coach_ids: ['coach-1', 'coach-2'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'user-1',
        meta: {
          category: 'Elite',
        },
      },
    ];
    
    return NextResponse.json({
      groups: mockGroups,
      total: mockGroups.length,
    });
  } catch (error) {
    console.error('Error fetching team groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team groups' },
      { status: 500 }
    );
  }
}

// POST /api/calendar/team-groups - Create new team group
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      workspace_id,
      name,
      description,
      color,
      athlete_ids,
      coach_ids,
      meta,
    } = body;
    
    if (!workspace_id || !name) {
      return NextResponse.json(
        { error: 'workspace_id and name are required' },
        { status: 400 }
      );
    }
    
    // TODO: Replace with actual Supabase insert
    const newGroup = {
      id: `team-group-${Date.now()}`,
      workspace_id,
      name,
      description: description || '',
      color: color || '#0ea5e9',
      athlete_ids: athlete_ids || [],
      coach_ids: coach_ids || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'user-1', // TODO: Get from auth
      meta: meta || {},
    };
    
    return NextResponse.json({
      group: newGroup,
      message: 'Team group created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating team group:', error);
    return NextResponse.json(
      { error: 'Failed to create team group' },
      { status: 500 }
    );
  }
}
