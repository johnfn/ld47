import React from 'react';
import ReactDOM from 'react-dom';
import App, { APP_HEIGHT, APP_WIDTH } from './App';
import './App.css';
import './fonts/FiraSans-Light.otf';

function play() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

document.addEventListener("DOMContentLoaded", () => {
  let ref;

  ReactDOM.render(
    <div
      ref={r => ref = r}
      style={{
        color: "white",
        width: APP_WIDTH,
        height: APP_HEIGHT,
        position: "absolute",
        left: 0,
        top: 0,
        textAlign: "center",
        backgroundColor: "black",
        fontSize: "80px",
        margin: '40px',
        // fontFamily: "FreePixel",
      }}
      onClick={() => {
        if (ref) ref.remove();

        play();
      }}
    ><div style={{ paddingTop: '200px' }}>Click to play.</div></div>,
    document.body.appendChild(document.createElement("div"))
  );
});
