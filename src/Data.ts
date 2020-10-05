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
  | 'Past Vega'
  | 'Voice from inside'
  | 'Both Vegas'

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

function* speakToPV01(): Cinematic {
  yield* talk("Vega", "Hey, it’s my old house!");
  yield* talk("Vega", "Wait, why are the people inside moving out already? I didn’t sell it THAT long ago… I hope I didn’t leave behind any pests or broken appliances or anything.");
  yield* talk("Vega", "It’s cool that they’re using the same moving company as I did, though. Glad they took my recommendation!");
  yield* talk("Vega", "Hey, the door’s open. If they’re already moving out, I’m sure they wouldn’t mind if I took a peek inside…");
  yield* talk("Voice from inside", "One last box! So glad this is finally almost over. I should’ve asked some of my friends to help me move out.");
  yield* talk("Vega", "Wait a minute… that sounds like… ");
  yield* talk("Past Vega", "Ah, there we go! Now, who—");
  yield* talk("Vega", "...");
  yield* talk("Past Vega", "...");
  yield* talk("Vega", "?!");
  yield* talk("Past Vega", "?!?!?!?!");
  yield* talk("Both Vegas", "WHAAAAAAAAAAAAT");
  yield* talk("Vega", "No. This isn’t possible.");
  yield* talk("Past Vega", "Oh god please just kill me quickly");
  yield* talk("Vega", "What? Why would I do that?!");
  yield* talk("Past Vega", "I assumed that NATCH found out about my illegal barbecue sauce collection so they cloned a version of me without any kleptomaniac tendencies and have sent that clone to my house to kill me before I could ask any questions.");
  yield* talk("Vega", "Huh? We would never do that!");
  yield* talk("Past Vega", "So you DO work for NATCH! Do your worst, evil me!");
  yield* talk("Vega", "I’M NOT EVIL YOU! I… think I’m from the future? Or a different dimension? I’m not sure. But I’m NOT here to kill you. I AM you. ");
  yield* talk("Past Vega", "Yeah? Prove it.");
  yield* talk("Vega", "I… uh… Oh, I have a birthmark on my elbow. ");
  yield* talk("Past Vega", "NATCH could’ve found that out from the physical I took last week. Not convinced.");
  yield* talk("Vega", "Um… I hate and will never eat tomatoes.");
  yield* talk("Past Vega", "Easily observable behavior. Three strikes and you’re out, evil me. ");
  yield* talk("Vega", "GOD Uh… Uh… ");
  yield* talk("Vega", "*Sigh*");
  yield* talk("Vega", "...my favorite flavor of barbecue sauce is Sweet Baby Ray’s Hickory & Brown Sugar.");
  yield* talk("Past Vega", "Whoa, you ARE me from the future!!!");
  yield* talk("Vega", "Gee. Ya think.");
  yield* talk("Past Vega", "Well, come inside. I’m sure you’re here for a good reason.");
  yield* talk("Vega", "I wouldn’t bet on it.");
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
