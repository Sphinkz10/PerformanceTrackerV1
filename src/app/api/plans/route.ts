import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/plans - Fetch training plans (MOCKADO)
 * 
 * Query params:
 * - workspaceId (required)
 * - category (optional)
 * 
 * TODO: Integrar com banco real quando Plans estiverem implementados
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const category = searchParams.get('category');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }

    // Mock plans - TODO: Replace with real database
    const allPlans = [
      {
        id: 'plan_001',
        name: 'Força 4 Semanas',
        description: 'Programa de hipertrofia e força muscular',
        workouts: 16,
        weeks: 4,
        sessionsPerWeek: 4,
        category: 'strength',
        difficulty: 'intermediate',
        workspaceId,
        createdAt: '2026-01-01T10:00:00Z',
        author: 'Coach João',
      },
      {
        id: 'plan_002',
        name: 'Condicionamento Base',
        description: 'Base aeróbia e capacidade cardiovascular',
        workouts: 60,
        weeks: 12,
        sessionsPerWeek: 5,
        category: 'endurance',
        difficulty: 'beginner',
        workspaceId,
        createdAt: '2026-01-05T14:30:00Z',
        author: 'Coach Maria',
      },
      {
        id: 'plan_003',
        name: 'Pre-Season 6 Semanas',
        description: 'Preparação física completa para temporada',
        workouts: 36,
        weeks: 6,
        sessionsPerWeek: 6,
        category: 'hybrid',
        difficulty: 'advanced',
        workspaceId,
        createdAt: '2026-01-08T09:00:00Z',
        author: 'Coach Pedro',
      },
      {
        id: 'plan_004',
        name: 'Speed & Power 8 Semanas',
        description: 'Velocidade explosiva e potência',
        workouts: 32,
        weeks: 8,
        sessionsPerWeek: 4,
        category: 'speed',
        difficulty: 'intermediate',
        workspaceId,
        createdAt: '2026-01-10T11:00:00Z',
        author: 'Coach João',
      },
      {
        id: 'plan_005',
        name: 'Recovery & Mobility',
        description: 'Recuperação ativa e mobilidade funcional',
        workouts: 12,
        weeks: 4,
        sessionsPerWeek: 3,
        category: 'recovery',
        difficulty: 'beginner',
        workspaceId,
        createdAt: '2026-01-12T16:00:00Z',
        author: 'Coach Ana',
      },
    ];

    // Filter by category if provided
    const filteredPlans = category
      ? allPlans.filter(plan => plan.category === category)
      : allPlans;

    return NextResponse.json({
      plans: filteredPlans,
      count: filteredPlans.length,
      total: allPlans.length,
    });
  } catch (error: any) {
    console.error('GET /api/plans error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
