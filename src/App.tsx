import React from 'react';
import './App.css';

const Dialog = [
  {
    speaker: "You",
    text: "I'm ... hungry... SO HUNGRY AHHH",
  },

  {
    speaker: "You",
    text: "I could really go for a ...",
  },

  {
    speaker: "You",
    text: "...",
  },

  {
    speaker: "You",
    text: "Chicken.",
  },
]

const App = () => {
  const [dialog, setDialog] = React.useState(Dialog);

  return (
    <div style={{
      padding: '8px',
    }}>
      <h1>Game</h1>

      <div style={{
        display: 'flex',
      }}>
        <div style={{ flex: '1 0 0' }}>
          lele
        </div>
        <div style={{ flex: '0 0 300px' }}>
          {
            dialog[0].text
          }
        </div>
      </div>
    </div>
  );
}

// hehehehehehehe
// HEHE

// You may not like it, but this is what peak productivity looks like
// so i dont really know what to do lol
// wait
// ok im waiting

//h 1</div>^^^^^^^^^
// :)))))))))))))))))))))
// good work
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
// :) :) :) :) :) :) :)
export default App;
