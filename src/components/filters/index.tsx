import React from 'react';
import { useState } from 'react';
import { InputFilter } from './input';
import { SelectFilter } from './select';
import { DataTypes } from '../../constant';


export default function Filter({ columnType, columnId, options }) {
  const [condition, setCondition] = useState('');
  const [value, setValue] = useState('');
  return (
    <div className="filter-container">
      <div>
        {columnType === DataTypes.TEXT && (
          <InputFilter conditions={['Contains', 'Is Empty', 'Equals', 'Starts With']} columnId={columnId} filter={{ condition, value }} onChange={(filter) => { setCondition(filter.condition); setValue(filter.value); }} />
        )}
        {columnType === DataTypes.NUMBER && (
          <InputFilter conditions={['Equals', 'Greater than', 'Less than']} columnId={columnId} filter={{ condition, value }} onChange={(filter) => { setCondition(filter.condition); setValue(filter.value); }} />
        )}
        {(columnType === DataTypes.SELECT || columnType === DataTypes.MULTISELECT) && (
          <SelectFilter options={options} filter={{ condition, value }} onChange={(filter) => { setCondition(filter.condition); setValue(filter.value); }} />
        )}
      </div>
    </div>
  );
}
