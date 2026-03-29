// Design Studio Pro - Helper Functions

import type { CalculatorInput, CalculatorResult, SeriesConfig, Block, Template } from './DesignStudioTypes';

/**
 * 1RM Calculators - Multiple Methods
 */
export const calculate1RM = (input: CalculatorInput): CalculatorResult => {
  const { weight, reps, rpe = 10, method } = input;
  
  let oneRM = 0;
  
  switch (method) {
    case 'brzycki':
      oneRM = weight / (1.0278 - 0.0278 * reps);
      break;
    case 'epley':
      oneRM = weight * (1 + 0.0333 * reps);
      break;
    case 'lombardi':
      oneRM = weight * Math.pow(reps, 0.1);
      break;
    case 'mayhew':
      oneRM = (100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps));
      break;
    default:
      oneRM = weight * (1 + 0.0333 * reps); // Default to Epley
  }
  
  // Adjust for RPE if provided
  if (rpe < 10) {
    const rirFactor = 1 + ((10 - rpe) * 0.025); // ~2.5% per RIR
    oneRM = oneRM * rirFactor;
  }
  
  // Calculate percentages
  const percentages: { [key: number]: number } = {};
  [50, 60, 65, 70, 75, 80, 85, 90, 95, 100].forEach(percent => {
    percentages[percent] = Math.round((oneRM * percent / 100) * 10) / 10;
  });
  
  return {
    oneRM: Math.round(oneRM * 10) / 10,
    percentages,
    volumeTotal: weight * reps,
    confidence: 95 // Mock confidence score
  };
};

/**
 * Series Pattern Generators
 */
export const generateSeriesPattern = (
  type: 'linear' | 'ramp' | 'pyramid' | 'drop-set' | 'wave',
  baseConfig: Partial<SeriesConfig>,
  seriesCount: number
): SeriesConfig[] => {
  const series: SeriesConfig[] = [];
  
  for (let i = 0; i < seriesCount; i++) {
    const seriesNumber = i + 1;
    let config: SeriesConfig = {
      id: `series-${Date.now()}-${i}`,
      seriesNumber,
      reps: baseConfig.reps || 10,
      load: baseConfig.load || 0,
      rpe: baseConfig.rpe || 7,
      rir: baseConfig.rir,
      rest: baseConfig.rest || 90,
      tempo: baseConfig.tempo,
      notes: baseConfig.notes,
      completed: false
    };
    
    switch (type) {
      case 'linear':
        // Increase load by 2.5kg each set
        if (config.load) {
          config.load = (baseConfig.load || 0) + (i * 2.5);
        }
        break;
        
      case 'ramp':
        // Increase RPE from 6 to 9
        const rpeRange = [6, 7, 8, 9];
        config.rpe = rpeRange[Math.min(i, rpeRange.length - 1)];
        break;
        
      case 'pyramid':
        // Decrease reps, increase load
        const repScheme = [12, 10, 8, 6, 8, 10, 12];
        config.reps = repScheme[Math.min(i, repScheme.length - 1)];
        if (config.load && i < 4) {
          config.load = (baseConfig.load || 0) * (1 + i * 0.05);
        } else if (config.load) {
          config.load = (baseConfig.load || 0) * (1 + (6 - i) * 0.05);
        }
        break;
        
      case 'drop-set':
        // Decrease load by 10% each set
        if (config.load) {
          config.load = (baseConfig.load || 0) * Math.pow(0.9, i);
        }
        config.rest = 30; // Short rest for drops
        break;
        
      case 'wave':
        // Oscillate between heavy and light
        const waveFactor = i % 2 === 0 ? 1.1 : 0.9;
        if (config.load) {
          config.load = (baseConfig.load || 0) * waveFactor;
        }
        break;
    }
    
    series.push(config);
  }
  
  return series;
};

/**
 * Template Analysis
 */
export interface TemplateAnalysis {
  totalBlocks: number;
  totalExercises: number;
  totalSeries: number;
  totalReps: number;
  totalVolume: number; // kg
  estimatedDuration: number; // minutes
  avgRPE: number;
  avgLoad: number;
  intensity: 'low' | 'moderate' | 'high';
  volume: 'low' | 'moderate' | 'high';
  muscleGroupDistribution?: { [key: string]: number };
  equipmentNeeded?: string[];
  qualityScore: number;
  recommendations: string[];
}

export function analyzeTemplate(template: Template): TemplateAnalysis;
export function analyzeTemplate(blocks: Block[]): TemplateAnalysis;
export function analyzeTemplate(input: Template | Block[]): TemplateAnalysis {
  const blocks = Array.isArray(input) ? input : input.blocks;
  
  let totalVolume = 0;
  let totalDuration = 0;
  let rpeSum = 0;
  let rpeCount = 0;
  let loadSum = 0;
  let loadCount = 0;
  let exerciseCount = 0;
  let seriesCount = 0;
  let totalReps = 0;
  const muscleGroups: { [key: string]: number } = {};
  const equipmentSet = new Set<string>();
  const recommendations: string[] = [];
  
  blocks.forEach(block => {
    block.exercises.forEach(ex => {
      exerciseCount++;
      
      // Count series and calculate volume
      ex.series.forEach(s => {
        seriesCount++;
        if (s.load && s.reps) {
          totalVolume += s.load * s.reps;
          totalReps += s.reps;
          loadSum += s.load;
          loadCount++;
        }
        if (s.rpe) {
          rpeSum += s.rpe;
          rpeCount++;
        }
        if (s.rest) {
          totalDuration += s.rest / 60; // Convert seconds to minutes
        }
      });
      
      // Estimate exercise duration (3 seconds per rep average)
      const avgReps = ex.series.reduce((sum, s) => sum + (s.reps || 0), 0) / ex.series.length;
      totalDuration += (avgReps * ex.series.length * 3) / 60;
      
      // Track muscle groups
      if (ex.exercise?.muscleGroups) {
        ex.exercise.muscleGroups.forEach(mg => {
          muscleGroups[mg] = (muscleGroups[mg] || 0) + 1;
        });
      }
      
      // Track equipment
      if (ex.exercise?.equipment) {
        ex.exercise.equipment.forEach(eq => equipmentSet.add(eq));
      }
    });
  });
  
  const averageRPE = rpeCount > 0 ? Math.round((rpeSum / rpeCount) * 10) / 10 : 0;
  const averageLoad = loadCount > 0 ? Math.round((loadSum / loadCount) * 10) / 10 : 0;
  
  // Generate recommendations
  if (exerciseCount > 12) {
    recommendations.push("Muitos exercícios - considere reduzir para melhor foco");
  }
  if (averageRPE > 8.5) {
    recommendations.push("Intensidade muito alta - risco de overtraining");
  }
  if (totalDuration > 90) {
    recommendations.push("Duração excessiva - considere otimizar descansos");
  }
  
  // Check muscle balance
  const mgEntries = Object.entries(muscleGroups);
  if (mgEntries.length > 0) {
    const maxMg = Math.max(...mgEntries.map(([, count]) => count));
    const minMg = Math.min(...mgEntries.map(([, count]) => count));
    if (maxMg > minMg * 2) {
      recommendations.push("Distribuição muscular desbalanceada");
    }
  }
  
  // Calculate quality score (1-10)
  const qualityScore = Math.min(10, Math.round(
    (exerciseCount / 3) + 
    (averageRPE * 0.5) + 
    (seriesCount / 10)
  ));
  
  // Determine intensity and volume levels
  const intensity = averageRPE < 6 ? 'low' : averageRPE < 8 ? 'moderate' : 'high';
  const volume = totalVolume < 1000 ? 'low' : totalVolume < 2000 ? 'moderate' : 'high';
  
  return {
    totalBlocks: blocks.length,
    totalExercises: exerciseCount,
    totalSeries: seriesCount,
    totalReps: totalReps,
    totalVolume: Math.round(totalVolume),
    estimatedDuration: Math.round(totalDuration),
    avgRPE: averageRPE,
    avgLoad: averageLoad,
    intensity,
    volume,
    muscleGroupDistribution: muscleGroups,
    equipmentNeeded: Array.from(equipmentSet),
    qualityScore,
    recommendations
  };
};

/**
 * Load Helpers
 */
export const calculateLoadFromPercentage = (oneRM: number, percentage: number): number => {
  return Math.round((oneRM * percentage / 100) * 10) / 10;
};

export const calculatePercentageFromLoad = (oneRM: number, load: number): number => {
  return Math.round((load / oneRM * 100) * 10) / 10;
};

/**
 * Tempo Helpers
 */
export const parseTempo = (tempo: string): { eccentric: number; pause1: number; concentric: number; pause2: number } | null => {
  const parts = tempo.split('-');
  if (parts.length !== 4) return null;
  
  return {
    eccentric: parseInt(parts[0]) || 0,
    pause1: parseInt(parts[1]) || 0,
    concentric: parseInt(parts[2]) || 0,
    pause2: parseInt(parts[3]) || 0
  };
};

export const formatTempo = (eccentric: number, pause1: number, concentric: number, pause2: number): string => {
  return `${eccentric}-${pause1}-${concentric}-${pause2}`;
};

/**
 * Validation
 */
export const validateSeriesConfig = (series: SeriesConfig): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (series.reps !== undefined && series.reps <= 0) {
    errors.push("Repetições devem ser maior que 0");
  }
  
  if (series.load !== undefined && series.load < 0) {
    errors.push("Carga não pode ser negativa");
  }
  
  if (series.rpe !== undefined && (series.rpe < 1 || series.rpe > 10)) {
    errors.push("RPE deve estar entre 1 e 10");
  }
  
  if (series.rir !== undefined && series.rir < 0) {
    errors.push("RIR não pode ser negativo");
  }
  
  if (series.rest !== undefined && series.rest < 0) {
    errors.push("Descanso não pode ser negativo");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};