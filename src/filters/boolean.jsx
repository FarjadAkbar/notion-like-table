export const BooleanFilter = ({ filter, onChange }) => {
    return (
      <div className="filter-row">
        <select
          value={filter.value}
          onChange={(e) => onChange({ ...filter, value: e.target.value === 'true' })}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
    );
  };
  