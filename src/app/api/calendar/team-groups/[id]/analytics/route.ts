/**
 * TEAM ANALYTICS API
 * Endpoint for team group analytics
 */

import { NextRequest, NextResponse } from 'next/server';

// GET /api/calendar/team-groups/[id]/analytics - Get team analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'start_date and end_date are required' },
        { status: 400 }
      );
    }
    
    // TODO: Replace with actual Supabase query from team_analytics view
    const mockAnalytics = {
      team_group_id: id,
      date_range: {
        start: startDate,
        end: endDate,
      },
      total_events: 24,
      completed_events: 20,
      cancelled_events: 2,
      total_participants: 96,
      unique_athletes: 4,
      avg_attendance_rate: 87.5,
      total_hours: 36,
      avg_hours_per_athlete: 9,
      by_event_type: {
        training: {
          count: 18,
          hours: 27,
        },
        competition: {
          count: 4,
          hours: 6,
        },
        recovery: {
          count: 2,
          hours: 3,
        },
      },
      trend_participation: 'increasing' as const,
      trend_completion: 'stable' as const,
    };
    
    return NextResponse.json({ analytics: mockAnalytics });
  } catch (error) {
    console.error('Error fetching team analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
