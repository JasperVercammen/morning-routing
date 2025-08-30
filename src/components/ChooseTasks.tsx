import { useEffect, useState } from "react";

const availableTasks = ["🧦", "👟", "🧥", "🎒", "🧴", "🧤", "🪖", "🚽"];

export const ChooseTasks = ({
  onSubmit,
}: {
  onSubmit: (tasks: string[], time: string) => void;
}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [leaveTime, setLeaveTime] = useState<string>("07:55");

  useEffect(() => {
    const stored = localStorage.getItem("selectedTasks");
    if (stored) {
      setSelectedTasks(JSON.parse(stored));
    }
    const storedLeaveTime = localStorage.getItem("leaveTime");
    if (storedLeaveTime) {
      setLeaveTime(storedLeaveTime);
    }
  }, []);

  return (
    <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white/50 backdrop-blur-md shadow-lg p-6 rounded-xl text-center max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Wat moeten ze doen?</h2>

        <div className="grid grid-cols-4 gap-8 justify-center mb-6">
          {availableTasks.map((icon) => {
            const isSelected = selectedTasks.includes(icon);
            return (
              <button
                key={icon}
                onClick={() =>
                  setSelectedTasks((prev) =>
                    isSelected
                      ? prev.filter((i) => i !== icon)
                      : [...prev, icon]
                  )
                }
                className={`text-3xl p-3 rounded-md transition-all transform border-2 ${
                  isSelected
                    ? "bg-blue-100 border-blue-400 scale-110"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {icon}
              </button>
            );
          })}
        </div>

        <div className="mb-6">
          <label
            htmlFor="leavetime"
            className="block text-xl font-semibold mb-2"
          >
            Vertrektijd?
          </label>
          <input
            id="leavetime"
            type="time"
            value={leaveTime}
            onChange={(e) => setLeaveTime(e.target.value)}
            className="px-3 py-2 border-none focus:outline-none rounded-md border bg-white/20 backdrop-blur-md shadow-lg"
          />
        </div>

        <button
          onClick={() => {
            localStorage.setItem(
              "selectedTasks",
              JSON.stringify(selectedTasks)
            );
            localStorage.setItem("leaveTime", leaveTime);
            onSubmit(selectedTasks, leaveTime);
          }}
          className="px-4 py-2 bg-ila text-white rounded-full"
        >
          Start
        </button>
      </div>
    </div>
  );
};
