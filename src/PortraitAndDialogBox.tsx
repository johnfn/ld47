import React from 'react';
import { DialogEvent, PromptEvent, PromptSelectionKeys, SpeakEvent } from './Cinematics';
import { Dialog } from './Dialog'
import Portrait from './portrait2.png';

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

  return (<div style={{ display: 'flex', flex: '0 0 400px' }}>
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
      padding: 20,
      width: 220,
      backgroundColor: "white",
      border: '1px solid black'
    }}>
      {
        speakingEvents.map(d => { return <Dialog event={d} /> })
      }

      {
        dialogLineFinished &&
        <div style={{ color: 'lightgray', paddingTop: '20px' }}>
          Space to continue
        </div>
      }

      {
        promptEvents[0] &&
        <div>
          <Prompt prompt={promptEvents[0]} />

          {
            promptFinished &&
            <div style={{ color: 'lightgray', paddingTop: '20px' }}>
              Choose an action to continue
            </div>
          }

        </div>
      }
    </div>

  </div >);
}