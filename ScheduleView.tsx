import React from 'react';
import type { Mod, StudentSchedule } from '../types';
import { getCanonicalModName } from '../utils';

interface ScheduleViewProps {
  schedule: Mod[];
  currentPeriodId?: string | null;
  studentSchedule: StudentSchedule;
}

const getDayString = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const formatTo12Hour = (timeStr: string): string => {
  if (!timeStr || !timeStr.includes(':')) {
    return '';
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  let formattedHours = hours % 12;
  if (formattedHours === 0) {
    formattedHours = 12;
  }
  return `${formattedHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
};

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, currentPeriodId, studentSchedule }) => {
  const dayOfWeek = getDayString(new Date());

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#A7A9AC]/30 space-y-2">
      {schedule
        .filter(mod => mod.name !== 'Passing Period')
        .map((mod) => {
          const isCurrent = mod.id === currentPeriodId;
          const canonicalName = getCanonicalModName(mod.name);
          const isInstructionalPeriod = canonicalName.startsWith('Mod');
          const isShieldTime = canonicalName === 'SHIELD TIME';

          let detailsLine = null;

          if (isShieldTime) {
            const room = studentSchedule.shieldRoom;
            detailsLine = (
              <p className={`text-sm truncate ${isCurrent ? 'text-white/80' : 'text-[#A7A9AC]'}`}>
                {room ? `Room: ${room}` : <span className="text-white/40 italic">Not set</span>}
              </p>
            );
          } else if (isInstructionalPeriod) {
            const scheduleEntry = studentSchedule.days[dayOfWeek]?.[canonicalName];
            const className = scheduleEntry?.className;
            const room = scheduleEntry?.room;
            detailsLine = (
              <p className={`text-sm truncate ${isCurrent ? 'text-white/80' : 'text-[#A7A9AC]'}`} title={className}>
                {className || <span className="text-white/40 italic">Not set</span>}
                {room && ` - Rm ${room}`}
              </p>
            );
          }

          return (
            <div
              key={mod.id}
              className={`flex justify-between items-center p-3 rounded-md transition-all duration-300 ${
                isCurrent ? 'bg-[#c8102e] shadow-lg' : 'bg-[#2C2C2E]'
              }`}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className={`w-20 text-center font-bold ${isCurrent ? 'text-white' : 'text-[#c8102e]'}`}>
                  {formatTo12Hour(mod.startTime)}
                </div>
                <div className={`ml-4 flex-1 min-w-0 ${isCurrent ? 'text-white' : 'text-[#E6E7E8]'}`}>
                  <p className="font-semibold truncate" title={canonicalName}>{canonicalName}</p>
                  {detailsLine}
                </div>
              </div>
              <div className={`w-20 text-right text-sm font-mono ${isCurrent ? 'text-white/80' : 'text-[#A7A9AC]'}`}>
                {formatTo12Hour(mod.endTime)}
              </div>
            </div>
          );
      })}
    </div>
  );
};

export default ScheduleView;