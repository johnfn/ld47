import React, { useCallback, useEffect } from 'react';
import useInterval from './ use_interval';
import Background from './images/img_placeholder.png';
import { Clock, useClock } from './Clock';
import { PortraitAndActions } from './PortraitAndActions';
import { PortraitAndDialogBox } from './PortraitAndDialogBox';
import { displayText, hello } from './Cinematics';
import { Keyboard } from './Keyboard';
import { DialogEvent, Cinematic, Location } from './CinematicTypes';
import { Locations } from './Data';

export type CinematicState = {
  runCinematic: (cinematic: Cinematic) => void;
  cinematics: Cinematic[];
}

const App = () => {
  const [events, setEvents] = React.useState<DialogEvent[]>([]);

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

  const [test, setTest] = React.useState(false);

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
      });

      if (result.done) {
        return null;
      }

      return cinematic;
    }).filter((x): x is Cinematic => x !== null);


    setCinematicState({
      cinematics: newCinematics,
      runCinematic,
    });

    if (!test && timeString.toLowerCase() === "11:01 am") {
      runCinematic(hello());
      setTest(true);
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
          events={events}
          dialogLineFinished={dialogLineFinished}
          location={activeLocation}
          promptFinished={showPromptFinishedMessage}
          cinematicState={cinematicState} />
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
