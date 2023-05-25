import HabitSquare from "./HabitSquare";

type HabitWeekProps = {
    className?: string
}

const HabitWeek = ({ className }: HabitWeekProps ) => {
    return (
        <div className="flex flex-col gap-1">
            <HabitSquare />
            <HabitSquare />
            <HabitSquare />
            <HabitSquare />
            <HabitSquare />
            <HabitSquare />
            <HabitSquare />
        </div>
    )
}

export default HabitWeek;