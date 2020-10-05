import React, { useEffect } from 'react';
import useInterval from './ use_interval';
import { Clock } from './Clock';
import { PortraitAndActions } from './PortraitAndActions';
import { PortraitAndDialogBox } from './PortraitAndDialogBox';
import { Keyboard } from './Keyboard';
import { Cinematic, GameMode, Location } from './CinematicTypes';
import { Locations, Person, startGame, thrownInPastForFirstTime } from './Data';
import { Overlay } from './Overlay';
import { FutureDate, TextModifier } from './Cinematics';
import { Background } from './Background';


export const APP_WIDTH = 1100;
export const APP_HEIGHT = 600;
export type DisplayedEventState =
  | "animating"
  | "waiting-for-key"
  | "done"
  ;

export type DisplayedDialog = { speaker: Person; text: string; id: string; type: "dialog"; time: string; isContainingSequenceFinished: boolean; state: DisplayedEventState; modifier?: TextModifier[] }
export type DisplayedDreamDialog = { text: string; id: string; type: "dream-dialog"; time: string; isContainingSequenceFinished: boolean; state: DisplayedEventState; modifier?: TextModifier[] }
export type DisplayedBackgroundDialog = { speaker: Person; text: string; id: string; type: "background-dialog"; time: string; isContainingSequenceFinished: boolean; state: DisplayedEventState; modifier?: TextModifier[] };
export type DisplayedPrompt = { options: string[]; id: string; type: "prompt"; time: string; isContainingSequenceFinished: boolean; state: DisplayedEventState; };
export type DisplayedDescribe = { time: string; text: string; type: "describe"; id: string; isContainingSequenceFinished: boolean; state: DisplayedEventState; };
export type DisplayedAction = {
  type: "action";
  options: { text: string; onClick?: () => void; }[];
  id: string;
  hasTakenAction: boolean;
  isContainingSequenceFinished: boolean;
  state: DisplayedEventState;
};

export type DisplayedEvent =
  | DisplayedDialog
  | DisplayedPrompt
  | DisplayedBackgroundDialog
  | DisplayedDescribe
  | DisplayedAction
  | DisplayedDreamDialog
  ;

export type InventoryItem = "key" | "book";
export type Inventory = { [K in InventoryItem]: boolean };

export type CinematicState = {
  cinematic: Cinematic;
  status: "running" | "paused";
}

const App = () => {
  const [events, setEvents] = React.useState<DisplayedEvent[]>([]);
  const [inventory, setInventory] = React.useState<Inventory>({ key: false, book: false })
  const [activeLocation, setActiveLocation] = React.useState<Location>(Locations.Bar);
  const [cinematics, setCinematics] = React.useState<CinematicState[]>([]);
  const [triggeredLiveEvents, setTriggeredLiveEvents] = React.useState<{ [key: string]: boolean }>({});
  const [mode, setMode] = React.useState<GameMode>("Future");
  const [overlayOpacity, setOverlayOpacity] = React.useState(0);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const [currentDate, setCurrentDate] = React.useState(FutureDate);
  const [timeString, setTimeString] = React.useState("");
  const [dateString, setDateString] = React.useState("");
  const [interruptable, setInterruptable] = React.useState(true);
  const [futureHasChanged, setFutureHasChanged] = React.useState<boolean>(false);

  useInterval(() => {
    setCurrentDate(prevDate => {
      prevDate.setMilliseconds(currentDate.getMilliseconds() + 10 * 50);
      return prevDate;
    });
    setTimeString(`${currentDate.toLocaleTimeString().split(" ")[0].slice(0, -3)} ${currentDate.toLocaleTimeString().split(" ")[1]}`);
    setDateString(`${currentDate.toLocaleDateString("en-US", options).split(",")[1]}`);
  }, 50);

  useEffect(() => {
    let cinematicToRun: Cinematic;

    const urlParams = new URLSearchParams(window.location.search);
    const whichCinematic = Number(urlParams.get("cinematic"));

    if (whichCinematic === 0) {
      cinematicToRun = startGame();
    } else if (whichCinematic === 1) {
      cinematicToRun = thrownInPastForFirstTime()
    } else {
      cinematicToRun = startGame();
    }

    setCinematics([
      {
        cinematic: cinematicToRun,
        status: "running",
      },
    ])
  }, []);

  // is this the game loop. k thx np np
  // GAME LOOP:::::
  useInterval(() => {
    Keyboard.update();

    const newCinematics = cinematics.map(({ cinematic, status }) => {
      if (status === "paused") {
        return { cinematic, status };
      }

      const result = cinematic.next({
        setEvents: setEvents,
        events: events,
        activeLocation,
        setActiveLocation,
        dateString,
        timeString,
        inventory,
        setInventory,
        mode,
        setMode,
        overlayOpacity,
        setOverlayOpacity,
        setCurrentDate,
        interruptable,
        setInterruptable,
        setFutureHasChanged,
        futureHasChanged
      });

      if (result.done) {
        setEvents(events => {
          const newEvents = [...events];

          newEvents[newEvents.length - 1].isContainingSequenceFinished = true;
          return newEvents;
        })
        return null;
      }

      return { cinematic, status: "running" };
    }).filter((x): x is CinematicState => x !== null);

    setCinematics(_ => newCinematics);

    for (const liveEvent of activeLocation.liveEvents) {
      const eventKey = liveEvent.time + "|" + activeLocation.name;

      if (!triggeredLiveEvents[eventKey] && liveEvent.time.toLowerCase() === timeString.toLowerCase()) {
        setCinematics(prev => [
          ...prev,
          { cinematic: liveEvent.event, status: "running" },
        ]);
        setTriggeredLiveEvents({
          ...triggeredLiveEvents,
          [eventKey]: true,
        });
      }
    }
  }, 20);

  return (
    <div style={{
      padding: '8px',
    }}>
      <Overlay
        opacity={overlayOpacity}
        displayedEvents={events}
      />

      <div style={{
        display: 'flex',
        justifyContent: "space-between",
        backgroundImage: 'url(images/ld47 bar.png)',
        width: APP_WIDTH,
        height: APP_HEIGHT,
        margin: 40,
        backgroundSize: '100%',
      }}>
        <Background location={activeLocation} />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', }}>
          <Clock
            dateString={dateString}
            timeString={timeString}
            mode={mode}
          />

          <PortraitAndActions
            setCinematics={setCinematics}
            location={activeLocation}
          />
        </div>

        <PortraitAndDialogBox
          inventory={inventory}
          events={events}
          location={activeLocation}
          setCinematics={setCinematics}
          allowInterruptions={interruptable}
          markActionAsTaken={(id) => {
            setEvents(prevEvents => {
              const newEvents = [...prevEvents];
              const index = newEvents.findIndex(ev => ev.id === id);
              const prevEvent = newEvents[index];

              if (prevEvent.type === "action") {
                const newEvent: DisplayedAction = {
                  ...prevEvent,
                  hasTakenAction: true,
                };

                newEvents[index] = newEvent;
              } else {
                //alert("Error: tried to update action but it wasnt an action");
              }

              return newEvents;
            })
          }}
          futureHasChanged={futureHasChanged}
        />
      </div>
    </div>
  );
}

// hehehehehehehe
// HEHE browser

// You may not like it, but this is what peak productivity looks like
// so i dont really know what to do lol
// wait
// ok im waiting

//h 1</div>^^^^^^^^^
// :)))))))))))))))))))))
// good work
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
export default App;
