import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Users,
  AlertCircle,
  Send,
  BarChart3,
  Download,
  MoreVertical,
  X,
  CheckCircle,
  Clock
} from "lucide-react";
import { useAvailableAthletes } from "@/hooks/use-api";
import { useApp } from "@/contexts/AppContext";

interface Athlete {
  id: string;
  name: string;
  email: string;
  phone: string;
  sport: string;
  level: string;
  status: "active" | "inactive" | "on-hold";
  lastSession: string;
  attendance: number;
  avatar: string;
  risk?: "high" | "medium" | "low";
  alerts?: number;
}

interface AthletesProps {
  onViewProfile: (athleteId: string) => void;
  onSendForm: () => void;
  onCreateReport: () => void;
  onCreateAthlete: () => void;
}

export function Athletes({ onViewProfile, onSendForm, onCreateReport, onCreateAthlete }: AthletesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);

  const { workspaceId } = useApp();
  const { athletes: rawAthletes, isLoading } = useAvailableAthletes(workspaceId);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

  const athletes: Athlete[] = rawAthletes.map((a: any) => ({
    id: a.id,
    name: a.name,
    email: a.email || '',
    phone: a.phone || '',
    sport: a.sport || 'Geral',
    level: 'Amador',
    status: a.status || 'active',
    lastSession: 'N/A',
    attendance: 0,
    avatar: getInitials(a.name),
    risk: 'low',
    alerts: 0,
  }));

  const filters = [
    { id: "all", label: "Todos", count: athletes.length },
    { id: "football", label: "Futebol", count: athletes.filter(a => a.sport === "Futebol").length },
    { id: "athletics", label: "Atletismo", count: athletes.filter(a => a.sport === "Atletismo").length },
    { id: "risk", label: "Em Risco", count: athletes.filter(a => a.risk === "high").length },
    { id: "alerts", label: "Com Alertas", count: athletes.filter(a => (a.alerts || 0) > 0).length },
  ];

  const statusConfig = {
    active: { label: "Ativo", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
    inactive: { label: "Inativo", color: "bg-slate-100 text-slate-700", icon: Clock },
    "on-hold": { label: "Suspenso", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
  };

  const riskConfig = {
    high: { label: "Alto", color: "bg-red-100 text-red-700" },
    medium: { label: "Médio", color: "bg-amber-100 text-amber-700" },
    low: { label: "Baixo", color: "bg-emerald-100 text-emerald-700" },
  };

  const handleSelectAll = () => {
    if (selectedAthletes.length === athletes.length) {
      setSelectedAthletes([]);
    } else {
      setSelectedAthletes(athletes.map(a => a.id));
    }
  };

  const handleSelectAthlete = (id: string) => {
    if (selectedAthletes.includes(id)) {
      setSelectedAthletes(selectedAthletes.filter(aid => aid !== id));
    } else {
      setSelectedAthletes([...selectedAthletes, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-semibold text-slate-900 text-sm">Atletas</h1>
            <p className="text-xs text-slate-500 mt-0.5">{athletes.length} atletas registados</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-all"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:from-emerald-400 hover:to-emerald-500 transition-all"
              onClick={onCreateAthlete}
            >
              <Users className="h-4 w-4" />
              <span>Novo Atleta</span>
            </motion.button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Procurar atleta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${selectedFilter === filter.id
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-300'
                }`}
            >
              <span>{filter.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${selectedFilter === filter.id
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600'
                }`}>
                {filter.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedAthletes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedAthletes([])}
                  className="h-8 w-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold">
                  {selectedAthletes.length} selecionado{selectedAthletes.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  onClick={onSendForm}
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Enviar Form</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  onClick={onCreateReport}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Criar Relatório</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Exportar</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Athletes Grid/List - ✅ Day 11: Already responsive 1/12 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Athletes List/Grid */}
          <div className="lg:col-span-12 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedAthletes.length === athletes.length}
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-xs text-slate-500">Selecionar todos</span>
            </div>

            {athletes.map((athlete, index) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onViewProfile(athlete.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedAthletes.includes(athlete.id)
                  ? 'border-sky-500 bg-sky-50/50'
                  : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedAthletes.includes(athlete.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectAthlete(athlete.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />

                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-semibold">
                    {athlete.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-sm">{athlete.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[athlete.status].color}`}>
                        {statusConfig[athlete.status].label}
                      </span>
                      {athlete.risk && athlete.risk !== "low" && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskConfig[athlete.risk].color}`}>
                          Risco: {riskConfig[athlete.risk].label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{athlete.sport} • {athlete.level}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span>Última sessão: {athlete.lastSession}</span>
                      <span>•</span>
                      <span>Presença: {athlete.attendance}%</span>
                      {(athlete.alerts || 0) > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600 font-medium">{athlete.alerts} alerta{athlete.alerts! > 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <button className="shrink-0 h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}