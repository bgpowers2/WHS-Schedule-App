export interface Mod {
  id: string;
  name: string;
  class: string;
  startTime: string; // "HH:MM" format
  endTime: string; // "HH:MM" format
}

export type Schedules = {
  [key: string]: Mod[];
};

export interface ScheduleEntry {
  className: string;
  room: string;
}

export type DailySchedule = {
  [mod: string]: ScheduleEntry;
};

export type StudentSchedule = {
  shieldRoom: string;
  days: {
    [day: string]: DailySchedule;
  };
};

export type UrgencyLevel = 'normal' | 'warning' | 'urgent';