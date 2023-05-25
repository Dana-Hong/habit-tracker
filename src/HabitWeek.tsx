import HabitSquare from "./HabitSquare";

import { HabitDayStats } from "./App";

type HabitWeekProps = {
    className?: string;
    weekHistory: HabitDayStats[];
}

const HabitWeek = ({ className, weekHistory }: HabitWeekProps ) => {

    return (
        <div className="flex flex-col gap-1">
            {weekHistory.map((day, index) => {
                return <HabitSquare key={index} dayHistory={day} />
            })}
        </div>
    )
}

export default HabitWeek;