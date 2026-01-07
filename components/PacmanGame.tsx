'use client';

import { useEffect, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  x: number;
  y: number;
  direction: number;
  color: string;
  targetX: number;
  targetY: number;
  mode: 'chase' | 'scatter' | 'frightened' | 'eaten';
}

type Difficulty = 'easy' | 'medium' | 'hard';

// Responsive cell size based on screen width
const getCellSize = () => {
  if (typeof window === 'undefined') return 20;
  const width = window.innerWidth;
  if (width < 640) return 14; // Mobile
  if (width < 768) return 16; // Tablet
  return 20; // Desktop
};

const GRID_WIDTH = 19;
const GRID_HEIGHT = 19;

const WALL = 1;
const DOT = 2;
const POWER_PELLET = 3;
const EMPTY = 0;

const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,3,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,3,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1],
  [1,1,1,1,1,2,1,1,1,0,1,1,1,2,1,1,1,1,1],
  [0,0,0,0,1,2,1,0,0,0,0,0,1,2,1,0,0,0,0],
  [1,1,1,1,1,2,1,0,1,1,1,0,1,2,1,1,1,1,1],
  [0,0,0,0,0,2,0,0,1,0,1,0,0,2,0,0,0,0,0],
  [1,1,1,1,1,2,1,0,1,1,1,0,1,2,1,1,1,1,1],
  [0,0,0,0,1,2,1,0,0,0,0,0,1,2,1,0,0,0,0],
  [1,1,1,1,1,2,1,1,1,0,1,1,1,2,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1],
  [1,3,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,3,1],
  [1,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,1],
  [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const difficultySettings = {
  easy: {
    pacmanSpeed: 200,
    ghostSpeed: 250,
    powerModeDuration: 400,
    ghostIntelligence: 0.3,
  },
  medium: {
    pacmanSpeed: 150,
    ghostSpeed: 180,
    powerModeDuration: 300,
    ghostIntelligence: 0.6,
  },
  hard: {
    pacmanSpeed: 100,
    ghostSpeed: 120,
    powerModeDuration: 200,
    ghostIntelligence: 0.9,
  },
};

function PacmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [lives, setLives] = useState(3);
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  
  const pacmanRef = useRef<Position>({ x: 9, y: 14 });
  const directionRef = useRef<number>(0);
  const nextDirectionRef = useRef<number>(0);
  const mouthOpenRef = useRef<boolean>(true);
  const mouthAnimationRef = useRef<number>(0);
  const powerModeRef = useRef<number>(0);
  const dotsRef = useRef<number[][]>(maze.map(row => [...row]));
  const pelletFlashRef = useRef<number>(0);
  
  const ghostsRef = useRef<Ghost[]>([
    { x: 9, y: 8, direction: 0, color: '#FF0000', targetX: 9, targetY: 14, mode: 'chase' },
    { x: 9, y: 9, direction: 1, color: '#FFB8FF', targetX: 9, targetY: 14, mode: 'chase' },
    { x: 8, y: 9, direction: 2, color: '#00FFFF', targetX: 9, targetY: 14, mode: 'chase' },
    { x: 10, y: 9, direction: 0, color: '#FFB851', targetX: 9, targetY: 14, mode: 'chase' },
  ]);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setLives(3);
    setShowDifficultySelect(true);
    pacmanRef.current = { x: 9, y: 14 };
    directionRef.current = 0;
    nextDirectionRef.current = 0;
    powerModeRef.current = 0;
    dotsRef.current = maze.map(row => [...row]);
    ghostsRef.current = [
      { x: 9, y: 8, direction: 0, color: '#FF0000', targetX: 9, targetY: 14, mode: 'chase' },
      { x: 9, y: 9, direction: 1, color: '#FFB8FF', targetX: 9, targetY: 14, mode: 'chase' },
      { x: 8, y: 9, direction: 2, color: '#00FFFF', targetX: 9, targetY: 14, mode: 'chase' },
      { x: 10, y: 9, direction: 0, color: '#FFB851', targetX: 9, targetY: 14, mode: 'chase' },
    ];
  };

  const startGame = () => {
    setShowDifficultySelect(false);
    setGameStarted(true);
  };

  useEffect(() => {
    if (!canvasRef.current || !gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const settings = difficultySettings[difficulty];
    const cellSize = getCellSize();
    let animationFrameId: number;
    let lastTime = 0;
    let lastPacmanMove = 0;
    let lastGhostMove = 0;
    let lastMouthAnim = 0;
    
    // Set canvas size responsively
    const updateCanvasSize = () => {
      const size = getCellSize();
      canvas.width = GRID_WIDTH * size;
      canvas.height = GRID_HEIGHT * size;
    };
    updateCanvasSize();
    
    // Update on resize
    const handleResize = () => {
      updateCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    const drawMaze = () => {
      // Dark blue background
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          const cell = dotsRef.current[y][x];
          const screenX = x * cellSize;
          const screenY = y * cellSize;

          if (cell === WALL) {
            // More realistic wall with gradient
            const gradient = ctx.createLinearGradient(screenX, screenY, screenX + cellSize, screenY + cellSize);
            gradient.addColorStop(0, '#2121DE');
            gradient.addColorStop(0.5, '#1A1AB8');
            gradient.addColorStop(1, '#2121DE');
            ctx.fillStyle = gradient;
            ctx.fillRect(screenX, screenY, cellSize, cellSize);
            
            // Wall border
            ctx.strokeStyle = '#0000AA';
            ctx.lineWidth = 1;
            ctx.strokeRect(screenX, screenY, cellSize, cellSize);
          } else if (cell === DOT) {
            // Glowing dot
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#FFF';
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(screenX + cellSize / 2, screenY + cellSize / 2, Math.max(1.5, cellSize * 0.125), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else if (cell === POWER_PELLET) {
            // Animated power pellet
            pelletFlashRef.current += 0.1;
            const alpha = 0.7 + Math.sin(pelletFlashRef.current) * 0.3;
            ctx.globalAlpha = alpha;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#FFF';
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(screenX + cellSize / 2, screenY + cellSize / 2, Math.max(4, cellSize * 0.3), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          }
        }
      }
    };

    const drawPacman = () => {
      const pacman = pacmanRef.current;
      const x = pacman.x * cellSize + cellSize / 2;
      const y = pacman.y * cellSize + cellSize / 2;
      const radius = cellSize / 2 - 2;

      // Mouth animation
      lastMouthAnim += 0.2;
      mouthAnimationRef.current = Math.sin(lastMouthAnim) * 0.3 + 0.3;
      mouthOpenRef.current = mouthAnimationRef.current > 0.4;

      ctx.fillStyle = '#FFFF00';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#FFFF00';
      ctx.beginPath();

      if (mouthOpenRef.current) {
        const angle = (directionRef.current * Math.PI) / 2;
        const mouthAngle = mouthAnimationRef.current;
        ctx.arc(x, y, radius, angle + mouthAngle, angle + Math.PI * 2 - mouthAngle);
        ctx.lineTo(x, y);
      } else {
        ctx.arc(x, y, radius, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      const eyeOffset = directionRef.current === 0 ? 3 : directionRef.current === 2 ? -3 : 0;
      const eyeYOffset = directionRef.current === 1 ? 3 : directionRef.current === 3 ? -3 : -3;
      ctx.arc(x + eyeOffset, y + eyeYOffset, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawGhosts = () => {
      ghostsRef.current.forEach((ghost, idx) => {
        const x = ghost.x * cellSize + cellSize / 2;
        const y = ghost.y * cellSize + cellSize / 2;
        const size = cellSize / 2 - 2;

        let fillColor = ghost.color;
        if (ghost.mode === 'frightened') {
          fillColor = powerModeRef.current > 50 ? '#2121DE' : '#FFFFFF';
        } else if (ghost.mode === 'eaten') {
          fillColor = '#000';
        }

        // Ghost body with wavy bottom
        ctx.fillStyle = fillColor;
        ctx.shadowBlur = 3;
        ctx.shadowColor = fillColor;
        ctx.beginPath();
        ctx.arc(x, y - size / 2, size, 0, Math.PI);
        
        // Wavy bottom
        const waveOffset = Date.now() * 0.005;
        ctx.moveTo(x - size, y - size / 2);
        for (let i = 0; i <= 4; i++) {
          const waveX = x - size + (i * size * 2) / 4;
          const waveY = y + Math.sin(waveOffset + i) * 2;
          ctx.lineTo(waveX, waveY);
        }
        ctx.lineTo(x + size, y - size / 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (ghost.mode !== 'eaten') {
          // Eyes
          ctx.fillStyle = '#FFF';
          ctx.beginPath();
          ctx.arc(x - size / 3, y - size / 2, size / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + size / 3, y - size / 2, size / 4, 0, Math.PI * 2);
          ctx.fill();

          // Pupils
          ctx.fillStyle = '#000';
          const pupilOffset = ghost.direction === 0 ? 1 : ghost.direction === 2 ? -1 : 0;
          const pupilYOffset = ghost.direction === 1 ? 1 : ghost.direction === 3 ? -1 : 0;
          ctx.beginPath();
          ctx.arc(x - size / 3 + pupilOffset, y - size / 2 + pupilYOffset, size / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + size / 3 + pupilOffset, y - size / 2 + pupilYOffset, size / 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    const canMove = (x: number, y: number): boolean => {
      if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
      return dotsRef.current[y][x] !== WALL;
    };

    const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    const movePacman = (currentTime: number) => {
      if (currentTime - lastPacmanMove < settings.pacmanSpeed) return;
      lastPacmanMove = currentTime;

      const pacman = pacmanRef.current;
      const directions = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
      ];

      const nextDir = nextDirectionRef.current;
      const nextMove = directions[nextDir];
      if (canMove(pacman.x + nextMove.x, pacman.y + nextMove.y)) {
        directionRef.current = nextDir;
      }

      const dir = directions[directionRef.current];
      if (canMove(pacman.x + dir.x, pacman.y + dir.y)) {
        pacman.x += dir.x;
        pacman.y += dir.y;

        if (pacman.x < 0) pacman.x = GRID_WIDTH - 1;
        if (pacman.x >= GRID_WIDTH) pacman.x = 0;

        const cell = dotsRef.current[pacman.y][pacman.x];
        if (cell === DOT) {
          dotsRef.current[pacman.y][pacman.x] = EMPTY;
          setScore((s) => s + 10);
        } else if (cell === POWER_PELLET) {
          dotsRef.current[pacman.y][pacman.x] = EMPTY;
          setScore((s) => s + 50);
          powerModeRef.current = settings.powerModeDuration;
          ghostsRef.current.forEach(g => {
            if (g.mode !== 'eaten') g.mode = 'frightened';
          });
        }
      }
    };

    const moveGhosts = (currentTime: number) => {
      if (currentTime - lastGhostMove < settings.ghostSpeed) return;
      lastGhostMove = currentTime;

      const pacman = pacmanRef.current;
      const directions = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
      ];

      ghostsRef.current.forEach((ghost, idx) => {
        if (ghost.mode === 'eaten') {
          // Return to center
          if (ghost.x === 9 && ghost.y === 8) {
            ghost.mode = 'chase';
          } else {
            const dx = ghost.x < 9 ? 1 : ghost.x > 9 ? -1 : 0;
            const dy = ghost.y < 8 ? 1 : ghost.y > 8 ? -1 : 0;
            if (canMove(ghost.x + dx, ghost.y)) ghost.x += dx;
            if (canMove(ghost.x, ghost.y + dy)) ghost.y += dy;
          }
          return;
        }

        const possibleMoves = directions
          .map((dir, i) => ({ ...dir, idx: i }))
          .filter((dir) => canMove(ghost.x + dir.x, ghost.y + dir.y))
          .filter((dir) => dir.idx !== (ghost.direction + 2) % 4); // Don't reverse

        if (possibleMoves.length === 0) return;

        let chosenMove;
        if (ghost.mode === 'frightened') {
          // Random movement when frightened
          chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else {
          // Intelligent targeting based on difficulty
          if (Math.random() < settings.ghostIntelligence) {
            // Target pacman
            const distances = possibleMoves.map(move => ({
              move,
              dist: getDistance(
                pacman.x,
                pacman.y,
                ghost.x + move.x,
                ghost.y + move.y
              ),
            }));
            distances.sort((a, b) => a.dist - b.dist);
            chosenMove = distances[0].move;
          } else {
            // Random movement
            chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          }
        }

        ghost.x += chosenMove.x;
        ghost.y += chosenMove.y;
        ghost.direction = chosenMove.idx;

        if (ghost.x < 0) ghost.x = GRID_WIDTH - 1;
        if (ghost.x >= GRID_WIDTH) ghost.x = 0;
      });
    };

    const checkCollisions = () => {
      const pacman = pacmanRef.current;
      for (const ghost of ghostsRef.current) {
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
          if (ghost.mode === 'frightened') {
            ghost.mode = 'eaten';
            setScore((s) => s + 200);
          } else if (ghost.mode !== 'eaten') {
            setLives((l) => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameOver(true);
              } else {
                // Reset positions
                pacmanRef.current = { x: 9, y: 14 };
                ghostsRef.current.forEach(g => {
                  g.x = [9, 9, 8, 10][ghostsRef.current.indexOf(g)];
                  g.y = [8, 9, 9, 9][ghostsRef.current.indexOf(g)];
                  g.mode = 'chase';
                });
                powerModeRef.current = 0;
              }
              return newLives;
            });
          }
        }
      }
    };

    const gameLoop = (currentTime: number) => {
      movePacman(currentTime);
      moveGhosts(currentTime);
      checkCollisions();
      
      if (powerModeRef.current > 0) {
        powerModeRef.current--;
        if (powerModeRef.current === 0) {
          ghostsRef.current.forEach(g => {
            if (g.mode === 'frightened') g.mode = 'chase';
          });
        }
      }

      drawMaze();
      drawPacman();
      drawGhosts();

      // Check win condition
      const totalDots = dotsRef.current.flat().filter(cell => cell === DOT || cell === POWER_PELLET).length;
      if (totalDots === 0) {
        setGameOver(true);
        setScore((s) => s + 1000);
      }

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, difficulty]);

  const handleTouchStart = (direction: number) => {
    if (!gameStarted || showDifficultySelect) return;
    nextDirectionRef.current = direction;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || showDifficultySelect) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
          nextDirectionRef.current = 0;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          nextDirectionRef.current = 1;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          nextDirectionRef.current = 2;
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          nextDirectionRef.current = 3;
          break;
        case ' ':
          if (!gameStarted) {
            startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, showDifficultySelect]);

  if (showDifficultySelect) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 md:gap-6 p-3 md:p-4">
        <h3 className="text-xl md:text-2xl font-bold text-black mb-2 md:mb-4">Select Difficulty</h3>
        <div className="flex flex-col gap-3 md:gap-4 w-full max-w-xs">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setDifficulty(diff);
                startGame();
              }}
              className={`px-4 md:px-6 py-3 md:py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 text-sm md:text-base ${
                diff === 'easy'
                  ? 'bg-green-500 hover:bg-green-600'
                  : diff === 'medium'
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
        <div className="text-xs md:text-sm text-black/70 text-center mt-2 md:mt-4 px-2">
          <p>Easy: Slower ghosts, longer power mode</p>
          <p>Medium: Balanced gameplay</p>
          <p>Hard: Fast ghosts, shorter power mode</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
      <div className="flex flex-wrap items-center justify-between w-full px-2 gap-2">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <div className="text-xs md:text-sm font-bold text-black">Score: {score}</div>
          <div className="text-xs md:text-sm font-bold text-black">Lives: {lives}</div>
          <div className="text-[10px] md:text-xs text-black/70">Difficulty: {difficulty}</div>
        </div>
        {gameOver && (
          <button
            onClick={resetGame}
            className="px-2 md:px-3 py-1 text-[10px] md:text-xs bg-black text-white rounded hover:bg-gray-800"
          >
            Restart
          </button>
        )}
      </div>
      <div className="w-full flex justify-center">
        <canvas
          ref={canvasRef}
          width={GRID_WIDTH * getCellSize()}
          height={GRID_HEIGHT * getCellSize()}
          className="border-2 border-black rounded shadow-lg"
          style={{ 
            imageRendering: 'pixelated',
            maxWidth: '100%',
            height: 'auto',
            touchAction: 'none'
          }}
        />
      </div>
      {!gameStarted && (
        <div className="text-center px-2">
          <p className="text-xs md:text-sm text-black mb-1">Press SPACE to start</p>
          <p className="text-[10px] md:text-xs text-black/70">Use arrow keys, WASD, or touch controls</p>
        </div>
      )}
      
      {/* Mobile Touch Controls */}
      {gameStarted && (
        <div className="md:hidden mt-2 grid grid-cols-3 gap-2 max-w-[180px]">
          <div></div>
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouchStart(3);
            }}
            onTouchEnd={(e) => e.preventDefault()}
            className="bg-black/30 active:bg-black/50 rounded-lg p-3 text-white font-bold text-lg touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            ↑
          </button>
          <div></div>
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouchStart(2);
            }}
            onTouchEnd={(e) => e.preventDefault()}
            className="bg-black/30 active:bg-black/50 rounded-lg p-3 text-white font-bold text-lg touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            ←
          </button>
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouchStart(1);
            }}
            onTouchEnd={(e) => e.preventDefault()}
            className="bg-black/30 active:bg-black/50 rounded-lg p-3 text-white font-bold text-lg touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            ↓
          </button>
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouchStart(0);
            }}
            onTouchEnd={(e) => e.preventDefault()}
            className="bg-black/30 active:bg-black/50 rounded-lg p-3 text-white font-bold text-lg touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            →
          </button>
        </div>
      )}
      {gameOver && (
        <div className="text-center px-2">
          <p className="text-xs md:text-sm font-bold text-red-600">Game Over!</p>
          <p className="text-[10px] md:text-xs text-black">Final Score: {score}</p>
        </div>
      )}
    </div>
  );
}

export default PacmanGame;
