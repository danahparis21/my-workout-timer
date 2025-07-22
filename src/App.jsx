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
      {!timerStarted && (
        <>
          {/* Title and Toggle Button */}

          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full border border-pink-300 text-pink-500 hover:bg-pink-50 transition-all duration-300"
            >
              {isDarkMode ? (
                <SunIcon className="w-5 h-5 text-rosePink" />
              ) : (
                <MoonIcon className="w-5 h-5 text-rosePink" />
              )}
            </button>
            <h1 className="text-[14px] xs:text-[16px] md:text-[20px] font-poppins text-pink-500 px-4 py-1 border border-pink-300 rounded-full bg-transparent hover:bg-pink-50 transition-all duration-300">
              My Workout Timer
            </h1>
          </div>

          {/* Timer display */}
          <div
            className="flex items-center justify-center gap-[3vw] text-[32vw] sm:text-[20vw] font-bold text-ovalBg w-full max-w-[420px] h-[40vh] sm:h-[60vh] cursor-pointer leading-none"
            onClick={() => setEditing(true)}
          >
            {editing ? (
              <>
                <input
                  type="tel"
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
                  type="tel"
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
