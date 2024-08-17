export const TextFilter = ({ filter, columnId, onChange }) => {
    const conditions = ['Contains', 'Is Empty', 'Equals', 'Starts With'];
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
          type="text"
          value={filter.value}
          onChange={(e) => onChange({ ...filter, value: e.target.value })}
          placeholder="Enter value"
        />
      </div>
    );
  };
  