import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // -----------------------------------------------------------
  // VALIDATION FUNCTION
  // -----------------------------------------------------------
  const validateInputs = () => {
    if (!firstName.trim()) return "First name is required.";

    if (!email.trim()) return "Email address is required.";
    if (!email.includes("@") || !email.includes(".")) return "Invalid email format.";

    if (!phone.trim()) return "Phone number is required.";
    if (!/^[0-9]{10}$/.test(phone)) return "Phone number must be 10 digits.";

    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";

    if (!confirmPassword) return "Confirm password is required.";
    if (password !== confirmPassword) return "Passwords do not match.";

    if (!agreed) return "You must agree to Terms & Privacy Policy.";

    return null; // All good
  };

  // -----------------------------------------------------------
  // REGISTER FUNCTION
  // -----------------------------------------------------------
  const handleRegister = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setMessage(validationError);
      setMessageType("error");
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        firstName,
        email,
        phone,
        password,
      });
      const result = response.data;
      setMessage(result.message || 'Registration successful!');
      setMessageType('success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || 'Registration failed.');
      setMessageType('error');
    }
  };

  // -----------------------------------------------------------

  return (
    <div className="h-screen min-h-screen overflow-hidden flex items-center justify-center bg-white font-sans p-2 sm:p-4">
      <div className="flex max-w-6xl w-full h-full max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] p-0 bg-white rounded-xl border border-green-600 shadow-2xl shadow-green-900/15 overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="w-1/2 h-full hidden md:block min-h-0 self-stretch">
          <img
            src="/images/Register.jpg"
            alt="Register"
            loading="eager"
            fetchPriority="high"
            className="block h-full min-h-full w-full object-cover rounded-l-xl"
          />
        </div>

        {/* FORM */}
        <div
          className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="mb-4 sm:mb-6">
            <img src="/images/Kavi_logo.png" alt="Logo" className="mx-auto w-20 h-auto mb-2" />
            <h2 className="text-center text-3xl font-bold text-green-700">Register</h2>
            <p className="text-center text-sm text-gray-600">Create your account below.</p>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-md text-sm ${
                messageType === "error"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="register-first-name" className="mb-1 block text-xs font-semibold text-gray-700">First Name</label>
              <input
                id="register-first-name"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-4 py-2 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="mb-1 block text-xs font-semibold text-gray-700">Email Address</label>
              <input
                id="register-email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-4 py-2 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="register-phone" className="mb-1 block text-xs font-semibold text-gray-700">Phone Number</label>
              <input
                id="register-phone"
                type="text"
                placeholder="Phone Number (10 digits)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-4 py-2 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="mb-1 block text-xs font-semibold text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-4 py-2 pr-10 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm-password" className="mb-1 block text-xs font-semibold text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-4 py-2 pr-10 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
                className="accent-green-600 cursor-pointer"
              />
              <label className="text-sm">
                I agree with{" "}
                <a href="#" className="underline text-green-600">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <Link to="/privacy-policy" className="underline text-green-600">
                  Privacy Policy
                </Link>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 cursor-pointer"
            >
              Register
            </button>
          </form>

          <p className="text-sm mt-6 text-center">
            Already have an account?{" "}
            <a href="/login#/login" className="text-green-600 underline">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
