import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-violet-800 to-purple-900 flex items-center justify-center p-6">

      {/* Signup Card */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="text-gray-500 mt-3">
            Join SmartQueue and manage appointments smarter
          </p>

        </div>

        {/* Form */}
        <form className="space-y-5">

          {/* Full Name */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
            />

          </div>

          {/* Email */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
            />

          </div>

          {/* Password */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
            />

          </div>

          {/* Confirm Password */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
            />

          </div>

          {/* Signup Button */}
         <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gradient-to-r from-purple-700 to-violet-900 text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition-all duration-300"
          >
            Create Account
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center my-8">

          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="px-4 text-gray-400 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-300"></div>

        </div>

        {/* Google Button */}
        <button
          className="w-full border border-gray-300 py-3 rounded-2xl font-medium hover:bg-gray-100 transition-all"
        >
          Continue with Google
        </button>

        {/* Login Redirect */}
        <p className="text-center text-gray-500 mt-8">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-violet-700 font-semibold hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Signup;