import React from 'react';
import PortraitPng from './images/portrait.png';
import { Cinematic, Location } from './CinematicTypes';
import { Locations } from './Data';
import { runEvents } from './Cinematics';
import { CinematicState } from './App';
import { Portrait } from './Portrait';

export const PortraitAndActions = ({ location, setCinematics }: {
  location: Location;
  setCinematics: React.Dispatch<React.SetStateAction<CinematicState[]>>;
}) => {
  const [openMenu, setOpenMenu] = React.useState<number | null>(null);

  const renderOptions = (i: number) => {
    const childStyle = { margin: "4 auto" };
    const containerStyle: React.CSSProperties = { display: "flex", flexDirection: "column", marginLeft: 10 };

    const actionType = location.actions[i];
    switch (actionType) {
      case "Interact": {
        if (location.interactors.length === 0) {
          return <div style={childStyle}>There is nothing here.</div>
        }

        return (
          <div style={containerStyle}>
            {location.interactors().map((p) => {
              return <button style={childStyle}>{p}</button>
            })}
          </div>
        );
      }
      case "Explore": {
        if (location.exits.length === 0) {
          return <div style={childStyle}>You've reached a dead end.</div>
        }

        return (<div style={containerStyle}>
          {location.exits.map((p) => {
            return <button onClick={() => {
              setCinematics(prev => [
                ...prev,
                {
                  cinematic:
                    runEvents([{
                      type: "change-location",
                      newLocation: Locations[p],
                    }]),
                  status: "running",
                }
              ]);
            }} style={childStyle}>{p}</button>
          })}
        </div>
        );
      }
      case "Inventory": {
        // TODO: hook up to state
        const inventory = ["thing 1", "thing 2", "thing 3"];
        if (inventory.length === 0) { return <div style={childStyle}>There is nothing in your inventory.</div> }
        return (<div style={containerStyle}>{inventory.map((p) => { return <button style={childStyle}>{p}</button> })}</div>)


      }
    }

    return (<div >
      {
        location.actions.map(action => {
          if (action === "Explore" && location.exits.length === 0) {
            return <div style={childStyle}>You've reached a dead end.</div> //probably shouldnt happen lol
          }

          if (action === "Inventory" && false) { // TODO - check inventory contents
            return <div style={childStyle}>There is nothing in your inventory.</div>
          }

          // if (action === "Talk" && location.exits.length === 0) {

          // }

          return <div style={childStyle}>{action}</div>
        })
      }
    </div>)
  }

  const onClickMenuItem = (menuItemIndex: number) => {
    if (openMenu === menuItemIndex) {
      setOpenMenu(null);
    } else {
      setOpenMenu(menuItemIndex);
    }
  }

  return (<div style={{ display: "flex" }}>
    <Portrait person={"Vega"} speaking={false} />
    {/* <div style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "white",
      alignSelf: "flex-end",
      border: '1px solid black'
    }}>
      {location.actions.map((a, i) => {
        return (
          <button
            onClick={() => { onClickMenuItem(i) }}>
            {a.toUpperCase()}
          </button>
        );
      })}
    </div>
    {openMenu !== null ? renderOptions(openMenu) : <span></span>} */}
  </div >
  );
}