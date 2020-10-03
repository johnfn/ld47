import React from 'react';
import { useInterval } from './ use_interval';

const months: { [key: number]: string } = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December"
}

export const Clock = (props: {}) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const [currentDate, setCurrentDate] = React.useState(new Date(Date.parse('14 April 2012 10:10:14 PST')));
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

  return (<div style={{ width: 150 }}>
    <div style={{ backgroundColor: "white", border: '1px solid black', height: 50, fontSize: 36, paddingLeft: 12 }}>{timeString}</div>
    <div style={{ backgroundColor: "white", border: '1px solid black', alignSelf: "flex-end", width: 80 }}>{dateString}</div>
  </div>
  )
}