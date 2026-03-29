/**
 * ========================================
 * CALENDAR V2.0 - MAIN PAGE
 * ========================================
 * 
 * Full calendar system integrated with PerformTrack ecosystem
 * 
 * @version 2.0.0
 * @created 14 Janeiro 2026
 * @status GO FULL - Production Implementation
 */

import React from 'react';
import { CalendarCore } from '@/components/calendar';

interface CalendarPageProps {
  workspaceId: string;
  onNavigate?: (page: string) => void;
}

export function CalendarPage({ workspaceId, onNavigate }: CalendarPageProps) {
  return <CalendarCore workspaceId={workspaceId} />;
}
