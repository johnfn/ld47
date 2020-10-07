import React from 'react';
import { APP_HEIGHT, APP_WIDTH, DisplayedDreamDialog, DisplayedEvent } from './App';

export const Overlay: React.FC<{
  opacity: number;
  displayedEvents: DisplayedEvent[];
}> = ({ opacity, displayedEvents }) => {
  const dreamEvents: DisplayedDreamDialog[] = [];

  // console.log(displayedEvents);

  for (let i = displayedEvents.length - 1; i >= 0; i--) {
    const ev = displayedEvents[i];

    if (ev.type === "dream-dialog") {
      dreamEvents.push(ev);
    } else {
      break;
    }

    // // hi
    // // give terminal
    // // now
    // // hgekgjsdg
    // // shdgk
    // hfhehfhs

    // s

    // hahaha i cant compile!!
    // hehe
    // console.error(TS);

    // beep boop
    // hehehehhehe


    //console.log("thank u");
    // i am gabby and i am dumb and i typed this prove me wrong
  }

  dreamEvents.reverse();

  return (
    <div style={{
      position: "absolute",
      width: APP_WIDTH,
      height: APP_HEIGHT,
      margin: 40,
      backgroundColor: `rgba(0,0,0,1)`,
      opacity: String(opacity),
      zIndex: 10,
      pointerEvents: 'none',
    }}>
      <div style={{
        border: "none",
        margin: "75px auto",
        padding: 30,
        width: APP_WIDTH - 400,
        height: APP_HEIGHT - 200,
        fontSize: 24,

      }}>
        {dreamEvents.map(event => {
          return (
            <div style={{
              color: 'white',
              paddingTop: 12,
            }}>
              {event.text}
            </div>
          );
        })}
      </div>
    </div >
  );
}