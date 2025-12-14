import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const PITCH_OPTIONS_LENGTH = 6;
const HIT_OPTIONS_LENGTH = 6;
const COORDINATE_NUMBER_OPTIONS = 20;

const hitMap: Record<number, string> = {
  0: "Ground Ball",
  1: "Ground Ball",
  2: "Line Drive",
  3: "Line Drive",
  4: "Fly Ball",
  5: "Fly Ball",
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
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function App() {
  const [strikes, setStrikes] = useState(0);
  const [outs, setOuts] = useState(0);
  const [result, setResult] = useState("");

  const handlePitch = () => {
    const pitchResult = Math.floor(Math.random() * PITCH_OPTIONS_LENGTH);
    const hitResult = Math.floor(Math.random() * HIT_OPTIONS_LENGTH);

    if (pitchResult >= hitResult) {
      const updatedStrikes = strikes + 1;
      if (updatedStrikes === 3) {
        setStrikes(0);
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
        return "Strike";
      }
    }
    if (pitchResult === 1 && hitResult === 6) {
      return "Walk";
    }
    const coordinateLetter =
      letters[Math.floor(Math.random() * letters.length)];
    const coordinateNumber = Math.floor(
      Math.random() * COORDINATE_NUMBER_OPTIONS
    );

    setStrikes(0);
    return `${hitMap[hitResult]} hit to ${coordinateLetter}${coordinateNumber}`;
  };

  return (
    <>
      <h2>Baseball Game</h2>
      <div>
        <p>Strikes: {strikes}</p>
        <p>Outs: {outs}</p>
      </div>
      <h3>{result}</h3>
      <button
        onClick={() => {
          console.log("what is this", handlePitch());
          setResult(handlePitch());
        }}
      >
        Pitch
      </button>
    </>
  );
}

export default App;
