export interface Field {
  name: string;
  type: 'text' | 'date' | 'select';
  operators: { name: string; value: string }[];
  options?: string[];
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

