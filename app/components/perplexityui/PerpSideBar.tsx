// components/layout/Sidebar.tsx
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-black flex flex-col items-center py-4 border-r border-gray-800">
      <div className="mb-10">
        <Link href="/">
          <div className="text-blue-500 w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
              <path d="M4 4h16v16H4V4z" />
            </svg>
          </div>
        </Link>
      </div>
      
      <nav className="flex flex-col items-center gap-6 mt-4">
        {[
          { icon: "grid", label: "Dashboard" },
          { icon: "file", label: "Documents" },
          { icon: "calendar", label: "Calendar" },
          { icon: "share", label: "Share" },
          { icon: "clock", label: "Time" },
        ].map((item, index) => (
          <Link 
            key={index} 
            href="#" 
            className="text-gray-400 hover:text-white w-10 h-10 flex items-center justify-center"
          >
            <div className="w-6 h-6">
              {/* Icon would go here */}
            </div>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto flex flex-col items-center gap-6 mb-6">
        {[
          { icon: "notification", label: "Notifications", count: 2 },
          { icon: "settings", label: "Settings" },
          { icon: "headphones", label: "Support" },
          { icon: "logout", label: "Logout" },
        ].map((item, index) => (
          <Link 
            key={index} 
            href="#" 
            className="relative text-gray-400 hover:text-white w-10 h-10 flex items-center justify-center"
          >
            <div className="w-6 h-6">
              {/* Icon would go here */}
            </div>
            {item.count && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                {item.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
