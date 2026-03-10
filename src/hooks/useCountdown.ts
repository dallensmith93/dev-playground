import { useEffect, useState } from "react";

export function useCountdown(initialSeconds = 15) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      return;
    }

    const id = window.setInterval(() => {
      setSecondsLeft((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => window.clearInterval(id);
  }, [running, secondsLeft]);

  const start = (nextSeconds = initialSeconds) => {
    setSecondsLeft(nextSeconds);
    setRunning(true);
  };

  const stop = () => setRunning(false);
  const reset = (nextSeconds = initialSeconds) => {
    setRunning(false);
    setSecondsLeft(nextSeconds);
  };

  return { secondsLeft, running, start, stop, reset };
}
