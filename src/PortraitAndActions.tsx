import React from 'react';
import Portrait from './portrait.png';



export const PortraitAndActions = () => {
  const [openMenu, setOpenMenu] = React.useState<number | null>(null);
  const [actions, setActions] = React.useState([
    { text: "talk", options: ["NPC 1", "NPC 2"] },
    { text: "explore", options: ["room 1", "room 2", "room 3"] },
    { text: "something else lol", options: ["lalallala", "wee woo", "hshdgusidhgsdkjvjsnk", "hi uwu"] }
  ])

  const renderOptions = (index: number) => {

    return (<div >
      {actions[index].options.map((o) => {
        return <div style={{ border: "1px solid black", margin: 20, backgroundColor: "white" }}>{o}</div>
      })}
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
      border: '1px solid black'
    }} />

    <div style={{
      width: 40,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "white",
      alignSelf: "flex-end",
      height: 180,
      border: '1px solid black'
    }}>
      {actions.map((a, i) => <div onClick={() => { onClickMenuItem(i) }}>{a.text}</div>)}
    </div>
    {openMenu !== null ? renderOptions(openMenu) : <span></span>
    }
  </div >

  )
}