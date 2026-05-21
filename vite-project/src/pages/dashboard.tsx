const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      
      {/* Page Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome back to SmartQueue
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-gray-500 text-sm">
            Total Appointments
          </h2>
          <p className="text-3xl font-bold text-violet-600 mt-2">
            128
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-gray-500 text-sm">
            Available Slots
          </h2>
          <p className="text-3xl font-bold text-violet-600 mt-2">
            24
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-gray-500 text-sm">
            Current Queue
          </h2>
          <p className="text-3xl font-bold text-violet-600 mt-2">
            12
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-gray-500 text-sm">
            Average Wait Time
          </h2>
          <p className="text-3xl font-bold text-violet-600 mt-2">
            15 min
          </p>
        </div>

      </div>

      {/* Queue Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Live Queue Status
        </h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div>
            <p className="text-gray-500">Now Serving</p>
            <h3 className="text-2xl font-bold text-violet-600">
              Token 21
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Your Token</p>
            <h3 className="text-2xl font-bold text-violet-600">
              Token 27
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Estimated Wait</p>
            <h3 className="text-2xl font-bold text-violet-600">
              18 mins
            </h3>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;