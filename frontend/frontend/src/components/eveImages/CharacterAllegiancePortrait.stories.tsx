import { CharacterAllegiancePortrait, CharacterPortrait } from "./eveImages";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Images/CharacterAllegiancePortrait",
  component: CharacterAllegiancePortrait,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CharacterPortrait>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof CharacterAllegiancePortrait> = (args) => (
  <CharacterAllegiancePortrait {...args} />
);

export const Alliance = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Alliance.args = {
  character: {
    character_id: 755166922,
    corporation_id: 98628563,
    alliance_id: 1354830081,
  },
  size: 256,
};

export const Faction = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Faction.args = {
  character: {
    character_id: 755166922,
    corporation_id: 1000179,
    faction_id: 500003,
  },
  size: 256,
};

export const CorpOnly = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
CorpOnly.args = {
  character: {
    character_id: 755166922,
    corporation_id: 98628563,
  },
  size: 256,
};
