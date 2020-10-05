import React from 'react';
import { CinematicState, DisplayedEvent, Inventory, InventoryItem } from './App';
import { explore, runEvents, setMode } from './Cinematics';
import { DescribeEvent, CinematicEvent, Location, Cinematic } from './CinematicTypes';
import { dreamSequence1, LocationNames, Locations } from './Data';
import { Keys } from './Utils';

export const PlayerActions = ({ events, inventory, location, setCinematics, allowInterruptions, futureHasChanged, markActionAsTaken }: {
  events: DisplayedEvent[],
  location: Location,
  setCinematics: React.Dispatch<React.SetStateAction<CinematicState[]>>;
  inventory: Inventory,
  allowInterruptions: boolean,
  futureHasChanged: boolean,
  markActionAsTaken: (id: string) => void
}) => {
  const canChangeLocations = (currentLocation: Location, nextLocation: LocationNames) => {
    return currentLocation.exits.includes(nextLocation);
  };

  const onClickActionItem = /* React.useCallback( */ (action: string, i: number) => {
    let actionText = "";
    let nextDialog: CinematicEvent = { type: "describe", text: "" };

    markActionAsTaken(events[events.length - 1].id);

    switch (action) {
      case "Explore": {
        setCinematics(_ => [{
          // NOTE: intentionally clear out array here to stop all existing cinematics
          cinematic: explore(location),
          status: "running",
        }]);

        return;
      }

      case "Inventory": {
        actionText = "You reach into your bag.";

        let items = [];

        for (const item of Keys(inventory)) {
          if (inventory[item] === true) {
            items.push(item);
          }
        }

        if (items.length === 0) {
          nextDialog = { type: "describe", text: "There's nothing in there." };
        } else {
          nextDialog = { type: "action", options: [] }

          for (const item of items) {
            const text = `> Use ${item}`;
            nextDialog.options.push({
              text: text, onClick: () => {
                setCinematics(_ => [
                  // NOTE: intentionally clear out array here to stop all existing cinematics
                  {
                    cinematic:
                      runEvents([{
                        type: "describe",
                        text: "Nothing happens. Hmmm... Maybe you can try a little harder next time?"
                      }]),
                    status: "running",
                  }
                ]);
              }
            })
          }
        }

        break;
      }

      case "Talk": {
        actionText = "You check who's nearby.";

        if (location.people.length === 0) {
          nextDialog = { type: "describe", text: "There doesn't seem to be anyone around. Spooky." }
        } else {
          nextDialog = { type: "action", options: [] }

          for (const person of location.people) {
            const interaction = person.dialog;
            const text = `> Talk to ${person.name.toLowerCase()}`;

            nextDialog.options.push({
              text: text, onClick: () => {
                setCinematics(prev => [
                  // NOTE: intentionally clear out array here to stop all existing cinematics
                  {
                    cinematic: interaction,
                    status: "running",
                  }
                ]);
              }
            })
          }
        }

        break;
      }
    }

    const event: DescribeEvent = { type: "describe", text: actionText, nextDialog };

    setCinematics(prev => {
      console.log('add event', event, 'should be number', prev.length + 1);

      return [
        ...prev,
        {
          cinematic: runEvents([event]),
          status: "running",
        }
      ]
    });
  }
  // }, [location.name, JSON.stringify(inventory), events.length]);

  // TODO: This (setting width:160) is a hacky way of aligning divs pixel-perfectly,
  // might break stuff. 

  const onClickFutureButton = () => {
    setCinematics(_ => [
      // NOTE: intentionally clear out array here to stop all existing cinematics
      {
        cinematic:
          dreamSequence1(),
        status: "running",
      }
    ]);
  }

  return (
    <div>
      {futureHasChanged &&
        <div style={{ border: "1px solid black", padding: "6px 10px", }}>
          <div>The future has changed. Suddenly, you feel a force pulling you away...</div>
          <button
            style={{
              margin: "auto", padding: "0px 4px 2px", marginTop: 4
            }}
            onClick={onClickFutureButton}>Give in</button>
        </div>
      }
      <div style={{ display: "flex", justifyContent: "center" }}>

        <div style={{ width: 160 }}>
          {
            location.actions.map((action, i) => {
              let disabled = false;

              debugger;

              for (const event of events.slice().reverse()) {
                if (event.type === "background-dialog") {
                  continue;
                }

                if (event.type === "action") {
                  // I dont get what this does
                  //disabled = event.options.length > 0; 

                  disabled = event.hasTakenAction && event.options.length > 0;
                  break;
                }

                if (event.isContainingSequenceFinished) {
                  disabled = false;
                  break;
                }

                if (event.type === "describe") {
                  disabled = true;
                  break;
                }

                disabled = false;
                break;
              }

              if (!allowInterruptions) {
                disabled = true;
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
    </div>
  )
}