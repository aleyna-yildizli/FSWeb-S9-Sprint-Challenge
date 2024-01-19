import React, { useState } from 'react';
import axios from "axios";


const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; 


export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    const coordinates = [(index % 3) + 1, Math.floor(index / 3) + 1];
    return coordinates;
  }

  function getXYMesaj() {
    return `Koordinatlar (${getXY()[0]}, ${getXY()[1]})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function ilerle(evt) {
    const yon = evt.target.id;
    console.log("ilerle", yon);
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    switch (yon) {
      case "left":
        if (index % 3 === 0) {
          setMessage("You can't go left.");
        } else {
          sonrakiIndex(index - 1);
        }
        break;
      case "up":
        if (index < 3) {
          setMessage("You can't go up.");
        } else {
          sonrakiIndex(index - 3);
        }
        break;
      case "right":
        if (index % 3 === 2) {
          setMessage("You can't go right.");
        } else {
          sonrakiIndex(index + 1);
        }
        break;
      case "down":
        if (index > 5) {
          setMessage("You can't go down.");
        } else {
          sonrakiIndex(index + 3);
        }
        break;
      default:
        break;
    }
  }
  function sonrakiIndex(targetIndex) {
    setIndex(targetIndex);
    setSteps(steps + 1);
    setMessage(initialMessage);
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }


  function onSubmit(evt) {
    evt.preventDefault();


    axios
      .post("http://localhost:9000/api/result", {
        x: getXY()[0],
        y: getXY()[1],
        steps: steps,
        email: email,
      })
      .then(function (response) {
        console.log(response);
        setMessage(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
        setMessage(error.response.data.message);
      });

    setEmail(initialEmail);
    };

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{`${steps} kere ilerlediniz`}</h3>
      </div>
      <div id="grid">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>
          LEFT
        </button>
        <button id="up" onClick={ilerle}>
          UP
        </button>
        <button id="right" onClick={ilerle}>
          RIGHT
        </button>
        <button id="down" onClick={ilerle}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          RESET
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="Email girin" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
      };
