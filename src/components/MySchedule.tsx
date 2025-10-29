import React, { useState } from 'react';
import type { StudentSchedule } from '../types';

interface MyScheduleProps {
  studentSchedule: StudentSchedule;
  setStudentSchedule: (schedule: StudentSchedule) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MODS = Array.from({ length: 10 }, (_, i) => `Mod ${i + 1}`);

// A simple validator to check if the imported file has the correct structure.
const isValidSchedule = (data: any): data is StudentSchedule => {
  return data && typeof data.shieldRoom === 'string' && typeof data.days === 'object' && DAYS.every(day => typeof data.days[day] === 'object');
};


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
  
  const handleExport = () => {
    const jsonString = JSON.stringify(studentSchedule, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'whs-schedule.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File content is not readable text.");
        }
        const parsedData = JSON.parse(text);
        if (isValidSchedule(parsedData)) {
          setStudentSchedule(parsedData); // This will save to localStorage and update state
          setLocalSchedule(parsedData); // also update local state to match
          alert('Schedule imported successfully!');
        } else {
          alert('Error: The imported file is not a valid schedule file.');
        }
      } catch (error) {
        console.error('Failed to import schedule:', error);
        alert('Error: Could not read or parse the schedule file. Please make sure it is a valid .json file.');
      }
    };
    reader.readAsText(file);
    // Reset the input value to allow importing the same file again
    event.target.value = '';
  };


  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#E6E7E8]">My Week at a Glance</h2>
        {!isEditing ? (
          <div className="flex gap-2">
            <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-schedule-input" />
            <button
                onClick={() => document.getElementById('import-schedule-input')?.click()}
                className="px-4 py-2 text-sm font-bold bg-[#3A3A3C] rounded-md hover:bg-[#4A4A4C] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
            >
                Import
            </button>
             <button
                onClick={handleExport}
                className="px-4 py-2 text-sm font-bold bg-[#3A3A3C] rounded-md hover:bg-[#4A4A4C] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
            >
                Export
            </button>
            <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-bold bg-[#c8102e] rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#c8102e]"
            >
                Edit Schedule
            </button>
          </div>
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