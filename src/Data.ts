import { talk, prompt, setLocation, narrate, giveItem } from "./Cinematics";
import { CinematicEvent, AllLocations, PromptEvent, BackgroundDialog, DialogEvent, Cinematic } from "./CinematicTypes";

export const eatChicken: BackgroundDialog[] = [
  {
    speaker: "Joe",
    text: "YES",
    type: "background-dialog",
  },

  {
    speaker: "You",
    text: "I will no longer be hungry",
    type: "background-dialog",
  },
]

const dontEatChicken: DialogEvent[] = [
  {
    speaker: "You",
    text: "NO",
    type: "dialog",
  },

  {
    speaker: "You",
    text: "This is terrible!",
    type: "dialog",
  },
]

// export const TestPrompt: PromptEvent = {
//   type: "prompt",

//   options: [
//     {
//       text: "Eat a chicken",
//       nextDialog: eatChicken,
//     },
//     {
//       text: "Don't",
//       nextDialog: dontEatChicken,
//     },
//   ],
// };

export type LocationNames =
  | 'Bar'
  | 'Outdoors'
  | 'Secret Passageway'

export const Locations: AllLocations = {
  'Bar': {
    name: 'Bar',
    description: enterBar(),
    people: [
      {
        name: 'Bartender',
        dialog: speakToBartender(),
      },
      {
        name: 'Guy 2',
        dialog: speakToGuy2(),
      },
    ],
    exits: [
      'Outdoors',
      'Secret Passageway',
    ],
    liveEvents: [{
      time: "11:01 AM",
      event: {
        type: "background-dialog",
        speaker: "Narrator",
        text: "Charles stumbles into the bar.",
      }
    }],
    actions: ['Explore', 'Inventory', 'Talk'],
  },

  'Outdoors': {
    name: 'Outdoors',
    description: enterOutside(),
    people: [],
    exits: ["Bar"],
    liveEvents: [{
      time: "11:02 AM",
      event: {
        text: "You see Charles walk into the Royal Skillet.",
        type: "background-dialog",
        speaker: "Narrator",
      },
    }],
    actions: ['Explore', 'Inventory', 'Talk'],
  },

  "Secret Passageway": {
    name: 'Secret Passageway',
    description: enterSecretPassageway(),
    people: [],
    exits: ["Bar"],
    liveEvents: [
      {
        time: "11:01 AM",
        event: {
          text: "You see Charles walk down the secret passageway.",
          type: "background-dialog",
          speaker: "Narrator",
        }
      }
    ],
    actions: ['Explore', 'Inventory', 'Talk'],
  }
};

export function* startGame(): Cinematic {
  yield* talk("Professor Scrambie", "It'll all be over soon, Vega.");
  yield* talk("Professor Scrambie", "Ha ha...... HA!");
  yield* talk("Vega", "Oh NO!");
  yield* talk("Professor Scrambie", "Ha ha ha ha ha............. ha?");

  const result = yield* prompt([
    "Blah blah one?",
    "Blah blah two?",
    "Blah blah three?",
  ]);

  if (result === 0) {
    yield* talk("Vega", "Oh NO! You chose one.");
  }

  if (result === 1) {
    yield* talk("Vega", "Oh COOL! You chose two.");
  }

  yield* setLocation(Locations.Bar);
}

function* enterBar(): Cinematic {
  yield* narrate("You walk into the Royal Skillet. Though it's filled with Canadian mafia, it's not too bad.");
  yield* narrate('Hey, it\'s long enough ago that Joe is still bartending!');
}

function* enterOutside(): Cinematic {
  yield* narrate("You walk outdoors.");
  yield* narrate('There is nothing to do here.');
}

function* enterSecretPassageway(): Cinematic {
  yield* narrate("Whoa... A secret passageway!");
  yield* narrate("Maybe I'll find Team Rocket!");
}

function* speakToBartender(): Cinematic {
  yield* talk("Bartender", "I'm a bartender!");
  yield* talk("Bartender", "L ala la LA LA LA LA LA WHEE BAR TENDING");
}

function* speakToGuy2(): Cinematic {
  yield* talk("Bartender", "I'm guy 2");
  yield* talk("Bartender", "Here, take a book!");

  yield* giveItem("book");
}
