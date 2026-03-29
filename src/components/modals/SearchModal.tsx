import { useState, useEffect } from "react";
import { Search, Users, Calendar, Dumbbell, FileText, BarChart3, TrendingUp, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const quickActions = [
    { id: "athlete", icon: Users, label: "Criar Atleta", shortcut: "A" },
    { id: "session", icon: Calendar, label: "Agendar Sessão", shortcut: "S" },
    { id: "template", icon: Dumbbell, label: "Criar Template", shortcut: "T" },
    { id: "form", icon: FileText, label: "Enviar Form", shortcut: "F" },
    { id: "report", icon: BarChart3, label: "Criar Relatório", shortcut: "R" },
  ];

  const recentSearches = [
    { id: 1, type: "athlete", name: "João Silva", meta: "Futebol • Sénior" },
    { id: 2, type: "session", name: "Treino de Força", meta: "Hoje às 18:00" },
    { id: 3, type: "athlete", name: "Maria Santos", meta: "Atletismo • Sub-20" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Procurar atletas, treinos, métricas..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {!query && (
                  <>
                    {/* Quick Actions */}
                    <div className="p-4">
                      <p className="text-xs font-medium text-slate-500 mb-3">Ações Rápidas</p>
                      <div className="space-y-1">
                        {quickActions.map((action) => (
                          <motion.button
                            key={action.id}
                            whileHover={{ x: 4 }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <action.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="flex-1 text-left text-sm font-medium text-slate-700">
                              {action.label}
                            </span>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              {action.shortcut}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Recent */}
                    <div className="p-4 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <p className="text-xs font-medium text-slate-500">Recentes</p>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((item) => (
                          <motion.button
                            key={item.id}
                            whileHover={{ x: 4 }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
                          >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
                              {item.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900">{item.name}</p>
                              <p className="text-xs text-slate-500 truncate">{item.meta}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {query && (
                  <div className="p-4">
                    <p className="text-sm text-slate-500 text-center py-8">
                      A procurar por "{query}"...
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">↓</kbd>
                    <span>navegar</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">↵</kbd>
                    <span>selecionar</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded">esc</kbd>
                  <span>fechar</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
