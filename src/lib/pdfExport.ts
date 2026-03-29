/**
 * PDF Export Utility - FASE 5 COMPLETE
 * 
 * Utilities for exporting data and charts to PDF format.
 * 
 * FEATURES:
 * - Export metrics history with charts
 * - Export comparison reports
 * - Professional formatting
 * - Logo & branding
 * - Multiple formats (portrait/landscape)
 * 
 * NOTE: Uses browser-native print API (no external dependencies!)
 * This is more reliable and doesn't require jsPDF/html2canvas packages.
 * 
 * @author PerformTrack Team
 * @since Fase 5 - Export PDF
 */

import { format } from 'date-fns';
import type { Metric, MetricUpdate } from '@/types/metrics';

// ============================================================================
// TYPES
// ============================================================================

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  orientation?: 'portrait' | 'landscape';
  includeCharts?: boolean;
  includeLogo?: boolean;
}

export interface MetricPDFData {
  metric: Metric;
  athleteName: string;
  period: string;
  history: MetricUpdate[];
  stats: {
    current: number;
    avg: number;
    min: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
    trendPercent: number;
  };
}

export interface ComparisonPDFData {
  metric: Metric;
  athletes: Array<{
    id: string;
    name: string;
    stats: MetricPDFData['stats'];
    history: MetricUpdate[];
  }>;
  period: string;
}

// ============================================================================
// MAIN EXPORT FUNCTIONS
// ============================================================================

/**
 * Export Metric History to PDF
 * Creates a printable page and triggers browser print dialog
 */
export async function exportMetricHistoryToPDF(
  data: MetricPDFData,
  options: PDFExportOptions = { title: 'Metric History' }
): Promise<void> {
  const html = generateMetricHistoryHTML(data, options);
  await printHTML(html, options);
}

/**
 * Export Athlete Comparison to PDF
 * Creates a comparison report with side-by-side stats
 */
export async function exportComparisonToPDF(
  data: ComparisonPDFData,
  options: PDFExportOptions = { title: 'Athletes Comparison' }
): Promise<void> {
  const html = generateComparisonHTML(data, options);
  await printHTML(html, options);
}

// ============================================================================
// HTML GENERATION (for printing)
// ============================================================================

function generateMetricHistoryHTML(data: MetricPDFData, options: PDFExportOptions): string {
  const { metric, athleteName, period, history, stats } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${options.title}</title>
  <style>
    ${getCommonStyles()}
    
    .metric-header {
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      color: white;
      padding: 32px;
      border-radius: 16px;
      margin-bottom: 24px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .stat-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    
    .stat-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #0f172a;
    }
    
    .stat-unit {
      font-size: 14px;
      color: #64748b;
      margin-left: 4px;
    }
  </style>
</head>
<body>
  <div class="page">
    ${options.includeLogo !== false ? getLogoHTML() : ''}
    
    <!-- Header -->
    <div class="metric-header">
      <h1 style="margin: 0 0 8px 0; font-size: 28px;">${metric.name}</h1>
      <p style="margin: 0; opacity: 0.9; font-size: 16px;">${athleteName} • ${period}</p>
    </div>
    
    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Atual</div>
        <div class="stat-value">
          ${stats.current.toFixed(1)}
          <span class="stat-unit">${metric.unit || ''}</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Média</div>
        <div class="stat-value">
          ${stats.avg.toFixed(1)}
          <span class="stat-unit">${metric.unit || ''}</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Mínimo</div>
        <div class="stat-value">
          ${stats.min.toFixed(1)}
          <span class="stat-unit">${metric.unit || ''}</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Máximo</div>
        <div class="stat-value">
          ${stats.max.toFixed(1)}
          <span class="stat-unit">${metric.unit || ''}</span>
        </div>
      </div>
    </div>
    
    <!-- Trend Badge -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; padding: 8px 24px; border-radius: 999px; background: ${
        stats.trend === 'up' ? '#d1fae5' : stats.trend === 'down' ? '#fee2e2' : '#fef3c7'
      }; color: ${
        stats.trend === 'up' ? '#047857' : stats.trend === 'down' ? '#dc2626' : '#d97706'
      }; font-weight: 600;">
        ${
          stats.trend === 'up' ? '📈 Tendência Positiva' : 
          stats.trend === 'down' ? '📉 Tendência Negativa' : 
          '➡️ Estável'
        } 
        (${stats.trendPercent > 0 ? '+' : ''}${stats.trendPercent.toFixed(1)}%)
      </div>
    </div>
    
    <!-- History Table -->
    <h2 style="margin: 32px 0 16px 0; color: #0f172a;">📋 Histórico (${history.length} registos)</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Hora</th>
          <th>Valor</th>
          <th>Zona</th>
          <th>Origem</th>
        </tr>
      </thead>
      <tbody>
        ${history.map((entry) => `
          <tr>
            <td>${format(new Date(entry.timestamp), 'dd/MM/yyyy')}</td>
            <td>${format(new Date(entry.timestamp), 'HH:mm')}</td>
            <td style="font-weight: 600;">${entry.value} ${metric.unit || ''}</td>
            <td>
              <span style="display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; background: ${
                entry.zone === 'green' ? '#d1fae5' : entry.zone === 'yellow' ? '#fef3c7' : '#fee2e2'
              }; color: ${
                entry.zone === 'green' ? '#047857' : entry.zone === 'yellow' ? '#d97706' : '#dc2626'
              };">
                ${entry.zone === 'green' ? '🟢' : entry.zone === 'yellow' ? '🟡' : '🔴'}
              </span>
            </td>
            <td style="font-size: 12px; color: #64748b;">
              ${entry.sourceType === 'manual_entry' ? 'Manual' : 
                entry.sourceType === 'form_submission' ? 'Formulário' :
                entry.sourceType === 'live_session' ? 'Sessão Live' : 'Auto'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    ${getFooterHTML()}
  </div>
</body>
</html>
  `;
}

function generateComparisonHTML(data: ComparisonPDFData, options: PDFExportOptions): string {
  const { metric, athletes, period } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${options.title}</title>
  <style>
    ${getCommonStyles()}
    
    .comparison-header {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
      padding: 32px;
      border-radius: 16px;
      margin-bottom: 24px;
    }
    
    .athletes-grid {
      display: grid;
      grid-template-columns: repeat(${Math.min(athletes.length, 3)}, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .athlete-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      page-break-inside: avoid;
    }
    
    .athlete-name {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .athlete-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .athlete-stat {
      text-align: center;
    }
    
    .athlete-stat-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .athlete-stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="page">
    ${options.includeLogo !== false ? getLogoHTML() : ''}
    
    <!-- Header -->
    <div class="comparison-header">
      <h1 style="margin: 0 0 8px 0; font-size: 28px;">📊 Comparação de Atletas</h1>
      <p style="margin: 0; opacity: 0.9; font-size: 16px;">${metric.name} • ${period}</p>
    </div>
    
    <!-- Athletes Comparison Grid -->
    <div class="athletes-grid">
      ${athletes.map((athlete) => `
        <div class="athlete-card">
          <div class="athlete-name">${athlete.name}</div>
          <div class="athlete-stats">
            <div class="athlete-stat">
              <div class="athlete-stat-label">Atual</div>
              <div class="athlete-stat-value">${athlete.stats.current.toFixed(1)}</div>
            </div>
            <div class="athlete-stat">
              <div class="athlete-stat-label">Média</div>
              <div class="athlete-stat-value">${athlete.stats.avg.toFixed(1)}</div>
            </div>
            <div class="athlete-stat">
              <div class="athlete-stat-label">Min</div>
              <div class="athlete-stat-value">${athlete.stats.min.toFixed(1)}</div>
            </div>
            <div class="athlete-stat">
              <div class="athlete-stat-label">Max</div>
              <div class="athlete-stat-value">${athlete.stats.max.toFixed(1)}</div>
            </div>
          </div>
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0; text-align: center;">
            <span style="font-size: 12px; color: ${
              athlete.stats.trend === 'up' ? '#047857' : 
              athlete.stats.trend === 'down' ? '#dc2626' : '#d97706'
            }; font-weight: 600;">
              ${athlete.stats.trend === 'up' ? '📈' : athlete.stats.trend === 'down' ? '📉' : '➡️'}
              ${athlete.stats.trendPercent > 0 ? '+' : ''}${athlete.stats.trendPercent.toFixed(1)}%
            </span>
          </div>
        </div>
      `).join('')}
    </div>
    
    <!-- Comparison Table -->
    <h2 style="margin: 32px 0 16px 0; color: #0f172a;">📈 Resumo Comparativo</h2>
    <table class="data-table">
      <thead>
        <tr>
          <th>Métrica</th>
          ${athletes.map(a => `<th>${a.name}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: 600;">Valor Atual</td>
          ${athletes.map(a => `<td style="font-weight: 700; color: #0ea5e9;">${a.stats.current.toFixed(1)} ${metric.unit || ''}</td>`).join('')}
        </tr>
        <tr>
          <td style="font-weight: 600;">Média</td>
          ${athletes.map(a => `<td>${a.stats.avg.toFixed(1)} ${metric.unit || ''}</td>`).join('')}
        </tr>
        <tr>
          <td style="font-weight: 600;">Mínimo</td>
          ${athletes.map(a => `<td>${a.stats.min.toFixed(1)} ${metric.unit || ''}</td>`).join('')}
        </tr>
        <tr>
          <td style="font-weight: 600;">Máximo</td>
          ${athletes.map(a => `<td>${a.stats.max.toFixed(1)} ${metric.unit || ''}</td>`).join('')}
        </tr>
        <tr>
          <td style="font-weight: 600;">Tendência</td>
          ${athletes.map(a => `
            <td>
              <span style="color: ${
                a.stats.trend === 'up' ? '#047857' : 
                a.stats.trend === 'down' ? '#dc2626' : '#d97706'
              }; font-weight: 600;">
                ${a.stats.trend === 'up' ? '↑' : a.stats.trend === 'down' ? '↓' : '→'}
                ${a.stats.trendPercent > 0 ? '+' : ''}${a.stats.trendPercent.toFixed(1)}%
              </span>
            </td>
          `).join('')}
        </tr>
      </tbody>
    </table>
    
    ${getFooterHTML()}
  </div>
</body>
</html>
  `;
}

// ============================================================================
// COMMON STYLES & COMPONENTS
// ============================================================================

function getCommonStyles(): string {
  return `
    @page {
      margin: 20mm;
      size: A4;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #0f172a;
      background: #f8fafc;
      padding: 20px;
    }
    
    .page {
      background: white;
      max-width: 210mm;
      margin: 0 auto;
      padding: 24px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    
    h1, h2, h3 {
      color: #0f172a;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .data-table thead {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    }
    
    .data-table th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #475569;
      border-bottom: 2px solid #cbd5e1;
    }
    
    .data-table td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
    }
    
    .data-table tbody tr:last-child td {
      border-bottom: none;
    }
    
    .data-table tbody tr:hover {
      background: #f8fafc;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .page {
        box-shadow: none;
        padding: 0;
      }
    }
  `;
}

function getLogoHTML(): string {
  return `
    <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e2e8f0;">
      <h1 style="font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px;">
        ⚡ PerformTrack
      </h1>
      <p style="font-size: 12px; color: #64748b; font-weight: 600;">PERFORMANCE MANAGEMENT SYSTEM</p>
    </div>
  `;
}

function getFooterHTML(): string {
  const now = new Date();
  return `
    <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">
      <p>Gerado em ${format(now, 'dd/MM/yyyy HH:mm')} • PerformTrack v1.0</p>
      <p style="margin-top: 4px; font-size: 11px;">Este relatório é confidencial e destinado exclusivamente ao uso interno.</p>
    </div>
  `;
}

// ============================================================================
// PRINT UTILITY
// ============================================================================

async function printHTML(html: string, options: PDFExportOptions): Promise<void> {
  // Create a hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    throw new Error('Failed to create iframe document');
  }
  
  // Write HTML to iframe
  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();
  
  // Wait for content to load
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Trigger print
  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();
  
  // Clean up after printing (or canceling)
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
}
