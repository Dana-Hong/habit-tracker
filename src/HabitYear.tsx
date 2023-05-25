import HabitSquare from "./HabitSquare";
import HabitWeek from "./HabitWeek";

import { HabitDayStats } from "./App";

type HabitYearProps = {
    className?: string;
    history: HabitDayStats[];
}
 
const HabitYear = ({ className, history }: HabitYearProps) => {
    
    const separateWeeks = (history: HabitDayStats[]) => {
        const splitWeeksHistory: HabitDayStats[][] = [];

        for (let i = 0; i < 365; i+=7) {
            const weekEnd = i + 7;
            splitWeeksHistory.push(history.slice(i, weekEnd)); 
        }

        return splitWeeksHistory;
    }
    
    
    return (
        <div className="flex gap-1">
            {separateWeeks(history).map(week => (
                <HabitWeek weekHistory={week} />
            ))}
        </div>
    )
}

export default HabitYear