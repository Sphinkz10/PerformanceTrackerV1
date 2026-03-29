import { motion, AnimatePresence } from "motion/react";
import { X, Command, Search, Plus, Calendar, Users, Zap } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: "Navegação",
      items: [
        { keys: ["⌘", "K"], description: "Abrir busca global", icon: Search },
        { keys: ["⌘", "N"], description: "Criar novo item", icon: Plus },
        { keys: ["⌘", "S"], description: "Salvar atual", icon: null },
        { keys: ["ESC"], description: "Fechar modal/voltar", icon: null },
      ]
    },
    {
      category: "Ações Rápidas",
      items: [
        { keys: ["⌘", "⇧", "A"], description: "Criar atleta", icon: Users },
        { keys: ["⌘", "⇧", "S"], description: "Agendar sessão", icon: Calendar },
        { keys: ["⌘", "⇧", "W"], description: "Criar workflow", icon: Zap },
      ]
    },
    {
      category: "Edição",
      items: [
        { keys: ["⌘", "Z"], description: "Desfazer", icon: null },
        { keys: ["⌘", "⇧", "Z"], description: "Refazer", icon: null },
        { keys: ["⌘", "C"], description: "Copiar", icon: null },
        { keys: ["⌘", "V"], description: "Colar", icon: null },
      ]
    },
    {
      category: "Páginas",
      items: [
        { keys: ["G", "H"], description: "Ir para Home", icon: null },
        { keys: ["G", "A"], description: "Ir para Atletas", icon: null },
        { keys: ["G", "C"], description: "Ir para Calendário", icon: null },
        { keys: ["G", "L"], description: "Ir para Lab", icon: null },
      ]
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
                <Command className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Atalhos de Teclado</h2>
                <p className="text-sm text-slate-600">Trabalhe mais rápido com atalhos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shortcuts.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">{section.category}</h3>
                  <div className="space-y-2">
                    {section.items.map((shortcut, sIdx) => {
                      const Icon = shortcut.icon;
                      return (
                        <div key={sIdx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4 text-slate-600" />}
                            <span className="text-sm text-slate-700">{shortcut.description}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, kIdx) => (
                              <span
                                key={kIdx}
                                className="px-2 py-1 text-xs font-medium bg-white border border-slate-200 rounded shadow-sm"
                              >
                                {key}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-center text-slate-600">
              Pressione <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-medium">?</kbd> a qualquer momento para ver esta janela
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
