import { useState, useEffect, useCallback } from 'react';

export function useClock(timezone = 'Asia/Kolkata') {
  const [time, setTime] = useState('');

  const updateClock = useCallback(() => {
    const now = new Date();
    
    // Get time in specified timezone (India Standard Time by default)
    const offset = 5.5 * 60; // offset in minutes
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const indiaTime = new Date(utc + offset * 60000);

    let hours = indiaTime.getHours();
    const minutes = String(indiaTime.getMinutes()).padStart(2, '0');
    const seconds = String(indiaTime.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');

    setTime(`${hoursStr}:${minutes}:${seconds} ${ampm}`);
  }, [timezone]);

  useEffect(() => {
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [updateClock]);

  return time;
}
