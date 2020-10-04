import { DisplayedBackgroundDialog, DisplayedDescribe, DisplayedDialog, DisplayedPrompt as DisplayedPromptEvent, Inventory } from "./App";
import { DialogEvent, Cinematic, CinematicEvent, PromptEvent, PromptOption, PromptSelectionKeys, Location, ActionEvent, DescribeEvent, BackgroundDialog as BackgroundDialogEvent } from "./CinematicTypes";
import { eatChicken, Locations } from "./Data";
import { Keyboard, KeyName } from "./Keyboard";

let lastUsedId = 0;

const generateId = () => {
  return String(++lastUsedId);
};

// TODO: Would be cool if when the speaker is the same twice in a row, we omit the speaker header the second time.
//
// NARRATOR        10:02 PM
//   sup.
//   how are you.  10:03 PM <-- time is onHover only
//
// instead of:
//
// NARRATOR        10:02 PM
//   sup.
// NARRATOR        10:03 PM
//   how are you.  

export function* runSpeakEvent(event: DialogEvent | BackgroundDialogEvent, props: { background?: boolean } = {}): Cinematic {
  const background = props?.background;
  let actions = yield "next";
  const timeString = actions.timeString;

  const { speaker, text } = event;
  const id = generateId();
  const dialogResult: DisplayedDialog | DisplayedBackgroundDialog = { speaker, text: "", type: event.type, time: timeString, id };

  actions.setEvents(oldEvents => {
    return [...oldEvents, dialogResult];
  });

  for (const character of text) {
    dialogResult.text += character;
    actions.setEvents(oldEvents => {
      const newEvents = [...oldEvents];
      const indexToUpdate = newEvents.findIndex(ev => ev.id === id);

      newEvents[indexToUpdate] = dialogResult;
      return newEvents;
    });

    if (Keyboard.justDown.Spacebar) {
      break;
    }

    actions = yield "next";
  }

  dialogResult.text = text;

  actions.setEvents(oldEvents => {
    const newEvents = [...oldEvents];
    const indexToUpdate = newEvents.findIndex(ev => ev.id === id);

    newEvents[indexToUpdate] = dialogResult;

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

export function* runEvents(events: CinematicEvent[]): Cinematic {
  let actions = yield "next";

  for (const event of events) {
    if (event.type === "dialog") {
      yield* runSpeakEvent(event);
    } else if (event.type === "prompt") {
      yield* runPromptEvent(event)
    } else if (event.type === "action") {
      yield* runActionEvent(event)
    } else if (event.type === "background-dialog") {
      yield* runSpeakEvent(event, { background: true })
    } else if (event.type === "inventory") {
      yield* addToInventory(event.item);
    }
  }
}

export function* runPromptEvent(promptEvent: PromptEvent): Cinematic {
  let actions = yield "next";

  const id = generateId();
  const newEvent: DisplayedPromptEvent = {
    options: [],
    type: "prompt",
    id,
    time: actions.timeString,
  };

  actions.setEvents(oldActions => {
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
        const indexToUpdate = newActions.findIndex(action => action.id === id);
        newActions[indexToUpdate] = newEvent;

        return newActions;
      })

      yield "next";
    }
  }

  actions.setEvents(oldActions => {
    const newActions = [...oldActions];
    const indexToUpdate = newActions.findIndex(action => action.id === id);
    newActions[indexToUpdate] = newEvent;

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


// TODO: Prevent user from launching the same Describe event 5 million times?
// TODO: Make old describe event actions unclickable, since the state has changed.
export function* runDescribeEvent(describeEvent: DescribeEvent): Cinematic {
  let actions = yield "next";

  const timeString = actions.timeString;
  const id = generateId();
  const newEvent: DisplayedDescribe = { ...describeEvent, time: timeString, text: "", id };

  actions.setEvents(oldEvents => {
    return [...oldEvents, newEvent];
  });

  for (const character of describeEvent.text) {
    newEvent.text += character;
    actions.setEvents(oldEvents => {
      const newEvents = [...oldEvents];
      const indexToUpdate = newEvents.findIndex(event => event.id === id);

      newEvents[indexToUpdate] = newEvent;
      return newEvents;
    });

    if (Keyboard.justDown.Spacebar) {
      break;
    }

    actions = yield "next";
  }

  if (describeEvent.nextDialog) {
    yield* runEvents([describeEvent.nextDialog]);
  }
}
export function* runActionEvent(actionEvent: ActionEvent): Cinematic {
  let actions = yield "next";

  actions.setEvents([
    ...actions.events,
    {
      ...actionEvent,
      id: generateId(),
      hasTakenAction: false,
    },
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

export function* addToInventory(item: keyof Inventory): Cinematic {
  const actions = yield "next";

  //hello :) 

  // hi fix please thanks :D
  actions.setInventory({ ...actions.inventory, [item]: true })
}

export function* hello(): Cinematic {
  yield* runEvents(eatChicken);
}