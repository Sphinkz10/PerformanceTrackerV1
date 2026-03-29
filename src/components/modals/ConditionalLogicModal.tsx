import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Zap, GitBranch, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface LogicRule {
  id: string;
  ifField: string;
  condition: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: string;
  thenAction: "show" | "hide" | "require" | "skip";
  targetField: string;
}

interface ConditionalLogicModalProps {
  formFields: any[];
  rules: LogicRule[];
  onSave: (rules: LogicRule[]) => void;
  onClose: () => void;
}

export function ConditionalLogicModal({
  formFields,
  rules: initialRules,
  onSave,
  onClose
}: ConditionalLogicModalProps) {
  const [rules, setRules] = useState<LogicRule[]>(initialRules);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSave();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rules]);

  const conditions = [
    { value: "equals", label: "é igual a" },
    { value: "not_equals", label: "não é igual a" },
    { value: "contains", label: "contém" },
    { value: "greater_than", label: "é maior que" },
    { value: "less_than", label: "é menor que" }
  ];

  const actions = [
    { value: "show", label: "Mostrar campo", icon: Eye },
    { value: "hide", label: "Esconder campo", icon: EyeOff },
    { value: "require", label: "Tornar obrigatório", icon: Zap },
    { value: "skip", label: "Pular para próximo", icon: GitBranch }
  ];

  const addRule = () => {
    const newRule: LogicRule = {
      id: `rule-${Date.now()}`,
      ifField: formFields[0]?.id || "",
      condition: "equals",
      value: "",
      thenAction: "show",
      targetField: formFields[1]?.id || ""
    };
    setRules([...rules, newRule]);
    setSelectedRuleId(newRule.id);
    toast.success("Nova regra adicionada!");
  };

  const updateRule = (id: string, updates: Partial<LogicRule>) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    if (selectedRuleId === id) {
      setSelectedRuleId(null);
    }
    toast.success("Regra removida!");
  };

  const handleSave = () => {
    onSave(rules);
    toast.success(`${rules.length} regra${rules.length !== 1 ? 's' : ''} configurada${rules.length !== 1 ? 's' : ''}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-violet-50 to-white">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Lógica Condicional</h2>
              <p className="text-sm text-slate-600">Configure regras para campos dinâmicos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Lista de Regras */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 text-sm">Regras ({rules.length})</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addRule}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Nova Regra
                </motion.button>
              </div>

              {rules.length === 0 ? (
                <div className="text-center py-10 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
                  <GitBranch className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Nenhuma regra criada</p>
                  <p className="text-xs text-slate-500 mt-1">Clique em "Nova Regra"</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rules.map((rule, index) => {
                    const ifFieldName = formFields.find(f => f.id === rule.ifField)?.label || "Campo";
                    const targetFieldName = formFields.find(f => f.id === rule.targetField)?.label || "Campo";
                    const isSelected = selectedRuleId === rule.id;

                    return (
                      <motion.div
                        key={rule.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-violet-400 bg-violet-50"
                            : "border-slate-200 hover:border-violet-300 bg-white"
                        }`}
                        onClick={() => setSelectedRuleId(rule.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                #{index + 1}
                              </span>
                            </div>
                            <p className="text-xs text-slate-900 font-medium">
                              Se <span className="text-violet-600">{ifFieldName}</span>
                            </p>
                            <p className="text-xs text-slate-600">
                              {conditions.find(c => c.value === rule.condition)?.label} "{rule.value}"
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              Então: <span className="font-medium">{actions.find(a => a.value === rule.thenAction)?.label}</span>
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRule(rule.id);
                            }}
                            className="h-6 w-6 rounded hover:bg-red-50 flex items-center justify-center text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Editor da Regra */}
            <div className="lg:col-span-2">
              {selectedRuleId ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Editar Regra</h3>
                  
                  {(() => {
                    const rule = rules.find(r => r.id === selectedRuleId);
                    if (!rule) return null;

                    return (
                      <div className="space-y-6">
                        {/* Condição IF */}
                        <div className="p-4 bg-violet-50 rounded-xl">
                          <label className="block text-sm font-medium text-violet-900 mb-3">
                            SE (Condição)
                          </label>
                          
                          <div className="space-y-3">
                            {/* Campo de origem */}
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Campo</label>
                              <select
                                className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                value={rule.ifField}
                                onChange={(e) => updateRule(rule.id, { ifField: e.target.value })}
                              >
                                {formFields.map(field => (
                                  <option key={field.id} value={field.id}>
                                    {field.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Operador */}
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Operador</label>
                              <select
                                className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                value={rule.condition}
                                onChange={(e) => updateRule(rule.id, { condition: e.target.value as any })}
                              >
                                {conditions.map(cond => (
                                  <option key={cond.value} value={cond.value}>
                                    {cond.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Valor */}
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Valor</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-violet-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                placeholder="Digite o valor..."
                                value={rule.value}
                                onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Ação THEN */}
                        <div className="p-4 bg-emerald-50 rounded-xl">
                          <label className="block text-sm font-medium text-emerald-900 mb-3">
                            ENTÃO (Ação)
                          </label>
                          
                          <div className="space-y-3">
                            {/* Tipo de ação */}
                            <div>
                              <label className="block text-xs text-slate-700 mb-2">Ação</label>
                              <div className="grid grid-cols-2 gap-2">
                                {actions.map(action => {
                                  const Icon = action.icon;
                                  return (
                                    <button
                                      key={action.value}
                                      type="button"
                                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                                        rule.thenAction === action.value
                                          ? "border-emerald-400 bg-emerald-100"
                                          : "border-emerald-200 bg-white hover:border-emerald-300"
                                      }`}
                                      onClick={() => updateRule(rule.id, { thenAction: action.value as any })}
                                    >
                                      <Icon className="h-4 w-4 text-emerald-700" />
                                      <span className="text-xs font-medium text-slate-900">
                                        {action.label}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Campo alvo */}
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Campo Alvo</label>
                              <select
                                className="w-full px-3 py-2 text-sm border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                value={rule.targetField}
                                onChange={(e) => updateRule(rule.id, { targetField: e.target.value })}
                              >
                                {formFields
                                  .filter(f => f.id !== rule.ifField)
                                  .map(field => (
                                    <option key={field.id} value={field.id}>
                                      {field.label}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Preview da Regra */}
                        <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                          <label className="block text-sm font-medium text-sky-900 mb-2">
                            Preview da Regra
                          </label>
                          <div className="text-sm text-slate-700 leading-relaxed">
                            <p>
                              <span className="font-semibold">Se</span> o campo{" "}
                              <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-700 font-medium">
                                {formFields.find(f => f.id === rule.ifField)?.label}
                              </span>{" "}
                              {conditions.find(c => c.value === rule.condition)?.label}{" "}
                              <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-700 font-medium">
                                "{rule.value}"
                              </span>
                            </p>
                            <p className="mt-2">
                              <span className="font-semibold">Então</span>{" "}
                              {actions.find(a => a.value === rule.thenAction)?.label.toLowerCase()}{" "}
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">
                                {formFields.find(f => f.id === rule.targetField)?.label}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
                  <div className="text-center">
                    <GitBranch className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 font-medium">Selecione uma regra para editar</p>
                    <p className="text-xs text-slate-500 mt-1">ou crie uma nova regra</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm text-slate-700 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium rounded-lg hover:from-violet-400 hover:to-violet-500 transition-all shadow-md"
          >
            Salvar {rules.length} Regra{rules.length !== 1 ? 's' : ''}
          </button>
        </div>
      </motion.div>
    </div>
  );
}