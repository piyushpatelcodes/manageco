import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/TopBar";
import TaskTable from "../components/dashboard/TaskTable";


export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#18181b]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <TaskTable  />
        </main>
      </div>
    </div>
  );
}
