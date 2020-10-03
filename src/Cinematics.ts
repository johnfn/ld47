import { Key } from "react";
import { DialogType } from "./App";
import { Keyboard, KeyName } from "./Keyboard";

export type CinematicArgs = {
  setDialog: React.Dispatch<React.SetStateAction<{ speaker: string; text: string; }[]>>;
  dialog: DialogType[];

  setDialogLineFinished: React.Dispatch<React.SetStateAction<boolean>>;
  dialogLineFinished: boolean;

  setPrompt: React.Dispatch<React.SetStateAction<PromptType | null>>;
};

export type Cinematic<T = void> = Generator<"next", T, CinematicArgs>;

export type PromptType = {
  options: {
    text: string;
    nextDialog: DialogType[];
  }[];
};

export function* speakSingleDialog(dialog: DialogType): Cinematic {
  let actions = yield "next";

  const { speaker, text } = dialog;
  const dialogResult: DialogType = { speaker, text: "" };
  const startingDialog = actions.dialog;

  for (const character of text) {
    dialogResult.text += character;
    actions.setDialog([...startingDialog, dialogResult]);

    if (Keyboard.justDown.Spacebar) {
      break;
    }

    yield "next";
  }

  actions.setDialog([
    ...startingDialog,
    {
      speaker,
      text,
    },
  ]);
}

export function* waitForKey(key: KeyName): Cinematic {
  yield "next";

  while (!Keyboard.justDown[key]) {
    yield "next";
  }
}

export function* waitForKeys(keys: KeyName[]): Cinematic<KeyName> {
  yield "next";

  while (true) {
    for (const key of keys) {
      if (Keyboard.justDown[key]) {
        return key;
      }
    }

    yield "next";
  }
}

export function* speakMultipleDialog(dialogs: DialogType[]): Cinematic {
  let actions = yield "next";

  for (const dialog of dialogs) {
    yield* speakSingleDialog(dialog);

    actions.setDialogLineFinished(true);
    yield* waitForKey("Spacebar");
    actions.setDialogLineFinished(false);
  }
}

export function* prompt(prompt: PromptType): Cinematic {
  let actions = yield "next";

  actions.setPrompt(prompt);

  const selection = yield* waitForKeys(["A", "S"]);
}

export function* displayText(): Cinematic {
  // yield* speakMultipleDialog([
  //   {
  //     speaker: "You",
  //     text: "I'm ... hungry... SO HUNGRY AHHH",
  //   },

  //   {
  //     speaker: "You",
  //     text: "I could really go for a ...",
  //   },

  //   {
  //     speaker: "You",
  //     text: "...",
  //   },

  //   {
  //     speaker: "You",
  //     text: "Chicken.",
  //   },
  // ]);

  yield* prompt({
    options: [
      {
        text: "Eat a chicken",
        nextDialog: [],
      },
      {
        text: "Don't",
        nextDialog: [],
      },
    ],
  })
}
