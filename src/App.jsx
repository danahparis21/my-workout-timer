import { useState } from "react";
import Timer from "./Timer";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

function App() {
  const [time, setTime] = useState(30);
  const [editing, setEditing] = useState(false);
  const [key, setKey] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  // ✅ Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleStart = () => {
    setTimerStarted(true);
    setKey((prev) => prev + 1);
  };

  const handleNewTimer = () => {
    setTimerStarted(false);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-[#101125]" : "bg-white"
      } text-center flex flex-col items-center justify-center px-4`}
    >
      {/* Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 left-4 p-2 rounded-full border border-pink-300 text-pink-500 hover:bg-pink-50 transition-all duration-300"
      >
        {isDarkMode ? (
          <SunIcon className="w-5 h-5 text-rosePink" />
        ) : (
          <MoonIcon className="w-5 h-5 text-rosePink" />
        )}
      </button>

      {!timerStarted && (
        <>
          <h1 className="text-[14px] xs:text-[16px] md:text-[20px] font-poppins text-rosePink px-4 py-1 border border-rosePink rounded-full bg-transparent transition-all duration-300 hover:scale-100 hover:shadow-[0_8px_12px_-2px_#ffd8e5]">
            My Workout Timer
          </h1>

          {/* Timer display */}
          <div
            className="flex items-center justify-center gap-[3vw] text-[32vw] sm:text-[20vw] font-bold text-ovalBg w-full max-w-[420px] h-[40vh] sm:h-[60vh] cursor-pointer leading-none"
            onClick={() => setEditing(true)}
          >
            {editing ? (
              <>
                <input
                  type="number"
                  value={Math.floor(time / 60)}
                  onChange={(e) => {
                    const minutes = Number(e.target.value);
                    const seconds = time % 60;
                    setTime(minutes * 60 + seconds);
                  }}
                  onBlur={() => setEditing(false)}
                  min={0}
                  className="w-[3ch] text-center bg-transparent outline-none appearance-none no-spinner text-[32vw] sm:text-[20vw]"
                />
                <span className="text-[32vw] sm:text-[20vw]">:</span>
                <input
                  type="number"
                  value={time % 60}
                  onChange={(e) => {
                    const minutes = Math.floor(time / 60);
                    let secs = Number(e.target.value);
                    if (secs > 59) secs = 59;
                    setTime(minutes * 60 + secs);
                  }}
                  onBlur={() => setEditing(false)}
                  min={0}
                  max={59}
                  className="w-[3ch] text-center bg-transparent outline-none appearance-none no-spinner text-[32vw] sm:text-[20vw]"
                />
              </>
            ) : (
              <>
                {String(Math.floor(time / 60)).padStart(2, "0")}
                <span className="px-1 text-[32vw] sm:text-[20vw]">:</span>
                {String(time % 60).padStart(2, "0")}
              </>
            )}
          </div>

          <button
            onClick={handleStart}
            className="mt-2 border border-rosePink text-rosePink text-lg sm:text-xl font-poppins px-5 py-1.5 rounded-full transition-all duration-300 hover:bg-rosePink/10"
          >
            Start
          </button>
        </>
      )}

      {timerStarted && (
        <Timer
          key={key}
          duration={time}
          onEnd={handleNewTimer}
          isDarkMode={isDarkMode} // 🔁 pass to Timer.jsx
        />
      )}
    </div>
  );
}

export default App;
