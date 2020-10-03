import React from 'react';
import { ActionEvent, DialogEvent, PromptEvent, PromptSelectionKeys, SpeakEvent } from './CinematicTypes';
import { Dialog } from './Dialog'
import Portrait from './images/portrait2.png';

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

const Action: React.FC<{ action: ActionEvent }> = ({ action }) => {
  return (
    <div>
      {action.options.map((option) => <div>{option.text}</div>)

      }
    </div>
  )
};

export const PortraitAndDialogBox = ({ events, dialogLineFinished, promptFinished }: {
  events: DialogEvent[];
  dialogLineFinished: boolean;
  promptFinished: boolean;
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
        border: '1px solid black'
      }}>
        <div>
          {
            events.map(event => {
              if (event.type === "dialog") {
                return <Dialog event={event} />
              } else if (event.type === "prompt") {
                return <Prompt prompt={event} />;
              }

              alert("unhandled event type")
              return null;
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
        <div style={{ margin: " 0 auto" }}>inventory | map | talk</div>
      </div>
    </div >);
}