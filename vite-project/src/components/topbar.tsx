import { useNavigate } from "react-router-dom";
const Topbar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white px-8 py-4 shadow-sm flex justify-between items-center">
   x
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 rounded-xl px-4 py-2 w-72 outline-none focus:ring-2 focus:ring-violet-500"
      />

      <div className="flex items-center gap-4">

       <button
  onClick={() => navigate("/login")}
  className="bg-violet-700 text-white px-5 py-2 rounded-xl hover:bg-violet-800 transition-all"
>
  Logout
</button>

      </div>

    </div>
  );
};

export default Topbar;