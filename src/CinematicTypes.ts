import { LocationNames } from "./Data";

export type DialogEvent = SpeakEvent | PromptEvent | ActionEvent | DescribeEvent | BackgroundEvent;

export type ActionType =
  | 'Talk'
  | 'Explore'
  | 'Inventory'

export type SpeakEvent = {
  speaker: string;
  text: string;
  timeString: string;
  type: "dialog"
}

export type PromptEvent = {
  options: PromptOption[];
  type: "prompt";
}

export type ActionEvent = {
  text: string;
  type: "action";
  onClick?: () => void;
};

export type DescribeEvent = {
  text: string;
  nextDialog?: DialogEvent[];
  type: "describe";
};

export type BackgroundEvent = {
  speaker: string;
  text: string;
  timeString: string;
  type: "background-event";
};


export type PromptOption = {
  text: string;
  nextDialog: DialogEvent[];
}

export type AllLocations = {
  [key in LocationNames]: Location;
}

export type LiveEvent = {
  time: string;
  text: string[];
}

export type Location = {
  description: string[];
  people: string[];
  exits: LocationNames[];
  actions: ActionType[];
  liveEvents: LiveEvent[];
}

export const PromptSelectionKeys = ["A", "S", "D", "F", "Z", "X", "C", "V"] as const;

export type CinematicArgs = {
  setEvents: React.Dispatch<React.SetStateAction<DialogEvent[]>>;
  events: DialogEvent[];
  dateString: string;
  timeString: string;

  setShowDialogLineFinishedMessage: React.Dispatch<React.SetStateAction<boolean>>;
  showDialogLineFinishedMessage: boolean;

  setShowPromptFinishedMessage: React.Dispatch<React.SetStateAction<boolean>>;
  showPromptFinishedMessage: boolean;

  setActiveLocation: React.Dispatch<React.SetStateAction<Location>>;
  activeLocation: Location;
};

export type Cinematic<T = void> = Generator<"next", T, CinematicArgs>;
