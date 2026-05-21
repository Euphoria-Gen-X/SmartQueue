import { useState } from "react";

const Booking = () => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const services = [
    "General Checkup",
    "Dental",
    "Eye Specialist",
    "Cardiology",
  ];

  const slots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Book Appointment
        </h1>

        <p className="text-gray-500 mt-2">
          Select your service, date and available slot
        </p>
      </div>

      {/* Service Selection */}
      <div className="mb-10">

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Choose Service
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {services.map((service) => (
            <div
              key={service}
              onClick={() => setSelectedService(service)}
              className={`p-6 rounded-2xl cursor-pointer shadow-md transition-all duration-300
              ${
                selectedService === service
                  ? "bg-violet-600 text-white"
                  : "bg-white hover:shadow-xl"
              }`}
            >
              <h3 className="text-lg font-semibold">
                {service}
              </h3>

              <p
                className={`mt-2 text-sm ${
                  selectedService === service
                    ? "text-violet-100"
                    : "text-gray-500"
                }`}
              >
                Available Today
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* Date Picker */}
      <div className="mb-10">

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Select Date
        </h2>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-violet-500"
        />

      </div>

      {/* Time Slots */}
      <div className="mb-10">

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Available Slots
        </h2>

        <div className="flex flex-wrap gap-4">

          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-300
              ${
                selectedSlot === slot
                  ? "bg-violet-600 text-white"
                  : "bg-white hover:bg-violet-100 shadow-md"
              }`}
            >
              {slot}
            </button>
          ))}

        </div>

      </div>

      {/* Booking Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Booking Summary
        </h2>

        <div className="space-y-4">

          <div>
            <p className="text-gray-500">Service</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedService || "Not Selected"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Date</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedDate || "Not Selected"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Time Slot</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedSlot || "Not Selected"}
            </h3>
          </div>

        </div>

        <button
          className="mt-8 w-full bg-gradient-to-r from-purple-700 to-violet-900 text-white py-4 rounded-2xl font-semibold hover:opacity-90 transition-all duration-300"
        >
          Confirm Booking
        </button>

      </div>

    </div>
  );
};

export default Booking;