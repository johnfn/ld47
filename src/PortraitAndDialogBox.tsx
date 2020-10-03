import React from 'react';
import { DialogType } from './App';
import { PromptType } from './Cinematics';
import { Dialog } from './Dialog'
import Portrait from './portrait2.png';

const Prompt: React.FC<{ prompt: PromptType }> = ({ prompt }) => {
  const keys = [
    'A',
    'S',
    'D',
    'F',
  ];

  return (
    <div>
      {
        prompt.options.map((option, i) =>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '0 0 20px' }}>
              <strong>{keys[i]}</strong>:
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

export const PortraitAndDialogBox = ({ dialog, dialogLineFinished, prompt }: {
  dialog: DialogType[];
  dialogLineFinished: boolean;
  prompt: PromptType | null;
}) => {
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
        dialog.map(d => { return <Dialog speaker={d.speaker} text={d.text} /> })
      }

      {
        dialogLineFinished &&
        <div style={{ color: 'lightgray', paddingTop: '20px' }}>
          Space to continue
          </div>
      }

      {
        prompt &&
        <Prompt prompt={prompt} />
      }
    </div>

  </div >);
}