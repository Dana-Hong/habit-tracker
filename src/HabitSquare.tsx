import { HabitDayStats } from "./App";

type HabitSquareProps = {
    className?: string;
    dayHistory: HabitDayStats;
    
}

const HabitSquare = ({ className, dayHistory }: HabitSquareProps) => {
    return (
        <div className={`h-4 w-4 border ${dayHistory.completed ? 'bg-red-300' : ''}`}>
        </div>
    )
}

export default HabitSquare;