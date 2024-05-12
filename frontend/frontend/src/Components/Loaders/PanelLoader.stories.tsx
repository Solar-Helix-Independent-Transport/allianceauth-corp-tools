import { PanelLoader } from "./loaders";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Loaders/PanelLoader",
  component: PanelLoader,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PanelLoader>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PanelLoader> = (args) => <PanelLoader {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  title: "Loading Data",
  message: "Please Wait",
};
