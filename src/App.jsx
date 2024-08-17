import React, { useEffect, useReducer } from 'react';
import './style.css';
import Table from './Table';
import {
  randomColor,
  shortId,
  makeData,
  ActionTypes,
  DataTypes,
} from './utils';
import update from 'immutability-helper';
import { Filter } from './filters';

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_OPTION_TO_COLUMN:
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
    case ActionTypes.ADD_ROW:
      return update(state, {
        skipReset: { $set: true },
        data: { $push: [{}] },
      });
    case ActionTypes.UPDATE_COLUMN_TYPE:
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
    case ActionTypes.UPDATE_COLUMN_HEADER:
      const index = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: { [index]: { label: { $set: action.label } } },
      });
    case ActionTypes.UPDATE_CELL:
      return update(state, {
        skipReset: { $set: true },
        data: {
          [action.rowIndex]: { [action.columnId]: { $set: action.value } },
        },
      });
    case ActionTypes.ADD_COLUMN_TO_LEFT:
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
    case ActionTypes.ADD_COLUMN_TO_RIGHT:
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
    case ActionTypes.DELETE_COLUMN:
      const deleteIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: { $splice: [[deleteIndex, 1]] },
      });
    case ActionTypes.ENABLE_RESET:
      return update(state, { skipReset: { $set: true } });
    case ActionTypes.REORDER_COLUMNS:
      const { sourceIndex, destinationIndex } = action;
      const reorderedColumns = Array.from(state.columns);
      const [removed] = reorderedColumns.splice(sourceIndex, 1);
      reorderedColumns.splice(destinationIndex, 0, removed);
      return {
        ...state,
        columns: reorderedColumns,
      };
    case ActionTypes.ADD_FILTER:
      const existingFilterIndex = state.filters.findIndex(
        (filter) => filter.columnId === action.columnId && filter.columnType === action.payload.columnType
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
        newFilters = [...state.filters, { columnId: action.columnId, ...action.payload }];
      }
      return { ...state, filters: newFilters, skipReset: true };
    case ActionTypes.UPDATE_FILTER:
      return {
        ...state,
        filters: state.filters.map((filter, index) =>
          index === action.index ? { ...filter, ...action.payload } : filter
        ),
      };
    case ActionTypes.REMOVE_FILTER:
      return {
        ...state,
        filters: state.filters.filter((_, index) => index !== action.index),
      };
    case ActionTypes.APPLY_FILTERS:
      alert("apply")
      // Implement the logic to apply filters to your data
      return state;
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, makeData(5));

  useEffect(() => {
    console.log(state.filters, "filter");
    dispatch({ type: ActionTypes.ENABLE_RESET });
  }, [state.data, state.columns, state.filters]);


  return (
    <div
      className="overflow-hidden"
      style={{
        width: '80vw',
        height: '100vh',
        padding: 10,
        margin: 'auto',
      }}
    >
     {
      state.filters.length > 0 && (
        <>
        {
          state.filters.map((filter, index) => (
            <Filter
              key={index}
              columnType={filter.columnType}
              columnId={filter.columnId}
              dispatch={dispatch}
            />
          ))
        }
        <button onClick={() => dispatch({ type: ActionTypes.APPLY_FILTERS })}>Apply</button>
        </>
      )
     } 
      <Table
        columns={state.columns}
        data={state.data}
        dispatch={dispatch}
        skipReset={state.skipReset}
      />
      <div id="popper-portal"></div>
    </div>
  );
}

export default App;
