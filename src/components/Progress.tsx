import { useEffect, useRef, useState } from "react";

const START_HOUR = 7;
const START_MINUTES = 0;
const END_HOURS = 7;
const END_MINUTES = 55;

export const Progress = ({ onFinished }: { onFinished: () => void }) => {
  const [progress, setProgress] = useState(0);
  const isFinishedTriggered = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date();
      start.setHours(START_HOUR, START_MINUTES, 0, 0);
      const end = new Date();
      end.setHours(END_HOURS, END_MINUTES, 0, 0);

      const total = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();

      const hhmm = `${now.getHours()}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      if (
        hhmm === `${END_HOURS}:${END_MINUTES.toString().padStart(2, "0")}` &&
        !isFinishedTriggered.current
      ) {
        onFinished();
        isFinishedTriggered.current = true;
      }

      if (now < start) {
        setProgress(0); // Voor 07:00
        isFinishedTriggered.current = false;
      } else if (now >= start && now <= end) {
        const percentage = Math.min((elapsed / total) * 100, 100);
        setProgress(percentage);
      } else {
        setProgress(100); // Na 07:55 → bar blijft vol
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="w-full h-4 bg-white/20 backdrop-blur-md shadow-lg rounded-full mt-8 mb-4">
      <div
        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
