import { CinematicEvent, AllLocations, PromptEvent, BackgroundDialog, DialogEvent } from "./CinematicTypes";

export const eatChicken: BackgroundDialog[] = [
  {
    speaker: "Joe",
    text: "YES",
    type: "background-dialog",
  },

  {
    speaker: "You",
    text: "I will no longer be hungry",
    type: "background-dialog",
  },
]

const dontEatChicken: DialogEvent[] = [
  {
    speaker: "You",
    text: "NO",
    type: "dialog",
  },

  {
    speaker: "You",
    text: "This is terrible!",
    type: "dialog",
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
    name: 'Bar',
    description: [
      "You walk into the Royal Skillet. Though it's filled with Canadian mafia, it's not too bad.",
      'Hey, Joe is still bartending!',
    ],
    people: [
      {
        name: 'Bartender', dialog: [
          { type: 'dialog', speaker: 'Bartender', text: "Hi! I'm the bartender round these parts.", },
          { type: 'dialog', speaker: 'Bartender', text: "BLah blah blah blah", },
          { type: 'dialog', speaker: 'Bartender', text: "Blee blee blee blee", },
          { type: 'dialog', speaker: 'Bartender', text: "Blooooooooooooooooo", },
        ]
      },
      {
        name: 'Guy 2', dialog: [
          { type: 'dialog', speaker: 'Guy 2', text: "Hi! I'm Guy 2. Here is a book." },
          { type: 'inventory', item: "book" }
        ]
      },
    ],
    exits: [
      'Outdoors',
      'Secret Passageway',
    ],
    liveEvents: [{
      time: "11:02 AM",
      event: {
        type: "background-dialog",
        speaker: "Narrator",
        text: "Charles stumbles in the bar.",
      }
    }],
    actions: ['Explore', 'Inventory', 'Talk'],
  },

  'Outdoors': {
    name: 'Outdoors',
    description: [
      "You walk outdoors.",
      "There is nothing to do here.",
    ],
    people: [],
    exits: ["Bar"],
    liveEvents: [{
      time: "11:02 AM",
      event: {
        text: "You see Charles walk into the Royal Skillet.",
        type: "background-dialog",
        speaker: "Narrator",
      },
    }],
    actions: ['Explore', 'Inventory', 'Talk'],
  },

  "Secret Passageway": {
    name: 'Secret Passageway',
    description: [
      "Whoa... A secret passageway!",
      "Maybe I'll find Team Rocket!",
    ],
    people: [],
    exits: ["Bar"],
    liveEvents: [
      {
        time: "11:01 AM",
        event: {
          text: "You see Charles walk down the secret passageway.",
          type: "background-dialog",
          speaker: "Narrator",
        }
      }
    ],
    actions: ['Explore', 'Inventory', 'Talk'],
  }
};