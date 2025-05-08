"use client"
import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function CalendarTimeline() {
  const days = ['MON 19', 'TUE 19', 'WED 20', 'THU 21', 'FRI 22'];
  const hours = ['09:00', '10:00', '11:00', '12:00', '01:00', '02:00'];
  
  const [tasks, setTasks] = useState([
    {
      id: 1, day: 'MON 19', time: '09:00', title: 'Design Brief Review', 
      description: 'Review project goals and objectives', status: 'Done',
      users: ['/avatar1.png', '/avatar2.png', '/avatar3.png'], duration: '01h 53m',
      comments: 118
    },
    {
      id: 2, day: 'TUE 19', time: '09:00', title: 'Typography & Layout Design', 
      description: 'Help with choose fonts and layout elements for the design', status: 'Done',
      users: ['/avatar1.png', '/avatar2.png'], duration: '', comments: 0
    },
    {
      id: 3, day: 'WED 20', time: '09:00', title: 'Color Palette Selection', 
      description: 'Create a harmonious color scheme', status: 'Medium',
      users: ['/avatar1.png', '/avatar3.png'], duration: '01h 24m', comments: 3
    },
    // Add more tasks for each day and time slot
  ]);

  // DnD handlers
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      // Handle drag end logic to update task positions
    }
  };

  const getPriorityColor = (status) => {
    switch(status) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-2xl font-semibold">Projects</h2>
        <button className="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm flex items-center">
          <span className="mr-2">Filter</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {/* Header with days */}
        <div className="grid grid-cols-5 border-b border-gray-800">
          {days.map((day, index) => (
            <div key={index} className="py-2 px-4 text-sm font-medium text-white border-r border-gray-800 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Timeline content */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="relative">
            {/* Time markers */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900 border-r border-gray-800 flex flex-col">
              {hours.map((hour, index) => (
                <div key={index} className="h-24 flex items-start pt-2 pl-2 text-xs text-gray-400">
                  {hour}
                </div>
              ))}
            </div>
            
            {/* Task grid */}
            <div className="ml-12">
              <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-5">
                  {/* Generate cells for each day column */}
                  {days.map((day, dayIndex) => (
                    <div key={dayIndex} className="border-r border-gray-800 last:border-r-0">
                      {hours.map((hour, hourIndex) => {
                        const tasksInThisCell = tasks.filter(t => t.day === day && t.time === hour);
                        return (
                          <div key={hourIndex} className="h-24 border-b border-gray-800 p-2">
                            {tasksInThisCell.map(task => (
                              <div key={task.id} className="bg-gray-800 rounded p-2 mb-2 text-sm">
                                {task.status && (
                                  <div className={`text-xs mb-1 ${getPriorityColor(task.status)}`}>
                                    {task.status !== 'Done' ? (
                                      <span className="flex items-center">
                                        <span className={`w-2 h-2 rounded-full ${
                                          task.status === 'High' ? 'bg-red-500' : 
                                          task.status === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        } mr-1`}></span>
                                        {task.status}
                                      </span>
                                    ) : (
                                      <span className="flex items-center">
                                        <span className="w-3 h-3 rounded-full border border-gray-500 flex items-center justify-center mr-1">
                                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                                        </span>
                                        Done
                                      </span>
                                    )}
                                  </div>
                                )}
                                <h4 className="font-medium text-white">{task.title}</h4>
                                <p className="text-gray-400 text-xs mt-1">{task.description}</p>
                                
                                {(task.users.length > 0 || task.duration || task.comments > 0) && (
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                                    {task.users.length > 0 && (
                                      <div className="flex -space-x-2">
                                        {task.users.map((user, idx) => (
                                          <div key={idx} className="w-6 h-6 rounded-full bg-gray-600 border-2 border-gray-800"></div>
                                        ))}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                      {task.duration && (
                                        <span className="flex items-center">
                                          <span className="w-3 h-3 mr-1">⏱️</span>
                                          {task.duration}
                                        </span>
                                      )}
                                      {task.comments > 0 && (
                                        <span className="flex items-center">
                                          <span className="w-3 h-3 mr-1">💬</span>
                                          {task.comments}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
