import type { Mod, Schedules } from './types';

type RawMod = Omit<Mod, 'id' | 'class'>;

// This helper function takes an array of mods and intelligently inserts passing periods into the gaps between them.
function generateFullSchedule(rawMods: RawMod[]): Mod[] {
    const fullSchedule: Mod[] = [];
    let idCounter = 0;

    const sortedMods = rawMods.sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (let i = 0; i < sortedMods.length; i++) {
        const currentMod = sortedMods[i];

        if (i > 0) {
            const prevMod = sortedMods[i - 1];
            if (currentMod.startTime > prevMod.endTime) {
                fullSchedule.push({
                    id: `p${idCounter++}`,
                    name: 'Passing Period',
                    class: '',
                    startTime: prevMod.endTime,
                    endTime: currentMod.startTime,
                });
            }
        }

        fullSchedule.push({
            id: `m${idCounter++}`,
            class: '', // Class name will be populated from the student's schedule
            ...currentMod
        });
    }
    return fullSchedule;
}

// Raw schedule data transcribed from the CSV file
const rawScheduleData: { [key: string]: RawMod[] } = {
    'M-T-TH-F': [
        { name: 'SHIELD TIME', startTime: '08:00', endTime: '08:10' },
        { name: 'Mod 1', startTime: '08:15', endTime: '08:52' },
        { name: 'Mod 2', startTime: '08:57', endTime: '09:34' },
        { name: 'Mod 3', startTime: '09:39', endTime: '10:16' },
        { name: 'Mod 4 (Lunch A)', startTime: '10:21', endTime: '10:58' },
        { name: 'Mod 5 (Lunch B)', startTime: '11:03', endTime: '11:40' },
        { name: 'Mod 6 (Lunch C)', startTime: '11:45', endTime: '12:22' },
        { name: 'Mod 7 (Lunch D)', startTime: '12:27', endTime: '13:04' },
        { name: 'Mod 8', startTime: '13:09', endTime: '13:46' },
        { name: 'Mod 9', startTime: '13:51', endTime: '14:28' },
        { name: 'Mod 10', startTime: '14:33', endTime: '15:10' },
    ],
    'Wednesday': [
        { name: 'Mod 1', startTime: '08:00', endTime: '08:41' },
        { name: 'Mod 2', startTime: '08:46', endTime: '09:22' },
        { name: 'Mod 3', startTime: '09:27', endTime: '10:03' },
        { name: 'Mod 4 (Lunch A)', startTime: '10:08', endTime: '10:44' },
        { name: 'Mod 5 (Lunch B)', startTime: '10:49', endTime: '11:25' },
        { name: 'Mod 6 (Lunch C)', startTime: '11:30', endTime: '12:06' },
        { name: 'Mod 7 (Lunch D)', startTime: '12:11', endTime: '12:47' },
        { name: 'Mod 8', startTime: '12:52', endTime: '13:28' },
        { name: 'Mod 9', startTime: '13:33', endTime: '14:09' },
        { name: 'Mod 10', startTime: '14:14', endTime: '14:50' },
    ],
    '1:10 Dismissal': [
        { name: 'Mod 1', startTime: '08:00', endTime: '08:31' },
        { name: 'Mod 2', startTime: '08:36', endTime: '09:02' },
        { name: 'Mod 3', startTime: '09:07', endTime: '09:33' },
        { name: 'Mod 4 (Lunch A)', startTime: '09:38', endTime: '10:04' },
        { name: 'Mod 5 (Lunch B)', startTime: '10:09', endTime: '10:35' },
        { name: 'Mod 6 (Lunch C)', startTime: '10:40', endTime: '11:06' },
        { name: 'Mod 7 (Lunch D)', startTime: '11:11', endTime: '11:37' },
        { name: 'Mod 8', startTime: '11:42', endTime: '12:08' },
        { name: 'Mod 9', startTime: '12:13', endTime: '12:39' },
        { name: 'Mod 10', startTime: '12:44', endTime: '13:10' },
    ],
    '12:10 Dismissal': [
        { name: 'Mod 1', startTime: '08:00', endTime: '08:25' },
        { name: 'Mod 2', startTime: '08:30', endTime: '08:50' },
        { name: 'Mod 3', startTime: '08:55', endTime: '09:15' },
        { name: 'Mod 4 (Lunch A)', startTime: '09:20', endTime: '09:40' },
        { name: 'Mod 5 (Lunch B)', startTime: '09:45', endTime: '10:05' },
        { name: 'Mod 6 (Lunch C)', startTime: '10:10', endTime: '10:30' },
        { name: 'Mod 7 (Lunch D)', startTime: '10:35', endTime: '10:55' },
        { name: 'Mod 8', startTime: '11:00', endTime: '11:20' },
        { name: 'Mod 9', startTime: '11:25', endTime: '11:45' },
        { name: 'Mod 10', startTime: '11:50', endTime: '12:10' },
    ],
    '2-Hr Late Start': [
        { name: 'Mod 1', startTime: '10:00', endTime: '10:35' },
        { name: 'Mod 2', startTime: '10:40', endTime: '11:05' },
        { name: 'Mod 3', startTime: '11:10', endTime: '11:35' },
        { name: 'Mod 4 (Lunch A)', startTime: '11:40', endTime: '12:05' },
        { name: 'Mod 5 (Lunch B)', startTime: '12:10', endTime: '12:35' },
        { name: 'Mod 6 (Lunch C)', startTime: '12:40', endTime: '13:05' },
        { name: 'Mod 7 (Lunch D)', startTime: '13:10', endTime: '13:35' },
        { name: 'Mod 8', startTime: '13:40', endTime: '14:05' },
        { name: 'Mod 9', startTime: '14:10', endTime: '14:35' },
        { name: 'Mod 10', startTime: '14:40', endTime: '15:10' },
    ],
    'Assembly/Rally': [
        { name: 'Mod 1', startTime: '08:00', endTime: '08:40' },
        { name: 'Mod 2', startTime: '08:45', endTime: '09:20' },
        { name: 'ASSEMBLY OR SHIELD TIME', startTime: '09:25', endTime: '09:50' },
        { name: 'Mod 3', startTime: '09:55', endTime: '10:30' },
        { name: 'Mod 4 (Lunch A)', startTime: '10:35', endTime: '11:10' },
        { name: 'Mod 5 (Lunch B)', startTime: '11:15', endTime: '11:50' },
        { name: 'Mod 6 (Lunch C)', startTime: '11:55', endTime: '12:30' },
        { name: 'Mod 7 (Lunch D)', startTime: '12:35', endTime: '13:10' },
        { name: 'Mod 8', startTime: '13:15', endTime: '13:50' },
        { name: 'Mod 9', startTime: '13:55', endTime: '14:30' },
        { name: 'Mod 10', startTime: '14:35', endTime: '15:10' },
    ],
};


// Process the raw data into full schedules and export
export const SCHEDULES: Schedules = Object.entries(rawScheduleData).reduce((acc, [key, mods]) => {
    acc[key] = generateFullSchedule(mods);
    return acc;
}, {} as Schedules);