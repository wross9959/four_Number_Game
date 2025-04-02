import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase/db";
import { ref, onValue, set, update, remove } from "firebase/database";
import { checkGuess } from "../utils/feedbackLogic";
import Confetti from "react-confetti";
import LoserRain from "../components/LoserRain";

const Game = ({ playerInfo }) => {
  const { roomCode, playerId, username } = playerInfo;
  const [roomData, setRoomData] = useState(null);
  const [secretDigits, setSecretDigits] = useState(["", "", "", ""]);
  const [inputDigits, setInputDigits] = useState(["", "", "", ""]);
  const inputRefs = useRef([...Array(4)].map(() => React.createRef()));
  const secretRefs = useRef([...Array(4)].map(() => React.createRef()));
  const [guessHistory, setGuessHistory] = useState([]);
  const [opponentHistory, setOpponentHistory] = useState([]);

  const opponentId = playerId === "player1" ? "player2" : "player1";
  const gameWon = roomData?.winner !== undefined && roomData?.winner !== null;
  const isWinner = roomData?.winner === username;
  const isLoser = gameWon && roomData?.winner !== username;
  const mySecret = roomData?.players?.[playerId]?.secret;

  useEffect(() => {
    const roomRef = ref(db, `rooms/${roomCode}`);
    return onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRoomData(data);
      }
    });
  }, [roomCode]);

  useEffect(() => {
    const guessRef = ref(db, `rooms/${roomCode}/players/${playerId}/guesses`);
    return onValue(guessRef, (snapshot) => {
      const guesses = snapshot.val() || {};
      const sorted = Object.values(guesses).sort((a, b) => a.timestamp - b.timestamp);
      setGuessHistory(sorted);
    });
  }, [roomCode, playerId]);

  useEffect(() => {
    const guessRef = ref(db, `rooms/${roomCode}/players/${opponentId}/guesses`);
    return onValue(guessRef, (snapshot) => {
      const guesses = snapshot.val() || {};
      const sorted = Object.values(guesses).sort((a, b) => a.timestamp - b.timestamp);
      setOpponentHistory(sorted);
    });
  }, [roomCode, opponentId]);

  const isMyTurn = roomData?.turn === playerId;

  const scrollIntoView = (e) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handleSetSecret = async () => {
    const fullSecret = secretDigits.join("");
    if (fullSecret.length !== 4) return alert("Enter 4-digit secret");
    const playerRef = ref(db, `rooms/${roomCode}/players/${playerId}`);
    await update(playerRef, { secret: fullSecret });
    const bothReady = roomData?.players?.[opponentId]?.secret;
    if (bothReady && !roomData.turn) {
      await update(ref(db, `rooms/${roomCode}`), { turn: "player1" });
    }
  };

  const handleGuess = async () => {
    if (!isMyTurn) return;
    const guess = inputDigits.join("");
    if (guess.length !== 4) return alert("Enter full guess");
    const opponentSecret = roomData?.players?.[opponentId]?.secret;
    if (!opponentSecret) return alert("Opponent hasn't set a secret yet");
    const result = checkGuess(opponentSecret, guess);
    const newGuess = { guess, result, timestamp: Date.now() };
    const guessPath = `rooms/${roomCode}/players/${playerId}/guesses/${Date.now()}`;
    await set(ref(db, guessPath), newGuess);
    setInputDigits(["", "", "", ""]);
    inputRefs.current[0].current.focus();
    if (result.every((r) => r === "correct")) {
      await update(ref(db, `rooms/${roomCode}`), { winner: username });
    } else {
      await update(ref(db, `rooms/${roomCode}`), { turn: opponentId });
    }
  };

  const handleRematch = async () => {
    await update(ref(db, `rooms/${roomCode}`), { winner: null, turn: "player1" });
    await remove(ref(db, `rooms/${roomCode}/players/player1/guesses`));
    await remove(ref(db, `rooms/${roomCode}/players/player2/guesses`));
    await update(ref(db, `rooms/${roomCode}/players/player1`), { secret: null });
    await update(ref(db, `rooms/${roomCode}/players/player2`), { secret: null });
    setSecretDigits(["", "", "", ""]);
    setInputDigits(["", "", "", ""]);
  };

  const renderGuessRow = (entry) => (
    <li
      key={entry.timestamp}
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "8px",
        justifyContent: "center",
        flexWrap: "wrap"
      }}
    >
      {entry.guess.split("").map((digit, i) => (
        <div
          key={i}
          style={{
            width: "44px",
            height: "44px",
            fontSize: "1.3rem",
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
  );

  return (
    <div
      style={{
        padding: 10,
        paddingTop: 60,
        minHeight: "100dvh",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {isWinner && <Confetti />} 
      {isLoser && <LoserRain />} 

      <div
        style={{
          padding: 15,
          maxWidth: 460,
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Room: {roomCode}</h2>
        <p style={{ textAlign: "center", fontWeight: "bold", color: "#444", fontSize: "0.95rem" }}>
          You are: <span style={{ color: "#646cff" }}>{username}</span><br />
          Your number: {mySecret || "???"}
        </p>

        {!mySecret ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
              {secretDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={secretRefs.current[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onFocus={scrollIntoView}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, "");
                    const newDigits = [...secretDigits];
                    newDigits[index] = val;
                    setSecretDigits(newDigits);
                    if (val && index < 3) secretRefs.current[index + 1].current.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !secretDigits[index] && index > 0) {
                      secretRefs.current[index - 1].current.focus();
                    }
                  }}
                  style={{
                    width: "44px",
                    height: "44px",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: "8px",
                    border: "2px solid #ccc",
                  }}
                />
              ))}
            </div>
            <button onClick={handleSetSecret} style={{ marginTop: 10, display: "block", marginLeft: "auto", marginRight: "auto" }}>
              Set Secret Number
            </button>
          </>
        ) : gameWon ? (
          <>
            <h3 style={{ textAlign: "center" }}>🎉 {roomData.winner} guessed correctly!</h3>
            <button onClick={handleRematch} style={{ display: "block", margin: "0 auto" }}>
              Play Again
            </button>
          </>
        ) : (
          <>
            <h4 style={{ textAlign: "center" }}>{isMyTurn ? "Your Turn" : "Opponent's Turn"}</h4>
            <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
              {inputDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs.current[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  disabled={!isMyTurn}
                  value={digit}
                  onFocus={scrollIntoView}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, "");
                    const newDigits = [...inputDigits];
                    newDigits[index] = val;
                    setInputDigits(newDigits);
                    if (val && index < 3) inputRefs.current[index + 1].current.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !inputDigits[index] && index > 0) {
                      inputRefs.current[index - 1].current.focus();
                    }
                  }}
                  style={{
                    width: "44px",
                    height: "44px",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: "8px",
                    border: "2px solid #ccc",
                    opacity: isMyTurn ? 1 : 0.4,
                  }}
                />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <button onClick={handleGuess} disabled={!isMyTurn}>Guess</button>
            </div>
          </>
        )}

        <h4 style={{ marginTop: 30 }}>Your Guesses</h4>
        <ul style={{ listStyle: "none", padding: 0 }}>{guessHistory.map(renderGuessRow)}</ul>

        <h4>Opponent's Guesses</h4>
        <ul style={{ listStyle: "none", padding: 0 }}>{opponentHistory.map(renderGuessRow)}</ul>
      </div>
    </div>
  );
};

export default Game;
