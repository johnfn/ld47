import { Keyboard, KeyName } from "./Keyboard";

export type DialogEvent = SpeakEvent | PromptEvent;

export type SpeakEvent = {
  speaker: string;
  text: string;
  type: "dialog"
}

export type PromptEvent = {
  prompt: PromptType;
  type: "prompt";
}

export type CinematicArgs = {
  setEvents: React.Dispatch<React.SetStateAction<DialogEvent[]>>;
  events: DialogEvent[];

  setDialogLineFinished: React.Dispatch<React.SetStateAction<boolean>>;
  dialogLineFinished: boolean;
};

export type Cinematic<T = void> = Generator<"next", T, CinematicArgs>;

export type PromptType = {
  options: {
    text: string;
    nextDialog: DialogEvent[];
  }[];
};

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

      actions.setDialogLineFinished(true);
      yield* waitForKey("Spacebar");
      actions.setDialogLineFinished(false);
    } else if (event.type === "prompt") {
      yield* runPromptEvent(event)
    }
  }
}

export function* runPromptEvent(event: PromptEvent): Cinematic {
  let actions = yield "next";

  actions.setEvents([
    ...actions.events,
    event,
  ])

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

  yield* runPromptEvent({
    prompt: {
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
    },
    type: "prompt",
  })
}
