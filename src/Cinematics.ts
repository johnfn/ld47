import { SpeakEvent, Cinematic, DialogEvent, PromptEvent, PromptOption, PromptSelectionKeys, Location, ActionEvent, DescribeEvent, BackgroundEvent } from "./CinematicTypes";
import { eatChicken, Locations } from "./Data";
import { Keyboard, KeyName } from "./Keyboard";

export function* runSpeakEvent(event: SpeakEvent | BackgroundEvent, props: { background?: boolean } = {}): Cinematic {
  const background = props?.background;
  let actions = yield "next";
  const timeString = actions.timeString;

  const { speaker, text } = event;
  const dialogResult: SpeakEvent = { speaker, text: "", type: "dialog", timeString: timeString };
  let index = -1;

  actions.setEvents(oldEvents => {
    index = oldEvents.length;

    return [...oldEvents, dialogResult];
  });

  for (const character of text) {
    dialogResult.text += character;
    actions.setEvents(oldEvents => {
      const newEvents = [...oldEvents];

      newEvents[index] = dialogResult;
      return newEvents;
    });

    if (Keyboard.justDown.Spacebar) {
      break;
    }

    actions = yield "next";
  }

  actions.setEvents(oldEvents => {
    const newEvents = [...oldEvents];
    newEvents[index] = {
      speaker,
      text,
      type: "dialog",
      timeString: timeString,
    }

    return newEvents;
  });

  if (!background) {
    actions.setShowDialogLineFinishedMessage(true);
    yield* waitForKey("Spacebar");
    actions.setShowDialogLineFinishedMessage(false);
  }
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
    } else if (event.type === "action") {
      yield* runActionEvent(event)
    } else if (event.type === "background-event") {
      yield* runSpeakEvent(event, { background: true })
    }
  }
}

export function* runPromptEvent(promptEvent: PromptEvent): Cinematic {
  let actions = yield "next";

  const newEvent: PromptEvent = {
    options: [],
    type: "prompt",
  };
  let index = -1;

  actions.setEvents(oldActions => {
    index = oldActions.length;

    return [...oldActions, newEvent];
  });

  for (const option of promptEvent.options) {
    const newOption: PromptOption = {
      nextDialog: option.nextDialog,
      text: "",
    };

    newEvent.options.push(newOption);

    for (const character of option.text) {
      newOption.text += character;

      actions.setEvents(oldActions => {
        const newActions = [...oldActions];
        newActions[index] = newEvent;

        return newActions;
      })

      yield "next";
    }
  }

  actions.setEvents(oldActions => {
    const newActions = [...oldActions];
    newActions[index] = newEvent;

    return newActions;
  })

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

export function* runDescribeEvent(describeEvent: DescribeEvent): Cinematic {
  let actions = yield "next";

  actions.setEvents([
    ...actions.events,
    describeEvent,
  ]);

  actions = yield "next";

  if (describeEvent.nextDialog) {
    for (const next of describeEvent.nextDialog) {
      actions.setEvents([...actions.events, next])
      actions = yield "next";
    }
  }
}
export function* runActionEvent(actionEvent: ActionEvent): Cinematic {
  let actions = yield "next";

  actions.setEvents([
    ...actions.events,
    actionEvent,
  ]);
}

export function* runChangeLocation(location: Location): Cinematic {
  const actions = yield "next";

  actions.setActiveLocation(location);

  for (const text of location.description) {
    yield* runSpeakEvent({
      speaker: "Narrator",
      text,
      type: "dialog",
      timeString: actions.timeString,
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

export function* hello(): Cinematic {
  yield* runEvents(eatChicken);
}