import React, { useState } from 'react';


const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; 

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    const x = index % 3 + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMesaj() {
    const { x, y } = getXY();
    return `Koordinatlar (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function sonrakiIndex(yon) {
    let newIndex;
  
    if (yon === 'sol') {
      newIndex = index % 3 === 0 ? index : index - 1;
      if (index === newIndex) {
        setMessage("You can't go left.");
        return index; 
      }
    } else if (yon === 'yukarı') {
      newIndex = index - 3 < 0 ? index : index - 3;
      if (index === newIndex) {
        setMessage("You can't go up.");
        return index; 
      }
    } else if (yon === 'sağ') {
      newIndex = index % 3 === 2 ? index : index + 1;
      if (index === newIndex) {
        setMessage("You can't go right.");
        return index; 
      }
    } else if (yon === 'aşağı') {
      newIndex = index + 3 > 8 ? index : index + 3;
      if (index === newIndex) {
        setMessage("You can't go down.");
        return index; 
      }
    } else {
      newIndex = index;
    }
  
    return newIndex;
  }

  function isValidCoordinate(coord) {
    return coord >= 1 && coord <= 3;
  }

  function isValidSteps(steps) {
    return steps >= 0;
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  async function onSubmit(evt) {
    evt.preventDefault();

    if (!email || !emailRegex.test(email)) {
      setMessage('Geçerli bir e-posta girin.');
      return;
    }

    if (
      !isValidCoordinate(index % 3 + 1) ||
      !isValidCoordinate(Math.floor(index / 3) + 1) ||
      !isValidSteps(steps)
    ) {
      setMessage('Geçerli bilgileri girin.');
      return;
    }

    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          x: index % 3 + 1,
          y: Math.floor(index / 3) + 1,
          steps,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Sunucu hatası: ' + response.status);
      }

      const result = await response.json();
      setMessage('Form başarıyla gönderildi.');
    } catch (error) {
      setMessage('Form gönderilirken bir hata oluştu.');
    }
  }

  function ilerle(evt) {
    const newDirection = evt.target.id;
    const newIndex = sonrakiIndex(newDirection);
  
    if (index !== newIndex) {
      setIndex((prevIndex) => newIndex);
      setSteps((prevSteps) => prevSteps + 1);
      setMessage('');
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{`${steps} kere ilerlediniz`}</h3>
      </div>
      <div id="grid">
        {Array.from({ length: 9 }, (_, idx) => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="sol" onClick={ilerle}>
          SOL
        </button>
        <button id="yukarı" onClick={ilerle}>
          YUKARI
        </button>
        <button id="sağ" onClick={ilerle}>
          SAĞ
        </button>
        <button id="aşağı" onClick={ilerle}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="Email girin" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
