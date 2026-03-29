/**
 * CALENDAR ↔ FORMS INTEGRATION
 * Link forms to calendar events for data collection
 * 
 * @module calendar/forms-integration
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { CalendarEvent } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

export type FormTrigger = 'pre_event' | 'post_event' | 'during_event' | 'on_confirm' | 'on_decline';
export type TargetParticipants = 'all' | 'attended' | 'confirmed' | 'declined' | 'specific';

export interface EventFormLink {
  id?: string;
  event_id: string;
  form_id: string;
  workspace_id: string;
  
  // Trigger configuration
  trigger: FormTrigger;
  hours_before?: number;  // For pre_event
  hours_after?: number;   // For post_event
  
  // Targeting
  target_participants: TargetParticipants;
  athlete_ids?: string[]; // For target_participants: 'specific'
  
  // Settings
  required: boolean;
  send_reminder: boolean;
  reminder_hours?: number;
  
  // Status
  sent_at?: string;
  sent_count?: number;
  response_count?: number;
  
  // Metadata
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface FormSendConfig {
  formId: string;
  eventId: string;
  athleteIds: string[];
  workspaceId: string;
  required: boolean;
  expiresAt?: Date;
  message?: string;
}

export interface EventFromFormMapping {
  // Form field ID → Event property
  title_field?: string;
  description_field?: string;
  date_field?: string;
  time_field?: string;
  type_field?: string;
  location_field?: string;
  athletes_field?: string;
  
  // Default values if fields not mapped
  defaults?: Partial<CalendarEvent>;
}

// ============================================================================
// MAIN INTEGRATION CLASS
// ============================================================================

export class CalendarFormsBridge {
  /**
   * Attach form to calendar event
   */
  static async attachForm(link: Omit<EventFormLink, 'id' | 'created_at' | 'updated_at'>): Promise<EventFormLink> {
    // TODO: Save to database
    const newLink: EventFormLink = {
      id: `form-link-${Date.now()}`,
      ...link,
      sent_count: 0,
      response_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // await supabase.from('event_form_links').insert(newLink);

    console.log('[Forms Integration] Form attached:', newLink);
    return newLink;
  }

  /**
   * Get all forms linked to an event
   */
  static async getEventForms(eventId: string): Promise<EventFormLink[]> {
    // TODO: Query from database
    // const { data } = await supabase
    //   .from('event_form_links')
    //   .select('*')
    //   .eq('event_id', eventId);

    return [];
  }

  /**
   * Trigger forms based on event lifecycle
   */
  static async triggerEventForms(
    event: CalendarEvent,
    trigger: FormTrigger,
    participants?: Array<{ athlete_id: string; status: string }>
  ): Promise<{ sent: number; errors: string[] }> {
    // Get forms for this trigger
    const links = await this.getEventForms(event.id);
    const relevantLinks = links.filter(l => l.trigger === trigger);

    let sent = 0;
    const errors: string[] = [];

    for (const link of relevantLinks) {
      try {
        // Determine target athletes
        const targetAthletes = this.getTargetAthletes(link, participants || []);

        if (targetAthletes.length === 0) {
          console.warn(`[Forms Integration] No target athletes for form ${link.form_id}`);
          continue;
        }

        // Send form
        const config: FormSendConfig = {
          formId: link.form_id,
          eventId: event.id,
          athleteIds: targetAthletes,
          workspaceId: event.workspace_id,
          required: link.required,
          message: this.buildFormMessage(event, trigger),
        };

        await this.sendFormToAthletes(config);
        sent += targetAthletes.length;

        // Update sent count
        // await supabase
        //   .from('event_form_links')
        //   .update({ 
        //     sent_at: new Date().toISOString(),
        //     sent_count: targetAthletes.length 
        //   })
        //   .eq('id', link.id);

      } catch (error) {
        errors.push(`Failed to send form ${link.form_id}: ${error}`);
      }
    }

    return { sent, errors };
  }

  /**
   * Send form to specific athletes
   */
  static async sendFormToAthletes(config: FormSendConfig): Promise<void> {
    // TODO: Call Forms API
    // await fetch('/api/forms/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(config)
    // });

    console.log('[Forms Integration] Sending form to athletes:', {
      formId: config.formId,
      count: config.athleteIds.length,
      required: config.required,
    });
  }

  /**
   * Create calendar event from form submission
   */
  static async createEventFromForm(
    submissionId: string,
    mapping: EventFromFormMapping,
    workspaceId: string
  ): Promise<Partial<CalendarEvent>> {
    // TODO: Fetch submission data
    // const submission = await getFormSubmission(submissionId);

    // Mock submission for now
    const submission = {
      id: submissionId,
      form_id: 'form-1',
      responses: {
        'field-title': 'Treino de Força',
        'field-date': '2026-01-20',
        'field-time': '10:00',
        'field-type': 'workout',
        'field-location': 'Academia Premium',
      },
    };

    // Map form fields to event properties
    const eventData: Partial<CalendarEvent> = {
      workspace_id: workspaceId,
      title: mapping.title_field ? submission.responses[mapping.title_field] : mapping.defaults?.title || 'Novo Evento',
      description: mapping.description_field ? submission.responses[mapping.description_field] : mapping.defaults?.description,
      start_date: this.buildDateTime(
        mapping.date_field ? submission.responses[mapping.date_field] : new Date().toISOString(),
        mapping.time_field ? submission.responses[mapping.time_field] : '09:00'
      ),
      end_date: this.buildDateTime(
        mapping.date_field ? submission.responses[mapping.date_field] : new Date().toISOString(),
        mapping.time_field ? submission.responses[mapping.time_field] : '10:00'
      ),
      type: (mapping.type_field ? submission.responses[mapping.type_field] : mapping.defaults?.type || 'other') as any,
      location: mapping.location_field ? submission.responses[mapping.location_field] : mapping.defaults?.location,
      status: 'scheduled',
      metadata: {
        created_from_form: true,
        form_submission_id: submissionId,
        form_id: submission.form_id,
      },
    };

    // TODO: Create the event
    // const createdEvent = await createCalendarEvent(eventData);

    console.log('[Forms Integration] Event created from form:', eventData);
    return eventData;
  }

  /**
   * Schedule automatic form sending
   * Called by cron job or event listener
   */
  static async scheduleFormSending(link: EventFormLink, event: CalendarEvent): Promise<void> {
    if (link.trigger === 'pre_event' && link.hours_before) {
      const sendAt = new Date(event.start_date);
      sendAt.setHours(sendAt.getHours() - link.hours_before);

      // TODO: Schedule in job queue
      console.log(`[Forms Integration] Form ${link.form_id} scheduled to send at ${sendAt.toISOString()}`);
    }

    if (link.trigger === 'post_event' && link.hours_after) {
      const sendAt = new Date(event.end_date);
      sendAt.setHours(sendAt.getHours() + link.hours_after);

      // TODO: Schedule in job queue
      console.log(`[Forms Integration] Form ${link.form_id} scheduled to send at ${sendAt.toISOString()}`);
    }
  }

  /**
   * Check if form should be sent now
   * Called by scheduled job
   */
  static shouldSendFormNow(link: EventFormLink, event: CalendarEvent): boolean {
    const now = new Date();

    if (link.trigger === 'pre_event' && link.hours_before) {
      const sendTime = new Date(event.start_date);
      sendTime.setHours(sendTime.getHours() - link.hours_before);
      return now >= sendTime && (!link.sent_at || new Date(link.sent_at) < sendTime);
    }

    if (link.trigger === 'post_event' && link.hours_after) {
      const sendTime = new Date(event.end_date);
      sendTime.setHours(sendTime.getHours() + link.hours_after);
      return now >= sendTime && (!link.sent_at || new Date(link.sent_at) < sendTime);
    }

    return false;
  }

  /**
   * Get response rate for event forms
   */
  static async getFormResponseRate(eventId: string): Promise<{
    total_sent: number;
    total_responses: number;
    response_rate: number;
    by_form: Array<{ form_id: string; sent: number; responses: number; rate: number }>;
  }> {
    const links = await this.getEventForms(eventId);

    const total_sent = links.reduce((sum, l) => sum + (l.sent_count || 0), 0);
    const total_responses = links.reduce((sum, l) => sum + (l.response_count || 0), 0);

    return {
      total_sent,
      total_responses,
      response_rate: total_sent > 0 ? (total_responses / total_sent) * 100 : 0,
      by_form: links.map(l => ({
        form_id: l.form_id,
        sent: l.sent_count || 0,
        responses: l.response_count || 0,
        rate: (l.sent_count || 0) > 0 ? ((l.response_count || 0) / (l.sent_count || 0)) * 100 : 0,
      })),
    };
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  /**
   * Determine which athletes should receive the form
   */
  private static getTargetAthletes(
    link: EventFormLink,
    participants: Array<{ athlete_id: string; status: string }>
  ): string[] {
    switch (link.target_participants) {
      case 'all':
        return participants.map(p => p.athlete_id);

      case 'attended':
        return participants
          .filter(p => p.status === 'attended')
          .map(p => p.athlete_id);

      case 'confirmed':
        return participants
          .filter(p => p.status === 'confirmed')
          .map(p => p.athlete_id);

      case 'declined':
        return participants
          .filter(p => p.status === 'declined')
          .map(p => p.athlete_id);

      case 'specific':
        return link.athlete_ids || [];

      default:
        return [];
    }
  }

  /**
   * Build user-friendly message for form notification
   */
  private static buildFormMessage(event: CalendarEvent, trigger: FormTrigger): string {
    const messages = {
      pre_event: `Por favor, preencha este formulário antes do evento "${event.title}" que acontecerá em breve.`,
      post_event: `O evento "${event.title}" foi concluído. Por favor, preencha este formulário de avaliação.`,
      during_event: `Evento "${event.title}" em andamento. Por favor, preencha este formulário.`,
      on_confirm: `Obrigado por confirmar presença em "${event.title}". Por favor, preencha este formulário.`,
      on_decline: `Você declinou o evento "${event.title}". Por favor, nos informe o motivo através deste formulário.`,
    };

    return messages[trigger] || 'Por favor, preencha este formulário.';
  }

  /**
   * Build ISO datetime from date and time strings
   */
  private static buildDateTime(dateStr: string, timeStr: string): string {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get form trigger label
 */
export function getFormTriggerLabel(trigger: FormTrigger): string {
  const labels: Record<FormTrigger, string> = {
    pre_event: '📋 Antes do Evento',
    post_event: '📝 Após o Evento',
    during_event: '⏱️ Durante o Evento',
    on_confirm: '✅ Ao Confirmar',
    on_decline: '❌ Ao Recusar',
  };
  return labels[trigger];
}

/**
 * Get target participants label
 */
export function getTargetParticipantsLabel(target: TargetParticipants): string {
  const labels: Record<TargetParticipants, string> = {
    all: '👥 Todos os Participantes',
    attended: '✅ Somente Presentes',
    confirmed: '👍 Somente Confirmados',
    declined: '👎 Somente Recusados',
    specific: '🎯 Específicos',
  };
  return labels[target];
}

/**
 * Export interface for external use
 */
export default CalendarFormsBridge;
