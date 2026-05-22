import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const handleSignup = () => {

  // Empty fields
  if (
    !name ||
    !email ||
    !password ||
    !confirmPassword
  ) {
    setError("Please fill all fields");
    return;
  }
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setError("Please enter a valid email");
    return;
  }
  // Password length
  if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }
  // Password match
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }
  // Success
  setError("");
  navigate("/dashboard");
};
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
    value={name}
    onChange={(e) => setName(e.target.value)}
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
  placeholder="Create password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
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
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
/>

          </div>
{error && (
  <p className="text-red-500 text-sm font-medium">
    {error}
  </p>
)}
          {/* Signup Button */}
    <button
  type="button"
  onClick={handleSignup}
  className="w-full bg-gradient-to-r from-purple-700 to-violet-900 text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition-all duration-300 mt-3"
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