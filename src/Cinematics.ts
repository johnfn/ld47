import { TestPrompt } from "./Data";
import { Keyboard, KeyName } from "./Keyboard";

export type DialogEvent = SpeakEvent | PromptEvent;

export type SpeakEvent = {
  speaker: string;
  text: string;
  type: "dialog"
}

export type PromptEvent = {
  options: PromptOption[];
  type: "prompt";
}

export type PromptOption = {
  text: string;
  nextDialog: DialogEvent[];
}

export const PromptSelectionKeys = ["A", "S", "D", "F", "Z", "X", "C", "V"] as const;

export type CinematicArgs = {
  setEvents: React.Dispatch<React.SetStateAction<DialogEvent[]>>;
  events: DialogEvent[];

  setShowDialogLineFinishedMessage: React.Dispatch<React.SetStateAction<boolean>>;
  showDialogLineFinishedMessage: boolean;

  setShowPromptFinishedMessage: React.Dispatch<React.SetStateAction<boolean>>;
  showPromptFinishedMessage: boolean;
};

export type Cinematic<T = void> = Generator<"next", T, CinematicArgs>;

export function* runSpeakEvent(event: SpeakEvent): Cinematic {
  let actions = yield "next";

  const { speaker, text } = event;
  const dialogResult: SpeakEvent = { speaker, text: "", type: "dialog" };
  const startingDialog = actions.events;

  for (const character of text) {
    dialogResult.text += character;
    actions.setEvents([...startingDialog, dialogResult]);

    if (Keyboard.justDown.Spacebar) {
      break;
    }

    yield "next";
  }

  actions.setEvents([
    ...startingDialog,
    {
      speaker,
      text,
      type: "dialog",
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

export function* runEvents(events: DialogEvent[]): Cinematic {
  let actions = yield "next";

  for (const event of events) {
    if (event.type === "dialog") {
      yield* runSpeakEvent(event);

      actions.setShowDialogLineFinishedMessage(true);
      yield* waitForKey("Spacebar");
      actions.setShowDialogLineFinishedMessage(false);
    } else if (event.type === "prompt") {
      yield* runPromptEvent(event)
    }
  }
}

export function* runPromptEvent(promptEvent: PromptEvent): Cinematic {
  let actions = yield "next";

  const newEvent: PromptEvent = {
    options: [],
    type: "prompt",
  };

  for (const option of promptEvent.options) {
    const newOption: PromptOption = {
      nextDialog: option.nextDialog,
      text: "",
    };
    newEvent.options.push(newOption);

    for (const character of option.text) {
      newOption.text += character;

      actions.setEvents([
        ...actions.events,
        newEvent,
      ]);

      yield "next";
    }
  }

  actions.setEvents([
    ...actions.events,
    newEvent,
  ]);

  const numberOfOptions = promptEvent.options.length;

  actions.setShowPromptFinishedMessage(true);
  const selection = yield* waitForKeys(PromptSelectionKeys.slice(0, numberOfOptions));
  actions.setShowPromptFinishedMessage(false);

  const selectedOptionIndex = PromptSelectionKeys.indexOf(selection as any);
  const selectedOption = promptEvent.options[selectedOptionIndex];

  debugger;

  if (selectedOptionIndex === -1) {
    debugger;
  }

  // TODO: Update prompt visually to indicate you have selected this one. 

  yield* runEvents(selectedOption.nextDialog);
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

  yield* runPromptEvent(TestPrompt)
}
