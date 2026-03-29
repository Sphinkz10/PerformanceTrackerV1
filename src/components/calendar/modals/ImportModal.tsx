/**
 * IMPORT MODAL
 * 
 * Modal para importar eventos de arquivos externos
 * Suporta: iCal (.ics), CSV, JSON
 * Com preview e validação antes de importar
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  FileWarning,
  ArrowRight,
} from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useImportExport } from '@/hooks/useImportExport';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  existingEvents: CalendarEvent[];
  onSuccess: () => void;
}

export function ImportModal({
  isOpen,
  onClose,
  workspaceId,
  existingEvents,
  onSuccess,
}: ImportModalProps) {
  const {
    previewImport,
    importEvents,
    importPreview,
    clearPreview,
    isImporting,
  } = useImportExport();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [skipConflicts, setSkipConflicts] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    await previewImport(file, existingEvents);
  };

  const handleImport = async () => {
    if (!importPreview) return;

    const result = await importEvents(importPreview.events, workspaceId, {
      skipDuplicates,
      skipConflicts,
    });

    if (result.success) {
      onSuccess();
      handleClose();
    }
  };

  const handleClose = () => {
    clearPreview();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  const stats = importPreview?.stats;
  const hasPreview = !!importPreview;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Importar Eventos
                  </h2>
                  <p className="text-sm text-slate-600">
                    iCal (.ics), CSV ou JSON
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="h-10 w-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {!hasPreview ? (
              /* Upload Section */
              <>
                {/* File Input (Hidden) */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ics,.csv,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Upload Area */}
                <div
                  onClick={handleBrowse}
                  className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all"
                >
                  <Upload className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Escolha um arquivo
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Arraste e solte ou clique para selecionar
                  </p>
                  <div className="flex justify-center gap-2 text-xs text-slate-500">
                    <span className="px-3 py-1 bg-slate-100 rounded-full">.ics</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full">.csv</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full">.json</span>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                    <Calendar className="h-6 w-6 text-sky-600 mb-2" />
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      iCal (.ics)
                    </h4>
                    <p className="text-xs text-slate-600">
                      Formato padrão de calendários (Google, Outlook, Apple)
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <FileText className="h-6 w-6 text-emerald-600 mb-2" />
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      CSV
                    </h4>
                    <p className="text-xs text-slate-600">
                      Excel, Google Sheets ou arquivo de texto separado por vírgulas
                    </p>
                  </div>

                  <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
                    <Download className="h-6 w-6 text-violet-600 mb-2" />
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      JSON
                    </h4>
                    <p className="text-xs text-slate-600">
                      Exportação PerformTrack ou formato JSON estruturado
                    </p>
                  </div>
                </div>

                {/* Download Template */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <FileWarning className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-900 mb-2">
                        Primeira vez importando?
                      </p>
                      <p className="text-xs text-amber-700 mb-3">
                        Baixe um template CSV para ver o formato correto dos dados.
                      </p>
                      <button className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline">
                        Baixar template CSV
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Preview Section */
              <>
                {/* Stats Summary */}
                <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-center">
                    <FileText className="h-6 w-6 text-sky-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-sky-900">{stats?.total}</p>
                    <p className="text-xs text-sky-700">Total</p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                    <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-900">{stats?.valid}</p>
                    <p className="text-xs text-emerald-700">Válidos</p>
                  </div>

                  {stats && stats.invalid > 0 && (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center">
                      <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-900">{stats.invalid}</p>
                      <p className="text-xs text-red-700">Inválidos</p>
                    </div>
                  )}

                  {stats && stats.duplicates > 0 && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
                      <FileWarning className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-amber-900">{stats.duplicates}</p>
                      <p className="text-xs text-amber-700">Duplicados</p>
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="mb-6 space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Opções de Importação
                  </h4>

                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={skipDuplicates}
                      onChange={(e) => setSkipDuplicates(e.target.checked)}
                      className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Ignorar Duplicados
                      </p>
                      <p className="text-xs text-slate-600">
                        Não importar eventos que já existem (mesmo título e horário)
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={skipConflicts}
                      onChange={(e) => setSkipConflicts(e.target.checked)}
                      className="h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Ignorar Conflitos
                      </p>
                      <p className="text-xs text-slate-600">
                        Não importar eventos no mesmo horário de eventos existentes
                      </p>
                    </div>
                  </label>
                </div>

                {/* Events Preview */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Preview dos Eventos ({importPreview.events.length} eventos)
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto bg-slate-50 rounded-xl p-4 border border-slate-200">
                    {importPreview.events.slice(0, 20).map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {event.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-600">
                              {event.start_time && format(new Date(event.start_time), "dd MMM, HH:mm", { locale: pt })}
                            </span>
                            {event.location && (
                              <>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-600">{event.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      </div>
                    ))}
                    {importPreview.events.length > 20 && (
                      <p className="text-xs text-slate-500 font-medium text-center">
                        + {importPreview.events.length - 20} mais eventos
                      </p>
                    )}
                  </div>
                </div>

                {/* Change File Button */}
                <button
                  onClick={handleBrowse}
                  className="w-full text-sm font-semibold text-sky-600 hover:text-sky-700 underline"
                >
                  Escolher outro arquivo
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              disabled={isImporting}
              className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </motion.button>
            
            {hasPreview && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleImport}
                disabled={isImporting || !stats || stats.valid === 0}
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Importando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Importar {stats?.valid} Evento{stats && stats.valid > 1 ? 's' : ''}</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
