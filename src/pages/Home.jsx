import React, { useState } from "react";
import { db } from "../firebase/db";
import { ref, set, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";

function generateRoomCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const Home = ({ onEnterGame }) => {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    if (!username) return alert("Please enter a username");
    const code = generateRoomCode();
    const roomRef = ref(db, `rooms/${code}`);
    await set(roomRef, {
      players: {
        player1: { username }
      },
      status: "waiting",
    });
    onEnterGame(code, "player1", username);
    navigate("/game");
  };

  const handleJoinGame = async () => {
    if (!username || !roomCode) return alert("Please enter a username and room code");
    const roomRef = ref(db, `rooms/${roomCode}`);
    const roomSnapshot = await get(roomRef);
    if (!roomSnapshot.exists()) return alert("Room does not exist");
    const data = roomSnapshot.val();
    if (data.players?.player2) return alert("Room is full");
    await update(roomRef, {
      "players/player2": { username },
      status: "ready"
    });
    onEnterGame(roomCode, "player2", username);
    navigate("/game");
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 420,
        margin: "100px auto",
        backgroundColor: "white",
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: 10 }}>Number Guessing Game</h1>

      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "12px",
          width: "100%",
          fontSize: "1rem",
          borderRadius: 6,
          border: "1px solid #ccc",
          textAlign: "center",
          fontWeight: "bold"
        }}
      />

      <button
        onClick={handleCreateGame}
        style={{ width: "100%", padding: "10px", fontSize: "1rem", borderRadius: 6 }}
      >
        Create Game
      </button>

      <hr style={{ width: "100%" }} />

      <input
        type="text"
        placeholder="Enter room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        style={{
          padding: "12px",
          width: "100%",
          fontSize: "1rem",
          borderRadius: 6,
          border: "1px solid #ccc",
          textAlign: "center",
          fontWeight: "bold"
        }}
      />

      <button
        onClick={handleJoinGame}
        style={{ width: "100%", padding: "10px", fontSize: "1rem", borderRadius: 6 }}
      >
        Join Game
      </button>

      <hr style={{ width: "100%" }} />

      <button
        style={{ width: "100%", padding: "10px", fontSize: "1rem", borderRadius: 6 }}
        onClick={() => {
          onEnterGame("SINGLE", "player1", username || "You");
          navigate("/game");
        }}
      >
        Play Solo
      </button>
    </div>
  );
};

export default Home;