import React from "react";

export const NumberFilter = ({ filter, columnId, onChange }) => {
    const conditions = ['Equals', 'Greater than', 'Less than'];
  
    return (
      <div className="filter-row">
        <label htmlFor="">{columnId}</label>
        <select
          value={filter.condition}
          onChange={(e) => onChange({ ...filter, condition: e.target.value })}
        >
          <option value="" disabled>
            Select condition
          </option>
          {conditions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={filter.value}
          onChange={(e) => onChange({ ...filter, value: Number(e.target.value) })}
          placeholder="Enter value"
        />
      </div>
    );
  };
  