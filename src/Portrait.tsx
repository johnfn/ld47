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

  // these three are the same
  'Other Vega': "VegaPast1",
  'Past Vega': "VegaPast1",
  'Both Vegas': "VegaPast1",

}
export const Portrait = ({ person, speaking }: { person: Person, speaking: boolean }) => {
  const cachedImages: { [K in Person]?: any } = {}
  const mystery = require(`./images/Mystery.png`)

  useEffect(() => {
    for (const someone of Keys(portraitFiles)) {
      cachedImages[someone] = require(`./images/${portraitFiles[someone]}.png`)
    }
  }, [])

  const test = require(`./images/Bartender.png`) // this works for caching

  const path = `./images/Portraits/${portraitFiles[person]}.png`;

  const border = portraitFiles[person] != "nobody" ? '1px solid black' : '1px solid transparent';

  return (<img className={speaking ? "speaker-active" : "speaker"} draggable="false" style={{
    width: 130,
    height: 217,
    border: border,
  }} src={require(`${path}`)} alt="product" /> 
  );
}