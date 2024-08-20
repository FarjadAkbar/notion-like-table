import React, { useEffect, useReducer } from 'react';
import Table from './components/table';
import Filter from './components/filters';
import { reducer } from './hook';
import { makeData } from './utils';
import { ActionTypes } from './constant';
import './style.css';


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
              options={filter.options}
            />
          ))
        }
        {/* <button onClick={() => dispatch({ type: ActionTypes.APPLY_FILTERS })}>Apply</button> */}
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
