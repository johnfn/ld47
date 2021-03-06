import React, { useEffect } from 'react';
import { CinematicState, DisplayedEvent, Inventory, InventoryItem } from './App';
import { explore, runEvents, setMode, showInventory, showNearbyInteractors } from './Cinematics';
import { DescribeEvent, CinematicEvent, Location, Cinematic } from './CinematicTypes';
import { startDreamSequence, Locations, LocationNames } from './Data';
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

  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if (ev.key.toUpperCase() === "Q") {
        onClickActionItem("Explore");
      }

      if (ev.key.toUpperCase() === "W") {
        onClickActionItem("Inventory");
      }

      if (ev.key.toUpperCase() === "E") {
        onClickActionItem("Interact");
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  });

  const onClickActionItem = /* React.useCallback( */ (action: string) => {
    markActionAsTaken(events[events.length - 1].id);

    switch (action) {
      case "Explore": {
        setCinematics(_ => [{
          // NOTE: intentionally clear out array here to stop all existing cinematics
          cinematic: explore(location),
          status: "running",
        }]);

        break;
      }

      case "Inventory": {
        setCinematics(_ => [{
          // NOTE: intentionally clear out array here to stop all existing cinematics
          cinematic: showInventory(inventory),
          status: "running",
        }]);

        break;
      }

      case "Interact": {
        setCinematics(_ => [{
          // NOTE: intentionally clear out array here to stop all existing cinematics
          cinematic: showNearbyInteractors(location),
          status: "running",
        }]);

        break;
      }
    }
  }
  // }, [location.name, JSON.stringify(inventory), events.length]);

  // TODO: This (setting width:160) is a hacky way of aligning divs pixel-perfectly,
  // might break stuff. 

  const onClickFutureButton = () => {
    setCinematics(_ => [
      // NOTE: intentionally clear out array here to stop all existing cinematics
      {
        cinematic:
          startDreamSequence(),
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
            onFocus={e => {
              e.target.blur();
            }}
            onClick={onClickFutureButton}>Give in</button>
        </div>
      }
      <div style={{ display: "flex", justifyContent: "center" }}>

        <div>
          {
            location.actions.map((action, i) => {
              let disabled = false;

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
                    onClick={event => {
                      onClickActionItem(action);
                    }}
                    onFocus={e => {
                      e.currentTarget.blur();
                    }}
                    disabled={disabled}
                    style={{ fontSize: 16, border: "none", margin: 1 }}>
                    {action}
                    {i === 0 ? " (Q)" : null}
                    {i === 1 ? " (W)" : null}
                    {i === 2 ? " (E)" : null}
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