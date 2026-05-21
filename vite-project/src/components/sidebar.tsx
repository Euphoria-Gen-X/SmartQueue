import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Clock3,
  History,
  Settings
} from "lucide-react";
const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-violet-700 text-white p-6">

      <h1 className="text-2xl font-bold mb-10">
        SmartQueue
      </h1>

      <ul className="space-y-6">

  <Link to="/dashboard">
    <li className="hover:text-violet-200 cursor-pointer">

      <div className="flex items-center gap-3">
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </div>

    </li>
  </Link>

  <Link to="/booking">
    <li className="hover:text-violet-200 cursor-pointer">

      <div className="flex items-center gap-3">
        <CalendarCheck size={20} />
        <span>Book Appointment</span>
      </div>

    </li>
  </Link>

  <Link to="/queue">
    <li className="hover:text-violet-200 cursor-pointer">

      <div className="flex items-center gap-3">
        <Clock3 size={20} />
        <span>Queue Status</span>
      </div>

    </li>
  </Link>

  <Link to="/history">
    <li className="hover:text-violet-200 cursor-pointer">

      <div className="flex items-center gap-3">
        <History size={20} />
        <span>History</span>
      </div>

    </li>
  </Link>

  <Link to="/settings">
    <li className="hover:text-violet-200 cursor-pointer">

      <div className="flex items-center gap-3">
        <Settings size={20} />
        <span>Settings</span>
      </div>

    </li>
  </Link>

</ul>

    </div>
  );
};

export default Sidebar;