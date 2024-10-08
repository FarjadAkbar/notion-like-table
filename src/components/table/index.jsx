import React, { useMemo, useCallback } from 'react';
import clsx from 'clsx';
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from 'react-table';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Cell from './cells';
import Header from './header';
import PlusIcon from '../../img/Plus';
import { scrollbarWidth } from '../../utils';
import { FixedSizeList } from 'react-window';
import { ActionTypes } from '../../constant';

const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 400,
  Cell: Cell,
  Header: Header,
  sortType: 'alphanumericFalsyLast',
};

export default function Table({
  columns,
  data,
  dispatch: dataDispatch,
  skipReset,
}) {
  const sortTypes = useMemo(
    () => ({
      alphanumericFalsyLast(rowA, rowB, columnId, desc) {
        if (!rowA.values[columnId] && !rowB.values[columnId]) {
          return 0;
        }

        if (!rowA.values[columnId]) {
          return desc ? -1 : 1;
        }

        if (!rowB.values[columnId]) {
          return desc ? 1 : -1;
        }

        return isNaN(rowA.values[columnId])
          ? rowA.values[columnId].localeCompare(rowB.values[columnId])
          : rowA.values[columnId] - rowB.values[columnId];
      },
    }),
    []
  );

  // Create table instance with ordered columns
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      dataDispatch,
      autoResetSortBy: !skipReset,
      autoResetFilters: !skipReset,
      autoResetRowState: !skipReset,
      sortTypes,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy
  );

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
  
    // Skip reordering if the last column is involved
    if (result.source.index === columns.length - 1 || result.destination.index === columns.length - 1) {
      return;
    }
  
    dataDispatch({
      type: ActionTypes.REORDER_COLUMNS,
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index,
    });
  }, [dataDispatch, columns.length]);

  const RenderRow = useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div {...row.getRowProps({ style })} className="tr">
          {row.cells.map(cell => (
            <div {...cell.getCellProps()} className="td">
              {cell.render('Cell')}
            </div>
          ))}
        </div>
      );
    },
    [prepareRow, rows]
  );

  function isTableResizing() {
    for (let headerGroup of headerGroups) {
      for (let column of headerGroup.headers) {
        if (column.isResizing) {
          return true;
        }
      }
    }

    return false;
  }

  return (
    <div style={{ maxWidth: '100vw', overflow: 'auto' }}>
      <div
        {...getTableProps()}
        className={clsx('table', isTableResizing() && 'noselect')}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-columns" direction="horizontal">
            {(provided, snapshot) => (
              <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={clsx('flex', snapshot.isDraggingOver && 'dragging-over')}
              >
                {headerGroups.map((headerGroup, headerGroupIndex) => (
                  <div
                  {...headerGroup.getHeaderGroupProps()}
                  key={`headerGroup-${headerGroupIndex}`} // Unique key for headerGroup
                >
                    {headerGroup.headers.map((column, index) => (
                      <Draggable key={index} draggableId={String(column.id)} index={index}>
                        {(provided) => (
                          <div
                            {...column.getHeaderProps()}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={clsx('p-2', 'bg-gray-200', 'border')}
                          >
                            {column.render('Header')}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div {...getTableBodyProps()}>
          <FixedSizeList
            height={70 * rows.length}
            itemCount={rows.length}
            itemSize={70}
            width={totalColumnsWidth + scrollbarWidth}
          >
            {RenderRow}
          </FixedSizeList>
          <div
            className="tr add-row"
            onClick={() => dataDispatch({ type: ActionTypes.ADD_ROW })}
          >
            <span className="svg-icon svg-gray icon-margin">
              <PlusIcon />
            </span>
            New
          </div>
        </div>
      </div>
    </div>
  );
}
