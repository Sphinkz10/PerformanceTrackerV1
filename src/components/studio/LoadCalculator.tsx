import { useState } from 'react';
import { motion } from "motion/react";
import { X, Calculator, TrendingUp, Target, Zap, ChevronRight, Copy } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface LoadCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const PERCENTAGE_PRESETS = [
  { label: "100% (1RM)", value: 100, color: "red" },
  { label: "95%", value: 95, color: "orange" },
  { label: "90%", value: 90, color: "amber" },
  { label: "85%", value: 85, color: "yellow" },
  { label: "80%", value: 80, color: "lime" },
  { label: "75%", value: 75, color: "emerald" },
  { label: "70%", value: 70, color: "sky" },
  { label: "65%", value: 65, color: "blue" },
  { label: "60%", value: 60, color: "violet" },
  { label: "50%", value: 50, color: "purple" }
];

const RM_FORMULAS = [
  { id: "epley", name: "Epley", formula: "1RM = weight × (1 + reps/30)" },
  { id: "brzycki", name: "Brzycki", formula: "1RM = weight / (1.0278 - 0.0278 × reps)" },
  { id: "lander", name: "Lander", formula: "1RM = (100 × weight) / (101.3 - 2.67123 × reps)" },
  { id: "lombardi", name: "Lombardi", formula: "1RM = weight × reps^0.10" }
];

export function LoadCalculator({ isOpen, onClose }: LoadCalculatorProps) {
  const [activeTab, setActiveTab] = useState<"1rm" | "percentage" | "rpe">("1rm");
  
  // 1RM Calculator State
  const [weight, setWeight] = useState<number>(100);
  const [reps, setReps] = useState<number>(5);
  const [selectedFormula, setSelectedFormula] = useState<string>("epley");
  
  // Percentage Calculator State
  const [oneRM, setOneRM] = useState<number>(150);
  
  // RPE Calculator State
  const [rpeWeight, setRpeWeight] = useState<number>(100);
  const [rpeReps, setRpeReps] = useState<number>(8);
  const [rpeValue, setRpeValue] = useState<number>(8);

  const calculate1RM = (w: number, r: number, formula: string): number => {
    if (r === 1) return w;
    
    switch (formula) {
      case "epley":
        return w * (1 + r / 30);
      case "brzycki":
        return w / (1.0278 - 0.0278 * r);
      case "lander":
        return (100 * w) / (101.3 - 2.67123 * r);
      case "lombardi":
        return w * Math.pow(r, 0.10);
      default:
        return w * (1 + r / 30);
    }
  };

  const calculated1RM = calculate1RM(weight, reps, selectedFormula);

  const getPercentageLoad = (percentage: number): number => {
    return (oneRM * percentage) / 100;
  };

  const getRPEPercentage = (reps: number, rpe: number): number => {
    // Simplified RPE to percentage conversion
    // RPE 10 = 100%, RPE 9 = ~95%, etc.
    const rpeToPercent: { [key: number]: number } = {
      10: 100,
      9: 95.5,
      8: 92.2,
      7: 88.8,
      6: 85.5,
      5: 82.2,
      4: 78.9,
      3: 75.6,
      2: 72.2,
      1: 68.9
    };
    
    return rpeToPercent[rpe] || 85;
  };

  const estimatedRPE1RM = (rpeWeight / getRPEPercentage(rpeReps, rpeValue)) * 100;

  const handleCopyValue = (value: number, label: string) => {
    navigator.clipboard.writeText(value.toFixed(1));
    toast.success(`${label} copiado: ${value.toFixed(1)}kg`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-sky-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Calculadora de Carga</h2>
              <p className="text-xs text-slate-600">1RM, percentagens e RPE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-slate-200 bg-slate-50/50 overflow-x-auto">
          {[
            { id: "1rm", label: "Calcular 1RM", icon: "💪" },
            { id: "percentage", label: "% de 1RM", icon: "📊" },
            { id: "rpe", label: "RPE", icon: "⭐" }
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white border-2 border-slate-200 text-slate-700 hover:border-emerald-300"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "1rm" && (
            <div className="space-y-6">
              {/* Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    Peso Levantado (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 text-lg font-semibold border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                    placeholder="100"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    Repetições Realizadas
                  </label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 text-lg font-semibold border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-300 transition-all"
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Formula Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900">
                  Fórmula de Cálculo
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {RM_FORMULAS.map(formula => (
                    <button
                      key={formula.id}
                      onClick={() => setSelectedFormula(formula.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        selectedFormula === formula.id
                          ? "border-emerald-400 bg-emerald-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="font-semibold text-sm text-slate-900 mb-1">
                        {formula.name}
                      </div>
                      <div className="text-xs text-slate-600">
                        {calculate1RM(weight, reps, formula.id).toFixed(1)} kg
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900">1RM Estimado</h3>
                  </div>
                  <button
                    onClick={() => handleCopyValue(calculated1RM, "1RM")}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    Copiar
                  </button>
                </div>
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {calculated1RM.toFixed(1)} kg
                </div>
                <p className="text-sm text-slate-600">
                  Baseado em {weight}kg × {reps} reps usando fórmula {RM_FORMULAS.find(f => f.id === selectedFormula)?.name}
                </p>
              </div>

              {/* Percentage Table */}
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Referência Rápida de Percentagens
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {PERCENTAGE_PRESETS.map(preset => (
                    <div
                      key={preset.value}
                      className="p-3 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleCopyValue(getPercentageLoad(preset.value), preset.label)}
                    >
                      <div className="text-xs font-medium text-slate-600 mb-1">
                        {preset.label}
                      </div>
                      <div className="font-semibold text-slate-900">
                        {((calculated1RM * preset.value) / 100).toFixed(1)} kg
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 italic">
                  Click em qualquer valor para copiar
                </p>
              </div>
            </div>
          )}

          {activeTab === "percentage" && (
            <div className="space-y-6">
              {/* Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900">
                  Seu 1RM (kg)
                </label>
                <input
                  type="number"
                  value={oneRM}
                  onChange={(e) => setOneRM(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 text-lg font-semibold border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                  placeholder="150"
                />
              </div>

              {/* Percentage Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {PERCENTAGE_PRESETS.map((preset, index) => {
                  const load = getPercentageLoad(preset.value);
                  return (
                    <motion.div
                      key={preset.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group rounded-xl border-2 border-slate-200 bg-white p-4 hover:border-sky-300 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleCopyValue(load, preset.label)}
                    >
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {load.toFixed(1)}
                      </div>
                      <div className="text-xs font-medium text-slate-600">
                        kg
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <div className="text-xs font-semibold text-sky-600">
                          {preset.label}
                        </div>
                      </div>
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Copy className="h-3 w-3" />
                          Click para copiar
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Training Zones */}
              <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
                <h3 className="font-bold text-slate-900 mb-4">Zonas de Treino</h3>
                <div className="space-y-3">
                  {[
                    { name: "Força Máxima", range: "90-100%", load: `${getPercentageLoad(90).toFixed(1)} - ${getPercentageLoad(100).toFixed(1)} kg`, color: "red" },
                    { name: "Hipertrofia", range: "70-85%", load: `${getPercentageLoad(70).toFixed(1)} - ${getPercentageLoad(85).toFixed(1)} kg`, color: "emerald" },
                    { name: "Resistência Muscular", range: "50-70%", load: `${getPercentageLoad(50).toFixed(1)} - ${getPercentageLoad(70).toFixed(1)} kg`, color: "sky" },
                    { name: "Aquecimento", range: "40-60%", load: `${getPercentageLoad(40).toFixed(1)} - ${getPercentageLoad(60).toFixed(1)} kg`, color: "amber" }
                  ].map(zone => (
                    <div key={zone.name} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200">
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{zone.name}</div>
                        <div className="text-xs text-slate-600">{zone.range} do 1RM</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{zone.load}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "rpe" && (
            <div className="space-y-6">
              {/* Input Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    value={rpeWeight}
                    onChange={(e) => setRpeWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 text-lg font-semibold border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
                    placeholder="100"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    Repetições
                  </label>
                  <input
                    type="number"
                    value={rpeReps}
                    onChange={(e) => setRpeReps(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 text-lg font-semibold border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
                    placeholder="8"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    RPE
                  </label>
                  <select
                    value={rpeValue}
                    onChange={(e) => setRpeValue(parseInt(e.target.value))}
                    className="w-full px-4 py-3 text-lg font-semibold border-2 border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-300 transition-all"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>RPE {n}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result */}
              <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-violet-600" />
                    <h3 className="font-bold text-slate-900">1RM Estimado (RPE)</h3>
                  </div>
                  <button
                    onClick={() => handleCopyValue(estimatedRPE1RM, "1RM via RPE")}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-violet-50 border border-violet-200 text-violet-700 transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    Copiar
                  </button>
                </div>
                <div className="text-4xl font-bold text-violet-600 mb-2">
                  {estimatedRPE1RM.toFixed(1)} kg
                </div>
                <p className="text-sm text-slate-600">
                  Baseado em {rpeWeight}kg × {rpeReps} reps @ RPE {rpeValue}
                </p>
                <div className="mt-4 pt-4 border-t border-violet-100">
                  <div className="text-sm text-slate-700">
                    <strong>% do 1RM:</strong> ~{getRPEPercentage(rpeReps, rpeValue).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* RPE Scale Reference */}
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900">Escala RPE</h3>
                <div className="space-y-2">
                  {[
                    { rpe: 10, description: "Máximo esforço, sem reps na reserva", percent: "100%" },
                    { rpe: 9, description: "1 rep na reserva", percent: "~95-97%" },
                    { rpe: 8, description: "2-3 reps na reserva", percent: "~90-94%" },
                    { rpe: 7, description: "3-4 reps na reserva", percent: "~85-89%" },
                    { rpe: 6, description: "4-6 reps na reserva", percent: "~80-84%" }
                  ].map(item => (
                    <div
                      key={item.rpe}
                      className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{item.rpe}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{item.description}</div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-violet-600">{item.percent}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            💡 <strong>Dica:</strong> Click em qualquer valor calculado para copiar para a área de transferência
          </p>
        </div>
      </motion.div>
    </div>
  );
}