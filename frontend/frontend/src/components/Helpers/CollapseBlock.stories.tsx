import { CollapseBlock } from "./CollapseBlock";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Helpers/CollapseBlock",
  component: CollapseBlock,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CollapseBlock>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CollapseBlock> = (args) => (
  <div style={{ width: "500px" }}>
    <CollapseBlock {...args}>
      <div>
        <h4 className="text-center">Information Goes Here</h4>
        <p className="text-center">Add some test or some tables or something...</p>
      </div>
    </CollapseBlock>
  </div>
);

export const Primary = Template.bind({});

Primary.args = {
  heading: "Open me!",
};
