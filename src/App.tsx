import React, { useEffect } from 'react';
import useInterval from './ use_interval';
import './App.css';
import Background from './img_placeholder.png';
import { Clock } from './Clock';
import { PortraitAndActions } from './PortraitAndActions';
import { PortraitAndDialogBox } from './PortraitAndDialogBox';
import { Cinematic, DialogEvent, displayText, PromptType } from './Cinematics';
import { Keyboard } from './Keyboard';

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
  const [events, setEvents] = React.useState<DialogEvent[]>([{
    speaker: "You",
    text: "",
    type: "dialog",
  }]);

  const [cinematics, setCinematics] = React.useState<Cinematic[]>([]);
  const [dialogLineFinished, setDialogLineFinished] = React.useState(false);
  const [prompt, setPrompt] = React.useState<PromptType | null>(null);

  useEffect(() => {
    const runCinematic = (cinematic: Cinematic) => {
      setCinematics([...cinematics, cinematic])
    };

    runCinematic(displayText());
  }, []);

  // is this the game loop. k thx np np
  // GAME LOOP:::::
  useInterval(() => {
    Keyboard.update();

    // TODO: cull finished cinematics
    for (const cinematic of cinematics) {
      cinematic.next({
        setEvents: setEvents,
        events: events,
        dialogLineFinished,
        setDialogLineFinished,
      });
    }
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
          events={events}
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
