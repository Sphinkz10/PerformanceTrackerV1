import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface FieldConfig {
  label: string;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: string | null;
  options?: string[];
  ratingScale?: number;
  minValue?: number;
  maxValue?: number;
  maxLength?: number;
  allowedFileTypes?: string[];
  maxFileSize?: number;
}

interface FormField {
  id: string;
  type: string;
  name: string;
  label: string;
  icon: any;
  order?: number;
  category?: string;
}

interface FieldQuickConfigModalProps {
  field: FormField;
  initialConfig?: Partial<FieldConfig>;
  onSave: (config: FieldConfig) => void;
  onClose: () => void;
}

const OPTION_PRESETS = [
  {
    label: "Sim / Não",
    options: ["Sim", "Não"]
  },
  {
    label: "Concordância (5 níveis)",
    options: ["Concordo plenamente", "Concordo", "Neutro", "Discordo", "Discordo plenamente"]
  },
  {
    label: "Satisfação (5 níveis)",
    options: ["Muito Satisfeito", "Satisfeito", "Neutro", "Insatisfeito", "Muito Insatisfeito"]
  },
  {
    label: "Qualidade",
    options: ["Excelente", "Muito Bom", "Bom", "Regular", "Fraco"]
  },
  {
    label: "Frequência",
    options: ["Sempre", "Frequentemente", "Às vezes", "Raramente", "Nunca"]
  }
];

export function FieldQuickConfigModal({
  field,
  initialConfig = {},
  onSave,
  onClose
}: FieldQuickConfigModalProps) {
  const [config, setConfig] = useState<FieldConfig>({
    label: initialConfig?.label || `${field.name} ${field.order || 1}`,
    required: initialConfig?.required || false,
    placeholder: initialConfig?.placeholder || "",
    helpText: initialConfig?.helpText || "",
    validation: initialConfig?.validation || null,
    options: initialConfig?.options || ["Opção 1", "Opção 2"],
    ratingScale: initialConfig?.ratingScale || 5,
    minValue: initialConfig?.minValue,
    maxValue: initialConfig?.maxValue,
    maxLength: initialConfig?.maxLength,
    allowedFileTypes: initialConfig?.allowedFileTypes || ["PDF", "JPG", "PNG"],
    maxFileSize: initialConfig?.maxFileSize || 5
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [config]);

  // Auto-focus label input
  useEffect(() => {
    setTimeout(() => {
      const labelInput = document.getElementById("field-label-input");
      labelInput?.focus();
      labelInput?.select();
    }, 100);
  }, []);

  const handleSave = () => {
    if (!config.label.trim()) {
      toast.error("O label do campo é obrigatório!");
      return;
    }

    if (supportsOptions() && config.options!.length === 0) {
      toast.error("Adicione pelo menos uma opção!");
      return;
    }

    onSave(config);
    toast.success(`Campo "${config.label}" configurado!`);
  };

  const supportsPlaceholder = () => {
    return ["text", "number", "email", "phone"].includes(field.type);
  };

  const supportsValidation = () => {
    return ["text", "number", "email", "phone"].includes(field.type);
  };

  const supportsOptions = () => {
    return ["radio", "checkbox"].includes(field.type);
  };

  const applyPreset = (preset: typeof OPTION_PRESETS[0]) => {
    setConfig({ ...config, options: preset.options });
    setShowPresets(false);
    toast.success(`Preset "${preset.label}" aplicado!`);
  };

  const addOption = () => {
    const newOption = `Opção ${config.options!.length + 1}`;
    setConfig({ ...config, options: [...config.options!, newOption] });
  };

  const removeOption = (index: number) => {
    setConfig({
      ...config,
      options: config.options!.filter((_, i) => i !== index)
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...config.options!];
    newOptions[index] = value;
    setConfig({ ...config, options: newOptions });
  };

  const Icon = field.icon;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-sky-50 to-white">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-md">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  Configurar Campo
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-600">{field.name}</span>
                  {field.category && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                      {field.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-lg">
                <kbd className="px-1.5 py-0.5 text-xs font-mono bg-white rounded border border-slate-300">⌘</kbd>
                <kbd className="px-1.5 py-0.5 text-xs font-mono bg-white rounded border border-slate-300">Enter</kbd>
                <span className="text-xs text-slate-600 ml-1">para salvar</span>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* COLUNA ESQUERDA: Configurações Básicas */}
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <h3 className="font-semibold text-slate-900">Configurações Básicas</h3>
                </div>

                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Label do Campo *
                  </label>
                  <input
                    id="field-label-input"
                    type="text"
                    maxLength={100}
                    className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all"
                    placeholder="Ex: Nome Completo"
                    value={config.label}
                    onChange={(e) => setConfig({ ...config, label: e.target.value })}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {config.label.length}/100 caracteres
                  </p>
                </div>

                {/* Required Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <div>
                      <label className="font-medium text-slate-900 text-sm">
                        Campo Obrigatório
                      </label>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Usuário deve preencher para enviar
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={config.required}
                      onChange={(e) => setConfig({ ...config, required: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                  </label>
                </div>

                {/* Placeholder */}
                {supportsPlaceholder() && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all"
                      placeholder="Texto de exemplo..."
                      value={config.placeholder}
                      onChange={(e) => setConfig({ ...config, placeholder: e.target.value })}
                    />
                  </div>
                )}

                {/* Help Text */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
                    Texto de Ajuda
                    <Info className="h-3 w-3 text-slate-400" />
                  </label>
                  <textarea
                    className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all resize-none"
                    rows={3}
                    placeholder="Instruções ou dicas para o usuário..."
                    value={config.helpText}
                    onChange={(e) => setConfig({ ...config, helpText: e.target.value })}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Aparecerá abaixo do campo no formulário
                  </p>
                </div>

                {/* Validação */}
                {supportsValidation() && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Validação
                    </label>
                    {field.type === "text" && (
                      <div className="grid grid-cols-2 gap-2">
                        {["Nenhuma", "Email", "URL", "Telefone"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                              (type === "Nenhuma" && !config.validation) ||
                              config.validation === type.toLowerCase()
                                ? "bg-sky-100 text-sky-700 border-sky-300"
                                : "bg-white text-slate-700 border-slate-200 hover:border-sky-200"
                            }`}
                            onClick={() =>
                              setConfig({
                                ...config,
                                validation: type === "Nenhuma" ? null : type.toLowerCase()
                              })
                            }
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}

                    {field.type === "number" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Mínimo</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                            placeholder="Ex: 0"
                            value={config.minValue || ""}
                            onChange={(e) =>
                              setConfig({ ...config, minValue: e.target.value ? parseInt(e.target.value) : undefined })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Máximo</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                            placeholder="Ex: 100"
                            value={config.maxValue || ""}
                            onChange={(e) =>
                              setConfig({ ...config, maxValue: e.target.value ? parseInt(e.target.value) : undefined })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Character Limit (text fields) */}
                {field.type === "text" && (
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span className="font-medium text-slate-900 text-sm">
                        Configurações Avançadas
                      </span>
                    </div>
                    {showAdvanced ? (
                      <ChevronUp className="h-4 w-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    )}
                  </button>
                )}

                {showAdvanced && field.type === "text" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Limite de Caracteres
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Ex: 500"
                        value={config.maxLength || ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            maxLength: e.target.value ? parseInt(e.target.value) : undefined
                          })
                        }
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* COLUNA DIREITA: Config Específica + Preview */}
              <div className="space-y-5">
                
                {/* Opções (Radio/Checkbox) */}
                {supportsOptions() && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900 text-sm">Opções</h3>
                      <button
                        type="button"
                        className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                        onClick={() => setShowPresets(!showPresets)}
                      >
                        <Sparkles className="h-3 w-3" />
                        Quick Presets
                      </button>
                    </div>

                    {/* Presets */}
                    <AnimatePresence>
                      {showPresets && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-4 p-3 bg-sky-50 rounded-xl space-y-2 border border-sky-200"
                        >
                          <p className="text-xs text-sky-700 font-medium mb-2">
                            Usar preset:
                          </p>
                          {OPTION_PRESETS.map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              className="w-full text-left px-3 py-2 text-sm bg-white rounded-lg hover:bg-sky-100 transition-colors border border-sky-200 hover:border-sky-300"
                              onClick={() => applyPreset(preset)}
                            >
                              {preset.label}
                              <span className="text-xs text-slate-500 ml-2">
                                ({preset.options.length} opções)
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Lista de Opções */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {config.options!.map((option, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-2"
                        >
                          <div className="flex items-center justify-center w-8 h-10 text-xs text-slate-500 font-medium">
                            {index + 1}
                          </div>
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Opção ${index + 1}`}
                          />
                          <button
                            type="button"
                            className="h-10 w-10 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-600 transition-colors"
                            onClick={() => removeOption(index)}
                            disabled={config.options!.length <= 1}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                      <button
                        type="button"
                        className="w-full px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-all"
                        onClick={addOption}
                      >
                        + Adicionar Opção
                      </button>
                    </div>
                  </div>
                )}

                {/* Rating Config */}
                {field.type === "rating" && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm">Tipo de Escala</h3>
                    <div className="space-y-2">
                      {[
                        { label: "5 Estrelas", value: 5, emoji: "⭐" },
                        { label: "10 Pontos", value: 10, emoji: "🔟" },
                        { label: "NPS (0-10)", value: 11, emoji: "📊" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                            config.ratingScale === option.value
                              ? "bg-sky-50 border-sky-300 text-sky-900"
                              : "bg-white border-slate-200 hover:border-sky-200"
                          }`}
                          onClick={() => setConfig({ ...config, ratingScale: option.value })}
                        >
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="font-medium text-sm">{option.label}</span>
                          {config.ratingScale === option.value && (
                            <Check className="h-4 w-4 text-sky-600 ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Config */}
                {field.type === "upload" && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 text-sm">
                      Configurações de Upload
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Tipos Permitidos
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {["PDF", "JPG", "PNG", "DOC", "XLS", "ZIP"].map((type) => (
                            <label
                              key={type}
                              className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="rounded text-sky-500 focus:ring-sky-500"
                                checked={config.allowedFileTypes!.includes(type)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setConfig({
                                      ...config,
                                      allowedFileTypes: [...config.allowedFileTypes!, type]
                                    });
                                  } else {
                                    setConfig({
                                      ...config,
                                      allowedFileTypes: config.allowedFileTypes!.filter((t) => t !== type)
                                    });
                                  }
                                }}
                              />
                              <span className="text-sm font-medium">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Tamanho Máximo
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="w-24 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                            placeholder="5"
                            min="1"
                            value={config.maxFileSize}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                maxFileSize: parseInt(e.target.value) || 5
                              })
                            }
                          />
                          <select className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30">
                            <option>MB</option>
                            <option>KB</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PREVIEW */}
                <div className="rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/50 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-4 w-4 text-sky-600" />
                    <h4 className="font-medium text-sky-900 text-sm">Preview do Campo</h4>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-sky-200">
                    <label className="block text-sm font-medium text-slate-900 mb-2">
                      {config.label || "Label do Campo"}
                      {config.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {/* Preview baseado no tipo */}
                    {field.type === "text" && (
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                        placeholder={config.placeholder || "Digite aqui..."}
                        disabled
                      />
                    )}

                    {field.type === "number" && (
                      <input
                        type="number"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                        placeholder={config.placeholder || "0"}
                        disabled
                      />
                    )}

                    {field.type === "email" && (
                      <input
                        type="email"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                        placeholder={config.placeholder || "email@exemplo.com"}
                        disabled
                      />
                    )}

                    {field.type === "radio" && (
                      <div className="space-y-2">
                        {config.options!.slice(0, 3).map((option, i) => (
                          <label key={i} className="flex items-center gap-2">
                            <input type="radio" name="preview" disabled />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                        {config.options!.length > 3 && (
                          <span className="text-xs text-slate-500 block mt-2">
                            +{config.options!.length - 3} opções
                          </span>
                        )}
                      </div>
                    )}

                    {field.type === "checkbox" && (
                      <div className="space-y-2">
                        {config.options!.slice(0, 3).map((option, i) => (
                          <label key={i} className="flex items-center gap-2">
                            <input type="checkbox" disabled />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                        {config.options!.length > 3 && (
                          <span className="text-xs text-slate-500 block mt-2">
                            +{config.options!.length - 3} opções
                          </span>
                        )}
                      </div>
                    )}

                    {field.type === "rating" && (
                      <div className="flex gap-1">
                        {Array.from({ length: config.ratingScale! }).map((_, i) => (
                          <span key={i} className="text-2xl">⭐</span>
                        ))}
                      </div>
                    )}

                    {field.type === "date" && (
                      <input
                        type="date"
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                        disabled
                      />
                    )}

                    {config.helpText && (
                      <p className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                        <Info className="h-3 w-3 mt-0.5 shrink-0" />
                        {config.helpText}
                      </p>
                    )}

                    {config.maxLength && field.type === "text" && (
                      <p className="text-xs text-slate-400 mt-2">
                        Máximo {config.maxLength} caracteres
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              className="px-6 py-2 text-sm text-slate-700 font-medium hover:bg-slate-200 rounded-lg transition-colors"
              onClick={onClose}
            >
              Cancelar
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                className="px-6 py-2 text-sm border-2 border-sky-200 bg-sky-50 text-sky-700 font-medium rounded-lg hover:bg-sky-100 transition-colors"
                onClick={() => {
                  handleSave();
                  // Mantém modal aberto para continuar editando
                }}
              >
                Aplicar e Continuar
              </button>
              <button
                type="button"
                className="px-6 py-2 text-sm bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium rounded-lg hover:from-sky-400 hover:to-sky-500 transition-all shadow-md"
                onClick={handleSave}
              >
                Aplicar Configuração
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}