import React from 'react';
import { GameMode } from './CinematicTypes';

// TODO: MAKE THIS GODDAMN CLOCK PIXEL PERFECT RARRHFHFJF
export const Clock = ({ dateString, timeString, mode }: {
  timeString: string;
  dateString: string;
  mode: GameMode;
}) => {
  const brokenClockPath = './images/broken_clock.png';

  if (mode === "Past") {
    return (
      <div style={{ width: 150 }}>
        <div style={{ backgroundColor: "white", border: '1px solid black', height: 50, fontSize: 36, paddingLeft: 12 }}>
          {timeString}
        </div>
        <div style={{ backgroundColor: "white", border: '1px solid black', height: 25, alignSelf: "flex-end", width: 80 }}>
          {dateString}
        </div>
      </div>
    );
  } else if (mode === "Future") {
    return (
      <div style={{ width: 150 }}>
        <img src={require(`${brokenClockPath}`)}
          style={{ backgroundColor: "white", border: '1px solid black', height: 50, fontSize: 36, paddingLeft: 12 }}>

        </img>
        <div style={{ backgroundColor: "white", border: '1px solid black', height: 25, alignSelf: "flex-end", width: 80, padding: "0px 10px" }}>
          {dateString}
        </div>
      </div>
    );
  } else if (mode === "DreamSequence") {
    return (<div style={{ width: 150 }} ></div>
      // <div style={{ width: 150 }}>
      //   <div style={{ backgroundColor: "white", border: '1px solid black', height: 50, fontSize: 36, paddingLeft: 12 }}>
      //     ???
      //   </div>
      //   <div style={{ backgroundColor: "white", border: '1px solid black', borderTop: "none", alignSelf: "flex-end", width: 80, textAlign: "right" }}>
      //     ???, ???
      //   </div>
      // </div>
    );
  } else {
    alert('unknown game mode in clock');

    return null;
  }
}