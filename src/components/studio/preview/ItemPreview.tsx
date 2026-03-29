import { motion } from 'motion/react';
import { Eye, Star, Clock, Target } from 'lucide-react';

interface ItemPreviewProps {
  item: any;
  type: 'exercise' | 'workout' | 'plan' | 'class';
}

export function ItemPreview({ item, type }: ItemPreviewProps) {
  const typeConfig = {
    exercise: {
      color: 'from-red-500 to-pink-500',
      icon: '🏋️',
      label: 'Exercício'
    },
    workout: {
      color: 'from-sky-500 to-cyan-500',
      icon: '📋',
      label: 'Treino'
    },
    plan: {
      color: 'from-emerald-500 to-teal-500',
      icon: '📅',
      label: 'Plano'
    },
    class: {
      color: 'from-purple-500 to-pink-500',
      icon: '👥',
      label: 'Aula'
    }
  };

  const config = typeConfig[type];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-slate-200 bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.color} p-8 text-white`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                {config.icon}
              </div>
              <div>
                <div className="text-sm font-medium opacity-90 mb-1">{config.label}</div>
                <h1 className="text-3xl font-bold">{item?.name || 'Sem título'}</h1>
              </div>
            </div>
            {item?.isFavorite && (
              <Star className="h-6 w-6 fill-white" />
            )}
          </div>
          
          {item?.description && (
            <p className="text-white/90 text-lg">
              {item.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 border-b border-slate-200">
          <div className="text-center">
            <Eye className="h-5 w-5 text-slate-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {item?.usageCount || 0}
            </div>
            <div className="text-xs text-slate-600">Visualizações</div>
          </div>
          
          <div className="text-center">
            <Clock className="h-5 w-5 text-slate-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {item?.duration || '—'}
            </div>
            <div className="text-xs text-slate-600">Duração (min)</div>
          </div>
          
          <div className="text-center">
            <Target className="h-5 w-5 text-slate-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">
              {item?.difficulty || 'N/A'}
            </div>
            <div className="text-xs text-slate-600">Nível</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="prose prose-slate max-w-none">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Detalhes</h3>
            
            {item?.category && (
              <div className="mb-4">
                <span className="text-sm font-medium text-slate-700">Categoria: </span>
                <span className="text-sm text-slate-600">{item.category}</span>
              </div>
            )}

            {item?.tags && item.tags.length > 0 && (
              <div className="mb-4">
                <span className="text-sm font-medium text-slate-700 block mb-2">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item?.blocks && item.blocks.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-slate-900 mb-3">
                  Blocos de Treino ({item.blocks.length})
                </h4>
                <div className="space-y-2">
                  {item.blocks.map((block: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50"
                    >
                      <div className="font-medium text-slate-900 mb-1">
                        Bloco {index + 1}
                      </div>
                      <div className="text-sm text-slate-600">
                        {block.sets && `${block.sets} séries`}
                        {block.reps && ` × ${block.reps} reps`}
                        {block.rest && ` | ${block.rest}s descanso`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
