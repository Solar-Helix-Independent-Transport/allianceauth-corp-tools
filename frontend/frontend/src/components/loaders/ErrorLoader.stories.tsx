import { ErrorLoader } from "./loaders";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Loaders/ErrorLoader",
  component: ErrorLoader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ErrorLoader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ErrorLoader> = (args) => <ErrorLoader {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  title: "Error Loading Component",
  message: "Try again Later",
};
