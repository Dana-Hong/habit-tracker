import { compareAsc, format, parseISO } from 'date-fns'
import { HabitDayStats } from "./App";
import { Tooltip } from 'flowbite-react'

type HabitSquareProps = {
    className?: string;
    dayHistory: HabitDayStats;
    
}

const HabitSquare = ({ className, dayHistory }: HabitSquareProps) => {
    return (
        <Tooltip content={format(new Date(dayHistory.date), 'EEEE, MMMM dd yyyy')}>
            <div className={`h-4 w-4 rounded border border-slate-500 ${dayHistory.completed ? 'bg-green-600' : 'bg-gray-800'} cursor-pointer`}>
            </div>
        </Tooltip>
    )
}

export default HabitSquare;