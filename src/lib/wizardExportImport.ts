/**
 * WIZARD EXPORT/IMPORT UTILITIES
 * Export wizard configuration to JSON / Import from JSON
 * 
 * FEATURES:
 * - Export to clipboard (JSON)
 * - Import from clipboard
 * - Download as .json file
 * - Upload .json file
 * - Schema validation
 */

interface WizardExportData {
  version: string;
  exportedAt: number;
  name: string;
  description: string;
  type: string;
  unit: string;
  scaleMin?: number;
  scaleMax?: number;
  zones: Array<{
    id: string;
    name: string;
    color: string;
    min: number;
    max: number;
  }>;
  baselineMethod: string;
  baselinePeriodDays: number;
  baselineManualValue?: number;
  category: string;
  tags: string[];
  updateFrequency: string;
}

const CURRENT_VERSION = '1.0.0';

/**
 * Export wizard data to JSON string
 */
export function exportWizardToJSON(data: any): string {
  const exportData: WizardExportData = {
    version: CURRENT_VERSION,
    exportedAt: Date.now(),
    name: data.name,
    description: data.description,
    type: data.type,
    unit: data.unit,
    scaleMin: data.scaleMin,
    scaleMax: data.scaleMax,
    zones: data.zones,
    baselineMethod: data.baselineMethod,
    baselinePeriodDays: data.baselinePeriodDays,
    baselineManualValue: data.baselineManualValue,
    category: data.category,
    tags: data.tags,
    updateFrequency: data.updateFrequency,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Copy JSON to clipboard
 */
export async function copyToClipboard(json: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(json);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Download JSON as file
 */
export function downloadAsFile(json: string, filename: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import wizard data from JSON string
 */
export function importWizardFromJSON(json: string): WizardExportData | null {
  try {
    const data = JSON.parse(json) as WizardExportData;

    // Validate schema
    if (!validateWizardSchema(data)) {
      throw new Error('Invalid wizard configuration schema');
    }

    return data;
  } catch (error) {
    console.error('Failed to import wizard configuration:', error);
    return null;
  }
}

/**
 * Read JSON from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    return null;
  }
}

/**
 * Read JSON from uploaded file
 */
export function readFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Validate wizard schema
 */
function validateWizardSchema(data: any): boolean {
  // Check required fields
  const requiredFields = [
    'version',
    'exportedAt',
    'name',
    'type',
  ];

  for (const field of requiredFields) {
    if (!(field in data)) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }

  // Check version compatibility
  if (!isVersionCompatible(data.version)) {
    console.error(`Incompatible version: ${data.version}`);
    return false;
  }

  // Check zones array
  if (data.zones && !Array.isArray(data.zones)) {
    console.error('Zones must be an array');
    return false;
  }

  // Validate zone structure
  if (data.zones) {
    for (const zone of data.zones) {
      if (!zone.id || !zone.name || !zone.color || zone.min === undefined || zone.max === undefined) {
        console.error('Invalid zone structure:', zone);
        return false;
      }
    }
  }

  // Check tags array
  if (data.tags && !Array.isArray(data.tags)) {
    console.error('Tags must be an array');
    return false;
  }

  return true;
}

/**
 * Check if version is compatible
 */
function isVersionCompatible(version: string): boolean {
  // For now, only accept exact version match
  // In future, could support backward compatibility
  return version === CURRENT_VERSION;
}

/**
 * Generate filename based on metric name and date
 */
export function generateFilename(metricName: string): string {
  const sanitized = metricName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const date = new Date().toISOString().split('T')[0];
  
  return `metric-${sanitized}-${date}`;
}

/**
 * Merge imported data with current wizard data
 * (useful for partial imports)
 */
export function mergeWizardData(current: any, imported: WizardExportData): any {
  return {
    ...current,
    name: imported.name,
    description: imported.description,
    type: imported.type,
    unit: imported.unit,
    scaleMin: imported.scaleMin,
    scaleMax: imported.scaleMax,
    zones: imported.zones,
    baselineMethod: imported.baselineMethod,
    baselinePeriodDays: imported.baselinePeriodDays,
    baselineManualValue: imported.baselineManualValue,
    category: imported.category,
    tags: imported.tags,
    updateFrequency: imported.updateFrequency,
  };
}
