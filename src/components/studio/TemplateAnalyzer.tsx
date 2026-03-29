import { motion } from "motion/react";
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  Target, 
  Dumbbell, 
  Clock, 
  Zap,
  Activity,
  Layers,
  Award,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import type { Template } from "../../lib/DesignStudioTypes";
import { analyzeTemplate } from "../../lib/DesignStudioHelpers";

interface TemplateAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template;
}

export function TemplateAnalyzer({ isOpen, onClose, template }: TemplateAnalyzerProps) {
  if (!isOpen) return null;

  const analysis = analyzeTemplate(template);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low": return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Baixa" };
      case "moderate": return { bg: "bg-amber-100", text: "text-amber-700", label: "Moderada" };
      case "high": return { bg: "bg-red-100", text: "text-red-700", label: "Alta" };
      default: return { bg: "bg-slate-100", text: "text-slate-700", label: "N/A" };
    }
  };

  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case "low": return { bg: "bg-sky-100", text: "text-sky-700", label: "Baixo" };
      case "moderate": return { bg: "bg-violet-100", text: "text-violet-700", label: "Moderado" };
      case "high": return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Alto" };
      default: return { bg: "bg-slate-100", text: "text-slate-700", label: "N/A" };
    }
  };

  const intensityColors = getIntensityColor(analysis.intensity);
  const volumeColors = getVolumeColor(analysis.volume);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Análise de Template</h2>
              <p className="text-xs text-slate-600">{template.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { 
                label: "Total de Blocos", 
                value: analysis.totalBlocks.toString(), 
                icon: Layers, 
                color: "sky",
                gradient: "from-sky-500 to-sky-600"
              },
              { 
                label: "Total Exercícios", 
                value: analysis.totalExercises.toString(), 
                icon: Dumbbell, 
                color: "emerald",
                gradient: "from-emerald-500 to-emerald-600"
              },
              { 
                label: "Total Séries", 
                value: analysis.totalSeries.toString(), 
                icon: Target, 
                color: "violet",
                gradient: "from-violet-500 to-violet-600"
              },
              { 
                label: "Duração Estimada", 
                value: `${analysis.estimatedDuration}min`, 
                icon: Clock, 
                color: "amber",
                gradient: "from-amber-500 to-amber-600"
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl border border-slate-200 bg-gradient-to-br from-${stat.color}-50/90 to-white/90 p-4`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Volume & Intensity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-violet-600" />
                <h3 className="font-bold text-slate-900">Intensidade</h3>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${intensityColors.bg} mb-4`}>
                <Zap className={`h-4 w-4 ${intensityColors.text}`} />
                <span className={`font-bold ${intensityColors.text}`}>
                  {intensityColors.label}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>RPE Médio:</span>
                  <span className="font-semibold text-slate-900">{analysis.avgRPE.toFixed(1)}/10</span>
                </div>
                <div className="flex justify-between">
                  <span>Carga Média:</span>
                  <span className="font-semibold text-slate-900">{analysis.avgLoad.toFixed(1)} kg</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">Volume</h3>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${volumeColors.bg} mb-4`}>
                <Target className={`h-4 w-4 ${volumeColors.text}`} />
                <span className={`font-bold ${volumeColors.text}`}>
                  {volumeColors.label}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Total Reps:</span>
                  <span className="font-semibold text-slate-900">{analysis.totalReps}</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume Total:</span>
                  <span className="font-semibold text-slate-900">{analysis.totalVolume.toFixed(0)} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Muscle Group Distribution */}
          {analysis.muscleGroupDistribution && Object.keys(analysis.muscleGroupDistribution).length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-slate-600" />
                Distribuição por Grupo Muscular
              </h3>
              <div className="space-y-3">
                {Object.entries(analysis.muscleGroupDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([muscle, count]) => {
                    const maxCount = Math.max(...Object.values(analysis.muscleGroupDistribution || {}));
                    const percentage = (count / maxCount) * 100;
                    
                    return (
                      <div key={muscle}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700">{muscle}</span>
                          <span className="text-sm font-semibold text-slate-900">{count} ex.</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Block Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-slate-600" />
              Breakdown por Bloco
            </h3>
            <div className="space-y-3">
              {template.blocks.map((block, index) => {
                const blockExercises = block.exercises.length;
                const blockSeries = block.exercises.reduce((sum, ex) => sum + ex.series.length, 0);
                const blockReps = block.exercises.reduce((sum, ex) => 
                  sum + ex.series.reduce((s, ser) => s + (ser.reps || 0), 0), 0
                );
                
                const blockTypeColors: { [key: string]: string } = {
                  warmup: "bg-amber-100 text-amber-700",
                  main: "bg-emerald-100 text-emerald-700",
                  accessory: "bg-sky-100 text-sky-700",
                  cooldown: "bg-violet-100 text-violet-700",
                  cardio: "bg-red-100 text-red-700"
                };

                const blockTypeLabels: { [key: string]: string } = {
                  warmup: "Aquecimento",
                  main: "Principal",
                  accessory: "Acessório",
                  cooldown: "Volta à Calma",
                  cardio: "Cardio"
                };

                return (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{block.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${blockTypeColors[block.type] || 'bg-slate-100 text-slate-700'}`}>
                          {blockTypeLabels[block.type] || block.type}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-slate-600">Exercícios</div>
                        <div className="font-semibold text-slate-900">{blockExercises}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600">Séries</div>
                        <div className="font-semibold text-slate-900">{blockSeries}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600">Reps</div>
                        <div className="font-semibold text-slate-900">{blockReps}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-sky-600" />
              Recomendações
            </h3>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, index) => {
                const isWarning = rec.includes("atenção") || rec.includes("considere") || rec.includes("baixo");
                const isSuccess = rec.includes("ótimo") || rec.includes("excelente") || rec.includes("bem");
                
                const Icon = isWarning ? AlertTriangle : isSuccess ? CheckCircle : Info;
                const colorClass = isWarning 
                  ? "text-amber-600 bg-amber-50 border-amber-200" 
                  : isSuccess 
                  ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                  : "text-sky-600 bg-sky-50 border-sky-200";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${colorClass}`}
                  >
                    <Icon className="h-4 w-4 shrink-0 mt-0.5" />
                    <p className="text-sm">{rec}</p>
                  </motion.div>
                );
              })}
              
              {analysis.recommendations.length === 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="text-sm">Template bem estruturado! Nenhuma recomendação crítica.</p>
                </div>
              )}
            </div>
          </div>

          {/* Training Score */}
          <div className="rounded-2xl border-2 border-gradient bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold mb-2 text-white/90">Score de Qualidade</h3>
                <div className="text-5xl font-bold mb-2">
                  {analysis.qualityScore}
                  <span className="text-2xl text-white/70">/100</span>
                </div>
                <p className="text-sm text-white/80">
                  {analysis.qualityScore >= 80 ? "Excelente estrutura!" :
                   analysis.qualityScore >= 60 ? "Boa estrutura com espaço para melhorias" :
                   "Considere ajustar volume e intensidade"}
                </p>
              </div>
              <div className="h-24 w-24 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/10">
                <Award className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            💡 <strong>Dica:</strong> Use estas análises para otimizar seu template e garantir progressão adequada
          </p>
        </div>
      </motion.div>
    </div>
  );
}
