import React from 'react';
import type { Mod, StudentSchedule, UrgencyLevel } from '../types';
import { getCanonicalModName } from '../utils';

interface DashboardProps {
  currentPeriod: Mod | null;
  nextPeriod: Mod | null;
  timeRemaining: string;
  percentageComplete: number;
  studentSchedule: StudentSchedule;
  urgencyLevel: UrgencyLevel;
}

const getDayString = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const CircularProgress: React.FC<{
  percentage: number;
  time: string;
  urgencyLevel: UrgencyLevel;
  periodName: string | undefined;
}> = ({ percentage, time, urgencyLevel, periodName }) => {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isPassingPeriod = periodName === 'Passing Period';
  
  // Determine colors based on urgency
  let progressColor = '#c8102e'; // Default brand red
  let textColor = 'text-white';
  
  if (isPassingPeriod) {
    if (urgencyLevel === 'urgent') {
      progressColor = '#ef4444'; // Red-500 for urgency
      textColor = 'text-red-500';
    } else if (urgencyLevel === 'warning') {
      progressColor = '#f59e0b'; // Amber-500 for warning
      textColor = 'text-amber-500';
    } else {
      progressColor = '#A7A9AC'; // Neutral gray
    }
  }

  return (
    <div className={`relative flex items-center justify-center transition-transform duration-500 ${urgencyLevel === 'urgent' ? 'animate-pulse-urgent' : ''}`}>
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle
          stroke="#A7A9AC"
          strokeOpacity="0.2"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={progressColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s linear, stroke 0.5s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute text-center">
        <span className={`text-5xl font-bold tracking-tighter transition-colors duration-500 ${textColor}`}>{time}</span>
        <span className="block text-sm text-[#A7A9AC] uppercase font-bold">
          {urgencyLevel === 'urgent' ? 'Hurry Up!' : 'Time Left'}
        </span>
      </div>
    </div>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ currentPeriod, nextPeriod, timeRemaining, percentageComplete, studentSchedule, urgencyLevel }) => {
  const dayOfWeek = getDayString(new Date());

  const getPeriodDetails = (period: Mod | null) => {
    if (!period) {
      return { name: '---', class: ' ' };
    }
    const canonicalName = getCanonicalModName(period.name);
    let className = ' ';

    if (canonicalName === 'SHIELD TIME') {
        className = studentSchedule.shieldRoom ? `Room: ${studentSchedule.shieldRoom}` : ' ';
    } else if (canonicalName.startsWith('Mod')) {
        const scheduleEntry = studentSchedule.days[dayOfWeek]?.[canonicalName];
        className = scheduleEntry?.className || ' ';
    } else {
        className = period.class || ' ';
    }

    return { name: canonicalName, class: className };
  };

  const currentDetails = getPeriodDetails(currentPeriod);
  const nextDetails = getPeriodDetails(nextPeriod);

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6 flex flex-col items-center shadow-2xl shadow-[#c8102e]/20 border border-[#A7A9AC]/30">
      <div className="mb-6">
        <CircularProgress
          percentage={percentageComplete}
          time={timeRemaining}
          urgencyLevel={urgencyLevel}
          periodName={currentPeriod?.name}
        />
      </div>
      
      <div className="text-center w-full">
        <p className="text-sm font-medium text-[#c8102e] uppercase tracking-wider">Current Period</p>
        <h2 className="text-3xl font-bold text-white truncate" title={currentDetails.name}>{currentDetails.name || 'Loading...'}</h2>
        <p className="text-lg text-[#E6E7E8] h-7 truncate" title={currentDetails.class}>{currentDetails.class}</p>
      </div>

      <div className="border-t border-[#A7A9AC]/50 w-full my-6"></div>

      <div className="text-center w-full">
        <p className="text-sm font-medium text-[#A7A9AC] uppercase tracking-wider">Up Next</p>
        <h3 className="text-2xl font-semibold text-[#E6E7E8] truncate" title={nextDetails.name}>{nextDetails.name}</h3>
        <p className="text-md text-[#A7A9AC] h-6 truncate" title={nextDetails.class}>{nextDetails.class}</p>
      </div>
    </div>
  );
};

export default Dashboard;