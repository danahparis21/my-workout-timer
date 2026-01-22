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
      } text-center flex flex-col items-center justify-center px-2 sm:px-4`}
      style={{ minHeight: '400px' }} // Fixed min-height for iframe
    >
      {!timerStarted && (
        <>
          {/* Title and Toggle Button - Compact for embedding */}
          <div className="flex items-center gap-1 mb-2 sm:mb-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1 sm:p-2 rounded-full border border-pink-300 text-pink-500 hover:bg-pink-50 transition-all duration-300 text-xs sm:text-base"
              style={{ fontSize: 'clamp(10px, 2vw, 14px)' }}
            >
              {isDarkMode ? (
                <SunIcon className="w-3 h-3 sm:w-4 sm:h-4 text-rosePink" />
              ) : (
                <MoonIcon className="w-3 h-3 sm:w-4 sm:h-4 text-rosePink" />
              )}
            </button>
            <h1 
              className="font-poppins text-pink-500 px-2 py-0.5 sm:px-3 sm:py-1 border border-pink-300 rounded-full bg-transparent hover:bg-pink-50 transition-all duration-300"
              style={{ fontSize: 'clamp(10px, 2.5vw, 16px)' }}
            >
              My Workout Timer
            </h1>
          </div>

          {/* Timer display - Compact for embedding */}
          <div className="flex items-center justify-center gap-[1vw] sm:gap-[2vw] text-[20vw] sm:text-[16vw] md:text-[14vw] font-bold text-ovalBg w-full max-w-[320px] h-[25vh] sm:h-[35vh] cursor-pointer leading-none">
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
                  className="w-[2ch] text-center bg-transparent outline-none appearance-none no-spinner"
                  autoFocus
                  style={{ fontSize: 'inherit' }}
                />
                <span>:</span>
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
                  className="w-[2ch] text-center bg-transparent outline-none appearance-none no-spinner"
                  style={{ fontSize: 'inherit' }}
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
                  className="relative flex flex-col items-center justify-center w-[2ch] min-h-[1em] touch-manipulation select-none transition-transform duration-150"
                  onClick={() => setEditing(true)}
                >
                  <div className="relative">
                    {String(Math.floor(time / 60)).padStart(2, "0")}
                    {/* Swipe hint arrows - smaller for embedding */}
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-20">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-[2vw] sm:text-[1.5vw] md:text-[1vw] text-pink-400 mt-1">MIN</div>
                </div>

                <span className="px-0.5 sm:px-1">:</span>

                {/* Seconds with swipe */}
                <div
                  {...secondsHandlers}
                  ref={(el) => {
                    secondsHandlers.ref(el);
                    secondsRef.current = el;
                  }}
                  className="relative flex flex-col items-center justify-center w-[2ch] min-h-[1em] touch-manipulation select-none transition-transform duration-150"
                  onClick={() => setEditing(true)}
                >
                  <div className="relative">
                    {String(time % 60).padStart(2, "0")}
                    {/* Swipe hint arrows - smaller for embedding */}
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-20">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-[2vw] sm:text-[1.5vw] md:text-[1vw] text-pink-400 mt-1">SEC</div>
                </div>
              </>
            )}
          </div>

          {/* Instructions - smaller for embedding */}
          <div className="text-pink-400 text-xs sm:text-sm mt-1 mb-2">
            {editing ? "Type, tap outside" : "Swipe ↑↓ • Tap to type"}
          </div>

          {/* Quick preset buttons - Compact grid */}
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 mb-2 sm:mb-3 w-full max-w-[280px]">
            {[30, 60, 90, 120, 180, 300].map((seconds) => (
              <button
                key={seconds}
                onClick={() => setTime(seconds)}
                className="px-1.5 py-0.5 sm:px-2 sm:py-1 border border-pink-300 text-pink-500 rounded-full hover:bg-pink-50 active:bg-pink-100 transition-all duration-200"
                style={{ fontSize: 'clamp(10px, 2vw, 12px)' }}
              >
                {seconds < 60 ? `${seconds}s` : seconds === 60 ? '1m' : seconds === 90 ? '1.5m' : `${seconds/60}m`}
              </button>
            ))}
          </div>

          {/* Start button - Always visible at bottom */}
          <button
            onClick={handleStart}
            className="mt-1 sm:mt-2 border border-rosePink text-rosePink font-poppins px-4 py-1 sm:px-5 sm:py-1.5 rounded-full transition-all duration-300 hover:bg-rosePink/10 active:scale-95 active:bg-rosePink/20"
            style={{ fontSize: 'clamp(12px, 3vw, 18px)' }}
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