/**
 * HISTORY EXPORT MODAL
 * Modal para configurar e exportar histórico
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, X, FileText, FileSpreadsheet, FileJson, Printer, CheckCircle } from 'lucide-react';
import { ResponsiveModal } from '@/components/shared/ResponsiveModal';

interface HistoryExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricName: string;
  onExport: (config: ExportConfig) => void;
}

interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  includeDate: boolean;
  includeAthlete: boolean;
  includeValue: boolean;
  includeZone: boolean;
  includeChange: boolean;
  includeNotes: boolean;
  includeEntryBy: boolean;
  groupBy: 'date' | 'athlete' | 'zone';
  period: 'current' | 'all' | 'custom';
}

export function HistoryExportModal({ isOpen, onClose, metricName, onExport }: HistoryExportModalProps) {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'csv',
    includeDate: true,
    includeAthlete: true,
    includeValue: true,
    includeZone: true,
    includeChange: true,
    includeNotes: true,
    includeEntryBy: false,
    groupBy: 'date',
    period: 'current',
  });

  const handleExport = () => {
    onExport(config);
    onClose();
  };

  const formatIcons = {
    csv: FileText,
    excel: FileSpreadsheet,
    pdf: Printer,
    json: FileJson,
  };

  const FormatIcon = formatIcons[config.format];

  return (
    <ResponsiveModal isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center">
                <Download className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h2 className="text-slate-900 font-semibold">⬇️ Exportar Histórico</h2>
                <p className="text-sm text-slate-600">{metricName}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100"
            >
              <X className="h-5 w-5 text-slate-400" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">FORMATO:</p>
            <div className="grid grid-cols-2 gap-3">
              {(['csv', 'excel', 'pdf', 'json'] as const).map((format) => {
                const Icon = formatIcons[format];
                return (
                  <label
                    key={format}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      config.format === format
                        ? 'bg-sky-50 border-2 border-sky-300'
                        : 'bg-white border-2 border-slate-200 hover:border-sky-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      checked={config.format === format}
                      onChange={() => setConfig({ ...config, format })}
                      className="h-4 w-4 text-sky-600"
                    />
                    <Icon className={`h-5 w-5 ${
                      config.format === format ? 'text-sky-600' : 'text-slate-400'
                    }`} />
                    <span className="text-sm font-medium text-slate-900 uppercase">
                      {format}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Data Inclusion */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">DADOS INCLUÍDOS:</p>
            <div className="space-y-2">
              {[
                { key: 'includeDate', label: 'Data e hora' },
                { key: 'includeAthlete', label: 'Atleta' },
                { key: 'includeValue', label: 'Valor' },
                { key: 'includeZone', label: 'Zona' },
                { key: 'includeChange', label: 'Variação vs anterior' },
                { key: 'includeNotes', label: 'Notas' },
                { key: 'includeEntryBy', label: 'Entrada por' },
              ].map((field) => (
                <label
                  key={field.key}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={config[field.key as keyof ExportConfig] as boolean}
                    onChange={(e) =>
                      setConfig({ ...config, [field.key]: e.target.checked })
                    }
                    className="h-4 w-4 text-sky-600 rounded"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {config[field.key as keyof ExportConfig] && (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    )}
                    <span className="text-sm text-slate-700">{field.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Grouping */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">AGRUPAMENTO:</p>
            <div className="space-y-2">
              {[
                { value: 'date', label: 'Por data' },
                { value: 'athlete', label: 'Por atleta' },
                { value: 'zone', label: 'Por zona' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    config.groupBy === option.value
                      ? 'bg-purple-50 border-2 border-purple-300'
                      : 'bg-white border-2 border-slate-200 hover:border-purple-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="groupBy"
                    value={option.value}
                    checked={config.groupBy === option.value}
                    onChange={(e) =>
                      setConfig({ ...config, groupBy: e.target.value as any })
                    }
                    className="h-4 w-4 text-purple-600"
                  />
                  <span className="text-sm text-slate-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Period */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">PERÍODO:</p>
            <div className="space-y-2">
              {[
                { value: 'current', label: 'Período atual (filtrado)' },
                { value: 'all', label: 'Todo o histórico' },
                { value: 'custom', label: 'Personalizado...' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    config.period === option.value
                      ? 'bg-amber-50 border-2 border-amber-300'
                      : 'bg-white border-2 border-slate-200 hover:border-amber-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="period"
                    value={option.value}
                    checked={config.period === option.value}
                    onChange={(e) =>
                      setConfig({ ...config, period: e.target.value as any })
                    }
                    className="h-4 w-4 text-amber-600"
                  />
                  <span className="text-sm text-slate-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200">
            <p className="text-sm font-semibold text-sky-900 mb-2">
              📋 Preview da Exportação:
            </p>
            <div className="space-y-1 text-xs text-sky-700">
              <p>• Formato: <strong>{config.format.toUpperCase()}</strong></p>
              <p>• Agrupamento: <strong>{
                config.groupBy === 'date' ? 'Por data' :
                config.groupBy === 'athlete' ? 'Por atleta' : 'Por zona'
              }</strong></p>
              <p>• Campos incluídos: <strong>{
                [
                  config.includeDate && 'Data',
                  config.includeAthlete && 'Atleta',
                  config.includeValue && 'Valor',
                  config.includeZone && 'Zona',
                  config.includeChange && 'Variação',
                  config.includeNotes && 'Notas',
                  config.includeEntryBy && 'Entrada por',
                ].filter(Boolean).length
              } campos</strong></p>
              <p>• Período: <strong>{
                config.period === 'current' ? 'Atual (filtrado)' :
                config.period === 'all' ? 'Todo histórico' : 'Personalizado'
              }</strong></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors min-h-[44px]"
            >
              Cancelar
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all min-h-[44px]"
            >
              <Download className="h-4 w-4" />
              ⬇️ Exportar
            </motion.button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
}
