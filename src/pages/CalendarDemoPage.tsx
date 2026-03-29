/**
 * CALENDAR DEMO PAGE
 * Comprehensive demonstration of all calendar features
 * 
 * Features:
 * - Full calendar showcase
 * - All modals and panels
 * - Live integrations demo
 * - Analytics preview
 * - Export functionality
 * - Print preview
 * 
 * @module pages/CalendarDemoPage
 * @version 2.0.0
 * @created 18 Janeiro 2026
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Plus,
  Download,
  BarChart3,
  Settings,
  FileText,
  Printer,
  Zap,
  Database,
  FormInput,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { useAppContext } from '@/contexts/AppContext';

// Components
import { CalendarTodayWidget } from '@/components/dashboard/CalendarTodayWidget';
import { AnalyticsPanel } from '@/components/calendar/panels/AnalyticsPanel';
import { ExportModalV2 } from '@/components/calendar/modals/ExportModalV2';
import {
  WeeklySchedulePrint,
  MonthlyCalendarPrint,
  EventDetailsPrint,
  AttendanceSheetPrint,
} from '@/components/calendar/print/PrintTemplates';

// Hooks
import { useCalendarMetrics } from '@/hooks/use-calendar-metrics';

// ============================================================================
// MOCK DATA
// ============================================================================

const generateMockEvents = (count: number = 50): CalendarEvent[] => {
  const types = ['training', 'competition', 'meeting', 'recovery', 'assessment'];
  const statuses = ['confirmed', 'pending', 'completed', 'cancelled'];
  const locations = ['Campo A', 'Ginásio', 'Sala Reuniões', 'Piscina', 'Pista'];

  return Array.from({ length: count }, (_, i) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) - 30);
    startDate.setHours(8 + Math.floor(Math.random() * 12), 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1 + Math.floor(Math.random() * 2));

    return {
      id: `event_${i}`,
      workspace_id: 'demo_workspace',
      title: `Treino ${i + 1}`,
      description: `Descrição do evento ${i + 1}`,
      start_date: startDate,
      end_date: endDate,
      type: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      color: '#0ea5e9',
      athlete_ids: Array.from(
        { length: 5 + Math.floor(Math.random() * 10) },
        (_, j) => `athlete_${j}`
      ),
      tags: ['demo'],
      source: 'manual',
      created_at: new Date(),
      updated_at: new Date(),
    };
  });
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function CalendarDemoPage() {
  const { currentWorkspace } = useAppContext();
  const [activeSection, setActiveSection] = useState<
    'overview' | 'analytics' | 'export' | 'print' | 'integrations'
  >('overview');
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock data
  const mockEvents = generateMockEvents(50);
  const mockEvent = mockEvents[0];

  // Metrics
  const metrics = useCalendarMetrics(mockEvents, undefined, {
    workspaceId: 'demo_workspace',
  });

  // ============================================================================
  // SECTIONS
  // ============================================================================

  const sections = [
    {
      id: 'overview' as const,
      label: 'Visão Geral',
      icon: CalendarIcon,
      description: 'Dashboard e widgets',
    },
    {
      id: 'analytics' as const,
      label: 'Análises',
      icon: BarChart3,
      description: 'Gráficos e relatórios',
    },
    {
      id: 'export' as const,
      label: 'Exportação',
      icon: Download,
      description: 'Formatos de exportação',
    },
    {
      id: 'print' as const,
      label: 'Impressão',
      icon: Printer,
      description: 'Templates de impressão',
    },
    {
      id: 'integrations' as const,
      label: 'Integrações',
      icon: Zap,
      description: 'Lab Suites conectados',
    },
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                📅 Calendar System Demo
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                PerformTrack Calendar V2.0 - Complete Feature Showcase
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500">Version</p>
                <p className="text-sm font-semibold text-slate-900">2.0.0</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 overflow-x-auto mt-6 pb-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30'
                      : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <div className="text-left">
                    <p>{section.label}</p>
                    {!isActive && (
                      <p className="text-xs opacity-70">{section.description}</p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Dashboard Widgets
              </h2>
              <p className="text-sm text-slate-600">
                Componentes prontos para integração no dashboard principal
              </p>
            </div>

            {/* Calendar Today Widget */}
            <div className="max-w-2xl">
              <CalendarTodayWidget
                events={mockEvents}
                workspaceId="demo_workspace"
                onCreateEvent={() => alert('Criar evento')}
                onViewCalendar={() => alert('Ver calendário completo')}
                onEventClick={(event) => alert(`Evento: ${event.title}`)}
              />
            </div>

            {/* Metrics Cards */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Métricas em Tempo Real
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Events */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-sky-50/90 to-white/90 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                      <CalendarIcon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      Total Eventos
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">
                    {metrics.totalEvents}
                  </p>
                </motion.div>

                {/* Completion Rate */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50/90 to-white/90 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      Taxa Conclusão
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">
                    {metrics.completionRate.toFixed(0)}%
                  </p>
                </motion.div>

                {/* This Week */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-violet-50/90 to-white/90 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                      <CalendarIcon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      Esta Semana
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">
                    {metrics.thisWeekEvents}
                  </p>
                </motion.div>

                {/* This Month */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-amber-50/90 to-white/90 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                      <CalendarIcon className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      Este Mês
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-slate-900">
                    {metrics.thisMonthEvents}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnalyticsPanel
              events={mockEvents}
              workspaceId="demo_workspace"
              onExport={(data) => console.log('Export analytics:', data)}
            />
          </motion.div>
        )}

        {/* Export Section */}
        {activeSection === 'export' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Formatos de Exportação
              </h2>
              <p className="text-sm text-slate-600">
                5 formatos disponíveis com filtros avançados
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* CSV */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6"
              >
                <FileText className="h-8 w-8 text-emerald-600 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">CSV</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Compatível com Excel e Google Sheets
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>✅ Todos os campos</li>
                  <li>✅ UTF-8 encoding</li>
                  <li>✅ Fácil importação</li>
                </ul>
              </motion.div>

              {/* Excel */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6"
              >
                <FileText className="h-8 w-8 text-emerald-600 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">Excel</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Ficheiro .xlsx com formatação
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>✅ Formatação preservada</li>
                  <li>✅ Múltiplas folhas</li>
                  <li>✅ Fórmulas suportadas</li>
                </ul>
              </motion.div>

              {/* PDF */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-6"
              >
                <FileText className="h-8 w-8 text-red-600 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">PDF</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Documento imprimível
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>✅ Layout profissional</li>
                  <li>✅ Pronto para imprimir</li>
                  <li>✅ Partilha fácil</li>
                </ul>
              </motion.div>

              {/* JSON */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6"
              >
                <FileText className="h-8 w-8 text-violet-600 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">JSON</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Dados estruturados (API)
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>✅ Integração API</li>
                  <li>✅ Estrutura completa</li>
                  <li>✅ Programático</li>
                </ul>
              </motion.div>

              {/* iCal */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6"
              >
                <CalendarIcon className="h-8 w-8 text-sky-600 mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">iCal</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Importar noutros calendários
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>✅ Google Calendar</li>
                  <li>✅ Outlook</li>
                  <li>✅ Apple Calendar</li>
                </ul>
              </motion.div>
            </div>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all"
            >
              <Download className="h-4 w-4" />
              Abrir Modal de Exportação
            </motion.button>
          </motion.div>
        )}

        {/* Print Section */}
        {activeSection === 'print' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Templates de Impressão
              </h2>
              <p className="text-sm text-slate-600">
                4 templates profissionais prontos para impressão
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Schedule */}
              <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  📅 Agenda Semanal
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Layout A4 portrait com eventos organizados por dia
                </p>
                <ul className="text-xs text-slate-600 space-y-2 mb-4">
                  <li>✅ Vista semanal completa</li>
                  <li>✅ Horários detalhados</li>
                  <li>✅ Local e participantes</li>
                  <li>✅ Espaço para observações</li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
                >
                  <Printer className="h-4 w-4 inline mr-2" />
                  Preview
                </motion.button>
              </div>

              {/* Monthly Calendar */}
              <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  📆 Calendário Mensal
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Layout A4 landscape em formato grid
                </p>
                <ul className="text-xs text-slate-600 space-y-2 mb-4">
                  <li>✅ Vista mensal completa</li>
                  <li>✅ Grid de 7 colunas</li>
                  <li>✅ 3 eventos por dia</li>
                  <li>✅ Indicador de mais eventos</li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
                >
                  <Printer className="h-4 w-4 inline mr-2" />
                  Preview
                </motion.button>
              </div>

              {/* Event Details */}
              <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  📋 Detalhes do Evento
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Ficha completa de evento individual
                </p>
                <ul className="text-xs text-slate-600 space-y-2 mb-4">
                  <li>✅ Informação completa</li>
                  <li>✅ Lista de participantes</li>
                  <li>✅ Campo para assinaturas</li>
                  <li>✅ Espaço para notas</li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
                >
                  <Printer className="h-4 w-4 inline mr-2" />
                  Preview
                </motion.button>
              </div>

              {/* Attendance Sheet */}
              <div className="rounded-xl border-2 border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  ✅ Folha de Presenças
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Template para controle manual de presenças
                </p>
                <ul className="text-xs text-slate-600 space-y-2 mb-4">
                  <li>✅ 15+ linhas para atletas</li>
                  <li>✅ Checkboxes de presença</li>
                  <li>✅ Campo de assinatura</li>
                  <li>✅ Resumo final</li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
                >
                  <Printer className="h-4 w-4 inline mr-2" />
                  Preview
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Integrations Section */}
        {activeSection === 'integrations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Lab Suites Integradas
              </h2>
              <p className="text-sm text-slate-600">
                6 integrações completas com ecossistema PerformTrack
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DataOS */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">DataOS</h3>
                    <p className="text-xs text-slate-600">Sistema de Métricas</p>
                  </div>
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>✅ Event completion → Metric sync</li>
                  <li>✅ Attendance tracking</li>
                  <li>✅ Punctuality metrics</li>
                  <li>✅ Metric triggers → Events</li>
                  <li>✅ Team statistics</li>
                </ul>
              </motion.div>

              {/* Forms */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <FormInput className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Forms</h3>
                    <p className="text-xs text-slate-600">Formulários Dinâmicos</p>
                  </div>
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>✅ Pre-event form scheduling</li>
                  <li>✅ Post-event form triggers</li>
                  <li>✅ Form → Event creation</li>
                  <li>✅ Participant targeting</li>
                  <li>✅ Response tracking</li>
                </ul>
              </motion.div>

              {/* Live Session */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Live Session
                    </h3>
                    <p className="text-xs text-slate-600">Sessões em Tempo Real</p>
                  </div>
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>✅ Session → Event creation</li>
                  <li>✅ Real-time attendance sync</li>
                  <li>✅ Auto-complete on end</li>
                  <li>✅ Bidirectional linking</li>
                  <li>✅ Session statistics</li>
                </ul>
              </motion.div>

              {/* Automation */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Automation
                    </h3>
                    <p className="text-xs text-slate-600">Workflows Automáticos</p>
                  </div>
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>✅ 10 trigger types</li>
                  <li>✅ 8 action types</li>
                  <li>✅ Conditional logic</li>
                  <li>✅ Scheduled triggers</li>
                  <li>✅ Template variables</li>
                </ul>
              </motion.div>

              {/* Dashboard */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Dashboard
                    </h3>
                    <p className="text-xs text-slate-600">Painel de Controle</p>
                  </div>
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>✅ CalendarTodayWidget</li>
                  <li>✅ Real-time updates</li>
                  <li>✅ Quick actions</li>
                  <li>✅ Event navigation</li>
                  <li>✅ Stats display</li>
                </ul>
              </motion.div>

              {/* Reports */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Reports</h3>
                    <p className="text-xs text-slate-600">Relatórios Avançados</p>
                  </div>
                </div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li>✅ Event Summary Report</li>
                  <li>✅ Attendance Report</li>
                  <li>✅ Performance Report</li>
                  <li>✅ Utilization Report</li>
                  <li>✅ Export ready</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModalV2
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        events={mockEvents}
        workspaceId="demo_workspace"
      />

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              PerformTrack Calendar System V2.0 - Built with rigor 💪
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                Production Ready
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                100% Complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}