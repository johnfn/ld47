import { SpeakEvent, Cinematic, DialogEvent, PromptEvent, PromptOption, PromptSelectionKeys, Location } from "./CinematicTypes";
import { Locations, TestPrompt } from "./Data";
import { Keyboard, KeyName } from "./Keyboard";

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


  actions.setShowDialogLineFinishedMessage(true);
  yield* waitForKey("Spacebar");
  actions.setShowDialogLineFinishedMessage(false);
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

  if (selectedOptionIndex === -1) { alert("AAAAAAA"); }

  // TODO: Update prompt visually to indicate you have selected this one. 

  yield* runEvents(selectedOption.nextDialog);
}

export function* runChangeLocation(location: Location): Cinematic {
  const actions = yield "next";

  actions.setActiveLocation(location);

  for (const text of location.description) {
    yield* runSpeakEvent({
      speaker: "Narrator",
      text,
      type: "dialog",
    })
  }
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

  // yield* runPromptEvent(TestPrompt)
  yield* runChangeLocation(Locations.Bar);
}
