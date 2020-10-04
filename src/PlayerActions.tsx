import React from 'react';
import { CinematicState, DisplayedDescribe } from './App';
import { runChangeLocation, runDescribeEvent } from './Cinematics';
import { ActionEvent, DescribeEvent, CinematicEvent, Location } from './CinematicTypes';
import { LocationNames, Locations } from './Data';

export const Action = ({ event }: { event: ActionEvent }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      {event.options.map((o) => <button onClick={o.onClick} style={{ border: "none" }}>{o.text}
      </button>)}
    </div>
  );
}

export const Describe = ({ event }: { event: DisplayedDescribe }) => {
  // TODO: Merge this with Dialog?
  // TODO: get showTimestamp prop
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        marginBottom: 12,
        marginTop: 12,
        backgroundColor: isHovered ? '#f9f9f9' : '#fff',
        color: "black",
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: "space-between" }}
      >
        <div style={{ flex: '1 0 0' }}>NARRATOR</div>
        <div style={{ flex: '1 0 0', color: 'lightgray', textAlign: "right" }}>{isHovered && event.time}</div>
      </div>
      <div style={{ marginLeft: 10 }}>{event.text}</div>
    </div>);
}


export const PlayerActions = ({ location, cinematicState }: { location: Location, cinematicState: CinematicState }) => {

  const canChangeLocations = (currentLocation: Location, nextLocation: LocationNames) => {
    return currentLocation.exits.includes(nextLocation);
  }
  const onClickActionItem = (action: string, i: number) => {
    let actionText = "";
    let nextDialog: CinematicEvent = { type: "describe", text: "" };

    switch (action) {
      case "Explore": {
        actionText = "You look around.";
        if (location.exits.length === 0) {
          nextDialog = { type: "describe", text: "This room doesn't have any doors. Strange." };
        } else {
          nextDialog = { type: "action", options: [] }
          for (const exit of location.exits) {
            const text = exit === "Outdoors" ? `> Go ${exit.toLowerCase()}` : `> Go to ${exit.toLowerCase()}`
            nextDialog.options.push({
              text: text,
              onClick: () => {
                // TODO- we can allow for interruptions now, so this check is pretty unnecessary... but eh
                if (cinematicState.cinematics.length === 0 && canChangeLocations(location, exit)) {
                  console.log("Hello, I am running a explore cinematic.");
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
        nextDialog = { type: "describe", text: "There's nothing in there." };

        break;
      }
      case "Talk": {
        actionText = "You check who's nearby.";
        if (location.people.length === 0) {
          nextDialog = { type: "describe", text: "There doesn't seem to be anyone around." }
        } else {
          nextDialog = { type: "action", options: [] }

          for (const person of location.people) {
            const text = `> Talk to ${person.toLowerCase()}`;
            nextDialog.options.push({ text: text })
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

  // TODO: This (setting width:160) is a hacky way of aligning divs pixel-perfectly,
  // might break stuff. 
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 160 }}>
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
    </div>
  )
}