import { Debug } from "./App";
import { talk, narrate, giveItem, narrateInBackground, prompt, setMode, dreamTalk, setLocation, setInterruptable, setFutureHasChanged } from "./Cinematics";
import { AllLocations, Cinematic, Location } from "./CinematicTypes";

export type Person =
  | 'Bartender'
  | 'Guy 2'
  | 'Doctor Scramble'
  | '???'
  | 'Vega'
  | 'Captain Sharp'
  | 'Narrator'
  | 'Other Vega'
  | 'Past Vega'
  | 'Voice from inside'
  | 'Both Vegas'

enum Checkpoints {
  'Game Start',
  'Doctor Scramble',
  'Canadian Mafia',
  'Canadian French',
  'Time Travel',
  'Time Gun',
  'Game Over',
};

export let Checkpoint: Checkpoints = Checkpoints["Game Start"];
export function* setCheckpoint(newCheckpoint: Checkpoints): Cinematic { Checkpoint = newCheckpoint; yield "next" };

const Bar: Location = {
  name: 'Bar',
  description: enterBar(),
  interactors: () => {
    return [
      {
        name: 'Bartender',
        dialog: speakToBartender,
        type: "person",
      },

      {
        name: 'Guy 2',
        dialog: speakToGuy2,
        type: "person",
      },
    ];
  },
  exits: [
    'Outdoors',
    'Alleyway',
  ],
  liveEvents: [{
    time: "11:01 AM",
    event: charlesEntersBar(),
  }],
  actions: ['Explore', 'Inventory', 'Interact'],
}

const Outdoors: Location = {
  name: 'Outdoors',
  description: enterOutside(),
  interactors: () => {
    return [
      {
        name: 'Familiar House',
        dialog: speakToPV01,
        type: 'thing',
      }
    ]
  },
  exits: ["Bar", "Alleyway"],
  liveEvents: [{
    time: "11:02 AM",
    event: charlesEntersRoyalSkillet(),
  }],
  actions: ['Explore', 'Inventory', 'Interact'],
}

const FamiliarHouse: Location = {
  name: 'FamiliarHouse',
  description: emptyCinematic(),
  interactors: () => { return []; },
  exits: ["Outdoors"],
  liveEvents: [],
  actions: ['Explore', 'Inventory', 'Interact'],
}

const DarkBG: Location = {
  name: 'DarkBG',
  description: emptyCinematic(),
  interactors: () => { return []; },
  exits: ["DarkBG"],
  liveEvents: [],
  actions: ['Explore', 'Inventory', 'Interact'],
}

const Alleyway: Location = {
  name: 'Alleyway',
  description: enterAlleyway(),
  interactors: () => {
    return [
      {
        name: 'Sky',
        dialog: function* (): Cinematic<void> {
          if (Checkpoint === Checkpoints["Game Start"]) {
            yield* narrate("My god... it's the sky.");
            yield* narrate("Here I thought I was going to die with Doctor Scrambie.");
          } else {
            yield* narrate("Yep... It's the sky.");
          }
        },
        type: "thing",
      },

      {
        name: 'Garbage',
        dialog: function* (): Cinematic<void> {
          yield* narrate("A garbage bin.");
          yield* narrate("It smells pretty bad...");
        },
        type: "thing",
      },

    ]
  },
  exits: ["Bar", "Outdoors"],
  liveEvents: [
  ],
  actions: ['Explore', 'Inventory', 'Interact'],
}

const HQ: Location = {
  name: 'HQ',
  description: describeHQ(),
  interactors: () => {
    return [
      {
        name: 'Captain Sharp',
        dialog: speakToCaptainSharp01,
        type: "person",
      },
      {
        name: 'Giant screen',
        dialog: function* (): Cinematic<void> {
          if (Checkpoint === Checkpoints["Game Start"]) {
            yield* narrate("It's the huge screen we have in HQ.");
            yield* narrate("I like to think it's recording our research into parallel universes.");
            yield* narrate("But that's impossible, because science fiction isn't real.");
          }
        },
        type: "thing",
      },
      {
        name: 'Other scientists',
        dialog: function* (): Cinematic<void> {
          if (Checkpoint === Checkpoints["Game Start"]) {
            yield* narrate("There are a bunch of other scientists hard at work.");
            yield* narrate("Normally I'd go say hi, but right now it looks like Captain Sharp wants to talk with me.");
          }
        },
        type: "thing",
      },
    ]
  },
  exits: [],
  liveEvents: [
    {
      time: "11:20 AM",
      event: emptyCinematic(), // lol - we could do something funny here // no
    }
  ],
  actions: ['Explore', 'Inventory', 'Interact'],
}

export type LocationNames =
  | 'Bar'
  | 'FamiliarHouse'
  | 'Outdoors'
  | 'Alleyway'
  | 'DarkBG'
  | 'HQ'

export const Locations: AllLocations = {
  Bar,
  Outdoors,
  Alleyway,
  DarkBG,
  HQ,
  FamiliarHouse,
};

let hasntSeenEnterAlleyway = true;
function* enterAlleyway(): Cinematic {
  if (Checkpoint === Checkpoints["Game Start"]) {
    if (hasntSeenEnterAlleyway) {
      yield* talk("Vega", "What the... where am I?");

      if (!Debug) {
        yield* talk("Vega", "Captain Sharp? Hello?");
        yield* talk("Vega", "Wait... I know this alley. This is in downtown Chipville. I lived here before I moved to take that job at NATCH…");
        yield* talk("Vega", "It looks just like I remember it, too.");
        yield* talk("Vega", "Well, might as well take a look around.");
      }
    } else {
      yield* narrate("It's the alley.");
    }

    hasntSeenEnterAlleyway = false;
  }
}

export function* describeHQ(): Cinematic {
  yield* talk("Vega", "Just made it into work.");
  yield* talk("Vega", "Looks like Captain Sharp wants to talk to me. I can talk with him with the [Interact] button.");
}

export function* startGame(): Cinematic {
  yield* setLocation(Locations.DarkBG);

  yield* setInterruptable(false);

  yield* talk("Vega", "Ah... Good morning, beautiful world!");
  yield* talk("Vega", "Well, no time to waste. Boss said that he had some big news for me. Gotta head to work!");
  yield* setInterruptable(true);

  yield* setMode("DreamSequence");
  yield* dreamTalk("DAY 1");
  yield* dreamTalk("");
  yield* dreamTalk("MONDAY, DECEMBER 8th");
  yield* dreamTalk("");
  yield* dreamTalk("NATIONAL AGENCY FOR CONTAINMENT OF THREATS HEADQUARTERS (NATCH)");
  yield* setMode("Future");

  yield* setLocation(Locations.HQ);
}

// note: dialogue function names have the format "speakToCharacter[Checkpoint][Occurrence]"
// e.g. speakToCaptainSharp01 is the 1th time you speak to him in checkpoint 0
// e.g. speakToPV23 is the 3th time you speak to past vega in checkpoint 2

function* speakToCaptainSharp01(): Cinematic {
  yield* talk("Captain Sharp", "Hey, Vega!");
  yield* talk("Vega", "Morning, Captain! You said yesterday that you had news?");

  yield* talk("Captain Sharp", "Right, right! I do indeed.");
  yield* talk("Captain Sharp", "We’ve been monitoring your work and have noticed that you’ve been incredibly productive lately.");
  yield* talk("Captain Sharp", "Your takedown of the Goober Gang last month was some top-notch stuff, and I heard from Withers in Recon that you’ve spent most of last week on a highly successful stakeout mission. Your country is safer with you in it!");
  yield* talk("Vega", "Thanks so much! All in the line of duty, sir.")
  yield* talk("Captain Sharp", "In fact, we’re so happy with your performance that we’re going to give you this next week off. Congratulations! ")
  yield* talk("Vega", "OMG YAY!!!", ["huge"]);
  yield* talk("Captain Sharp", "Keep this up, and you might even be on track for a promotion soon!");
  yield* narrate("The captain winks.");
  yield* narrate("It's a bit unsettling.");
  yield* talk("Vega", "Will do, Captain!! You have no idea how—");
  yield* talk("Vega", "Wait...", ["slow"])
  yield* narrate("r u m b l e", ["shaky"])
  yield* talk("Vega", "What’s that noise...?", ["slow"]);

  yield* narrate("C R A S H", ["huge", "shaky"])

  yield* talk("???", "MUAHAHA! Prepare to meet your end, NATCH! I have finally discovered your secret hideout!!!")
  yield* talk("Vega", "Oh no...");


  yield* setMode("Past");
  yield* thrownInPastForFirstTime();
}

export function* thrownInPastForFirstTime(): Cinematic {
  yield* setLocation(Locations.Alleyway);
}

let canEnterHouse = false;

function* speakToPV01(): Cinematic {
  yield* talk("Vega", "Hey, it’s my old house!");
  yield* talk("Vega", "Wait, why are the people inside moving out already? I didn’t sell it THAT long ago… I hope I didn’t leave behind any pests or broken appliances or anything.");
  yield* talk("Vega", "It’s cool that they’re using the same moving company as I did, though. Glad they took my recommendation!");
  yield* talk("Vega", "Ooh, the door’s open. If they’re already moving out, I’m sure they wouldn’t mind if I took a peek inside…");
  yield* talk("Voice from inside", "One last box! So glad this is finally almost over. I should’ve asked some of my friends to help me move out.");
  yield* talk("Vega", "Wait a minute… that sounds like… ");
  yield* talk("Other Vega", "Ah, there we go! Now, who—");
  yield* talk("Vega", "...", ["slow"]);
  yield* talk("Other Vega", "...", ["slow"]);
  yield* talk("Vega", "?!", ["shaky"]);
  yield* talk("Other Vega", "?!?!?!?!", ["huge"]);
  yield* talk("Both Vegas", "AAAAAAAAAAHHHH", ["huge", "shaky"]);
  yield* talk("Vega", "No. This isn’t possible.");
  yield* talk("Other Vega", "Oh god please just kill me quickly");
  yield* talk("Vega", "What? Why would I do that?!");
  yield* talk("Other Vega", "I assumed that NATCH found out about my illegal barbecue sauce collection so they cloned a version of me without any kleptomaniac tendencies and have sent that clone to my house to kill me before I could ask any questions.");
  yield* talk("Vega", "Huh? We would never do that!");
  yield* talk("Other Vega", "So you DO work for NATCH! Do your worst, evil me!");
  yield* talk("Vega", "I’M NOT EVIL YOU! I… think I’m from the future? Or a different dimension? I’m not sure. But I’m NOT here to kill you. I AM you. ");
  yield* talk("Other Vega", "Yeah? Prove it.");
  yield* talk("Vega", "I… uh… Oh, I have a birthmark on my elbow. ");
  yield* talk("Other Vega", "NATCH could’ve found that out from the physical I took last week. Not convinced.");
  yield* talk("Vega", "Um… I hate and will never eat tomatoes.");
  yield* talk("Other Vega", "Easily observable behavior. Three strikes and you’re out, evil me. ");
  yield* talk("Vega", "GOD Uh… Uh… ");
  yield* talk("Vega", "*Sigh*");
  yield* talk("Vega", "...my favorite flavor of barbecue sauce is Sweet Baby Ray’s Hickory & Brown Sugar.");
  yield* talk("Other Vega", "Whoa, you ARE me from the future!!!");
  yield* talk("Vega", "Gee. Ya think.");
  yield* talk("Other Vega", "Well, come inside. I’m sure you’re here for a good reason.");
  yield* talk("Vega", "I wouldn’t bet on it.");

  canEnterHouse = true;
}

function* speakToPV02(): Cinematic {
  yield* talk("Vega", "...and then everything was normal until this strange-looking guy that the Captain called “Doctor Scramble” shot me with some weird gun. Except there wasn’t a bullet, it was just a beam of light. Next thing I know, I’m back here, on what I can only assume is some day eight months ago. ");
  yield* talk("Other Vega", "So, what you’re saying is that you’re now stuck here with me?");
  yield* talk("Vega", "I mean, you know as much about what’s going on as I do. I’d never even heard of Doctor Scramble before today.");
  yield* talk("Other Vega", "What a weird-sounding name.");

  while (true) {

    const result = yield* prompt([
      "Time paradox",
      "Barbecue sauce",
      "Doctor Scramble",
    ]);

    if (result === 0) {
      yield* talk("Other Vega", "Wait, so does us interacting mean that there’s going to be some kind of time paradox that destroys the world or something?");
      yield* talk("Vega", "Huh. Nothing’s happened yet, so I don’t think so.");
      yield* talk("Other Vega", "Poke!");
      yield* talk("Vega", "Ow! Why’d you poke me?");
      yield* talk("Other Vega", "Well, now we know that it’s safe to make contact.");
      yield* talk("Vega", "Was I always this impulsive?");
    }
    if (result === 1) {
      yield* talk("Other Vega", "So, any interesting new additions to the barbecue collection?");
      yield* talk("Vega", "Heh. To be honest, I sort of fell out of the habit after Sweet Baby Ray’s shut down a few weeks after I joined NATCH.");
      yield* talk("Other Vega", "SWEET BABY RAY’S SHUTS DOWN?!");
      yield* talk("Vega", "Oops.");
      yield* talk("Other Vega", "NOOOOOOOOOOO");
      yield* talk("Vega", "...there, there.");
      yield* talk("Other Vega", "Well, time to sell my stocks. But in the meantime, you must’ve missed it so much! Take this for the road.");
      yield* giveItem("barbecue sauce");
    }
    if (result === 2) {
      yield* talk("Other Vega", "So no one at NATCH ever even mentioned anything about Doctor Scramble before?");
      yield* talk("Vega", "Well, I can’t exactly remember, but Captain Sharp seemed to be grimly familiar with who he was. Makes me think he’s some kind of high-profile threat that newbies like me just aren’t ready for.");
      yield* talk("Other Vega", "Ooh, who’s Captain Sharp?");
      yield* talk("Vega", "Uhh, never mind. And also, you gotta pretend you don’t know him when you get to NATCH. Strange stuff like this tends to get quashed pretty quickly.");
      yield* talk("Other Vega", "Don’t worry, I can handle myself! Any other advice for me once I get there, though?");
      yield* talk("Vega", "Hmm… Make sure to pick an office with a window, unless it’s the one next to Corporal Rogers. The cafeteria has great tofu bowls and terrible Cobb salads. Oh, and if you get the chance, try to find out anything you can about this Doctor Scramble guy. I have a feeling there may be more than meets the eye here.");
      yield* talk("Other Vega", "Will do! I’ll make sure to find out as much as I can.");
      yield* talk("Vega", "Sounds good! And—wait, what’s that sound?");
      // TODO: the YOU'VE CHANGED alarm occurs here 
      break;
    }
  }
  yield* talk("Vega", "What the hell?!");
  yield* talk("Other Vega", "What is it? I don’t see anything.");
  yield* talk("Vega", "AAAAAAAA");
}

function* enterBar(): Cinematic {
  if (Checkpoint === Checkpoints["Game Start"]) {
    yield* narrate("You walk into the Royal Skillet.");
    yield* narrate('This was one of your favorite bars back when you used to live here - though the clientelle were... a bit... strange.');
    yield* narrate('You could never put your finger on why, though.');
  }
}

function* enterOutside(): Cinematic {
  yield* narrate("You walk outdoors.");
  yield* narrate('There is nothing to do here.');
}

let alreadyOrderedToday: { [key in Checkpoints]?: boolean } = {};

function* speakToBartender(): Cinematic {
  if (alreadyOrderedToday[Checkpoint]) {
    yield* talk("Bartender", "Oh... you again?");
    yield* talk("Bartender", "I'm cutting you off - but come back tomorrow!");

    return;
  }

  alreadyOrderedToday[Checkpoint] = true;

  yield* talk("Bartender", "Hello and welcome to the funky bea- er, the Royal Skillet.");
  yield* talk("Bartender", "(Sorry, name change and all!)");
  yield* talk("Bartender", "Can I take your order?"); // 1 root beer pls (and some dunkin donuts coffee)
  yield* talk("Vega", "Of course! I'll have a...");

  const result = yield* prompt([
    "Root beer.",
    "Dunkin donuts coffee.", // mmm donus
    "The most manly drink in the place.",
    "Cobb salad.",
    "Nah screw this place." //not very grammatical smh
    // you literally change your mind in the middle of a sentence
    // grammar does not make nice with NAH SCREW GRAMMAR psychology
  ]);

  if (result === 0) {
    yield* talk("Bartender", "Really? A root beer?");
    yield* talk("Bartender", "In a place like this..?");
    yield* talk("Bartender", "Alright, fine.");

    yield* narrate("You receive one root beer.");

    yield* giveItem("root beer");
  }

  if (result === 1) {
    yield* talk("Bartender", "Well... you're in luck.");
    yield* talk("Bartender", "On alternating mornings we run a dunkin donuts out of here.");
    yield* talk("Bartender", "It's great business.");
    yield* talk("Bartender", "We still have some coffee left.");

    yield* narrate("You receive one dunkin donuts coffee.");

    yield* giveItem("dunkin donuts coffee");
  }

  if (result === 2) {
    yield* talk("Bartender", "Uh huh...");
    yield* talk("Vega", "Yes...");
    yield* talk("Bartender", "The most", ["slow"]);
    yield* talk("Vega", "Yes...");
    yield* talk("Bartender", "MANLY", ["huge", "shaky"]);
    yield* talk("Vega", "Yes!", ["huge"])
    yield* talk("Bartender", "Drink.");
    yield* talk("Vega", "Yes!!!", ["huge", "shaky"])
    yield* talk("Bartender", "Ever.");

    yield* narrate("You receive the frilliest drink you have ever seen. You're not even sure if there's a drink under all that frill.");

    yield* giveItem("strawberry frilly thing");
  }

  if (result === 3) {
    yield* talk("Bartender", "Uh, what?");
    yield* talk("Bartender", "This is an awesome drinks establishment, not an awesome salads establishment.");
    yield* talk("Vega", "Oh. :(")
    yield* talk("Bartender", "But I feel bad for letting you down.");
    yield* talk("Bartender", "Here.");

    yield* narrate("You receive an IOU for one cobb salad.");

    yield* giveItem("IOU for one cobb salad");
  }

  if (result === 4) {
    yield* talk("Bartender", "That wasn't a grammatically correct sentence.");
    yield* talk("Bartender", "You're clearly too drunk to order here. Shoo.");
  }
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CHECKPOINT 1
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function* speakToCaptainSharp11(): Cinematic {
  yield* talk("Captain Sharp", "Hey, Vega!");
  yield* talk("Vega", "Hey, Captain. Listen, I’m sorry about whatever happened yesterday.");
  yield* talk("Captain Sharp", "Huh, what do you mean? Yesterday was Sunday.");
  yield* talk("Vega", "...What? No, today’s Tuesday.");
  yield* talk("Captain Sharp", "You alright there, cadet? You seem a little off, but maybe that’s because you’ve been working so hard. In fact—surprise—the captains and I were thinking of even giving you this week off because you’ve been doing such a good job lately!");
  yield* talk("Vega", "Uh... you already told me that yesterday, sir.");
  yield* talk("Captain Sharp", "On... Sunday? You must be mistaken!");
  yield* talk("Vega", "So you really don’t remember anything? Nothing involving time travel or Doctor Scramble or—");
  yield* talk("Captain Sharp", "Hold on. How do you know that name. You should not know that name.");
  yield* talk("Vega", "What?! You told me about him yesterday when he invaded our HQ!");
  yield* talk("Captain Sharp", "Vega, I’m getting genuinely concerned now. Nothing like that happened at all.");
  yield* talk("Vega", "No, I swear! It was after we were talking about promotion and then everything started rumbling—");
  yield* narrate("r u m b l e", ["shaky"])
  yield* talk("Vega", "JUST LIKE THAT", ["slow", "shaky"]);
  yield* narrate("C R A S H", ["huge", "shaky"])
  yield* talk("Doctor Scramble", "MUAHAHA! Prepare to meet your end, NATCH! I have finally discovered your secret hideout!!!");
  yield* talk("Captain Sharp", "Vega. How did you know this was going to happen.");
  yield* talk("Vega", "What? I don’t know! This already happened! I swear!");
  yield* talk("Doctor Scramble", "Uh, hello? Evil villain with a superweapon here. Kind of thought you’d be paying more attention to me.");
  yield* talk("Captain Sharp", "We will discuss this later, Vega.");
  yield* talk("Captain Sharp", "Hey! Jerk! Get out of our headquarters.");
  yield* talk("Doctor Scramble", "oOoOh i’M sO sCaReD", ["shaky"]);
  yield* talk("Vega", "...wait, okay, so");
  yield* talk("Captain Sharp", "I mean it, bub.");
  yield* talk("Vega", "...am I being Back to the Future’d and Groundhog Day’d AT THE SAME TIME?");
  yield* talk("Doctor Scramble", "What did you just say, girl?");
  yield* talk("Vega", "Hey! You don’t get to talk to me like that after you shot me last time!");
  yield* talk("Doctor Scramble", "Did I, now? How very interesting!");
  yield* talk("Captain Sharp", "Vega, why are you glowing?");
  yield* talk("Vega", "I’m what?");
  yield* talk("Doctor Scramble", "Ah, would you look at the time. Right around 9:47 am. Well, I’d best be off!");
  yield* talk("Vega", "OH GOD WHY IS THIS HAPPENING");
  // TODO: Vega fades

  yield* setMode("Past");
  yield* thrownInPastForSecondTime();
}

export function* thrownInPastForSecondTime(): Cinematic {
  yield* setLocation(Locations.Alleyway);
}

//yield* talk("Vega", "Will do, Captain!! You have no idea how...");
//yield* talk("Vega", "Wait...", ["slow"])
//yield* talk("Vega", "What’s that noise...?", ["slow"]);

//yield* narrate("C R A S H", ["huge", "shaky"])

//yield* talk("???", "MUAHAHA! Prepare to meet your end, NATCH! I have finally discovered your secret hideout!!!")
//yield* talk("Vega", "Oh no...");

//yield* setMode("Past");
//yield* thrownInPastForFirstTime();







export function* startDreamSequence(): Cinematic {
  if (Checkpoint === Checkpoints["Game Start"]) {
    yield* talk("Vega", "Oh god, it’s happening again. The same feeling as when I got hit by that gun.");
    yield* talk("Other Vega", "What the hell?! You’re disappearing!");
    // TODO (maybe): vega avatar fades 
    yield* setMode("DreamSequence");
    yield* dreamTalk("...You feel yourself being pushed through the void...");
    yield* dreamTalk("...It feels like every atom of your body is encased in its own marshmallow...");
    yield* dreamTalk("...Knowledge of the identity of Doctor Scramble gradually flows into your mind...");
    yield* dreamTalk("...T i m e   t o   s o l i d i f y...");
    yield* setMode("Future");
    yield* setLocation(Locations.HQ);
    yield* setCheckpoint(Checkpoints["Doctor Scramble"]);
  }
}

// while (true) {

  // const result = yield* prompt([
  //   "Blah blah one?",
  //   "Blah blah two?",
  //   "Blah blah three?",
  // ]);

  // if (result === 0) {
  //   yield* talk("Vega", "Oh NO! You chose one.");
  // }

  // if (result === 1) {
  //   yield* setLocation(Locations.HQ);
  //   break;
  // }

  // }

  // setDialog BLAH BLAH={}u