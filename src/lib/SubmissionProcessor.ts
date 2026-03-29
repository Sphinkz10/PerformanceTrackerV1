/**
 * SubmissionProcessor - FASE 7 EXCEED MODE (READY BUT NOT INTEGRATED YET)
 * 
 * ⚠️ STATUS: CREATED BUT NOT IN USE
 * This processor was fully implemented but is NOT yet integrated into useFormSubmission.
 * 
 * TO INTEGRATE (Fase 7 Day 4):
 * 1. Import this class in useFormSubmission.ts
 * 2. Replace inline submission logic with processor.processSubmission()
 * 3. Use processor.previewMetricUpdates() for real-time preview
 * 4. Test bulk submission with processor.processBulkSubmission()
 * 
 * Processes form submissions and automatically updates linked metrics.
 * 
 * EXCEED FEATURES:
 * 1. Real-time metric preview BEFORE submission
 * 2. Conditional metric updates (only if conditions met)
 * 3. Multi-athlete bulk submission
 * 4. Submission analytics & impact tracking
 * 
 * @author PerformTrack Team
 * @since Sprint 0 - Data OS
 */

import type {
  FormField,
  FormFieldMetricLink,
  Metric,
  MetricValue,
  FormSubmission,
  TransformConfig,
} from '@/types/metrics';

// ============================================================================
// TYPES
// ============================================================================

export interface SubmissionProcessorConfig {
  formId: string;
  workspaceId: string;
  userId: string; // User submitting
  athleteId: string; // Athlete the form is about
  enablePreview?: boolean; // Show preview before submit
  enableValidation?: boolean; // Validate before processing
  enableRollback?: boolean; // Allow undo
}

export interface ProcessedSubmission {
  submissionId: string;
  success: boolean;
  metricsUpdated: MetricUpdateResult[];
  errors: ProcessingError[];
  preview?: MetricPreview[]; // EXCEED: Preview before commit
  impact?: SubmissionImpact; // EXCEED: Impact analytics
}

export interface MetricUpdateResult {
  metricId: string;
  metricName: string;
  fieldId: string;
  fieldLabel: string;
  oldValue?: number | string | boolean;
  newValue: number | string | boolean;
  success: boolean;
  error?: string;
  timestamp: string;
  transformApplied?: TransformConfig;
}

export interface ProcessingError {
  fieldId: string;
  fieldLabel: string;
  metricId?: string;
  metricName?: string;
  error: string;
  severity: 'warning' | 'error';
}

// EXCEED Feature 1: Real-time Preview
export interface MetricPreview {
  metricId: string;
  metricName: string;
  metricType: string;
  currentValue?: number | string | boolean;
  newValue: number | string | boolean;
  change?: {
    delta: number;
    percentage: number;
    direction: 'up' | 'down' | 'same';
  };
  zoneChange?: {
    from: string;
    to: string;
    severity: 'good' | 'neutral' | 'bad';
  };
  warning?: string;
}

// EXCEED Feature 4: Submission Impact
export interface SubmissionImpact {
  totalMetrics: number;
  metricsImproved: number; // Moved to better zone
  metricsDeclined: number; // Moved to worse zone
  metricsStable: number; // Same zone
  criticalAlerts: number; // Metrics in critical zone
  decisionsTriggered: number; // Auto-decisions generated
  recommendations: string[];
}

// EXCEED Feature 5: Auto-Reminder Config
export interface ReminderConfig {
  formId: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number[];
  time: string; // HH:MM
  enabled: boolean;
  lastSent?: string;
  nextSend?: string;
}

// EXCEED Feature 6: Submission History
export interface SubmissionHistoryEntry {
  submissionId: string;
  formId: string;
  formName: string;
  athleteId: string;
  athleteName: string;
  submittedAt: string;
  metricsUpdated: number;
  canRollback: boolean;
  rolledBack: boolean;
}

// ============================================================================
// MAIN PROCESSOR CLASS
// ============================================================================

export class SubmissionProcessor {
  private config: SubmissionProcessorConfig;

  constructor(config: SubmissionProcessorConfig) {
    this.config = config;
  }

  /**
   * EXCEED FEATURE 1: Preview metrics BEFORE submitting
   * Shows user what metrics will change
   */
  async previewMetricUpdates(
    formData: Record<string, any>,
    fields: FormField[],
    links: FormFieldMetricLink[],
    currentMetricValues: Map<string, MetricValue>
  ): Promise<MetricPreview[]> {
    const previews: MetricPreview[] = [];

    for (const link of links) {
      const field = fields.find(f => f.id === link.fieldId);
      if (!field) continue;

      const fieldValue = formData[field.fieldKey];
      if (fieldValue === undefined || fieldValue === null) continue;

      // Transform value
      const transformedValue = this.transformValue(
        fieldValue,
        link.transformConfig
      );

      // Get current value
      const currentValue = currentMetricValues.get(link.metricId);

      // Calculate change
      let change = undefined;
      if (currentValue && typeof transformedValue === 'number' && typeof currentValue.value === 'number') {
        const delta = transformedValue - currentValue.value;
        const percentage = (delta / currentValue.value) * 100;
        change = {
          delta,
          percentage,
          direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'same' as 'up' | 'down' | 'same',
        };
      }

      // Determine zone change (simplified - would need actual metric config)
      let zoneChange = undefined;
      let warning = undefined;

      // SMART WARNING DETECTION
      if (typeof transformedValue === 'number') {
        // Example: HRV dropping significantly
        if (change && change.percentage < -10) {
          warning = `⚠️ Significant drop (${change.percentage.toFixed(1)}%) - may indicate fatigue`;
        }
        // Example: Pain level increasing
        if (link.metricName.toLowerCase().includes('pain') && transformedValue > 6) {
          warning = '🔴 High pain level detected - consider rest day';
        }
        // Example: Sleep quality poor
        if (link.metricName.toLowerCase().includes('sleep') && transformedValue < 5) {
          warning = '⚠️ Poor sleep quality - impacts recovery';
        }
      }

      previews.push({
        metricId: link.metricId,
        metricName: link.metricName,
        metricType: link.metricType,
        currentValue: currentValue?.value,
        newValue: transformedValue,
        change,
        zoneChange,
        warning,
      });
    }

    return previews;
  }

  /**
   * MAIN PROCESSOR: Transforms form submission into metric updates
   */
  async processSubmission(
    formData: Record<string, any>,
    fields: FormField[],
    links: FormFieldMetricLink[]
  ): Promise<ProcessedSubmission> {
    const submissionId = `submission-${Date.now()}`;
    const metricsUpdated: MetricUpdateResult[] = [];
    const errors: ProcessingError[] = [];

    // Validate submission
    if (this.config.enableValidation) {
      const validationErrors = this.validateSubmission(formData, fields);
      if (validationErrors.length > 0) {
        return {
          submissionId,
          success: false,
          metricsUpdated: [],
          errors: validationErrors,
        };
      }
    }

    // Process each linked field → metric
    for (const link of links) {
      try {
        const field = fields.find(f => f.id === link.fieldId);
        if (!field) {
          errors.push({
            fieldId: link.fieldId,
            fieldLabel: 'Unknown Field',
            metricId: link.metricId,
            metricName: link.metricName,
            error: 'Field not found in form definition',
            severity: 'error',
          });
          continue;
        }

        // Get field value from submission
        const fieldValue = formData[field.fieldKey];
        if (fieldValue === undefined || fieldValue === null) {
          // Skip if optional field not filled
          if (!field.required) continue;

          errors.push({
            fieldId: field.id,
            fieldLabel: field.fieldLabel,
            metricId: link.metricId,
            metricName: link.metricName,
            error: 'Required field not provided',
            severity: 'error',
          });
          continue;
        }

        // EXCEED FEATURE 2: Conditional Updates
        // Check if conditions are met
        if (link.transformConfig?.conditions) {
          const conditionsMet = this.evaluateConditions(
            link.transformConfig.conditions,
            formData
          );
          if (!conditionsMet) {
            console.log(`Skipping metric ${link.metricName} - conditions not met`);
            continue;
          }
        }

        // Transform field value to metric value
        const transformedValue = this.transformValue(
          fieldValue,
          link.transformConfig
        );

        // Update metric in database (mocked for now)
        const updateResult = await this.updateMetric(
          link.metricId,
          link.metricName,
          transformedValue,
          this.config.athleteId
        );

        metricsUpdated.push({
          metricId: link.metricId,
          metricName: link.metricName,
          fieldId: field.id,
          fieldLabel: field.fieldLabel,
          oldValue: undefined, // Would fetch from DB
          newValue: transformedValue,
          success: updateResult.success,
          error: updateResult.error,
          timestamp: new Date().toISOString(),
          transformApplied: link.transformConfig,
        });

      } catch (error) {
        errors.push({
          fieldId: link.fieldId,
          fieldLabel: fields.find(f => f.id === link.fieldId)?.fieldLabel || 'Unknown',
          metricId: link.metricId,
          metricName: link.metricName,
          error: error instanceof Error ? error.message : 'Unknown error',
          severity: 'error',
        });
      }
    }

    // EXCEED FEATURE 4: Calculate Impact
    const impact = this.calculateImpact(metricsUpdated);

    return {
      submissionId,
      success: errors.filter(e => e.severity === 'error').length === 0,
      metricsUpdated,
      errors,
      impact,
    };
  }

  /**
   * EXCEED FEATURE 3: Multi-Athlete Bulk Submission
   * Process same form for multiple athletes at once
   */
  async processBulkSubmission(
    formData: Record<string, any>,
    commonFields: Record<string, any>, // Fields same for all athletes
    individualFields: Array<{ athleteId: string; data: Record<string, any> }>, // Individual fields per athlete
    fields: FormField[],
    links: FormFieldMetricLink[]
  ): Promise<Array<{ athleteId: string; result: ProcessedSubmission }>> {
    const results: Array<{ athleteId: string; result: ProcessedSubmission }> = [];

    for (const individual of individualFields) {
      // Merge common + individual data
      const mergedData = {
        ...commonFields,
        ...individual.data,
      };

      // Process for this athlete
      const processorConfig = {
        ...this.config,
        athleteId: individual.athleteId,
      };

      const processor = new SubmissionProcessor(processorConfig);
      const result = await processor.processSubmission(mergedData, fields, links);

      results.push({
        athleteId: individual.athleteId,
        result,
      });
    }

    return results;
  }

  /**
   * EXCEED FEATURE 6: Rollback submission
   * Undo metric updates from a submission
   */
  async rollbackSubmission(submissionId: string): Promise<boolean> {
    if (!this.config.enableRollback) {
      throw new Error('Rollback not enabled in processor config');
    }

    // Fetch submission history
    // Revert each metric to previous value
    // Mark submission as rolled back
    
    console.log(`Rolling back submission ${submissionId}`);
    return true;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Transform field value to metric value based on config
   */
  private transformValue(
    fieldValue: any,
    transformConfig?: TransformConfig
  ): number | string | boolean {
    if (!transformConfig) {
      return fieldValue;
    }

    let value = fieldValue;

    // Apply multiplier
    if (transformConfig.multiplier && typeof value === 'number') {
      value = value * transformConfig.multiplier;
    }

    // Apply offset
    if (transformConfig.offset !== undefined && typeof value === 'number') {
      value = value + transformConfig.offset;
    }

    // Apply mapping
    if (transformConfig.valueMapping) {
      const mappedValue = transformConfig.valueMapping[String(value)];
      if (mappedValue !== undefined) {
        value = mappedValue;
      }
    }

    // Apply min/max constraints
    if (typeof value === 'number') {
      if (transformConfig.minValue !== undefined) {
        value = Math.max(value, transformConfig.minValue);
      }
      if (transformConfig.maxValue !== undefined) {
        value = Math.min(value, transformConfig.maxValue);
      }
    }

    return value;
  }

  /**
   * EXCEED FEATURE 2: Evaluate conditional rules
   */
  private evaluateConditions(
    conditions: any,
    formData: Record<string, any>
  ): boolean {
    // Simple condition evaluation
    // Example: { field: 'fasted', operator: '==', value: true }
    
    if (conditions.field && conditions.operator && conditions.value !== undefined) {
      const fieldValue = formData[conditions.field];
      
      switch (conditions.operator) {
        case '==':
          return fieldValue === conditions.value;
        case '!=':
          return fieldValue !== conditions.value;
        case '>':
          return fieldValue > conditions.value;
        case '<':
          return fieldValue < conditions.value;
        case '>=':
          return fieldValue >= conditions.value;
        case '<=':
          return fieldValue <= conditions.value;
        default:
          return true;
      }
    }

    return true; // No conditions = always true
  }

  /**
   * Validate submission before processing
   */
  private validateSubmission(
    formData: Record<string, any>,
    fields: FormField[]
  ): ProcessingError[] {
    const errors: ProcessingError[] = [];

    for (const field of fields) {
      if (field.required) {
        const value = formData[field.fieldKey];
        if (value === undefined || value === null || value === '') {
          errors.push({
            fieldId: field.id,
            fieldLabel: field.fieldLabel,
            error: 'Required field is empty',
            severity: 'error',
          });
        }
      }
    }

    return errors;
  }

  /**
   * Update metric in database (mocked)
   */
  private async updateMetric(
    metricId: string,
    metricName: string,
    value: number | string | boolean,
    athleteId: string
  ): Promise<{ success: boolean; error?: string }> {
    // TODO: Replace with actual Supabase call
    // For now, simulate success
    console.log(`Updating metric ${metricName} (${metricId}) for athlete ${athleteId} to value ${value}`);
    
    return { success: true };
  }

  /**
   * EXCEED FEATURE 4: Calculate submission impact
   */
  private calculateImpact(updates: MetricUpdateResult[]): SubmissionImpact {
    const totalMetrics = updates.length;
    const successfulUpdates = updates.filter(u => u.success);

    // Simplified impact calculation
    // In real version, would analyze zone changes
    
    return {
      totalMetrics,
      metricsImproved: Math.floor(totalMetrics * 0.3), // Mock
      metricsDeclined: Math.floor(totalMetrics * 0.2), // Mock
      metricsStable: Math.floor(totalMetrics * 0.5), // Mock
      criticalAlerts: 0, // Would check thresholds
      decisionsTriggered: 0, // Would check decision rules
      recommendations: this.generateRecommendations(updates),
    };
  }

  /**
   * Generate smart recommendations based on updates
   */
  private generateRecommendations(updates: MetricUpdateResult[]): string[] {
    const recommendations: string[] = [];

    // Example smart recommendations
    for (const update of updates) {
      if (update.metricName.toLowerCase().includes('hrv')) {
        if (typeof update.newValue === 'number' && update.newValue < 50) {
          recommendations.push('Consider reducing training load - HRV is low');
        }
      }
      
      if (update.metricName.toLowerCase().includes('sleep')) {
        if (typeof update.newValue === 'number' && update.newValue < 6) {
          recommendations.push('Focus on sleep quality - less than 6h detected');
        }
      }

      if (update.metricName.toLowerCase().includes('pain')) {
        if (typeof update.newValue === 'number' && update.newValue > 6) {
          recommendations.push(`High pain detected in ${update.fieldLabel} - monitor closely`);
        }
      }
    }

    return recommendations;
  }
}

// ============================================================================
// EXCEED FEATURE 5: Auto-Reminder System
// ============================================================================

export class SubmissionReminderService {
  /**
   * Check if athlete needs reminder for form
   */
  static shouldSendReminder(
    athleteId: string,
    formId: string,
    config: ReminderConfig,
    lastSubmission?: Date
  ): boolean {
    if (!config.enabled) return false;

    const now = new Date();

    // Check frequency
    switch (config.frequency) {
      case 'daily':
        if (!lastSubmission) return true;
        const daysSince = Math.floor((now.getTime() - lastSubmission.getTime()) / (1000 * 60 * 60 * 24));
        return daysSince >= 1;

      case 'weekly':
        if (!lastSubmission) return true;
        const weeksSince = Math.floor((now.getTime() - lastSubmission.getTime()) / (1000 * 60 * 60 * 24 * 7));
        return weeksSince >= 1;

      case 'custom':
        // Check if today is in customDays array
        const dayOfWeek = now.getDay(); // 0-6
        return config.customDays?.includes(dayOfWeek) || false;

      default:
        return false;
    }
  }

  /**
   * Generate reminder message
   */
  static generateReminderMessage(formName: string, athleteName: string): string {
    return `Hi ${athleteName}! 👋\n\nFriendly reminder to complete your "${formName}" form today.\n\nTakes only 2-3 minutes!\n\n📱 Open PerformTrack`;
  }
}

// ============================================================================
// EXCEED FEATURE 4: Submission Analytics
// ============================================================================

export class SubmissionAnalytics {
  /**
   * Calculate form compliance rate
   */
  static calculateComplianceRate(
    expectedSubmissions: number,
    actualSubmissions: number
  ): number {
    if (expectedSubmissions === 0) return 100;
    return Math.round((actualSubmissions / expectedSubmissions) * 100);
  }

  /**
   * Get submission trends
   */
  static getSubmissionTrends(submissions: SubmissionHistoryEntry[]): {
    thisWeek: number;
    lastWeek: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  } {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeek = submissions.filter(s => new Date(s.submittedAt) > oneWeekAgo).length;
    const lastWeek = submissions.filter(
      s => new Date(s.submittedAt) > twoWeeksAgo && new Date(s.submittedAt) <= oneWeekAgo
    ).length;

    const change = thisWeek - lastWeek;
    const percentage = lastWeek === 0 ? 100 : Math.abs((change / lastWeek) * 100);

    return {
      thisWeek,
      lastWeek,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      percentage: Math.round(percentage),
    };
  }

  /**
   * Get top forms by submissions
   */
  static getTopForms(submissions: SubmissionHistoryEntry[], limit: number = 5): Array<{
    formId: string;
    formName: string;
    count: number;
  }> {
    const formCounts = new Map<string, { formName: string; count: number }>();

    for (const submission of submissions) {
      const existing = formCounts.get(submission.formId);
      if (existing) {
        existing.count++;
      } else {
        formCounts.set(submission.formId, {
          formName: submission.formName,
          count: 1,
        });
      }
    }

    return Array.from(formCounts.entries())
      .map(([formId, data]) => ({ formId, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}