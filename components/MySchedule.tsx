import React, { useState } from 'react';
import type { StudentSchedule } from '../types';

interface MyScheduleProps {
  studentSchedule: StudentSchedule;
  setStudentSchedule: (schedule: StudentSchedule) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MODS = Array.from({ length: 10 }, (_, i) => `Mod ${i + 1}`);

const MySchedule: React.FC<MyScheduleProps> = ({ studentSchedule, setStudentSchedule }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSchedule, setLocalSchedule] = useState<StudentSchedule>(studentSchedule);

  const handleInputChange = (day: string, mod: string, field: 'className' | 'room', value: string) => {
    setLocalSchedule(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...(prev.days[day] || {}),
          [mod]: {
            ...(prev.days[day]?.[mod] || { className: '', room: '' }),
            [field]: value,
          },
        },
      }
    }));
  };
  
  const handleShieldRoomChange = (value: string) => {
    setLocalSchedule(prev => ({
      ...prev,
      shieldRoom: value,
    }));
  };

  const handleSave = () => {
    setStudentSchedule(localSchedule);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setLocalSchedule(studentSchedule);
    setIsEditing(false);
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-center text-[#E6E7E8]">My Week at a Glance</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-bold bg-[#c8102e] rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#c8102e]"
          >
            Edit Schedule
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-bold bg-[#3A3A3C] rounded-md hover:bg-[#4A4A4C] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-bold bg-[#c8102e] rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#c8102e]"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#A7A9AC]/30 mb-6">
        <h3 className="text-lg font-bold text-white mb-3">Special Periods</h3>
        <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-1">
                <p className="text-sm font-semibold text-[#A7A9AC]">SHIELD TIME</p>
            </div>
            {isEditing ? (
                <div className="col-span-4">
                    <input
                        type="text"
                        placeholder="Room #"
                        value={localSchedule.shieldRoom || ''}
                        onChange={(e) => handleShieldRoomChange(e.target.value)}
                        className="w-full bg-[#3A3A3C] text-white text-sm rounded-md p-2 border border-[#A7A9AC]/50 focus:ring-1 focus:ring-[#c8102e] focus:border-[#c8102e] focus:outline-none"
                    />
                </div>
            ) : (
                <div className="col-span-4 bg-[#2C2C2E] p-2 rounded-md min-h-[40px]">
                    {studentSchedule.shieldRoom ? (
                        <p className="text-sm text-white">Room: {studentSchedule.shieldRoom}</p>
                    ) : (
                        <p className="text-sm text-white/40 italic">Not set</p>
                    )}
                </div>
            )}
        </div>
      </div>


      <div className="space-y-4">
        {DAYS.map(day => (
          <div key={day} className="bg-[#1A1A1A] rounded-lg p-4 border border-[#A7A9AC]/30">
            <h3 className="text-lg font-bold text-white mb-3">{day}</h3>
            <div className="space-y-3">
              {MODS.map(mod => (
                <div key={mod} className="grid grid-cols-5 gap-2 items-center">
                  <div className="col-span-1">
                    <p className="text-sm font-semibold text-[#A7A9AC]">{mod}</p>
                  </div>
                  {isEditing ? (
                    <>
                      <div className="col-span-2">
                         <input
                           type="text"
                           placeholder="Class Name"
                           value={localSchedule.days[day]?.[mod]?.className || ''}
                           onChange={(e) => handleInputChange(day, mod, 'className', e.target.value)}
                           className="w-full bg-[#3A3A3C] text-white text-sm rounded-md p-2 border border-[#A7A9AC]/50 focus:ring-1 focus:ring-[#c8102e] focus:border-[#c8102e] focus:outline-none"
                         />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Room #"
                          value={localSchedule.days[day]?.[mod]?.room || ''}
                          onChange={(e) => handleInputChange(day, mod, 'room', e.target.value)}
                          className="w-full bg-[#3A3A3C] text-white text-sm rounded-md p-2 border border-[#A7A9AC]/50 focus:ring-1 focus:ring-[#c8102e] focus:border-[#c8102e] focus:outline-none"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="col-span-4 bg-[#2C2C2E] p-2 rounded-md min-h-[40px]">
                      <p className="text-sm font-medium text-white">{studentSchedule.days[day]?.[mod]?.className || <span className="text-white/40 italic">Not set</span>}</p>
                      {studentSchedule.days[day]?.[mod]?.room && (
                        <p className="text-xs text-[#A7A9AC]">Room: {studentSchedule.days[day]?.[mod]?.room}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySchedule;