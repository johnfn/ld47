import React from 'react';
import { SpeakEvent } from './Cinematics';

export const Dialog = (props: { event: SpeakEvent }) => {
  const { speaker, text } = props.event;

  return (
    <div style={{ marginBottom: 12 }}>
      <div>{speaker.toUpperCase()}</div>
      <div style={{ marginLeft: 10 }}>{text}</div>
    </div>
  );
}