import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ScheduleView from './components/ScheduleView';
import MySchedule from './components/MySchedule';
import Nav from './components/Nav';
import { useBellSchedule } from './hooks/useBellSchedule';
import { useStudentSchedule } from './hooks/useStudentSchedule';
import { SCHEDULES } from './constants';

// Gets the default schedule for the current day.
const getDefaultScheduleForToday = (): string => {
  const day = new Date().getDay(); // Sunday = 0, Wednesday = 3
  if (day === 3) { // Wednesday
      return 'Wednesday';
  }
  // Default to M-T-TH-F for all other weekdays.
  return 'M-T-TH-F';
};

const App: React.FC = () => {
  const scheduleKeys = Object.keys(SCHEDULES);
  const [activeView, setActiveView] = React.useState<'dashboard' | 'my-schedule'>('dashboard');
  const [activeScheduleKey, setActiveScheduleKey] = React.useState(getDefaultScheduleForToday());
  const [studentSchedule, setStudentSchedule] = useStudentSchedule();
  
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDefault = getDefaultScheduleForToday();
      const isManualOverride = activeScheduleKey !== 'M-T-TH-F' && activeScheduleKey !== 'Wednesday';

      if (!isManualOverride && activeScheduleKey !== currentDefault) {
        setActiveScheduleKey(currentDefault);
      }
    }, 1000 * 60); 

    return () => clearInterval(intervalId);
  }, [activeScheduleKey]);

  const activeSchedule = SCHEDULES[activeScheduleKey];
  const { currentPeriod, nextPeriod, timeRemaining, percentageComplete, urgencyLevel } = useBellSchedule(activeSchedule);

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col items-center p-4 selection:bg-[#c8102e]/30">
      <div className="w-full max-w-md mx-auto">
        <Header />
        
        <Nav activeView={activeView} setActiveView={setActiveView} />

        {activeView === 'dashboard' && (
          <>
            <div className="my-8">
              <h3 className="text-md font-semibold text-center text-[#A7A9AC] mb-3 uppercase tracking-wider">Today's Schedule</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {scheduleKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveScheduleKey(key)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#c8102e] ${
                      activeScheduleKey === key
                        ? 'bg-[#c8102e] text-white shadow-md'
                        : 'bg-[#2C2C2E] text-[#E6E7E8] hover:bg-[#3A3A3C]'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <main>
              <Dashboard
                currentPeriod={currentPeriod}
                nextPeriod={nextPeriod}
                timeRemaining={timeRemaining}
                percentageComplete={percentageComplete}
                studentSchedule={studentSchedule}
                urgencyLevel={urgencyLevel}
              />
              <div className="mt-12">
                <h2 className="text-xl font-bold text-center text-[#E6E7E8] mb-4">Full Day Schedule</h2>
                <ScheduleView 
                  schedule={activeSchedule} 
                  currentPeriodId={currentPeriod?.id}
                  studentSchedule={studentSchedule}
                />
              </div>
            </main>
          </>
        )}

        {activeView === 'my-schedule' && (
          <MySchedule 
            studentSchedule={studentSchedule}
            setStudentSchedule={setStudentSchedule}
          />
        )}
      </div>
    </div>
  );
};

export default App;