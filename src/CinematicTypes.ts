import { DisplayedEvent, Inventory } from "./App";
import { LocationNames as LocationName } from "./Data";

export type CinematicEvent = DialogEvent | PromptEvent | ActionEvent | DescribeEvent | BackgroundDialog | InventoryEvent;

export type ActionType =
  | 'Talk'
  | 'Explore'
  | 'Inventory'

export type DialogEvent = {
  speaker: string;
  text: string;
  nextDialog?: CinematicEvent[];
  type: "dialog"
}

export type PromptEvent = {
  options: PromptOption[];
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
  speaker: string;
  text: string;
  type: "background-dialog";
};

export type InventoryEvent = {
  type: "inventory";
  item: keyof Inventory;
}


export type PromptOption = {
  text: string;
  nextDialog: CinematicEvent[];
}

export type AllLocations = {
  [key in LocationName]: Location;
}

export type LiveEvent = {
  time: string;
  text: string[];
}

export type Location = {
  description: string[];
  name: LocationName;
  people: { name: string, dialog: CinematicEvent[] }[];
  exits: LocationName[];
  actions: ActionType[];
  liveEvents: {
    time: string;
    event: BackgroundDialog;
  }[];
}

export const PromptSelectionKeys = ["A", "S", "D", "F", "Z", "X", "C", "V"] as const;

export type CinematicArgs = {
  setEvents: React.Dispatch<React.SetStateAction<DisplayedEvent[]>>;
  events: DisplayedEvent[];

  dateString: string;
  timeString: string;

  setShowDialogLineFinishedMessage: React.Dispatch<React.SetStateAction<boolean>>;
  showDialogLineFinishedMessage: boolean;

  setShowPromptFinishedMessage: React.Dispatch<React.SetStateAction<boolean>>;
  showPromptFinishedMessage: boolean;

  setActiveLocation: React.Dispatch<React.SetStateAction<Location>>;
  activeLocation: Location;

  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
  inventory: Inventory;
};

export type Cinematic<T = void> = Generator<"next", T, CinematicArgs>;
