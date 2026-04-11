export interface LunaFormFieldTransform {
  type: 'none' | 'kg_to_lbs' | 'lbs_to_kg' | 'scale' | 'percentage';
  multiplier?: number;
}

export interface LunaFormField {
  id: number;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  transform?: LunaFormFieldTransform;
}

export interface LunaLogicRule {
  fieldId: number;
  condition: 'equals' | 'not_equals' | 'contains' | 'greater' | 'less';
  value: string;
  action: 'show' | 'hide' | 'require';
  targetFieldId: number;
}

export interface LunaFormSubmissionAnswer {
  fieldId: number;
  value: string;
}

export interface LunaFormSubmission {
  date: string;
  answers: LunaFormSubmissionAnswer[];
}

export interface LunaForm {
  id: number;
  title: string;
  description: string;
  fields: LunaFormField[];
  logicRules: LunaLogicRule[];
  submissions: LunaFormSubmission[];
  published: boolean;
  isTemplate: boolean;
}
