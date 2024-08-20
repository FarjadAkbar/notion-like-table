import faker from 'faker';
import { Constants, DataTypes } from '../constant';

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
      id: faker.datatype.uuid(),
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

export function grey(value) {
  let reference = {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  };

  return reference[value];
}

export function scrollbarWidth() {
  const scrollDiv = document.createElement('div');
  scrollDiv.setAttribute(
    'style',
    'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;'
  );
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}
