import { motion, AnimatePresence } from "motion/react";
import { X, Award, Star, TrendingUp, Target, Zap, Trophy } from "lucide-react";

interface GamificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const LEVEL_INFO = {
  current: 5,
  name: "Analista",
  progress: 75,
  nextLevel: "Analista Sênior",
  pointsToNext: 3
};

const STATS = [
  { label: "Relatórios criados", value: "47", icon: TrendingUp },
  { label: "Horas economizadas", value: "28h", icon: Zap },
  { label: "Insights gerados", value: "124", icon: Star },
  { label: "Decisões influenciadas", value: "31", icon: Target }
];

const ACHIEVEMENTS = [
  {
    id: "first-report",
    name: "Primeiro Relatório",
    description: "Criou seu primeiro relatório",
    icon: "🎯",
    unlocked: true,
    date: "Há 2 meses"
  },
  {
    id: "correlation-master",
    name: "Mestre das Correlações",
    description: "Encontrou 5 correlações importantes",
    icon: "🔗",
    unlocked: true,
    date: "Ontem"
  },
  {
    id: "efficiency-10x",
    name: "Eficiência 10x",
    description: "Economizou 10+ horas com relatórios",
    icon: "🚀",
    unlocked: true,
    date: "Há 3 dias"
  },
  {
    id: "team-leader",
    name: "Líder Analítico",
    description: "Relatórios usados por 5+ pessoas",
    icon: "👥",
    unlocked: false,
    progress: 60
  },
  {
    id: "data-driven",
    name: "Decisão Data-Driven",
    description: "10 decisões baseadas em dados",
    icon: "📊",
    unlocked: false,
    progress: 40
  }
];

const MILESTONES = [
  { level: 1, name: "Novato", achieved: true },
  { level: 5, name: "Analista", achieved: true },
  { level: 10, name: "Mestre", achieved: false },
  { level: 15, name: "Guru", achieved: false }
];

export function GamificationOverlay({ isOpen, onClose }: GamificationOverlayProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-violet-50 to-amber-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Sua Jornada Analítica</h2>
                  <p className="text-sm text-slate-600">Progresso e conquistas</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)] space-y-6">
            {/* Level Progress */}
            <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-600">Nível Atual</p>
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-amber-500">
                    Nível {LEVEL_INFO.current} - {LEVEL_INFO.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Próximo Nível</p>
                  <p className="font-semibold text-slate-900">{LEVEL_INFO.nextLevel}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progresso</span>
                  <span className="font-semibold text-violet-700">{LEVEL_INFO.progress}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${LEVEL_INFO.progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-violet-500 to-amber-500 relative"
                  >
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
                <p className="text-xs text-slate-500 text-center">
                  Faltam {LEVEL_INFO.pointsToNext} relatórios complexos para o próximo nível
                </p>
              </div>

              {/* Milestones */}
              <div className="mt-4 flex justify-between">
                {MILESTONES.map((milestone, idx) => (
                  <div key={milestone.level} className="flex flex-col items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      milestone.achieved
                        ? "bg-gradient-to-br from-violet-500 to-amber-500 text-white scale-110"
                        : "bg-slate-200 text-slate-500"
                    }`}>
                      {milestone.achieved ? <Award className="h-5 w-5" /> : milestone.level}
                    </div>
                    <p className="text-xs font-medium text-slate-600 mt-1">{milestone.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Estatísticas
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STATS.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="text-center p-4 rounded-xl border border-slate-200 bg-white"
                    >
                      <Icon className="h-5 w-5 text-sky-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-slate-600">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Conquistas ({ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length})
              </h3>
              <div className="space-y-3">
                {ACHIEVEMENTS.map((achievement, idx) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      achievement.unlocked
                        ? "border-amber-200 bg-gradient-to-r from-amber-50 to-white"
                        : "border-slate-200 bg-slate-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{achievement.name}</h4>
                        <p className="text-sm text-slate-600">{achievement.description}</p>
                        {achievement.unlocked ? (
                          <p className="text-xs text-amber-600 font-medium mt-2">
                            Desbloqueado {achievement.date}
                          </p>
                        ) : (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600">Progresso</span>
                              <span className="font-semibold text-slate-700">{achievement.progress}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500"
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center">
                          <Star className="h-4 w-4 text-white fill-white" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Impact */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Seu Impacto
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="text-sm text-slate-700">
                    Seus relatórios ajudaram a <span className="font-bold text-emerald-700">reduzir lesões em 15%</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-sky-500" />
                  <p className="text-sm text-slate-700">
                    Decisões baseadas em dados aumentaram em <span className="font-bold text-sky-700">40%</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-violet-500" />
                  <p className="text-sm text-slate-700">
                    Tempo de análise reduzido em <span className="font-bold text-violet-700">65%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
