import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FlaskConical,
  Activity,
  Dna,
  Zap,
  Brain,
  ArrowLeft,
  Palette,
} from 'lucide-react';
import { DesignStudio } from './DesignStudio';
import { BiomechanicsLab } from './labs/BiomechanicsLab';
import { GeneticLab } from './labs/GeneticLab';
import { NeuroLab } from './labs/NeuroLab';
import { EnergyLab } from './labs/EnergyLab';

interface LabsProps {
  onBack?: () => void;
}

export function Labs({ onBack }: LabsProps) {
  const [activeLab, setActiveLab] = useState<
    'biomech' | 'genetic' | 'neuro' | 'energy' | 'design-studio'
  >('design-studio');

  const labs = [
    {
      id: 'design-studio' as const,
      name: 'Design Studio',
      description: 'Sistema completo de criação de treinos',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      status: 'new',
    },
    {
      id: 'biomech' as const,
      name: 'Biomechanics Lab',
      description: 'Análise de movimento e eficiência mecânica',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      status: 'active',
    },
    {
      id: 'genetic' as const,
      name: 'Genetic Profiling',
      description: 'Análise genética e personalização',
      icon: Dna,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      status: 'active',
    },
    {
      id: 'neuro' as const,
      name: 'Neuro Performance',
      description: 'Otimização cognitiva e neural',
      icon: Brain,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50',
      status: 'active',
    },
    {
      id: 'energy' as const,
      name: 'Energy Systems',
      description: 'Metabolismo e sistemas energéticos',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      status: 'active',
    },
  ];

  const currentLab = labs.find((lab) => lab.id === activeLab);

  // Se Design Studio estiver ativo, mostrar fullscreen
  if (activeLab === 'design-studio') {
    return <DesignStudio onBack={() => setActiveLab('biomech')} />;
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b bg-white/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4 mb-4">
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="h-9 w-9 rounded-xl border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </motion.button>
          )}
          <div>
            <h1 className="text-slate-900 flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              <span>Labs</span>
            </h1>
            <p className="text-sm text-slate-600">
              Tecnologias experimentais e avançadas
            </p>
          </div>
        </div>

        {/* Tabs de Labs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {labs.map((lab) => {
            const Icon = lab.icon;
            const isActive = activeLab === lab.id;

            return (
              <motion.button
                key={lab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveLab(lab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? `bg-gradient-to-r ${lab.color} text-white shadow-lg shadow-${lab.color}/30`
                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-sky-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{lab.name}</span>
                <span className="sm:hidden">
                  {lab.name.split(' ')[0]}
                </span>
                {lab.status === 'new' && (
                  <span className="text-xs px-1.5 py-0.5 bg-white/20 rounded">
                    NOVO
                  </span>
                )}
                {lab.status === 'beta' && (
                  <span className="text-xs px-1.5 py-0.5 bg-white/20 rounded">
                    BETA
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo do Lab */}
      <div className="flex-1 overflow-auto">
        {/* Biomechanics Lab */}
        {activeLab === 'biomech' && (
          <BiomechanicsLab />
        )}

        {/* Genetic Profiling */}
        {activeLab === 'genetic' && (
          <GeneticLab />
        )}

        {/* Neuro Performance */}
        {activeLab === 'neuro' && (
          <NeuroLab />
        )}

        {/* Energy Systems */}
        {activeLab === 'energy' && (
          <EnergyLab />
        )}
      </div>
    </div>
  );
}