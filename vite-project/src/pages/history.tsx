const History = () => {
  const appointments = [
    {
      id: 1,
      service: "Dental",
      doctor: "Dr. Sharma",
      date: "2026-05-20",
      time: "10:00 AM",
      status: "Completed",
    },
    {
      id: 2,
      service: "Eye Specialist",
      doctor: "Dr. Mehta",
      date: "2026-05-22",
      time: "11:30 AM",
      status: "Upcoming",
    },
    {
      id: 3,
      service: "General Checkup",
      doctor: "Dr. Rao",
      date: "2026-05-25",
      time: "02:00 PM",
      status: "Cancelled",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Heading */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">
          Appointment History
        </h1>

        <p className="text-gray-500 mt-2">
          View your previous and upcoming appointments
        </p>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full">

          <thead className="bg-violet-700 text-white">

            <tr>
              <th className="text-left p-4">Service</th>
              <th className="text-left p-4">Doctor</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Time</th>
              <th className="text-left p-4">Status</th>
            </tr>

          </thead>

          <tbody>

            {appointments.map((appointment) => (

              <tr
                key={appointment.id}
                className="border-b hover:bg-slate-50 transition-all"
              >

                <td className="p-4">
                  {appointment.service}
                </td>

                <td className="p-4">
                  {appointment.doctor}
                </td>

                <td className="p-4">
                  {appointment.date}
                </td>

                <td className="p-4">
                  {appointment.time}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      appointment.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "Upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {appointment.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default History;