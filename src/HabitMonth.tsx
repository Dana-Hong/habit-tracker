import HabitWeek from "./HabitWeek";
import { HabitDayStats } from "./App";

type HabitMonthProps = {
    className?: string;
    weekHistory: HabitDayStats[];
}

const HabitMonth = ({ className, weekHistory }: HabitMonthProps ) => {

    return (
        <div className="flex flex-col gap-0.5">
            {weekHistory.map((week, index) => {
                return <HabitWeek key={index} weekHistory={weekHistory} />
            })}
        </div>
    )
}

export default HabitMonth;