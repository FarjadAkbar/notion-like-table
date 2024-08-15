import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import Badge from '../Badge';
import { grey } from '../colors';
import PlusIcon from '../img/Plus';
import { ActionTypes, randomColor } from '../utils';

export default function MultiSelectCell({
  initialValue,
  options,
  columnId,
  rowIndex,
  dataDispatch,
}) {
  const [selectRef, setSelectRef] = useState(null);
  const [selectPop, setSelectPop] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addSelectRef, setAddSelectRef] = useState(null);
  const [selectedValues, setSelectedValues] = useState(initialValue || []);
  const { styles, attributes } = usePopper(selectRef, selectPop, {
    placement: 'bottom-start',
    strategy: 'fixed',
  });

  useEffect(() => {
    setSelectedValues(initialValue || []);
  }, [initialValue]);

  useEffect(() => {
    if (selectedValues.length) {
      dataDispatch({
        type: ActionTypes.UPDATE_CELL,
        columnId,
        rowIndex,
        value: selectedValues,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValues, columnId, rowIndex]);

  useEffect(() => {
    if (addSelectRef && showAdd) {
      addSelectRef.focus();
    }
  }, [addSelectRef, showAdd]);

  function getColor(label) {
    let match = options.find(option => option.label === label);
    return (match && match.backgroundColor) || grey(200);
  }

  function handleAddOption(e) {
    setShowAdd(true);
  }

  function handleOptionKeyDown(e) {
    if (e.key === 'Enter') {
      if (e.target.value !== '') {
        dataDispatch({
          type: ActionTypes.ADD_OPTION_TO_COLUMN,
          option: e.target.value,
          backgroundColor: randomColor(),
          columnId,
        });
      }
      setShowAdd(false);
    }
  }

  function handleOptionBlur(e) {
    if (e.target.value !== '') {
      dataDispatch({
        type: ActionTypes.ADD_OPTION_TO_COLUMN,
        option: e.target.value,
        backgroundColor: randomColor(),
        columnId,
      });
    }
    setShowAdd(false);
  }

  function handleOptionClick(option) {
    if (selectedValues.includes(option.label)) {
      setSelectedValues(selectedValues.filter(value => value !== option.label));
    } else {
      setSelectedValues([...selectedValues, option.label]);
    }
  }

  return (
    <>
      <div
        ref={setSelectRef}
        className="cell-padding d-flex cursor-default align-items-center flex-1" style={{ height: "100%" }}
        onClick={() => setShowSelect(true)}
      >
        {selectedValues.map(value => (
          <Badge key={value} value={value} backgroundColor={getColor(value)} />
        ))}
      </div>
      {showSelect && (
        <div className="overlay" onClick={() => setShowSelect(false)} />
      )}
      {showSelect &&
        createPortal(
          <div
            className="shadow-5 bg-white border-radius-md"
            ref={setSelectPop}
            {...attributes.popper}
            style={{
              ...styles.popper,
              zIndex: 4,
              minWidth: 200,
              maxWidth: 320,
              maxHeight: 400,
              padding: '0.75rem',
              overflow: 'auto',
            }}
          >
            <div
              className="d-flex flex-wrap-wrap"
              style={{ marginTop: '-0.5rem' }}
            >
              {options.map(option => (
                <div
                  key={option.label}
                  className="cursor-pointer mr-5 mt-5"
                  onClick={() => handleOptionClick(option)}
                >
                  <Badge
                    value={option.label}
                    backgroundColor={option.backgroundColor}
                  />
                </div>
              ))}
              {showAdd && (
                <div
                  className="mr-5 mt-5 bg-grey-200 border-radius-sm"
                  style={{
                    width: 120,
                    padding: '2px 4px',
                  }}
                >
                  <input
                    type="text"
                    className="option-input"
                    onBlur={handleOptionBlur}
                    ref={setAddSelectRef}
                    onKeyDown={handleOptionKeyDown}
                  />
                </div>
              )}
              <div
                className="cursor-pointer mr-5 mt-5"
                onClick={handleAddOption}
              >
                <Badge
                  value={
                    <span className="svg-icon-sm svg-text">
                      <PlusIcon />
                    </span>
                  }
                  backgroundColor={grey(200)}
                />
              </div>
            </div>
          </div>,
          document.querySelector('#popper-portal')
        )}
    </>
  );
}
