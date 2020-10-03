import React from 'react';
import { CinematicState } from './App';
import { runActionEvent } from './Cinematics';
import { ActionEvent, Location } from './CinematicTypes';

export const Action = ({ event }: { event: ActionEvent }) => {
  return (<div>{event.text}</div>);
}

export const PlayerActions = ({ location, cinematicState }: { location: Location, cinematicState: CinematicState }) => {
  const onClickActionItem = (action: string, i: number) => {
    const event: ActionEvent = { type: "action", text: action };

    if (cinematicState.type === "can-run-cinematic") {
      cinematicState.runCinematic(runActionEvent(event));
    }
  }


  return (
    <div style={{ margin: "10 auto 0" }}>
      {
        location.actions.map((action, i) => {
          return (<>
            <button
              onClick={() => { onClickActionItem(action, i) }}
              disabled={cinematicState.type === "already-running-cinematic"}
              style={{ border: "none", margin: 2 }}>
              {action}
            </button>
            <span> {i !== location.actions.length - 1 ? " | " : null}</span>
          </>
          )
        })
      }
    </div>
  )
}