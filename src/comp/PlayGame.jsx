import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PlayGame.css"; // Pastikan file CSS sudah disertakan

export default function PlayGame() {
  const Data = useLocation();
  const navigate = useNavigate();


  // mengambil data ketika sudah mengisi di halaman welcome
  const Username = Data?.state?.Username || "Guest";
  const Weapon = Data?.state?.Weapon || "weapon1";
  const Target = Data?.state?.Target || "target1";
  const Level = Data?.state?.Level || "Easy";

  const targetRef = useRef(null);

  const getInitialTime = () => {
    if (Level === "Easy") return 30;
    if (Level === "Medium") return 20;
    if (Level === "Hard") return 15;
    return 0;
  };

  const [time, setTime] = useState(getInitialTime());
  const [shotEffects, setShotEffects] = useState([]);
  const [lastScore, setLastScore] = useState(null);
  const [gameState, setGameState] = useState({
    score: 0,
    username: Username,
    showGameOver: false,
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [showTarget, setShowTarget] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ top: "50%", left: "50%" });

  const timerRef = useRef(null);

  useEffect(() => {
    const gameOverFlag = localStorage.getItem("gameOver");
    const savedScore = localStorage.getItem("lastScore");

    if (gameOverFlag === "true" && savedScore) {
      setGameState((prev) => ({ ...prev, showGameOver: true }));
      setLastScore(parseInt(savedScore));
    }
  }, []);

  //untuk menyimpan data hasil permain sebelumnya yang akan tampil di leaderboard
  useEffect(() => {
    if (gameState.showGameOver) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);

          if (!localStorage.getItem("gameOver")) {
            localStorage.setItem("gameOver", "true");
            localStorage.setItem("lastScore", gameState.score);

            //data-data yang akan disimpan ada username, score, dan waktu permainan
            const newEntry = {
              username: Username,
              score: gameState.score,
              createdAt: new Date().toISOString(),
            };

            const oldLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
            const updatedLeaderboard = [...oldLeaderboard, newEntry];
            localStorage.setItem("leaderboard", JSON.stringify(updatedLeaderboard));

            setLeaderboard(updatedLeaderboard);
            setLastScore(gameState.score);
            setGameState((prev) => ({ ...prev, showGameOver: true }));
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState.showGameOver, gameState.score, Username]);

  //untuk menampilkan target secara random dengan waktu 3 detik (3000)
  useEffect(() => {
    if (gameState.showGameOver) return;

    const spawnInterval = setInterval(() => {
      const randomTop = Math.random() * 70 + 10;
      const randomLeft = Math.random() * 70 + 10;

      setTargetPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
      setShowTarget(true);

      setTimeout(() => {
        setShowTarget(false);
      }, 2000);
    }, 3000);

    return () => clearInterval(spawnInterval);
  }, [gameState.showGameOver]);

  // ini untuk menentukan point ketepatan dalam membidik target
  const getScoreByPrecision = (clickX, clickY) => {
    const target = targetRef.current;
    if (!target) return 0;

    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clickX - centerX;
    const dy = clickY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // ini untuk penentuan nilai point nya
    if (distance <= 20) return 10;
    if (distance <= 40) return 9;
    if (distance <= 60) return 8;
    if (distance <= 80) return 7;
    if (distance <= 100) return 6;
    if (distance <= 120) return 5;
    if (distance <= 140) return 4;
    if (distance <= 160) return 3;
    if (distance <= 180) return 2;
    if (distance <= 200) return 1;
    return 0;
  };

  // ini untuk efek suara
  const handleShoot = (e) => {
    if (gameState.showGameOver) return;

    const sound = document.getElementById("shoot-sound");
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }

    const clickX = e.clientX;
    const clickY = e.clientY;

    const scoreToAdd = getScoreByPrecision(clickX, clickY);

    // berdasarkan titik dari sumbu x dan y
    const newEffect = {
      id: Date.now(),
      x: clickX,
      y: clickY,
    };

    setShotEffects((prev) => [...prev, newEffect]);

    setTimeout(() => {
      setShotEffects((prev) => prev.filter((fx) => fx.id !== newEffect.id));
    }, 300);

    setGameState((prev) => ({
      ...prev,
      score: prev.score + scoreToAdd,
    }));
  };

  const handleBackToHome = () => {
    localStorage.removeItem("gameOver");
    localStorage.removeItem("lastScore");
    navigate("/");
  };

  function handlePlayAgain() {
    // Hapus status game over dan skor terakhir dari localStorage
    localStorage.removeItem("gameOver");
    localStorage.removeItem("lastScore");
  
    // Reset state permainan
    setGameState({
      score: 0,
      username: Username,
      showGameOver: false,
    });
  
    setTime(getInitialTime());
    setShotEffects([]);
    setLastScore(null);
    setShowTarget(false);
  }  

  // menampilkan data ke leaderboard sengan format json
  useEffect(() => {
    const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    if (storedLeaderboard) {
      setLeaderboard(storedLeaderboard);
    }
  }, []);

  return (
    
    <div className="content-game">
      <div className="game-screen">
        <div className="status-game">
          <ul>
            <li><p className="status-name">{Username}</p></li>
            <li><p className="status-score">Score: {gameState.score}</p></li>
            <li><p className="status-time">Time: {time}</p></li>
          </ul>
        </div>

        {!gameState.showGameOver ? (
          <div className="main-game" onClick={handleShoot}>
            <img className="background" src="/asset/background.jpg" alt="background" />
            <div className="mechanism-game">
              <img className="mechanism-weapon" src={`/asset/${Weapon}.png`} alt="Weapon" />

              {/* ini untuk animasi menampilkan target */}
              {showTarget && (
                <img
                  ref={targetRef}
                  className="mechanism-target"
                  src={`/asset/${Target}.png`}
                  alt="Target"
                  style={{ top: targetPosition.top, left: targetPosition.left }}
                />
              )}

              {shotEffects.map((fx) => (
                <img
                  key={fx.id}
                  src="/asset/weaponeffect.png"
                  className="shoot-effect"
                  style={{
                    left: fx.x - 50 + "px",
                    top: fx.y - 50 + "px",
                  }}
                  alt="Effect"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="game-over-screen">
            <h1>Game Over</h1>
            <p>Your Score: {lastScore !== null ? lastScore : gameState.score}</p>
            <button onClick={handleBackToHome} className="btn-back-to-home">Back to Home</button>
            <button onClick={handlePlayAgain} className="btn-play-again">Play Again</button>
          </div>
        )}
      </div>

      <div className="leaderboard-screen">
        <div className="status-leaderboard">
          
          <ul className="ul-leader">
            <li><center><h2>Leaderboard</h2></center></li>
            {[...leaderboard]
              .sort((a, b) => {
                if (b.score === a.score) {
                  return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return b.score - a.score;
              })
              .slice(0, 10)
              .map((entry, index) => (
                <li key={index}>
                  <span className="rank">#{index + 1}</span>
                  <span className="username">{entry.username}</span>
                  <span className="score">{entry.score}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <audio id="shoot-sound" src="/asset/weaponsound.mp3" preload="auto" />
    </div>
  );
}
