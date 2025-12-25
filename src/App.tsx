import { useEffect, useState } from "react";
import "./App.css";

const PITCH_OPTIONS_LENGTH = 6;
const HIT_OPTIONS_LENGTH = 6;
const COORDINATE_NUMBER_OPTIONS = 12;

type HitTypes =
  | "Ground Ball Slow"
  | "Ground Ball Hard"
  | "Line Drive Soft"
  | "Line Drive Hard"
  | "Fly Ball Shallow"
  | "Fly Ball High";

const hitMap: Record<number, string> = {
  0: "Bouncing Ground Ball",
  1: "Hard Ground Ball",
  2: "Soft Line Drive",
  3: "Hard Line Drive",
  4: "Shallow Fly Ball",
  5: "High Fly Ball",
};

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  // "M",
  // "N",
  // "O",
  // "P",
  // "Q",
  // "R",
  // "S",
  // "T",
  // "U",
  // "V",
  // "W",
  // "X",
  // "Y",
  // "Z",
];

interface GridItem {
  x: number;
  y: number;
  isBase: boolean;
  isFielder: boolean;
  ballLocation: boolean;
  hasRunner: boolean;
}

function App() {
  const [strikes, setStrikes] = useState(0);
  const [outs, setOuts] = useState(0);
  const [result, setResult] = useState("");
  const [grid, setGrid] = useState<GridItem[][] | []>([]);
  const [playerOneScore, setPlayerOneScore] = useState(0);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);

  useEffect(() => {
    TestGrid();
  }, []);

  const handlePitch = () => {
    const pitchResult = Math.floor(Math.random() * PITCH_OPTIONS_LENGTH);
    const hitResult = Math.floor(Math.random() * HIT_OPTIONS_LENGTH);
    const clearedGrid = grid.map((row) =>
      row.map((x) => ({ ...x, ballLocation: false }))
    );
    console.log("cleared here", clearedGrid);

    if (pitchResult === 5 && hitResult === 0) {
      console.log("automatic strikeout");
      setGrid(clearedGrid);
      return handleStrike(3);
    }
    if (outs === 3) {
      setOuts(0);
    }
    if (pitchResult === 0 && hitResult === 5) {
      setStrikes(0);
      setGrid(clearedGrid);
      return "Automatic Walk!";
    }

    if (pitchResult >= hitResult) {
      setGrid(clearedGrid);
      return handleStrike(strikes + 1 === 4 ? 1 : strikes + 1);
    }
    if (pitchResult === 1 && hitResult === 6) {
      setGrid(clearedGrid);
      return "Walk";
    }
    let coordinateLetter = Math.floor(Math.random() * letters.length);
    let coordinateNumber = Math.floor(
      Math.random() * COORDINATE_NUMBER_OPTIONS
    );

    // if ([0, 2, 4].includes(hitResult)) {
    // console.log("before adjust", coordinateLetter, coordinateNumber);
    //   coordinateLetter = Math.min(Math.floor(coordinateLetter * 1.5), 10);
    //   coordinateNumber = Math.min(Math.floor(coordinateLetter * 1.5), 10);
    //   console.log("after adjust", coordinateLetter, coordinateNumber);
    // }

    setStrikes(0);
    setGrid((prevGrid) => {
      const cleared = prevGrid.map((row) =>
        row.map((item) => ({ ...item, ballLocation: false }))
      );
      return cleared.map((row) =>
        row.map((item) => {
          if (
            item.x === coordinateLetter + 1 &&
            item.y === coordinateNumber + 1
          ) {
            return { ...item, ballLocation: true };
          }
          return item;
        })
      );
    });
    return `${hitMap[hitResult]} hit to ${letters[coordinateLetter]}${
      coordinateNumber + 1
    }`;
  };

  const handleStrike = (updatedStrikes: number) => {
    if (updatedStrikes === 3) {
      setStrikes(3);
      const updatedOuts = outs + 1;
      setOuts(updatedOuts % 3 === 0 ? 3 : updatedOuts % 3);
      if (updatedOuts === 3) {
        const updatedGrid = grid.map((row) =>
          row.map((sq) => ({ ...sq, hasRunner: false }))
        );
        setGrid(updatedGrid);
        return "Change Sides";
      } else {
        return "Batter Out!";
      }
    } else {
      setStrikes(updatedStrikes);
      return `Strike ${updatedStrikes}!`;
    }
  };

  const checkForHit = (x: number, y: number, hitType: string) => {};

  const TestGrid = () => {
    const grid: GridItem[][] = [];
    for (let x = 0; x < 12; x++) {
      grid.push([]);
      for (let y = 0; y < 12; y++) {
        grid[x].push({
          x: x + 1,
          y: y + 1,
          isBase: determineIsBase(x, y),
          isFielder: determineIsFielder(x, y),
          ballLocation: false,
          hasRunner: false,
        });
      }
    }
    setGrid(grid);
  };

  const determineIsBase = (x: number, y: number) => {
    if (x === 11 && y === 11) return true;
    if (x === 5 && y === 11) return true;
    if (x === 5 && y === 5) return true;
    if (x === 11 && y === 5) return true;
    return false;
  };

  const determineIsFielder = (x: number, y: number) => {
    if (x === 2 && y === 2) return true;
    if (x === 8 && y === 2) return true;
    if (x === 2 && y === 8) return true;
    if (x === 9 && y === 5) return true;
    if (x === 7 && y === 5) return true;
    if (x === 5 && y === 7) return true;
    if (x === 5 && y === 9) return true;
    if (x === 9 && y === 9) return true;
    return false;
  };

  const getBackgroundColor = (sq: GridItem) => {
    if (sq.ballLocation) return "red";
    if (sq.isBase) return "white";
    if (sq.isFielder) return "green";
    return "black";
  };

  const handleClickBase = (sq: GridItem) => {
    if (sq.x === 12 && sq.y === 12) return;
    if (sq.isBase) {
      const updatedGrid = grid.map((row) =>
        row.map((item) => {
          if (item.x === sq.x && item.y === sq.y) {
            return { ...item, hasRunner: !sq.hasRunner };
          }
          return item;
        })
      );
      setGrid(updatedGrid);
    }
  };

  const ScoreSection = ({
    strikes,
    outs,
    playerOneScore,
    playerTwoScore,
    setPlayerOneScore,
    setPlayerTwoScore,
  }: {
    strikes: number;
    outs: number;
    playerOneScore: number;
    playerTwoScore: number;
    setPlayerOneScore: React.Dispatch<React.SetStateAction<number>>;
    setPlayerTwoScore: React.Dispatch<React.SetStateAction<number>>;
  }) => {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ minWidth: 30 }}>{playerOneScore}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <ScoreButton
                symbol="+"
                handleClick={() => setPlayerOneScore((prev) => prev + 1)}
              />
              <ScoreButton
                symbol="-"
                handleClick={() =>
                  setPlayerOneScore((prev) => (prev > 0 ? prev - 1 : 0))
                }
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ minWidth: 30 }}>{playerTwoScore}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <ScoreButton
                symbol="+"
                handleClick={() => setPlayerTwoScore((prev) => prev + 1)}
              />
              <ScoreButton
                symbol="-"
                handleClick={() =>
                  setPlayerTwoScore((prev) => (prev > 0 ? prev - 1 : 0))
                }
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <p style={{ textAlign: "center" }}>Strikes</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <ScoreButton
                  symbol="+"
                  handleClick={() =>
                    setStrikes((prev) => (prev < 3 ? prev + 1 : 3))
                  }
                />
                <ScoreButton
                  symbol="-"
                  handleClick={() =>
                    setStrikes((prev) => (prev > 0 ? prev - 1 : 0))
                  }
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <DotIndicator active={strikes >= 1} color="yellow" />
              <DotIndicator active={strikes >= 2} color="yellow" />
              <DotIndicator active={strikes >= 3} color="yellow" />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <p style={{ textAlign: "center" }}>Outs</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <ScoreButton
                  symbol="+"
                  handleClick={() =>
                    setOuts((prev) => (prev < 3 ? prev + 1 : 3))
                  }
                />
                <ScoreButton
                  symbol="-"
                  handleClick={() =>
                    setOuts((prev) => (prev > 0 ? prev - 1 : 0))
                  }
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              <DotIndicator active={outs >= 1} color="red" />
              <DotIndicator active={outs >= 2} color="red" />
              <DotIndicator active={outs >= 3} color="red" />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ScoreButton = ({
    symbol,
    handleClick,
  }: {
    symbol: string;
    handleClick: () => void;
  }) => {
    return (
      <div onClick={() => handleClick()} className="score-button">
        {symbol}
      </div>
    );
  };

  const DotIndicator = ({
    active,
    color,
  }: {
    active: boolean;
    color: string;
  }) => {
    return (
      <div className="dot-indicator">
        {active && (
          <div className="active-dot" style={{ backgroundColor: color }}></div>
        )}
      </div>
    );
  };

  return (
    <div className="game-wrapper">
      {/* LEFT SIDE: THE FIELD */}
      <div className="field-container" style={{ width: "fit-content" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            // width: "fit-content" ensures it doesn't stretch to 100%
            width: "max-content",
          }}
        >
          {grid.map((row, a) =>
            row.map((sq, b) => (
              <div
                key={`${a}-${b}`}
                style={{
                  position: "relative",
                  width: "clamp(25px, 4vw, 45px)", // Consistent sizing
                  height: "clamp(25px, 4vw, 45px)",
                  aspectRatio: "1 / 1",
                  boxSizing: "border-box",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  backgroundColor: getBackgroundColor(sq),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: sq.isBase ? "pointer" : "default",
                }}
                onClick={() => sq.isBase && handleClickBase(sq)}
              >
                {sq.hasRunner && (
                  <div
                    style={{
                      position: "absolute",
                      width: "50%",
                      height: "50%",
                      borderRadius: "50%",
                      backgroundColor: "blue",
                      zIndex: 1,
                    }}
                  ></div>
                )}
                <p
                  style={{
                    fontSize: "clamp(8px, 1.5vw, 10px)",
                    margin: 0,
                    color: sq.isBase ? "black" : "white",
                    pointerEvents: "none",
                  }}
                >
                  {!sq.hasRunner ? `${letters[a]}${b + 1}` : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT SIDE: SCORE AND CONTROLS */}
      <div
        className="sidebar"
        style={{
          flex: "0 1 250px", // Allows it to take up to 250px but not grow
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          textAlign: "left",
        }}
      >
        <ScoreSection
          strikes={strikes}
          outs={outs}
          playerOneScore={playerOneScore}
          playerTwoScore={playerTwoScore}
          setPlayerOneScore={setPlayerOneScore}
          setPlayerTwoScore={setPlayerTwoScore}
        />

        <div
          style={{
            minHeight: "60px",
            // borderLeft: "4px solid #333",
            paddingTop: 10,
          }}
        >
          <h3 style={{ margin: 0, fontSize: "1.2rem", textAlign: "center" }}>
            {result || "Waiting for Pitch..."}
          </h3>
        </div>

        <button
          style={{
            padding: "15px",
            fontSize: "1.1rem",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
          onClick={() => {
            setResult(handlePitch());
          }}
        >
          Play Ball (Pitch)
        </button>
      </div>
    </div>
  );
}

export default App;
