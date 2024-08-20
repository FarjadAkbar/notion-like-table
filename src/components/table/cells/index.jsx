import React from 'react';
import { processInitialValue } from '../../../utils';
import TextCell from './textCell';
import NumberCell from './numberCell';
import SelectCell from './selectCell';
import MultiSelectCell from './multiSelect';
import { DataTypes } from '../../../constant';

export default function Cell({
  value: initialValue,
  row: { index },
  column: { id, dataType, options },
  dataDispatch,
}) {
  // Process initialValue based on the dataType
  const processedValue = processInitialValue(dataType, initialValue);


  function getCellElement() {
    switch (dataType) {
      case DataTypes.TEXT:
        return (
          <TextCell
            initialValue={processedValue}
            rowIndex={index}
            columnId={id}
            dataDispatch={dataDispatch}
          />
        );
      case DataTypes.NUMBER:
        return (
          <NumberCell
            initialValue={processedValue}
            rowIndex={index}
            columnId={id}
            dataDispatch={dataDispatch}
          />
        );
      case DataTypes.SELECT:
        return (
          <SelectCell
            initialValue={processedValue}
            options={options}
            rowIndex={index}
            columnId={id}
            dataDispatch={dataDispatch}
          />
        );
      case DataTypes.MULTISELECT:
        return (
          <MultiSelectCell
            initialValue={processedValue}
            options={options}
            rowIndex={index}
            columnId={id}
            dataDispatch={dataDispatch}
          />
        );
      default:
        return <span></span>;
    }
  }

  return getCellElement();
}
