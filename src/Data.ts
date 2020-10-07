import { Debug } from "./App";
import { playSong, stopAllMusic, talk, narrate, giveItem, narrateInBackground, prompt, setMode, dreamTalk, setLocation, setInterruptable, setFutureHasChanged, hasItem } from "./Cinematics";
import { AllLocations, Cinematic, Location } from "./CinematicTypes";

export type Person =
  | 'Bartender'
  | 'Doctor Scramble'
  | '???'
  | 'Vega'
  | 'Captain Sharp'
  | 'Narrator'
  | 'Other Vega'
  | 'Past Vega'
  | 'Voice from inside'
  | 'Both Vegas'
  | 'Seedy Guy'
  | 'Shady Guy'
  | 'Past Scramble'
  | 'You find yourself...'

export enum Checkpoints {
  'Game Start',
  'Doctor Scramble',
  'Canadian French',
  'Time Travel',
  'Time Ray',
  'Game Over',
};

export let Checkpoint: Checkpoints = Checkpoints["Game Start"];
export function* setCheckpoint(newCheckpoint: Checkpoints): Cinematic { Checkpoint = newCheckpoint; yield "next" };
export function setCheckpointNoYield(newCheckpoint: Checkpoints) { Checkpoint = newCheckpoint; };

const Bar: Location = {
  name: 'Bar',
  description: enterBar,
  interactors: () => {
    return [
      {
        name: 'Bartender',
        dialog: speakToBartender,
        type: "person",
      },

      {
        name: 'Seedy Guy',
        dialog: speakToSeedyGuy,
        type: "person",
      },

      {
        name: 'Shady Guy',
        dialog: speakToShadyGuy,
        type: "person",
      }
    ];
  },
  exits: [
    'MainStreet',
    'Alleyway',
  ],
  liveEvents: [{
    time: "11:01 AM",
    event: charlesEntersBar(),
  }],
  actions: ['Explore', 'Inventory', 'Interact'],
}

const MainStreet: Location = {
  name: 'MainStreet',
  description: enterOutside,
  interactors: () => {
    return [
      {
        name: 'Familiar House',
        dialog: talkToHouse,
        type: 'thing',
      },
      {
        name: 'Car',
        dialog: function* (): Cinematic<void> {
          yield* narrate("You head over to investigate the car.");
          yield* narrate("It honks at you and continues driving.");
          yield* narrate("Maybe a close investigation of oncoming traffic wasn't the best idea.");
        },
        type: "thing",
      },
      {
        name: 'Busker',
        dialog: talkToBusker,
        type: 'thing',
      }
    ]
  },
  exits: ["Bar", "Alleyway", "House"],
  liveEvents: [{
    time: "11:02 AM",
    event: charlesEntersRoyalSkillet(),
  }],
  actions: ['Explore', 'Inventory', 'Interact'],
}

const House: Location = {
  name: 'House',
  description: enterHouse,
  interactors: () => {
    return [
      {
        name: 'PastVega',
        dialog: speakToPastVega2,
        type: 'thing',
      }
    ];
  },
  exits: ["MainStreet"],
  liveEvents: [],
  actions: ['Explore', 'Inventory', 'Interact'],
}

const DarkBG: Location = {
  name: 'DarkBG',
  description: enterDarkBG,
  interactors: () => { return []; },
  exits: [],
  liveEvents: [],
  actions: ['Explore', 'Inventory', 'Interact'],
}

const Alleyway: Location = {
  name: 'Alleyway',
  description: enterAlleyway,
  interactors: () => {
    return [
      {
        name: 'Sky',
        dialog: function* (): Cinematic<void> {
          if (Checkpoint === Checkpoints["Game Start"]) {
            yield* narrate("My god... it's the sky.");
            yield* narrate("And here I thought I was going to die with that weird doctor guy.");
          } else {
            if (oneInTen()) {
              yield* narrate("Look! A cool bird!");
            } else {
              yield* narrate("Yep... It's the sky.");
            }
          }
        },
        type: "thing",
      },

      {
        name: 'Garbage',
        dialog: function* (): Cinematic<void> {
          yield* narrate("A garbage bin.");
          yield* narrate("For being a garbage bin in the back alley of a bar, it smells about how you'd expect.");
        },
        type: "thing",
      },
    ]
  },
  exits: ["Bar", "MainStreet"],
  liveEvents: [
  ],
  actions: ['Explore', 'Inventory', 'Interact'],
}

const HQ: Location = {
  name: 'HQ',
  description: describeHQ,
  interactors: () => {
    return [
      {
        name: 'Captain Sharp',
        dialog: speakToCaptainSharp,
        type: "person",
      },
      {
        name: 'Giant screen',
        dialog: function* (): Cinematic<void> {
          if (Checkpoint === Checkpoints["Game Start"]) {
            yield* narrate("It's the huge screen we have in HQ.");
            yield* narrate("I like to think it's recording our research into parallel universes.");
            yield* narrate("But that's impossible, because science fiction isn't real.");
          } else if (Checkpoint === Checkpoints["Doctor Scramble"]) {
            yield* narrate("It's the huge screen we have in HQ.");
            yield* narrate("It's playing the exact same thing it was playing yesterday. Weird.");
          } else {
            yield* narrate("It's the huge screen we have in HQ.");
            yield* narrate("I wonder if the person on the live feed knows we can see them.");
            yield* narrate("In fact, I wonder if I'm on someone else's screen right now?");
          }
        },
        type: "thing",
      },
      {
        name: 'Scientists',
        dialog: function* (): Cinematic<void> {
          if (Checkpoint === Checkpoints["Game Start"]) {
            yield* narrate("There are a bunch of scientists hard at work.");
            yield* narrate("Normally I'd go say hi, but right now it looks like Captain Sharp wants to talk with me.");
          } else if (Checkpoint === Checkpoints["Doctor Scramble"]) {
            yield* narrate("There are a bunch of scientists hard at work.");
            yield* narrate("They're all in the same spots they were yesterday. That's odd...");
          } else if (Checkpoint === Checkpoints["Canadian French"]) {
            yield* narrate("There are a bunch of scientists hard at work.");
            yield* narrate("They recently built RecycleBot, a robot recycling receptacle. It's so cute!");
          } else {
            yield* narrate("There are a bunch of scientists hard at work.");
            yield* narrate("They seem busy, so I probably shouldn't go talk to them.");
            yield* narrate("Hey wait, is that guy playing Among Us on the job?");
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
      event: emptyCinematic(), // lol - we could do something funny here 
    }
  ],
  actions: ['Explore', 'Inventory', 'Interact'],
}

export type LocationNames =
  | 'Bar'
  | 'House'
  | 'MainStreet'
  | 'Alleyway'
  | 'DarkBG'
  | 'HQ'

export const Locations: AllLocations = {
  Bar,
  MainStreet,
  Alleyway,
  DarkBG,
  HQ,
  House,
};

let hasntSeenEnterAlleyway = true;
export function* enterAlleyway(): Cinematic {
  if (Checkpoint === Checkpoints["Game Start"]) {
    if (hasntSeenEnterAlleyway) {

      yield* narrate("---------------");
      yield* talk("You find yourself...", "...in an alleyway.");
      yield* talk("Vega", "What the... where am I?");

      //if (!Debug) {
      yield* talk("Vega", "Captain Sharp? Hello?");
      yield* talk("Vega", "Wait... I know this alley. This is in downtown Chipville. I lived here before I moved to take that job at NATCH...");
      yield* talk("Vega", "It looks just like I remember it, too.");
      yield* talk("Vega", "Well, might as well take a look around.");
      //}

      hasntSeenEnterAlleyway = false;
    } else {
      yield* narrate("It's the alley you appeared in.");
    }

  }
  if (Checkpoint === Checkpoints["Doctor Scramble"]) {
    if (hasntSeenEnterAlleyway) {
      yield* talk("Vega", "Ugh... back in this gross alley again. That Doctor Scramble really is something else. ");
      yield* talk("Vega", "I’m glad that past me learned all that stuff about him, though. I know a lot more about his history, especially with the Canadian mafia.");
      yield* talk("Vega", "Hey, maybe past me will have some idea on how to actually get Doctor Scramble to listen to me and get me out of this weird time loop. ");
      yield* talk("Vega", "Wait, will past me even remember me? Only one way to find out, I guess. ");

      hasntSeenEnterAlleyway = false;
    } else {
      yield* narrate("It's the alley you appeared in.");
    }
  }
  if (Checkpoint === Checkpoints["Canadian French"]) {
    if (hasntSeenEnterAlleyway) {
      yield* narrate("You're back in the alley.");
      yield* talk("Vega", "Somehow, this alley gets grosser and grosser every time.");
      yield* talk("Vega", "Alright, I guess I should go check out the mafia before I go meet myself again. Wouldn’t want to drag her into this dirty business—she’s already so... fragile.");
      yield* talk("Vega", "If past past me is right, their base of operations should be the Royal Skillet bar.");

      hasntSeenEnterAlleyway = false;
    } else {
      yield* narrate("It's the alley you appeared in.");
    }
  }
}

export function* describeHQ(): Cinematic {
  if (Checkpoint === Checkpoints["Game Start"]) {
    yield* talk("Vega", "Here I am! The workplace is busy this morning.");
    yield* talk("Vega", "Looks like Captain Sharp wants to talk to me. I can talk with him with the [Interact] button.");
  } else {
    yield* narrate("It's the NATCH, your workplace.");
  }
}

export function* startGame(): Cinematic {
  yield* setLocation(Locations.DarkBG);
  // yield* setFutureHasChanged();

  // yield* setInterruptable(false);

  // yield* talk("Vega", "Ah... Good morning, beautiful world!");
  // yield* talk("Vega", "Well, no time to waste. Boss said that he had some big news for me. Gotta head to work!");
  // yield* setInterruptable(true);

  // yield* setMode("DreamSequence");
  // yield* dreamTalk("DAY 1");
  // yield* dreamTalk("");
  // yield* dreamTalk("MONDAY, DECEMBER 8th");
  // yield* dreamTalk("");
  // yield* dreamTalk("NATIONAL AGENCY FOR CONTAINMENT OF THREATS HEADQUARTERS (NATCH)");
  // yield* setMode("Future");

  // yield* setLocation(Locations.HQ);
}



//////////////////////////////////////////////////////////////
//
//   ENTER Area Functions
//
//////////////////////////////////////////////////////////////

function* enterBar(): Cinematic {
  if (Checkpoint === Checkpoints["Game Start"]) {
    yield* narrate("You walk into the Royal Skillet.");
    yield* narrate("This was one of your favorite bars back when you used to live here, although much of the clientelle were... a bit... strange.");
    yield* narrate("You could never put your finger on exactly why, though.");
  } else {
    yield* narrate("You walk into the Royal Skillet. The soft hum of jazz music fills your ears.");
  }
}

function* enterOutside(): Cinematic {
  yield* narrate("You head downtown.");
  // yield* narrate('There is nothing to do here.');
}

let isGameOver = false;

export function* enterDarkBG(): Cinematic {
  yield* setInterruptable(false);

  let day = 1;

  if (Checkpoint === Checkpoints["Game Start"]) {
    yield* talk("Vega", "Ah... Good morning, beautiful world!");
    yield* talk("Vega", "Well, no time to waste. The Captain said that he had some big news for me. Gotta head to work!");
    yield* setInterruptable(true);

    day = 1;
  } if (Checkpoint === Checkpoints["Doctor Scramble"]) {
    yield* stopAllMusic();
    yield* talk("Vega", "Ah... good morning, beautif... huh.");
    yield* talk("Vega", "What even happened yesterday? Did I really go back in time? Was that all a dream?");
    yield* talk("Vega", "It can’t have been. That sounds like a plot twist that a really bad game developer would write.");
    yield* talk("Vega", "Besides, I know all this information about Doctor Scramble now... Oh well, can’t dwell on that. I should go apologize to the Captain about what happened.");
    yield* setInterruptable(true);

    day = 2;
  } if (Checkpoint === Checkpoints["Canadian French"]) {
    yield* stopAllMusic();
    yield* talk("Vega", "Ah... good morning. Beautiful world.");
    yield* talk("Vega", "So, here I am again. Please please please be December 9th when I check my phone.");
    yield* talk("Vega", "... Yeah. No such luck. I guess we’re doing this.");
    yield* talk("Vega", "Might as well head to work to confront Doctor Scramble again, I guess.");
    yield* setInterruptable(true);

    day = 3;
  } if (Checkpoint === Checkpoints["Time Travel"]) {
    yield* stopAllMusic();
    yield* talk("Vega", "Goood morning world. Here we go again.");
    yield* setInterruptable(true);

    day = 4;
  } if (Checkpoint === Checkpoints["Time Ray"]) {
    yield* stopAllMusic();
    yield* talk("Vega", "...I’m awake. That’s good.");
    yield* talk("Vega", "And I remember... time theory. And engineering. Wait, my time ray! Do I have my time ray?");
    yield* narrate("Your inventory contains one TIME RAY.");
    yield* talk("Vega", "Yes! I came through! ...but there’s one more thing I need to do before I use this.");

    day = 5;
  } if (Checkpoint === Checkpoints["Game Over"]) {
    day = 6;
    yield* stopAllMusic();
    yield* talk("Vega", "Am... Am I alive?");
    yield* talk("Vega", "Is this my bed? It is! What day is it?");
    yield* talk("Vega", "...");
    yield* talk("Vega", "December 9th...");
    yield* talk("Vega", "DECEMBER 9TH!!!!");

    yield* narrate("It IS a good morning.");
    yield* narrate("It IS a beautiful world.");
    yield* narrate("...");
    yield* pause(1);
    yield* narrate("....");
    yield* pause(1);
    yield* narrate(".........");
    yield* pause(1);
    yield* narrate("THE END!!", ["huge", "shaky"]);


    isGameOver = true;

    ///////////////////////////
    //
    //  TODO: GAME ENDS HERE
    //
    ///////////////////////////

  }

  if (!isGameOver) {
    if (!Debug) {
      yield* setMode("DreamSequence");
      yield* dreamTalk(`DAY ${day}`);
      yield* dreamTalk("");
      yield* dreamTalk("MONDAY, DECEMBER 8th");
      yield* dreamTalk("");
      yield* dreamTalk("NATIONAL AGENCY FOR CONTAINMENT OF THREATS HEADQUARTERS (NATCH)");
      yield* setMode("Future");
    }

    yield* setLocation(Locations.HQ);
  }
}

function* enterHouse(): Cinematic {
  debugger;

  if (canEnterHouse === false) {
    yield* setLocation(Locations.MainStreet);
    if (Checkpoint === Checkpoints["Game Start"]) {
      yield* narrate("You can't just enter a random house! ...There is something familiar about it, though.");
      yield* narrate("Maybe you should inspect it more closely.");
    } else {
      yield* narrate("It's your old house! ...but you should probably check with past you before going in, though.");
    }
  } else {
    if (Checkpoint === Checkpoints["Game Start"]) {
      // bc canEnterHouse is false right? or is that happening when its also true // it's happening when true. i'm in the house but the text isn't activating
      // try uhh 
      // console.log(canEnterHouse);
      // console.log(speakToPV02);
      yield* speakToPV02(); // this line isn't automatically showing up when u enter house and i'm not sure why

    } if (Checkpoint === Checkpoints["Doctor Scramble"]) {
      // console.log(canEnterHouse);
      // console.log(speakToPV12);
      yield* speakToPV12();

    } if (Checkpoint === Checkpoints["Canadian French"]) {
      yield* speakToPV22();

    } if (Checkpoint === Checkpoints["Time Travel"]) {
      yield* speakToPV31();
    }
  }
}


//////////////////////////////////////////////////////////////
//
//   INTERACTIONS
//
//////////////////////////////////////////////////////////////

let alreadyOrderedToday: { [key in Checkpoints]?: boolean } = {};

function* speakToBartender(): Cinematic {
  if (alreadyOrderedToday[Checkpoint]) {
    yield* talk("Bartender", "Oh... you again?");
    yield* talk("Bartender", "I'm cutting you off - but you can always back tomorrow!");

    return;
  }

  alreadyOrderedToday[Checkpoint] = true;

  yield* talk("Bartender", "Hello and welcome to the funky bea- er, the Royal Skillet.");
  yield* talk("Bartender", "(Sorry, name change and all!)");
  yield* talk("Bartender", "Can I take your order?"); // 1 root beer pls (and some dunkin donuts coffee)
  yield* talk("Vega", "Of course! I'll have...");

  const result = yield* prompt([
    "a root beer.",
    "a Dunkin Donuts coffee.", // mmm donus
    "the most manly drink in the place.",
    "a Cobb salad.",
    "nah screw this place." //not very grammatical smh
    // you literally change your mind in the middle of a sentence
    // grammar does not make nice with NAH SCREW GRAMMAR psychology
  ]);

  if (result === 0) {
    yield* talk("Bartender", "Really? A root beer?");
    yield* talk("Bartender", "In a place like this..?");
    yield* talk("Bartender", "Alright, fine.");

    yield* narrate("You receive one ROOT BEER.");

    yield* giveItem("root beer");
  }

  if (result === 1) {
    yield* talk("Bartender", "Well... you're in luck.");
    yield* talk("Bartender", "On alternating mornings we run a Dunkin' Donuts out of here.");
    yield* talk("Bartender", "It's great business! We still have some coffee left.");

    yield* narrate("You receive one DUNKIN' DONUTS COFFEE.");

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

    yield* narrate("You receive one FRILLIEST DRINK YOU HAVE EVER SEEN. You're not even sure if there's a drink under all that whipped cream.");

    yield* giveItem("strawberry frilly thing");
  }

  if (result === 3) {
    yield* talk("Bartender", "Uh, what?");
    yield* talk("Bartender", "This is an awesome drinks establishment, not a dumb salads establishment.");
    yield* talk("Vega", "Oh. :(")
    yield* talk("Bartender", "But I feel bad for letting you down.");
    yield* talk("Bartender", "Here.");
    yield* narrate("You receive one IOU FOR ONE COBB SALAD.");
    yield* giveItem("IOU for one cobb salad");
  }

  if (result === 4) {
    yield* talk("Bartender", "That wasn't a grammatically correct sentence.");
    yield* talk("Bartender", "You're clearly too drunk to order here. Shoo.");
  }
}

let talkedToPastScramble = false;

function* speakToShadyGuy(): Cinematic {
  if (Checkpoint === Checkpoints["Canadian French"]) {
    yield* talk("Shady Guy", "Whaddaya want, eh?");
    const result = yield* prompt([
      "Say hello",
      "SECRET PASSWORD",
    ]);

    if (result === 0) {
      yield* talk("Vega", "Good morning! How ya doin?");
      yield* talk("Shady Guy", "Ain't no good mornings here. Beat it, kid.");

      yield* narrate("Apparently he doesn't want to be talked to...")
    }

    if (result === 1) {
      if (!talkedToPastScramble) {
        // console.log(talkedToPastScramble);
        yield* talk("Vega", "Le chat noir brille de lait de castor. ");
        yield* talk("Shady Guy", "Ah, très bien. What may I do for you, mon ami? ");
        yield* talk("Vega", "Oh! Euh, je voudrais un moment avec Monsieur Scramble, please.");
        yield* talk("Shady Guy", "Very good. I shall retrieve him, tout de suite. ");
        yield* talk("Vega", "Wow, I can’t believe that worked. Nice job on getting that passcode, past me. ");
        yield* talk("Past Scramble", "Salut, salut ! Always a joy to see one of our soeurs de la branche de Montréal. May I ask, what is your business here today? ");
        yield* talk("Vega", "Oh ! Bonne question. Well, euhh, as an aspiring and rising mafia leader myself, I was in the area and thought I would drop by to ask you if you had any sage advice on how to, euh, how do you say, run a mob ! I hear you have beaucoup de talent in this area. ");
        yield* talk("Past Scramble", "Ah, of course ! Oui, I should’ve guessed. I am happy to regale you with tales of mes réussites. Par contre, this is quite a long story — perhaps we may share a drink first ? ");
        yield* talk("Vega", "Bonne idée - happy to! ");
        yield* talk("Past Scramble", "Garçon! S'il vous plaît! ");
        yield* narrate("Many drinks later...", ["slow"]);
        yield* talk("Past Scramble", "...aNd EveN shO, tHe OtheR ScieNtiSHtsh wOuLDn’T shToP maKinG fUn of mE!! cAn yOu BeLieVE IT?!! ");
        yield* talk("Vega", "Incroyable ! But you are so skilled and talented ! ");
        yield* talk("Past Scramble", "OUI ! *gulp* C'EST ABSOLUMENT *gulp* ABSURDE ! ");
        yield* talk("Past Scramble", "Mais, écoutez, here’s the thing. I got the last laugh on THEM. You know why ? Because... my research into time theory actually WENT somewhere ! Those jerks can have their tHeOriES, but I’m working on a device that can actually TAKE SOMEONE THROUGH TIME!!! How cool is that?!! They never saw mon plein potentiel. ");
        yield* talk("Vega", "Phénoménal ! How does it work ? ");
        yield* talk("Past Scramble", "Well, I probably shouldn’t tell you... HAH ! But who can stop me ! You see, floating everywhere through the universe are teeeeny tiiiiny - vraiment TOUT PETIT - particles called ‘chronons’. They’re just bumping about the, how do I say, quantum time field that permeates throughout all of space, but their interactions with the atoms in your body are what make YOU go through time. And me. And TOUT LE MONDE. ");
        yield* talk("Vega", "C'est fascinant ! ");
        yield* talk("Past Scramble", "Mais, if you can manipulate the chronon-fermion interactions in a particular way, you might be able to interfere with something’s or someONE’s chronon alignment such that it could send them HURTLING THROUGH TIME ! Isn’t that an exciting thought?! ");
        yield* talk("Vega", "Ah yes, absolument ! Perspicace ! Élégant ! I would love to stay and hear more, but I believe I am late for a rendez-vous. ");
        yield* talk("Past Scramble", "Of course ! You should be on your way. I myself am magnificently busy as well. ");
        yield* talk("Vega", "Well, Docteur, it’s been lovely. Do take care. ");
        yield* talk("Past Scramble", "Likewise.");
        yield* narrate("You leave the bar.");
        yield* talk("Past Scramble", "Hmm... 'Docteur' ? ");

        talkedToPastScramble = true;
        yield* setLocation(Locations.MainStreet);
        yield* pause(2);

        yield* talk("Vega", "Wow, those acting and fake-drinking lessons I had to take for NATCH applications REALLY paid off.");
      } else {
        yield* talk("Vega", "Le chat noir brille de lait de castor. ");
        yield* talk("Shady Guy", "Ah, I am afraid that Monsieur Scramble is busy. Please return at a later time.");
      }
    }
  } else {
    yield* talk("Shady Guy", "Whaddaya want, eh?");
    const result = yield* prompt([
      "Say hello",
      "Ask about the bar",
    ]);

    if (result === 0) {
      yield* talk("Vega", "Good morning! How ya doin?");
      yield* talk("Shady Guy", "Ain't no good mornings here. Beat it, kid.");

      yield* narrate("Apparently he doesn't want to be talked to...")
    }

    if (result === 1) {
      yield* talk("Vega", "So what's the deal with this bar?");
      yield* talk("Shady Guy", "...you're not from around here. Beat it, kid.");
    }
  }

}

function* speakToSeedyGuy(): Cinematic {
  if (Checkpoint === Checkpoints["Doctor Scramble"]) {
    yield* talk("Seedy Guy", "Oh, were you looking for speedy guy? I'm SEEDY guy.");
    yield* talk("Seedy Guy", "Speedy guy's out back, I think. Maybe. Every time I go check, he's already gone.");

    if (yield* hasItem("root beer")) {
      yield* talk("Seedy Guy", "Dang... nice root beer.");
      yield* talk("Seedy Guy", "I wish I had one.");
    }
  } else if (Checkpoint === Checkpoints["Canadian French"]) {
    yield* talk("Seedy Guy", "...French? Naw, iunno any o' that stuff.");
    yield* talk("Seedy Guy", "I'm just here for the booze, ya dig?");
  } else {
    yield* talk("Seedy Guy", "Hehe, yup. Ya got me. I'm a pretty seedy guy.");
    yield* talk("Seedy Guy", "Naw, I ain't no gardener or anything. These stains on my clothes ain't dirt stains, if ya know what I'm sayin'!");
  }

  // yield* giveItem("book");
  // yield* setFutureHasChanged();
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

function* speakToCaptainSharp(): Cinematic {
  if (Checkpoint === Checkpoints["Game Start"]) {
    yield* speakToCaptainSharp01();
  } if (Checkpoint === Checkpoints["Doctor Scramble"]) {
    yield* speakToCaptainSharp11();
  } if (Checkpoint === Checkpoints["Canadian French"]) {
    yield* speakToCaptainSharp21();
  } if (Checkpoint === Checkpoints["Time Travel"]) {
    yield* speakToCaptainSharp31();
  } if (Checkpoint === Checkpoints["Time Ray"]) {
    yield* speakToCaptainSharp41();
  }
}

function* talkToHouse(): Cinematic {
  if (Checkpoint === Checkpoints["Game Start"]) {
    yield* speakToPV01();
  } if (Checkpoint === Checkpoints["Doctor Scramble"]) {
    yield* speakToPV11();
  } if (Checkpoint === Checkpoints["Canadian French"]) {
    yield* speakToPV21();
  } if (Checkpoint === Checkpoints["Time Travel"]) {
    yield* speakToPV31();
  }
}

function* speakToPastVega2(): Cinematic {
  if (Checkpoint === Checkpoints["Game Start"]) {
    yield* speakToPV02();
  } if (Checkpoint === Checkpoints["Doctor Scramble"]) {
    yield* speakToPV12();
  } if (Checkpoint === Checkpoints["Canadian French"]) {
    yield* speakToPV22();
  }
}

function* talkToBusker(): Cinematic {
  if (Checkpoint === Checkpoints["Game Start"]) {
    yield* narrate("You head over to listen to what the busker is playing.");
    yield* narrate("It's an intriguing melody with both octave and semitonal movement.");
    yield* narrate("You toss him a coin and see his face light up.");
  } if (Checkpoint === Checkpoints["Doctor Scramble"]) {
    yield* narrate("You head over to listen to what the busker is playing.");
    yield* narrate("The melody makes you feel just like an overload.");
    yield* narrate("You toss him a coin and he texts you some digital love.");
  } if (Checkpoint === Checkpoints["Canadian French"]) {
    yield* narrate("You head over to listen to what the busker is playing.");

    if (yield* hasItem("root beer")) {
      yield* narrate("You offer him a sip of root beer.");
      yield* narrate("He plays B A G F# G D.");
    } else {
      yield* narrate("His song makes you feel like part of your heart is somewhere else.");
      yield* narrate("You non-violently toss him a coin and he does a one-man kickline.");
    }
  } if (Checkpoint === Checkpoints["Time Travel"]) {
    yield* narrate("You head over to listen to what the busker is playing.");
    yield* narrate("The melody is going uuuup and downnnn and uuuup and downnnn.");
    yield* narrate("You toss him a coin because of the good way he uses a sound we all know and love.");
  }
}

function oneInTen() {
  return (Math.random() < 0.1);
}


//////////////////////////////////////////////////////////////
//
//   Checkpoint 0 (Game Start)
//
//////////////////////////////////////////////////////////////

// note: dialogue function names have the format "speakToCharacter[Checkpoint][Occurrence]"
// e.g. speakToCaptainSharp01 is the 1th time you speak to him in checkpoint 0
// e.g. speakToPV23 is the 3th time you speak to past vega in checkpoint 2

function* speakToCaptainSharp01(): Cinematic {
  yield* talk("Captain Sharp", "Hey, Vega!");

  if (!Debug) {
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
    yield* talk("Vega", "Who the hell is this guy?! ");
    yield* talk("Captain Sharp", "Let’s just say he’s bad news. I’ll handle this. ");
    yield* talk("Captain Sharp", "Hey! Jerk! Get out of our headquarters. ");
    yield* talk("???", "oOoOh i’M sO sCaReD ");
    yield* talk("Captain Sharp", "I MEAN it, bub. Don’t think we don’t know who you are, Doctor Scramble. ");
    yield* talk("Doctor Scramble", "Hah! If you know who I am, then you already know too much about the secret weapon I’ve been developing. Guess it’s time to give my little prototype here a test run ;) ");
    yield* talk("Vega", "Is that a gun?! ");
    yield* talk("Doctor Scramble", "MWAHAHAHAHA ");
    yield* talk("Vega", "N O O O O O O O O ", ["slow"]);
    yield* narrate("ZAP!");
    yield* talk("Captain Sharp", "Wha... VEGA! NO! WHY DID YOU JUMP IN FRONT OF ME?");
    yield* talk("Vega", "It’s okay... I’m happy to take a bullet for my captain... ");
    yield* talk("Captain Sharp", "Vega... ");
    yield* talk("Captain Sharp", "That wasn’t a bullet. ");
    yield* talk("Doctor Scramble", "IT SURE WASN’T! ");
    yield* talk("Vega", "What the... ");
    yield* talk("Vega", "Why am I GLOWING? ");
    yield* talk("Vega", "WHAT HAVE YOU DONE TO ME?! ");
    yield* talk("Doctor Scramble", "How interesting! ");
  }

  yield* talk("Vega", "I... ");
  yield* talk("Vega", "I don’t feel so good... ");
  // TODO: Vega fades
  yield* talk("Doctor Scramble", "Ugh, what a cliche. ");

  yield* setMode("Past");
  yield* thrownInPastForFirstTime();
  // TODO: Figure out how to add Milo's time machine sound effect whenever this occurs
}

export function* thrownInPastForFirstTime(): Cinematic {
  yield* playSong("time travel");
  yield* pause(3);
  yield* setLocation(Locations.Alleyway);
}

let canEnterHouse = false;

function* speakToPV01(): Cinematic {
  yield* talk("Vega", "Hey, that's...");
  yield* talk("Vega", "That’s my old house!!");
  yield* talk("Vega", "Wait, why are the people inside moving out already? I didn’t sell it THAT long ago... I hope I didn’t leave behind any pests or broken appliances or anything.");
  yield* talk("Vega", "It’s cool that they’re using the same moving company as I did, though. Glad they took my recommendation!");
  yield* talk("Vega", "Ooh, the door’s open. If they’re already moving out, I’m sure they wouldn’t mind if I took a peek inside...");
  yield* talk("Voice from inside", "One last box! So glad this is finally almost over. I should’ve asked some of my friends to help me move out.");
  yield* talk("Vega", "Wait a minute... that sounds like... ");
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
  yield* talk("Vega", "I’M NOT EVIL YOU! I... think I’m from the future? Or a different dimension? I’m not sure. But I’m NOT here to kill you. I AM you. ");
  yield* talk("Other Vega", "Yeah? Prove it.");
  yield* talk("Vega", "I... uh... Oh, I have a birthmark on my elbow. ");
  yield* talk("Other Vega", "NATCH could’ve found that out from the physical I took last week. Not convinced.");
  yield* talk("Vega", "Um... I hate and will never eat tomatoes.");
  yield* talk("Other Vega", "Easily observable behavior. Three strikes and you’re out, evil me. ");
  yield* talk("Vega", "GOD Uh... Uh... ");
  yield* talk("Vega", "*Sigh*");
  yield* talk("Vega", "...my favorite flavor of barbecue sauce is Sweet Baby Ray’s Hickory & Brown Sugar.");
  yield* talk("Other Vega", "Whoa, you ARE me from the future!!!");
  yield* talk("Vega", "Gee. Ya think.");
  yield* talk("Other Vega", "Well, come inside. I’m sure you’re here for a good reason.");
  yield* talk("Vega", "I wouldn’t bet on it.");

  canEnterHouse = true;
}

function* speakToPV02(): Cinematic {
  yield* talk("Other Vega", "So, uh, tell me. Why are you here?");
  yield* talk("Vega", "I'm honestly not sure? It's a confusing and short story.");
  yield* narrate("You relay what happened this morning.");
  yield* talk("Vega", "...and then everything was normal until this strange-looking guy that the Captain called “Doctor Scramble” shot me with some weird raygun. Except there wasn’t a bullet, it was just a beam of light. Next thing I know, I’m back here, on what I can only assume is some day eight months ago. ");
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

      yield* narrate("You receive one BARBECUE SAUCE.");
      yield* giveItem("barbecue sauce");
    }
    if (result === 2) {
      yield* talk("Other Vega", "So no one at NATCH ever even mentioned anything about Doctor Scramble before?");
      yield* talk("Vega", "Well, I can’t exactly remember, but Captain Sharp seemed to be grimly familiar with who he was. Makes me think he’s some kind of high-profile threat that newbies like me just aren’t ready for.");
      yield* talk("Other Vega", "Ooh, who’s Captain Sharp?");
      yield* talk("Vega", "Uhh, never mind. And also, you gotta pretend you don’t know him when you get to NATCH. Strange stuff like this tends to get quashed pretty quickly.");
      yield* talk("Other Vega", "Don’t worry, I can handle myself! Any other advice for me once I get there, though?");
      yield* talk("Vega", "Hmm... Make sure to pick an office with a window, unless it’s the one next to Corporal Rogers. The cafeteria has great tofu bowls and terrible Cobb salads. Oh, and if you get the chance, try to find out anything you can about this Doctor Scramble guy. I have a feeling there may be more than meets the eye here.");
      yield* talk("Other Vega", "Will do! I’ll make sure to find out as much as I can.");
      yield* talk("Vega", "Sounds good! And—wait, what’s that sound?");
      yield* talk("Vega", "What the hell?!");
      yield* talk("Other Vega", "What is it? I don’t see anything.");
      yield* talk("Vega", "AAAAAAAA");

      yield* setFutureHasChanged()
      break;
    }
  }

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
  yield* narrate("r u m b l e", ["shaky"]);
  yield* talk("Vega", "JUST LIKE THAT", ["slow", "shaky"]);
  yield* narrate("C R A S H", ["huge", "shaky"]);
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
  hasntSeenEnterAlleyway = true;
}

export function* thrownInPastForSecondTime(): Cinematic {
  yield* playSong("time travel");
  yield* pause(4);
  yield* setLocation(Locations.Alleyway);
}

function* speakToPV11(): Cinematic {
  yield* talk("Vega", "Well, the moving van is still here, so I guess this is still my moving day. ");
  yield* talk("Vega", "So, uh, what did I do last time? Do I just stand here in the doorway, or... ");
  yield* talk("Past Vega", "One last box! So glad this is finally almost over. I should’ve asked some of my friends to help me move out.");
  yield* talk("Vega", "God, I hope she doesn’t start babbling again.");
  yield* talk("Past Vega", "Ah, there we go! Now, who—");
  yield* talk("Past Vega", "...");
  yield* talk("Vega", "Hey. ");
  yield* talk("Past Vega", "WHAAAAAAAAAAAAT ");
  yield* talk("Vega", "Uh, hi. So, um, I’m you. From the future. ");
  yield* talk("Past Vega", "Oh god please just kill me quickly");
  yield* talk("Vega", "What? ");
  yield* talk("Past Vega", "I mean, clearly, if you’re telling the truth, that means the apocalypse happens at some point and you’ve come back to kill me to spare me the trauma of living through an alien invasion or a nuclear winter or— ");
  yield* talk("Vega", "Okay, the active imagination is cute, but you’ve really gotta tone it down. Especially during your first few weeks at NATCH. ");
  yield* talk("Past Vega", "Wait, how do I even know you’re telling the truth about being me from the future? ");
  yield* talk("Vega", "Oh god, what did I say last time... ");
  yield* talk("Past Vega", "...last time? ");
  yield* talk("Vega", "Oh, right. My favorite barbecue sauce is Sweet Baby Ray’s Hickory and Brown Sugar. ");
  yield* talk("Past Vega", "Whoa, you ARE me from the future!!!");
  yield* talk("Vega", "Glad we got there in the end. Can I come in? We have a lot to talk about. ");
  yield* talk("Past Vega", "Yeah, sure. I mean, it’s pretty empty because I’m moving out, but you know that already. I mean, wow! I have so many questions. But you know that already too! This is so cool. Come, come! ");
  yield* talk("Vega", "Hoo boy. ");

  canEnterHouse = true;
}

function* speakToPV12(): Cinematic {
  yield* narrate("You explain the situation thus far to past Vega.");
  yield* talk("Vega", "...and that’s pretty much what’s happened so far. The last time I met you, you even agreed to help me write up a summary of everything you could find out about Doctor Scramble, which was pretty helpful. I have it with me here. ");
  yield* talk("Past Vega", "I made this?! No way. It’s so well formatted! ");
  yield* talk("Vega", "Don’t flatter yourself. Like, literally. ");
  yield* talk("Past Vega", "So what are the most important things to know about this guy? ");
  yield* talk("Vega", "Well... ");

  while (true) {

    const result = yield* prompt([
      "Mustache cream",
      "Bowler hats",
      "Canadian mafia",
    ]);

    if (result === 0) {
      yield* talk("Vega", "So he’s got this thick, sleek mustache, right? Apparently, he only uses a specific type of mustache cream from Uzbekistan to style it every morning. ");
      yield* talk("Past Vega", "Whoa... so if we can stop the import, we can stop the bad guy! ");
      yield* talk("Vega", "Not exactly. Unfortunately, he kidnapped the CEO of that company a while ago, so all the mustache cream is technically locally-made. Any tariff power we have is useless. ");
      yield* talk("Past Vega", "Blast! Anything else? ");
    }
    if (result === 1) {
      yield* talk("Vega", "He loves wearing bowler hats. He’s got, like, a whole wardrobe full of them in his lair, apparently. ");
      yield* talk("Past Vega", "So... we INVADE HIS LAIR and DESTROY HIS HATS!! ");
      yield* talk("Vega", "Won’t work. He has backup wardrobes in every state, just in case. It would take forever to torch them all. ");
      yield* talk("Past Vega", "Blast! Anything else? ");
    }
    if (result === 2) {
      yield* talk("Vega", "He apparently got to where he is because he’s a pretty high-ranking member of the Canadian mafia. I think he’s no longer a member of it in my time, but in your time, he’s still a bigwig. ");
      yield* talk("Past Vega", "Ooh... so if we can infiltrate the Canadian mafia, we can find him and stop him before he shoots you in the future! ");
      yield* talk("Vega", "That... actually might work. The Canadian mafia is a pretty secretive organization, though, and they’ll probably be hard to get a good read on. How’s your Canadian French?");
      yield* talk("Past Vega", "Horrible, but I’m willing to learn!");
      yield* talk("Vega", "Very good. How, I don’t know when or how I’ll be transported to the future again, but if you learn the language and get in close with them, who knows? Maybe this’ll work after all. ");
      yield* talk("Past Vega", "You got it! I’ll be on the Canadian mafia like barbecue sauce on mashed potatoes! ");
      yield* talk("Vega", "I... uh... yes. Did I really do that when I was your age? ");
      yield* talk("Vega", "Well, anyway, here we go again.");
      yield* talk("Past Vega", "What do you mean?");
      yield* talk("Vega", "Well, based on the pattern so far, I think I’m about to disappear. Good luck on your mission!");
      yield* setFutureHasChanged();

      break;
    }
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CHECKPOINT 2
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function* speakToCaptainSharp21(): Cinematic {
  yield* talk("Captain Sharp", "Hey, Vega!");
  yield* talk("Vega", "Hey, Captain. I assume you’re about to tell me that I’ve earned a week off? ");
  yield* talk("Captain Sharp", "I—er, yeah. How’d you know? Did Captain Eli tell you? It was supposed to be a secret! ");
  yield* talk("Vega", "Call it a hunch, I guess. Say, do you know if there have been any earthquake warnings lately? ");
  yield* talk("Captain Sharp", "What? Why would there be— ");
  yield* narrate("r u m b l e", ["shaky"]);
  yield* talk("Captain Sharp", "Okay, what the hell— ");
  yield* narrate("C R A S H", ["huge", "shaky"]);
  yield* talk("Doctor Scramble", "MUAHAHA! Prepare to meet your end, NATCH! I have finally discovered your secret hideout!!!");
  yield* talk("Vega", "Yeah, yeah. Spare us the theatrics, Scramble. ");
  yield* talk("Captain Sharp", "Wha— How did you— Why are— WHAT?! ");
  yield* talk("Doctor Scramble", "Okay, so, we’re just ignoring the fact that I have this weapon here, or...? ");
  yield* talk("Vega", "Drop the act, dude. It’s nonfatal at best and broken at worst. I should know. Tu n'es pas vraiment effrayant, tu sais? ");
  yield* talk("Doctor Scramble", "Hmm... curiouser and curiouser!! ");
  yield* talk("Captain Sharp", "Vega, as your captain, I order you to tell me what exactly is happening right now. ");
  yield* talk("Doctor Scramble", "Heehee! If you’re confused now, I can’t WAIT to see the look on your face in about... three seconds! ");
  yield* talk("Captain Sharp", "What? Vega, what is he talking abou—ARE YOU GLOWING?! ");
  yield* talk("Vega", "*shrug* ");
  // TODO: Vega fades

  yield* setMode("Past");
  yield* thrownInPastForThirdTime();
  hasntSeenEnterAlleyway = true;
}

export function* thrownInPastForThirdTime(): Cinematic {
  yield* playSong("time travel");
  yield* pause(4);
  yield* setLocation(Locations.Alleyway);
}

function* speakToPV21(): Cinematic {
  if (talkedToPastScramble === false) {
    yield* talk("Vega", "Hmm, I should probably go check out the Canadian mafia at the Royal Skillet bar first. Wouldn’t want to drag past me into this dirty business—she’s already so... fragile.");
  } else {
    yield* talk("Vega", "Well, here we go again.");
    yield* talk("Past Vega", "One last box! So glad this is finally almost over. I should’ve asked some of my friends to help me move out.");
    yield* talk("Vega", "Right on cue.");
    yield* talk("Past Vega", "Ah, there we go! Now, who—");
    yield* talk("Vega", "Hi. I’m you from the future.");
    yield* talk("Past Vega", "...WHAAAAAA—");
    yield* talk("Vega", "No, I’m not a clone made by NATCH. No, I’m not here to kill you because of an apocalypse. I’m not a shapeshifting alien, or a long-lost twin sister, or a lingering hallucination from those ‘bad mushrooms’ you had last week, and I can prove it because I know that our favorite barbecue sauce is Sweet Baby Ray’s Hickory & Brown Sugar. Now, may I please come in so we can discuss how to save the world from an evil Canadian scientist?");
    yield* talk("Past Vega", "Um......... Okay!!");

    canEnterHouse = true;
  }
}

function* speakToPV22(): Cinematic {
  yield* talk("Vega", "...so, to make a long story short, this isn’t my first time on this rodeo bull. The other versions of you that I mentioned earlier have helped me get here, and I’m finally close to figuring out a way to getting out of this loop, which will then allow me to take down Doctor Scramble... I assume. Any questions?");
  yield* talk("Past Vega", "This is... SO COOL!! So, what did you learn from the Scramble in my time? Anything I can help with?");

  while (true) {
    const result = yield* prompt([
      "Inferiority complex",
      "Likes martinis",
      "Chronon research",
    ]);

    if (result === 0) {
      yield* talk("Vega", "Honestly, for the first hour of our conversation, he was basically just ranting about how much the other scientists he worked with looked down on him. I’ve been a secret agent for a while now, and even I was finding it hard to keep my composure toward the end.");
      yield* talk("Past Vega", "Well, I’m willing to do a lot of things, but I don’t think I can get good enough at psychiatry in eight months to handle... that.");
      yield* talk("Vega", "Yeah, figures. I don’t think anyone’s getting to the center of that hot mess anytime soon.");
      yield* talk("Past Vega", "There’s gotta be something else we can do!");
    }
    if (result === 1) {
      yield* talk("Vega", "You know, the guy just loves his martinis. I’ve never seen anything like it.");
      yield* talk("Past Vega", "I’ve got it! I’ll become a bartender for the Royal Skillet and POISON HIS MARTINIS!");
      yield* talk("Vega", "As lovely as that sounds, that won’t get me out of this time loop, unfortunately. Don’t worry, though, you’ll be getting lots of poisoning experience in about five months in Russia.");
      yield* talk("Past Vega", "There’s gotta be something else we can do!");
    }
    if (result === 2) {
      yield* talk("Vega", "I’ll admit I really wasn’t paying too much attention for most of it, but toward the end, he started talking about how he was researching these things called ‘chronons’. Apparently, they’re time particles or something?");
      yield* talk("Past Vega", "Sounds fascinating! Want me to do some research into th—");
      yield* narrate("Bzzt!");
      yield* talk("Past Vega", "—did you go? Oh my god! There you are! Are you okay?");
      yield* talk("Vega", "What... just happened?");
      yield* talk("Past Vega", "I don’t know! You just disappeared and reappeared like five seconds later!");
      yield* talk("Vega", "Uh oh. That’s not good.");
      yield* talk("Past Vega", "It must be the CHRONONS!!! I’ll get to researching them as fast as I can!");
      yield* talk("Vega", "Sounds good. And if you could compile what you learn in some kind of journal, I’d appreciate it lots.");
      yield* talk("Past Vega", "Can do!");
      yield* talk("Vega", "Alright. Now I’m going to disappear. Please don’t scream. This is normal.");
      yield* talk("Past Vega", "Huh?");
      yield* setFutureHasChanged();
      break;
    }
  }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CHECKPOINT 3
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function* speakToCaptainSharp31(): Cinematic {
  yield* talk("Captain Sharp", "Hey, Vega!");
  yield* talk("Vega", "Hello, Captain. What is the news that you wanted to share with me for which I could have no possible way of knowing what it is yet?");
  yield* talk("Captain Sharp", "Uh, heh, that’s an interesting way of phrasing it, I guess. We were thinking of offering you the next week off because of your great track record! ");
  yield* talk("Vega", "Wow! What a greatly appreciated and completely unexpected reward that I’m sure will not be immediately marred by the arrival of a high-clearance supervillain! ");
  yield* talk("Captain Sharp", "What? What are you talking ab— ");
  yield* narrate("Bzzt!");
  yield* talk("Captain Sharp", "—okay? Vega, what the hell just happened?! You disappeared on the spot and reappeared like ten seconds later! ");
  yield* talk("Vega", "Ah, shoot. It happened again. This isn’t good. ");
  yield* narrate("r u m b l e", ["shaky"]);
  yield* talk("Vega", "...and I guess that isn’t either.");
  yield* narrate("C R A S H", ["huge", "shaky"]);
  yield* talk("Doctor Scramble", "MUAHAHA! Prepare to meet your—");
  yield* talk("Vega", "Hey, look. Scramble. Can we talk? ");
  yield* talk("Doctor Scramble", "—er, what? ");
  yield* talk("Vega", "Let’s cut to the chase—I know you’re hurting a lot. I’m no therapist, but even I can tell that deep down, you just want to be accepted by the scientific community. And I totally get that they haven’t been the friendliest to you in the past, but total world domination or whatever you’re going for just isn’t the way to go about it. You gotta confront those demons, y’know? ");
  yield* talk("Doctor Scramble", "... ");
  yield* talk("Vega", "So, c’mon. Put down the weapon and we can talk or even, I dunno, hug it out. I’m here for you, and in the end, I think everyone here would rather see you happy than bent on domination. Whaddaya say? ");
  yield* talk("Doctor Scramble", "...how charming... ");
  yield* talk("Vega", "Wait, really? ");
  yield* talk("Doctor Scramble", "...that you actually BELIEVED the lies I told you in the last iteration of your time loop! ");
  yield* talk("Vega", "WHAT. How do you know about that. ");
  yield* talk("Captain Sharp", "What the hell is he talking about, Vega? ");
  yield* talk("Doctor Scramble", "Oh, silly girl. You’re not the only one stuck in a time loop, you know. And I’ve had my suspicions for a while that you might be as well, but to be able to retain your memories across loops again and again? And to even use your own self to your advantage multiple times in different ways! The thought had never even crossed my mind. You truly are my greatest guinea pig. ");
  yield* talk("Vega", "You... knew about what was happening to me? And you just LET IT HAPPEN? THIS WHOLE TIME? ");
  yield* talk("Doctor Scramble", "Of course, I had to test my theories in a non-invasive way. That’s just science. To think that you actually fell for my sob story... Touching, touching. Ah, c’est la vie. ");
  yield* talk("Vega", "How COULD YOU? I CARED about your situation! You drag me into this living hell, then mess with my body and mind without a SHRED of remorse or even sympathy... I’m... I’M... ");
  yield* talk("Vega", "AUGHHHHHHH", ["slow"]);
  yield* talk("Captain Sharp", "Vega, no! ");
  yield* narrate("You tackle Doctor Scramble to the ground.");
  yield* talk("Vega", "Maybe you can beat me in mind games... ngh... but I can beat you... in a wrestling match. ");
  yield* talk("Doctor Scramble", "Gah! I don’t HAVE to beat you. All I have to do is wait until 9:47 am. ");
  yield* talk("Vega", "You mean... ");
  yield* talk("Doctor Scramble", "I do indeed. And if I’m not mistaken... rrk... you have five seconds remaining. ");
  yield* talk("Vega", "Then... Then I’m taking THIS with me! ");
  yield* narrate("You have obtained one TIME RAY.");
  yield* talk("Doctor Scramble", "What? No! ");
  yield* talk("Vega", "Buh-bye. ");
  // TODO: Vega fades

  yield* setMode("Past");
  yield* thrownInPastForFourthTime();
  hasntSeenEnterAlleyway = true;
}

export function* thrownInPastForFourthTime(): Cinematic {
  canEnterHouse = true;
  yield* playSong("time travel");
  yield* pause(4);
  yield* setLocation(Locations.House);
  yield* pause(1.5);
}

function* speakToPV31(): Cinematic {
  yield* talk("Vega", "Huh... this isn’t the alleyway.");
  yield* talk("Vega", "Wait, this is my house! How did I end up here?");
  yield* talk("Vega", "Oh god, my chronons must be destabilizing my space AND my time now. I need to get this raygun to myself FAST.");
  yield* talk("Past Vega", "One last box! So glad this is finally— WHAT THE HELL WHO ARE YOU");
  yield* talk("Vega", "Hi. I, um—");
  yield* narrate("Bzzt!");
  yield* talk("Past Vega", "huh—AAAAAAH! You appeared out of nowhere, then you disappeared, and now you’re back! I knew it. Magic is real.");
  yield* talk("Vega", "God, no. That’s—no. Okay. So. Uh, I’m you. From the future. And I have a time ray. Um, uh, barbecue sauce.");
  yield* talk("Past Vega", "...I take that back. Magic isn’t real. I’ve just gone completely and utterly insane.");
  yield* talk("Vega", "Look, you have to believe me. I’m future you, and I’ve been hit by some kind of time ray that’s gotten me stuck in a time loop between today and December 8, eight months from now.");
  yield* talk("Past Vega", "I’m... I’m calling 911.");
  yield* talk("Vega", "NO! I don’t know how much time I have. Here’s a notebook full of research that you did— that WE did— into the science of whatever the hell happened to me. And here’s the exact weapon that did it.");
  yield* talk("Past Vega", "Well, this IS my impeccable handwriting. And I’m always happy to get my hands on some new tech. But how do I know that I can trust you?");
  yield* talk("Vega", "You don’t. But trust me or not, soon I’m going to disappear again without a trace, and if I know you— which I do, because I AM you— your curiosity about the truth of what happened here today will win out.");
  yield* talk("Vega", "You’ll read the journal. You’ll learn all about chronons and the Canadian mafia and Doctor Scramble. And you’ll remember the one thing I’m asking you to do for me before December comes around again: make a copy of the time ray that reverses the effects of the original. You get me?");
  yield* talk("Past Vega", "I do.");
  yield* talk("Vega", "Good.");
  yield* talk("Vega", "See you later, Vega.");
  yield* talk("Past Vega", "Wait, before you go, can you—");

  yield* setFutureHasChanged();
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CHECKPOINT 4
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function* speakToCaptainSharp41(): Cinematic {
  yield* talk("Captain Sharp", "Hey, Vega!");
  yield* talk("Vega", "Captain.");
  yield* talk("Captain Sharp", "Uhh, hey. Why do you have a gun? You know you don’t have clearance for firearms in the headquarters yet.");
  yield* talk("Vega", "Yeah. I know.");
  yield* talk("Captain Sharp", "Well, what are you waiting for? Put it away!");
  yield* talk("Vega", "What am I waiting for?");
  yield* narrate("r u m b l e", ["shaky"]);
  yield* talk("Vega", "That.");
  yield* narrate("C R A S H", ["huge", "shaky"]);
  yield* talk("Doctor Scramble", "Hello again, Vega. Good to see you alive and... non-glitching.");
  yield* talk("Vega", "Cut it, Scramble. You know what this is, I presume.");
  yield* talk("Doctor Scramble", "Why, that looks an awful lot like the time ray that you stole from me last time we were in this building together.");
  yield* talk("Captain Sharp", "Vega—");
  yield* talk("Vega", "Sorry, Captain, but there’s no time. Scramble, you’re close. It’s a replica, but with one key difference.");
  yield* talk("Doctor Scramble", "Oh, don’t tell me. You’ve reversed the polarity or some other kind of sci-fi mumbo-jumbo and now you expect it to remove you from the time loop.");
  yield* talk("Vega", "No, I KNOW it will remove me from the time loop.");
  yield* talk("Doctor Scramble", "Another lie. If you were that sure, you would’ve used it on yourself already. No, I’m quite sure that the reason you’re still here at all is because you’re unsure what I have and haven’t lied to you about. And you’d certainly be right to think there are still some things which you don’t understand in the slightest.");
  yield* talk("Vega", "What do you mean.");
  yield* talk("Doctor Scramble", "If you were to use that ray on yourself, I’m afraid that, because your chronons are so thoroughly misaligned, all that would happen is that you would simply... cease to be.");
  yield* talk("Doctor Scramble", "Perhaps you want revenge, in which case you would use it on me—however, as the person who sent you into the time loop in the first place, shooting me would cause this whole world to implode, and you with it.");
  yield* talk("Captain Sharp", "VEGA—");
  yield* talk("Vega", "NOT NOW, SHARP! Okay. So I can’t do either. What if I do nothing?");
  yield* talk("Doctor Scramble", "That would be so boring, wouldn’t it? Let’s make things a bit more interesting.");
  yield* narrate("Doctor Scramble pulls out a BUTTON.");
  yield* playSong("time ray SUPERCHARGING");
  yield* talk("Doctor Scramble", "If you do nothing for 15 seconds, I press this reset button. Everything— you, your progress, your memory— it all resets.");
  yield* talk("Vega", "You’re evil.");
  yield* talk("Doctor Scramble", "MUAHAHA! I suppose so. But I’ll even throw you a bone: I’ll tell you, for free, that I’ve told at least one lie. So, Vega, what'll it be?");

  const result = yield* prompt([
    "Aim at Scramble",
    "Aim at yourself",
    // TODO: if you do nothing for 15 seconds, the game literally resets maybe
  ]);

  if (result === 0) {
    yield* talk("Vega", "You know, Scramble, I think I’ve finally figured you out.");
    yield* talk("Doctor Scramble", "Chff. Doubt it.");
    yield* talk("Vega", "I think you’re scared, Scramble. I think that all this song-and-dance you do is just an overly flamboyant display of power that, deep down, you fear that you lack on the inside.");
    yield* talk("Vega", "Well, guess what? I’m not going to let you have any power over me anymore. I’m through with being manipulated, and it’s time that you got a taste of your own medicine.");
    yield* narrate("You point the RAY at DOCTOR SCRAMBLE.");
    yield* talk("Vega", "I’m calling your bluff. Any last thoughts?");
    yield* talk("Doctor Scramble", "Perhaps... I miscalculated.");
    yield* talk("Vega", "Yeah.");
    yield* narrate("Your FINGER presses the TRIGGER.");
    yield* talk("Captain Sharp", "NO!");
    yield* narrate("Captain Sharp SHOVES you.");
    yield* narrate("The ray of light hits SCRAMBLE’S BUTTON.");
    yield* narrate("A PULSE OF LIGHT emanates from the BUTTON. Everyone is KNOCKED OUT.");
  }
  if (result === 1) {
    yield* talk("Vega", "You know, Scramble, I think I’ve finally figured you out.");
    yield* talk("Doctor Scramble", "Chff. Doubt it.");
    yield* talk("Vega", "I think there’s one thing that you like more than anything else in the world, and that’s the illusion of control. That’s why you manipulate people. That’s why you put them into situations where you think you’re the only one who fully knows what’s going on.");
    yield* talk("Vega", "But guess what? There’s one thing you didn’t even think to account for. And that’s the thought that someone else out there could be just as smart as you. It’s taken me a while to realize this, but I believe in every version of myself I’ve ever met. And I would trust each and every one of them long before I would ever trust you.");
    yield* narrate("You point the RAY at YOURSELF.");
    yield* talk("Doctor Scramble", "Now, listen here—");
    yield* talk("Vega", "I’m through being your guinea pig, Scramble. There isn’t much that I can say with certainty, but one thing I know for sure is that I got this one right.");
    yield* narrate("You pull the TRIGGER.");
  }

  yield* setCheckpoint(Checkpoints["Game Over"]);
  yield* setLocation(Locations.DarkBG);

}

/////////////////////////////////////////////////////////////////////
////////////////  D R E A M   S E Q E U E N C E  ////////////////////
/////////////////////////////////////////////////////////////////////

export function* startDreamSequence(): Cinematic {
  const actions = yield "next";
  actions.setFutureHasChanged(false);

  if (Checkpoint === Checkpoints["Time Travel"]) {
    yield* talk("Vega", "I believe in you!!!");
    // TODO: Vega fades
    yield* talk("Past Vega", "Dammit! I was going to ask her to help me move in.");

    yield* setMode("DreamSequence");
    yield* playSong("time ray");
    yield* dreamTalk(".....");
    yield* dreamTalk("...The void is silent...");
    yield* dreamTalk(".....");
    yield* dreamTalk("...........");
    yield* dreamTalk("........................");
    yield* setMode("Future");
    yield* setCheckpoint(Checkpoints["Time Ray"]);
    yield* setLocation(Locations.DarkBG);

    canEnterHouse = false;
    hasntSeenEnterAlleyway = true;
  }
  else if (Checkpoint === Checkpoints["Canadian French"]) {
    yield* talk("Past Vega", "AAAAAAAAAAAAA");
    yield* talk("Vega", "Look, what did I JUST—");
    // TODO: vega fades

    yield* setMode("DreamSequence");
    yield* playSong("time ray");
    yield* dreamTalk("...The feeling of every fabric of your body dispersing into the void is now familiar to you...");
    yield* dreamTalk("...Your can feel the knowledge of the physics of time entering your brain...");
    yield* dreamTalk("...T i m e   t o   s o l i d i f y...");
    yield* setMode("Future");
    yield* setCheckpoint(Checkpoints["Time Travel"]);
    yield* setLocation(Locations.DarkBG);
    canEnterHouse = true;
    hasntSeenEnterAlleyway = true;
  }
  else if (Checkpoint === Checkpoints["Doctor Scramble"]) {
    yield* talk("Past Vega", "What? You can’t just leave like that! I still have so many questions!");
    yield* talk("Vega", "I can’t hear youuuu I’m dissociatingggg");
    // TODO: vega fades

    yield* setMode("DreamSequence");
    yield* playSong("time ray");
    yield* dreamTalk("...You're back in the void again...");
    yield* dreamTalk("...Your mind fills with knowledge of Canadian French...");
    yield* dreamTalk("...Tu recommences à te réveiller...");
    yield* dreamTalk("...T i m e   t o   s o l i d i f y...");
    yield* setMode("Future");
    yield* setCheckpoint(Checkpoints["Canadian French"]);
    yield* setLocation(Locations.DarkBG);
    canEnterHouse = false;
    hasntSeenEnterAlleyway = true;
  }
  else if (Checkpoint === Checkpoints["Game Start"]) {
    yield* talk("Vega", "Oh god, it’s happening again. The same feeling as when I got hit by that ray.");
    yield* talk("Other Vega", "What the hell?! You’re disappearing!");
    // TODO (maybe): vega avatar fades 

    yield* setMode("DreamSequence");
    yield* playSong("time ray");
    yield* dreamTalk("...You feel yourself being pushed through the void...");
    yield* dreamTalk("...It feels like every atom of your body is encased in its own marshmallow...");
    yield* dreamTalk("...Knowledge of the identity of Doctor Scramble gradually flows into your mind...");
    yield* dreamTalk("...T i m e   t o   s o l i d i f y...");
    yield* setMode("Future");
    yield* setCheckpoint(Checkpoints["Doctor Scramble"]);
    yield* setLocation(Locations.DarkBG);
    canEnterHouse = false;
    hasntSeenEnterAlleyway = true;
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

export function* pause(seconds: number): Cinematic {
  let start = Date.now();

  while (Date.now() - start < seconds * 1000) {
    yield "next";
  }
}