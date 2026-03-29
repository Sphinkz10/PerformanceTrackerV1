/**
 * TRANSFORMATIONS TEST SUITE - SEMANA 5 ✅
 * 
 * Tests for form field transformations:
 * - Unit conversions
 * - Custom formulas
 * - Categorical mappings
 * - Error handling
 * 
 * @since Semana 5 - Form Center
 */

import { previewTransformation } from '@/hooks/useFormSubmissions';

describe('Form Field Transformations', () => {
  
  // ============================================================================
  // UNIT CONVERSIONS
  // ============================================================================
  describe('Unit Conversions', () => {
    
    test('kg to lbs conversion', () => {
      const result = previewTransformation(100, {
        type: 'unit_conversion',
        multiplier: 2.205
      });
      
      expect(result.transformed).toBe(220.5);
      expect(result.original).toBe(100);
    });

    test('cm to inches conversion', () => {
      const result = previewTransformation(180, {
        type: 'unit_conversion',
        multiplier: 0.3937
      });
      
      expect(result.transformed).toBeCloseTo(70.87, 2);
    });

    test('celsius to fahrenheit', () => {
      const result = previewTransformation(25, {
        type: 'unit_conversion',
        multiplier: 1.8,
        offset: 32
      });
      
      expect(result.transformed).toBe(77);
    });

    test('meters to kilometers', () => {
      const result = previewTransformation(5000, {
        type: 'unit_conversion',
        multiplier: 0.001
      });
      
      expect(result.transformed).toBe(5);
    });
  });

  // ============================================================================
  // CUSTOM FORMULAS
  // ============================================================================
  describe('Custom Formulas', () => {
    
    test('BMI calculation', () => {
      // weight(kg) / (height(m)^2)
      // Assuming height is 1.80m and we're transforming weight
      const result = previewTransformation(80, {
        type: 'formula',
        formula: 'value / (1.80 * 1.80)'
      });
      
      expect(result.transformed).toBeCloseTo(24.69, 2);
    });

    test('1RM estimation (Brzycki)', () => {
      // 1RM = weight / (1.0278 - 0.0278 * reps)
      const result = previewTransformation(100, {
        type: 'formula',
        formula: 'value / (1.0278 - 0.0278 * 5)' // 100kg x 5 reps
      });
      
      expect(result.transformed).toBeCloseTo(112.55, 2);
    });

    test('Percentage of max', () => {
      const result = previewTransformation(80, {
        type: 'formula',
        formula: '(value / 100) * 100' // 80% of 100kg max
      });
      
      expect(result.transformed).toBe(80);
    });

    test('Speed calculation', () => {
      // speed = distance / time
      const result = previewTransformation(100, {
        type: 'formula',
        formula: 'value / 10' // 100m in 10s
      });
      
      expect(result.transformed).toBe(10); // 10 m/s
    });
  });

  // ============================================================================
  // CATEGORICAL MAPPINGS
  // ============================================================================
  describe('Categorical Mappings', () => {
    
    test('RPE scale to numeric', () => {
      const mapping = {
        'muito_leve': 1,
        'leve': 3,
        'moderado': 5,
        'pesado': 7,
        'muito_pesado': 9
      };

      const result = previewTransformation('pesado', {
        type: 'mapping',
        mapping
      });
      
      expect(result.transformed).toBe(7);
    });

    test('Quality rating to score', () => {
      const mapping = {
        'excellent': 5,
        'good': 4,
        'fair': 3,
        'poor': 2,
        'very_poor': 1
      };

      const result = previewTransformation('good', {
        type: 'mapping',
        mapping
      });
      
      expect(result.transformed).toBe(4);
    });

    test('Yes/No to boolean', () => {
      const mapping = {
        'sim': true,
        'não': false,
        'yes': true,
        'no': false
      };

      const result = previewTransformation('sim', {
        type: 'mapping',
        mapping
      });
      
      expect(result.transformed).toBe(true);
    });

    test('Unmapped value returns original', () => {
      const mapping = {
        'a': 1,
        'b': 2
      };

      const result = previewTransformation('c', {
        type: 'mapping',
        mapping
      });
      
      expect(result.transformed).toBe('c');
    });
  });

  // ============================================================================
  // NO TRANSFORMATION
  // ============================================================================
  describe('No Transformation', () => {
    
    test('passthrough numeric', () => {
      const result = previewTransformation(42, {
        type: 'none'
      });
      
      expect(result.transformed).toBe(42);
    });

    test('passthrough string', () => {
      const result = previewTransformation('hello', {
        type: 'none'
      });
      
      expect(result.transformed).toBe('hello');
    });
  });

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================
  describe('Error Handling', () => {
    
    test('invalid number returns null', () => {
      const result = previewTransformation('not-a-number', {
        type: 'unit_conversion',
        multiplier: 2
      });
      
      expect(result.transformed).toBe('not-a-number'); // Falls back to original
    });

    test('invalid formula returns error', () => {
      const result = previewTransformation(10, {
        type: 'formula',
        formula: 'invalid javascript syntax {'
      });
      
      expect(result.transformed).toBe('Error');
    });

    test('zero multiplier', () => {
      const result = previewTransformation(100, {
        type: 'unit_conversion',
        multiplier: 0
      });
      
      expect(result.transformed).toBe(0);
    });
  });

  // ============================================================================
  // COMPLEX SCENARIOS
  // ============================================================================
  describe('Complex Scenarios', () => {
    
    test('multi-step transformation (theoretical)', () => {
      // In practice, would be multiple transformations
      // 1. Convert lbs to kg
      const step1 = previewTransformation(220, {
        type: 'unit_conversion',
        multiplier: 0.4536 // lbs to kg
      });
      
      // 2. Calculate 1RM
      const step2 = previewTransformation(step1.transformed, {
        type: 'formula',
        formula: 'value / (1.0278 - 0.0278 * 5)'
      });
      
      expect(step2.transformed).toBeGreaterThan(100);
    });

    test('conditional transformation (via mapping then formula)', () => {
      // Map "heavy" to 0.9, then multiply by max
      const qualityMap = {
        'light': 0.5,
        'medium': 0.7,
        'heavy': 0.9
      };

      const step1 = previewTransformation('heavy', {
        type: 'mapping',
        mapping: qualityMap
      });

      const step2 = previewTransformation(step1.transformed, {
        type: 'formula',
        formula: 'value * 150' // 90% of 150kg max
      });

      expect(step2.transformed).toBe(135);
    });
  });

  // ============================================================================
  // REAL-WORLD EXAMPLES
  // ============================================================================
  describe('Real-World Form Examples', () => {
    
    test('Body weight submission (lbs to kg)', () => {
      const result = previewTransformation(176, {
        type: 'unit_conversion',
        multiplier: 0.4536
      });
      
      expect(result.transformed).toBeCloseTo(79.83, 2);
    });

    test('Sleep quality (text to numeric)', () => {
      const mapping = {
        'péssimo': 1,
        'ruim': 2,
        'regular': 3,
        'bom': 4,
        'ótimo': 5
      };

      const result = previewTransformation('bom', {
        type: 'mapping',
        mapping
      });
      
      expect(result.transformed).toBe(4);
    });

    test('Stress level (1-10 to 0-100)', () => {
      const result = previewTransformation(7, {
        type: 'formula',
        formula: 'value * 10'
      });
      
      expect(result.transformed).toBe(70);
    });

    test('Running pace (min/km to m/s)', () => {
      // 5:00 min/km = 5 minutes = 300 seconds per 1000m
      // speed = 1000 / 300 = 3.33 m/s
      const result = previewTransformation(5, {
        type: 'formula',
        formula: '1000 / (value * 60)'
      });
      
      expect(result.transformed).toBeCloseTo(3.33, 2);
    });
  });
});

// ============================================================================
// EXPORT TEST UTILITIES
// ============================================================================

export const testTransformations = {
  unitConversions: {
    kgToLbs: (kg: number) => kg * 2.205,
    lbsToKg: (lbs: number) => lbs * 0.4536,
    cmToInches: (cm: number) => cm * 0.3937,
    inchesToCm: (inches: number) => inches * 2.54,
    celsiusToFahrenheit: (c: number) => c * 1.8 + 32,
    fahrenheitToCelsius: (f: number) => (f - 32) / 1.8
  },
  formulas: {
    bmi: (weight: number, height: number) => weight / (height * height),
    oneRepMax: (weight: number, reps: number) => weight / (1.0278 - 0.0278 * reps),
    percentageOfMax: (weight: number, max: number) => (weight / max) * 100,
    speed: (distance: number, time: number) => distance / time
  }
};
