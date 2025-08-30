import { useEffect, useState } from "react";

export const Clock = ({ leaveTime = "07:55" }: { leaveTime?: string }) => {
  const [clock, setClock] = useState("00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setClock(`${hours}:${minutes}`);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl shadow-md text-5xl font-mono">
      🕒 {clock}
      <div className="text-base text-center mt-2 text-gray-700">
        Vertrektijd: {leaveTime}
      </div>
    </div>
  );
};
