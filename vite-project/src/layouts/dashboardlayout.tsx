import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar";

const DashboardLayout = ({ children }: any) => {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-slate-100">

        <Topbar />

        {children}

      </div>

    </div>
  );
};

export default DashboardLayout;