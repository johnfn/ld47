import React, { useEffect } from 'react';
import { Person } from './Data';

const portraitFiles: { [K in Person]: string } = {
  'Bartender': "portrait",
  'Guy 2': "portrait2",
  'Doctor Scramble': "portrait2",
  '???': "portrait2",
  'Vega': "portrait",
  'Captain Sharp': "portrait2",
  'Narrator': "portrait2",
  'Past Vega': "portrait2",
  'Voice from inside': "portrait2",
  'Both Vegas': "portrait2",

}
export const Portrait = ({ person, speaking }: { person: Person, speaking: boolean }) => {
  const path = `./images/${portraitFiles[person]}.png`;

  return (<img className={speaking ? "speaker-active" : "speaker"} draggable="false" style={{
    width: 130,
    height: 180,
    border: '1px solid black'
  }} src={require(`${path}`)} alt="product" />
  );
}