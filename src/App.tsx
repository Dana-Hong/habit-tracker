import { useEffect, useState } from "react";

import { isYesterday, startOfDay } from "date-fns";

import EmptyCircle from "./checkbox-blank-circle-line";
import CheckBoxCircle from "./checkbox-circle-line";

type Habit = {
  name: string;
  completed: boolean;
  currentStreak: number;
  showMenu: boolean;
  // startDate: Date;
}

function App() {
  const [habitList, setHabitList] = useState<[] | Habit[]>([ {name: 'Walk for 20 minutes', completed: false, currentStreak: 0, showMenu: false, /*startDate: startOfDay(Date.now())*/ } ]);
  const [habitName, setHabitName] = useState<string>('');
  const [previousDate, setPreviousDate] = useState<Date>(new Date(JSON.parse(localStorage.getItem('prevDate') as string)));

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

  return (
    <>
      <div className="h-screen w-screen bg-gray-900 flex justify-center items-center">
        <div>
          <div className="flex flex-col gap-2">
            {
              habitList.map((habitItem, habitIndex) =>
                <div key={habitIndex}>
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
                              return (habitIndex === index) ? { ...habitItem, completed: !habitItem.completed, currentStreak: !habitItem.completed ? habitItem.currentStreak + 1 : habitItem.currentStreak - 1 } : habitItem
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
                    className={`${habitItem.showMenu ? '' : 'hidden'} p-2 border border-t-black bg-gray-300`}
                  >
                    <div className="flex justify-between">
                      <p>Skip</p>
                      <p>Delete</p>
                    </div>
                    <p>Current Streak: {habitItem.currentStreak}</p>
                  </div>
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
                  setHabitList(prevHabitList => 
                    [...prevHabitList,
                      { 
                        name: habitName,
                        completed: false,
                        currentStreak: 0,
                        showMenu: false
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
