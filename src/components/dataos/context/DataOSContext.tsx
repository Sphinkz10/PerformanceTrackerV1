import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';

// ==================== TYPES ====================
export interface DataField {
  id: string;
  name: string;
  description?: string;
  type: FieldType;
  config: Record<string, any>;
  isCalculated: boolean;
  formula?: string;
  dependencies?: string[];
  validation?: ValidationRules;
  required: boolean;
  category?: string;
  unit?: string;
  icon?: string;
  color?: string;
  order: number;
  position?: { x: number; y: number }; // For visual builder
  createdAt: Date;
  updatedAt: Date;
}

export type FieldType = 
  | 'number'
  | 'time'
  | 'text'
  | 'select'
  | 'multiselect'
  | 'boolean'
  | 'rating'
  | 'date'
  | 'rpe'
  | 'load'
  | 'heartrate'
  | 'percentage'
  | 'velocity'
  | 'gps'
  | 'video'
  | 'image';

export interface ValidationRules {
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string;
  message?: string;
}

export interface DataOSApp {
  id: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  screens: Screen[];
  dataModel: DataField[];
  workflows: Workflow[];
  analytics: AnalyticsConfig;
  integrations: Integration[];
  published: boolean;
  author: string;
  price?: number;
}

export interface Screen {
  id: string;
  name: string;
  layout: 'form' | 'dashboard' | 'list' | 'detail';
  fields: string[]; // Field IDs
  actions: Action[];
}

export interface Workflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  enabled: boolean;
}

export interface WorkflowTrigger {
  type: 'field_changed' | 'session_started' | 'session_completed' | 'threshold_reached';
  config: Record<string, any>;
}

export interface WorkflowCondition {
  field: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  value: any;
}

export interface WorkflowAction {
  type: 'set_field' | 'show_notification' | 'start_timer' | 'send_email' | 'trigger_webhook';
  config: Record<string, any>;
}

export interface Action {
  id: string;
  type: 'button' | 'link' | 'menu';
  label: string;
  icon?: string;
  action: string;
}

export interface AnalyticsConfig {
  dashboards: Dashboard[];
  metrics: Metric[];
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
}

export interface Widget {
  id: string;
  type: 'metric' | 'chart' | 'gauge' | 'heatmap' | 'list';
  title: string;
  config: Record<string, any>;
}

export interface Metric {
  id: string;
  name: string;
  formula: string;
  format: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'wearable' | 'platform' | 'service';
  enabled: boolean;
  config: Record<string, any>;
}

interface DataOSState {
  currentApp: DataOSApp | null;
  apps: DataOSApp[];
  selectedFields: Set<string>;
  clipboardField: DataField | null;
  canvasMode: 'data' | 'ui' | 'logic';
  viewMode: 'builder' | 'preview' | 'code';
  zoom: number;
  showGrid: boolean;
  showAIAssistant: boolean;
  aiSuggestions: AISuggestion[];
}

export interface AISuggestion {
  id: string;
  type: 'field' | 'formula' | 'validation' | 'workflow';
  title: string;
  description: string;
  code?: string;
  confidence: number;
}

type DataOSAction =
  | { type: 'SET_CURRENT_APP'; payload: DataOSApp }
  | { type: 'ADD_FIELD'; payload: DataField }
  | { type: 'UPDATE_FIELD'; payload: { id: string; updates: Partial<DataField> } }
  | { type: 'DELETE_FIELD'; payload: string }
  | { type: 'DELETE_FIELDS'; payload: string[] }
  | { type: 'TOGGLE_FIELD_SELECTION'; payload: string }
  | { type: 'SET_SELECTED_FIELDS'; payload: Set<string> }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'COPY_FIELD'; payload: DataField }
  | { type: 'SET_CANVAS_MODE'; payload: 'data' | 'ui' | 'logic' }
  | { type: 'SET_VIEW_MODE'; payload: 'builder' | 'preview' | 'code' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'TOGGLE_GRID' }
  | { type: 'TOGGLE_AI_ASSISTANT' }
  | { type: 'ADD_AI_SUGGESTION'; payload: AISuggestion }
  | { type: 'APPLY_AI_SUGGESTION'; payload: string };

interface DataOSContextType extends DataOSState {
  dispatch: React.Dispatch<DataOSAction>;
  addField: (field: DataField) => void;
  updateField: (id: string, updates: Partial<DataField>) => void;
  deleteField: (id: string) => void;
  deleteSelectedFields: () => void;
  toggleFieldSelection: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  selectAll: () => void;
  copyField: (field: DataField) => void;
  pasteField: () => void;
  duplicateField: (id: string) => void;
  setCanvasMode: (mode: 'data' | 'ui' | 'logic') => void;
  setViewMode: (mode: 'builder' | 'preview' | 'code') => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleAIAssistant: () => void;
  askAI: (prompt: string) => Promise<void>;
  applyAISuggestion: (id: string) => void;
}

// ==================== INITIAL STATE ====================
const initialState: DataOSState = {
  currentApp: {
    id: 'app_1',
    name: 'Powerlifting Pro',
    description: 'Complete powerlifting tracking system',
    icon: 'Dumbbell',
    version: '1.0.0',
    screens: [],
    dataModel: [
      {
        id: 'weight',
        name: 'Weight',
        type: 'number',
        config: { min: 0, max: 500, decimals: 1 },
        isCalculated: false,
        required: true,
        category: 'Core',
        unit: 'kg',
        order: 1,
        position: { x: 100, y: 100 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'reps',
        name: 'Repetitions',
        type: 'number',
        config: { min: 1, max: 50 },
        isCalculated: false,
        required: true,
        category: 'Core',
        order: 2,
        position: { x: 100, y: 200 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'volume',
        name: 'Total Volume',
        type: 'number',
        config: { decimals: 0 },
        isCalculated: true,
        formula: 'weight * reps',
        dependencies: ['weight', 'reps'],
        required: false,
        category: 'Calculated',
        unit: 'kg',
        order: 3,
        position: { x: 400, y: 150 },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    workflows: [],
    analytics: { dashboards: [], metrics: [] },
    integrations: [],
    published: false,
    author: 'Coach João'
  },
  apps: [],
  selectedFields: new Set(),
  clipboardField: null,
  canvasMode: 'data',
  viewMode: 'builder',
  zoom: 100,
  showGrid: true,
  showAIAssistant: false,
  aiSuggestions: []
};

// ==================== REDUCER ====================
function dataOSReducer(state: DataOSState, action: DataOSAction): DataOSState {
  switch (action.type) {
    case 'SET_CURRENT_APP':
      return { ...state, currentApp: action.payload };
    
    case 'ADD_FIELD':
      if (!state.currentApp) return state;
      return {
        ...state,
        currentApp: {
          ...state.currentApp,
          dataModel: [...state.currentApp.dataModel, action.payload]
        }
      };
    
    case 'UPDATE_FIELD':
      if (!state.currentApp) return state;
      return {
        ...state,
        currentApp: {
          ...state.currentApp,
          dataModel: state.currentApp.dataModel.map(field =>
            field.id === action.payload.id
              ? { ...field, ...action.payload.updates, updatedAt: new Date() }
              : field
          )
        }
      };
    
    case 'DELETE_FIELD':
      if (!state.currentApp) return state;
      return {
        ...state,
        currentApp: {
          ...state.currentApp,
          dataModel: state.currentApp.dataModel.filter(f => f.id !== action.payload)
        }
      };
    
    case 'DELETE_FIELDS':
      if (!state.currentApp) return state;
      return {
        ...state,
        currentApp: {
          ...state.currentApp,
          dataModel: state.currentApp.dataModel.filter(f => !action.payload.includes(f.id))
        },
        selectedFields: new Set()
      };
    
    case 'TOGGLE_FIELD_SELECTION':
      const newSelection = new Set(state.selectedFields);
      if (newSelection.has(action.payload)) {
        newSelection.delete(action.payload);
      } else {
        newSelection.add(action.payload);
      }
      return { ...state, selectedFields: newSelection };
    
    case 'SET_SELECTED_FIELDS':
      return { ...state, selectedFields: action.payload };
    
    case 'CLEAR_SELECTION':
      return { ...state, selectedFields: new Set() };
    
    case 'COPY_FIELD':
      return { ...state, clipboardField: action.payload };
    
    case 'SET_CANVAS_MODE':
      return { ...state, canvasMode: action.payload };
    
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
    
    case 'TOGGLE_GRID':
      return { ...state, showGrid: !state.showGrid };
    
    case 'TOGGLE_AI_ASSISTANT':
      return { ...state, showAIAssistant: !state.showAIAssistant };
    
    case 'ADD_AI_SUGGESTION':
      return {
        ...state,
        aiSuggestions: [...state.aiSuggestions, action.payload]
      };
    
    case 'APPLY_AI_SUGGESTION':
      return {
        ...state,
        aiSuggestions: state.aiSuggestions.filter(s => s.id !== action.payload)
      };
    
    default:
      return state;
  }
}

// ==================== CONTEXT ====================
const DataOSContext = createContext<DataOSContextType | undefined>(undefined);

export function DataOSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataOSReducer, initialState);

  const addField = useCallback((field: DataField) => {
    dispatch({ type: 'ADD_FIELD', payload: field });
    toast.success(`Campo "${field.name}" adicionado!`);
  }, []);

  const updateField = useCallback((id: string, updates: Partial<DataField>) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { id, updates } });
    toast.success('Campo atualizado!');
  }, []);

  const deleteField = useCallback((id: string) => {
    dispatch({ type: 'DELETE_FIELD', payload: id });
    toast.success('Campo removido!');
  }, []);

  const deleteSelectedFields = useCallback(() => {
    const ids = Array.from(state.selectedFields);
    dispatch({ type: 'DELETE_FIELDS', payload: ids });
    toast.success(`${ids.length} campo(s) removido(s)!`);
  }, [state.selectedFields]);

  const toggleFieldSelection = useCallback((id: string, multiSelect = false) => {
    if (multiSelect) {
      dispatch({ type: 'TOGGLE_FIELD_SELECTION', payload: id });
    } else {
      dispatch({ type: 'SET_SELECTED_FIELDS', payload: new Set([id]) });
    }
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const selectAll = useCallback(() => {
    if (!state.currentApp) return;
    const allIds = new Set(state.currentApp.dataModel.map(f => f.id));
    dispatch({ type: 'SET_SELECTED_FIELDS', payload: allIds });
    toast.success(`${allIds.size} campos selecionados`);
  }, [state.currentApp]);

  const copyField = useCallback((field: DataField) => {
    dispatch({ type: 'COPY_FIELD', payload: field });
    toast.success('Campo copiado!');
  }, []);

  const pasteField = useCallback(() => {
    if (!state.clipboardField) {
      toast.error('Nenhum campo copiado');
      return;
    }

    const newField: DataField = {
      ...state.clipboardField,
      id: `field_${Date.now()}`,
      name: `${state.clipboardField.name} (Copy)`,
      position: state.clipboardField.position
        ? { x: state.clipboardField.position.x + 50, y: state.clipboardField.position.y + 50 }
        : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch({ type: 'ADD_FIELD', payload: newField });
    toast.success('Campo colado!');
  }, [state.clipboardField]);

  const duplicateField = useCallback((id: string) => {
    if (!state.currentApp) return;
    const field = state.currentApp.dataModel.find(f => f.id === id);
    if (!field) return;

    copyField(field);
    pasteField();
  }, [state.currentApp, copyField, pasteField]);

  const setCanvasMode = useCallback((mode: 'data' | 'ui' | 'logic') => {
    dispatch({ type: 'SET_CANVAS_MODE', payload: mode });
  }, []);

  const setViewMode = useCallback((mode: 'builder' | 'preview' | 'code') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: Math.max(50, Math.min(200, zoom)) });
  }, []);

  const toggleGrid = useCallback(() => {
    dispatch({ type: 'TOGGLE_GRID' });
  }, []);

  const toggleAIAssistant = useCallback(() => {
    dispatch({ type: 'TOGGLE_AI_ASSISTANT' });
  }, []);

  const askAI = useCallback(async (prompt: string) => {
    toast.info('AI analisando...');
    
    // Simulate AI processing
    setTimeout(() => {
      const suggestion: AISuggestion = {
        id: `suggestion_${Date.now()}`,
        type: 'field',
        title: 'Campo sugerido: Velocity',
        description: 'Adicionar campo de velocidade da barra para treino baseado em velocidade',
        code: `{
  id: 'velocity',
  name: 'Bar Velocity',
  type: 'velocity',
  unit: 'm/s',
  config: { min: 0, max: 3, decimals: 2 }
}`,
        confidence: 0.92
      };
      
      dispatch({ type: 'ADD_AI_SUGGESTION', payload: suggestion });
      toast.success('AI gerou uma sugestão!');
    }, 1500);
  }, []);

  const applyAISuggestion = useCallback((id: string) => {
    dispatch({ type: 'APPLY_AI_SUGGESTION', payload: id });
    toast.success('Sugestão aplicada!');
  }, []);

  const value: DataOSContextType = {
    ...state,
    dispatch,
    addField,
    updateField,
    deleteField,
    deleteSelectedFields,
    toggleFieldSelection,
    clearSelection,
    selectAll,
    copyField,
    pasteField,
    duplicateField,
    setCanvasMode,
    setViewMode,
    setZoom,
    toggleGrid,
    toggleAIAssistant,
    askAI,
    applyAISuggestion
  };

  return (
    <DataOSContext.Provider value={value}>
      {children}
    </DataOSContext.Provider>
  );
}

export function useDataOS() {
  const context = useContext(DataOSContext);
  if (!context) {
    throw new Error('useDataOS must be used within DataOSProvider');
  }
  return context;
}
