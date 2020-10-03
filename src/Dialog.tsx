import React from 'react';
import { SpeakEvent } from './CinematicTypes';

export const Dialog = ({ event: { speaker, text, timeString }, showTimestamp }: { event: SpeakEvent; showTimestamp: boolean; }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ marginBottom: 12, marginTop: 12, backgroundColor: isHovered ? '#f9f9f9' : '#fff' }}
    >
      <div
        style={{ display: 'flex' }}
      >
        <div style={{ flex: '1 0 0' }}>{speaker.toUpperCase()}</div>
        <div style={{ flex: '1 0 0', color: 'lightgray' }}>{(showTimestamp || isHovered) && timeString}</div>
      </div>

      <div style={{ marginLeft: 10 }}>{text}</div>
    </div>
  );
}