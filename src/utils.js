import faker from 'faker';

export function shortId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

export function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 95%, 90%)`;
}

export function makeData(count) {
  let data = [];
  let tags = [];
  let status = [];
  const allTags = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const allStatus = ['Pending', 'Completed', 'In Progress'];

  for (let i = 0; i < count; i++) {
    let rowTags = faker.random.arrayElements(
      allTags,
      Math.floor(Math.random() * allTags.length) + 1
    );
    let rowStatus = faker.random.arrayElement(allStatus);

    let row = {
      ID: faker.datatype.uuid(),
      name: faker.name.firstName(),
      number: Math.floor(20 + Math.random() * 20),
      collection: faker.commerce.productName(),
      previous_prompt: faker.lorem.sentence(),
      next_prompt: faker.music.genre(),
      goal_description: faker.lorem.sentence(),
      tags: rowTags,
      status: rowStatus,
    };

    rowTags.forEach(tag => {
      if (!tags.some(t => t.label === tag)) {
        tags.push({ label: tag, backgroundColor: randomColor() });
      }
    });

    if (!status.some(s => s.label === rowStatus)) {
      status.push({ label: rowStatus, backgroundColor: randomColor() });
    }

    data.push(row);
  }

  tags = tags.filter(
    (a, i, self) => self.findIndex(b => b.label === a.label) === i
  );

  status = status.filter(
    (a, i, self) => self.findIndex(b => b.label === a.label) === i
  );

  let columns = [
    {
      id: 'name',
      label: 'Name',
      accessor: 'name',
      minWidth: 100,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'number',
      label: 'Number',
      accessor: 'number',
      width: 80,
      dataType: DataTypes.NUMBER,
      options: [],
    },
    {
      id: 'collection',
      label: 'Collection',
      accessor: 'collection',
      minWidth: 100,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'previous_prompt',
      label: 'Previous Prompt',
      accessor: 'previous_prompt',
      width: 300,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'next_prompt',
      label: 'Next Prompt',
      accessor: 'next_prompt',
      width: 100,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'tags',
      label: 'Tags',
      accessor: 'tags',
      dataType: DataTypes.MULTISELECT,
      width: 100,
      options: tags,
    },
    {
      id: 'goal_description',
      label: 'Goal Description',
      accessor: 'goal_description',
      width: 300,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'status',
      label: 'Status',
      accessor: 'status',
      dataType: DataTypes.SELECT,
      width: 200,
      options: status,
    },
    {
      id: Constants.ADD_COLUMN_ID,
      width: 20,
      label: '+',
      disableResizing: true,
      dataType: 'null',
    },
  ];
  return { columns: columns, data: data, filters: [], skipReset: false };
}

export const ActionTypes = Object.freeze({
  ADD_OPTION_TO_COLUMN: 'add_option_to_column',
  ADD_ROW: 'add_row',
  UPDATE_COLUMN_TYPE: 'update_column_type',
  UPDATE_COLUMN_HEADER: 'update_column_header',
  UPDATE_CELL: 'update_cell',
  ADD_COLUMN_TO_LEFT: 'add_column_to_left',
  ADD_COLUMN_TO_RIGHT: 'add_column_to_right',
  DELETE_COLUMN: 'delete_column',
  ENABLE_RESET: 'enable_reset',
  REORDER_COLUMNS: 'reorder_column',
  ADD_FILTER: 'add_filter',
  UPDATE_FILTER: 'update_filter',
  REMOVE_FILTER: 'remove_filter',
  APPLY_FILTERS: 'apply_filters',
});

export const DataTypes = Object.freeze({
  NUMBER: 'number',
  TEXT: 'text',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
});

export const Constants = Object.freeze({
  ADD_COLUMN_ID: 999999,
});

export function processInitialValue(dataType, value) {
  switch (dataType) {
    case DataTypes.MULTISELECT:
      return Array.isArray(value) ? value : [];
    default:
      return typeof value === 'string' || typeof value === 'number'
        ? value
        : '';
  }
}
