import { Locations, LocationNames } from "./Data";

export type DialogEvent = SpeakEvent | PromptEvent;

export type ActionType =
  | 'Talk'
  | 'Explore'
  | 'Inventory'

export type SpeakEvent = {
  speaker: string;
  text: string;
  type: "dialog"
}

export type PromptEvent = {
  options: PromptOption[];
  type: "prompt";
}

export type ActionEvent = {
  options: PromptOption[];
  type: "action";
};

export type PromptOption = {
  text: string;
  nextDialog: DialogEvent[];
}

export type AllLocations = {
  [key in LocationNames]: Location;
}

export type Location = {
  description: string[];
  people: string[];
  exits: LocationNames[];
  actions: ActionType[];
}

export const PromptSelectionKeys = ["A", "S", "D", "F", "Z", "X", "C", "V"] as const;

export type CinematicArgs = {
  setEvents: React.Dispatch<React.SetStateAction<DialogEvent[]>>;
  events: DialogEvent[];

  setShowDialogLineFinishedMessage: React.Dispatch<React.SetStateAction<boolean>>;
  showDialogLineFinishedMessage: boolean;

  setShowPromptFinishedMessage: React.Dispatch<React.SetStateAction<boolean>>;
  showPromptFinishedMessage: boolean;

  setActiveLocation: React.Dispatch<React.SetStateAction<Location>>;
  activeLocation: Location;
};

export type Cinematic<T = void> = Generator<"next", T, CinematicArgs>;
