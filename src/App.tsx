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
}

function App() {
  const [strikes, setStrikes] = useState(0);
  const [outs, setOuts] = useState(0);
  const [result, setResult] = useState("");
  const [grid, setGrid] = useState<GridItem[][] | []>([]);

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

    if ([0, 2, 4].includes(hitResult)) {
      console.log("before adjust", coordinateLetter, coordinateNumber);
      coordinateLetter = Math.min(Math.floor(coordinateLetter * 1.5), 10);
      coordinateNumber = Math.min(Math.floor(coordinateLetter * 1.5), 10);
      console.log("after adjust", coordinateLetter, coordinateNumber);
    }

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
      if (updatedOuts === 3) {
        setOuts(0);
        return "Change Sides";
      } else {
        setOuts(updatedOuts);
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

  useEffect(() => {
    TestGrid();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <p>Strikes: {strikes}</p>
        <p>Outs: {outs}</p>
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gridAutoRows: "1fr",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {grid.map((row, a) =>
            row.map((sq, b) => (
              <div
                key={`${a}-${b}`}
                style={{
                  width: "clamp(20px, 4vw, 50px)",
                  height: "clamp(20px, 4vw, 50px)",
                  aspectRatio: "1 / 1",
                  boxSizing: "border-box",
                  border: "0.5px solid rgba(255,255,255,0.3)",
                  backgroundColor: getBackgroundColor(sq),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "clamp(8px, 2vw, 12px)",
                    margin: 0,
                    color: "white",
                    pointerEvents: "none",
                    lineHeight: 1,
                  }}
                >
                  {letters[a]}
                  {b + 1}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      <h3>{result}</h3>
      <button
        style={{ position: "relative", zIndex: 2 }}
        onClick={() => {
          setResult(handlePitch());
        }}
      >
        Pitch
      </button>
    </>
  );
}

export default App;
