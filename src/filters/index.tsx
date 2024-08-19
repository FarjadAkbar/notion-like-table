import React from 'react';
import { useState } from 'react';
import { TextFilter } from './text';
import { NumberFilter } from './number';
import { BooleanFilter } from './boolean';
import { SelectFilter } from './select';

export function Filter({ columnType, columnId, options }) {
  const [condition, setCondition] = useState('');
  const [value, setValue] = useState('');
console.log(columnType)
  return (
    <div className="filter-container">
      <div>
        {columnType === 'text' && (
          <TextFilter columnId={columnId} filter={{ condition, value }} onChange={(filter) => { setCondition(filter.condition); setValue(filter.value); }} />
        )}
        {columnType === 'number' && (
          <NumberFilter columnId={columnId} filter={{ condition, value }} onChange={(filter) => { setCondition(filter.condition); setValue(filter.value); }} />
        )}
        {columnType === 'select' && (
          <SelectFilter options={options} filter={{ condition, value }} onChange={(filter) => { setCondition(filter.condition); setValue(filter.value); }} />
        )}
        {columnType === 'boolean' && (
          <BooleanFilter filter={{ condition, value }} onChange={(filter) => { setCondition(filter.condition); setValue(filter.value); }} />
        )}
      </div>
    </div>
  );
}
