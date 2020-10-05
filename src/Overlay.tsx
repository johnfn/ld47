import React, { useEffect } from 'react';
import useInterval from './ use_interval';
import { APP_HEIGHT, APP_WIDTH, DisplayedDreamDialog, DisplayedEvent } from './App';

export const Overlay: React.FC<{
  opacity: number;
  displayedEvents: DisplayedEvent[];
}> = ({ opacity, displayedEvents }) => {
  const dreamEvents = displayedEvents.filter((event): event is DisplayedDreamDialog => event.type === "dream-dialog");

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
        border: "1px solid white",
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