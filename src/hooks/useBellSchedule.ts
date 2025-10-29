import { useState, useEffect } from 'react';
import type { Mod, UrgencyLevel } from '../types';

// Creates a Date object for today with the given time.
// This respects the user's local timezone, which is the desired behavior
// for this app (assuming users are in the Central Time zone, e.g., Omaha, NE).
const parseTime = (timeStr: string): Date => {
  if (!timeStr || !timeStr.includes(':')) {
    // Return a date in the past for invalid/missing time strings.
    return new Date(0);
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatTimeRemaining = (ms: number): string => {
  if (ms < 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const useBellSchedule = (schedule: Mod[]) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPeriod, setCurrentPeriod] = useState<Mod | null>(null);
  const [nextPeriod, setNextPeriod] = useState<Mod | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('00:00');
  const [percentageComplete, setPercentageComplete] = useState(0);
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>('normal');

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!schedule || schedule.length === 0) {
        setCurrentPeriod({ id: 'loading', name: 'Loading Schedule...', class: '', startTime: '', endTime: '' });
        setNextPeriod(null);
        setTimeRemaining('00:00');
        setPercentageComplete(0);
        setUrgencyLevel('normal');
        return;
    }
      
    const now = currentTime.getTime();
    let foundCurrent = false;

    for (let i = 0; i < schedule.length; i++) {
      const period = schedule[i];
      const startTime = parseTime(period.startTime).getTime();
      const endTime = parseTime(period.endTime).getTime();

      if (now >= startTime && now < endTime) {
        setCurrentPeriod(period);
        setNextPeriod(schedule[i + 1] || null);
        
        const duration = endTime - startTime;
        const elapsed = now - startTime;
        const msRemaining = endTime - now;
        
        setTimeRemaining(formatTimeRemaining(msRemaining));
        setPercentageComplete((elapsed / duration) * 100);

        // Determine urgency level for passing periods
        if (period.name === 'Passing Period') {
          if (msRemaining < 60000) { // Less than 1 minute
            setUrgencyLevel('urgent');
          } else if (msRemaining < 120000) { // Less than 2 minutes
            setUrgencyLevel('warning');
          } else {
            setUrgencyLevel('normal');
          }
        } else {
          setUrgencyLevel('normal');
        }

        foundCurrent = true;
        break;
      }
    }

    if (!foundCurrent) {
        setUrgencyLevel('normal');
        const firstModTime = parseTime(schedule[0].startTime).getTime();
        const lastModTime = parseTime(schedule[schedule.length - 1].endTime).getTime();

        if (now < firstModTime) {
            setCurrentPeriod({ id: 'before', name: 'Before School', class: '', startTime: '', endTime: '' });
            setNextPeriod(schedule[0]);
            setTimeRemaining(formatTimeRemaining(firstModTime - now));
            setPercentageComplete(0);
        } else if (now >= lastModTime) {
            setCurrentPeriod({ id: 'after', name: "School's Out", class: 'Have a great day!', startTime: '', endTime: '' });
            setNextPeriod(null);
            setTimeRemaining('00:00');
            setPercentageComplete(100);
        }
    }
  }, [currentTime, schedule]);

  return { currentPeriod, nextPeriod, timeRemaining, percentageComplete, urgencyLevel };
};