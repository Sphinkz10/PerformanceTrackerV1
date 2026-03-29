/**
 * Export System API - FASE 5 ENTERPRISE FEATURES
 * 
 * POST /api/export
 * Exports data in various formats (CSV, Excel, PDF, JSON).
 * 
 * Body:
 * {
 *   workspaceId: string,
 *   dataType: 'athletes' | 'sessions' | 'metrics' | 'forms' | 'reports',
 *   format: 'csv' | 'excel' | 'pdf' | 'json',
 *   filters?: object,
 *   columns?: string[], // Columns to include
 *   userId?: string
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   exportId: string,
 *   downloadUrl: string,
 *   expiresAt: string,
 *   fileSize: number,
 *   rowCount: number
 * }
 * 
 * @author PerformTrack Team
 * @since Fase 5 - Enterprise Features
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { EventDispatcher } from '@/utils/events/dispatcher';

// ============================================================================
// EXPORT ENGINE
// ============================================================================

class ExportEngine {
  private supabase: any;
  private workspaceId: string;
  private dataType: string;
  private format: string;
  private filters: any;
  private columns: string[];

  constructor(
    supabase: any,
    workspaceId: string,
    dataType: string,
    format: string,
    filters: any,
    columns: string[]
  ) {
    this.supabase = supabase;
    this.workspaceId = workspaceId;
    this.dataType = dataType;
    this.format = format;
    this.filters = filters || {};
    this.columns = columns || [];
  }

  /**
   * Execute export
   */
  async execute(): Promise<{ data: any[]; rowCount: number }> {
    let data: any[];

    switch (this.dataType) {
      case 'athletes':
        data = await this.exportAthletes();
        break;
      case 'sessions':
        data = await this.exportSessions();
        break;
      case 'metrics':
        data = await this.exportMetrics();
        break;
      case 'forms':
        data = await this.exportForms();
        break;
      case 'reports':
        data = await this.exportReports();
        break;
      default:
        throw new Error(`Unknown data type: ${this.dataType}`);
    }

    return {
      data,
      rowCount: data.length,
    };
  }

  /**
   * Export athletes
   */
  private async exportAthletes(): Promise<any[]> {
    let query = this.supabase
      .from('athletes')
      .select('*')
      .eq('workspace_id', this.workspaceId)
      .eq('is_active', true);

    // Apply filters
    if (this.filters.athleteIds) {
      query = query.in('id', this.filters.athleteIds);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Select columns if specified
    if (this.columns.length > 0) {
      return (data || []).map((row: any) => this.selectColumns(row));
    }

    return data || [];
  }

  /**
   * Export sessions
   */
  private async exportSessions(): Promise<any[]> {
    let query = this.supabase
      .from('sessions')
      .select(`
        id,
        started_at,
        completed_at,
        status,
        workouts (
          name,
          type
        ),
        session_athletes (
          athletes (
            name
          )
        )
      `)
      .eq('workspace_id', this.workspaceId);

    // Apply date filters
    if (this.filters.startDate) {
      query = query.gte('started_at', this.filters.startDate);
    }
    if (this.filters.endDate) {
      query = query.lte('started_at', this.filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Flatten data
    const flattened = (data || []).map((session: any) => ({
      id: session.id,
      startedAt: session.started_at,
      completedAt: session.completed_at,
      status: session.status,
      workoutName: session.workouts?.name,
      workoutType: session.workouts?.type,
      athleteCount: session.session_athletes?.length || 0,
    }));

    return flattened;
  }

  /**
   * Export metrics
   */
  private async exportMetrics(): Promise<any[]> {
    let query = this.supabase
      .from('metric_updates')
      .select(`
        id,
        metric_id,
        athlete_id,
        value,
        timestamp,
        metrics (
          name,
          unit,
          category
        ),
        athletes (
          name
        )
      `)
      .order('timestamp', { ascending: false });

    // Apply filters
    if (this.filters.athleteIds) {
      query = query.in('athlete_id', this.filters.athleteIds);
    }
    if (this.filters.metricIds) {
      query = query.in('metric_id', this.filters.metricIds);
    }
    if (this.filters.startDate) {
      query = query.gte('timestamp', this.filters.startDate);
    }
    if (this.filters.endDate) {
      query = query.lte('timestamp', this.filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Flatten
    const flattened = (data || []).map((update: any) => ({
      id: update.id,
      metricName: update.metrics?.name,
      metricUnit: update.metrics?.unit,
      metricCategory: update.metrics?.category,
      athleteName: update.athletes?.name,
      value: update.value,
      timestamp: update.timestamp,
    }));

    return flattened;
  }

  /**
   * Export forms
   */
  private async exportForms(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('form_submissions')
      .select(`
        id,
        form_id,
        athlete_id,
        responses,
        submitted_at,
        forms (
          name,
          type
        ),
        athletes (
          name
        )
      `)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    // Flatten
    const flattened = (data || []).map((submission: any) => ({
      id: submission.id,
      formName: submission.forms?.name,
      formType: submission.forms?.type,
      athleteName: submission.athletes?.name,
      submittedAt: submission.submitted_at,
      responses: JSON.stringify(submission.responses),
    }));

    return flattened;
  }

  /**
   * Export reports
   */
  private async exportReports(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('report_executions')
      .select('*')
      .eq('workspace_id', this.workspaceId)
      .order('executed_at', { ascending: false });

    if (error) throw error;

    return data || [];
  }

  /**
   * Helper: Select specific columns
   */
  private selectColumns(row: any): any {
    const selected: any = {};
    this.columns.forEach(col => {
      if (row[col] !== undefined) {
        selected[col] = row[col];
      }
    });
    return selected;
  }

  /**
   * Convert to format
   */
  async convert(data: any[]): Promise<string> {
    switch (this.format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      
      case 'csv':
        return this.toCSV(data);
      
      case 'excel':
        // In production, use library like 'exceljs'
        return this.toCSV(data); // Fallback to CSV for now
      
      case 'pdf':
        // In production, use library like 'pdfkit' or 'puppeteer'
        throw new Error('PDF export not yet implemented');
      
      default:
        throw new Error(`Unknown format: ${this.format}`);
    }
  }

  /**
   * Convert to CSV
   */
  private toCSV(data: any[]): string {
    if (data.length === 0) return '';

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Build CSV
    const rows = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if needed
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      ),
    ];

    return rows.join('\n');
  }
}

// ============================================================================
// POST /api/export - Export data
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { workspaceId, dataType, format, filters, columns, userId } = body;

    if (!workspaceId || !dataType || !format) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['workspaceId', 'dataType', 'format']
        },
        { status: 400 }
      );
    }

    // Validate format
    const validFormats = ['csv', 'excel', 'pdf', 'json'];
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format', validFormats },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ==============================================================
    // Execute export
    // ==============================================================
    const engine = new ExportEngine(
      supabase,
      workspaceId,
      dataType,
      format,
      filters,
      columns
    );

    const { data, rowCount } = await engine.execute();
    const fileContent = await engine.convert(data);
    const fileSize = Buffer.byteLength(fileContent, 'utf8');

    // ==============================================================
    // For production: Upload to storage (S3, Supabase Storage, etc.)
    // For now, return data directly
    // ==============================================================

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `export-${dataType}-${timestamp}.${format}`;

    // In production, upload to storage:
    // const { data: uploadData } = await supabase.storage
    //   .from('exports')
    //   .upload(filename, fileContent, {
    //     contentType: format === 'csv' ? 'text/csv' : 'application/json',
    //   });

    // ==============================================================
    // Log audit
    // ==============================================================
    await supabase.from('audit_logs').insert({
      workspace_id: workspaceId,
      user_id: userId,
      action: 'export',
      entity_type: dataType,
      metadata: {
        format,
        rowCount,
        fileSize,
        filters,
      },
    });

    // ==============================================================
    // DISPATCH EXPORT COMPLETED EVENT
    // ==============================================================
    await EventDispatcher.dispatch({
      workspaceId,
      eventType: 'export.completed',
      eventData: {
        dataType,
        format,
        rowCount,
        fileSize,
        filename,
      },
      userId,
    }).catch(err => {
      console.error('❌ Error dispatching export event:', err);
    });

    // ==============================================================
    // Return export info
    // ==============================================================
    return NextResponse.json({
      success: true,
      export: {
        filename,
        format,
        dataType,
        rowCount,
        fileSize,
        // In production, return signed URL:
        // downloadUrl: uploadData.signedUrl,
        // expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        
        // For now, return data directly (for JSON/CSV)
        data: format === 'json' ? data : null,
        content: format === 'csv' ? fileContent : null,
      },
      message: `Exported ${rowCount} rows as ${format.toUpperCase()}`,
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ CRITICAL ERROR in POST /api/export:', error);
    return NextResponse.json(
      { 
        error: 'Failed to export data',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}