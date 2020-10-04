import React, { useCallback, useEffect } from 'react';
import useInterval from './ use_interval';
import Background from './images/img_placeholder.png';
import { Clock, useClock } from './Clock';
import { PortraitAndActions } from './PortraitAndActions';
import { PortraitAndDialogBox } from './PortraitAndDialogBox';
import { displayText, runEvents } from './Cinematics';
import { Keyboard } from './Keyboard';
import { Cinematic, Location, PromptOption } from './CinematicTypes';
import { Locations } from './Data';

export type CinematicState = {
  runCinematic: (cinematic: Cinematic) => void;
  cinematics: Cinematic[];
}

export type DisplayedDialog = { speaker: string; text: string; id: string; type: "dialog"; time: string; isFinished: boolean; }
export type DisplayedBackgroundDialog = { speaker: string; text: string; id: string; type: "background-dialog"; time: string; isFinished: boolean; };
export type DisplayedPrompt = { options: PromptOption[]; id: string; type: "prompt"; time: string; isFinished: boolean; };
export type DisplayedDescribe = { time: string; text: string; type: "describe"; id: string; isFinished: boolean; };
export type DisplayedAction = {
  type: "action";
  options: { text: string; onClick?: () => void; }[]; id: string;
  hasTakenAction: boolean;
  isFinished: boolean;
};

export type InventoryItem = "key" | "book";
export type Inventory = { [K in InventoryItem]: boolean }

export type DisplayedEvent =
  | DisplayedDialog
  | DisplayedPrompt
  | DisplayedBackgroundDialog
  | DisplayedDescribe
  | DisplayedAction
  ;

const App = () => {
  const [events, setEvents] = React.useState<DisplayedEvent[]>([]);

  const [inventory, setInventory] = React.useState<Inventory>({ key: false, book: false })

  const [dialogLineFinished, setDialogLineFinished] = React.useState(false);
  const [showPromptFinishedMessage, setShowPromptFinishedMessage] = React.useState(false);
  const [activeLocation, setActiveLocation] = React.useState<Location>(Locations.Bar);
  const { dateString, timeString } = useClock();

  const [cinematicState, setCinematicState] = React.useState<CinematicState>({
    cinematics: [],
    runCinematic: null as any, // circular dependency makes this tricky
  });

  const runCinematic = useCallback((cinematic: Cinematic) => {
    setCinematicState({
      cinematics: [...cinematicState.cinematics, cinematic],
      runCinematic,
    });
  }, [cinematicState.cinematics.length]);

  const [triggeredLiveEvents, setTriggeredLiveEvents] = React.useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setCinematicState({
      cinematics: [],
      runCinematic: runCinematic,
    });

    runCinematic(displayText());
  }, []);

  // is this the game loop. k thx np np
  // GAME LOOP:::::
  useInterval(() => {
    Keyboard.update();

    const newCinematics = cinematicState.cinematics.map(cinematic => {
      const result = cinematic.next({
        setEvents: setEvents,
        events: events,
        showDialogLineFinishedMessage: dialogLineFinished,
        setShowDialogLineFinishedMessage: setDialogLineFinished,
        showPromptFinishedMessage,
        setShowPromptFinishedMessage,
        activeLocation,
        setActiveLocation,
        dateString,
        timeString,
        inventory,
        setInventory,
      });

      if (result.done) {
        setEvents(events => {
          const newEvents = [...events];

          newEvents[newEvents.length - 1].isFinished = true;
          return newEvents;
        })
        return null;
      }

      return cinematic;
    }).filter((x): x is Cinematic => x !== null);


    setCinematicState({
      cinematics: newCinematics,
      runCinematic,
    });

    for (const liveEvent of activeLocation.liveEvents) {
      const eventKey = liveEvent.time + "|" + activeLocation.name;

      if (!triggeredLiveEvents[eventKey] && liveEvent.time.toLowerCase() === timeString.toLowerCase()) {
        runCinematic(runEvents([liveEvent.event]));
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
      <div style={{
        display: 'flex',
        justifyContent: "space-between",
        width: 900,
        height: 600,
        margin: 40,
        backgroundImage: `url("${Background}")`,
        backgroundSize: '100%',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', }}>
          <Clock dateString={dateString} timeString={timeString} />
          <PortraitAndActions cinematicState={cinematicState} location={activeLocation} />
        </div>

        <PortraitAndDialogBox
          inventory={inventory}
          events={events}
          dialogLineFinished={dialogLineFinished}
          location={activeLocation}
          promptFinished={showPromptFinishedMessage}
          cinematicState={cinematicState}
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
                alert("Error: tried to update action but it wasnt an action");
              }

              return newEvents;
            })
          }}
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
