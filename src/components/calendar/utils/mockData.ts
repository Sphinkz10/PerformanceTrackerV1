/**
 * CENTRALIZED MOCK DATA
 * 
 * Single source of truth for all mock data used in calendar
 * Eliminates the 7 different MOCK_ATHLETES duplications
 * 
 * @module calendar/utils/mockData
 * @created 20 Janeiro 2026
 */

/**
 * Athlete interface with all possible fields
 */
export interface MockAthlete {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'injured' | 'rest' | 'available' | 'unavailable' | 'limited';
  recovery_level?: number;
  age?: number;
  sport?: string;
  team?: string;
}

/**
 * CENTRALIZED MOCK ATHLETES
 * 
 * Single source of truth - used by:
 * - TeamGroupManager
 * - CalendarCore
 * - ConflictResolverModal
 * - Step3Participants
 * - Step5Review
 * - EventInfo
 * - TeamView
 */
export const MOCK_ATHLETES: MockAthlete[] = [
  {
    id: 'athlete-1',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    avatar: '',
    status: 'active',
    recovery_level: 85,
    age: 24,
    sport: 'Futebol',
    team: 'Sub-23',
  },
  {
    id: 'athlete-2',
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    avatar: '',
    status: 'active',
    recovery_level: 92,
    age: 22,
    sport: 'Atletismo',
    team: 'Seniores',
  },
  {
    id: 'athlete-3',
    name: 'Pedro Costa',
    email: 'pedro.costa@example.com',
    avatar: '',
    status: 'injured',
    recovery_level: 45,
    age: 26,
    sport: 'Basquetebol',
    team: 'Sub-23',
  },
  {
    id: 'athlete-4',
    name: 'Ana Rodrigues',
    email: 'ana.rodrigues@example.com',
    avatar: '',
    status: 'active',
    recovery_level: 78,
    age: 21,
    sport: 'Natação',
    team: 'Juniores',
  },
  {
    id: 'athlete-5',
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@example.com',
    avatar: '',
    status: 'rest',
    recovery_level: 88,
    age: 25,
    sport: 'Ciclismo',
    team: 'Seniores',
  },
  {
    id: 'athlete-6',
    name: 'Beatriz Mendes',
    email: 'beatriz.mendes@example.com',
    avatar: '',
    status: 'active',
    recovery_level: 95,
    age: 23,
    sport: 'Voleibol',
    team: 'Sub-23',
  },
  {
    id: 'athlete-7',
    name: 'Miguel Alves',
    email: 'miguel.alves@example.com',
    avatar: '',
    status: 'active',
    recovery_level: 82,
    age: 27,
    sport: 'Futebol',
    team: 'Seniores',
  },
  {
    id: 'athlete-8',
    name: 'Sofia Pereira',
    email: 'sofia.pereira@example.com',
    avatar: '',
    status: 'active',
    recovery_level: 90,
    age: 20,
    sport: 'Ginástica',
    team: 'Juniores',
  },
  {
    id: 'athlete-9',
    name: 'Ricardo Lopes',
    email: 'ricardo.lopes@example.com',
    avatar: '',
    status: 'active',
    recovery_level: 75,
    age: 24,
    sport: 'Rugby',
    team: 'Sub-23',
  },
  {
    id: 'athlete-10',
    name: 'Inês Martins',
    email: 'ines.martins@example.com',
    avatar: '',
    status: 'active',
    recovery_level: 87,
    age: 22,
    sport: 'Ténis',
    team: 'Seniores',
  },
] as const;

/**
 * Mock coaches data
 */
export const MOCK_COACHES = [
  { id: 'coach-1', name: 'Treinador João', role: 'Head Coach' },
  { id: 'coach-2', name: 'Treinadora Maria', role: 'Assistant Coach' },
  { id: 'coach-3', name: 'Fisioterapeuta Pedro', role: 'Physiotherapist' },
] as const;

/**
 * Get athlete by ID (with type safety)
 */
export function getMockAthleteById(id: string): MockAthlete | undefined {
  return MOCK_ATHLETES.find(athlete => athlete.id === id);
}

/**
 * Get athletes by IDs
 */
export function getMockAthletesByIds(ids: string[]): MockAthlete[] {
  return MOCK_ATHLETES.filter(athlete => ids.includes(athlete.id));
}

/**
 * Get athletes by status
 */
export function getMockAthletesByStatus(
  status: MockAthlete['status']
): MockAthlete[] {
  return MOCK_ATHLETES.filter(athlete => athlete.status === status);
}

/**
 * For compatibility with old code that used numeric IDs
 * Maps old '1' to new 'athlete-1'
 * 
 * @deprecated Use athlete IDs directly
 */
export function mapLegacyAthleteId(oldId: string): string {
  if (oldId.startsWith('athlete-')) {
    return oldId; // Already new format
  }
  return `athlete-${oldId}`; // Convert '1' -> 'athlete-1'
}

/**
 * Get athlete by legacy ID
 * 
 * @deprecated Use getMockAthleteById with proper IDs
 */
export function getMockAthleteByLegacyId(oldId: string): MockAthlete | undefined {
  const newId = mapLegacyAthleteId(oldId);
  return getMockAthleteById(newId);
}
