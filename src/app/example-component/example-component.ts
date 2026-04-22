import { Component } from '@angular/core';
import { QueryBuilder } from '../query-builder/query-builder';
import { Field } from '../interfaces';

@Component({
  selector: 'app-example-component',
  imports: [QueryBuilder],
  templateUrl: './example-component.html',
  styleUrl: './example-component.scss',
})
export class ExampleComponent {

  fields: Field[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    controlType: 'input',
    operators: [
      { label: 'Equal', value: '=' },
      { label: 'Not Equal', value: '!=' },
      { label: 'Contains', value: 'contains' },
      { label: 'Not Contains', value: 'not_contains' }
    ]
  },
  {
    name: 'createdDate',
    label: 'Created Date',
    type: 'date',
    controlType: 'date',
    operators: [
      { label: 'Equal', value: '=' },
      { label: 'Not Equal', value: '!=' },
      { label: 'Before', value: '<' },
      { label: 'After', value: '>' }
    ]
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    controlType: 'select',
    options: [
      { label: 'Active', value: 'A' },
      { label: 'Inactive', value: 'I' },
      { label: 'Pending', value: 'P' }
    ],
    operators: [
      { label: 'Equal', value: '=' },
      { label: 'Not Equal', value: '!=' }
    ]
  }
];

onQueryChange(query: any) {
  console.log('Received Query:', query);
}
}
