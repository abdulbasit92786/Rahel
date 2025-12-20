
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameState, Snack, GameCommentary } from './types';
import { GRID_SIZE, INITIAL_SNAKE, TICK_RATE, SNACK_TYPES } from './constants';
import { getGameCommentary, getGameOverMessage } from './services/geminiService';

const App: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [food, setFood] = useState<Snack | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [score, setScore] = useState(0);
  const [commentary, setCommentary] = useState<GameCommentary>({ text: "Ready for a snack?", mood: "warm" });
  const [gameOverMsg, setGameOverMsg] = useState("");
  const [highScore, setHighScore] = useState(0);

  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef<Direction>(Direction.UP);

  const generateFood = useCallback((currentSnake: Point[]): Snack => {
    let newPos: Point;
    let isOccupied: boolean;
    do {
      newPos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newPos.x && segment.y === newPos.y);
    } while (isOccupied);

    // Get a random snack type definition from constants
    const snackType = SNACK_TYPES[Math.floor(Math.random() * SNACK_TYPES.length)];
    return {
      id: Math.random().toString(36).substr(2, 9),
      position: newPos,
      ...snackType
    };
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(Direction.UP);
    directionRef.current = Direction.UP;
    setScore(0);
    setGameState(GameState.PLAYING);
    setFood(generateFood(INITIAL_SNAKE));
    setCommentary({ text: "The hunt begins!", mood: "encouraging" });
    setGameOverMsg("");
  };

  const endGame = async () => {
    setGameState(GameState.GAMEOVER);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    const msg = await getGameOverMessage(score);
    setGameOverMsg(msg);
    if (score > highScore) setHighScore(score);
  };

  const moveSnake = useCallback(async () => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        endGame();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food consumption
      if (food && newHead.x === food.position.x && newHead.y === food.position.y) {
        const addedScore = food.points;
        const currentSnackType = food.type;
        setScore(s => {
            const newScore = s + addedScore;
            // Fetch AI commentary every 50 points or on first snacks
            if (newScore % 50 === 0 || s === 0) {
                 getGameCommentary(newScore, currentSnackType).then(setCommentary);
            }
            return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      gameLoopRef.current = window.setInterval(moveSnake, TICK_RATE);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [gameState, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== Direction.DOWN) setDirectionState(Direction.UP); break;
        case 'ArrowDown': if (directionRef.current !== Direction.UP) setDirectionState(Direction.DOWN); break;
        case 'ArrowLeft': if (directionRef.current !== Direction.RIGHT) setDirectionState(Direction.LEFT); break;
        case 'ArrowRight': if (directionRef.current !== Direction.LEFT) setDirectionState(Direction.RIGHT); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setDirectionState = (dir: Direction) => {
    setDirection(dir);
    directionRef.current = dir;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-orange-50 text-orange-950">
      {/* Header UI */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-orange-600 tracking-tight">SnackQuest</h1>
          <p className="text-sm font-medium text-orange-400">Warm Harvest Edition</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{score.toString().padStart(4, '0')}</div>
          <div className="text-xs uppercase tracking-widest text-orange-400">Score</div>
        </div>
      </div>

      {/* AI Commentary Box */}
      <div className="w-full max-w-md mb-4 bg-white/60 backdrop-blur-sm border border-orange-200 p-3 rounded-2xl shadow-sm min-h-[60px] flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-600">
            <i className={`fas ${gameState === GameState.GAMEOVER ? 'fa-ghost' : 'fa-sun'} animate-pulse`}></i>
         </div>
         <div>
            <p className="text-sm font-semibold text-orange-900 leading-tight italic">
              "{commentary.text}"
            </p>
            <p className="text-[10px] uppercase text-orange-400 font-bold mt-1 tracking-wider">
              {gameState === GameState.GAMEOVER ? 'Final Wisdom' : 'The Guardian Says'}
            </p>
         </div>
      </div>

      {/* Main Game Container */}
      <div className="relative p-2 bg-orange-100 rounded-3xl shadow-2xl border-4 border-orange-200 overflow-hidden">
        <div className="game-grid w-[320px] h-[320px] md:w-[400px] md:h-[400px] bg-orange-50/50 rounded-2xl">
          {/* Render Snake */}
          {snake.map((segment, i) => (
            <div
              key={i}
              className={`snake-segment rounded-sm ${i === 0 ? 'bg-orange-600 z-10 shadow-md' : 'bg-orange-400'} border border-orange-50/20`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            >
              {i === 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
                </div>
              )}
            </div>
          ))}

          {/* Render Food */}
          {food && (
            <div
              className={`food-pulse rounded-full shadow-lg ${food.color} border-2 border-white/30`}
              style={{
                gridColumnStart: food.position.x + 1,
                gridRowStart: food.position.y + 1,
              }}
            />
          )}
        </div>

        {/* Overlays */}
        {gameState === GameState.IDLE && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-orange-900/40 backdrop-blur-md rounded-2xl p-6 text-center">
            <i className="fas fa-apple-whole text-5xl text-orange-200 mb-4 animate-bounce"></i>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-orange-100 text-sm mb-6 max-w-[200px]">The harvest is warm and ready for a tiny, hungry snake.</p>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-full font-bold shadow-xl transition transform active:scale-95"
            >
              Start Quest
            </button>
          </div>
        )}

        {gameState === GameState.GAMEOVER && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-orange-950/80 backdrop-blur-md rounded-2xl p-6 text-center">
            <h2 className="text-3xl font-extrabold text-orange-200 mb-2">The Fire Fades</h2>
            <div className="bg-white/10 p-4 rounded-xl mb-4 border border-white/10 w-full">
              <p className="text-orange-50 font-medium italic mb-2">"{gameOverMsg || "The harvest ends..."}"</p>
              <div className="flex justify-around items-center border-t border-white/10 pt-2 mt-2">
                <div>
                  <div className="text-xs text-orange-300 font-bold uppercase">Points</div>
                  <div className="text-xl font-bold text-white">{score}</div>
                </div>
                <div>
                  <div className="text-xs text-orange-300 font-bold uppercase">Best</div>
                  <div className="text-xl font-bold text-white">{highScore}</div>
                </div>
              </div>
            </div>
            <button 
              onClick={startGame}
              className="px-10 py-3 bg-white text-orange-900 rounded-full font-bold shadow-xl transition transform hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-8 grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button 
          onPointerDown={() => directionRef.current !== Direction.DOWN && setDirectionState(Direction.UP)}
          className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center text-orange-700 active:bg-orange-400 active:text-white transition shadow-sm"
        >
          <i className="fas fa-chevron-up"></i>
        </button>
        <div />
        <button 
          onPointerDown={() => directionRef.current !== Direction.RIGHT && setDirectionState(Direction.LEFT)}
          className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center text-orange-700 active:bg-orange-400 active:text-white transition shadow-sm"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button 
          onPointerDown={() => directionRef.current !== Direction.UP && setDirectionState(Direction.DOWN)}
          className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center text-orange-700 active:bg-orange-400 active:text-white transition shadow-sm"
        >
          <i className="fas fa-chevron-down"></i>
        </button>
        <button 
          onPointerDown={() => directionRef.current !== Direction.LEFT && setDirectionState(Direction.RIGHT)}
          className="w-16 h-16 bg-orange-200 rounded-2xl flex items-center justify-center text-orange-700 active:bg-orange-400 active:text-white transition shadow-sm"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Desktop Hints */}
      <div className="hidden md:flex mt-8 gap-6 text-orange-400 text-xs font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-orange-200 rounded text-orange-700">ARROWS</span>
          <span>to move</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-orange-200 rounded text-orange-700">ESC</span>
          <span>to pause</span>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-auto py-6 text-orange-300 text-[10px] font-bold uppercase tracking-[0.2em]">
        Handcrafted for Cozy Evenings &copy; 2024
      </footer>
    </div>
  );
};

export default App;
