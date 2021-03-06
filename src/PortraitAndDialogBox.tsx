import React from 'react';
import { PromptEvent, PromptSelectionKeys, DialogEvent, Cinematic, GameMode } from './CinematicTypes';
import { Actions, Describe, Dialog, DialogComponent, maxDialogsToDisplay, Prompt } from './Dialog';
import { PlayerActions } from './PlayerActions';
import { Location } from './CinematicTypes';
import { CinematicState, DisplayedEvent, Inventory } from './App';
import { Portrait } from './Portrait';
import { Person } from './Data';
import { reduceEachLeadingCommentRange } from 'typescript';


export const PortraitAndDialogBox = ({ markActionAsTaken, events, location, setCinematics, inventory, allowInterruptions, futureHasChanged, mode }: {
  events: DisplayedEvent[];
  location: Location;
  setCinematics: React.Dispatch<React.SetStateAction<CinematicState[]>>;
  allowInterruptions: boolean;
  markActionAsTaken: (id: string) => void;
  inventory: Inventory;
  futureHasChanged: boolean;
  mode: GameMode;
}) => {
  const speakingEvents: DialogEvent[] = [];
  const promptEvents: PromptEvent[] = [];
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  const [lastSpeaker, setLastSpeaker] = React.useState<Person | null>(null)
  const [isSpeaking, setIsSpeaking] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = panelRef.current?.scrollHeight;
    }

    const lastEvent = events[events.length - 1];
    setIsSpeaking(false);

    if (lastEvent && 'speaker' in lastEvent) {
      if (lastEvent.speaker) {
        if (lastEvent.speaker === "Narrator") {
          setLastSpeaker("You find yourself...") // hack to display no portrait box
        } else if (lastEvent.speaker === "Vega") {
          setLastSpeaker(lastSpeaker) // hack to display no portrait box
        } else {
          setLastSpeaker(lastEvent.speaker);
          if (lastEvent.state === "animating") {
            setIsSpeaking(true);
          }
        }
      }
    } else {
      setLastSpeaker('You find yourself...') // hack to display no portrait box
    }
  }, [events.length, events]);

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

  let mostRecentDreamDialogIndex = events.map(event => event.type === "dream-dialog").lastIndexOf(true);
  let prevEvent: DisplayedEvent | null = null;
  let prevSpeaker: Person | null = null;

  let index = 0;

  return (
    <div style={{ display: 'flex', flex: '0 0 400px' }}>
      {(lastSpeaker) ?
        <Portrait
          speaking={isSpeaking}
          person={lastSpeaker ? lastSpeaker : "You find yourself..."}
        /> :
        <span style={{ width: 130 }} />}

      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 18px 20px 20px",
        transform: 'translateX(0px)',
        width: 300,
        backgroundColor: "white",
        border: '1px solid black',
      }}>
        <div
          ref={panelRef}
          style={{
            overflow: 'auto',
            paddingBottom: "60px",
          }}
        >
          {
            events.slice(-maxDialogsToDisplay).map((event, i) => {
              let showTimestamp = false;
              let speaker = 'speaker' in event ? event.speaker : "Narrator";
              let result: React.ReactNode;

              if (event.type === "dream-dialog") {
                if (prevEvent?.type !== "dream-dialog") {
                  result = (
                    <div>
                      <hr style={{ border: '1px solid #ececec' }} />
                    </div>
                  );
                }
              } else {
                if (event.type === "dialog" || event.type === "background-dialog") {
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

                  lastTimeString = event.time;
                }

                // debugger; 
                // const happenedInPast = (index < mostRecentDreamDialogIndex);

                // NOTE: Index is backwards. The last element in the list (i = events.length - 1)
                // is passed in as index = 0. This is for div text color calculation only.
                result = <DialogComponent
                  event={event}
                  markActionAsTaken={markActionAsTaken}
                  index={Math.min(events.length, maxDialogsToDisplay) - i}
                  showTimestamp={showTimestamp}
                  happenedInPast={false}
                  showSpeaker={speaker !== prevSpeaker}
                  mode={mode}
                />

                index++;
              }

              prevEvent = event;
              prevSpeaker = speaker;

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
          allowInterruptions={allowInterruptions}
          inventory={inventory}
          setCinematics={setCinematics}
          location={location}
          futureHasChanged={futureHasChanged}
          markActionAsTaken={markActionAsTaken}
        />
      </div>
    </div >);
}