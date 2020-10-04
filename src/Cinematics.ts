import { DisplayedBackgroundDialog, DisplayedDescribe, DisplayedDialog, DisplayedEvent, DisplayedPrompt as DisplayedPromptEvent, Inventory } from "./App";
import { DialogEvent, Cinematic, CinematicEvent, PromptEvent, PromptOption, PromptSelectionKeys, ActionEvent, DescribeEvent, BackgroundDialog as BackgroundDialogEvent, ChangeLocationEvent } from "./CinematicTypes";
import { Locations } from "./Data";
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

function addEvent(setEvents: (value: React.SetStateAction<DisplayedEvent[]>) => void, newEvent: DisplayedEvent) {
  setEvents(oldEvents => {
    if (oldEvents.find(ev => ev.id === newEvent.id)) {
      debugger;
      alert("Event already added")
    }

    return [...oldEvents, newEvent];
  });
}

function updateEvent(setEvents: (value: React.SetStateAction<DisplayedEvent[]>) => void, updatedEvent: DisplayedEvent) {
  setEvents(oldEvents => {
    const newEvents = [...oldEvents];
    const indexToUpdate = newEvents.findIndex(ev => ev.id === updatedEvent.id);

    if (indexToUpdate === -1) {
      debugger;
      alert("Event not in list")
    }

    newEvents[indexToUpdate] = updatedEvent;
    return newEvents;
  });
}

function* runDialogEvent(event: DialogEvent | BackgroundDialogEvent, props: { background?: boolean }): Cinematic {
  const { background } = props;
  let actions = yield "next";
  const timeString = actions.timeString;

  const { speaker, text } = event;
  const id = generateId();
  const dialogResult: DisplayedDialog | DisplayedBackgroundDialog = { speaker, text: "", type: event.type, time: timeString, id, isContainingSequenceFinished: false, state: "animating" };

  addEvent(actions.setEvents, dialogResult);

  for (const character of text) {
    dialogResult.text += character;
    updateEvent(actions.setEvents, dialogResult);

    if (Keyboard.justDown.Spacebar) {
      break;
    }

    actions = yield "next";
  }

  dialogResult.text = text;
  dialogResult.state = "waiting-for-key";

  updateEvent(actions.setEvents, dialogResult);

  if (!background) {
    yield* waitForKey("Spacebar");
  }

  dialogResult.state = "done";
  updateEvent(actions.setEvents, dialogResult);
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

    if (event.type === "dialog") {
      yield* runDialogEvent(event, { background: false });
    } else if (event.type === "prompt") {
      yield* runPromptEvent(event);
    } else if (event.type === "action") {
      yield* runActionEvent(event);
    } else if (event.type === "change-location") {
      yield* runChangeLocation(event);
    } else if (event.type === "background-dialog") {
      yield* runDialogEvent(event, { background: true })
    } else if (event.type === "inventory") {
      yield* addToInventory(event.item);
    } else if (event.type === "describe") {
      yield* runDescribeEvent(event);
    }
  }
}

function* runPromptEvent(promptEvent: PromptEvent): Cinematic {
  let actions = yield "next";

  const id = generateId();
  const newEvent: DisplayedPromptEvent = {
    options: [],
    type: "prompt",
    id,
    time: actions.timeString,
    isContainingSequenceFinished: false,
    state: "animating",
  };

  addEvent(actions.setEvents, newEvent);

  for (const option of promptEvent.options) {
    const newOption: PromptOption = {
      nextDialog: option.nextDialog,
      text: "",
    };

    newEvent.options.push(newOption);

    for (const character of option.text) {
      newOption.text += character;

      updateEvent(actions.setEvents, newEvent);

      yield "next";
    }
  }

  newEvent.state = "waiting-for-key";
  updateEvent(actions.setEvents, newEvent);

  const numberOfOptions = promptEvent.options.length;

  const selection = yield* waitForKeys(PromptSelectionKeys.slice(0, numberOfOptions));
  const selectedOptionIndex = PromptSelectionKeys.indexOf(selection as any);
  const selectedOption = promptEvent.options[selectedOptionIndex];

  if (selectedOptionIndex === -1) { alert("AAAAAAA"); }

  // TODO: Update prompt visually to indicate you have selected this one. 

  newEvent.state = "done";
  updateEvent(actions.setEvents, newEvent);

  yield* runEvents(selectedOption.nextDialog);
}

function* runDescribeEvent(describeEvent: DescribeEvent): Cinematic {
  let actions = yield "next";

  const timeString = actions.timeString;
  const id = generateId();
  const newEvent: DisplayedDescribe = { ...describeEvent, time: timeString, text: "", id, isContainingSequenceFinished: false, state: "animating" };

  addEvent(actions.setEvents, newEvent);

  for (const character of describeEvent.text) {
    newEvent.text += character;
    updateEvent(actions.setEvents, newEvent);

    if (Keyboard.justDown.Spacebar) {
      break;
    }

    actions = yield "next";
  }

  newEvent.text = describeEvent.text;
  newEvent.state = "done";

  updateEvent(actions.setEvents, newEvent);

  if (describeEvent.nextDialog) {
    yield* runEvents([describeEvent.nextDialog]);
  }
}

function* runActionEvent(actionEvent: ActionEvent): Cinematic {
  let actions = yield "next";

  actions.setEvents([
    ...actions.events,
    {
      ...actionEvent,
      id: generateId(),
      hasTakenAction: false,
      isContainingSequenceFinished: false,
      state: "done",
    },
  ]);
}

function* runChangeLocation(event: ChangeLocationEvent): Cinematic {
  const actions = yield "next";

  actions.setActiveLocation(event.newLocation);

  for (let i = 0; i < event.newLocation.description.length; i++) {
    const text = event.newLocation.description[i];
    const isLast = i === event.newLocation.description.length - 1;

    yield* runDialogEvent({
      speaker: "Narrator",
      text,
      type: "dialog",
    }, { background: false });
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
  yield* runChangeLocation({ newLocation: Locations.Bar, type: "change-location" });
}

function* addToInventory(item: keyof Inventory): Cinematic {
  let actions = yield "next";

  actions.setInventory({ ...actions.inventory, [item]: true })

  const titledCasedItem = item.charAt(0).toUpperCase() + item.slice(1)
  const getEvent: DialogEvent = { type: "dialog", speaker: "narrator", text: `${titledCasedItem} was added to your inventory.` }

  yield* runDialogEvent(getEvent, { background: false });
}
