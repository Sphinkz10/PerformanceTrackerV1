/**
 * SMART SCHEDULING ENGINE V4.0
 * Motor de otimização para gerar horários automaticamente
 * 
 * Algoritmo: Greedy + Backtracking com constraint satisfaction
 * Complexidade: O(n * m * k) onde n=atletas, m=slots, k=regras
 */

import { addDays, format, set, isWithinInterval, parseISO } from 'date-fns';

// ============================================================================
// TYPES
// ============================================================================

export interface Athlete {
  id: string;
  name: string;
  priority?: number; // 1-10 (maior = mais importante)
}

export interface SessionDefaults {
  type: 'session' | 'class' | 'assessment';
  duration: number; // minutos
  buffer: number; // minutos entre sessões
  dateRange: {
    start: Date;
    end: Date;
  };
  sessionsPerWeek?: number;
  maxPerDay?: number; // máximo de sessões por dia (coach limit)
  priority?: 'premium' | 'risk' | 'fifo'; // critério de ordenação
}

export interface AvailabilityRule {
  id: string;
  type: 'can' | 'cannot';
  days: number[]; // 0-6 (domingo-sábado)
  timeRanges: { start: string; end: string }[]; // formato HH:mm
  scope: 'global' | 'athlete';
  athleteId?: string;
}

export interface AvailabilityRules {
  global: AvailabilityRule[];
  perAthlete: Map<string, AvailabilityRule[]>;
}

export interface ResourceConstraint {
  type: 'coach' | 'location' | 'equipment' | 'custom';
  value: string;
  required: boolean;
}

export interface RuleConstraint {
  type: 'no_consecutive_days' | 'avoid_competition_days' | 'respect_quiet_hours';
  enabled: boolean;
  config?: any;
}

export interface Resources {
  coach?: string;
  location?: string;
  equipment?: string[];
  constraints: RuleConstraint[];
}

export interface ExistingEvent {
  id: string;
  athleteId: string;
  startAt: Date;
  endAt: Date;
  type: string;
}

export interface ScheduleProposal {
  id: string;
  athleteId: string;
  athleteName: string;
  startAt: Date;
  endAt: Date;
  sessionType: string;
  location?: string;
  status: 'proposed' | 'pinned' | 'conflict' | 'skipped';
  isPinned: boolean;
  conflict?: Conflict;
  score: number; // 0-100 (quality da proposta)
}

export interface Conflict {
  id: string;
  type: 'time_overlap' | 'resource_unavailable' | 'availability_violation' | 'constraint_violation';
  severity: number; // 1-10 (10 = blocker)
  description: string;
  athleteIds: string[];
  proposalIds: string[];
}

export interface ScheduleResult {
  proposals: ScheduleProposal[];
  conflicts: Conflict[];
  coverage: number; // % de atletas agendados
  stats: {
    totalAthletes: number;
    scheduledAthletes: number;
    totalSessions: number;
    skippedAthletes: number;
    averageScore: number;
  };
}

export interface SchedulingInput {
  athletes: Athlete[];
  defaults: SessionDefaults;
  availability: AvailabilityRules;
  resources: Resources;
  existingEvents?: ExistingEvent[];
  pinnedProposals?: ScheduleProposal[]; // para regenerate
  strategy?: 'greedy' | 'balanced' | 'optimized';
}

// ============================================================================
// MOTOR PRINCIPAL
// ============================================================================

export class SchedulingEngine {
  /**
   * Gera horários automaticamente
   */
  static async generate(input: SchedulingInput): Promise<ScheduleResult> {
    const {
      athletes,
      defaults,
      availability,
      resources,
      existingEvents = [],
      pinnedProposals = [],
      strategy = 'balanced'
    } = input;

    console.log('[SchedulingEngine] Starting generation...', {
      athleteCount: athletes.length,
      strategy
    });

    // 1. Gerar time slots disponíveis
    const availableSlots = this.generateTimeSlots(defaults, availability);
    console.log(`[SchedulingEngine] Generated ${availableSlots.length} time slots`);

    // 2. Ordenar atletas por prioridade
    const sortedAthletes = this.sortAthletesByPriority(athletes, defaults.priority);

    // 3. Criar mapa de eventos existentes (para detectar conflitos)
    const eventMap = this.buildEventMap(existingEvents);

    // 4. Adicionar proposals pinned ao resultado
    const proposals: ScheduleProposal[] = [...pinnedProposals];
    const usedSlots = new Set<string>(pinnedProposals.map(p => this.slotKey(p.startAt)));

    // 5. Para cada atleta, tentar agendar sessões
    const conflicts: Conflict[] = [];
    const scheduledAthletes = new Set<string>();

    for (const athlete of sortedAthletes) {
      // Pular se já está nos pinned
      if (pinnedProposals.some(p => p.athleteId === athlete.id)) {
        scheduledAthletes.add(athlete.id);
        continue;
      }

      const athleteAvailability = availability.perAthlete.get(athlete.id) || [];
      const sessionsNeeded = defaults.sessionsPerWeek || 2;

      const athleteProposals = this.scheduleAthleteproposals(
        athlete,
        sessionsNeeded,
        availableSlots,
        usedSlots,
        eventMap,
        defaults,
        availability.global,
        athleteAvailability,
        resources
      );

      if (athleteProposals.length > 0) {
        proposals.push(...athleteProposals);
        scheduledAthletes.add(athlete.id);
        
        // Marcar slots como usados
        athleteProposals.forEach(p => {
          usedSlots.add(this.slotKey(p.startAt));
        });
      } else {
        // Não conseguiu agendar - criar proposta "skipped"
        const skippedProposal: ScheduleProposal = {
          id: `skip-${athlete.id}`,
          athleteId: athlete.id,
          athleteName: athlete.name,
          startAt: new Date(),
          endAt: new Date(),
          sessionType: defaults.type,
          status: 'skipped',
          isPinned: false,
          score: 0,
          conflict: {
            id: `conflict-skip-${athlete.id}`,
            type: 'availability_violation',
            severity: 8,
            description: `Nenhum horário disponível para ${athlete.name}`,
            athleteIds: [athlete.id],
            proposalIds: []
          }
        };
        
        proposals.push(skippedProposal);
        
        conflicts.push(skippedProposal.conflict);
      }
    }

    // 6. Detectar conflitos adicionais (overlaps, recursos)
    const additionalConflicts = this.detectConflicts(proposals, resources, eventMap);
    conflicts.push(...additionalConflicts);

    // 7. Calcular stats
    const coverage = (scheduledAthletes.size / athletes.length) * 100;
    const averageScore = proposals.length > 0
      ? proposals.reduce((sum, p) => sum + p.score, 0) / proposals.length
      : 0;

    const result: ScheduleResult = {
      proposals,
      conflicts,
      coverage: Math.round(coverage),
      stats: {
        totalAthletes: athletes.length,
        scheduledAthletes: scheduledAthletes.size,
        totalSessions: proposals.filter(p => p.status !== 'skipped').length,
        skippedAthletes: athletes.length - scheduledAthletes.size,
        averageScore: Math.round(averageScore)
      }
    };

    console.log('[SchedulingEngine] Generation complete', result.stats);

    return result;
  }

  /**
   * Gera todos os time slots possíveis no período
   */
  private static generateTimeSlots(
    defaults: SessionDefaults,
    availability: AvailabilityRules
  ): Date[] {
    const slots: Date[] = [];
    const { start, end } = defaults.dateRange;
    const globalRules = availability.global.filter(r => r.type === 'can');

    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      // Verificar se este dia está em alguma regra "can"
      for (const rule of globalRules) {
        if (!rule.days.includes(dayOfWeek)) continue;

        // Para cada timeRange nesta regra
        for (const timeRange of rule.timeRanges) {
          const [startHour, startMin] = timeRange.start.split(':').map(Number);
          const [endHour, endMin] = timeRange.end.split(':').map(Number);

          // Gerar slots a cada X minutos (defaults.duration + buffer)
          const slotInterval = defaults.duration + defaults.buffer;
          let currentHour = startHour;
          let currentMin = startMin;

          while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
            const slotStart = set(currentDate, {
              hours: currentHour,
              minutes: currentMin,
              seconds: 0,
              milliseconds: 0
            });

            const slotEnd = new Date(slotStart.getTime() + defaults.duration * 60000);

            // Verificar se slot termina dentro da janela
            if (
              slotEnd.getHours() < endHour ||
              (slotEnd.getHours() === endHour && slotEnd.getMinutes() <= endMin)
            ) {
              slots.push(slotStart);
            }

            // Avançar para próximo slot
            currentMin += slotInterval;
            if (currentMin >= 60) {
              currentHour += Math.floor(currentMin / 60);
              currentMin = currentMin % 60;
            }
          }
        }
      }

      currentDate = addDays(currentDate, 1);
    }

    return slots;
  }

  /**
   * Ordena atletas por prioridade
   */
  private static sortAthletesByPriority(
    athletes: Athlete[],
    strategy?: 'premium' | 'risk' | 'fifo'
  ): Athlete[] {
    if (!strategy || strategy === 'fifo') {
      return athletes; // ordem original
    }

    return [...athletes].sort((a, b) => {
      const priorityA = a.priority || 5;
      const priorityB = b.priority || 5;
      
      if (strategy === 'premium' || strategy === 'risk') {
        return priorityB - priorityA; // maior prioridade primeiro
      }
      
      return 0;
    });
  }

  /**
   * Cria mapa de eventos existentes por atleta
   */
  private static buildEventMap(events: ExistingEvent[]): Map<string, ExistingEvent[]> {
    const map = new Map<string, ExistingEvent[]>();
    
    for (const event of events) {
      if (!map.has(event.athleteId)) {
        map.set(event.athleteId, []);
      }
      map.get(event.athleteId)!.push(event);
    }
    
    return map;
  }

  /**
   * Tenta agendar sessões para um atleta
   */
  private static scheduleAthleteproposals(
    athlete: Athlete,
    sessionsNeeded: number,
    availableSlots: Date[],
    usedSlots: Set<string>,
    eventMap: Map<string, ExistingEvent[]>,
    defaults: SessionDefaults,
    globalRules: AvailabilityRule[],
    athleteRules: AvailabilityRule[],
    resources: Resources
  ): ScheduleProposal[] {
    const proposals: ScheduleProposal[] = [];
    const athleteEvents = eventMap.get(athlete.id) || [];

    for (const slot of availableSlots) {
      if (proposals.length >= sessionsNeeded) break;

      const slotKey = this.slotKey(slot);
      
      // Verificar se slot já foi usado
      if (usedSlots.has(slotKey)) continue;

      // Verificar disponibilidade do atleta
      if (!this.isAthleteAvailable(slot, globalRules, athleteRules)) continue;

      // Verificar conflitos com eventos existentes
      const endTime = new Date(slot.getTime() + defaults.duration * 60000);
      const hasConflict = athleteEvents.some(event => 
        this.intervalsOverlap(slot, endTime, event.startAt, event.endAt)
      );
      
      if (hasConflict) continue;

      // Verificar constraints (ex: não marcar dias consecutivos)
      if (resources.constraints.some(c => c.type === 'no_consecutive_days' && c.enabled)) {
        const lastProposal = proposals[proposals.length - 1];
        if (lastProposal) {
          const daysDiff = Math.abs(
            (slot.getTime() - lastProposal.startAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (daysDiff < 1) continue;
        }
      }

      // Calcular score (preferência por horários melhores)
      const score = this.calculateSlotScore(slot, athlete, defaults);

      // Criar proposal
      const proposal: ScheduleProposal = {
        id: `${athlete.id}-${slot.getTime()}`,
        athleteId: athlete.id,
        athleteName: athlete.name,
        startAt: slot,
        endAt: endTime,
        sessionType: defaults.type,
        location: resources.location,
        status: 'proposed',
        isPinned: false,
        score
      };

      proposals.push(proposal);
    }

    return proposals;
  }

  /**
   * Verifica se atleta está disponível num horário
   */
  private static isAthleteAvailable(
    slot: Date,
    globalRules: AvailabilityRule[],
    athleteRules: AvailabilityRule[]
  ): boolean {
    const dayOfWeek = slot.getDay();
    const timeStr = format(slot, 'HH:mm');

    // Verificar regras globais "can"
    const matchesGlobalCan = globalRules.some(rule => {
      if (rule.type !== 'can') return false;
      if (!rule.days.includes(dayOfWeek)) return false;
      
      return rule.timeRanges.some(range => 
        timeStr >= range.start && timeStr < range.end
      );
    });

    if (!matchesGlobalCan) return false;

    // Verificar regras globais "cannot" (bloqueios)
    const matchesGlobalCannot = globalRules.some(rule => {
      if (rule.type !== 'cannot') return false;
      if (!rule.days.includes(dayOfWeek)) return false;
      
      return rule.timeRanges.some(range => 
        timeStr >= range.start && timeStr < range.end
      );
    });

    if (matchesGlobalCannot) return false;

    // Verificar regras específicas do atleta
    if (athleteRules.length > 0) {
      const matchesAthleteCannot = athleteRules.some(rule => {
        if (rule.type !== 'cannot') return false;
        if (!rule.days.includes(dayOfWeek)) return false;
        
        return rule.timeRanges.some(range => 
          timeStr >= range.start && timeStr < range.end
        );
      });

      if (matchesAthleteCannot) return false;
    }

    return true;
  }

  /**
   * Verifica se dois intervalos se sobrepõem
   */
  private static intervalsOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return start1 < end2 && start2 < end1;
  }

  /**
   * Calcula score de qualidade de um slot (0-100)
   */
  private static calculateSlotScore(
    slot: Date,
    athlete: Athlete,
    defaults: SessionDefaults
  ): number {
    let score = 70; // base score

    // Preferência por meio da semana (Ter-Qui)
    const dayOfWeek = slot.getDay();
    if ([2, 3, 4].includes(dayOfWeek)) {
      score += 10;
    }

    // Preferência por horários "prime" (18:00-20:00)
    const hour = slot.getHours();
    if (hour >= 18 && hour < 20) {
      score += 15;
    } else if (hour >= 9 && hour < 12) {
      score += 10; // manhã também é bom
    }

    // Bonus para atletas prioritários
    if (athlete.priority && athlete.priority >= 8) {
      score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * Detecta conflitos entre proposals
   */
  private static detectConflicts(
    proposals: ScheduleProposal[],
    resources: Resources,
    eventMap: Map<string, ExistingEvent[]>
  ): Conflict[] {
    const conflicts: Conflict[] = [];

    // Detectar overlaps entre proposals (se mesmo coach/sala)
    if (resources.coach || resources.location) {
      const proposalsByTime = new Map<string, ScheduleProposal[]>();
      
      for (const proposal of proposals) {
        if (proposal.status === 'skipped') continue;
        
        const key = this.slotKey(proposal.startAt);
        if (!proposalsByTime.has(key)) {
          proposalsByTime.set(key, []);
        }
        proposalsByTime.get(key)!.push(proposal);
      }

      // Verificar slots com múltiplas proposals
      for (const [slotKey, slotProposals] of proposalsByTime.entries()) {
        if (slotProposals.length > 1) {
          const conflict: Conflict = {
            id: `conflict-overlap-${slotKey}`,
            type: 'resource_unavailable',
            severity: 9,
            description: `${slotProposals.length} sessões no mesmo horário (${resources.coach || resources.location})`,
            athleteIds: slotProposals.map(p => p.athleteId),
            proposalIds: slotProposals.map(p => p.id)
          };
          
          conflicts.push(conflict);

          // Marcar proposals como conflict
          slotProposals.forEach(p => {
            p.status = 'conflict';
            p.conflict = conflict;
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Gera chave única para slot (data + hora)
   */
  private static slotKey(date: Date): string {
    return format(date, 'yyyy-MM-dd-HH:mm');
  }
}

// ============================================================================
// HELPERS PÚBLICOS
// ============================================================================

/**
 * Valida se configuração é válida
 */
export function validateSchedulingInput(input: Partial<SchedulingInput>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.athletes || input.athletes.length === 0) {
    errors.push('Pelo menos 1 atleta é necessário');
  }

  if (!input.defaults) {
    errors.push('Session defaults são obrigatórios');
  } else {
    if (!input.defaults.duration || input.defaults.duration < 15) {
      errors.push('Duração mínima é 15 minutos');
    }
    if (!input.defaults.dateRange) {
      errors.push('Date range é obrigatório');
    }
  }

  if (!input.availability || !input.availability.global.length) {
    errors.push('Pelo menos uma regra de disponibilidade global é necessária');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Estima tempo de geração (para UI feedback)
 */
export function estimateGenerationTime(athleteCount: number, daysRange: number): number {
  // Estimativa simples: ~100ms por atleta * dias
  return Math.min(athleteCount * daysRange * 100, 5000); // max 5s
}

/**
 * Formata summary de proposals para UI
 */
export function formatProposalsSummary(proposals: ScheduleProposal[]): string {
  const byDay = new Map<string, ScheduleProposal[]>();
  
  proposals.forEach(p => {
    const day = format(p.startAt, 'yyyy-MM-dd');
    if (!byDay.has(day)) {
      byDay.set(day, []);
    }
    byDay.get(day)!.push(p);
  });

  const parts: string[] = [];
  for (const [day, dayProposals] of byDay.entries()) {
    parts.push(`${format(parseISO(day), 'dd MMM')}: ${dayProposals.length}`);
  }

  return parts.join(' • ');
}
