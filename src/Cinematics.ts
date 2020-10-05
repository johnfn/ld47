import { DisplayedBackgroundDialog, DisplayedDescribe, DisplayedDialog, DisplayedDreamDialog, DisplayedEvent, DisplayedPrompt as DisplayedPromptEvent, Inventory } from "./App";
import { DialogEvent, Cinematic, CinematicEvent, PromptEvent, PromptSelectionKeys, ActionEvent, DescribeEvent, BackgroundDialog as BackgroundDialogEvent, ChangeLocationEvent, Location, GameMode, DreamDialog } from "./CinematicTypes";
import { Locations, Person } from "./Data";
import { Keyboard, KeyName } from "./Keyboard";
import { Keys } from "./Utils";

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

export type TextModifier =
  | "slow"
  | "huge"
  | "shaky"
  ;

function* runDialogEvent(event: DialogEvent | BackgroundDialogEvent | DreamDialog, props: { background?: boolean; modifier?: TextModifier[] } = { background: false }): Cinematic {
  const { background, modifier } = props;
  let actions = yield "next";
  const timeString = actions.timeString;

  const { text } = event;
  const id = generateId();
  let dialogResult: DisplayedDialog | DisplayedBackgroundDialog | DisplayedDreamDialog;

  if (event.type === "dialog" || event.type === "background-dialog") {
    dialogResult = { speaker: event.speaker, text: "", type: event.type, time: timeString, id, isContainingSequenceFinished: false, state: "animating", modifier };
  } else {
    dialogResult = { text: "", type: event.type, time: timeString, id, isContainingSequenceFinished: false, state: "animating", modifier };
  }

  addEvent(actions.setEvents, dialogResult);

  for (const character of text) {
    dialogResult.text += character;
    updateEvent(actions.setEvents, dialogResult);

    if (Keyboard.justDown.Spacebar) {
      break;
    }

    if (props.modifier?.includes("slow")) {
      for (let i = 0; i < 5; i++) {
        yield "next";
      }
    }

    actions = yield "next";
  }

  dialogResult.text = text;
  dialogResult.state = "waiting-for-key";

  updateEvent(actions.setEvents, dialogResult);

  if (!background && text !== "") {
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

function* runPromptEvent(promptEvent: PromptEvent): Cinematic<number> {
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
    let newOption = "";

    newEvent.options.push(newOption);

    for (const character of option) {
      newEvent.options[newEvent.options.length - 1] += character;

      updateEvent(actions.setEvents, newEvent);

      yield "next";
    }
  }

  newEvent.state = "waiting-for-key";
  updateEvent(actions.setEvents, newEvent);

  const numberOfOptions = promptEvent.options.length;

  let selection: string;

  outer: while (true) {
    for (const key of PromptSelectionKeys.slice(0, numberOfOptions)) {
      if (Keyboard.justDown[key]) {
        selection = key;

        break outer;
      }
    }

    yield "next";
  }

  const selectedOptionIndex = PromptSelectionKeys.indexOf(selection as any);

  if (selectedOptionIndex === -1) { alert("AAAAAAA"); }

  // TODO: Update prompt visually to indicate you have selected this one. 

  newEvent.state = "done";
  updateEvent(actions.setEvents, newEvent);

  return selectedOptionIndex;
}

function* runDescribeEvent(describeEvent: DescribeEvent): Cinematic {
  let actions = yield "next";

  const timeString = actions.timeString;
  const id = generateId();
  const newEvent: DisplayedDescribe = {
    ...describeEvent,
    time: timeString,
    text: "",
    id,
    isContainingSequenceFinished: false,
    state: "animating",
  };

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

  yield* event.newLocation.description;
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
  const getEvent: DialogEvent = { type: "dialog", speaker: "Narrator", text: `${titledCasedItem} was added to your inventory.` }

  yield* runDialogEvent(getEvent, { background: false });
}

// exported

export function* talk(speaker: Person, text: string, modifier?: TextModifier[]): Cinematic {
  yield* runDialogEvent({
    speaker,
    text,
    type: "dialog",
  }, { background: false, modifier })
}

export function* dreamTalk(text: string): Cinematic {
  yield* runDialogEvent({
    text, type: "dream-dialog"
  })
}


export function* talkInBackground(speaker: Person, text: string): Cinematic {
  yield* runDialogEvent({
    speaker, text, type: "background-dialog",
  }, { background: true })
}

export function* narrateInBackground(text: string): Cinematic {
  yield* runDialogEvent({
    speaker: "Narrator", text, type: "background-dialog",
  }, { background: true })
}

export function* narrate(text: string, modifier?: TextModifier[]): Cinematic {
  yield* runDialogEvent({
    speaker: "Narrator", text, type: "dialog",
  }, { modifier });
}

export function* setInterruptable(value: boolean): Cinematic {
  const actions = yield 'next';

  actions.setInterruptable(value);
}

export function* setLocation(newLocation: Location): Cinematic {
  yield* runChangeLocation({
    newLocation,
    type: "change-location",
  });
}

export function* prompt(options: string[]): Cinematic<number> {
  return yield* runPromptEvent({
    options,
    type: "prompt",
  });
}

export function* giveItem(item: keyof Inventory): Cinematic {
  yield* addToInventory(item)
}

export const PastDate = new Date(Date.parse('14 April 2012 10:00:00 PST'))
export const FutureDate = new Date(Date.parse('8 December 2012 10:00:00 PST'))

export function* setMode(newMode: GameMode): Cinematic {
  const actions = yield 'next';
  const prevMode = actions.mode;

  if (newMode === "Past") {
    actions.setFutureHasChanged(false);
  }

  if (prevMode === "DreamSequence") {
    if (newMode === "Past") {
      actions.setCurrentDate(PastDate);
    }

    if (newMode === "Future") {
      actions.setCurrentDate(FutureDate);
    }
  }

  // Fade to black
  if (prevMode !== newMode && newMode === "DreamSequence") {
    actions.setMode(newMode);

    for (let i = 0; i < 50; i++) {
      actions.setOverlayOpacity((i + 1) / 50);

      yield 'next';
    }
  }

  // Fade from black
  if (prevMode !== newMode && prevMode === "DreamSequence") {
    actions.setMode(newMode);

    for (let i = 0; i < 50; i++) {
      actions.setOverlayOpacity(1 - (i + 1) / 50);

      yield 'next';
    }
  }

  if (prevMode !== "DreamSequence") {
    if (newMode === "Past") {
      actions.setCurrentDate(PastDate);
    }

    if (newMode === "Future") {
      actions.setCurrentDate(FutureDate);
    }
  }
}

export function* setFutureHasChanged(): Cinematic {
  const actions = yield 'next';
  actions.setFutureHasChanged(true);
}

export function* explore(location: Location): Cinematic {
  yield* setInterruptable(false);
  yield* narrate("You look around.");
  yield* setInterruptable(true);

  const exits = location.exits;

  if (exits.length === 0) {
    yield* narrate("This room doesn't have any doors. Strange; how did you get here?");

    return;
  }

  const result = yield* prompt(
    exits.map(exit => exit.toLowerCase() === "outdoors" ? "Go outdoors" : "Go to " + exit)
  );

  yield* setLocation(Locations[exits[result]]);
}

export function* showInventory(inventory: Inventory): Cinematic {
  yield* setInterruptable(false);
  yield* narrate("You reach into your bag.");
  yield* setInterruptable(true);

  const items = Keys(inventory).filter(item => inventory[item]);

  if (items.length === 0) {
    yield* narrate("There's nothing in there.");

    return;
  }

  const itemPrompts = items.map(item => `Use ${item}`);
  const selection = yield* prompt(itemPrompts);

  yield* narrate("Nothing happens. Hmmm... Maybe you can try a little harder next time?");

  // TODO: Stop all other cinematics
}

export function* showNearbyInteractors(location: Location): Cinematic {
  yield* setInterruptable(false);
  yield* narrate("You check who's nearby.");
  yield* setInterruptable(true);

  const interactors = location.interactors;

  if (interactors.length === 0) {
    yield* narrate("There doesn't seem to be anything around. AT ALL.");

    return;
  }

  const talkingPrompts = interactors.map(interactor => {
    if (interactor.type === "person") {
      return `Talk to ${interactor.name}`;
    } else {
      return `Look at ${interactor.name}`;
    }
  });
  const selection = yield* prompt(talkingPrompts);

  yield* interactors[selection].dialog;
}
