import React, { useEffect } from 'react';
import { Person } from './Data';
import { Keys } from './Utils';

const portraitFiles: { [K in Person]: string } = {
  'Bartender': "Bartender",
  'Doctor Scramble': "Scramble",
  '???': "Scramble",
  'Vega': "Vega1",
  'Captain Sharp': "CaptainSharp",
  'Narrator': "nobody",
  'Seedy Guy': "SeedyGuy",
  'Shady Guy': "ShadyGuy",
  'Past Scramble': "ScramblePast",
  'Voice from inside': "Mystery",
  'You find yourself...': "nobody",
  'Other Vega': "VegaPast1",
  'Past Vega': "VegaPast1",
  'Both Vegas': "VegaPast1",
}

const cachedImages: { [K in Person]?: any } = {
  'Bartender': require('./images/Portraits/Bartender.png'),
  'Vega': require('./images/Portraits/Vega.png'),
  'Captain Sharp': require('./images/Portraits/CaptainSharp.png'),
  'Doctor Scramble': require("./images/Portraits/Scramble.png"),
  '???': require("./images/Portraits/Scramble.png"),
  'Narrator': require("./images/Portraits/nobody.png"),
  'Seedy Guy': require("./images/Portraits/SeedyGuy.png"),
  'Shady Guy': require("./images/Portraits/ShadyGuy.png"),
  'Past Scramble': require("./images/Portraits/ScramblePast.png"),
  'Voice from inside': require("./images/Portraits/Mystery.png"),
  'You find yourself...': require("./images/Portraits/nobody.png"),
  'Other Vega': require("./images/Portraits/VegaPast1.png"),
  'Past Vega': require("./images/Portraits/VegaPast1.png"),
  'Both Vegas': require("./images/Portraits/VegaPast1.png"),
};

export const Portrait = ({ person, speaking }: { person: Person, speaking: boolean }) => {
  const border = portraitFiles[person] != "nobody" ? '1px solid black' : '1px solid transparent';

  return (<img className={speaking ? "speaker-active" : "speaker"} draggable="false" style={{
    width: 130,
    height: 217,
    border: border,
  }} src={cachedImages[person]} alt="product" />
  );
}