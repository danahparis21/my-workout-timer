import { useEffect, useState, useRef } from "react";

function Timer({ duration, onEnd, isDarkMode }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [prepCount, setPrepCount] = useState(3);

  const [showOverlay, setShowOverlay] = useState(false);
  const intervalRef = useRef(null);

  const prepTimeoutRef = useRef(null);

  const startSoundRef = useRef(new Audio("/timer-start.mp3"));
  const doneSoundRef = useRef(new Audio("/timer-done.mp3"));

  useEffect(() => {
    startSoundRef.current.preload = "auto";
    doneSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setTimeLeft(duration);
    setIsPreparing(true);
    setPrepCount(3); // ← Reset here
    setShowOverlay(false);

    prepTimeoutRef.current = setTimeout(() => {
      setIsPreparing(false);
      setIsRunning(true);
    }, 3000);

    return () => {
      clearTimeout(prepTimeoutRef);
      clearInterval(intervalRef.current);
    };
  }, [duration]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            doneSoundRef.current.play();

            setIsRunning(false);
            setShowOverlay(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleOverlayClick = () => {
    setShowOverlay(false);
    setTimeLeft(duration);
    setPrepCount(3); // ← Reset
    setIsPreparing(true);
    setTimeout(() => {
      setIsPreparing(false);
      setIsRunning(true);
    }, 3000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    clearTimeout(prepTimeoutRef.current);

    const startSound = startSoundRef.current;
    startSound.pause();
    startSound.currentTime = 0;

    setIsRunning(false);
    onEnd(); // go back to home
  };

  useEffect(() => {
    if (isPreparing) {
      if (prepCount === 3) {
        startSoundRef.current.play();
      }

      if (prepCount > 1) {
        const countdown = setTimeout(() => setPrepCount(prepCount - 1), 1000);
        return () => clearTimeout(countdown);
      } else {
        const finishPrep = setTimeout(() => {
          setIsPreparing(false);
          setIsRunning(true);
        }, 1000);
        return () => clearTimeout(finishPrep);
      }
    }
  }, [prepCount, isPreparing]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div
      className={`relative w-full h-screen ${
        isDarkMode ? "bg-[#101125]" : "bg-white"
      } flex flex-col items-center justify-center select-none`}
    >
      {/* Timer countdown display */}
      <div className="flex items-center justify-center gap-[4vw] text-[32vw] sm:text-[20vw] font-bold text-ovalBg leading-none">
        {isPreparing ? (
          <span
            key={prepCount} // 👈 triggers animation
            className="animate-scaleIn transition-all duration-500 ease-out"
          >
            {prepCount}
          </span>
        ) : (
          <>
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}
            <span className="px-2">:</span>
            {String(timeLeft % 60).padStart(2, "0")}
          </>
        )}
      </div>

      {/* Cancel button */}
      <button
        onClick={stopTimer}
        className="mt-8 border border-pink-300 text-pink-500 text-lg sm:text-xl font-poppins px-5 py-1.5 rounded-full transition-all duration-300 hover:bg-pink-50"
      >
        Cancel
      </button>

      {/* Overlay when done */}
      {showOverlay && (
        <div
          className="absolute inset-0 bg-pink-200 bg-opacity-80 flex flex-col justify-between items-center text-center px-4 py-8 z-50"
          onClick={handleOverlayClick}
        >
          {/* Centered text in the middle */}
          <div className="flex-1 flex items-center justify-center w-full">
            <p className="text-xl sm:text-2xl text-white font-semibold">
              Click to start again
            </p>
          </div>

          {/* Button*/}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnd();
            }}
            className="mb-4 bg-white text-pink-500 px-6 py-2 rounded-full font-semibold shadow
             border border-pink-300"
          >
            Start New Timer
          </button>
        </div>
      )}
    </div>
  );
}

export default Timer;
