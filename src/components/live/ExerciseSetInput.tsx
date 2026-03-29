/**
 * EXERCISE SET INPUT - SEMANA 3 ENHANCED ✅
 * 
 * Input component para registar sets durante live session com:
 * - PR detection visual
 * - Quick input shortcuts
 * - RPE selector
 * - Form quality rating
 * 
 * @since Semana 3 - Live Session UX
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  Award, Check, X, TrendingUp, Heart, 
  Zap, Plus, Minus, Star 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export interface SetData {
  setNumber: number;
  reps?: number;
  weight?: number;
  distance?: number;
  duration?: number;
  rpe?: number;
  heartRate?: number;
  isPR?: boolean;
  formRating?: number;
  completed: boolean;
  timestamp: string;
  notes?: string;
}

interface ExerciseSetInputProps {
  exerciseName: string;
  exerciseType: 'strength' | 'cardio' | 'flexibility' | 'skill' | 'other';
  setNumber: number;
  prescribedReps?: number;
  prescribedWeight?: number;
  previousBest?: number; // For PR detection
  onSaveSet: (setData: SetData) => void;
  onSkipSet: () => void;
  onCancel: () => void;
}

export function ExerciseSetInput({
  exerciseName,
  exerciseType,
  setNumber,
  prescribedReps,
  prescribedWeight,
  previousBest,
  onSaveSet,
  onSkipSet,
  onCancel
}: ExerciseSetInputProps) {
  const [reps, setReps] = useState<number>(prescribedReps || 0);
  const [weight, setWeight] = useState<number>(prescribedWeight || 0);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [rpe, setRpe] = useState<number | undefined>();
  const [formRating, setFormRating] = useState<number | undefined>();
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  // PR detection
  const isPR = previousBest !== undefined && weight > previousBest;

  useEffect(() => {
    if (isPR) {
      toast.success('🏆 Recorde Pessoal!', {
        description: `${weight}kg (anterior: ${previousBest}kg)`,
        duration: 3000
      });
    }
  }, [isPR]);

  const handleSave = () => {
    const setData: SetData = {
      setNumber,
      reps: exerciseType === 'strength' ? reps : undefined,
      weight: exerciseType === 'strength' ? weight : undefined,
      distance: exerciseType === 'cardio' ? distance : undefined,
      duration: ['cardio', 'flexibility'].includes(exerciseType) ? duration : undefined,
      rpe,
      isPR,
      formRating,
      completed: true,
      timestamp: new Date().toISOString(),
      notes: notes.trim() || undefined
    };

    onSaveSet(setData);
  };

  const handleQuickRPE = (value: number) => {
    setRpe(value);
    // Auto-save if all required fields filled
    if ((exerciseType === 'strength' && reps > 0) || 
        (exerciseType === 'cardio' && distance > 0)) {
      setTimeout(handleSave, 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className={`p-6 border-b ${isPR ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30' : 'border-slate-700'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-sky-500/20 text-sky-300">
                  Série {setNumber}
                </span>
                {isPR && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white flex items-center gap-1"
                  >
                    <Award className="h-3 w-3" />
                    RECORDE!
                  </motion.div>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">{exerciseName}</h3>
              {prescribedReps && prescribedWeight && (
                <p className="text-sm text-slate-400 mt-1">
                  Prescrito: {prescribedReps} reps × {prescribedWeight}kg
                </p>
              )}
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="p-6 space-y-6">
          {/* Strength inputs */}
          {exerciseType === 'strength' && (
            <>
              {/* Reps */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Repetições
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReps(Math.max(0, reps - 1))}
                    className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                    className="flex-1 px-4 py-3 text-center text-2xl font-bold bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setReps(reps + 1)}
                    className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Peso (kg)
                  {previousBest && (
                    <span className="ml-2 text-xs text-slate-500">
                      Melhor: {previousBest}kg
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWeight(Math.max(0, weight - 2.5))}
                    className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className={`flex-1 px-4 py-3 text-center text-2xl font-bold border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent ${
                      isPR
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 focus:ring-amber-500'
                        : 'bg-slate-700/50 border-slate-600 text-white focus:ring-sky-500'
                    }`}
                  />
                  <button
                    onClick={() => setWeight(weight + 2.5)}
                    className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Cardio inputs */}
          {exerciseType === 'cardio' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Distância (metros)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-center text-2xl font-bold bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Duração (segundos)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-center text-2xl font-bold bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* RPE Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              RPE (Esforço Percebido)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickRPE(value)}
                  className={`py-3 rounded-lg font-bold transition-all ${
                    rpe === value
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {value}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Form Quality */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Qualidade Técnica
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFormRating(value)}
                  className="p-2"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      formRating && value <= formRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Notes toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-full text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            {showNotes ? '− Esconder' : '+ Adicionar'} notas
          </button>

          {showNotes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Notas sobre esta série..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  />
                </motion.div>
              )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-700 flex gap-3">
          <button
            onClick={onSkipSet}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
          >
            Pular Série
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={exerciseType === 'strength' && (reps === 0 || weight === 0)}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isPR
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg shadow-amber-500/30'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Check className="h-5 w-5" />
            {isPR ? 'Registar Recorde!' : 'Salvar Série'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
