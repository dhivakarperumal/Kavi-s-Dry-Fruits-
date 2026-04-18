import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { useAuth } from "../PrivateRouter/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      const result = response.data;
      
      const userData = {
        userId: result.userId,
        user_id: result.user_id || result.userUuid,
        userUuid: result.userUuid || result.user_id,
        username: result.username,
        firstName: result.firstName || result.username,
        email: result.email,
        role: result.role,
      };

      // Call the context login function which sets localStorage AND updates state
      login(userData, result.token || "user-token");

      setMessage(result.message || 'Login Successful!');
      setMessageType('success');
      setTimeout(() => navigate(result.role === 'admin' ? '/adminpanel' : '/'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || 'Invalid email or password.');
      setMessageType('error');
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setMessage('Please enter your email.');
      setMessageType('error');
      return;
    }

    setMessage('Password reset is not available in the current MySQL auth flow.');
    setMessageType('error');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col md:flex-row max-w-5xl w-full shadow-lg border p-2 border-green-400 rounded-xl overflow-hidden h-auto md:h-[90vh]">
        <div className="hidden md:block md:w-1/2 h-100 md:h-auto">
          <img
            src="https://kavisdryfruits.com/images/Login.jpg"
            alt="Login Visual"
            className="w-full h-full object-cover rounded-3xl"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-4">
            <img
              src="/images/Kavi_logo.png"
              alt="Logo"
              className="w-24 h-auto mx-auto md:mx-0"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">
            Log In
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center md:text-left">
            Please fill your details to access your account.
          </p>

          {message && (
            <div
              className={`p-2 text-center text-sm rounded mb-4 ${
                messageType === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        

         

         

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Id *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setResetEmail(e.target.value);
                }}
                placeholder="Enter Email Address"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center">
                {/* removed required so user isn't forced to check this */}
                <input type="checkbox" className="mr-2 cursor-pointer" />
                Remember me
              </label>
              <span
                onClick={() => setShowResetForm(!showResetForm)}
                className="text-green-600 hover:underline cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>

            {showResetForm && (
              <div className="mt-2">
                <button
                  onClick={handleForgotPassword}
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            )}

            <button
              type="submit"
              className="bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition duration-300 cursor-pointer"
            >
              Log in
            </button>

          </form>



         

           <div className="flex items-center gap-2 text-gray-500 text-sm my-4">
            <span className="flex-1 h-px bg-gray-300" />
            <span>or</span>
            <span className="flex-1 h-px bg-gray-300" />
          </div>

           <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const decoded = jwtDecode(credentialResponse.credential);
                const googleUserData = {
                  firstName: decoded.given_name || decoded.name?.split(" ")[0] || "User",
                  lastName: decoded.family_name || "",
                  username: decoded.name || decoded.email?.split("@")[0] || "User",
                  email: decoded.email,
                  googleId: decoded.sub,
                  provider: "google",
                };

                // Call backend to store user data in database
                const response = await api.post('/auth/google-login', googleUserData);
                const result = response.data;

                const userData = {
                  userId: result.userId,
                  user_id: result.user_id,
                  userUuid: result.userUuid,
                  username: result.username,
                  firstName: result.firstName,
                  email: result.email,
                  role: result.role,
                  provider: result.provider,
                  photoURL: decoded.picture || "",
                };

                // Call the context login function which sets localStorage AND updates state
                login(userData, credentialResponse.credential);

                setMessage("Google login successful. Redirecting...");
                setMessageType("success");
                setTimeout(() => navigate(result.role === 'Admin' ? '/adminpanel' : '/'), 1000);
              } catch (error) {
                setMessage(error.response?.data?.message || "Google login failed.");
                setMessageType("error");
                console.error("Google login error:", error);
              }
            }}
            onError={() => {
              setMessage("Google login failed.");
              setMessageType("error");
            }}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />

           <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-600 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
