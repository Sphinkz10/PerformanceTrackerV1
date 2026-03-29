import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronRight,
  Type,
  Hash,
  Clock,
  Tag,
  Palette,
  Settings,
  Dumbbell,
  Layers,
  Zap,
  Target,
  AlertCircle,
  Info
} from "lucide-react";
import type { Template, Block, BlockExercise, SeriesConfig } from "../../lib/DesignStudioTypes";

interface PropertiesPanelProps {
  selectedLayer: {
    type: 'template' | 'block' | 'exercise' | 'series';
    id: string;
  } | null;
  template: Template;
  onTemplateChange: (template: Template) => void;
  collapsed?: boolean;
}

export function PropertiesPanel({
  selectedLayer,
  template,
  onTemplateChange,
  collapsed = false
}: PropertiesPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic', 'metadata', 'advanced'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Get the selected element
  const getSelectedElement = () => {
    if (!selectedLayer) return null;

    switch (selectedLayer.type) {
      case 'template':
        return { type: 'template', data: template };
      
      case 'block': {
        const block = template.blocks.find(b => b.id === selectedLayer.id);
        return block ? { type: 'block', data: block } : null;
      }
      
      case 'exercise': {
        for (const block of template.blocks) {
          const exercise = block.exercises.find(ex => ex.id === selectedLayer.id);
          if (exercise) {
            return { type: 'exercise', data: exercise, blockId: block.id };
          }
        }
        return null;
      }
      
      default:
        return null;
    }
  };

  const selectedElement = getSelectedElement();

  // Update handlers
  const updateTemplate = (updates: Partial<Template>) => {
    onTemplateChange({ ...template, ...updates });
  };

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    onTemplateChange({
      ...template,
      blocks: template.blocks.map(b => 
        b.id === blockId ? { ...b, ...updates } : b
      )
    });
  };

  const updateExercise = (blockId: string, exerciseId: string, updates: Partial<BlockExercise>) => {
    onTemplateChange({
      ...template,
      blocks: template.blocks.map(b => 
        b.id === blockId
          ? {
              ...b,
              exercises: b.exercises.map(ex =>
                ex.id === exerciseId ? { ...ex, ...updates } : ex
              )
            }
          : b
      )
    });
  };

  if (collapsed) {
    return null;
  }

  if (!selectedLayer) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Info className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">Nenhum elemento selecionado</h3>
        <p className="text-sm text-slate-600">
          Selecione um template, bloco ou exercício para ver suas propriedades
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          {selectedLayer.type === 'template' && <Layers className="h-4 w-4 text-sky-500" />}
          {selectedLayer.type === 'block' && <Zap className="h-4 w-4 text-violet-500" />}
          {selectedLayer.type === 'exercise' && <Dumbbell className="h-4 w-4 text-emerald-500" />}
          <h3 className="font-semibold text-slate-900">Propriedades</h3>
        </div>
        <p className="text-xs text-slate-600 capitalize">{selectedLayer.type}</p>
      </div>

      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedElement?.type === 'template' && (
          <TemplateProperties
            template={selectedElement.data as Template}
            onUpdate={updateTemplate}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />
        )}

        {selectedElement?.type === 'block' && (
          <BlockProperties
            block={selectedElement.data as Block}
            onUpdate={(updates) => updateBlock(selectedLayer.id, updates)}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />
        )}

        {selectedElement?.type === 'exercise' && (
          <ExerciseProperties
            exercise={selectedElement.data as BlockExercise}
            onUpdate={(updates) => updateExercise(
              (selectedElement as any).blockId,
              selectedLayer.id,
              updates
            )}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />
        )}
      </div>
    </div>
  );
}

// Template Properties Component
function TemplateProperties({
  template,
  onUpdate,
  expandedSections,
  onToggleSection
}: {
  template: Template;
  onUpdate: (updates: Partial<Template>) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}) {
  return (
    <div className="divide-y divide-slate-200">
      {/* Basic Info */}
      <PropertySection
        id="basic"
        title="Informações Básicas"
        icon={Type}
        expanded={expandedSections.has('basic')}
        onToggle={() => onToggleSection('basic')}
      >
        <PropertyField label="Nome" icon={Type}>
          <input
            type="text"
            value={template.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </PropertyField>

        <PropertyField label="Descrição" icon={Type}>
          <textarea
            value={template.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all resize-none"
          />
        </PropertyField>

        <PropertyField label="Categoria" icon={Tag}>
          <select
            value={template.category}
            onChange={(e) => onUpdate({ category: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          >
            <option value="strength">Força</option>
            <option value="cardio">Cardio</option>
            <option value="circuit">Circuito</option>
            <option value="hybrid">Híbrido</option>
            <option value="recovery">Recuperação</option>
            <option value="custom">Custom</option>
          </select>
        </PropertyField>

        <PropertyField label="Dificuldade" icon={Target}>
          <select
            value={template.difficulty}
            onChange={(e) => onUpdate({ difficulty: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          >
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermédio</option>
            <option value="advanced">Avançado</option>
          </select>
        </PropertyField>

        <PropertyField label="Duração (min)" icon={Clock}>
          <input
            type="number"
            value={template.duration}
            onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 0 })}
            min="0"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </PropertyField>
      </PropertySection>

      {/* Metadata */}
      <PropertySection
        id="metadata"
        title="Metadados"
        icon={Info}
        expanded={expandedSections.has('metadata')}
        onToggle={() => onToggleSection('metadata')}
      >
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Blocos:</span>
            <span className="font-medium text-slate-900">{template.blocks.length}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Exercícios:</span>
            <span className="font-medium text-slate-900">
              {template.blocks.reduce((sum, b) => sum + b.exercises.length, 0)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Criado:</span>
            <span className="font-medium text-slate-900">
              {template.metadata?.created 
                ? new Date(template.metadata.created).toLocaleDateString('pt-PT')
                : 'N/A'
              }
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-600">Versão:</span>
            <span className="font-medium text-slate-900">
              v{template.metadata?.version || 1}
            </span>
          </div>
        </div>
      </PropertySection>

      {/* Tags */}
      <PropertySection
        id="advanced"
        title="Tags & Avançado"
        icon={Settings}
        expanded={expandedSections.has('advanced')}
        onToggle={() => onToggleSection('advanced')}
      >
        <PropertyField label="Tags" icon={Tag}>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {template.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-sky-100 text-sky-700"
                >
                  {tag}
                  <button
                    onClick={() => {
                      const newTags = template.tags?.filter((_, i) => i !== index) || [];
                      onUpdate({ tags: newTags });
                    }}
                    className="hover:text-sky-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Adicionar tag..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  const newTags = [...(template.tags || []), e.currentTarget.value.trim()];
                  onUpdate({ tags: newTags });
                  e.currentTarget.value = '';
                }
              }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </div>
        </PropertyField>
      </PropertySection>
    </div>
  );
}

// Block Properties Component
function BlockProperties({
  block,
  onUpdate,
  expandedSections,
  onToggleSection
}: {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}) {
  const blockTypes = [
    { value: 'warmup', label: '🔥 Aquecimento' },
    { value: 'main', label: '💪 Principal' },
    { value: 'accessory', label: '🎯 Acessório' },
    { value: 'cooldown', label: '🧘 Arrefecimento' },
    { value: 'custom', label: '⚡ Custom' }
  ];

  return (
    <div className="divide-y divide-slate-200">
      <PropertySection
        id="basic"
        title="Configuração do Bloco"
        icon={Zap}
        expanded={expandedSections.has('basic')}
        onToggle={() => onToggleSection('basic')}
      >
        <PropertyField label="Nome" icon={Type}>
          <input
            type="text"
            value={block.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </PropertyField>

        <PropertyField label="Tipo" icon={Tag}>
          <select
            value={block.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          >
            {blockTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </PropertyField>

        <PropertyField label="Ordem" icon={Hash}>
          <input
            type="number"
            value={block.order}
            onChange={(e) => onUpdate({ order: parseInt(e.target.value) || 1 })}
            min="1"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
          />
        </PropertyField>
      </PropertySection>

      <PropertySection
        id="metadata"
        title="Estatísticas"
        icon={Info}
        expanded={expandedSections.has('metadata')}
        onToggle={() => onToggleSection('metadata')}
      >
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-600">Exercícios:</span>
            <span className="font-medium text-slate-900">{block.exercises.length}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-600">Séries Totais:</span>
            <span className="font-medium text-slate-900">
              {block.exercises.reduce((sum, ex) => sum + ex.series.length, 0)}
            </span>
          </div>
        </div>
      </PropertySection>
    </div>
  );
}

// Exercise Properties Component
function ExerciseProperties({
  exercise,
  onUpdate,
  expandedSections,
  onToggleSection
}: {
  exercise: BlockExercise;
  onUpdate: (updates: Partial<BlockExercise>) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}) {
  return (
    <div className="divide-y divide-slate-200">
      <PropertySection
        id="basic"
        title="Informações do Exercício"
        icon={Dumbbell}
        expanded={expandedSections.has('basic')}
        onToggle={() => onToggleSection('basic')}
      >
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="font-semibold text-slate-900 mb-1">{exercise.exercise.name}</p>
            <p className="text-xs text-slate-600">{exercise.exercise.category}</p>
          </div>

          <PropertyField label="Ordem" icon={Hash}>
            <input
              type="number"
              value={exercise.order}
              onChange={(e) => onUpdate({ order: parseInt(e.target.value) || 1 })}
              min="1"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-300 transition-all"
            />
          </PropertyField>
        </div>
      </PropertySection>

      <PropertySection
        id="metadata"
        title="Séries Configuradas"
        icon={Info}
        expanded={expandedSections.has('metadata')}
        onToggle={() => onToggleSection('metadata')}
      >
        <div className="space-y-2">
          {exercise.series.map((series, index) => (
            <div
              key={series.id}
              className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-white border border-emerald-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-700">
                  Série {series.seriesNumber}
                </span>
                <span className="text-xs text-slate-600">
                  {series.reps} reps @ {series.load}kg
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span>RPE {series.rpe}</span>
                <span>•</span>
                <span>{series.rest}s descanso</span>
              </div>
            </div>
          ))}
        </div>
      </PropertySection>
    </div>
  );
}

// Property Section Component
function PropertySection({
  id,
  title,
  icon: Icon,
  expanded,
  onToggle,
  children
}: {
  id: string;
  title: string;
  icon: any;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-900">{title}</span>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Property Field Component
function PropertyField({
  label,
  icon: Icon,
  children
}: {
  label: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
        <Icon className="h-3 w-3 text-slate-400" />
        {label}
      </label>
      {children}
    </div>
  );
}
