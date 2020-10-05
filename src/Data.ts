import { talk, narrate, giveItem, narrateInBackground, setMode, dreamTalk, setLocation, setInterruptable, setFutureHasChanged } from "./Cinematics";
import { AllLocations, Cinematic, Location } from "./CinematicTypes";

export type Person =
  | 'Bartender'
  | 'Guy 2'
  | 'Doctor Scramble'
  | '???'
  | 'Vega'
  | 'Captain Sharp'
  | 'Narrator'

const Bar: Location = {
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
    'SecretPassageway',
  ],
  liveEvents: [{
    time: "11:01 AM",
    event: charlesEntersBar(),
  }],
  actions: ['Explore', 'Inventory', 'Talk'],
}

const Outdoors: Location = {
  name: 'Outdoors',
  description: enterOutside(),
  people: [],
  exits: ["Bar"],
  liveEvents: [{
    time: "11:02 AM",
    event: charlesEntersRoyalSkillet(),
  }],
  actions: ['Explore', 'Inventory', 'Talk'],
}

const DarkBG: Location = {
  name: 'DarkBG',
  description: emptyCinematic(),
  people: [],
  exits: ["DarkBG"],
  liveEvents: [],
  actions: ['Explore', 'Inventory', 'Talk'],
}

const SecretPassageway: Location = {
  name: 'SecretPassageway',
  description: enterSecretPassageway(),
  people: [],
  exits: ["Bar"],
  liveEvents: [
    {
      time: "11:01 AM",
      event: charlesGoesDownPassageway(),
    }
  ],
  actions: ['Explore', 'Inventory', 'Talk'],
}

const HQ0: Location = {
  name: 'HQ0',
  description: emptyCinematic(),
  people: [
    {
      name: 'Captain Sharp',
      dialog: speakToCaptainSharp0(),
    },
  ],
  exits: ["Bar"], //todo: remove this, was just for testing lol
  liveEvents: [
    {
      time: "11:20 AM",
      event: emptyCinematic(), // lol - we could do something funny here
    }
  ],
  actions: ['Explore', 'Inventory', 'Talk'],
}

export type LocationNames =
  | 'Bar'
  | 'Outdoors'
  | 'SecretPassageway'
  | 'DarkBG'
  | 'HQ0'

export const Locations: AllLocations = {
  Bar,
  Outdoors,
  SecretPassageway,
  DarkBG,
  HQ0,
};

export function* startGame(): Cinematic {
  yield* setLocation(Locations.DarkBG);

  yield* setInterruptable(false);
  yield* talk("Vega", "Ah... Good morning, beautiful world!");
  yield* talk("Vega", "Well, no time to waste. Boss said that he had some big news for me. Gotta head to work!");
  yield* setInterruptable(true);

  // yield* setMode("DreamSequence");
  // yield* dreamTalk("DAY 1");
  // yield* dreamTalk("");
  // yield* dreamTalk("NATIONAL AGENCY FOR CONTAINMENT OF THREATS - HEADQUARTERS (NATCH)");
  // yield* setMode("Future");

  // TODO: Overlay
  // DAY 1
  // NATIONAL AGENCY FOR CONTAINMENT OF THREATS - HEADQUARTERS (NATCH)

  yield* setLocation(Locations.HQ0);


  // yield* setMode("DreamSequence");

  // yield* dreamTalk("...Images and sounds float to you in the void...")
  // yield* dreamTalk(".......")
  // yield* dreamTalk("ooooo");
  // yield* dreamTalk(".......")

  // yield* setMode("Past");

  // yield* talk("Vega", "NO!");
  // yield* talk("Vega", "NO!");
  // yield* talk("Vega", "NO!");
  // yield* talk("Vega", "NO!");
}

// TODO: make game

function* speakToCaptainSharp0(): Cinematic {
  yield* talk("Captain Sharp", "Hey, Vega!");
  yield* talk("Vega", "Morning, Captain! You said yesterday that you had news?");

  yield* talk("Captain Sharp", "Right, right! I do indeed.");
  yield* talk("Captain Sharp", "We’ve been monitoring your work and have noticed that you’ve been incredibly productive lately.");
  yield* talk("Captain Sharp", "Your takedown of the Goober Gang last month was some top-notch stuff, and I heard from Withers in Recon that you’ve spent most of last week on a highly successful stakeout mission. Your country is safer with you in it!");
  yield* talk("Vega", "Thanks so much! All in the line of duty, sir.")
  yield* talk("Captain Sharp", "In fact, we’re so happy with your performance that we’re going to give you this next week off. Congratulations! ")
  yield* talk("Vega", "OMG YAY");
  yield* talk("Captain Sharp", "Keep this up, and you might even be on track for a promotion soon!");
  yield* narrate("The captain winks.");
  yield* narrate("It's a bit unsettling.");
  yield* talk("Vega", "Will do, Captain!! You have no idea how...");
  yield* talk("Vega", "Wait...")
  yield* talk("Vega", "What’s the noise...?");

  yield* setMode("Past");
  // yield* setLocation(Locations.Bedroom);
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
  yield* setFutureHasChanged();
}

function* charlesEntersBar(): Cinematic {
  yield* narrateInBackground("Charles stumbles into the bar.");
}

function* charlesEntersRoyalSkillet(): Cinematic {
  yield* narrateInBackground("You see Charles enter the Royal Skillet.");
}

function* charlesGoesDownPassageway(): Cinematic {
  yield* narrateInBackground("You see Charles walk down the passageway.");
}

function* emptyCinematic(): Cinematic {

}

export function* dreamSequence1(): Cinematic {
  yield* setMode("DreamSequence");
  yield* dreamTalk("weeeeee back to the future!!");
  yield* setMode("Future");
  yield* setLocation(Locations.HQ0);

}

  // const result = yield* prompt([
  //   "Blah blah one?",
  //   "Blah blah two?",
  //   "Blah blah three?",
  // ]);

  // if (result === 0) {
  //   yield* talk("Vega", "Oh NO! You chose one.");
  // }

  // if (result === 1) {
  //   yield* talk("Vega", "Oh COOL! You chose two.");
  // }
