import { Link } from "react-router-dom";

import {
  CalendarCheck,
  Clock3,
  BellRing,
  Activity,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white shadow-sm">

        <h1 className="text-3xl font-bold text-violet-700">
          SmartQueue
        </h1>

        <div className="flex items-center gap-4">

          <Link
            to="/login"
            className="text-violet-700 font-medium hover:underline"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-violet-700 text-white px-5 py-2 rounded-xl hover:bg-violet-800 transition-all"
          >
            Sign Up
          </Link>

        </div>

      </nav>

      {/* Hero Section */}
      <section className="px-8 py-24 text-center bg-gradient-to-br from-purple-700 via-violet-800 to-purple-900 text-white">

        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">

          Smart Appointment & Queue Booking System

        </h1>

        <p className="mt-8 text-lg md:text-xl text-violet-100 max-w-2xl mx-auto">

          Book appointments, monitor live queue status, and save valuable time with SmartQueue.

        </p>

        <div className="mt-10 flex justify-center gap-5 flex-wrap">

          <Link
            to="/signup"
            className="bg-white text-violet-700 px-8 py-4 rounded-2xl font-semibold hover:bg-violet-100 transition-all"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-violet-700 transition-all"
          >
            Login
          </Link>

        </div>

      </section>

      {/* Features */}
      <section className="px-8 py-20">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-gray-800">
            Powerful Features
          </h2>

          <p className="text-gray-500 mt-4">
            Everything you need for seamless appointment management
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all">

            <CalendarCheck
              size={40}
              className="text-violet-700 mb-5"
            />

            <h3 className="text-2xl font-semibold text-gray-800">
              Easy Booking
            </h3>

            <p className="text-gray-500 mt-3">
              Quickly schedule appointments in just a few clicks.
            </p>

          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all">

            <Clock3
              size={40}
              className="text-violet-700 mb-5"
            />

            <h3 className="text-2xl font-semibold text-gray-800">
              Live Queue
            </h3>

            <p className="text-gray-500 mt-3">
              Track real-time queue progress and reduce waiting time.
            </p>

          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all">

            <BellRing
              size={40}
              className="text-violet-700 mb-5"
            />

            <h3 className="text-2xl font-semibold text-gray-800">
              Notifications
            </h3>

            <p className="text-gray-500 mt-3">
              Get instant updates about appointments and queues.
            </p>

          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all">

            <Activity
              size={40}
              className="text-violet-700 mb-5"
            />

            <h3 className="text-2xl font-semibold text-gray-800">
              Smart Management
            </h3>

            <p className="text-gray-500 mt-3">
              Improve efficiency with organized appointment handling.
            </p>

          </div>

        </div>

      </section>

      {/* How It Works */}
      <section className="px-8 py-20 bg-white">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-gray-800">
            How It Works
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-slate-100 rounded-3xl p-8 text-center">

            <div className="w-16 h-16 bg-violet-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>

            <h3 className="text-2xl font-semibold mt-6">
              Book Appointment
            </h3>

            <p className="text-gray-500 mt-3">
              Choose service, date, and preferred slot.
            </p>

          </div>

          <div className="bg-slate-100 rounded-3xl p-8 text-center">

            <div className="w-16 h-16 bg-violet-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>

            <h3 className="text-2xl font-semibold mt-6">
              Track Queue
            </h3>

            <p className="text-gray-500 mt-3">
              Monitor live queue status from anywhere.
            </p>

          </div>

          <div className="bg-slate-100 rounded-3xl p-8 text-center">

            <div className="w-16 h-16 bg-violet-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>

            <h3 className="text-2xl font-semibold mt-6">
              Visit on Time
            </h3>

            <p className="text-gray-500 mt-3">
              Arrive only when your turn is near.
            </p>

          </div>

        </div>

      </section>

      {/* Footer CTA */}
      <section className="px-8 py-24 text-center bg-gradient-to-r from-purple-700 to-violet-900 text-white">

        <h2 className="text-5xl font-bold">
          Ready to Skip Long Queues?
        </h2>

        <p className="mt-5 text-violet-100 text-lg">
          Experience smarter appointment management with SmartQueue.
        </p>

        <Link
          to="/signup"
          className="inline-block mt-10 bg-white text-violet-700 px-8 py-4 rounded-2xl font-semibold hover:bg-violet-100 transition-all"
        >
          Start Booking Now
        </Link>

      </section>

    </div>
  );
};

export default Landing;