/**
 * WIZARD ADVANCED FEATURES
 * Advanced features for WizardMain
 * 
 * COMPONENTS:
 * - DraftRecoveryPrompt: Recover unsaved draft
 * - AutoSaveIndicator: Shows auto-save status
 * - ExportImportButtons: Export/Import config
 * - PostCreationModal: Actions after metric creation
 * - KeyboardShortcutsInfo: Keyboard shortcuts help
 */

'use client';

import { motion, AnimatePresence } from 'motion/react';
import {
  Save,
  Download,
  Upload,
  Copy,
  FileJson,
  Plus,
  Settings,
  Home,
  AlertCircle,
  CheckCircle,
  X,
  Zap,
} from 'lucide-react';

// ============================================================================
// DRAFT RECOVERY PROMPT
// ============================================================================

interface DraftRecoveryPromptProps {
  onRecover: () => void;
  onDiscard: () => void;
  draftAge: string; // e.g., "2 horas atrás"
}

export function DraftRecoveryPrompt({
  onRecover,
  onDiscard,
  draftAge,
}: DraftRecoveryPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-50 to-white border-2 border-amber-300 flex items-center justify-center shrink-0">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 mb-1">
              Rascunho encontrado
            </h3>
            <p className="text-sm text-slate-600">
              Encontrámos um rascunho não finalizado de {draftAge}. Queres continuar?
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDiscard}
            className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors min-h-[48px]"
          >
            Descartar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRecover}
            className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500 transition-all min-h-[48px]"
          >
            Recuperar
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// AUTO-SAVE INDICATOR
// ============================================================================

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSavedText: string | null;
  hasUnsavedChanges: boolean;
}

export function AutoSaveIndicator({
  isSaving,
  lastSavedText,
  hasUnsavedChanges,
}: AutoSaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-full"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Save className="h-3.5 w-3.5 text-sky-600" />
            </motion.div>
            <span className="text-xs font-semibold text-sky-700">
              Salvando...
            </span>
          </motion.div>
        ) : lastSavedText ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              hasUnsavedChanges
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-emerald-50 border border-emerald-200'
            }`}
          >
            <CheckCircle className={`h-3.5 w-3.5 ${
              hasUnsavedChanges ? 'text-amber-600' : 'text-emerald-600'
            }`} />
            <span className={`text-xs font-semibold ${
              hasUnsavedChanges ? 'text-amber-700' : 'text-emerald-700'
            }`}>
              {hasUnsavedChanges ? 'Alterações' : `Salvo ${lastSavedText}`}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// EXPORT/IMPORT BUTTONS
// ============================================================================

interface ExportImportButtonsProps {
  onExport: () => void;
  onImport: () => void;
  disabled?: boolean;
}

export function ExportImportButtons({
  onExport,
  onImport,
  disabled = false,
}: ExportImportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExport}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Exportar</span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onImport}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Importar</span>
      </motion.button>
    </div>
  );
}

// ============================================================================
// EXPORT MODAL
// ============================================================================

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonData: string;
  metricName: string;
}

export function ExportModal({
  isOpen,
  onClose,
  jsonData,
  metricName,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metric-${metricName.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-6 max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-50 to-white border-2 border-sky-300 flex items-center justify-center shrink-0">
              <FileJson className="h-5 w-5 text-sky-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 truncate">Exportar Configuração</h3>
              <p className="text-xs text-slate-600 truncate">{metricName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors shrink-0 ml-2"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* JSON Preview - Scrollable */}
        <div className="mb-4 flex-1 min-h-0 overflow-hidden">
          <pre className="h-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 overflow-auto">
            {jsonData}
          </pre>
        </div>

        {/* Buttons - Always visible */}
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors min-h-[48px]"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar JSON
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all min-h-[48px]"
          >
            <Download className="h-4 w-4" />
            Download .json
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// IMPORT MODAL
// ============================================================================

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
}

export function ImportModal({
  isOpen,
  onClose,
  onImport,
}: ImportModalProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      setError(null);
    } catch (error) {
      setError('Erro ao ler clipboard');
    }
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(jsonInput);
      onImport(data);
      onClose();
      setJsonInput('');
      setError(null);
    } catch (error) {
      setError('JSON inválido. Verifica a sintaxe.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonInput(text);
      setError(null);
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-6 max-w-2xl w-full shadow-xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-300 flex items-center justify-center shrink-0">
              <Upload className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 truncate">Importar Configuração</h3>
              <p className="text-xs text-slate-600">Cole o JSON ou carrega um ficheiro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors shrink-0 ml-2"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Textarea + Error */}
        <div className="mb-4 flex-1 min-h-0 flex flex-col">
          <textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setError(null);
            }}
            placeholder='Cole o JSON aqui... {"name": "...", "type": "..."}'
            className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all min-h-[120px]"
          />
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </motion.div>
          )}
        </div>

        {/* Actions - Always visible */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          {/* Paste/Upload buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePaste}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors min-h-[48px]"
            >
              <Copy className="h-4 w-4" />
              Colar
            </motion.button>
            
            <label className="flex-1">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer min-h-[48px]"
              >
                <FileJson className="h-4 w-4" />
                Carregar .json
              </motion.div>
            </label>
          </div>

          {/* Import button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleImport}
            disabled={!jsonInput.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            <Upload className="h-4 w-4" />
            Importar Configuração
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// POST-CREATION MODAL
// ============================================================================

interface PostCreationModalProps {
  isOpen: boolean;
  metricName: string;
  onAddValue: () => void;
  onConfigureAutomation: () => void;
  onGoToLibrary: () => void;
  onClose: () => void;
}

export function PostCreationModal({
  isOpen,
  metricName,
  onAddValue,
  onConfigureAutomation,
  onGoToLibrary,
  onClose,
}: PostCreationModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-md w-full shadow-xl"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-emerald-500/30"
          >
            ✅
          </motion.div>
          <h3 className="font-bold text-slate-900 text-lg mb-2">
            Métrica Criada!
          </h3>
          <p className="text-sm text-slate-600">
            <strong>{metricName}</strong> foi criada com sucesso.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddValue}
            className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:shadow-md transition-all group"
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">Adicionar Valor Agora</p>
              <p className="text-xs text-emerald-600">Ir para entrada manual</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfigureAutomation}
            className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400 hover:shadow-md transition-all group"
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">Configurar Automações</p>
              <p className="text-xs text-violet-600">Regras e alertas automáticos</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoToLibrary}
            className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-400 hover:shadow-md transition-all group"
          >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">Ir para Biblioteca</p>
              <p className="text-xs text-sky-600">Ver métrica na lista</p>
            </div>
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full px-4 py-3 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Fechar
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// Missing import
import { useState } from 'react';