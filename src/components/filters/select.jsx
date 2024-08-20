export const SelectFilter = ({ filter, options, onChange }) => {
    return (
      <div className="filter-row">
        <select
          multiple
          value={filter.value}
          onChange={(e) =>
            onChange({
              ...filter,
              value: Array.from(e.target.selectedOptions, (option) => option.value),
            })
          }
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };
  