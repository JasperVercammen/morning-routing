import { useEffect } from "react";

export const useWakeLock = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    let wakeLock: WakeLockSentinel | null = null;

    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
          console.log("🔋 Wake Lock actief");

          wakeLock.addEventListener("release", () => {
            console.log("🔕 Wake Lock vrijgegeven");
          });
        }
      } catch (err) {
        console.error("⚠️ Wake Lock fout:", err);
      }
    }

    requestWakeLock();

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    });

    return () => {
      wakeLock?.release();
    };
  }, [enabled]);
};
