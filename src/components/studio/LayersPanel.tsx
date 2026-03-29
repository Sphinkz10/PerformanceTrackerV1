import { useState } from "react";
import { motion } from "motion/react";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  Zap,
  Dumbbell,
  Hash,
  GripVertical,
  MoreVertical,
  Copy,
  Trash2,
  Settings
} from "lucide-react";
import type { Template, Block, BlockExercise } from "../../lib/DesignStudioTypes";

interface LayersPanelProps {
  template: Template;
  selectedLayer: {
    type: 'template' | 'block' | 'exercise' | 'series';
    id: string;
  } | null;
  onLayerSelect: (layer: { type: 'template' | 'block' | 'exercise' | 'series'; id: string }) => void;
  onTemplateChange: (template: Template) => void;
  collapsed?: boolean;
}

export function LayersPanel({
  template,
  selectedLayer,
  onLayerSelect,
  onTemplateChange,
  collapsed = false
}: LayersPanelProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(
    new Set(template.blocks.map(b => b.id))
  );

  const toggleBlockExpanded = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  const toggleBlockCollapsed = (blockId: string) => {
    onTemplateChange({
      ...template,
      blocks: template.blocks.map(b =>
        b.id === blockId ? { ...b, collapsed: !b.collapsed } : b
      )
    });
  };

  if (collapsed) {
    return null;
  }

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'warmup': return '🔥';
      case 'main': return '💪';
      case 'accessory': return '🎯';
      case 'cooldown': return '🧘';
      default: return '⚡';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-sky-500" />
          <h3 className="font-semibold text-slate-900">Layers</h3>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          {template.blocks.length} bloco(s) • {template.blocks.reduce((sum, b) => sum + b.exercises.length, 0)} exercício(s)
        </p>
      </div>

      {/* Layers Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Template Root */}
        <LayerItem
          icon={<Layers className="h-4 w-4 text-sky-500" />}
          label={template.name}
          type="template"
          id={template.id}
          selected={selectedLayer?.type === 'template'}
          onSelect={() => onLayerSelect({ type: 'template', id: template.id })}
          level={0}
        />

        {/* Blocks */}
        {template.blocks.map((block, blockIndex) => {
          const isExpanded = expandedBlocks.has(block.id);
          const isSelected = selectedLayer?.type === 'block' && selectedLayer.id === block.id;

          return (
            <div key={block.id}>
              {/* Block Layer */}
              <LayerItem
                icon={<span className="text-base">{getBlockIcon(block.type)}</span>}
                label={block.name}
                type="block"
                id={block.id}
                selected={isSelected}
                onSelect={() => onLayerSelect({ type: 'block', id: block.id })}
                level={1}
                expandable
                expanded={isExpanded}
                onToggleExpand={() => toggleBlockExpanded(block.id)}
                collapsed={block.collapsed}
                onToggleCollapse={() => toggleBlockCollapsed(block.id)}
                badge={block.exercises.length > 0 ? block.exercises.length.toString() : undefined}
              />

              {/* Exercises (if expanded) */}
              {isExpanded && block.exercises.map((exercise, exerciseIndex) => {
                const isExerciseSelected = 
                  selectedLayer?.type === 'exercise' && selectedLayer.id === exercise.id;

                return (
                  <LayerItem
                    key={exercise.id}
                    icon={<Dumbbell className="h-3 w-3 text-emerald-500" />}
                    label={exercise.exercise.name}
                    type="exercise"
                    id={exercise.id}
                    selected={isExerciseSelected}
                    onSelect={() => onLayerSelect({ type: 'exercise', id: exercise.id })}
                    level={2}
                    badge={`${exercise.series.length} séries`}
                    subtitle={`${exercise.series[0]?.reps || 0} reps @ ${exercise.series[0]?.load || 0}kg`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>Visível</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Bloqueado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Layer Item Component
function LayerItem({
  icon,
  label,
  type,
  id,
  selected,
  onSelect,
  level,
  expandable,
  expanded,
  onToggleExpand,
  collapsed,
  onToggleCollapse,
  badge,
  subtitle
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  id: string;
  selected: boolean;
  onSelect: () => void;
  level: number;
  expandable?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  badge?: string;
  subtitle?: string;
}) {
  const paddingLeft = 12 + (level * 16);

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.5)' }}
      className={`group relative flex items-center gap-2 px-2 py-2 cursor-pointer transition-colors ${
        selected ? 'bg-sky-100/80' : ''
      }`}
      style={{ paddingLeft: `${paddingLeft}px` }}
      onClick={onSelect}
    >
      {/* Expand/Collapse Toggle */}
      {expandable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand?.();
          }}
          className="h-5 w-5 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3 text-slate-600" />
          ) : (
            <ChevronRight className="h-3 w-3 text-slate-600" />
          )}
        </button>
      )}

      {/* Drag Handle */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>

      {/* Icon */}
      <div className="shrink-0">
        {icon}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${selected ? 'font-semibold text-sky-900' : 'text-slate-900'}`}>
          {label}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 truncate">{subtitle}</p>
        )}
      </div>

      {/* Badge */}
      {badge && (
        <span className="shrink-0 px-1.5 py-0.5 text-xs font-medium rounded bg-slate-200 text-slate-700">
          {badge}
        </span>
      )}

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onToggleCollapse && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse();
            }}
            className="h-6 w-6 rounded hover:bg-slate-200 flex items-center justify-center transition-colors"
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            {collapsed ? (
              <EyeOff className="h-3 w-3 text-slate-500" />
            ) : (
              <Eye className="h-3 w-3 text-slate-500" />
            )}
          </button>
        )}
      </div>

      {/* Selection Indicator */}
      {selected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-r" />
      )}
    </motion.div>
  );
}
