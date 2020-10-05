import React from 'react';
import { DisplayedDreamDialog, DisplayedEvent } from './App';

export const Overlay: React.FC<{
  opacity: number;
  displayedEvents: DisplayedEvent[];
}> = ({ opacity, displayedEvents }) => {
  const dreamEvents = displayedEvents.filter((event): event is DisplayedDreamDialog => event.type === "dream-dialog");

  return (
    <div style={{
      position: "absolute",
      width: 900,
      height: 600,
      margin: 40,
      backgroundColor: `rgba(0,0,0,1)`,
      opacity: String(opacity),
      zIndex: 10,
      pointerEvents: 'none',
    }}>
      <div style={{
        padding: "30px 30px 30px 30px",
        fontSize: 36,
      }}>
        {dreamEvents.map(event => {
          return (
            <div style={{
              color: 'white',
              textAlign: 'center',
              paddingTop: 12,
            }}>
              { event.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}