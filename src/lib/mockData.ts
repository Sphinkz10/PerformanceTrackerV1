/**
 * Legacy Mock Data Utilities
 * Included to fix build errors from missing @/lib/mockData imports.
 * These should be refactored to use real utilities/types over time.
 */

// Date Utilities
export const formatDate = (date: string | Date): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

export const formatTime = (date: string | Date): string => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Mock Injuries
export const getInjuriesByAthleteId = (id: string) => {
    return []; // Return empty array to unblock build
};

// Types
export interface Athlete {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
    role: string;
    status: string;
    joinDate: string;
    lastActive: string;
    teams: string[];
    metrics?: AthleteMetrics;
}

export interface AthleteMetrics {
    readiness: number;
    fatigue: number;
    sleep: number;
    soreness: number;
    stress: number;
    mood: number;
    workload: number;
}
