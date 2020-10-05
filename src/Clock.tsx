import React from 'react';
import { GameMode } from './CinematicTypes';

// TODO: MAKE THIS GODDAMN CLOCK PIXEL PERFECT RARRHFHFJF
export const Clock = ({ dateString, timeString, mode }: {
  timeString: string;
  dateString: string;
  mode: GameMode;
}) => {
  if (mode === "Past") {
    return (
      <div style={{ width: 150 }}>
        <div style={{ backgroundColor: "white", border: '1px solid black', height: 50, fontSize: 36, paddingLeft: 12 }}>
          {timeString}
        </div>
        <div style={{ backgroundColor: "white", border: '1px solid black', borderTop: "none", alignSelf: "flex-end", width: 80, textAlign: "right" }}>
          {dateString}
        </div>
      </div>
    );
  } else if (mode === "Future") {
    return (
      <div style={{ width: 150 }}>
        <div style={{ backgroundColor: "white", border: '1px solid black', height: 50, fontSize: 36, paddingLeft: 12 }}>
          broken lol :-)
        </div>
        <div style={{ backgroundColor: "white", border: '1px solid black', borderTop: "none", alignSelf: "flex-end", width: 80, textAlign: "right" }}>
          .
        </div>
      </div>
    );
  } else if (mode === "DreamSequence") {
    return (
      <div style={{ width: 150 }}>
        <div style={{ backgroundColor: "white", border: '1px solid black', height: 50, fontSize: 36, paddingLeft: 12 }}>
          ???
        </div>
        <div style={{ backgroundColor: "white", border: '1px solid black', borderTop: "none", alignSelf: "flex-end", width: 80, textAlign: "right" }}>
          ???, ???
        </div>
      </div>
    );
  } else {
    alert('unknown game mode in clock');

    return null;
  }
}