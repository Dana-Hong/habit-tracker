import { useEffect, useState } from "react";

import { compareAsc, isYesterday, startOfDay, startOfWeek, endOfWeek, eachDayOfInterval, sub } from "date-fns";

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


  /**
   * use startOfWeek to get the beginning of the week from Today's date
   * use endOfWeek to get the beginning of the week from Today's date
   * use eachDayofInteral function get generate array of Dates using startOfWeek and endOfWeek
   * use map to convert each date into object that has the date, and "completed" field
   * use this array to create habitYear
   * each "Date object" needs to know whether it is complete or not
   * It is complete when it was completed on that day
   */

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
    // console.log(new Date(habitList.at(-1).history.at(-3).date))
    const PREVIOUS_YEAR_START_OF_WEEK = sub(startOfWeek(new Date(Date.now()), { weekStartsOn: 0 }), { years: 1 });
    const CURRENT_YEAR_END_OF_WEEK = endOfWeek(new Date(Date.now()), { weekStartsOn: 0 });
    const ANNUAL_HISTORY = eachDayOfInterval({ start: PREVIOUS_YEAR_START_OF_WEEK, end: CURRENT_YEAR_END_OF_WEEK }).map(day => ({ date: day, completed: false}))

    console.log(ANNUAL_HISTORY[0].date)
    console.log(habitList);

    // console.warn('date from list', new Date(ANNUAL_HISTORY[0].date));
    // console.warn('date.now', startOfDay(new Date(Date.now())))
    // console.log(compareAsc(new Date(ANNUAL_HISTORY[ANNUAL_HISTORY.length - 3].date), startOfDay(new Date(Date.now()))))

  }, [habitList]);

  return (
    <>
      <div className="h-screen w-screen bg-gray-900 flex flex-col justify-center items-center">
        <div>
          <div className="flex flex-col gap-2">
            {
              habitList.map((habitItem, habitIndex) =>
                <div 
                  className="flex"
                  key={habitIndex}
                  >
                    <div>
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
                        className="flex justify-between items-center p-2 bg-gray-300"
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
                                          end: endOfWeek(new Date(Date.now()), { weekStartsOn: 0 })})
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
                            <CheckBoxCircle className="h-6 w-6" />
                            :
                            <EmptyCircle className="h-6 w-6"/>
                          }
                        </div>
                      </div>
                      <div
                        className={`${habitItem.showMenu ? '' : 'hidden'} flex flex-col gap-2 p-2 border border-t-black bg-gray-300`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <div
                            className="p-2 border border-gray-900 cursor-pointer"
                            >
                            Skip
                          </div>
                          <div
                            className="p-2 border border-gray-900 cursor-pointer"
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
                            className="p-2 border border-gray-900 cursor-pointer"
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
                  {habitItem.viewStats && <HabitYear history={habitItem.history} />}
                </div>
              )
            }
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <input 
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              type="text"
              name="habit"
              id="habit"
              placeholder="Habit name"
              className="px-1"
            />
            <button
              onClick={
                () => {
                  if (!habitName) return;
                  
                  const PREVIOUS_YEAR_START_OF_WEEK = startOfWeek(sub(new Date(Date.now()), { years: 1 }), { weekStartsOn: 0 });
                  const CURRENT_YEAR_END_OF_WEEK = endOfWeek(new Date(Date.now()), { weekStartsOn: 0 });
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
              className="text-slate-200 bg-gray-700 py-2 px-4 rounded-lg border border-gray-800"
              >
              Add new habit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
