import React from 'react';
import { CinematicState, DisplayedAction, DisplayedDescribe, DisplayedEvent, Inventory, InventoryItem } from './App';
import { runChangeLocation, runDescribeEvent, runEvents } from './Cinematics';
import { DescribeEvent, CinematicEvent, Location } from './CinematicTypes';
import { LocationNames, Locations } from './Data';
import { Keys } from './Utils';

export const Actions = ({ event, onClick }: {
  event: DisplayedAction;
  onClick: (id: string) => void;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
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


export const PlayerActions = ({ events, inventory, location, cinematicState }: {
  events: DisplayedEvent[],
  location: Location,
  cinematicState: CinematicState,
  inventory: Inventory,
}) => {
  const canChangeLocations = (currentLocation: Location, nextLocation: LocationNames) => {
    return currentLocation.exits.includes(nextLocation);
  };

  const onClickActionItem = React.useCallback((action: string, i: number) => {
    let actionText = "";
    let nextDialog: CinematicEvent = { type: "describe", text: "" };

    switch (action) {
      case "Explore": {
        actionText = "You look around.";

        if (location.exits.length === 0) {
          // lol
          nextDialog = { type: "describe", text: "This room doesn't have any doors. Strange; how did you get here?" };
        } else {
          nextDialog = { type: "action", options: [] }

          for (const exit of location.exits) {
            const text = exit === "Outdoors" ? `> Go ${exit.toLowerCase()}` : `> Go to ${exit.toLowerCase()}`;

            nextDialog.options.push({
              text: text,
              onClick: () => {
                // TODO- we can allow for interruptions now, so this check is pretty unnecessary... but eh
                if (cinematicState.cinematics.length === 0 && canChangeLocations(location, exit)) {
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

        let items = [];
        for (const item of Keys(inventory)) {
          if (inventory[item] === true) {
            items.push(inventory[item]);
          }
        }
        if (items.length === 0) {
          nextDialog = { type: "describe", text: "There's nothing in there." };
        } else {
          nextDialog = { type: "action", options: [] }

          for (const item of items) {
            const text = `> Use ${item}`;
            nextDialog.options.push({ text: text, onClick: () => { } })
          }
        }

        break;
      }
      case "Talk": {
        actionText = "You check who's nearby.";

        if (location.people.length === 0) {
          nextDialog = { type: "describe", text: "There doesn't seem to be anyone around." }
        } else {
          nextDialog = { type: "action", options: [] }

          for (const person of location.people) {
            const dialog = person.dialog;
            const text = `> Talk to ${person.name.toLowerCase()}`;

            nextDialog.options.push({ text: text, onClick: () => { cinematicState.runCinematic(runEvents(dialog)) } })
          }
        }
        break;
      }
    }

    const event: DescribeEvent = { type: "describe", text: actionText, nextDialog };
    console.log(event);

    if (cinematicState.cinematics.length === 0) {
      cinematicState.runCinematic(runDescribeEvent(event));
    }
  }, [cinematicState.cinematics.length, location.name]);

  // TODO: This (setting width:160) is a hacky way of aligning divs pixel-perfectly,
  // might break stuff. 

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 160 }}>
        {
          location.actions.map((action, i) => {

            // disable if the most recent action (which is not a bg action) is
            // * a description or
            // * an event
            let disabled = false;

            for (const event of events.slice().reverse()) {
              if (event.type === "background-dialog") {
                continue;
              }

              if (event.isFinished) {
                disabled = false;
                break;
              }

              if (event.type === "describe") {
                disabled = true;
                break;
              }

              if (event.type === "action") {
                disabled = true;
                break;
              }

              disabled = false;
              break;
            }

            return (
              <>
                <button
                  onClick={() => { onClickActionItem(action, i) }}
                  disabled={disabled}
                  style={{ border: "none", margin: 2 }}>
                  {action}
                </button>

                <span> {i !== location.actions.length - 1 ? " | " : null}</span>
              </>
            );
          })
        }
      </div>
    </div>
  )
}