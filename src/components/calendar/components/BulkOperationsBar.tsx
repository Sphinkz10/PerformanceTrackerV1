/**
 * BULK OPERATIONS BAR
 * Floating action bar for bulk operations on selected events
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Edit3, 
  Trash2, 
  Copy, 
  Move,
  Tag,
  Users,
  Calendar,
  CheckSquare
} from 'lucide-react';
import { useCalendar } from '../core/CalendarProvider';

interface BulkOperationsBarProps {
  selectedCount: number;
  onBulkEdit: () => void;
  onBulkDelete: () => void;
  onBulkDuplicate?: () => void;
  onBulkMove?: () => void;
  onBulkTag?: () => void;
  onBulkAssign?: () => void;
  onClearSelection: () => void;
}

export function BulkOperationsBar({
  selectedCount,
  onBulkEdit,
  onBulkDelete,
  onBulkDuplicate,
  onBulkMove,
  onBulkTag,
  onBulkAssign,
  onClearSelection,
}: BulkOperationsBarProps) {
  if (selectedCount === 0) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="rounded-2xl border-2 border-sky-200 bg-white shadow-2xl shadow-sky-500/20 p-4">
          <div className="flex items-center gap-4">
            {/* Selection Info */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-sky-50 border border-sky-200">
              <CheckSquare className="h-5 w-5 text-sky-600" />
              <div>
                <p className="text-sm font-bold text-sky-900">
                  {selectedCount} {selectedCount === 1 ? 'evento selecionado' : 'eventos selecionados'}
                </p>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-8 w-px bg-slate-200" />
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Edit */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBulkEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
                title="Editar em massa"
              >
                <Edit3 className="h-4 w-4" />
                <span className="hidden sm:inline">Editar</span>
              </motion.button>
              
              {/* Duplicate */}
              {onBulkDuplicate && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBulkDuplicate}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
                  title="Duplicar"
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Duplicar</span>
                </motion.button>
              )}
              
              {/* Move */}
              {onBulkMove && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBulkMove}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all"
                  title="Mover data"
                >
                  <Move className="h-4 w-4" />
                  <span className="hidden sm:inline">Mover</span>
                </motion.button>
              )}
              
              {/* Tag */}
              {onBulkTag && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBulkTag}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all"
                  title="Adicionar tags"
                >
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline">Tags</span>
                </motion.button>
              )}
              
              {/* Assign */}
              {onBulkAssign && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBulkAssign}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all"
                  title="Atribuir atletas"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Atribuir</span>
                </motion.button>
              )}
              
              {/* Delete */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBulkDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:from-red-400 hover:to-red-500 transition-all"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Eliminar</span>
              </motion.button>
            </div>
            
            {/* Divider */}
            <div className="h-8 w-px bg-slate-200" />
            
            {/* Clear Selection */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClearSelection}
              className="h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Limpar seleção"
            >
              <X className="h-5 w-5 text-slate-600" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * SELECTION CHECKBOX
 * Checkbox for selecting individual events
 */
interface SelectionCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SelectionCheckbox({
  checked,
  onChange,
  disabled = false,
}: SelectionCheckboxProps) {
  return (
    <motion.label
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`
        relative inline-flex h-5 w-5 items-center justify-center
        rounded-md border-2 transition-all cursor-pointer
        ${checked 
          ? 'bg-sky-500 border-sky-500' 
          : 'bg-white border-slate-300 hover:border-sky-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <CheckSquare className="h-4 w-4 text-white" />
        </motion.div>
      )}
    </motion.label>
  );
}

/**
 * SELECT ALL CHECKBOX
 * Checkbox for selecting all visible events
 */
interface SelectAllCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function SelectAllCheckbox({
  checked,
  indeterminate = false,
  onChange,
  label = 'Selecionar todos',
}: SelectAllCheckboxProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onChange(!checked)}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl
        text-sm font-medium transition-all
        ${checked || indeterminate
          ? 'bg-sky-100 text-sky-700 border-2 border-sky-300'
          : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-sky-300'
        }
      `}
    >
      <div
        className={`
          relative h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all
          ${checked || indeterminate
            ? 'bg-sky-500 border-sky-500'
            : 'bg-white border-slate-300'
          }
        `}
      >
        {(checked || indeterminate) && (
          <CheckSquare className="h-4 w-4 text-white" />
        )}
        {indeterminate && !checked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-0.5 w-3 bg-white rounded" />
          </div>
        )}
      </div>
      <span>{label}</span>
    </motion.button>
  );
}
