import React from 'react';
import { useInterval } from './ use_interval';

export const useClock = (): { dateString: string, timeString: string } => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  const [currentDate, setCurrentDate] = React.useState(new Date(Date.parse('14 April 2012 10:00:00 PST')));
  const [timeString, setTimeString] = React.useState("");
  const [dateString, setDateString] = React.useState("");

  useInterval(() => {
    setCurrentDate(prevDate => {
      prevDate.setMilliseconds(currentDate.getMilliseconds() + 10 * 50);
      return prevDate;
    })
    setTimeString(`${currentDate.toLocaleTimeString().split(" ")[0].slice(0, -3)} ${currentDate.toLocaleTimeString().split(" ")[1]}`);
    setDateString(`${currentDate.toLocaleDateString("en-US", options).split(",")[1]}`);
  }, 50);

  return {
    timeString,
    dateString,
  };
};

// TODO: MAKE THIS GODDAMN CLOCK PIXEL PERFECT RARRHFHFJF
export const Clock = ({ dateString, timeString }: {
  timeString: string;
  dateString: string;
}) => {
  return (<div style={{ width: 150 }}>
    <div style={{ backgroundColor: "white", border: '1px solid black', height: 50, fontSize: 36, paddingLeft: 12 }}>{timeString}</div>
    <div style={{ backgroundColor: "white", border: '1px solid black', borderTop: "none", alignSelf: "flex-end", width: 80 }}>{dateString}</div>
  </div>
  )
}