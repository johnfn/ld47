import React from 'react';
import { DisplayedBackgroundDialog, DisplayedDescribe, DisplayedDialog } from './App';
import { BackgroundDialog, DialogEvent } from './CinematicTypes';

export const Dialog = ({ event: { speaker, text, time, type }, showTimestamp }: { event: DisplayedDialog | DisplayedBackgroundDialog; showTimestamp: boolean; }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        marginBottom: 12,
        marginTop: 12,
        backgroundColor: isHovered ? '#f9f9f9' : '#fff',
        color: type === "dialog" ? "black" : "#aaaaff",
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: "space-between" }}
      >
        <div style={{ flex: '1 0 0' }}>{speaker.toUpperCase()}</div>
        <div style={{ flex: '1 0 0', color: 'lightgray', textAlign: "right" }}>{(showTimestamp || isHovered) && time}</div>
      </div>

      <div style={{ marginLeft: 10 }}>{text}</div>
    </div>
  );
}