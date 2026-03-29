import { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  Hash,
  Clock,
  Weight,
  Gauge,
  TrendingDown,
  AlertCircle,
  FileText
} from "lucide-react";

interface ExerciseConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ExerciseConfig) => void;
  exercise: {
    id: string;
    name: string;
    category: string;
  };
  initialConfig?: ExerciseConfig;
}

export interface ExerciseConfig {
  sets?: number;
  reps?: number | string;
  duration?: number;
  distance?: number;
  load?: {
    type: "percentage" | "absolute" | "bodyweight" | "rpe";
    value?: number;
  };
  rest?: number;
  rpe?: number;
  rir?: number;
  tempo?: string;
  notes?: string;
}

export function ExerciseConfigPanel({
  isOpen,
  onClose,
  onSave,
  exercise,
  initialConfig
}: ExerciseConfigPanelProps) {
  const [config, setConfig] = useState<ExerciseConfig>(initialConfig || {
    sets: 3,
    reps: 10,
    rest: 60,
    load: { type: "bodyweight" }
  });

  const [metricType, setMetricType] = useState<"reps" | "time" | "distance">("reps");

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const updateConfig = (updates: Partial<ExerciseConfig>) => {
    setConfig({ ...config, ...updates });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">{exercise.name}</h3>
            <p className="text-xs text-slate-500">{exercise.category}</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Sets */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Hash className="h-4 w-4 text-slate-500" />
            Séries
          </label>
          <input
            type="number"
            value={config.sets || 3}
            onChange={(e) => updateConfig({ sets: parseInt(e.target.value) })}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
            min="1"
            max="10"
          />
        </div>

        {/* Metric Type Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Métrica
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setMetricType("reps")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                metricType === "reps"
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Reps
            </button>
            <button
              onClick={() => setMetricType("time")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                metricType === "time"
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Tempo
            </button>
            <button
              onClick={() => setMetricType("distance")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                metricType === "distance"
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Distância
            </button>
          </div>
        </div>

        {/* Reps */}
        {metricType === "reps" && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Hash className="h-4 w-4 text-slate-500" />
              Repetições
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {[8, 10, 12, 15].map((num) => (
                <button
                  key={num}
                  onClick={() => updateConfig({ reps: num, duration: undefined, distance: undefined })}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    config.reps === num
                      ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={typeof config.reps === "number" ? config.reps : ""}
              onChange={(e) => updateConfig({ reps: parseInt(e.target.value), duration: undefined, distance: undefined })}
              placeholder="Ou digite um valor"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => updateConfig({ reps: "AMRAP", duration: undefined, distance: undefined })}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  config.reps === "AMRAP"
                    ? "bg-violet-100 text-violet-700 border-2 border-violet-300"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                AMRAP
              </button>
              <button
                onClick={() => updateConfig({ reps: "Max", duration: undefined, distance: undefined })}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  config.reps === "Max"
                    ? "bg-violet-100 text-violet-700 border-2 border-violet-300"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Max
              </button>
            </div>
          </div>
        )}

        {/* Duration */}
        {metricType === "time" && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Clock className="h-4 w-4 text-slate-500" />
              Duração (segundos)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[20, 30, 45, 60, 90, 120].map((seconds) => (
                <button
                  key={seconds}
                  onClick={() => updateConfig({ duration: seconds, reps: undefined, distance: undefined })}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    config.duration === seconds
                      ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {seconds}s
                </button>
              ))}
            </div>
            <input
              type="number"
              value={config.duration || ""}
              onChange={(e) => updateConfig({ duration: parseInt(e.target.value), reps: undefined, distance: undefined })}
              placeholder="Ou digite em segundos"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
            />
          </div>
        )}

        {/* Distance */}
        {metricType === "distance" && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <TrendingDown className="h-4 w-4 text-slate-500" />
              Distância (metros)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[100, 200, 400, 500, 800, 1000].map((meters) => (
                <button
                  key={meters}
                  onClick={() => updateConfig({ distance: meters, reps: undefined, duration: undefined })}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    config.distance === meters
                      ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {meters}m
                </button>
              ))}
            </div>
            <input
              type="number"
              value={config.distance || ""}
              onChange={(e) => updateConfig({ distance: parseInt(e.target.value), reps: undefined, duration: undefined })}
              placeholder="Ou digite em metros"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
            />
          </div>
        )}

        {/* Rest */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Clock className="h-4 w-4 text-slate-500" />
            Descanso entre séries (segundos)
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[30, 45, 60, 90].map((seconds) => (
              <button
                key={seconds}
                onClick={() => updateConfig({ rest: seconds })}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  config.rest === seconds
                    ? "bg-sky-100 text-sky-700 border-2 border-sky-300"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {seconds}s
              </button>
            ))}
          </div>
          <input
            type="number"
            value={config.rest || ""}
            onChange={(e) => updateConfig({ rest: parseInt(e.target.value) })}
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
          />
        </div>

        {/* Load Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Weight className="h-4 w-4 text-slate-500" />
            Tipo de Carga
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateConfig({ load: { type: "bodyweight" } })}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                config.load?.type === "bodyweight"
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Peso Corporal
            </button>
            <button
              onClick={() => updateConfig({ load: { type: "percentage", value: 70 } })}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                config.load?.type === "percentage"
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              % 1RM
            </button>
            <button
              onClick={() => updateConfig({ load: { type: "absolute", value: 60 } })}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                config.load?.type === "absolute"
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Kg Absoluto
            </button>
            <button
              onClick={() => updateConfig({ load: { type: "rpe", value: 7 } })}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                config.load?.type === "rpe"
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              RPE
            </button>
          </div>

          {/* Load Value */}
          {config.load?.type !== "bodyweight" && (
            <div className="mt-2">
              <input
                type="number"
                value={config.load?.value || ""}
                onChange={(e) => updateConfig({
                  load: { ...config.load!, value: parseInt(e.target.value) }
                })}
                placeholder={
                  config.load?.type === "percentage" ? "% 1RM (ex: 70)" :
                  config.load?.type === "absolute" ? "Kg (ex: 60)" :
                  "RPE (1-10)"
                }
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
              />
            </div>
          )}
        </div>

        {/* Advanced Options */}
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Opções Avançadas</h4>

          {/* RPE */}
          <div className="mb-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Gauge className="h-4 w-4 text-slate-500" />
              RPE Target (1-10)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[6, 7, 8, 9, 10].map((rpe) => (
                <button
                  key={rpe}
                  onClick={() => updateConfig({ rpe })}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    config.rpe === rpe
                      ? "bg-amber-100 text-amber-700 border-2 border-amber-300"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {rpe}
                </button>
              ))}
            </div>
          </div>

          {/* RIR */}
          <div className="mb-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <TrendingDown className="h-4 w-4 text-slate-500" />
              RIR (Reps in Reserve)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((rir) => (
                <button
                  key={rir}
                  onClick={() => updateConfig({ rir })}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    config.rir === rir
                      ? "bg-violet-100 text-violet-700 border-2 border-violet-300"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {rir}
                </button>
              ))}
            </div>
          </div>

          {/* Tempo */}
          <div className="mb-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Clock className="h-4 w-4 text-slate-500" />
              Tempo (Excêntrico-Pausa-Concêntrico-Pausa)
            </label>
            <input
              type="text"
              value={config.tempo || ""}
              onChange={(e) => updateConfig({ tempo: e.target.value })}
              placeholder="ex: 3-1-2-0"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">Formato: 3s down - 1s pause - 2s up - 0s top</p>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileText className="h-4 w-4 text-slate-500" />
              Notas / Instruções
            </label>
            <textarea
              value={config.notes || ""}
              onChange={(e) => updateConfig({ notes: e.target.value })}
              rows={3}
              placeholder="Notas de execução, foco, variações..."
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 flex items-center gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
        >
          Aplicar
        </button>
      </div>
    </motion.div>
  );
}
