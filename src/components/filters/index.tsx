import React from 'react';
import { useState } from 'react';
import { InputFilter } from './input';
import { SelectFilter } from './select';
import { ActionTypes, Conditions, DataTypes } from '../../constant';


export default function Filter({ filter, dispatch }) {
  const { columnType, columnId, options } = filter;
  const [condition, setCondition] = useState(filter.condition || '');
  const [value, setValue] = useState(filter.value || '');

  const intCondition = [
    Conditions.CONTAINS,
    Conditions.EQUALS,
    Conditions.NOT_EQUALS,
    Conditions.LESS_THAN,
    Conditions.GREATER_THAN
  ];

  const textCondition = [
    Conditions.CONTAINS,
    Conditions.NOT_EMPTY,
    Conditions.IS_EMPTY,
    Conditions.STARTS_WITH,
    Conditions.EQUALS,
    Conditions.NOT_CONTAINS,
    Conditions.NOT_EQUALS
  ];

  const handleConditionChange = (newCondition) => {
    setCondition(newCondition);
    dispatch({
      type: ActionTypes.UPDATE_FILTER,
      payload: { condition: newCondition, value },
      columnId,
    });
  };

  const handleValueChange = (newValue) => {
    setValue(newValue);
    dispatch({
      type: ActionTypes.UPDATE_FILTER,
      payload: { condition, value: newValue },
      columnId,
    });
  };

  return (
    <div className="filter-container">
      <div>
        {columnType === DataTypes.TEXT && (
          <InputFilter
            conditions={textCondition}
            columnId={columnId}
            filter={{ condition, value }}
            onChange={(filter) => {
              handleConditionChange(filter.condition);
              handleValueChange(filter.value);
            }}
          />
        )}
        {columnType === DataTypes.NUMBER && (
          <InputFilter
            conditions={intCondition}
            columnId={columnId}
            filter={{ condition, value }}
            onChange={(filter) => {
              handleConditionChange(filter.condition);
              handleValueChange(filter.value);
            }}
          />
        )}
        {(columnType === DataTypes.SELECT || columnType === DataTypes.MULTISELECT) && (
          <SelectFilter
            conditions={intCondition}
            columnId={columnId}
            options={options}
            filter={{ condition, value }}
            onChange={(filter) => {
              handleConditionChange(filter.condition);
              handleValueChange(filter.value);
            }}
          />
        )}
      </div>
    </div>
  );
}
