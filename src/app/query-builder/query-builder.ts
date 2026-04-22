import { CommonModule } from '@angular/common';
import { Component, Input, signal, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { QueryGroup, QueryRule, Field } from '../interfaces';
@Component({
  selector: 'querybuilder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  templateUrl: './query-builder.html',
  styleUrl: './query-builder.scss',
})
export class QueryBuilder {
  @Input({ required: true }) fields!: Field[];
  @Input() conditions: string[] = ['AND', 'OR'];
  @Input() operators =[];
  @Output() submitQuery = new EventEmitter<any>();
  isSubmitted = false;

  finalQuery: any = null;
  query = signal<QueryGroup>({
    condition: 'AND',
    rules: [
      {
        field: null,
        operator: '',
        value: ''
      }
    ]
  });

addRule(group: QueryGroup) {
  group.rules.push({
    field: null,
    operator: '',
    value: ''
  });
  this.invalidateQuery();
}

private invalidateQuery() {
  this.isSubmitted = false;
  this.finalQuery = null;
}

addGroup(group: QueryGroup) {
  group.rules.push({
    condition: 'AND',
    rules: [{ field: null, operator: '', value: '' }]
  });
  this.invalidateQuery();
}
 
removeRule(group: QueryGroup, index: number) {
  group.rules.splice(index, 1);

  this.query.update(q => ({ ...q })); // trigger change
  this.invalidateQuery();
}

  isGroup(item: any): item is QueryGroup {
    return 'condition' in item;
  }

onFieldChange(rule: QueryRule) {
  rule.operator = '';
  rule.value = null;
  this.invalidateQuery();
}

onSubmit() {
  const cleanQuery = this.buildCleanQuery(this.query());

  this.finalQuery = cleanQuery;
  this.isSubmitted = true;

  this.submitQuery.emit(cleanQuery);
}
  buildCleanQuery(group: QueryGroup): any {
    const rules = group.rules
      .map(rule => {

        // Nested group
        if (this.isGroup(rule)) {
          const nested = this.buildCleanQuery(rule);
          return nested.rules.length ? nested : null;
        }

        // Skip incomplete rules
        if (!rule.field || !rule.operator || !rule.value) {
          return null;
        }

        return {
          field: rule.field.name,
          operator: rule.operator,
          value: rule.value
        };
      })
      .filter(r => r !== null);

    return {
      condition: group.condition,
      rules: rules
    };
  }

  onClear() {
  this.query.set({
    condition: 'AND',
    rules: [{ field: null, operator: '', value: '' }]
  });

  this.finalQuery = null;
  this.isSubmitted = false; 
}

  isQueryValid(group: QueryGroup = this.query()): boolean {
  if (!group.rules.length) return false;

  return group.rules.every(rule => {

    // ✅ Nested group → validate recursively
    if (this.isGroup(rule)) {
      return this.isQueryValid(rule);
    }

    // ✅ Rule validation
    return (
      rule.field &&
      rule.operator &&
      rule.value !== null &&
      rule.value !== undefined &&
      rule.value !== ''
    );
  });
}

  isQueryEmpty(group: QueryGroup = this.query()): boolean {
  if (!group.rules.length) return true;

  return group.rules.every(rule => {

    // Nested group
    if (this.isGroup(rule)) {
      return this.isQueryEmpty(rule);
    }

    // Rule is empty if nothing selected
    return (
      !rule.field &&
      !rule.operator &&
      (rule.value === null || rule.value === undefined || rule.value === '')
    );
  });
}
}