/**
 * CALENDAR ↔ AUTOMATION INTEGRATION
 * Event-triggered automations and workflows
 * 
 * Features:
 * - Event-triggered automations
 * - Recurring event automation
 * - Notification workflows
 * - Conditional actions
 * - Template-based automation
 * - Workspace isolation
 * 
 * @module calendar/automation-integration
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { CalendarEvent } from '@/types/calendar';

// ============================================================================
// TYPES
// ============================================================================

export type AutomationTrigger =
  | 'event_created'
  | 'event_updated'
  | 'event_confirmed'
  | 'event_completed'
  | 'event_cancelled'
  | 'participant_added'
  | 'participant_removed'
  | 'attendance_marked'
  | 'before_event'
  | 'after_event';

export type AutomationAction =
  | 'send_notification'
  | 'send_email'
  | 'send_sms'
  | 'create_task'
  | 'update_metric'
  | 'send_form'
  | 'create_event'
  | 'webhook';

export interface AutomationRule {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  enabled: boolean;
  
  // Trigger
  trigger: AutomationTrigger;
  trigger_config?: {
    before_minutes?: number; // For "before_event"
    after_minutes?: number; // For "after_event"
    event_types?: string[]; // Filter by event type
    event_statuses?: string[]; // Filter by status
  };
  
  // Conditions
  conditions?: AutomationCondition[];
  
  // Actions
  actions: AutomationActionConfig[];
  
  // Metadata
  created_at: Date;
  updated_at: Date;
  last_triggered_at?: Date;
  trigger_count: number;
}

export interface AutomationCondition {
  field: string; // e.g., "type", "athlete_count", "location"
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
}

export interface AutomationActionConfig {
  type: AutomationAction;
  config: Record<string, any>;
}

export interface AutomationExecution {
  id: string;
  rule_id: string;
  event_id: string;
  workspace_id: string;
  trigger: AutomationTrigger;
  status: 'pending' | 'running' | 'completed' | 'failed';
  actions_executed: number;
  actions_failed: number;
  error_message?: string;
  started_at: Date;
  completed_at?: Date;
}

// ============================================================================
// TRIGGER EVALUATION
// ============================================================================

/**
 * Evaluate if automation should trigger for an event
 */
export function shouldTriggerAutomation(
  rule: AutomationRule,
  event: CalendarEvent,
  trigger: AutomationTrigger
): boolean {
  // Check workspace
  if (rule.workspace_id !== event.workspace_id) {
    return false;
  }

  // Check if rule is enabled
  if (!rule.enabled) {
    return false;
  }

  // Check trigger type
  if (rule.trigger !== trigger) {
    return false;
  }

  // Check trigger config filters
  if (rule.trigger_config) {
    const { event_types, event_statuses } = rule.trigger_config;

    if (event_types && event_types.length > 0 && !event_types.includes(event.type)) {
      return false;
    }

    if (event_statuses && event_statuses.length > 0 && !event_statuses.includes(event.status)) {
      return false;
    }
  }

  // Evaluate conditions
  if (rule.conditions && rule.conditions.length > 0) {
    const conditionsMet = rule.conditions.every(condition =>
      evaluateCondition(condition, event)
    );

    if (!conditionsMet) {
      return false;
    }
  }

  return true;
}

/**
 * Evaluate a single condition
 */
function evaluateCondition(condition: AutomationCondition, event: CalendarEvent): boolean {
  const fieldValue = getFieldValue(event, condition.field);

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value;
    
    case 'not_equals':
      return fieldValue !== condition.value;
    
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
    
    case 'greater_than':
      return Number(fieldValue) > Number(condition.value);
    
    case 'less_than':
      return Number(fieldValue) < Number(condition.value);
    
    case 'in':
      return Array.isArray(condition.value) && condition.value.includes(fieldValue);
    
    case 'not_in':
      return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
    
    default:
      return false;
  }
}

/**
 * Get field value from event (supports nested paths)
 */
function getFieldValue(event: CalendarEvent, field: string): any {
  // Special computed fields
  if (field === 'athlete_count') {
    return event.athlete_ids?.length || 0;
  }

  // Direct field access
  if (field in event) {
    return event[field as keyof CalendarEvent];
  }

  return undefined;
}

// ============================================================================
// AUTOMATION EXECUTION
// ============================================================================

/**
 * Execute automation for an event
 */
export async function executeAutomation(
  rule: AutomationRule,
  event: CalendarEvent,
  trigger: AutomationTrigger
): Promise<AutomationExecution> {
  const execution: AutomationExecution = {
    id: `exec_${rule.id}_${event.id}_${Date.now()}`,
    rule_id: rule.id,
    event_id: event.id,
    workspace_id: event.workspace_id,
    trigger,
    status: 'running',
    actions_executed: 0,
    actions_failed: 0,
    started_at: new Date(),
  };

  try {
    // Execute each action
    for (const action of rule.actions) {
      try {
        await executeAction(action, event, rule.workspace_id);
        execution.actions_executed++;
      } catch (error) {
        execution.actions_failed++;
        console.error(`Action failed:`, error);
      }
    }

    execution.status = execution.actions_failed > 0 ? 'failed' : 'completed';
    execution.completed_at = new Date();

    // Update rule stats
    // await supabase
    //   .from('automation_rules')
    //   .update({
    //     last_triggered_at: new Date(),
    //     trigger_count: rule.trigger_count + 1,
    //   })
    //   .eq('id', rule.id);

  } catch (error) {
    execution.status = 'failed';
    execution.error_message = error instanceof Error ? error.message : 'Unknown error';
    execution.completed_at = new Date();
  }

  // Save execution log
  // await supabase.from('automation_executions').insert(execution);

  return execution;
}

/**
 * Execute a single action
 */
async function executeAction(
  action: AutomationActionConfig,
  event: CalendarEvent,
  workspaceId: string
): Promise<void> {
  switch (action.type) {
    case 'send_notification':
      await sendNotificationAction(action.config, event, workspaceId);
      break;

    case 'send_email':
      await sendEmailAction(action.config, event, workspaceId);
      break;

    case 'send_sms':
      await sendSMSAction(action.config, event, workspaceId);
      break;

    case 'create_task':
      await createTaskAction(action.config, event, workspaceId);
      break;

    case 'update_metric':
      await updateMetricAction(action.config, event, workspaceId);
      break;

    case 'send_form':
      await sendFormAction(action.config, event, workspaceId);
      break;

    case 'create_event':
      await createEventAction(action.config, event, workspaceId);
      break;

    case 'webhook':
      await webhookAction(action.config, event, workspaceId);
      break;

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// ============================================================================
// ACTION HANDLERS
// ============================================================================

/**
 * Send notification action
 */
async function sendNotificationAction(
  config: { title: string; message: string; recipient_ids: string[] },
  event: CalendarEvent,
  workspaceId: string
): Promise<void> {
  // Replace template variables
  const title = replaceTemplateVariables(config.title, event);
  const message = replaceTemplateVariables(config.message, event);

  // TODO: Send notifications
  // await fetch('/api/notifications/send', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     workspaceId,
  //     title,
  //     message,
  //     recipientIds: config.recipient_ids,
  //   }),
  // });

  console.log('Notification sent:', { title, message });
}

/**
 * Send email action
 */
async function sendEmailAction(
  config: { subject: string; body: string; recipient_ids: string[] },
  event: CalendarEvent,
  workspaceId: string
): Promise<void> {
  const subject = replaceTemplateVariables(config.subject, event);
  const body = replaceTemplateVariables(config.body, event);

  // TODO: Send emails
  console.log('Email sent:', { subject, body });
}

/**
 * Send SMS action
 */
async function sendSMSAction(
  config: { message: string; recipient_ids: string[] },
  event: CalendarEvent,
  workspaceId: string
): Promise<void> {
  const message = replaceTemplateVariables(config.message, event);

  // TODO: Send SMS
  console.log('SMS sent:', { message });
}

/**
 * Create task action
 */
async function createTaskAction(
  config: { title: string; description?: string; assignee_id: string; due_date?: string },
  event: CalendarEvent,
  workspaceId: string
): Promise<void> {
  const title = replaceTemplateVariables(config.title, event);
  const description = config.description ? replaceTemplateVariables(config.description, event) : undefined;

  // TODO: Create task
  console.log('Task created:', { title, description });
}

/**
 * Update metric action
 */
async function updateMetricAction(
  config: { metric_key: string; value: number; athlete_id?: string },
  event: CalendarEvent,
  workspaceId: string
): Promise<void> {
  // TODO: Update metric via DataOS
  console.log('Metric updated:', config);
}

/**
 * Send form action
 */
async function sendFormAction(
  config: { form_id: string; recipient_ids: string[] },
  event: CalendarEvent,
  workspaceId: string
): Promise<void> {
  // TODO: Send form via Forms integration
  console.log('Form sent:', config);
}

/**
 * Create event action
 */
async function createEventAction(
  config: { title: string; type: string; offset_days: number },
  event: CalendarEvent,
  workspaceId: string
): Promise<void> {
  const title = replaceTemplateVariables(config.title, event);
  const startDate = new Date(event.start_date);
  startDate.setDate(startDate.getDate() + config.offset_days);

  // TODO: Create new event
  console.log('Event created:', { title, startDate });
}

/**
 * Webhook action
 */
async function webhookAction(
  config: { url: string; method: 'GET' | 'POST'; headers?: Record<string, string>; body?: any },
  event: CalendarEvent,
  workspaceId: string
): Promise<void> {
  // TODO: Call webhook
  // await fetch(config.url, {
  //   method: config.method,
  //   headers: config.headers,
  //   body: config.body ? JSON.stringify(config.body) : undefined,
  // });

  console.log('Webhook called:', config.url);
}

// ============================================================================
// TEMPLATE VARIABLES
// ============================================================================

/**
 * Replace template variables in text
 */
function replaceTemplateVariables(text: string, event: CalendarEvent): string {
  return text
    .replace(/\{event\.title\}/g, event.title)
    .replace(/\{event\.type\}/g, event.type)
    .replace(/\{event\.status\}/g, event.status)
    .replace(/\{event\.location\}/g, event.location || '')
    .replace(/\{event\.description\}/g, event.description || '')
    .replace(/\{event\.athlete_count\}/g, String(event.athlete_ids?.length || 0))
    .replace(/\{event\.start_date\}/g, event.start_date.toString())
    .replace(/\{event\.end_date\}/g, event.end_date.toString());
}

// ============================================================================
// SCHEDULED TRIGGERS
// ============================================================================

/**
 * Schedule "before event" trigger
 */
export async function scheduleBeforeEventTrigger(
  rule: AutomationRule,
  event: CalendarEvent
): Promise<{ scheduled: boolean; triggerTime: Date }> {
  if (!rule.trigger_config?.before_minutes) {
    return { scheduled: false, triggerTime: new Date() };
  }

  const eventStart = new Date(event.start_date);
  const triggerTime = new Date(eventStart.getTime() - rule.trigger_config.before_minutes * 60 * 1000);

  // Don't schedule if trigger time is in the past
  if (triggerTime < new Date()) {
    return { scheduled: false, triggerTime };
  }

  // TODO: Schedule job (using cron or similar)
  // await scheduleJob({
  //   runAt: triggerTime,
  //   action: 'execute_automation',
  //   payload: {
  //     ruleId: rule.id,
  //     eventId: event.id,
  //     trigger: 'before_event',
  //   },
  // });

  return { scheduled: true, triggerTime };
}

/**
 * Schedule "after event" trigger
 */
export async function scheduleAfterEventTrigger(
  rule: AutomationRule,
  event: CalendarEvent
): Promise<{ scheduled: boolean; triggerTime: Date }> {
  if (!rule.trigger_config?.after_minutes) {
    return { scheduled: false, triggerTime: new Date() };
  }

  const eventEnd = new Date(event.end_date);
  const triggerTime = new Date(eventEnd.getTime() + rule.trigger_config.after_minutes * 60 * 1000);

  // TODO: Schedule job
  // await scheduleJob({
  //   runAt: triggerTime,
  //   action: 'execute_automation',
  //   payload: {
  //     ruleId: rule.id,
  //     eventId: event.id,
  //     trigger: 'after_event',
  //   },
  // });

  return { scheduled: true, triggerTime };
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Trigger automations for an event
 */
export async function triggerAutomationsForEvent(
  event: CalendarEvent,
  trigger: AutomationTrigger,
  rules: AutomationRule[]
): Promise<{
  triggered: number;
  executions: AutomationExecution[];
}> {
  const executions: AutomationExecution[] = [];

  // Filter rules that should trigger
  const applicableRules = rules.filter(rule =>
    shouldTriggerAutomation(rule, event, trigger)
  );

  // Execute each rule
  for (const rule of applicableRules) {
    const execution = await executeAutomation(rule, event, trigger);
    executions.push(execution);
  }

  return {
    triggered: applicableRules.length,
    executions,
  };
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get automation statistics
 */
export interface AutomationStats {
  totalRules: number;
  enabledRules: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageActionsPerExecution: number;
  mostTriggeredRule?: {
    id: string;
    name: string;
    triggerCount: number;
  };
}

export async function getAutomationStats(
  workspaceId: string,
  dateRange?: { start: Date; end: Date }
): Promise<AutomationStats> {
  // TODO: Query from database
  // const { data: rules } = await supabase
  //   .from('automation_rules')
  //   .select('*')
  //   .eq('workspace_id', workspaceId);

  // const { data: executions } = await supabase
  //   .from('automation_executions')
  //   .select('*')
  //   .eq('workspace_id', workspaceId);

  // Mock stats
  return {
    totalRules: 0,
    enabledRules: 0,
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
    averageActionsPerExecution: 0,
  };
}
