import { useState } from "react";

import EmptyCircle from "./checkbox-blank-circle-line";
import CheckBoxCircle from "./checkbox-circle-line";

type Habit = {
  name: string;
  completed: boolean;
}

function App() {
  const [habitList, setHabitList] = useState<[] | Habit[]>([ {name: 'Walk for 20 minutes', completed: false} ]);
  const [habitName, setHabitName] = useState<string>('');

  return (
    <>
      <div className="h-screen w-screen bg-gray-900 flex justify-center items-center">
        <div>
          <div className="flex flex-col gap-2">
            {
              habitList.map((habitItem, habitIndex) =>
                <div 
                  className="flex justify-between items-center p-2 bg-gray-300"
                  onClick={() => console.log(habitItem.name)}
                >
                  <p className={habitItem.completed ? 'line-through' : ''} >{habitItem.name}</p>
                    <div
                      onClick={
                        () => {
                          setHabitList(prevHabitList => {
                            return prevHabitList.map((habitItem, index) => {
                              return (habitIndex === index) ? { ...habitItem, completed: !habitItem.completed } : habitItem
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
                  setHabitList(prevHabitList => [...prevHabitList, { name: habitName, completed: false } ]);
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
