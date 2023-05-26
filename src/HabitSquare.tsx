import { HabitDayStats } from "./App";

type HabitSquareProps = {
    className?: string;
    dayHistory: HabitDayStats;
    
}

const HabitSquare = ({ className, dayHistory }: HabitSquareProps) => {
    return (
        <div className={`h-4 w-4 rounded border border-slate-500 ${dayHistory.completed ? 'bg-red-300' : 'bg-gray-800'}`}>
        </div>
        
    )
}

export default HabitSquare;