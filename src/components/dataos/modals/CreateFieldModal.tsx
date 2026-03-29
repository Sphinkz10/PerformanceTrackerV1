import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Hash, Clock, Type, List, ToggleLeft, Star, Calendar, Activity, Heart, Zap } from 'lucide-react';
import { useDataOS, DataField, FieldType } from '../context/DataOSContext';
import { toast } from 'sonner@2.0.3';

interface CreateFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

const fieldTypes: { value: FieldType; label: string; icon: any; description: string }[] = [
  { value: 'number', label: 'Número', icon: Hash, description: 'Weight, reps, distance' },
  { value: 'time', label: 'Tempo', icon: Clock, description: 'Duration, intervals' },
  { value: 'text', label: 'Texto', icon: Type, description: 'Notes, comments' },
  { value: 'select', label: 'Seleção', icon: List, description: 'Single choice' },
  { value: 'boolean', label: 'Sim/Não', icon: ToggleLeft, description: 'True/false' },
  { value: 'rating', label: 'Rating', icon: Star, description: '1-5 stars' },
  { value: 'date', label: 'Data', icon: Calendar, description: 'Session date' },
  { value: 'rpe', label: 'RPE', icon: Activity, description: 'Rate of effort' },
  { value: 'heartrate', label: 'Heart Rate', icon: Heart, description: 'BPM tracking' },
  { value: 'velocity', label: 'Velocidade', icon: Zap, description: 'Bar velocity (m/s)' }
];

export function CreateFieldModal({ isOpen, onClose, position }: CreateFieldModalProps) {
  const { addField } = useDataOS();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'number' as FieldType,
    description: '',
    required: false,
    category: '',
    unit: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Nome do campo é obrigatório');
      return;
    }

    const newField: DataField = {
      id: `field_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      config: {},
      isCalculated: false,
      required: formData.required,
      category: formData.category || undefined,
      unit: formData.unit || undefined,
      order: 0,
      position: position || { x: 100, y: 100 },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addField(newField);
    onClose();
    setFormData({
      name: '',
      type: 'number',
      description: '',
      required: false,
      category: '',
      unit: ''
    });
    setStep(1);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[85vh] overflow-hidden flex flex-col mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Criar Novo Campo</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Passo {step} de 2
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Type Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Escolha o tipo de campo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fieldTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setFormData({ ...formData, type: type.value })}
                        className={`
                          p-4 rounded-xl border-2 transition-all text-left
                          ${formData.type === type.value
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-slate-200 hover:border-sky-300 bg-white'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            p-2 rounded-lg
                            ${formData.type === type.value ? 'bg-sky-100' : 'bg-slate-100'}
                          `}>
                            <Icon className={`w-5 h-5 ${formData.type === type.value ? 'text-sky-600' : 'text-slate-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm mb-1">
                              {type.label}
                            </p>
                            <p className="text-xs text-slate-500">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Field Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do Campo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Weight, Reps, Duration"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva para que serve este campo..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="ex: Core, Strength"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unidade
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="ex: kg, m/s, bpm"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-900">Campo Obrigatório</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deve ser preenchido em todas as sessões
                  </p>
                </div>
                <button
                  onClick={() => setFormData({ ...formData, required: !formData.required })}
                  className={`
                    relative w-12 h-6 rounded-full transition-colors
                    ${formData.required ? 'bg-sky-600' : 'bg-slate-200'}
                  `}
                >
                  <span className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                    ${formData.required ? 'translate-x-6' : 'translate-x-0.5'}
                  `} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Próximo →
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ← Voltar
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  Criar Campo
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
