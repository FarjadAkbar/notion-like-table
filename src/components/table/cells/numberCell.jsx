import React, { useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { ActionTypes } from '../../../constant';

export default function NumberCell({
  initialValue,
  columnId,
  rowIndex,
  dataDispatch,
}) {
  const [value, setValue] = useState({ value: initialValue, update: false });

  function onChange(e) {
    const newValue = e.target.value;

    // Check if the newValue is a valid number or empty
    if (newValue === '' || !isNaN(newValue)) {
      setValue({ value: newValue, update: false });
    } else {
      // Show an alert for non-numeric values
      alert('Only numeric values are allowed.');
    }
  }

  function onBlur() {
    // Only update if the value is valid and has been changed
    if (!isNaN(value.value)) {
      setValue(old => ({ value: old.value, update: true }));
    }
  }

  useEffect(() => {
    setValue({ value: initialValue, update: false });
  }, [initialValue]);

  useEffect(() => {
    if (value.update) {
      dataDispatch({
        type: ActionTypes.UPDATE_CELL,
        columnId,
        rowIndex,
        value: value.value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.update, columnId, rowIndex]);

  return (
    <ContentEditable
      html={(value.value && value.value.toString()) || ''}
      onChange={onChange}
      onBlur={onBlur}
      className="data-input text-align-right"
    />
  );
}
