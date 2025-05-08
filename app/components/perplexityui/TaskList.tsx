import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { IReport } from '@/models/Report';
import Image from 'next/image';
import avatar from "@/public/avatar.jpeg"
export default function TasksList() {
    const [reports, setReports] = useState<IReport[]>([]);
  
  const tasks = [
    {
      id: 1,
      title: 'Color Palette Selection',
      app: 'OverK: Gamers App',
      color: 'bg-orange-500',
      icon: 'pause',
      starred: false
    },
    {
      id: 1,
      title: 'Color Palette Selection',
      app: 'OverK: Gamers App',
      color: 'bg-orange-500',
      icon: 'pause',
      starred: false
    },
    {
      id: 1,
      title: 'Color Palette Selection',
      app: 'OverK: Gamers App',
      color: 'bg-orange-500',
      icon: 'pause',
      starred: false
    },
    {
      id: 1,
      title: 'Color Palette Selection',
      app: 'OverK: Gamers App',
      color: 'bg-orange-500',
      icon: 'pause',
      starred: false
    },
    {
      id: 1,
      title: 'Color Palette Selection',
      app: 'OverK: Gamers App',
      color: 'bg-orange-500',
      icon: 'pause',
      starred: false
    },
    {
      id: 1,
      title: 'Color Palette Selection',
      app: 'OverK: Gamers App',
      color: 'bg-orange-500',
      icon: 'pause',
      starred: false
    },
    {
      id: 2,
      title: 'Creating Landing page for Guitar Tuner',
      app: 'Guitar Tuner',
      color: 'bg-blue-500',
      icon: 'play',
      starred: false
    },
    {
      id: 3,
      title: 'Competitive & functional analysis',
      app: 'Doctor+',
      color: 'bg-blue-500',
      icon: 'play',
      starred: false
    },
  ];

   useEffect(() => {
      const fetchReports = async () => {
        try {
          const data = await apiClient.getReports();
          setReports(data);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      };
  
      fetchReports();
    }, []);

  return (
    <div className="bg-gray-900 rounded-lg p-4 overflow-y-scroll h-[37vh] scroll-m-80 no-scrollbar">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-lg font-medium">Today&apos;s tasks</h3>
          <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Link href="#" className="text-blue-500 text-sm hover:text-blue-400">
          Manage
        </Link>
      </div>
      
      <div className="space-y-2">
        {reports.map((task) => (
          <div key={task._id?.toString()} className="bg-gray-800 p-3 rounded-lg flex items-center">
            <div className={` w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
              <Image height={10} width={10} alt='avatar' src={avatar} />
            </div>
            
            <div className="ml-3 flex-grow">
              <p className="text-white font-medium text-sm">{task.title}</p>
              <p className="text-gray-400 text-xs">{task.status}</p>
            </div>
            
            <button className="text-gray-400 hover:text-yellow-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
