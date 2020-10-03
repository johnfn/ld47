import { DialogEvent, PromptEvent } from "./Cinematics";

const eatChicken: DialogEvent[] = [
  {
    speaker: "You",
    text: "YES",
    type: "dialog",
  },

  {
    speaker: "You",
    text: "I will no longer be hungry",
    type: "dialog",
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
