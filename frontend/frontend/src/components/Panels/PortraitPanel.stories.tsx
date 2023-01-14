import { PortraitPanel, PortraitPanelProps } from "./PortraitPanel";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Panels/PortraitPanel",
  component: PortraitPanel,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof PortraitPanel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PortraitPanel> = (args: PortraitPanelProps) => (
  <PortraitPanel {...args}>
    <h4 className="text-center">Information Goes Here</h4>
    <p className="text-center">Add some test or some tables or something...</p>
  </PortraitPanel>
);

export const Alliance = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Alliance.args = {
  character: {
    character_id: 755166922,
    corporation_id: 98628563,
    alliance_id: 1354830081,
  },
  heading: "Corp in Alliance!",
};

export const Faction = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Faction.args = {
  character: {
    character_id: 755166922,
    corporation_id: 1000179,
    faction_id: 500003,
  },
  heading: "Faction!",
};

export const CorpOnly = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
CorpOnly.args = {
  character: {
    character_id: 755166922,
    corporation_id: 98628563,
  },
  heading: "Corp Only!",
};

export const RoundImages = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
RoundImages.args = {
  character: {
    character_id: 755166922,
    corporation_id: 98628563,
    alliance_id: 1354830081,
  },
  roundedImages: true,
  heading: "Round!",
};
