import React from 'react';
import useInterval from './ use_interval';
import { DisplayedAction, DisplayedBackgroundDialog, DisplayedDescribe, DisplayedDialog, DisplayedEvent } from './App';
import { GameMode, PromptEvent, PromptSelectionKeys } from './CinematicTypes';

export const maxDialogsToDisplay = 60;

type HSL = {
  h: number,
  s: number,
  l: number
}

const red: HSL = { h: 350, s: 80, l: 50 };
const blue: HSL = { h: 215, s: 80, l: 50 };
const black: HSL = { h: 0, s: 0, l: 0 };
const gray: HSL = { h: 0, s: 0, l: 45 };
const yellow: HSL = { h: 25, s: 90, l: 45 };
const green: HSL = { h: 89, s: 73, l: 37 };

const textColors: { [K in DisplayedEvent['type']]: HSL } = {
  "dialog": black,
  "background-dialog": red,
  "prompt": yellow,
  "describe": green,
  "action": blue,
  "dream-dialog": black, // never used but idk how types work weeeeeeeeeeeeeeeeeeeeeeeeee
}

const clamp = (props: { x: number, low: number, high: number }): number => {
  const { x, low, high } = props;
  const min = Math.min(low, high);
  const max = Math.max(low, high);
  return Math.min(max, Math.max(min, x));
}

export const DialogComponent = ({ event, markActionAsTaken, index, showTimestamp, happenedInPast, showSpeaker, mode }:
  {
    event: DisplayedEvent;
    markActionAsTaken: (id: string) => void;
    index: number;
    showTimestamp: boolean;
    happenedInPast: boolean;
    showSpeaker: boolean;
    mode: GameMode;

  }) => {
  let initialColor = textColors[event.type];

  if (event.type === "dialog" && event.speaker === "Narrator") {
    initialColor = gray;
  }

  let fadeAmount = clamp({ x: index / maxDialogsToDisplay, low: 0, high: 0.8 });

  if (happenedInPast && fadeAmount < 0.7) {
    fadeAmount = 0.7;
  }

  const fadedColor: HSL = {
    h: initialColor.h,
    s: initialColor.s,
    l: initialColor.l + (100 - initialColor.l) * fadeAmount
  };


  switch (event.type) {
    case "dialog":
    case "background-dialog": {
      return <Dialog event={event} showTimestamp={showTimestamp} color={fadedColor} showSpeaker={showSpeaker} mode={mode} />
    }
    case "prompt": {
      return <Prompt prompt={event} color={fadedColor} />
    }
    case "describe": {
      return <Describe event={event} color={fadedColor} mode={mode} />
    };
    case "action": {
      return <Actions event={event} onClick={(id: string) => { markActionAsTaken(id) }} color={fadedColor} />
    };
    case "dream-dialog": return null;
    default: alert(`unhandled event type`);
  }
  return (<div></div>)
}

export const Dialog = ({ event: { speaker, text, time, type, modifier }, showTimestamp, color, showSpeaker, mode }:
  {
    event: DisplayedDialog | DisplayedBackgroundDialog; showTimestamp: boolean; color: HSL; showSpeaker: boolean; mode: GameMode;
  }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const { h, s, l } = color;

  const timestampLightness = clamp({ x: l + 20, low: 60, high: 90 });

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        marginTop: 8,
        marginBottom: showSpeaker ? 2 : 0,
        backgroundColor: isHovered ? '#f9f9f9' : '#fff',
        color: `hsl(${h},${s}%,${l}%)`,
      }}
    >
      {
        showSpeaker && speaker !== "Narrator" &&
        <div
          style={{ display: 'flex', justifyContent: "space-between", }}
        >
          <div style={{ flex: '2 0 0' }}>{speaker.toUpperCase()}</div>
          <div style={{ flex: '1 0 0', color: `hsl(${h},${0}%,${timestampLightness}%)`, textAlign: "right" }}>{(mode === 'Past' && (showTimestamp || isHovered)) && time}</div>
        </div>
      }

      <div style={{
        marginLeft: speaker === "Narrator" ? 0 : 10,
        fontSize: modifier?.includes("huge") ? "48px" : "inherit",
      }}>
        {
          modifier?.includes("shaky")
            ? <ShakyText text={text} />
            : text
        }
      </div>
    </div>
  );
}

const ShakyText: React.FC<{ text: string }> = ({ text }) => {
  const [y, setY] = React.useState(0);

  useInterval(() => {
    if (y === -1) {
      setY(1);
    } else {
      setY(-1);
    }
  }, 100);

  return (
    <div
      style={{
        transition: "0.1s all linear",
        transform: `translateY(${y * 6}px)`,
      }}
    >
      { text}
    </div>
  )
};


export const Prompt: React.FC<{ prompt: PromptEvent, color: HSL }> = ({ prompt, color }) => {
  const { h, s, l } = color;
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div style={{ color: `hsl(${h}, ${s}%, ${l}%)`, marginTop: 10 }}>
      {
        prompt.options.map((option, i) =>
          <div
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ display: 'flex', padding: '8px 0' }}>
            <div style={{ flex: '0 0 20px' }}>
              {PromptSelectionKeys[i]}:
            </div>

            <div style={{ flex: '1 0 0', color: "inherit" }}>
              {option}
            </div>
          </div>
        )
      }
    </div>
  )
};

export const Describe = ({ event, color, mode }: { event: DisplayedDescribe, color: HSL, mode: GameMode, }) => {
  // TODO: get showTimestamp prop
  const [isHovered, setIsHovered] = React.useState(false);

  const { h, s, l } = color;

  const timestampLightness = clamp({ x: l + 20, low: 60, high: 90 });

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        marginBottom: 12,
        marginTop: 12,
        backgroundColor: isHovered ? '#f9f9f9' : '#fff',
        color: `hsl(${h},${s}%,${l}%)`
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: "space-between" }}
      >
        <div style={{ flex: '1 0 0' }}>NARRATOR</div>
        <div style={{ flex: '1 0 0', color: `hsl(${h},${0}%,${timestampLightness}%)`, textAlign: "right" }}>{(mode === 'Past' && isHovered && event.time)}</div>
      </div>
      <div style={{ marginLeft: 10 }}>{event.text}</div>
    </div>
  );
}



export const Actions = ({ event, onClick, color }: {
  event: DisplayedAction;
  onClick: (id: string) => void;
  color: HSL;
}) => {
  const { h, s, l } = color;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      color: `hsl(${h},${s}%,${l}%)`
    }}>
      {
        event.options.map(o =>
          <button
            disabled={event.hasTakenAction}
            onClick={() => { onClick(event.id); o.onClick && o.onClick(); }}
            style={{ border: "none" }}
          >
            {o.text}
          </button>
        )
      }
    </div>
  );
}

