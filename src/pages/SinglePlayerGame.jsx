import React, { useRef, useState } from "react";
import { checkGuess } from "../utils/feedbackLogic";

function getRandomCode() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, "0");
}

const SinglePlayerGame = ({ playerInfo }) => {
  const [secret] = useState(getRandomCode());
  const [inputDigits, setInputDigits] = useState(["", "", "", ""]);
  const [history, setHistory] = useState([]);
  const [won, setWon] = useState(false);

  const inputRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);

  const handleInputChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...inputDigits];
    newDigits[index] = value;
    setInputDigits(newDigits);

    if (value && index < 3) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && inputDigits[index] === "" && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handleGuess = () => {
    const guess = inputDigits.join("");
    if (guess.length !== 4) {
      alert("Enter a 4-digit number.");
      return;
    }

    const result = checkGuess(secret, guess);
    const entry = { guess, result };
    setHistory([...history, entry]);
    setInputDigits(["", "", "", ""]);
    inputRefs.current[0].current.focus();

    if (result.every((r) => r === "correct")) {
      setWon(true);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <div
        style={{
          padding: 20,
          maxWidth: 500,
          width: "100%",
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Single Player Mode</h2>
  
        {won ? (
          <h3>🎉 You guessed it! The number was <strong>{secret}</strong></h3>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginBottom: 20,
              }}
            >
              {inputDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs.current[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button onClick={handleGuess}>Guess</button>
            </div>
          </>
        )}
  
        <ul style={{ listStyle: "none", padding: 0, marginTop: 30 }}>
          {history.map((entry, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                justifyContent: "center",
              }}
            >
              {entry.guess.split("").map((digit, i) => (
                <div
                  key={i}
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    backgroundColor:
                      entry.result[i] === "correct"
                        ? "#6aaa64"
                        : entry.result[i] === "present"
                        ? "#c9b458"
                        : "#787c7e",
                    color: "white",
                  }}
                >
                  {digit}
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  
};

export default SinglePlayerGame;
