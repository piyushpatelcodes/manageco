import ThemeToggle from "./Theme-toggle";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#18181b] border-b border-gray-200 dark:border-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Craftboard Project</h1>
        <div className="flex space-x-4 mt-2">
          <button className="border-b-2 border-indigo-600 dark:border-indigo-400 pb-1 text-indigo-600 dark:text-indigo-300">List</button>
          <button className="text-gray-400 dark:text-gray-500">Kanban</button>
          <button className="text-gray-400 dark:text-gray-500">Timeline</button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {/* Avatars */}
        {/* <div className="flex -space-x-2">
          <img src="/vercel.svg" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900" />
          <img src="/vercel.svg" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900" />
        </div> */}
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg ml-4 hover:bg-indigo-700">
          <a href="/upload" className="no-underline text-white">

          + New Project
          </a>
          </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
