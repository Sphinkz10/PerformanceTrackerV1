/**
 * Transform Templates Library
 * 
 * Pre-configured transformation templates for common use cases.
 * Users can select these templates and customize them.
 */

import type { TransformTemplate, UnitDefinition, UnitConversion } from '@/types/transformations';

// ============================================================================
// UNIT DEFINITIONS
// ============================================================================

export const UNITS: Record<string, UnitDefinition[]> = {
  weight: [
    { id: 'kg', name: 'Kilogramas', symbol: 'kg', category: 'weight' },
    { id: 'lbs', name: 'Libras', symbol: 'lbs', category: 'weight' },
    { id: 'g', name: 'Gramas', symbol: 'g', category: 'weight' },
    { id: 'oz', name: 'Onças', symbol: 'oz', category: 'weight' },
  ],
  distance: [
    { id: 'm', name: 'Metros', symbol: 'm', category: 'distance' },
    { id: 'cm', name: 'Centímetros', symbol: 'cm', category: 'distance' },
    { id: 'km', name: 'Quilómetros', symbol: 'km', category: 'distance' },
    { id: 'mi', name: 'Milhas', symbol: 'mi', category: 'distance' },
    { id: 'ft', name: 'Pés', symbol: 'ft', category: 'distance' },
    { id: 'in', name: 'Polegadas', symbol: 'in', category: 'distance' },
  ],
  time: [
    { id: 'sec', name: 'Segundos', symbol: 's', category: 'time' },
    { id: 'min', name: 'Minutos', symbol: 'min', category: 'time' },
    { id: 'hr', name: 'Horas', symbol: 'h', category: 'time' },
  ],
  temperature: [
    { id: 'celsius', name: 'Celsius', symbol: '°C', category: 'temperature' },
    { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', category: 'temperature' },
  ],
};

// ============================================================================
// UNIT CONVERSIONS
// ============================================================================

export const UNIT_CONVERSIONS: Record<string, UnitConversion[]> = {
  weight: [
    { from: 'kg', to: 'lbs', factor: 2.20462 },
    { from: 'lbs', to: 'kg', factor: 0.453592 },
    { from: 'kg', to: 'g', factor: 1000 },
    { from: 'g', to: 'kg', factor: 0.001 },
    { from: 'lbs', to: 'oz', factor: 16 },
    { from: 'oz', to: 'lbs', factor: 0.0625 },
  ],
  distance: [
    { from: 'cm', to: 'm', factor: 0.01 },
    { from: 'm', to: 'cm', factor: 100 },
    { from: 'km', to: 'm', factor: 1000 },
    { from: 'm', to: 'km', factor: 0.001 },
    { from: 'km', to: 'mi', factor: 0.621371 },
    { from: 'mi', to: 'km', factor: 1.60934 },
    { from: 'm', to: 'ft', factor: 3.28084 },
    { from: 'ft', to: 'm', factor: 0.3048 },
    { from: 'cm', to: 'in', factor: 0.393701 },
    { from: 'in', to: 'cm', factor: 2.54 },
  ],
  time: [
    { from: 'min', to: 'sec', factor: 60 },
    { from: 'sec', to: 'min', factor: 0.0166667 },
    { from: 'hr', to: 'min', factor: 60 },
    { from: 'min', to: 'hr', factor: 0.0166667 },
    { from: 'hr', to: 'sec', factor: 3600 },
    { from: 'sec', to: 'hr', factor: 0.000277778 },
  ],
  temperature: [
    { 
      from: 'celsius', 
      to: 'fahrenheit', 
      factor: 1, // Uses formula instead
      formula: '(value * 9/5) + 32' 
    },
    { 
      from: 'fahrenheit', 
      to: 'celsius', 
      factor: 1, // Uses formula instead
      formula: '(value - 32) * 5/9' 
    },
  ],
};

// ============================================================================
// TRANSFORM TEMPLATES
// ============================================================================

export const TRANSFORM_TEMPLATES: TransformTemplate[] = [
  // ========== WEIGHT ==========
  {
    id: 'kg-to-lbs',
    name: 'kg → lbs',
    description: 'Converter quilogramas para libras',
    category: 'weight',
    icon: '⚖️',
    transformFunction: 'kg_to_lbs',
    example: {
      input: 10,
      output: 22.05,
    },
  },
  {
    id: 'lbs-to-kg',
    name: 'lbs → kg',
    description: 'Converter libras para quilogramas',
    category: 'weight',
    icon: '⚖️',
    transformFunction: 'lbs_to_kg',
    example: {
      input: 22,
      output: 10,
    },
  },

  // ========== DISTANCE ==========
  {
    id: 'cm-to-m',
    name: 'cm → m',
    description: 'Converter centímetros para metros',
    category: 'distance',
    icon: '📏',
    transformFunction: 'cm_to_m',
    example: {
      input: 100,
      output: 1,
    },
  },
  {
    id: 'm-to-cm',
    name: 'm → cm',
    description: 'Converter metros para centímetros',
    category: 'distance',
    icon: '📏',
    transformFunction: 'm_to_cm',
    example: {
      input: 1,
      output: 100,
    },
  },
  {
    id: 'km-to-miles',
    name: 'km → milhas',
    description: 'Converter quilómetros para milhas',
    category: 'distance',
    icon: '🛣️',
    transformFunction: 'multiply',
    transformParams: { factor: 0.621371 },
    example: {
      input: 10,
      output: 6.21,
    },
  },
  {
    id: 'miles-to-km',
    name: 'milhas → km',
    description: 'Converter milhas para quilómetros',
    category: 'distance',
    icon: '🛣️',
    transformFunction: 'multiply',
    transformParams: { factor: 1.60934 },
    example: {
      input: 10,
      output: 16.09,
    },
  },

  // ========== TIME ==========
  {
    id: 'minutes-to-seconds',
    name: 'min → seg',
    description: 'Converter minutos para segundos',
    category: 'time',
    icon: '⏱️',
    transformFunction: 'minutes_to_seconds',
    example: {
      input: 5,
      output: 300,
    },
  },
  {
    id: 'seconds-to-minutes',
    name: 'seg → min',
    description: 'Converter segundos para minutos',
    category: 'time',
    icon: '⏱️',
    transformFunction: 'seconds_to_minutes',
    example: {
      input: 300,
      output: 5,
    },
  },
  {
    id: 'hours-to-minutes',
    name: 'h → min',
    description: 'Converter horas para minutos',
    category: 'time',
    icon: '⏰',
    transformFunction: 'multiply',
    transformParams: { factor: 60 },
    example: {
      input: 2,
      output: 120,
    },
  },

  // ========== TEMPERATURE ==========
  {
    id: 'celsius-to-fahrenheit',
    name: '°C → °F',
    description: 'Converter Celsius para Fahrenheit',
    category: 'temperature',
    icon: '🌡️',
    transformFunction: 'custom',
    transformParams: { formula: '(value * 9/5) + 32' },
    example: {
      input: 0,
      output: 32,
    },
  },
  {
    id: 'fahrenheit-to-celsius',
    name: '°F → °C',
    description: 'Converter Fahrenheit para Celsius',
    category: 'temperature',
    icon: '🌡️',
    transformFunction: 'custom',
    transformParams: { formula: '(value - 32) * 5/9' },
    example: {
      input: 32,
      output: 0,
    },
  },

  // ========== SCALE ==========
  {
    id: 'scale-0-10-to-0-100',
    name: '0-10 → 0-100',
    description: 'Escalar de 0-10 para 0-100',
    category: 'scale',
    icon: '📊',
    transformFunction: 'scale',
    transformParams: {
      fromMin: 0,
      fromMax: 10,
      toMin: 0,
      toMax: 100,
    },
    example: {
      input: 5,
      output: 50,
    },
  },
  {
    id: 'scale-1-5-to-0-100',
    name: '1-5 → 0-100',
    description: 'Escalar de 1-5 para 0-100',
    category: 'scale',
    icon: '📊',
    transformFunction: 'scale',
    transformParams: {
      fromMin: 1,
      fromMax: 5,
      toMin: 0,
      toMax: 100,
    },
    example: {
      input: 3,
      output: 50,
    },
  },
  {
    id: 'scale-1-10-to-0-100',
    name: '1-10 → 0-100',
    description: 'Escalar de 1-10 para 0-100',
    category: 'scale',
    icon: '📊',
    transformFunction: 'scale',
    transformParams: {
      fromMin: 1,
      fromMax: 10,
      toMin: 0,
      toMax: 100,
    },
    example: {
      input: 5,
      output: 44.44,
    },
  },
  {
    id: 'invert-scale-10',
    name: 'Inverter Escala (10)',
    description: 'Inverter escala de 0-10 (10 → 0, 0 → 10)',
    category: 'scale',
    icon: '🔄',
    transformFunction: 'invert',
    transformParams: { max: 10 },
    example: {
      input: 8,
      output: 2,
    },
  },
  {
    id: 'invert-scale-100',
    name: 'Inverter Escala (100)',
    description: 'Inverter escala de 0-100 (100 → 0, 0 → 100)',
    category: 'scale',
    icon: '🔄',
    transformFunction: 'invert',
    transformParams: { max: 100 },
    example: {
      input: 70,
      output: 30,
    },
  },

  // ========== OTHER ==========
  {
    id: 'multiply-by-10',
    name: 'Multiplicar por 10',
    description: 'Multiplicar valor por 10',
    category: 'other',
    icon: '✖️',
    transformFunction: 'multiply_by_10',
    example: {
      input: 5,
      output: 50,
    },
  },
  {
    id: 'multiply-by-100',
    name: 'Multiplicar por 100',
    description: 'Multiplicar valor por 100',
    category: 'other',
    icon: '✖️',
    transformFunction: 'multiply_by_100',
    example: {
      input: 5,
      output: 500,
    },
  },
  {
    id: 'divide-by-10',
    name: 'Dividir por 10',
    description: 'Dividir valor por 10',
    category: 'other',
    icon: '➗',
    transformFunction: 'divide_by_10',
    example: {
      input: 50,
      output: 5,
    },
  },
  {
    id: 'round-0-decimals',
    name: 'Arredondar (inteiro)',
    description: 'Arredondar para número inteiro',
    category: 'other',
    icon: '🔢',
    transformFunction: 'round',
    transformParams: { decimals: 0 },
    example: {
      input: 5.7,
      output: 6,
    },
  },
  {
    id: 'round-2-decimals',
    name: 'Arredondar (2 casas)',
    description: 'Arredondar para 2 casas decimais',
    category: 'other',
    icon: '🔢',
    transformFunction: 'round',
    transformParams: { decimals: 2 },
    example: {
      input: 5.789,
      output: 5.79,
    },
  },

  // ========== CUSTOM ==========
  {
    id: 'custom-formula',
    name: 'Fórmula Personalizada',
    description: 'Criar fórmula personalizada',
    category: 'custom',
    icon: '🧮',
    transformFunction: 'custom',
    transformParams: { formula: 'value' },
    example: {
      input: 10,
      output: 10,
    },
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): TransformTemplate[] {
  return TRANSFORM_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): TransformTemplate | undefined {
  return TRANSFORM_TEMPLATES.find(t => t.id === id);
}

/**
 * Get compatible templates for field/metric types
 */
export function getCompatibleTemplates(
  fieldType?: string,
  metricType?: string
): TransformTemplate[] {
  return TRANSFORM_TEMPLATES.filter(template => {
    // If no compatibility restrictions, include all
    if (!template.compatibleFieldTypes && !template.compatibleMetricTypes) {
      return true;
    }

    // Check field type compatibility
    const fieldCompatible = !template.compatibleFieldTypes || 
                           !fieldType ||
                           template.compatibleFieldTypes.includes(fieldType);

    // Check metric type compatibility
    const metricCompatible = !template.compatibleMetricTypes ||
                            !metricType ||
                            template.compatibleMetricTypes.includes(metricType);

    return fieldCompatible && metricCompatible;
  });
}

/**
 * Get unit conversions for a category
 */
export function getUnitConversions(category: string): UnitConversion[] {
  return UNIT_CONVERSIONS[category] || [];
}

/**
 * Get units for a category
 */
export function getUnitsForCategory(category: string): UnitDefinition[] {
  return UNITS[category] || [];
}

/**
 * Find conversion between two units
 */
export function findConversion(from: string, to: string, category: string): UnitConversion | undefined {
  const conversions = UNIT_CONVERSIONS[category] || [];
  return conversions.find(c => c.from === from && c.to === to);
}
