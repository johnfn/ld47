import React, { useEffect } from 'react';
import { AllLocations, Cinematic, GameMode, Location } from './CinematicTypes';
import { LocationNames } from './Data';


const locationFiles: { [K in LocationNames]: string } = {
  'Bar': 'ld47 bar',
  'Outdoors': 'ld47 bar',
  'Alleyway': 'ld47 house',
  'DarkBG': 'ld47 bar',
  'HQ0': 'ld47 science',
}

export const Background = ({ location }: { location: Location }) => {
  const path = `./images/${locationFiles[location.name]}.png`;

  return (<img
    src={require(`${path}`)}
    style={{
      position: "absolute",
      display: 'flex',
      justifyContent: "space-between",
      zIndex: -1,
      width: 880,
      height: 580,
      padding: 10,
      backgroundSize: '100%',
    }}></img>);
}