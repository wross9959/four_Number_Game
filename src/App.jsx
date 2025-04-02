import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import SinglePlayerGame from './pages/SinglePlayerGame';
import TopBar from "./components/TopBar"; 
function App() {

  const [playerInfo, setPlayerInfo] = useState(null);

  const handleEnterGame = (roomCode, playerId, username) => {
    setPlayerInfo({ roomCode, playerId, username });
  };

  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home onEnterGame={handleEnterGame} />} />
        <Route path="/game" element={ playerInfo?.roomCode === "SINGLE" ?
          <SinglePlayerGame playerInfo={playerInfo} /> :
          <Game playerInfo={playerInfo} />
          } />
       </Routes>
    </Router>
  );
};

export default App;
