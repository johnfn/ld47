import React from 'react';
import Portrait from './images/portrait.png';
import { Location } from './CinematicTypes';
import { runChangeLocation } from './Cinematics';
import { Locations } from './Data';
import { CinematicState } from './App';

export const PortraitAndActions = ({ location, cinematicState: runCinematic }: {
  location: Location;
  cinematicState: CinematicState;
}) => {
  const [openMenu, setOpenMenu] = React.useState<number | null>(null);

  const renderOptions = (i: number) => {
    const childStyle = { margin: "4 auto" };
    const containerStyle: React.CSSProperties = { display: "flex", flexDirection: "column", marginLeft: 10 };

    const actionType = location.actions[i];
    switch (actionType) {
      case "Talk": {
        if (location.people.length === 0) {
          return <div style={childStyle}>There is no one here.</div>
        }

        return (
          <div style={containerStyle}>
            {location.people.map((p) => {
              return <button style={childStyle}>{p}</button>
            })}
          </div>
        );
      }
      case "Explore": {
        if (location.exits.length === 0) {
          return <div style={childStyle}>You've reached a dead end.</div>
        }

        if (runCinematic.type === "can-run-cinematic") {
          return (<div style={containerStyle}>
            {location.exits.map((p) => {
              return <button onClick={() => { runCinematic.runCinematic(runChangeLocation(Locations[p])) }} style={childStyle}>{p}</button>
            })}
          </div>
          );

        }
      }
      case "Inventory": {
        // todo: hook up to state
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

          if (action === "Talk" && location.exits.length === 0) {

          }

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
    <div style={{
      backgroundImage: `url("${Portrait}")`,
      backgroundSize: '100%',
      backgroundColor: "white",
      width: 130,
      height: 180,
      border: '1px solid black'
    }} />
    <div style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "white",
      alignSelf: "flex-end",
      border: '1px solid black'
    }}>
      {location.actions.map((a, i) => {
        if (runCinematic.type === "already-running-cinematic") {
          return (
            <button
              disabled={true}
              onClick={() => { onClickMenuItem(i) }}>
              {a.toUpperCase()}
            </button>
          );
        } else {
          return (
            <button
              onClick={() => { onClickMenuItem(i) }}>
              {a.toUpperCase()}
            </button>
          );
        }
      })}
    </div>
    {openMenu !== null ? renderOptions(openMenu) : <span></span>}
  </div >
  );
}