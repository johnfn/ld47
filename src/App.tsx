import React, { useEffect } from 'react';
import useInterval from './ use_interval';
import './App.css';
import Background from './img_placeholder.png';
import { Clock } from './Clock';
import { PortraitAndActions } from './PortraitAndActions';
import { PortraitAndDialogBox } from './PortraitAndDialogBox';
import { Cinematic, displayText, PromptType } from './Cinematics';
import { Keyboard } from './Keyboard';

export type DialogType = {
  speaker: string;
  text: string;
}

const locationStuff = {
  'Bar': {
    description: [
      'You walk into the bar. It smells.',
      'You wonder why you came here in the first place.',
    ],
    people: [
      'Bartender',
      'Guy 2',
    ],
    exits: [
      'outdoors',
      'secret passageway',
    ],
  },
};

const App = () => {
  const [dialog, setDialog] = React.useState([{
    speaker: "You",
    text: "",
  }]);

  const [cinematics, setCinematics] = React.useState<Cinematic[]>([]);
  const [dialogLineFinished, setDialogLineFinished] = React.useState(false);
  const [prompt, setPrompt] = React.useState<PromptType | null>(null);

  const runCinematic = (cinematic: Cinematic) => {
    setCinematics([...cinematics, cinematic])
  };

  useEffect(() => {
    runCinematic(displayText());
  }, []);

  // is this the game loop. k thx np np
  // GAME LOOP:::::
  useInterval(() => {
    Keyboard.update();

    // TODO: cull finished cinematics
    for (const cinematic of cinematics) {
      cinematic.next({
        setDialog,
        dialog,
        dialogLineFinished,
        setDialogLineFinished,
        setPrompt,
      });
    }

    console.log(cinematics);
  }, 50);

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
          <Clock />
          <PortraitAndActions />
        </div>

        <PortraitAndDialogBox
          dialog={dialog}
          prompt={prompt}
          dialogLineFinished={dialogLineFinished}
        />
      </div>
    </div >
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
