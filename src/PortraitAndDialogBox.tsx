import React from 'react';
import { ActionEvent, DialogEvent, PromptEvent, PromptSelectionKeys, SpeakEvent } from './CinematicTypes';
import { Dialog } from './Dialog'
import { Action } from './PlayerActions';
import Portrait from './images/portrait2.png';
import { PlayerActions } from './PlayerActions';
import { Location } from './CinematicTypes';
import { CinematicState } from './App';

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
              {option.text}
            </div>
          </div>
        )
      }
    </div>
  )
};


export const PortraitAndDialogBox = ({ events, dialogLineFinished, promptFinished, location, cinematicState }: {
  events: DialogEvent[];
  dialogLineFinished: boolean;
  promptFinished: boolean;
  location: Location;
  cinematicState: CinematicState
}) => {
  const speakingEvents: SpeakEvent[] = [];
  const promptEvents: PromptEvent[] = [];

  for (const event of events) {
    if (event.type === "dialog") {
      speakingEvents.push(event);
    } else if (event.type === "prompt") {
      promptEvents.push(event);
    }
  }

  let lastTimeString: string | null = null;

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
        padding: 20,
        width: 220,
        backgroundColor: "white",
        border: '1px solid black',
      }}>
        <div style={{
          overflow: 'auto',
        }}>
          {
            events.map(event => {
              let result: React.ReactNode;

              if (event.type === "dialog") {
                let showTimestamp = false;
                if (lastTimeString === null) {
                  showTimestamp = true;
                } else {
                  const prevTime = (lastTimeString.split(" ")[0]).split(":").map(x => Number(x));
                  const nowTime = (event.timeString.split(" ")[0]).split(":").map(x => Number(x));

                  const prevTimeMinutes = prevTime[0] * 60 + prevTime[1];
                  const nowTimeMinutes = nowTime[0] * 60 + nowTime[1];

                  if (nowTimeMinutes - prevTimeMinutes > 10) {
                    showTimestamp = true;
                  }
                }

                result = <Dialog event={event} showTimestamp={showTimestamp} />

                lastTimeString = event.timeString;
              } else if (event.type === "prompt") {
                result = <Prompt prompt={event} />;
              }
              else if (event.type === "action") {
                result = <Action event={event} />
              } else {
                alert("unhandled event type");
              }

              return result;
            })
          }

          {
            dialogLineFinished &&
            <div style={{ color: 'lightgray', paddingTop: '20px' }}>
              Space to continue
            </div>
          }

          {
            promptFinished &&
            <div style={{ color: 'lightgray', paddingTop: '20px' }}>
              Choose an action to continue
            </div>
          }
        </div>

        <PlayerActions cinematicState={cinematicState} location={location} />
      </div>
    </div >);
}