/**
 * Decisions API Endpoint - FASE 10 COMPLETE
 * 
 * GET /api/decisions
 * Returns active critical decisions for the current workspace/user.
 * 
 * Query params:
 * - workspaceId: string (required)
 * - athleteId?: string (optional - filter by athlete)
 * - limit?: number (default: 10)
 * - priority?: 'critical' | 'high' | 'medium'
 * - status?: 'pending' | 'applied' | 'dismissed'
 * 
 * Response:
 * {
 *   decisions: Decision[],
 *   total: number,
 *   pending: number,
 *   critical: number
 * }
 * 
 * @author PerformTrack Team
 * @since Fase 10 - Dashboard Insights
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock decisions database (later: replace with Supabase)
const MOCK_DECISIONS = [
  {
    id: 'dec-001',
    workspaceId: 'workspace-demo',
    athleteId: 'athlete-1',
    athleteName: 'João Silva',
    athletePhoto: 'https://i.pravatar.cc/150?img=12',
    ruleId: 'rule-overtraining',
    ruleName: 'Deteção de Overtraining',
    priority: 'critical',
    status: 'pending',
    title: 'Risco de Overtraining Detetado',
    description: 'HRV abaixo do baseline por 3 dias consecutivos combinado com sleep quality < 6',
    recommendation: 'Reduzir intensidade em 40% nos próximos 2 dias. Sessão de recovery recomendada.',
    metrics: [
      { name: 'HRV', current: 42, baseline: 65, unit: 'ms', zone: 'red' },
      { name: 'Sleep Quality', current: 4.2, baseline: 7.5, unit: '/10', zone: 'red' },
      { name: 'Fatigue Score', current: 8.1, baseline: 4.0, unit: '/10', zone: 'red' },
    ],
    suggestedActions: [
      { type: 'reduce_intensity', label: 'Reduzir intensidade 40%', icon: 'TrendingDown' },
      { type: 'schedule_recovery', label: 'Agendar sessão recovery', icon: 'Heart' },
      { type: 'notify_coach', label: 'Notificar treinador', icon: 'Bell' },
    ],
    impact: 'high',
    confidence: 0.89,
    triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dec-002',
    workspaceId: 'workspace-demo',
    athleteId: 'athlete-2',
    athleteName: 'Maria Santos',
    athletePhoto: 'https://i.pravatar.cc/150?img=45',
    ruleId: 'rule-peak-performance',
    ruleName: 'Peak Performance Window',
    priority: 'high',
    status: 'pending',
    title: 'Atleta em Peak Performance',
    description: 'Todos os indicadores em zona ótima - janela ideal para treino de alta intensidade',
    recommendation: 'Aproveitar próximos 2-3 dias para sessões de alta intensidade ou competição.',
    metrics: [
      { name: 'HRV', current: 78, baseline: 65, unit: 'ms', zone: 'green' },
      { name: 'Sleep Quality', current: 9.2, baseline: 7.5, unit: '/10', zone: 'green' },
      { name: 'Readiness', current: 95, baseline: 75, unit: '%', zone: 'green' },
    ],
    suggestedActions: [
      { type: 'schedule_high_intensity', label: 'Agendar treino intenso', icon: 'Zap' },
      { type: 'log_performance', label: 'Registar pico de forma', icon: 'Trophy' },
    ],
    impact: 'medium',
    confidence: 0.92,
    triggeredAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dec-003',
    workspaceId: 'workspace-demo',
    athleteId: 'athlete-3',
    athleteName: 'Pedro Costa',
    athletePhoto: 'https://i.pravatar.cc/150?img=33',
    ruleId: 'rule-injury-risk',
    ruleName: 'Injury Risk Detection',
    priority: 'critical',
    status: 'pending',
    title: 'Risco Elevado de Lesão',
    description: 'Fadiga muscular elevada + assimetria de força detetada',
    recommendation: 'Avaliação médica recomendada. Pausar exercícios unilaterais até normalização.',
    metrics: [
      { name: 'Muscle Fatigue', current: 8.5, baseline: 4.0, unit: '/10', zone: 'red' },
      { name: 'Strength Asymmetry', current: 18, baseline: 5, unit: '%', zone: 'red' },
      { name: 'ROM', current: 72, baseline: 95, unit: '%', zone: 'yellow' },
    ],
    suggestedActions: [
      { type: 'medical_assessment', label: 'Avaliação médica', icon: 'Stethoscope' },
      { type: 'pause_training', label: 'Pausar treino unilateral', icon: 'Pause' },
      { type: 'schedule_physio', label: 'Agendar fisioterapia', icon: 'Activity' },
    ],
    impact: 'high',
    confidence: 0.85,
    triggeredAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1h ago
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dec-004',
    workspaceId: 'workspace-demo',
    athleteId: 'athlete-1',
    athleteName: 'João Silva',
    athletePhoto: 'https://i.pravatar.cc/150?img=12',
    ruleId: 'rule-recovery',
    ruleName: 'Recovery Optimization',
    priority: 'medium',
    status: 'pending',
    title: 'Recovery Subótima',
    description: 'Sleep quality e nutrition score abaixo do ideal',
    recommendation: 'Focar em qualidade de sono e nutrição nos próximos dias.',
    metrics: [
      { name: 'Sleep Quality', current: 5.8, baseline: 7.5, unit: '/10', zone: 'yellow' },
      { name: 'Nutrition Score', current: 6.2, baseline: 8.0, unit: '/10', zone: 'yellow' },
    ],
    suggestedActions: [
      { type: 'improve_sleep', label: 'Protocolo de sono', icon: 'Moon' },
      { type: 'nutrition_plan', label: 'Ajustar nutrição', icon: 'Apple' },
    ],
    impact: 'low',
    confidence: 0.78,
    triggeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12h ago
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'dec-005',
    workspaceId: 'workspace-demo',
    athleteId: 'athlete-4',
    athleteName: 'Ana Rodrigues',
    athletePhoto: 'https://i.pravatar.cc/150?img=48',
    ruleId: 'rule-progress',
    ruleName: 'Progress Tracking',
    priority: 'high',
    status: 'pending',
    title: 'Progresso Excepcional',
    description: 'Melhoria consistente em todas as métricas-chave nas últimas 2 semanas',
    recommendation: 'Manter protocolo atual. Considerar aumentar carga gradualmente.',
    metrics: [
      { name: 'VO2 Max', current: 58, baseline: 52, unit: 'ml/kg/min', zone: 'green' },
      { name: 'Strength Index', current: 142, baseline: 120, unit: 'points', zone: 'green' },
      { name: 'Endurance Score', current: 88, baseline: 75, unit: '%', zone: 'green' },
    ],
    suggestedActions: [
      { type: 'increase_load', label: 'Aumentar carga 10%', icon: 'TrendingUp' },
      { type: 'set_new_goals', label: 'Definir novos objetivos', icon: 'Target' },
    ],
    impact: 'medium',
    confidence: 0.91,
    triggeredAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query params
    const workspaceId = searchParams.get('workspaceId');
    const athleteId = searchParams.get('athleteId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const priority = searchParams.get('priority') as 'critical' | 'high' | 'medium' | null;
    const status = searchParams.get('status') as 'pending' | 'applied' | 'dismissed' | null;

    // Validate required params
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId is required' },
        { status: 400 }
      );
    }

    // Filter decisions
    let filteredDecisions = MOCK_DECISIONS.filter(d => d.workspaceId === workspaceId);

    if (athleteId) {
      filteredDecisions = filteredDecisions.filter(d => d.athleteId === athleteId);
    }

    if (priority) {
      filteredDecisions = filteredDecisions.filter(d => d.priority === priority);
    }

    if (status) {
      filteredDecisions = filteredDecisions.filter(d => d.status === status);
    }

    // Sort by priority (critical > high > medium) and then by triggeredAt (newest first)
    const priorityOrder = { critical: 3, high: 2, medium: 1 };
    filteredDecisions.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime();
    });

    // Limit results
    const limitedDecisions = filteredDecisions.slice(0, limit);

    // Calculate stats
    const total = filteredDecisions.length;
    const pending = filteredDecisions.filter(d => d.status === 'pending').length;
    const critical = filteredDecisions.filter(d => d.priority === 'critical').length;

    return NextResponse.json({
      decisions: limitedDecisions,
      total,
      pending,
      critical,
    });

  } catch (error) {
    console.error('Error fetching decisions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/decisions/:id/apply
// Apply a decision (change status to 'applied')
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { decisionId, action } = body;

    if (!decisionId) {
      return NextResponse.json(
        { error: 'decisionId is required' },
        { status: 400 }
      );
    }

    // MOCK: In real app, update Supabase
    const decision = MOCK_DECISIONS.find(d => d.id === decisionId);
    
    if (!decision) {
      return NextResponse.json(
        { error: 'Decision not found' },
        { status: 404 }
      );
    }

    // Update status (in-memory for demo)
    decision.status = 'applied';

    return NextResponse.json({
      success: true,
      decision,
      message: `Decision applied: ${action}`,
    });

  } catch (error) {
    console.error('Error applying decision:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/decisions/:id
// Dismiss a decision
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const decisionId = searchParams.get('id');

    if (!decisionId) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    // MOCK: In real app, update Supabase
    const decision = MOCK_DECISIONS.find(d => d.id === decisionId);
    
    if (!decision) {
      return NextResponse.json(
        { error: 'Decision not found' },
        { status: 404 }
      );
    }

    // Update status (in-memory for demo)
    decision.status = 'dismissed';

    return NextResponse.json({
      success: true,
      message: 'Decision dismissed',
    });

  } catch (error) {
    console.error('Error dismissing decision:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
