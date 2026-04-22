export interface Field {
  name: string;          // backend key
  label: string;         // UI label

  type: 'text' | 'date' | 'select' | 'number';

  operators: {
    label: string;
    value: string;
  }[];

  // for dropdown
  options?: { label: string; value: any }[];

  // decides UI control
  controlType: 'input' | 'select' | 'date';
}

export interface QueryRule {
  field: Field | null;
  operator: string;
  value: any;
}

export interface QueryGroup {
  condition: 'AND' | 'OR';
  rules: (QueryRule | QueryGroup)[];
}

