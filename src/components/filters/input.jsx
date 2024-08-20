import React, { useState, useRef, useEffect } from 'react';
import { usePopper } from 'react-popper';

export const InputFilter = ({ filter, columnId, onChange, conditions }) => {
  const [open, setOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const popoverRef = useRef(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  });
  
  const handleClick = (event) => {
    setOpen(true);
    setReferenceElement(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setReferenceElement(null);
  };

  const handleOutsideClick = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="d-flex">
      <div
        onClick={handleClick}
        ref={setReferenceElement}
        className="filter-label"
      >
        {columnId}
      </div>
      {open && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="popover-content"
        >
          <div ref={popoverRef}>
            <div className="form-group">
              <label htmlFor="condition">Condition</label>
              <select
                id="condition"
                value={filter.condition || ''}
                onChange={(e) => onChange({ ...filter, condition: e.target.value })}
                className="form-input is-fullwidth"
              >
                <option value="" disabled>Select condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="value">Value</label>
              <input
                id="value"
                type="text"
                value={filter.value || ''}
                onChange={(e) => onChange({ ...filter, value: e.target.value })}
                placeholder="Enter value"
                className="form-input is-fullwidth"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
