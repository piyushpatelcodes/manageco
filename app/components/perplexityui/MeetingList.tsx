import React from 'react';
import Link from 'next/link';

export default function MeetingsList() {
  const meetings = [
    {
      id: 1,
      time: '10:00',
      period: 'AM',
      title: 'Present the project',
      description: 'and gather feedback',
      hasVideo: true
    },
    {
      id: 2,
      time: '01:00',
      period: 'PM',
      title: 'Meeting',
      description: 'with UX team',
      hasAudio: true
    },
    {
      id: 3,
      time: '03:00',
      period: 'PM',
      title: 'Onboarding',
      description: 'of the project'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-lg font-medium">Today's meetings</h3>
          <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full">5</span>
        </div>
        <Link href="#" className="text-blue-500 text-sm hover:text-blue-400">
          View all
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="bg-gray-800 p-3 rounded-lg ">
            <div className="flex items-start mb-1">
              <span className="text-gray-400 text-xs">{meeting.period}</span>
              <span className="text-white font-bold text-base ml-1">{meeting.time}</span>
            </div>
            
            <p className="text-white text-sm font-medium">{meeting.title}</p>
            <p className="text-gray-400 text-xs">{meeting.description}</p>
            
            <div className="flex justify-end mt-2">
              {meeting.hasVideo && (
                <div className="w-6 h-6 rounded-full bg-red-900 flex items-center justify-center">
                  <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                  </svg>
                </div>
              )}
              
              {meeting.hasAudio && (
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-blue-500 text-sm font-medium">Schedule meeting</p>
        </div>
      </div>
    </div>
  );
}
