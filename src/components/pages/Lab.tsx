import { motion } from "motion/react";
import {
  Palette,
  Radio,
  Database,
  BarChart3,
  FileText,
  Zap,
  HardDrive,
  ArrowRight,
  TrendingUp,
  Users,
  Activity,
  Target
} from "lucide-react";
import { StatCard } from "../shared/StatCard";

interface LabModule {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  stats?: { label: string; value: string };
  badge?: string;
}

interface LabProps {
  onNavigate?: (page: string) => void;
}

export function Lab({ onNavigate }: LabProps) {
  const modules: LabModule[] = [
    {
      id: "design-studio",
      name: "Design Studio",
      description: "Sistema completo de criação: Exercises, Workouts, Plans e Classes",
      icon: Palette,
      color: "from-violet-500 to-violet-600",
      gradient: "from-violet-50 to-white",
      stats: { label: "Templates", value: "24" },
      badge: "NEW",
    },
    {
      id: "live-command",
      name: "Live Command",
      description: "Controlo de sessões em tempo real com registo de snapshots imutáveis",
      icon: Radio,
      color: "from-emerald-500 to-emerald-600",
      gradient: "from-emerald-50 to-white",
      stats: { label: "Sessões ativas", value: "3" },
      badge: "LIVE",
    },
    {
      id: "data-os",
      name: "Data OS",
      description: "Sistema operacional de dados: Metrics Manager, catalog, pipelines e quality",
      icon: HardDrive,
      color: "from-slate-500 to-slate-600",
      gradient: "from-slate-50 to-white",
      stats: { label: "Métricas", value: "127" },
      badge: "CORE",
    },
    {
      id: "report-builder",
      name: "Report Builder",
      description: "Criador de relatórios com blocos, charts, tables e narrativa IA",
      icon: BarChart3,
      color: "from-amber-500 to-amber-600",
      gradient: "from-amber-50 to-white",
      stats: { label: "Relatórios", value: "18" },
    },
    {
      id: "form-center",
      name: "Form Center",
      description: "Criação e gestão de questionários (wellness, lesões, satisfação)",
      icon: FileText,
      color: "from-sky-500 to-sky-600",
      gradient: "from-sky-50 to-white",
      stats: { label: "Forms ativos", value: "12" },
    },
    {
      id: "automation-center",
      name: "Automation Center",
      description: "Builder de automações IF/THEN/ELSE com throttling e logs",
      icon: Zap,
      color: "from-red-500 to-red-600",
      gradient: "from-red-50 to-white",
      stats: { label: "Regras ativas", value: "8" },
    },
  ];

  const quickStats = [
    { label: "Templates Ativos", value: "24", trend: "+3 este mês", icon: Target },
    { label: "Sessões (30d)", value: "247", trend: "+12%", icon: Activity },
    { label: "Atletas c/ Dados", value: "23/24", trend: "96% completo", icon: Users },
    { label: "Data Quality", value: "94%", trend: "+2% vs. anterior", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Header */}
        <div>
          <h1 className="font-semibold text-slate-900 text-sm">Lab</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hub de ferramentas avançadas para design, análise e automação
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickStats.map((stat, index) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              trendPositive={true}
              color="sky"
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Modules Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 text-sm">Módulos Disponíveis</h2>
            <span className="text-xs text-slate-500">{modules.length} ferramentas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {modules.map((module, index) => {
              const Icon = module.icon;
              
              return (
                <motion.button
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate?.(module.id)}
                  className="group relative text-left"
                >
                  <div className={`rounded-2xl border-2 border-slate-200 bg-gradient-to-br ${module.gradient} p-5 shadow-sm hover:border-sky-300 hover:shadow-xl transition-all cursor-pointer overflow-hidden`}>
                    {/* Badge */}
                    {module.badge && (
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${module.color} text-white shadow-md`}>
                          {module.badge}
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="mb-4">
                      <div className={`inline-flex h-14 w-14 rounded-xl bg-gradient-to-br ${module.color} items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-900 mb-2">{module.name}</h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{module.description}</p>
                    </div>

                    {/* Stats */}
                    {module.stats && (
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <div>
                          <p className="text-xs text-slate-500">{module.stats.label}</p>
                          <p className="text-lg font-semibold text-slate-900 mt-0.5">{module.stats.value}</p>
                        </div>
                        <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center group-hover:bg-sky-50 group-hover:border-sky-300 transition-colors">
                          <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quick Access */}
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/50 to-white p-5">
          <h3 className="font-semibold text-slate-900 text-sm mb-3">Acesso Rápido</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("report-builder")}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all text-left"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">Novo Relatório</p>
                <p className="text-xs text-slate-500">Report Builder</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("live-command")}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all text-left"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Radio className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">Iniciar Live</p>
                <p className="text-xs text-slate-500">Live Command</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("design-studio")}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all text-left"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">Novo Template</p>
                <p className="text-xs text-slate-500">Design Studio</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate?.("automation-center")}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all text-left"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">Nova Automação</p>
                <p className="text-xs text-slate-500">Automation Center</p>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}