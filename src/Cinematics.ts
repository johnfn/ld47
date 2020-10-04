import { textChangeRangeIsUnchanged } from "typescript";
import { DisplayedBackgroundDialog, DisplayedDescribe, DisplayedDialog, DisplayedPrompt as DisplayedPromptEvent, Inventory } from "./App";
import { DialogEvent, Cinematic, CinematicEvent, PromptEvent, PromptOption, PromptSelectionKeys, Location, ActionEvent, DescribeEvent, BackgroundDialog as BackgroundDialogEvent, ChangeLocationEvent } from "./CinematicTypes";
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

function* runDialogEvent(event: DialogEvent | BackgroundDialogEvent, props: { background?: boolean, isLastEvent: boolean }): Cinematic {
  const { background, isLastEvent } = props;
  let actions = yield "next";
  const timeString = actions.timeString;

  const { speaker, text } = event;
  const id = generateId();
  const dialogResult: DisplayedDialog | DisplayedBackgroundDialog = { speaker, text: "", type: event.type, time: timeString, id, isContainingSequenceFinished: false, isThisFinished: false };

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
  dialogResult.isThisFinished = true;

  actions.setEvents(oldEvents => {
    const newEvents = [...oldEvents];
    const indexToUpdate = newEvents.findIndex(ev => ev.id === id);

    newEvents[indexToUpdate] = dialogResult;

    return newEvents;
  });

  debugger;
  console.log('is last event?', isLastEvent);

  if (!background && !isLastEvent) {
    yield* waitForKey("Spacebar");
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

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const isLastEvent = i === events.length - 1;

    if (event.type === "dialog") {
      yield* runDialogEvent(event, { isLastEvent });
    } else if (event.type === "prompt") {
      yield* runPromptEvent(event, { isLastEvent })
    } else if (event.type === "action") {
      yield* runActionEvent(event, { isLastEvent })
    } else if (event.type === "change-location") {
      yield* runChangeLocation(event, { isLastEvent });
    } else if (event.type === "background-dialog") {
      yield* runDialogEvent(event, { background: true, isLastEvent })
    } else if (event.type === "inventory") {
      yield* addToInventory(event.item, { isLastEvent });
    } else if (event.type === "describe") {
      yield* runDescribeEvent(event, { isLastEvent });
    }
  }
}

function* runPromptEvent(promptEvent: PromptEvent, props: { isLastEvent: boolean }): Cinematic {
  let actions = yield "next";

  const id = generateId();
  const newEvent: DisplayedPromptEvent = {
    options: [],
    type: "prompt",
    id,
    time: actions.timeString,
    isContainingSequenceFinished: false,
    isThisFinished: false,
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

  newEvent.isThisFinished = true;

  actions.setEvents(oldActions => {
    const newActions = [...oldActions];
    const indexToUpdate = newActions.findIndex(action => action.id === id);
    newActions[indexToUpdate] = newEvent;

    return newActions;
  })

  const numberOfOptions = promptEvent.options.length;

  const selection = yield* waitForKeys(PromptSelectionKeys.slice(0, numberOfOptions));
  const selectedOptionIndex = PromptSelectionKeys.indexOf(selection as any);
  const selectedOption = promptEvent.options[selectedOptionIndex];

  if (selectedOptionIndex === -1) { alert("AAAAAAA"); }

  // TODO: Update prompt visually to indicate you have selected this one. 

  yield* runEvents(selectedOption.nextDialog);
}

function* runDescribeEvent(describeEvent: DescribeEvent, props: { isLastEvent: boolean }): Cinematic {
  let actions = yield "next";

  const timeString = actions.timeString;
  const id = generateId();
  const newEvent: DisplayedDescribe = { ...describeEvent, time: timeString, text: "", id, isContainingSequenceFinished: false, isThisFinished: false };

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

  newEvent.text = describeEvent.text;
  newEvent.isThisFinished = true;

  actions.setEvents(oldEvents => {
    const newEvents = [...oldEvents];
    const indexToUpdate = newEvents.findIndex(event => event.id === id);

    newEvents[indexToUpdate] = newEvent;
    return newEvents;
  });

  if (describeEvent.nextDialog) {
    yield* runEvents([describeEvent.nextDialog]);
  }
}

function* runActionEvent(actionEvent: ActionEvent, props: { isLastEvent: boolean }): Cinematic {
  let actions = yield "next";

  actions.setEvents([
    ...actions.events,
    {
      ...actionEvent,
      id: generateId(),
      hasTakenAction: false,
      isContainingSequenceFinished: false,
      isThisFinished: true,
    },
  ]);
}

function* runChangeLocation(event: ChangeLocationEvent, props: { isLastEvent: boolean }): Cinematic {
  const { isLastEvent } = props;
  const actions = yield "next";

  actions.setActiveLocation(event.newLocation);

  for (let i = 0; i < event.newLocation.description.length; i++) {
    const text = event.newLocation.description[i];
    const isLast = i === event.newLocation.description.length - 1;

    yield* runDialogEvent({
      speaker: "Narrator",
      text,
      type: "dialog",
    }, { isLastEvent: isLastEvent && isLast });
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
  yield* runChangeLocation({ newLocation: Locations.Bar, type: "change-location" }, { isLastEvent: true });
}

function* addToInventory(item: keyof Inventory, props: { isLastEvent: boolean }): Cinematic {
  let actions = yield "next";

  actions.setInventory({ ...actions.inventory, [item]: true })

  const titledCasedItem = item.charAt(0).toUpperCase() + item.slice(1)
  const getEvent: DialogEvent = { type: "dialog", speaker: "narrator", text: `${titledCasedItem} was added to your inventory.` }

  yield* runDialogEvent(getEvent, { isLastEvent: true });
}

export function* hello(): Cinematic {
  yield* runEvents(eatChicken);
}
