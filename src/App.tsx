import { useState } from "react";

function App() {
  const [habitList, setHabitList] = useState<[] | string[]>(['Time to conquer!']);
  const [habitName, setHabitName] = useState<string>('');

  return (
    <>
      <div className="h-screen w-screen bg-gray-900 flex justify-center items-center">
        <div>
          <div className="bg-gray-200">
            {
              habitList.map(habitItem =>
                <div className="flex justify-between items-center p-2">
                  <p>{habitItem}</p>
                  <button
                    onClick={() => setHabitList(prevHabitList => prevHabitList.slice(0, -1))}
                    className="text-gray-600 bg-gray-200 px-2 rounded-lg border border-gray-800"
                    >
                    x
                  </button>
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
                  setHabitList(prevHabitList => [...prevHabitList, habitName]);
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
