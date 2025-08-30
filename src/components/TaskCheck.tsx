import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "react-use";
import ConfettiExplosion from "react-confetti-explosion";

export const TaskCheck = ({ tasks }: { tasks: string[] }) => {
  const [tasksVisible, setTasksVisible] = useState(tasks.map(() => false));
  const [showButtons, setShowButtons] = useState(false);
  const { width } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const [confirmedW, setConfirmedW] = useState<boolean[]>(
    tasks.map(() => false)
  );
  const [confirmedI, setConfirmedI] = useState<boolean[]>(
    tasks.map(() => false)
  );

  useEffect(() => {
    tasksVisible.forEach((_, i) => {
      setTimeout(() => {
        setTasksVisible((prev) => {
          const updated = [...prev];
          updated[i] = true;
          // Toon knoppen pas als laatste icoon zichtbaar is
          if (i === tasks.length - 1) {
            setTimeout(() => setShowButtons(true), 500);
          }
          return updated;
        });
      }, i * 500);
    });
  }, [tasks.length, tasksVisible]);

  const allConfirmed = confirmedW.every(Boolean) && confirmedI.every(Boolean);
  useEffect(() => {
    if (allConfirmed) {
      // Verberg knoppen en icons met fade out na 500ms
      setShowButtons(false);
      setTimeout(() => setTasksVisible(tasks.map(() => false)), 500);
      // Start confetti
      setTimeout(() => setShowConfetti(true), 600);
    }
  }, [allConfirmed, tasks, tasks.length]);

  const toggleConfirmed = (index: number, type: "W" | "I") => {
    if (type === "W") {
      setConfirmedW((prev) => {
        const updated = [...prev];
        updated[index] = !updated[index];
        return updated;
      });
    } else {
      setConfirmedI((prev) => {
        const updated = [...prev];
        updated[index] = !updated[index];
        return updated;
      });
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <motion.div
        className="flex flex-row gap-20 text-6xl"
        animate={{ opacity: allConfirmed ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {tasks.map((task, i) => (
          <div
            key={task}
            className={`flex flex-col items-center gap-6 transition-all duration-500 ${
              tasksVisible[i] ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <AnimatePresence>
              {showButtons && (
                <motion.button
                  layout // zorgt voor een smooth transform
                  onClick={() => toggleConfirmed(i, "W")}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: confirmedW[i] ? 1.2 : 1,
                    rotate: confirmedW[i] ? 360 : 0,
                    backgroundColor: confirmedW[i] ? "#22c55e" : "#ec4899", // groen of roze
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full text-white text-xl font-bold flex items-center justify-center"
                >
                  {confirmedW[i] ? "✅" : "W"}
                </motion.button>
              )}
            </AnimatePresence>

            <div>{task}</div>

            <AnimatePresence>
              {showButtons && (
                <motion.button
                  key={`i-${i}`}
                  onClick={() => toggleConfirmed(i, "I")}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: confirmedI[i] ? [1, 1.3, 1] : 1,
                    y: confirmedI[i] ? [0, -20, 0] : 0,
                    backgroundColor: confirmedI[i] ? "#22c55e" : "#C148E2",
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-full text-white text-xl font-bold flex items-center justify-center"
                >
                  {confirmedI[i] ? "✅" : "i"}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
      {showConfetti && (
        <div className="fixed top-1/2 left-1/2 pointer-events-none bg-green-500">
          <ConfettiExplosion
            force={1}
            zIndex={99}
            particleCount={2000}
            duration={5000}
            width={width + 300}
          />
        </div>
      )}
    </div>
  );
};
