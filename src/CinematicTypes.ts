import { DisplayedEvent, Inventory } from "./App";
import { LocationNames as LocationName, Person } from "./Data";

export type CinematicEvent = DialogEvent | PromptEvent | ActionEvent | DescribeEvent | BackgroundDialog | InventoryEvent | ChangeLocationEvent;

export type GameMode =
  | 'Future'
  | 'Past'
  | 'DreamSequence'

export type ActionType =
  | 'Inventory'
  | 'Explore'
  | 'Interact'

export type DialogEvent = {
  speaker: Person;
  text: string;
  nextDialog?: CinematicEvent[];
  type: "dialog"
}

export type PromptEvent = {
  options: string[];
  type: "prompt";
}

export type ActionEvent = {
  type: "action";
  options: { text: string; onClick?: () => void; }[]
};

export type DescribeEvent = {
  text: string;
  nextDialog?: CinematicEvent;
  type: "describe";
};

export type BackgroundDialog = {
  speaker: Person;
  text: string;
  type: "background-dialog";
};

export type DreamDialog = {
  text: string;
  type: "dream-dialog";
};

export type InventoryEvent = {
  type: "inventory";
  item: keyof Inventory;
}

export type ChangeLocationEvent = {
  type: "change-location";
  newLocation: Location;
}

export type AllLocations = {
  [key in LocationName]: Location;
}

export type LiveEvent = {
  time: string;
  text: string[];
}

export type Location = {
  description: Cinematic;
  name: LocationName;
  interactors: {
    name: Person;
    dialog: Cinematic;
    type: "person" | "thing";
  }[];
  exits: LocationName[];
  actions: ActionType[];
  liveEvents: {
    time: string;
    event: Cinematic;
  }[];
}

export const PromptSelectionKeys = ["A", "S", "D", "F", "Z", "X", "C", "V"] as const;

export type CinematicArgs = {
  setEvents: React.Dispatch<React.SetStateAction<DisplayedEvent[]>>;
  events: DisplayedEvent[];

  dateString: string;
  timeString: string;

  setActiveLocation: React.Dispatch<React.SetStateAction<Location>>;
  activeLocation: Location;

  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
  inventory: Inventory;

  setMode: React.Dispatch<React.SetStateAction<GameMode>>;
  mode: GameMode;

  setOverlayOpacity: React.Dispatch<React.SetStateAction<number>>;
  overlayOpacity: number;

  setInterruptable: React.Dispatch<React.SetStateAction<boolean>>;
  interruptable: boolean;

  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;

  setFutureHasChanged: React.Dispatch<React.SetStateAction<boolean>>;
  futureHasChanged: boolean;
};

export type Cinematic<T = void> = Generator<"next", T, CinematicArgs>;
