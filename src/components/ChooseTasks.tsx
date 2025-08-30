import { useEffect, useState } from "react";

const availableTasks = ["🧦", "👟", "🧥", "🎒", "🧴", "🧤", "🪖", "🚽"];

export const ChooseTasks = ({
  onSubmit,
}: {
  onSubmit: (tasks: string[]) => void;
}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedTasks");
    if (stored) {
      setSelectedTasks(JSON.parse(stored));
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

        <button
          onClick={() => {
            localStorage.setItem(
              "selectedTasks",
              JSON.stringify(selectedTasks)
            );
            onSubmit(selectedTasks);
          }}
          className="px-4 py-2 bg-ila text-white rounded-full"
        >
          Start
        </button>
      </div>
    </div>
  );
};
