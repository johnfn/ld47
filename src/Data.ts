import { DialogEvent } from "./Cinematics";

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

const prompt: DialogEvent = {
  prompt: {
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
  },
  type: "prompt",
};
