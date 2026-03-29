// ============================================
// NOTIFICATION GENERATOR
// Gera notificações automáticas baseadas em eventos da app
// ============================================

import { useEffect } from 'react';
import { useCreateNotification } from './useNotifications';
import {
  createPainNotification,
  createSessionCompletedNotification,
  createFormSubmittedNotification,
  createAthleteJoinedNotification,
  createSessionScheduledNotification,
  createHighLoadNotification,
  createAIDecisionNotification,
  createLowReadinessNotification
} from './useNotifications';

/**
 * Hook que monitora eventos da aplicação e gera notificações
 * Use este hook uma vez no componente raiz (App.tsx)
 */
export function useNotificationGenerator(workspaceId: string = 'workspace-demo', userId: string = 'user-demo') {
  const { createNotification } = useCreateNotification();

  useEffect(() => {
    // ============================================
    // LISTENERS PARA EVENTOS DA APP
    // ============================================

    /**
     * Listener: Pain Report
     * Trigger: Quando atleta reporta dor no cockpit
     */
    const handlePainReport = (event: CustomEvent) => {
      const { athleteName, athleteId, level, location } = event.detail;
      
      if (level >= 6) { // Apenas alertar se dor >= 6
        const notif = createPainNotification(workspaceId, userId, athleteName, athleteId, level, location);
        createNotification(notif);
      }
    };

    /**
     * Listener: Session Completed
     * Trigger: Live Session finalizada
     */
    const handleSessionCompleted = (event: CustomEvent) => {
      const { athleteName, athleteId, sessionTitle, completionRate } = event.detail;
      
      const notif = createSessionCompletedNotification(
        workspaceId,
        userId,
        athleteName,
        athleteId,
        sessionTitle,
        completionRate
      );
      createNotification(notif);
    };

    /**
     * Listener: Form Submitted
     * Trigger: Atleta preenche formulário
     */
    const handleFormSubmitted = (event: CustomEvent) => {
      const { athleteName, athleteId, formName, formId } = event.detail;
      
      const notif = createFormSubmittedNotification(workspaceId, userId, athleteName, athleteId, formName, formId || 'form-id');
      createNotification(notif);
    };

    /**
     * Listener: Athlete Joined
     * Trigger: Novo atleta adicionado ao workspace
     */
    const handleAthleteJoined = (event: CustomEvent) => {
      const { athleteName, athleteId, team } = event.detail;
      
      const notif = createAthleteJoinedNotification(workspaceId, userId, athleteName, athleteId, team);
      createNotification(notif);
    };

    /**
     * Listener: Session Scheduled
     * Trigger: Sessão agendada no calendário
     */
    const handleSessionScheduled = (event: CustomEvent) => {
      const { count, date, time } = event.detail;
      
      const notif = createSessionScheduledNotification(workspaceId, userId, count, date, time);
      createNotification(notif);
    };

    /**
     * Listener: High Load
     * Trigger: Atleta ultrapassa threshold de carga
     */
    const handleHighLoad = (event: CustomEvent) => {
      const { athleteName, athleteId, loadPercent } = event.detail;
      
      if (loadPercent >= 90) { // Apenas alertar se >= 90%
        const notif = createHighLoadNotification(workspaceId, userId, athleteName, athleteId, loadPercent);
        createNotification(notif);
      }
    };

    /**
     * Listener: AI Decision Pending
     * Trigger: Sistema AI requer decisão do coach
     */
    const handleAIDecision = (event: CustomEvent) => {
      const { athleteName, athleteId, decisionType, decisionId } = event.detail;
      
      const notif = createAIDecisionNotification(workspaceId, userId, athleteName, athleteId, decisionType, decisionId || 'decision-id');
      createNotification(notif);
    };

    /**
     * Listener: Low Readiness
     * Trigger: Atleta com readiness abaixo do threshold
     */
    const handleLowReadiness = (event: CustomEvent) => {
      const { athleteName, athleteId, readiness } = event.detail;
      
      if (readiness <= 60) { // Apenas alertar se <= 60%
        const notif = createLowReadinessNotification(workspaceId, userId, athleteName, athleteId, readiness);
        createNotification(notif);
      }
    };

    // ============================================
    // REGISTAR LISTENERS
    // ============================================

    window.addEventListener('app:pain-report', handlePainReport as EventListener);
    window.addEventListener('app:session-completed', handleSessionCompleted as EventListener);
    window.addEventListener('app:form-submitted', handleFormSubmitted as EventListener);
    window.addEventListener('app:athlete-joined', handleAthleteJoined as EventListener);
    window.addEventListener('app:session-scheduled', handleSessionScheduled as EventListener);
    window.addEventListener('app:high-load', handleHighLoad as EventListener);
    window.addEventListener('app:ai-decision', handleAIDecision as EventListener);
    window.addEventListener('app:low-readiness', handleLowReadiness as EventListener);

    // ============================================
    // CLEANUP
    // ============================================

    return () => {
      window.removeEventListener('app:pain-report', handlePainReport as EventListener);
      window.removeEventListener('app:session-completed', handleSessionCompleted as EventListener);
      window.removeEventListener('app:form-submitted', handleFormSubmitted as EventListener);
      window.removeEventListener('app:athlete-joined', handleAthleteJoined as EventListener);
      window.removeEventListener('app:session-scheduled', handleSessionScheduled as EventListener);
      window.removeEventListener('app:high-load', handleHighLoad as EventListener);
      window.removeEventListener('app:ai-decision', handleAIDecision as EventListener);
      window.removeEventListener('app:low-readiness', handleLowReadiness as EventListener);
    };
  }, [createNotification, workspaceId, userId]);
}

// ============================================
// HELPER FUNCTIONS - Para disparar eventos
// ============================================

/**
 * Dispara evento de dor reportada
 * Usar nos componentes que lidam com pain reports
 */
export function notifyPainReport(athleteName: string, athleteId: string, level: number, location: string) {
  const event = new CustomEvent('app:pain-report', {
    detail: { athleteName, athleteId, level, location }
  });
  window.dispatchEvent(event);
}

/**
 * Dispara evento de sessão completada
 * Usar no Live Session quando finalizar
 */
export function notifySessionCompleted(athleteName: string, athleteId: string, sessionTitle: string, completionRate: number) {
  const event = new CustomEvent('app:session-completed', {
    detail: { athleteName, athleteId, sessionTitle, completionRate }
  });
  window.dispatchEvent(event);
}

/**
 * Dispara evento de formulário submetido
 * Usar no Form Center quando submeter
 */
export function notifyFormSubmitted(athleteName: string, athleteId: string, formName: string, formId?: string) {
  const event = new CustomEvent('app:form-submitted', {
    detail: { athleteName, athleteId, formName, formId }
  });
  window.dispatchEvent(event);
}

/**
 * Dispara evento de novo atleta
 * Usar no modal de criar atleta
 */
export function notifyAthleteJoined(athleteName: string, athleteId: string, team?: string) {
  const event = new CustomEvent('app:athlete-joined', {
    detail: { athleteName, athleteId, team }
  });
  window.dispatchEvent(event);
}

/**
 * Dispara evento de sessão agendada
 * Usar no calendário quando agendar
 */
export function notifySessionScheduled(count: number, date: string, time: string) {
  const event = new CustomEvent('app:session-scheduled', {
    detail: { count, date, time }
  });
  window.dispatchEvent(event);
}

/**
 * Dispara evento de carga elevada
 * Usar quando detectar carga alta
 */
export function notifyHighLoad(athleteName: string, athleteId: string, loadPercent: number) {
  const event = new CustomEvent('app:high-load', {
    detail: { athleteName, athleteId, loadPercent }
  });
  window.dispatchEvent(event);
}

/**
 * Dispara evento de decisão AI
 * Usar quando AI precisar de decisão
 */
export function notifyAIDecision(athleteName: string, athleteId: string, decisionType: string, decisionId?: string) {
  const event = new CustomEvent('app:ai-decision', {
    detail: { athleteName, athleteId, decisionType, decisionId }
  });
  window.dispatchEvent(event);
}

/**
 * Dispara evento de readiness baixo
 * Usar quando detectar readiness baixo
 */
export function notifyLowReadiness(athleteName: string, athleteId: string, readiness: number) {
  const event = new CustomEvent('app:low-readiness', {
    detail: { athleteName, athleteId, readiness }
  });
  window.dispatchEvent(event);
}