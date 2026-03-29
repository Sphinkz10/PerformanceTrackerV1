// ============================================
// DEMO DATA GENERATORS
// Gera notificações e mensagens de demonstração
// ============================================

import {
  notifyPainReport,
  notifySessionCompleted,
  notifyFormSubmitted,
  notifyAthleteJoined,
  notifySessionScheduled,
  notifyHighLoad,
  notifyLowReadiness,
  notifyAIDecision
} from '../hooks/useNotificationGenerator';

/**
 * Popula o sistema com notificações de demonstração
 * Chamar uma vez no app start
 */
export function generateDemoNotifications() {
  // Verifica se já foram geradas
  const generated = localStorage.getItem('demo_notifications_generated');
  if (generated) return;

  // Aguarda 1 segundo antes de começar a gerar
  setTimeout(() => {
    // 1. Dor reportada
    notifyPainReport('João Silva', 'athlete-1', 7, 'Joelho esquerdo');
    
    setTimeout(() => {
      // 2. Sessão completada
      notifySessionCompleted('Maria Santos', 'athlete-2', 'Treino de Força', 95);
    }, 500);

    setTimeout(() => {
      // 3. Formulário preenchido
      notifyFormSubmitted('Pedro Costa', 'athlete-3', 'Wellness Check');
    }, 1000);

    setTimeout(() => {
      // 4. Novo atleta
      notifyAthleteJoined('Ana Rodrigues', 'athlete-4', 'Equipa Principal');
    }, 1500);

    setTimeout(() => {
      // 5. Sessão agendada
      notifySessionScheduled(5, '15 Jan', '14:00');
    }, 2000);

    setTimeout(() => {
      // 6. Carga elevada
      notifyHighLoad('Carlos Mendes', 'athlete-5', 92);
    }, 2500);

    setTimeout(() => {
      // 7. Readiness baixo
      notifyLowReadiness('Sofia Almeida', 'athlete-6', 55);
    }, 3000);

    setTimeout(() => {
      // 8. Decisão AI
      notifyAIDecision('João Silva', 'athlete-1', 'Redução de Volume');
    }, 3500);

    // Marca como geradas
    localStorage.setItem('demo_notifications_generated', 'true');
  }, 1000);
}

/**
 * Popula o sistema com mensagens de demonstração
 */
export function generateDemoMessages() {
  // Verifica se já foram geradas
  const generated = localStorage.getItem('demo_messages_generated');
  if (generated) return;

  // As mensagens serão criadas automaticamente pelo hook useMessages
  // quando as conversas forem inicializadas
  
  // Podemos simular algumas mensagens recebidas após inicialização
  setTimeout(() => {
    // Simular mensagem de um atleta
    const event = new CustomEvent('app:message-received', {
      detail: {
        conversationId: 'conv-athlete-1',
        athleteId: 'athlete-1',
        text: 'Olá! Tenho dúvidas sobre o treino de amanhã 🤔'
      }
    });
    window.dispatchEvent(event);
  }, 5000);

  setTimeout(() => {
    const event = new CustomEvent('app:message-received', {
      detail: {
        conversationId: 'conv-athlete-2',
        athleteId: 'athlete-2',
        text: 'Consegues ajustar a carga da próxima semana?'
      }
    });
    window.dispatchEvent(event);
  }, 8000);

  localStorage.setItem('demo_messages_generated', 'true');
}

/**
 * Reset demo data (útil para testing)
 */
export function resetDemoData() {
  localStorage.removeItem('demo_notifications_generated');
  localStorage.removeItem('demo_messages_generated');
  localStorage.removeItem('app_notifications');
  localStorage.removeItem('app_conversations');
  localStorage.removeItem('app_messages');
}

/**
 * Verifica se é a primeira vez que o app está sendo usado
 */
export function isFirstRun(): boolean {
  const firstRun = localStorage.getItem('app_first_run');
  if (!firstRun) {
    localStorage.setItem('app_first_run', 'false');
    return true;
  }
  return false;
}
