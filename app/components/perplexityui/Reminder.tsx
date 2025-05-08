import React from 'react';
import Link from 'next/link';

export default function Reminders() {
  const reminders = [
    {
      id: 1,
      time: '09:30',
      period: 'AM',
      title: 'Check test results',
      priority: 'Low',
    },
    {
      id: 2,
      time: '10:00',
      period: 'AM',
      title: 'Client Presentation',
      priority: 'High',
    },
    {
      id: 3,
      time: '04:15',
      period: 'PM',
      title: 'Add new subtask to Doctor+ analysis',
      priority: 'High',
    },
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg font-medium">Reminders</h3>
        <Link href="#" className="text-blue-500 text-sm hover:text-blue-400">
          Manage
        </Link>
      </div>
      
      <div className="space-y-4 mb-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between mb-1">
              <div className="flex items-baseline gap-1">
                <span className="text-white font-bold text-xl">{reminder.time}</span>
                <span className="text-gray-400 text-sm">{reminder.period}</span>
              </div>
              <div className={`flex items-center ${getPriorityColor(reminder.priority)}`}>
                <span className={`w-2 h-2 rounded-full bg-${reminder.priority === 'High' ? 'red' : reminder.priority === 'Medium' ? 'yellow' : 'green'}-500 mr-1`}></span>
                <span className="text-xs">{reminder.priority}</span>
              </div>
            </div>
            
            <p className="text-white text-sm">
              {reminder.title}
            </p>
          </div>
        ))}
      </div>
      
      <button className="bg-gray-800 hover:bg-gray-700 text-blue-500 w-full py-3 rounded-lg text-sm">
        Add reminder
      </button>
    </div>
  );
}
