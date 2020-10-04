import React from 'react';
import { PromptEvent, PromptSelectionKeys, DialogEvent, Cinematic } from './CinematicTypes';
import { Dialog } from './Dialog'
import { Actions, Describe } from './PlayerActions';
import Portrait from './images/portrait2.png';
import { PlayerActions } from './PlayerActions';
import { Location } from './CinematicTypes';
import { CinematicState, DisplayedEvent, Inventory } from './App';

const Prompt: React.FC<{ prompt: PromptEvent }> = ({ prompt }) => {
  return (
    <div>
      {
        prompt.options.map((option, i) =>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '0 0 20px' }}>
              <strong>{PromptSelectionKeys[i]}</strong>:
            </div>

            <div style={{ flex: '1 0 0' }}>
              {option}
            </div>
          </div>
        )
      }
    </div>
  )
};

export const PortraitAndDialogBox = ({ markActionAsTaken, events, location, setCinematics, inventory }: {
  events: DisplayedEvent[];
  location: Location;
  setCinematics: React.Dispatch<React.SetStateAction<CinematicState[]>>;
  markActionAsTaken: (id: string) => void;
  inventory: Inventory;
}) => {
  const speakingEvents: DialogEvent[] = [];
  const promptEvents: PromptEvent[] = [];
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current?.scrollHeight;
    }
  }, [events.length]);

  for (const event of events) {
    if (event.type === "dialog") {
      speakingEvents.push(event);
    } else if (event.type === "prompt") {
      promptEvents.push(event);
    }
  }

  let lastTimeString: string | null = null;

  let isDialogWaitingForKey: boolean | null = null;
  let isPromptWaitingForKey: boolean | null = null;

  for (const event of events.slice().reverse()) {
    if (event.type === "background-dialog") {
      continue;
    }

    if (event.type === "dialog") {
      isDialogWaitingForKey = event.state === "waiting-for-key";
    }

    if (event.type === "prompt") {
      isPromptWaitingForKey = event.state === "waiting-for-key";
    }

    break;
  }

  return (
    <div style={{ display: 'flex', flex: '0 0 400px' }}>
      <div
        style={{
          border: '1px solid black',
          height: 180,
          width: 130,
          margin: "0px 20px 0px 0px",
          backgroundImage: `url("${Portrait}")`,
          backgroundSize: '100%',
        }} />

      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 15px 20px 20px",
        width: 220,
        backgroundColor: "white",
        border: '1px solid black',
      }}>
        <div
          ref={panelRef}
          style={{
            overflow: 'auto',
            paddingBottom: "100px",
          }}
        >
          {
            events.map(event => {
              let result: React.ReactNode;

              if (event.type === "dialog" || event.type === "background-dialog") {
                let showTimestamp = false;

                if (lastTimeString === null) {
                  showTimestamp = true;
                } else {
                  const prevTime = (lastTimeString.split(" ")[0]).split(":").map(x => Number(x));
                  const nowTime = (event.time.split(" ")[0]).split(":").map(x => Number(x));

                  const prevTimeMinutes = prevTime[0] * 60 + prevTime[1];
                  const nowTimeMinutes = nowTime[0] * 60 + nowTime[1];

                  if (nowTimeMinutes - prevTimeMinutes > 10) {
                    showTimestamp = true;
                  }
                }

                result = <Dialog event={event} showTimestamp={showTimestamp} />
                lastTimeString = event.time;
              } else if (event.type === "prompt") {
                result = <Prompt prompt={event} />;
              } else if (event.type === "action") {
                result = <Actions
                  event={event}
                  onClick={(id: string) => { markActionAsTaken(id) }}
                />
              } else if (event.type === "describe") {
                result = <Describe event={event} />
              } else {
                alert("unhandled event type");
              }

              return result;
            })
          }

          {
            isDialogWaitingForKey &&
            <div style={{ color: 'lightgray', paddingTop: '20px' }}>
              Space to continue
            </div>
          }

          {
            isPromptWaitingForKey &&
            <div style={{ color: 'lightgray', paddingTop: '20px' }}>
              Choose an action to continue
            </div>
          }
        </div>

        <PlayerActions
          events={events}
          inventory={inventory}
          setCinematics={setCinematics}
          location={location}
        />
      </div>
    </div >);
}