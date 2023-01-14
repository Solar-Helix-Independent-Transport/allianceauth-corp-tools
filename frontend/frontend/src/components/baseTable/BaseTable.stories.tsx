import { BaseTable } from "./baseTable";
import { faker } from "@faker-js/faker";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Tables/BaseTable",
  component: BaseTable,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof BaseTable>;

let data: any = [];
for (let i = 0; i < 50; i++) {
  data.push({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    postCode: faker.address.zipCode(),
    city: faker.address.cityName(),
    country: faker.address.country(),
    number: faker.datatype.number(9999999),
    favouriteQuote: faker.lorem.sentence(),
  });
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BaseTable> = (args: any) => {
  const cols = React.useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Country",
        accessorKey: "country",
        filter: "text",
      },
      {
        header: "Number",
        accessorKey: "number",
        disableSortBy: true,
      },
      {
        header: "Quote",
        accessorKey: "favouriteQuote",
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    []
  );
  delete args.data;
  delete args.columns;

  return <BaseTable columns={cols} data={data} {...args} />;
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  isLoading: false,
  isFetching: false,
  debugTable: false,
  error: false,
};
Default.parameters = {
  controls: {
    exclude: ["data", "columns", "asyncExpandFunction"],
  },
};

export const Long = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Long.args = {
  isLoading: false,
  isFetching: false,
  debugTable: false,
  error: false,
  initialState: {
    pagination: {
      pageSize: 100000,
      pageIndex: 0,
    },
  },
};
Long.parameters = {
  controls: {
    exclude: ["data", "columns", "asyncExpandFunction"],
  },
};

export const Sorted = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Sorted.args = {
  isLoading: false,
  isFetching: false,
  debugTable: false,
  error: false,
  initialState: {
    sorting: [
      {
        id: "name",
        desc: false,
      },
    ],
  },
};
Sorted.parameters = {
  controls: {
    exclude: ["data", "columns", "asyncExpandFunction"],
  },
};

export const Visibility = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Visibility.args = {
  isLoading: false,
  isFetching: false,
  debugTable: false,
  error: false,
  initialState: {
    columnVisibility: {
      name: false,
      number: false,
    },
  },
};
Visibility.parameters = {
  controls: {
    exclude: ["data", "columns", "asyncExpandFunction"],
  },
};

export const KitchenSink = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
KitchenSink.args = {
  isLoading: false,
  isFetching: false,
  debugTable: false,
  error: false,
  initialState: {
    columnVisibility: {
      name: false,
      number: false,
    },
    sorting: [
      {
        id: "email",
        desc: false,
      },
    ],
    pagination: {
      pageSize: 5,
      pageIndex: 0,
    },
  },
};
KitchenSink.parameters = {
  controls: {
    exclude: ["data", "columns", "asyncExpandFunction"],
  },
};
