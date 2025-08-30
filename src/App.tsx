import { useCallback, useEffect, useRef, useState } from "react";
import { useWakeLock } from "./hooks/useWakeLock";
import { Clock } from "./components/Clock";
import { WeatherReport } from "./components/WeatherReport";
import { ChooseTasks } from "./components/ChooseTasks";
import { Progress } from "./components/Progress";
import { TaskCheck } from "./components/TaskCheck";

function App() {
  const alarmRef = useRef<HTMLAudioElement>(null);
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [popupAccepted, setPopupAccepted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const confirmTimer = useRef<NodeJS.Timeout | null>(null);

  const [tasks, setTasks] = useState<string[]>([]);

  // Keep screen on
  useWakeLock(popupAccepted);

  const fadeInAudio = useCallback((audio: HTMLAudioElement) => {
    let vol = 0;
    audio.volume = vol;
    audio.play();
    const interval = setInterval(() => {
      vol += 0.1;
      if (vol >= 1) {
        clearInterval(interval);
        audio.volume = 1;
      } else {
        audio.volume = vol;
      }
    }, 1000);
  }, []);

  // Fake touch events for desktop
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "d") {
        // fadeInAudio(alarmRef.current!);

        setLeftPressed(true);
        setRightPressed(true);
      }
    };
    const handler2 = (e: KeyboardEvent) => {
      if (e.key === "d") {
        setLeftPressed(false);
        setRightPressed(false);
      }
    };
    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", handler2);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keyup", handler2);
    };
  }, [fadeInAudio]);

  useEffect(() => {
    if (leftPressed && rightPressed && !confirmed) {
      // Start timer van 800ms vasthouden voordat confirm telt
      confirmTimer.current = setTimeout(() => {
        setConfirmed(true);
        onConfirmComplete();
      }, 2000);
    } else {
      // Iemand liet los → cancel timer
      if (confirmTimer.current) {
        clearTimeout(confirmTimer.current);
        confirmTimer.current = null;
      }
    }
  }, [confirmed, leftPressed, rightPressed]);

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
    };
  }, []);

  

  const onConfirmComplete = () => {
    alarmRef.current?.pause();
    setTimeout(() => {
      setShowIcons(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-around p-4 bg-gradient-to-b from-blue-100 to-blue-300 text-gray-800">
      {!popupAccepted && (
        <ChooseTasks
          onSubmit={(tasks: string[]) => {
            setPopupAccepted(true);
            setTasks(tasks);
          }}
        />
      )}

      {confirmed && (
        <div className="fixed inset-0 bg-gradient-to-br from-ila to-walt z-50 animate-fade-in duration-1000">
          {showIcons && <TaskCheck tasks={tasks} />}
        </div>
      )}

      <WeatherReport />

      <Progress
        onFinished={() => {
          fadeInAudio(alarmRef.current!);
          setShowConfirmButtons(true);
        }}
      />

      <div className="mt-4 flex justify-center absolute bottom-40 left-0 right-0">
        <Clock />
      </div>

      <audio ref={alarmRef} preload="auto" loop>
        <source src="/alarm.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {showConfirmButtons && (
        <div className="fixed inset-0 flex justify-between items-end px-8 pb-16 z-40">
          <div
            onTouchStart={() => setLeftPressed(true)}
            onTouchEnd={() => setLeftPressed(false)}
            className={`w-20 h-20 rounded-full flex items-center justify-center mix-blend-multiply ease-in-out bg-ila transition-transform duration-2000 ${
              leftPressed ? "scale-[40]" : "scale-100"
            }`}
          >
            <span
              className={`font-bold text-ila-text text-5xl transition-opacity duration-700 select-none ${
                leftPressed ? "opacity-0" : "opacity-1"
              }`}
            >
              i
            </span>
          </div>
          <div
            onTouchStart={() => setRightPressed(true)}
            onTouchEnd={() => setRightPressed(false)}
            className={`w-20 h-20 rounded-full flex items-center justify-center mix-blend-multiply ease-in-out bg-walt transition-all duration-2000 ${
              rightPressed ? "scale-[40]" : "scale-100"
            }`}
          >
            <span
              className={`font-bold text-walt-text text-5xl transition-opacity duration-700 select-none ${
                rightPressed ? "opacity-0" : "opacity-1"
              }`}
            >
              W
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
