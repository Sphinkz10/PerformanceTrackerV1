/**
 * WIZARD STEP 1: SOURCE PICKER
 * Where do the data come from?
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  ClipboardList, 
  Target, 
  LineChart, 
  Smartphone, 
  PencilLine,
  Search,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import type { MetricSourceType, AnyMetricSource, ExerciseSource, FormSource, ManualSource, ExistingMetricSource } from '@/types/wizard';

interface Step1SourcePickerProps {
  selectedSource: AnyMetricSource | null;
  onSourceSelect: (source: AnyMetricSource) => void;
  onNext: () => void;
  onCancel: () => void;
}

const SOURCE_TYPES = [
  {
    type: 'exercise' as MetricSourceType,
    icon: Dumbbell,
    title: 'Exercício Específico',
    description: 'Dados de um exercício durante treino',
    examples: 'Ex: Squat, Bench Press, Plank...',
    color: 'red',
    gradient: 'from-red-500 to-red-600',
  },
  {
    type: 'form' as MetricSourceType,
    icon: ClipboardList,
    title: 'Formulário/Questionário',
    description: 'Dados de wellness checks, surveys',
    examples: 'Ex: Morning Check, Recovery Form...',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    type: 'session' as MetricSourceType,
    icon: Target,
    title: 'Sessão Completa',
    description: 'Todos os dados daquela sessão',
    examples: 'Ex: Duração, RPE, exercícios...',
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    type: 'existing-metric' as MetricSourceType,
    icon: LineChart,
    title: 'Métrica Existente',
    description: 'Reutilizar/transformar métrica atual',
    examples: 'Ex: Calcular com HRV, Sleep...',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    type: 'external' as MetricSourceType,
    icon: Smartphone,
    title: 'Dados Externos',
    description: 'Integração com apps/devices',
    examples: 'Ex: Apple Health, Garmin, Whoop...',
    color: 'amber',
    gradient: 'from-amber-500 to-amber-600',
  },
  {
    type: 'manual' as MetricSourceType,
    icon: PencilLine,
    title: 'Métrica Manual',
    description: 'Inserir valores manualmente',
    examples: 'Ex: Peso, % Gordura, Notas...',
    color: 'sky',
    gradient: 'from-sky-500 to-sky-600',
  },
];

export function Step1SourcePicker({ selectedSource, onSourceSelect, onNext, onCancel }: Step1SourcePickerProps) {
  const [selectedType, setSelectedType] = useState<MetricSourceType | null>(
    selectedSource?.type || null
  );
  const [showDetailedPicker, setShowDetailedPicker] = useState(false);

  const handleTypeSelect = (type: MetricSourceType) => {
    setSelectedType(type);
    setShowDetailedPicker(true);
  };

  const handleBack = () => {
    setShowDetailedPicker(false);
    setSelectedType(null);
  };

  const canProceed = selectedSource !== null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900">
              Criar Nova Métrica
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Step 1 de 4: De onde vêm os dados?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancelar
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full ${
                step === 1 ? 'bg-sky-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {!showDetailedPicker ? (
            <motion.div
              key="source-type-grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-slate-900 mb-2">
                  Escolhe a fonte dos dados:
                </h3>
                <p className="text-sm text-slate-600">
                  Seleciona de onde virão os dados para esta métrica
                </p>
              </div>

              {/* AI Suggestion */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-purple-900 mb-1">
                      AI Suggestion
                    </h4>
                    <p className="text-xs text-purple-700">
                      A maioria dos utilizadores começa com <strong>Exercício Específico</strong> ou <strong>Formulário</strong>. 
                      Estas opções são ideais para tracking de performance e wellness.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Source Type Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {SOURCE_TYPES.map((sourceType, index) => {
                  const Icon = sourceType.icon;
                  return (
                    <motion.button
                      key={sourceType.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTypeSelect(sourceType.type)}
                      className="group relative p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-sky-300 hover:shadow-xl transition-all text-left"
                    >
                      {/* Icon */}
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${sourceType.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      {/* Content */}
                      <h4 className="text-slate-900 mb-2 flex items-center justify-between">
                        {sourceType.title}
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-sky-500 transition-colors" />
                      </h4>
                      <p className="text-sm text-slate-600 mb-2">
                        {sourceType.description}
                      </p>
                      <p className="text-xs text-slate-500">
                        {sourceType.examples}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detailed-picker"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <DetailedSourcePicker
                sourceType={selectedType!}
                currentSource={selectedSource}
                onSourceSelect={onSourceSelect}
                onBack={handleBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {selectedSource ? (
              <span className="flex items-center gap-2 text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Fonte selecionada: <strong>{selectedSource.name}</strong>
              </span>
            ) : (
              <span>Seleciona uma fonte para continuar</span>
            )}
          </div>

          <motion.button
            whileHover={canProceed ? { scale: 1.05 } : {}}
            whileTap={canProceed ? { scale: 0.95 } : {}}
            onClick={onNext}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-6 py-3 text-sm rounded-xl transition-all ${
              canProceed
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 hover:from-sky-400 hover:to-sky-500'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAILED SOURCE PICKERS (Sub-components)
// ============================================================

interface DetailedSourcePickerProps {
  sourceType: MetricSourceType;
  currentSource: AnyMetricSource | null;
  onSourceSelect: (source: AnyMetricSource) => void;
  onBack: () => void;
}

function DetailedSourcePicker({ sourceType, currentSource, onSourceSelect, onBack }: DetailedSourcePickerProps) {
  switch (sourceType) {
    case 'exercise':
      return <ExerciseSourcePicker currentSource={currentSource as ExerciseSource} onSourceSelect={onSourceSelect} onBack={onBack} />;
    case 'form':
      return <FormSourcePicker currentSource={currentSource as FormSource} onSourceSelect={onSourceSelect} onBack={onBack} />;
    case 'manual':
      return <ManualSourcePicker currentSource={currentSource as ManualSource} onSourceSelect={onSourceSelect} onBack={onBack} />;
    case 'existing-metric':
      return <ExistingMetricSourcePicker currentSource={currentSource as ExistingMetricSource} onSourceSelect={onSourceSelect} onBack={onBack} />;
    default:
      return (
        <div className="text-center py-12">
          <p className="text-slate-600">
            Detailed picker for {sourceType} coming soon...
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="mt-4 px-4 py-2 text-sm text-sky-600 hover:text-sky-700"
          >
            ← Voltar
          </motion.button>
        </div>
      );
  }
}

// ============================================================
// EXERCISE SOURCE PICKER
// ============================================================

const MOCK_EXERCISES = [
  { id: 'squat', name: 'Squat', category: 'Força' },
  { id: 'bench', name: 'Bench Press', category: 'Força' },
  { id: 'deadlift', name: 'Deadlift', category: 'Força' },
  { id: 'pullup', name: 'Pull-up', category: 'Força' },
  { id: 'plank', name: 'Plank', category: 'Core' },
  { id: 'sprint', name: '100m Sprint', category: 'Velocidade' },
];

const EXERCISE_DATA_FIELDS = [
  { value: 'max-load', label: 'Carga máxima (1RM)', unit: 'kg' },
  { value: 'volume', label: 'Volume total (sets × reps × kg)', unit: 'kg' },
  { value: 'reps', label: 'Número de repetições', unit: 'reps' },
  { value: 'rpe', label: 'RPE médio do exercício', unit: '1-10' },
  { value: 'technique', label: 'Técnica (score 1-5)', unit: '1-5' },
  { value: 'time-under-tension', label: 'Tempo sob tensão', unit: 'seconds' },
  { value: 'velocity', label: 'Velocidade média (m/s)', unit: 'm/s' },
  { value: 'custom', label: 'Custom field...', unit: '' },
];

interface ExerciseSourcePickerProps {
  currentSource: ExerciseSource | null;
  onSourceSelect: (source: AnyMetricSource) => void;
  onBack: () => void;
}

function ExerciseSourcePicker({ currentSource, onSourceSelect, onBack }: ExerciseSourcePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(currentSource?.exerciseId || '');
  const [selectedDataField, setSelectedDataField] = useState(currentSource?.dataField || '');
  const [customField, setCustomField] = useState(currentSource?.customField || '');

  const filteredExercises = MOCK_EXERCISES.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = () => {
    if (!selectedExercise || !selectedDataField) return;

    const exercise = MOCK_EXERCISES.find(ex => ex.id === selectedExercise)!;
    const dataField = EXERCISE_DATA_FIELDS.find(df => df.value === selectedDataField)!;

    const source: ExerciseSource = {
      type: 'exercise',
      id: `exercise-${selectedExercise}-${selectedDataField}`,
      name: `${exercise.name} - ${dataField.label}`,
      description: `Tracking ${dataField.label.toLowerCase()} from ${exercise.name}`,
      icon: '🏋️',
      exerciseId: selectedExercise,
      exerciseName: exercise.name,
      dataField: selectedDataField as any,
      customField: selectedDataField === 'custom' ? customField : undefined,
    };

    onSourceSelect(source);
  };

  const canApply = selectedExercise && selectedDataField && (selectedDataField !== 'custom' || customField);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header - NUNCA ESCONDE */}
      <div className="flex-shrink-0 space-y-4 pb-4 border-b border-slate-200 mb-4">
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -4 }}
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Voltar para tipos de fonte
        </motion.button>

        {/* Title */}
        <div>
          <h3 className="text-slate-900 flex items-center gap-2 mb-2">
            <Dumbbell className="h-5 w-5" />
            Escolhe o exercício
          </h3>
          <p className="text-sm text-slate-600">
            Seleciona o exercício e que dado queres tracking
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Procurar exercício..."
            className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
        {/* Exercise List */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 px-1">Exercícios disponíveis:</p>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
            {filteredExercises.map((exercise) => (
              <motion.button
                key={exercise.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedExercise(exercise.id)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  selectedExercise === exercise.id
                    ? 'bg-sky-50 border-2 border-sky-300'
                    : 'bg-white border border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-900">{exercise.name}</p>
                    <p className="text-xs text-slate-500">{exercise.category}</p>
                  </div>
                  {selectedExercise === exercise.id && (
                    <div className="h-5 w-5 rounded-full bg-sky-500 flex items-center justify-center">
                      <ChevronRight className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Data Field Selection */}
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
          >
            <h4 className="text-sm text-emerald-900 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Que dado deste exercício?
            </h4>
            <div className="space-y-2">
              {EXERCISE_DATA_FIELDS.map((field) => (
                <label
                  key={field.value}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedDataField === field.value
                      ? 'bg-emerald-100 border border-emerald-300'
                      : 'bg-white border border-slate-200 hover:border-emerald-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="dataField"
                    value={field.value}
                    checked={selectedDataField === field.value}
                    onChange={(e) => setSelectedDataField(e.target.value)}
                    className="h-4 w-4 text-emerald-600"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{field.label}</p>
                    {field.unit && (
                      <p className="text-xs text-slate-500">Unidade: {field.unit}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {/* Custom Field Input */}
            {selectedDataField === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3"
              >
                <input
                  type="text"
                  value={customField}
                  onChange={(e) => setCustomField(e.target.value)}
                  placeholder="Nome do campo custom..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Preview */}
        {canApply && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-white border border-sky-200"
          >
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm text-sky-900 mb-1">Preview da métrica:</h4>
                <p className="text-xs text-sky-700">
                  Esta métrica irá tracking <strong>{EXERCISE_DATA_FIELDS.find(f => f.value === selectedDataField)?.label}</strong> do exercício <strong>{MOCK_EXERCISES.find(ex => ex.id === selectedExercise)?.name}</strong>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Apply Button - SEMPRE VISÍVEL */}
      <div className="flex-shrink-0 pt-4 mt-4 border-t border-slate-200">
        <motion.button
          whileHover={canApply ? { scale: 1.02 } : {}}
          whileTap={canApply ? { scale: 0.98 } : {}}
          onClick={handleApply}
          disabled={!canApply}
          className={`w-full py-3 text-sm rounded-xl transition-all min-h-[48px] ${
            canApply
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:from-emerald-400 hover:to-emerald-500'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          ✓ Selecionar esta fonte
        </motion.button>
      </div>
    </div>
  );
}

// ============================================================
// FORM SOURCE PICKER (Simplified for now)
// ============================================================

const MOCK_FORMS = [
  { 
    id: 'morning-check', 
    name: 'Morning Wellness Check',
    fields: [
      { id: 'sleep-quality', name: 'Qualidade de sono (1-10)', type: 'scale' },
      { id: 'sleep-hours', name: 'Horas de sono', type: 'duration' },
      { id: 'stress', name: 'Nível de stress (1-10)', type: 'scale' },
      { id: 'muscle-soreness', name: 'Dor muscular (1-10)', type: 'scale' },
      { id: 'mood', name: 'Humor', type: 'emoji-scale' },
      { id: 'energy', name: 'Energia (1-10)', type: 'scale' },
    ]
  },
  { 
    id: 'recovery-form', 
    name: 'Recovery Assessment',
    fields: [
      { id: 'hrv', name: 'HRV', type: 'number' },
      { id: 'rhr', name: 'RHR (Repouso)', type: 'number' },
      { id: 'readiness', name: 'Readiness Score', type: 'scale' },
    ]
  },
];

interface FormSourcePickerProps {
  currentSource: FormSource | null;
  onSourceSelect: (source: AnyMetricSource) => void;
  onBack: () => void;
}

function FormSourcePicker({ currentSource, onSourceSelect, onBack }: FormSourcePickerProps) {
  const [selectedForm, setSelectedForm] = useState(currentSource?.formId || '');
  const [selectedField, setSelectedField] = useState(currentSource?.fieldId || '');

  const form = MOCK_FORMS.find(f => f.id === selectedForm);
  const field = form?.fields.find(f => f.id === selectedField);

  const handleApply = () => {
    if (!form || !field) return;

    const source: FormSource = {
      type: 'form',
      id: `form-${selectedForm}-${selectedField}`,
      name: `${form.name} - ${field.name}`,
      description: `Tracking ${field.name} from ${form.name}`,
      icon: '📋',
      formId: selectedForm,
      formName: form.name,
      fieldId: selectedField,
      fieldName: field.name,
      fieldType: field.type,
    };

    onSourceSelect(source);
  };

  const canApply = selectedForm && selectedField;

  return (
    <div className="space-y-6">
      <motion.button
        whileHover={{ x: -4 }}
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Voltar
      </motion.button>

      <div>
        <h3 className="text-slate-900 flex items-center gap-2 mb-2">
          <ClipboardList className="h-5 w-5" />
          Escolhe o formulário
        </h3>
      </div>

      {/* Forms List */}
      <div className="space-y-2">
        {MOCK_FORMS.map((form) => (
          <motion.button
            key={form.id}
            whileHover={{ x: 4 }}
            onClick={() => {
              setSelectedForm(form.id);
              setSelectedField('');
            }}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              selectedForm === form.id
                ? 'bg-blue-50 border-2 border-blue-300'
                : 'bg-white border border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="text-sm text-slate-900 mb-1">{form.name}</p>
            <p className="text-xs text-slate-500">{form.fields.length} campos disponíveis</p>
          </motion.button>
        ))}
      </div>

      {/* Field Selection */}
      {selectedForm && form && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white"
        >
          <h4 className="text-sm text-blue-900 mb-3">Que pergunta?</h4>
          <div className="space-y-2">
            {form.fields.map((field) => (
              <label
                key={field.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedField === field.id
                    ? 'bg-blue-100 border border-blue-300'
                    : 'bg-white border border-slate-200 hover:border-blue-200'
                }`}
              >
                <input
                  type="radio"
                  name="field"
                  value={field.id}
                  checked={selectedField === field.id}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{field.name}</p>
                  <p className="text-xs text-slate-500">Tipo: {field.type}</p>
                </div>
              </label>
            ))}
          </div>
        </motion.div>
      )}

      {/* Apply Button */}
      {canApply && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          className="w-full py-3 text-sm rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-400 hover:to-blue-500"
        >
          ✓ Selecionar esta fonte
        </motion.button>
      )}
    </div>
  );
}

// ============================================================
// MANUAL SOURCE PICKER
// ============================================================

interface ManualSourcePickerProps {
  currentSource: ManualSource | null;
  onSourceSelect: (source: AnyMetricSource) => void;
  onBack: () => void;
}

function ManualSourcePicker({ currentSource, onSourceSelect, onBack }: ManualSourcePickerProps) {
  const [metricName, setMetricName] = useState(currentSource?.name || '');
  const [metricType, setMetricType] = useState<any>(currentSource?.metricType || 'scale');
  const [unit, setUnit] = useState(currentSource?.unit || '');
  const [minValue, setMinValue] = useState(currentSource?.minValue?.toString() || '');
  const [maxValue, setMaxValue] = useState(currentSource?.maxValue?.toString() || '');
  const [category, setCategory] = useState<any>(currentSource?.category || 'wellness');

  const handleApply = () => {
    if (!metricName) return;

    const source: ManualSource = {
      type: 'manual',
      id: `manual-${metricName.toLowerCase().replace(/\s/g, '-')}`,
      name: metricName,
      description: `Manually tracked metric: ${metricName}`,
      icon: '✏️',
      metricType,
      unit: unit || undefined,
      minValue: minValue ? parseFloat(minValue) : undefined,
      maxValue: maxValue ? parseFloat(maxValue) : undefined,
      category,
    };

    onSourceSelect(source);
  };

  const canApply = metricName.trim().length > 0;

  return (
    <div className="space-y-6">
      <motion.button
        whileHover={{ x: -4 }}
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Voltar
      </motion.button>

      <div>
        <h3 className="text-slate-900 flex items-center gap-2 mb-2">
          <PencilLine className="h-5 w-5" />
          Configurar métrica manual
        </h3>
      </div>

      <div className="space-y-4">
        {/* Metric Name */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Nome da métrica: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
            placeholder="Ex: Peso Corporal"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

        {/* Metric Type */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Tipo de valor:
          </label>
          <select
            value={metricType}
            onChange={(e) => setMetricType(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            <option value="scale">Escala (ex: 1-10)</option>
            <option value="count">Número (ex: 75.5)</option>
            <option value="boolean">Sim/Não</option>
            <option value="duration">Duração (ex: 2h 30m)</option>
            <option value="distance">Distância (ex: 5.2 km)</option>
            <option value="text">Texto livre</option>
          </select>
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Unidade: <span className="text-slate-400 text-xs">(opcional)</span>
          </label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Ex: kg, bpm, %..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          />
        </div>

        {/* Range */}
        {(metricType === 'scale' || metricType === 'count') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Min: <span className="text-slate-400 text-xs">(opcional)</span>
              </label>
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                placeholder="40"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Max: <span className="text-slate-400 text-xs">(opcional)</span>
              </label>
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                placeholder="150"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm text-slate-700 mb-2">
            Categoria:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            <option value="performance">Performance</option>
            <option value="wellness">Wellness</option>
            <option value="readiness">Readiness</option>
            <option value="load">Load</option>
            <option value="recovery">Recovery</option>
            <option value="psychological">Psychological</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Apply Button */}
      <motion.button
        whileHover={canApply ? { scale: 1.02 } : {}}
        whileTap={canApply ? { scale: 0.98 } : {}}
        onClick={handleApply}
        disabled={!canApply}
        className={`w-full py-3 text-sm rounded-xl transition-all ${
          canApply
            ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg hover:from-sky-400 hover:to-sky-500'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        ✓ Selecionar esta fonte
      </motion.button>
    </div>
  );
}

// ============================================================
// EXISTING METRIC SOURCE PICKER (Simplified)
// ============================================================

const MOCK_EXISTING_METRICS = [
  { id: 'hrv-001', name: 'HRV', category: 'Recovery', unit: 'ms' },
  { id: 'sleep-001', name: 'Sleep Quality', category: 'Wellness', unit: '1-10' },
  { id: 'rpe-001', name: 'RPE', category: 'Load', unit: '1-10' },
  { id: 'load-001', name: 'Training Load', category: 'Load', unit: 'AU' },
];

const TRANSFORMATIONS = [
  { value: 'direct', label: 'Usar valor direto' },
  { value: 'average-7d', label: 'Calcular média 7 dias' },
  { value: 'trend', label: 'Calcular tendência (slope)' },
  { value: 'normalize', label: 'Normalizar 0-100' },
  { value: 'vs-baseline', label: 'Comparar com baseline' },
];

interface ExistingMetricSourcePickerProps {
  currentSource: ExistingMetricSource | null;
  onSourceSelect: (source: AnyMetricSource) => void;
  onBack: () => void;
}

function ExistingMetricSourcePicker({ currentSource, onSourceSelect, onBack }: ExistingMetricSourcePickerProps) {
  const [selectedMetric, setSelectedMetric] = useState(currentSource?.metricId || '');
  const [transformation, setTransformation] = useState(currentSource?.transformation || 'direct');

  const metric = MOCK_EXISTING_METRICS.find(m => m.id === selectedMetric);

  const handleApply = () => {
    if (!metric) return;

    const transformLabel = TRANSFORMATIONS.find(t => t.value === transformation)?.label || '';

    const source: ExistingMetricSource = {
      type: 'existing-metric',
      id: `existing-${selectedMetric}-${transformation}`,
      name: `${metric.name} - ${transformLabel}`,
      description: `${transformLabel} of ${metric.name}`,
      icon: '📊',
      metricId: selectedMetric,
      metricName: metric.name,
      transformation: transformation as any,
    };

    onSourceSelect(source);
  };

  const canApply = selectedMetric && transformation;

  return (
    <div className="space-y-6">
      <motion.button
        whileHover={{ x: -4 }}
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Voltar
      </motion.button>

      <div>
        <h3 className="text-slate-900 flex items-center gap-2 mb-2">
          <LineChart className="h-5 w-5" />
          Escolhe métrica base
        </h3>
      </div>

      {/* Metrics List */}
      <div className="space-y-2">
        {MOCK_EXISTING_METRICS.map((metric) => (
          <motion.button
            key={metric.id}
            whileHover={{ x: 4 }}
            onClick={() => setSelectedMetric(metric.id)}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              selectedMetric === metric.id
                ? 'bg-purple-50 border-2 border-purple-300'
                : 'bg-white border border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="text-sm text-slate-900">{metric.name}</p>
            <p className="text-xs text-slate-500">{metric.category} • {metric.unit}</p>
          </motion.button>
        ))}
      </div>

      {/* Transformation */}
      {selectedMetric && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white"
        >
          <h4 className="text-sm text-purple-900 mb-3">O que fazer com {metric?.name}?</h4>
          <div className="space-y-2">
            {TRANSFORMATIONS.map((trans) => (
              <label
                key={trans.value}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  transformation === trans.value
                    ? 'bg-purple-100 border border-purple-300'
                    : 'bg-white border border-slate-200 hover:border-purple-200'
                }`}
              >
                <input
                  type="radio"
                  name="transformation"
                  value={trans.value}
                  checked={transformation === trans.value}
                  onChange={(e) => setTransformation(e.target.value)}
                  className="h-4 w-4 text-purple-600"
                />
                <p className="text-sm text-slate-900">{trans.label}</p>
              </label>
            ))}
          </div>
        </motion.div>
      )}

      {/* Apply Button */}
      {canApply && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          className="w-full py-3 text-sm rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:from-purple-400 hover:to-purple-500"
        >
          ✓ Selecionar esta fonte
        </motion.button>
      )}
    </div>
  );
}