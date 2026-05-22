import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {

  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Login Function
  const handleLogin = () => {

    // Empty validation
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Success
    setError("");
    navigate("/dashboard");
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-violet-800 to-purple-900 flex items-center justify-center p-6">

      {/* Login Card */}
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-3">
            Login to continue using SmartQueue
          </p>

        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Email */}
          <div>

            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
            />

          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">

            <button
              type="button"
              className="text-violet-700 text-sm hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm font-medium">
              {error}
            </p>
          )}

          {/* Login Button */}
         <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-purple-700 to-violet-900 text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition-all duration-300"
            >
  Login
</button>

        </div>

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

        {/* Signup Redirect */}
        <p className="text-center text-gray-500 mt-8">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-violet-700 font-semibold hover:underline"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;