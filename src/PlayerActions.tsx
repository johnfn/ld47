import React from 'react';
import { CinematicState } from './App';
import { runActionEvent, runChangeLocation, runDescribeEvent } from './Cinematics';
import { ActionEvent, DescribeEvent, DialogEvent, Location } from './CinematicTypes';
import { Locations } from './Data';

export const Action = ({ event }: { event: ActionEvent }) => {
  return (<button onClick={event.onClick} style={{ border: "none" }}>{event.text}</button>);
}

export const Describe = ({ event }: { event: DescribeEvent }) => {
  return (<div>{event.text}</div>);
}


export const PlayerActions = ({ location, cinematicState }: { location: Location, cinematicState: CinematicState }) => {
  const onClickActionItem = (action: string, i: number) => {
    let actionText = "";
    let nextDialog: DialogEvent[] = [];
    switch (action) {
      case "Explore": {
        actionText = "You look around.";
        if (location.exits.length === 0) {
          nextDialog.push({ type: "action", text: "This room doesn't have any doors. Strange." })
        } else {
          for (const exit of location.exits) {
            const text = exit === "Outdoors" ? `> Go ${exit.toLowerCase()}` : `> Go to ${exit.toLowerCase()}`
            nextDialog.push({
              type: "action", text: text, onClick: () => {
                // TODO- we can allow for interruptions now, so this check is pretty unnecessary... but eh
                if (cinematicState.cinematics.length > 0) {
                  cinematicState.runCinematic(runChangeLocation(Locations[exit]))
                }
              }
            })
          }
        }
        break;
      }
      case "Inventory": {
        actionText = "You reach into your bag.";
        nextDialog.push({ type: "action", text: "There's nothing in there." })

        break;
      }
      case "Talk": {
        actionText = "You check who's nearby.";
        if (location.people.length === 0) {
          nextDialog.push({ type: "action", text: "There doesn't seem to be anyone around." })
        } else {
          for (const person of location.people) {
            const text = `> Talk to ${person.toLowerCase()}`;
            nextDialog.push({ type: "action", text: text })
          }
        }
        break;
      }
    }
    const event: DescribeEvent = { type: "describe", text: actionText, nextDialog };

    if (cinematicState.cinematics.length === 0) {
      cinematicState.runCinematic(runDescribeEvent(event));
    }
  }

  return (
    <div style={{ margin: "10px auto 0px" }}>
      {
        location.actions.map((action, i) => {
          return (<>
            <button
              onClick={() => { onClickActionItem(action, i) }}
              disabled={cinematicState.cinematics.length > 0} // TODO - this check is also unnecessary
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