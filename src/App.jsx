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
      // Add haptic feedback on mobile if available
      if (navigator.vibrate) navigator.vibrate(10);
    },
    onSwipedDown: () => {
      adjustTime('minutes', -1);
      if (navigator.vibrate) navigator.vibrate(10);
    },
    onSwiping: (event) => {
      // Visual feedback during swipe
      minutesRef.current.style.transform = `translateY(${event.deltaY * 0.3}px)`;
    },
    onSwiped: () => {
      // Reset transform after swipe
      minutesRef.current.style.transform = 'translateY(0)';
    },
    trackMouse: true, // Also works with mouse drag
    delta: 10, // Minimum distance for a swipe
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

  // Format time for display
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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

          {/* Timer display with swipe */}
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

          {/* Instructions */}
          <div className="text-pink-400 text-sm mt-2 mb-4">
            {editing ? "Type numbers, tap outside to save" : "Swipe ↑↓ to adjust • Tap to type"}
          </div>

          {/* Quick preset buttons (optional but helpful) */}
          <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-sm">
            {[30, 60, 90, 120, 180, 300].map((seconds) => (
              <button
                key={seconds}
                onClick={() => setTime(seconds)}
                className="px-3 py-1 border border-pink-300 text-pink-500 rounded-full text-sm hover:bg-pink-50 active:bg-pink-100 transition-all duration-200"
              >
                {seconds < 60 ? `${seconds}s` : `${seconds/60}m`}
              </button>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="mt-2 border border-rosePink text-rosePink text-lg sm:text-xl font-poppins px-5 py-1.5 rounded-full transition-all duration-300 hover:bg-rosePink/10 active:scale-95 active:bg-rosePink/20"
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