const QueueStatus = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Queue Status
        </h1>

        <p className="text-gray-500 mt-2">
          Track your live appointment queue
        </p>
      </div>

      {/* Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Now Serving */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">

          <p className="text-gray-500">
            Now Serving
          </p>

          <h2 className="text-4xl font-bold text-violet-700 mt-3">
            21
          </h2>

        </div>

        {/* Your Token */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">

          <p className="text-gray-500">
            Your Token
          </p>

          <h2 className="text-4xl font-bold text-violet-700 mt-3">
            27
          </h2>

        </div>

        {/* Estimated Wait */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">

          <p className="text-gray-500">
            Estimated Wait
          </p>

          <h2 className="text-4xl font-bold text-violet-700 mt-3">
            18 min
          </h2>

        </div>

      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-2xl shadow-md p-8 mt-10">

        <div className="flex justify-between mb-4">

          <h2 className="text-2xl font-semibold text-gray-800">
            Queue Progress
          </h2>

          <span className="text-violet-700 font-semibold">
            70%
          </span>

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-5">

          <div className="bg-gradient-to-r from-purple-700 to-violet-900 h-5 rounded-full w-[70%]"></div>

        </div>

        <p className="text-gray-500 mt-4">
          You are getting closer to your appointment.
        </p>

      </div>

      {/* Appointment Details */}
      <div className="bg-white rounded-2xl shadow-md p-8 mt-10 max-w-2xl">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Appointment Details
        </h2>

        <div className="space-y-4">

          <div>
            <p className="text-gray-500">Department</p>
            <h3 className="text-lg font-semibold">
              General Checkup
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Doctor</p>
            <h3 className="text-lg font-semibold">
              Dr. Sharma
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Time Slot</p>
            <h3 className="text-lg font-semibold">
              11:30 AM
            </h3>
          </div>

        </div>

      </div>

    </div>
  );
};

export default QueueStatus;