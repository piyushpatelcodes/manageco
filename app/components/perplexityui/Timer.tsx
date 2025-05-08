"use client"
import { useState, useEffect } from 'react';

export default function Timer({ project, app }) {
  const [time, setTime] = useState({ minutes: 0, seconds: 57 });
  const [isRunning, setIsRunning] = useState(true);
  const limit = "06:00:00";
  
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => {
          const newSeconds = prev.seconds + 1;
          if (newSeconds === 60) {
            return { minutes: prev.minutes + 1, seconds: 0 };
          }
          return { ...prev, seconds: newSeconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-white text-xl font-semibold mb-1">{project}</h3>
      <p className="text-gray-400 text-sm mb-8">{app}</p>
      
      <div className="flex justify-center mb-8">
        <button 
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full ${isRunning ? 'bg-orange-500' : 'bg-green-500'} flex items-center justify-center`}
        >
          {isRunning ? (
            <span className="text-white font-bold">II</span>
          ) : (
            <span className="text-white">▶</span>
          )}
        </button>
      </div>
      
      <div className="flex justify-between items-center">
        <div >
          <p className="text-gray-400 text-xs mb-1">Today</p>
          <p className="text-white font-medium">
            {String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Limits</p>
          <p className="text-white font-medium">{limit}</p>
        </div>
      </div>
    </div>
  );
}
