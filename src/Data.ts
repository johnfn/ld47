import { DialogEvent, AllLocations, PromptEvent, BackgroundEvent } from "./CinematicTypes";

export const eatChicken: BackgroundEvent[] = [
  {
    speaker: "Joe",
    text: "YES",
    type: "background-event",
    timeString: "",
  },

  {
    speaker: "You",
    text: "I will no longer be hungry",
    type: "background-event",
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
    liveEvents: [
      {
        text: ["Joe stumbles in the bar"],
        time: "11:02 AM",
      }
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
    liveEvents: [
      {
        text: ["You see Joe walk into the Royal Skillet."],
        time: "11:02 AM",
      }
    ],
    actions: ['Explore', 'Inventory', 'Talk'],
  },

  "Secret Passageway": {
    description: [
      "Whoa... A secret passageway!",
      "Maybe I'll find Team Rocket!",
    ],
    people: [],
    exits: ["Bar"],
    liveEvents: [
      {
        text: ["You see Joe walking down the secret passageway."],
        time: "11:01 AM",
      }

    ],
    actions: ['Explore', 'Inventory', 'Talk'],
  }
};