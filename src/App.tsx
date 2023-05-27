import { useEffect, useState } from "react";

import { compareAsc, isYesterday, startOfDay, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, sub } from "date-fns";

import EmptyCircle from "./checkbox-blank-circle-line";
import CheckBoxCircle from "./checkbox-circle-line";
import HabitYear from "./HabitYear";

export type HabitDayStats = {
  date: Date;
  completed: boolean;
}

type Habit = {
  name: string;
  completed: boolean;
  currentStreak: number;
  history: HabitDayStats[];
  showMenu: boolean;
  viewStats: boolean;
  // startDate: Date;
}

function App() {
  const [habitList, setHabitList] = useState<[] | Habit[]>(JSON.parse(localStorage.getItem('habitList') as string));
  const [habitName, setHabitName] = useState<string>('');
  const [previousDate] = useState<Date>(new Date(JSON.parse(localStorage.getItem('prevDate') as string)));

  const getLastTwelveMonthDateIntervals = () => {
    const LAST_YEAR_IN_MONTHS = [];
    // const LAST_ELEVEN_MONTHS = [];
    const PREV_YEAR_START_OF_FIRST_MONTH = startOfWeek(sub(new Date(Date.now()), { years: 1 }), { weekStartsOn: 0 });
    const PREV_YEAR_END_OF_FIRST_MONTH = endOfMonth(sub(new Date(Date.now()), { years: 1 }));
    const PREV_YEAR_FIRST_MONTH = eachDayOfInterval({ start: PREV_YEAR_START_OF_FIRST_MONTH, end: PREV_YEAR_END_OF_FIRST_MONTH }).map(day => ({ date: day, completed: false}));
    // const CURRENT_YEAR_START_OF_MONTH;
    // const CURRENT_YEAR_END_OF_MONTH = endOfMonth()

    LAST_YEAR_IN_MONTHS.push(PREV_YEAR_FIRST_MONTH);

    for (let i = 10; i >= 0; i--) {
      const month = sub(new Date(Date.now()), { months: i });
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthInterval = eachDayOfInterval({ start: monthStart, end: monthEnd });

      LAST_YEAR_IN_MONTHS.push(monthInterval);
    }

    return LAST_YEAR_IN_MONTHS;
    
  }

  console.log(getLastTwelveMonthDateIntervals());

  useEffect(() => {
    if (isYesterday(previousDate)) {
      setHabitList(prevHabitList => {
        return prevHabitList.map(habitItem => {
          if (habitItem.completed) {
            return {
              ...habitItem,
              completed: false
            }
          }
          return {
            ...habitItem,
            currentStreak: 0
          }
        });
      });

      localStorage.setItem('prevDate', JSON.stringify(startOfDay(new Date(Date.now()))));
    }

  }, []);

  useEffect(() => {
    localStorage.setItem('habitList', JSON.stringify(habitList));
  }, [habitList]);

  return (
    <>
      <div className="h-screen w-screen bg-gray-950 px-4 text-slate-300">
        <h1 className="text-center p-12 text-5xl">Habit Tracker</h1>
        <div className="mx-auto max-w-sm flex justify-between gap-4 mt-2">
            <input 
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              type="text"
              name="habit"
              id="habit"
              placeholder="Habit name"
              className="max-w-sm pl-3 placeholder-gray-400 rounded-lg basis-64 outline-green-700 bg-gray-700"
            />
            <button
              onClick={
                () => {
                  if (!habitName) return;
                  
                  const PREVIOUS_YEAR_START_OF_WEEK = startOfWeek(sub(new Date(Date.now()), { years: 1 }), { weekStartsOn: 0 });
                  const CURRENT_YEAR_END_OF_WEEK = new Date(Date.now());
                  const ANNUAL_HISTORY = eachDayOfInterval({ start: PREVIOUS_YEAR_START_OF_WEEK, end: CURRENT_YEAR_END_OF_WEEK }).map(day => ({ date: day, completed: false}))

                  setHabitList(prevHabitList => 
                    [...prevHabitList,
                      { 
                        name: habitName,
                        completed: false,
                        currentStreak: 0,
                        history: ANNUAL_HISTORY,
                        showMenu: false,
                        viewStats: false
                      } 
                    ]);
                  setHabitName('');
                }
              }
              className="block bg-gray-700 py-2 px-4 rounded-lg border border-gray-800"
              >
              New habit
            </button>
          </div>
        <div>
          <div className="flex flex-col gap-8 pt-12">
            {
              habitList.map((habitItem, habitIndex) =>
                <div 
                  className="flex justify-center items-start gap-3"
                  key={habitIndex}
                  >
                    <div className="w-full max-w-sm border-2 border-slate-700 rounded-md bg-gray-900 cursor-pointer">
                      <div
                        onClick={
                          () => {
                            setHabitList(prevHabitList => {
                              return prevHabitList.map((habitItem, index) => {
                                return (habitIndex === index) ? { ...habitItem, showMenu: !habitItem.showMenu } : habitItem
                              });
                            })
                          }
                        }
                        className="flex justify-between items-center p-3"
                      >
                        <p className={habitItem.completed ? 'line-through' : ''} >{habitItem.name}</p>
                        <div
                          onClick={
                            () => {
                              setHabitList(prevHabitList => {
                                return prevHabitList.map((habitItem, index) => {
                                  return (habitIndex === index) 
                                  ? 
                                    { 
                                      ...habitItem,
                                      history: eachDayOfInterval(
                                        { 
                                          start: startOfWeek(sub(new Date(Date.now()), { years: 1 }), { weekStartsOn: 0 }),
                                          end: new Date(Date.now()),
                                        })
                                            .map(day => 
                                              {
                                                if (compareAsc(new Date(day), startOfDay(new Date(Date.now()))) === 0) {
                                                  return {
                                                    date: day,
                                                    completed: !habitItem.completed 
                                                  }
                                                }
                                                return {
                                                  date: day,
                                                  completed: false
                                                }
                                              }),
                                      completed: !habitItem.completed,
                                      currentStreak: !habitItem.completed
                                      ? habitItem.currentStreak + 1 
                                      : habitItem.currentStreak - 1,
                                      viewStats: false
                                    }
                                  : habitItem
                                });
                              })
                            }
                          }
                          >
                          {
                            habitItem.completed ? 
                            <CheckBoxCircle className="h-6 w-6 fill-green-600" />
                            :
                            <EmptyCircle className="h-6 w-6 fill-slate-400"/>
                          }
                        </div>
                      </div>
                      <div
                        className={`${habitItem.showMenu ? '' : 'hidden'} flex flex-col gap-2 p-4 text-sm border-t-2 rounded-b-md border-t-gray-800 bg-gray-900`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <div
                            className="py-1 px-2 border-2 bg-yellow-600 bg-opacity-10 border-yellow-600 cursor-pointer rounded-md"
                            >
                            Skip
                          </div>
                          <div
                            className="py-1 px-2 border-2 bg-blue-600 bg-opacity-10 border-blue-600 cursor-pointer rounded-md"
                            onClick={
                              () => {
                                setHabitList(prevHabitList => {
                                  return prevHabitList.map((habitItem, index) => {
                                    return (habitIndex === index) ? { ...habitItem, viewStats: !habitItem.viewStats } : habitItem
                                  });
                                })
                              }
                            }
                            >
                            View Stats
                          </div>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <p>Current Streak: {habitItem.currentStreak}</p>
                          <div
                            className="py-1 px-2 border-2 bg-red-600 bg-opacity-10 border-red-600 cursor-pointer rounded-md"
                            onClick={
                              () =>
                              setHabitList(prevHabitList => {
                                return prevHabitList.filter((habitItem, index) => {
                                  if (habitIndex !== index) return habitItem
                                });
                              })
                            }
                            >
                            <p>Delete</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  <HabitYear className={habitItem.viewStats ? 'opacity-0' : 'opacity-100'} history={habitItem.history} />
                </div>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
