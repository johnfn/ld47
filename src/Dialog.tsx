import React from 'react';
import { DialogType } from './App';

export const Dialog = (props: DialogType) => {
  return (
    <div style={{ marginBottom: 12 }}>
      <div>{props.speaker.toUpperCase()}</div>
      <div style={{ marginLeft: 10 }}>{props.text}</div>
    </div>
  );
}