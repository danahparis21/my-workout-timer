import { useEffect, useState, useRef } from "react";

function Timer({ duration, onEnd, isDarkMode }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [prepCount, setPrepCount] = useState(3);
  const [showOverlay, setShowOverlay] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const intervalRef = useRef(null);
  const prepTimeoutRef = useRef(null);

  // Audio refs
  const audioContextRef = useRef(null);
  const startSoundRef = useRef(null);
  const doneSoundRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    startSoundRef.current = new Audio(
      `${import.meta.env.BASE_URL}timer-start.mp3`
    );
    doneSoundRef.current = new Audio(
      `${import.meta.env.BASE_URL}timer-done.mp3`
    );

    // Configure audio
    const configureAudio = (audio) => {
      audio.preload = "auto";
      audio.volume = 0.8;
      audio.load();
    };

    configureAudio(startSoundRef.current);
    configureAudio(doneSoundRef.current);

    return () => {
      if (startSoundRef.current) {
        startSoundRef.current.pause();
        startSoundRef.current = null;
      }
      if (doneSoundRef.current) {
        doneSoundRef.current.pause();
        doneSoundRef.current = null;
      }
    };
  }, []);

  // Play audio with error handling
  const playAudio = async (audioRef) => {
    if (!audioRef.current) return;

    setAudioPlaying(true);
    try {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        await playPromise;
      }

      setTimeout(() => setAudioPlaying(false), 500);
    } catch (error) {
      console.warn("Audio playback failed:", error);
      setAudioPlaying(false);
      playFallbackBeep();
    }
  };

  // Fallback beep using Web Audio API
  const playFallbackBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContextRef.current.currentTime + 0.5
      );

      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.5);
    } catch (error) {
      console.warn("Fallback audio failed:", error);
    }
  };

  // Handle user interaction for audio (browser policy)
  const handleUserInteraction = () => {
    if (
      audioContextRef.current &&
      audioContextRef.current.state === "suspended"
    ) {
      audioContextRef.current.resume();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleUserInteraction);
    return () => document.removeEventListener("click", handleUserInteraction);
  }, []);

  // Reset timer when duration changes
  useEffect(() => {
    clearTimeout(prepTimeoutRef.current);
    clearInterval(intervalRef.current);

    setTimeLeft(duration);
    setIsPreparing(true);
    setPrepCount(3);
    setShowOverlay(false);
    setIsRunning(false);

    prepTimeoutRef.current = setTimeout(() => {
      setIsPreparing(false);
      setIsRunning(true);
    }, 3000);

    return () => {
      clearTimeout(prepTimeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [duration]);

  // Main timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            playAudio(doneSoundRef);
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

  // Preparation countdown logic
  useEffect(() => {
    if (isPreparing) {
      if (prepCount === 3) {
        playAudio(startSoundRef);
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

  const handleOverlayClick = () => {
    setShowOverlay(false);
    setTimeLeft(duration);
    setPrepCount(3);
    setIsPreparing(true);

    clearInterval(intervalRef.current);

    setTimeout(() => {
      setIsPreparing(false);
      setIsRunning(true);
    }, 3000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    clearTimeout(prepTimeoutRef.current);

    if (startSoundRef.current) {
      startSoundRef.current.pause();
      startSoundRef.current.currentTime = 0;
    }
    if (doneSoundRef.current) {
      doneSoundRef.current.pause();
      doneSoundRef.current.currentTime = 0;
    }

    setIsRunning(false);
    onEnd();
  };

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
      {/* Audio playing indicator */}
      {audioPlaying && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      )}

      {/* Timer countdown display */}
      <div className="flex items-center justify-center gap-[4vw] text-[32vw] sm:text-[20vw] font-bold text-ovalBg leading-none">
        {isPreparing ? (
          <span key={prepCount} className="animate-scaleIn">
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
          className="fixed inset-0 bg-pink-200 bg-opacity-80 flex flex-col justify-between items-center text-center px-4 py-8 z-50"
          onClick={handleOverlayClick}
        >
          <div className="flex-1 flex items-center justify-center w-full">
            <p className="text-xl sm:text-2xl text-white font-semibold">
              Click to start again
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnd();
            }}
            className="mb-4 bg-white text-pink-500 px-6 py-2 rounded-full font-semibold shadow border border-pink-300"
          >
            Start New Timer
          </button>
        </div>
      )}
    </div>
  );
}

export default Timer;
