import { useState, useRef } from "react";
import Timer from "./Timer";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useSwipeable } from "react-swipeable";

function App() {
  const [time, setTime] = useState(30);
  const [editing, setEditing] = useState(false);
  const [key, setKey] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Refs to track swipe state
  const minutesRef = useRef(0);
  const secondsRef = useRef(0);

  // Function to adjust time
  const adjustTime = (type, amount) => {
    setTime((prev) => {
      const minutes = Math.floor(prev / 60);
      const seconds = prev % 60;
      
      if (type === 'minutes') {
        const newMinutes = Math.max(0, minutes + amount);
        return newMinutes * 60 + seconds;
      } else {
        const newSeconds = Math.max(0, Math.min(59, seconds + amount));
        return minutes * 60 + newSeconds;
      }
    });
  };

  // Swipe handlers for minutes
  const minutesHandlers = useSwipeable({
    onSwipedUp: () => {
      adjustTime('minutes', 1);
      if (navigator.vibrate) navigator.vibrate(10);
    },
    onSwipedDown: () => {
      adjustTime('minutes', -1);
      if (navigator.vibrate) navigator.vibrate(10);
    },
    onSwiping: (event) => {
      minutesRef.current.style.transform = `translateY(${event.deltaY * 0.3}px)`;
    },
    onSwiped: () => {
      minutesRef.current.style.transform = 'translateY(0)';
    },
    trackMouse: true,
    delta: 10,
  });

  // Swipe handlers for seconds
  const secondsHandlers = useSwipeable({
    onSwipedUp: () => {
      adjustTime('seconds', 5);
      if (navigator.vibrate) navigator.vibrate(10);
    },
    onSwipedDown: () => {
      adjustTime('seconds', -5);
      if (navigator.vibrate) navigator.vibrate(10);
    },
    onSwiping: (event) => {
      secondsRef.current.style.transform = `translateY(${event.deltaY * 0.3}px)`;
    },
    onSwiped: () => {
      secondsRef.current.style.transform = 'translateY(0)';
    },
    trackMouse: true,
    delta: 10,
  });

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
      style={{ minHeight: '500px' }} // Slightly taller for embedding
    >
      {!timerStarted && (
        <>
          {/* Title and Toggle Button - Keep original size but less spacing */}
          <div className="flex items-center gap-2 mb-4">
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

          {/* Timer display - KEEP ORIGINAL SIZE (this is what you want!) */}
          <div className="flex items-center justify-center gap-[3vw] text-[32vw] sm:text-[20vw] font-bold text-ovalBg w-full max-w-[420px] h-[40vh] sm:h-[60vh] cursor-pointer leading-none">
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
                  autoFocus
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
                {/* Minutes with swipe */}
                <div
                  {...minutesHandlers}
                  ref={(el) => {
                    minutesHandlers.ref(el);
                    minutesRef.current = el;
                  }}
                  className="relative flex flex-col items-center justify-center w-[3ch] min-h-[1em] touch-manipulation select-none transition-transform duration-150"
                  onClick={() => setEditing(true)}
                >
                  <div className="relative">
                    {String(Math.floor(time / 60)).padStart(2, "0")}
                    {/* Swipe hint arrows */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-30">
                      <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                      <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-[3vw] sm:text-[2vw] text-pink-400 mt-2">MIN</div>
                </div>

                <span className="px-1 text-[32vw] sm:text-[20vw]">:</span>

                {/* Seconds with swipe */}
                <div
                  {...secondsHandlers}
                  ref={(el) => {
                    secondsHandlers.ref(el);
                    secondsRef.current = el;
                  }}
                  className="relative flex flex-col items-center justify-center w-[3ch] min-h-[1em] touch-manipulation select-none transition-transform duration-150"
                  onClick={() => setEditing(true)}
                >
                  <div className="relative">
                    {String(time % 60).padStart(2, "0")}
                    {/* Swipe hint arrows */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-30">
                      <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                      <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-[3vw] sm:text-[2vw] text-pink-400 mt-2">SEC</div>
                </div>
              </>
            )}
          </div>

          {/* Instructions - Smaller for embedding but still readable */}
          <div className="text-pink-400 text-sm mt-1 mb-3">
            {editing ? "Type numbers, tap outside to save" : "Swipe ↑↓ to adjust • Tap to type"}
          </div>

          {/* Quick preset buttons - MORE COMPACT for embedding */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-3 max-w-sm">
            {[30, 60, 90, 120, 180, 300].map((seconds) => (
              <button
                key={seconds}
                onClick={() => setTime(seconds)}
                className="px-2.5 py-1 border border-pink-300 text-pink-500 rounded-full text-xs hover:bg-pink-50 active:bg-pink-100 transition-all duration-200"
              >
                {seconds < 60 ? `${seconds}s` : seconds === 60 ? '1m' : seconds === 90 ? '1.5m' : `${seconds/60}m`}
              </button>
            ))}
          </div>

          {/* Start button - Slightly smaller for embedding */}
          <button
            onClick={handleStart}
            className="mt-1 border border-rosePink text-rosePink text-base sm:text-lg font-poppins px-4 py-1 rounded-full transition-all duration-300 hover:bg-rosePink/10 active:scale-95 active:bg-rosePink/20"
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
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default App;