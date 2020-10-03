import { DialogEvent, AllLocations, PromptEvent } from "./CinematicTypes";

const eatChicken: DialogEvent[] = [
  {
    speaker: "You",
    text: "YES",
    type: "dialog",
    timeString: "",
  },

  {
    speaker: "You",
    text: "I will no longer be hungry",
    type: "dialog",
    timeString: "",
  },
]

const dontEatChicken: DialogEvent[] = [
  {
    speaker: "You",
    text: "NO",
    type: "dialog",
    timeString: "",
  },

  {
    speaker: "You",
    text: "This is terrible!",
    type: "dialog",
    timeString: "",
  },
]

export const TestPrompt: PromptEvent = {
  type: "prompt",

  options: [
    {
      text: "Eat a chicken",
      nextDialog: eatChicken,
    },
    {
      text: "Don't",
      nextDialog: dontEatChicken,
    },
  ],
};

export type LocationNames =
  | 'Bar'
  | 'Outdoors'
  | 'Secret Passageway'

export const Locations: AllLocations = {
  'Bar': {
    description: [
      "You walk into the Royal Skillet. Though it's filled with Canadian mafia, it's not too bad.",
      'Hey, Joe is still bartending!',
    ],
    people: [
      'Bartender',
      'Guy 2',
    ],
    exits: [
      'Outdoors',
      'Secret Passageway',
    ],
    actions: ['Explore', 'Inventory', 'Talk'],
  },

  'Outdoors': {
    description: [
      "You walk outdoors.",
      "There is nothing to do here.",
    ],
    people: [],
    exits: ["Bar"],
    actions: ['Explore', 'Inventory', 'Talk'],
  },

  "Secret Passageway": {
    description: [
      "Whoa... A secret passageway!",
      "Maybe I'll find Team Rocket!",
    ],
    people: [],
    exits: ["Bar"],
    actions: ['Explore', 'Inventory', 'Talk'],
  }
};