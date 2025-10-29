import { useState, useEffect } from 'react';
import type { StudentSchedule } from '../types';

const STORAGE_KEY = 'studentSchedule';

const generateInitialSchedule = (): StudentSchedule => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const mods = Array.from({ length: 10 }, (_, i) => `Mod ${i + 1}`);
  const schedule: StudentSchedule = {
    shieldRoom: '',
    days: {},
  };

  days.forEach(day => {
    schedule.days[day] = {};
    mods.forEach(mod => {
      schedule.days[day][mod] = { className: '', room: '' };
    });
  });

  return schedule;
};


export const useStudentSchedule = (): [StudentSchedule, (schedule: StudentSchedule) => void] => {
  const [schedule, setSchedule] = useState<StudentSchedule>(() => {
    try {
      const storedSchedule = window.localStorage.getItem(STORAGE_KEY);
      if (storedSchedule) {
        const parsed = JSON.parse(storedSchedule);
        // Basic validation for the new structure. If it fails, generate a new schedule.
        if (parsed.days && typeof parsed.shieldRoom !== 'undefined') {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to read schedule from localStorage", error);
    }
    return generateInitialSchedule();
  });

  const setAndStoreSchedule = (newSchedule: StudentSchedule) => {
    try {
      setSchedule(newSchedule);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newSchedule));
    } catch (error) {
      console.error("Failed to save schedule to localStorage", error);
    }
  };

  return [schedule, setAndStoreSchedule];
};