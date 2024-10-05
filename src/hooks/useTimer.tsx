import { useState, useEffect, useCallback } from "react";


export function useTimer(initialTime: number) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  useEffect(() => {

    let timer: NodeJS.Timeout;

    if (isActive) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive]);

  const resetTimer = () => {
    setTimeRemaining(initialTime);
    setIsActive(true);
  };

  return {
    timeRemaining,
    isActive,
    resetTimer,
    startTimer
  };
}
