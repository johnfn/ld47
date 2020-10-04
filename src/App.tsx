import React, { useEffect } from 'react';
import useInterval from './ use_interval';
import Background from './images/img_placeholder.png';
import { Clock, useClock } from './Clock';
import { PortraitAndActions } from './PortraitAndActions';
import { PortraitAndDialogBox } from './PortraitAndDialogBox';
import { displayText, runEvents } from './Cinematics';
import { Keyboard } from './Keyboard';
import { Cinematic, Location, PromptOption } from './CinematicTypes';
import { Locations } from './Data';

export type DisplayedDialog = { speaker: string; text: string; id: string; type: "dialog"; time: string; isContainingSequenceFinished: boolean; isThisFinished: boolean; }
export type DisplayedBackgroundDialog = { speaker: string; text: string; id: string; type: "background-dialog"; time: string; isContainingSequenceFinished: boolean; isThisFinished: boolean; };
export type DisplayedPrompt = { options: PromptOption[]; id: string; type: "prompt"; time: string; isContainingSequenceFinished: boolean; isThisFinished: boolean; };
export type DisplayedDescribe = { time: string; text: string; type: "describe"; id: string; isContainingSequenceFinished: boolean; isThisFinished: boolean; };
export type DisplayedAction = {
  type: "action";
  options: { text: string; onClick?: () => void; }[]; id: string;
  hasTakenAction: boolean;
  isContainingSequenceFinished: boolean;
  isThisFinished: boolean;
};

export type InventoryItem = "key" | "book";
export type Inventory = { [K in InventoryItem]: boolean };

export type CinematicState = {
  cinematic: Cinematic;
  status: "running" | "paused";
}

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
  const [activeLocation, setActiveLocation] = React.useState<Location>(Locations.Bar);
  const { dateString, timeString } = useClock();
  const [cinematics, setCinematics] = React.useState<CinematicState[]>([]);
  const [triggeredLiveEvents, setTriggeredLiveEvents] = React.useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setCinematics([
      {
        cinematic: displayText(),
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
          { cinematic: runEvents([liveEvent.event]), status: "running" },
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
          <PortraitAndActions setCinematics={setCinematics} location={activeLocation} />
        </div>

        <PortraitAndDialogBox
          inventory={inventory}
          events={events}
          location={activeLocation}
          setCinematics={setCinematics}
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
