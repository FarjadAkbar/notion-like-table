import update from 'immutability-helper';
import { ActionTypes, DataTypes } from '../constant';
import { randomColor, shortId } from '../utils';


export function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_OPTION_TO_COLUMN:
      return handleAddOptionToColumn(state, action);
    case ActionTypes.ADD_ROW:
      return handleAddRow(state, action);
    case ActionTypes.UPDATE_COLUMN_TYPE:
      return handleUpdateColumnType(state, action);
    case ActionTypes.UPDATE_COLUMN_HEADER:
      return handleUpdateColumnHeader(state, action);
    case ActionTypes.UPDATE_CELL:
      return handleUpdateCell(state, action);
    case ActionTypes.ADD_COLUMN_TO_LEFT:
      return handleAddColumnToLeft(state, action);
    case ActionTypes.ADD_COLUMN_TO_RIGHT:
      return handleAddColumnToRight(state, action);
    case ActionTypes.DELETE_COLUMN:
      return handleDeleteColumn(state, action);
    case ActionTypes.ENABLE_RESET:
      return handleEnableReset(state, action);
    case ActionTypes.REORDER_COLUMNS:
      return handleReorderColumns(state, action);
    case ActionTypes.ADD_FILTER:
      return handleAddFilter(state, action);
    case ActionTypes.UPDATE_FILTER:
      return handleUpdateFilter(state, action);
    case ActionTypes.REMOVE_FILTER:
      return handleRemoveFilter(state, action);
    case ActionTypes.APPLY_FILTERS:
      alert('apply');
      // Implement the logic to apply filters to your data
      return state;
    default:
      return state;
  }
}

function handleAddOptionToColumn(state, action) {
  const optionIndex = state.columns.findIndex(
    column => column.id === action.columnId
  );
  return update(state, {
    skipReset: { $set: true },
    columns: {
      [optionIndex]: {
        options: {
          $push: [
            {
              label: action.option,
              backgroundColor: action.backgroundColor,
            },
          ],
        },
      },
    },
  });
}

function handleAddRow(state, action) {
  return update(state, {
    skipReset: { $set: true },
    data: { $push: [{}] },
  });
}

function handleUpdateColumnType(state, action) {
  const typeIndex = state.columns.findIndex(
    column => column.id === action.columnId
  );
  switch (action.dataType) {
    case DataTypes.NUMBER:
      if (state.columns[typeIndex].dataType === DataTypes.NUMBER) {
        return state;
      } else {
        return update(state, {
          skipReset: { $set: true },
          columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
          data: {
            $apply: data =>
              data.map(row => ({
                ...row,
                [action.columnId]: isNaN(row[action.columnId])
                  ? ''
                  : Number.parseInt(row[action.columnId]),
              })),
          },
        });
      }
    case DataTypes.SELECT:
      if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
        return state;
      } else {
        let options = [];
        state.data.forEach(row => {
          if (row[action.columnId]) {
            options.push({
              label: row[action.columnId],
              backgroundColor: randomColor(),
            });
          }
        });
        return update(state, {
          skipReset: { $set: true },
          columns: {
            [typeIndex]: {
              dataType: { $set: action.dataType },
              options: { $push: options },
            },
          },
        });
      }
    case DataTypes.TEXT:
      if (state.columns[typeIndex].dataType === DataTypes.TEXT) {
        return state;
      } else if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
        return update(state, {
          skipReset: { $set: true },
          columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
        });
      } else {
        return update(state, {
          skipReset: { $set: true },
          columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
          data: {
            $apply: data =>
              data.map(row => ({
                ...row,
                [action.columnId]: row[action.columnId] + '',
              })),
          },
        });
      }
    default:
      return state;
  }
}

function handleUpdateColumnHeader(state, action) {
  const index = state.columns.findIndex(
    column => column.id === action.columnId
  );
  return update(state, {
    skipReset: { $set: true },
    columns: { [index]: { label: { $set: action.label } } },
  });
}

function handleUpdateCell(state, action) {
  return update(state, {
    skipReset: { $set: true },
    data: {
      [action.rowIndex]: { [action.columnId]: { $set: action.value } },
    },
  });
}

function handleAddColumnToLeft(state, action) {
  const leftIndex = state.columns.findIndex(
    column => column.id === action.columnId
  );
  let leftId = shortId();
  return update(state, {
    skipReset: { $set: true },
    columns: {
      $splice: [
        [
          leftIndex,
          0,
          {
            id: leftId,
            label: 'Column',
            accessor: leftId,
            dataType: DataTypes.TEXT,
            created: action.focus && true,
            options: [],
          },
        ],
      ],
    },
  });
}

function handleAddColumnToRight(state, action) {
  const rightIndex = state.columns.findIndex(
    column => column.id === action.columnId
  );
  const rightId = shortId();
  return update(state, {
    skipReset: { $set: true },
    columns: {
      $splice: [
        [
          rightIndex + 1,
          0,
          {
            id: rightId,
            label: 'Column',
            accessor: rightId,
            dataType: DataTypes.TEXT,
            created: action.focus && true,
            options: [],
          },
        ],
      ],
    },
  });
}

function handleDeleteColumn(state, action) {
  const deleteIndex = state.columns.findIndex(
    column => column.id === action.columnId
  );
  return update(state, {
    skipReset: { $set: true },
    columns: { $splice: [[deleteIndex, 1]] },
  });
}

function handleEnableReset(state, action) {
  return update(state, { skipReset: { $set: true } });
}

function handleReorderColumns(state, action) {
  const { sourceIndex, destinationIndex } = action;
  const reorderedColumns = Array.from(state.columns);
  const [removed] = reorderedColumns.splice(sourceIndex, 1);
  reorderedColumns.splice(destinationIndex, 0, removed);
  return {
    ...state,
    columns: reorderedColumns,
  };
}

function handleAddFilter(state, action) {
  const existingFilterIndex = state.filters.findIndex(
    filter =>
      filter.columnId === action.columnId &&
      filter.columnType === action.payload.columnType
  );
  let newFilters;
  if (existingFilterIndex !== -1) {
    // Update the existing filter
    newFilters = state.filters.map((filter, index) =>
      index === existingFilterIndex
        ? { ...filter, ...action.payload } // update the filter with the new payload
        : filter
    );
  } else {
    // Add the new filter
    newFilters = [
      ...state.filters,
      { columnId: action.columnId, ...action.payload },
    ];
  }
  return { ...state, filters: newFilters, skipReset: true };
}

function handleUpdateFilter(state, action) {
  return {
    ...state,
    filters: state.filters.map((filter) =>
      filter.columnId === action.columnId ? { ...filter, ...action.payload } : filter
    ),
  };
}

function handleRemoveFilter(state, action) {
  return {
    ...state,
    filters: state.filters.filter((_, index) => index !== action.index),
  };
}


function handleSearchFilter(state, action) {
  return {
    ...state,
    filters: state.filters.map((filter, index) =>
      index === action.index
        ? { ...filter, searchTerm: action.payload }
        : filter
    ),
  };
}