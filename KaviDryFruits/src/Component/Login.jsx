import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  EmailAuthProvider,
  linkWithCredential,
  sendPasswordResetEmail,
  GoogleAuthProvider, // added fallback provider
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  // small helper to ensure firebase exports exist
  const ensureFirebase = (setMsg = true) => {
    if (!auth || !db) {
      if (setMsg) {
        setMessage("Firebase not initialized. Check src/firebase.js exports (auth, db).");
        setMessageType("error");
      }
      console.error("Missing Firebase exports: ", { auth, db, provider });
      return false;
    }
    return true;
  };

  const checkAndSetRole = async (user) => {
    if (!ensureFirebase()) return;
    const userDocRef = doc(db, "users", user.uid);
    let userSnap = null;

    try {
      userSnap = await getDoc(userDocRef);
    } catch (err) {
      console.warn("getDoc failed (maybe offline):", err);
    }

    // normalize email (trim + lowercase) and remove stray spaces
    const role = (user?.email || "").trim().toLowerCase() === "kavisdryfruits@gmail.com"
      ? "Admin"
      : "User";

    try {
      if (userSnap && userSnap.exists()) {
        const userData = userSnap.data();
        if (!userData.role) {
          await setDoc(userDocRef, { ...userData, role }, { merge: true });
        }
      } else {
        await setDoc(userDocRef, {
          username: user.displayName || "No Name",
          email: user.email,
          role,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("Failed to write user doc (may be offline):", err);
      // don't block login on Firestore write failure
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!ensureFirebase()) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await checkAndSetRole(user);

      setMessage("Login Successful!");
      setMessageType("success");

      let userData = null;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        userData = snap?.data();
      } catch (err) {
        console.warn("Failed to fetch user doc after login (offline?):", err);
      }
      setTimeout(() => navigate(userData?.role === "Admin" ? "/adminpanel" : "/"), 1000);
    } catch (error) {
      setMessage("Invalid email or password.");
      setMessageType("error");
      console.error("Login error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!ensureFirebase()) return;
    try {
      // fallback to creating provider if not exported from ../firebase
      const googleProvider = provider || new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Navigate immediately after successful authentication
      navigate("/");

      await checkAndSetRole(user);
      setMessage("Login Successful via Google!");
      setMessageType("success");

      let userData = null;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        userData = snap?.data();
      } catch (err) {
        console.warn("Failed to fetch user doc after Google sign-in (offline?):", err);
      }

      // Update navigation based on user role after fetching user data
      if (userData?.role === "Admin") {
        navigate("/adminpanel");
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setMessage("Google Sign-In failed. Check console for details.");
      setMessageType("error");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setMessage("Please enter your email.");
      setMessageType("error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage("Password reset email sent successfully!");
      setMessageType("success");
      setResetEmail("");
      setShowResetForm(false);
    } catch (error) {
      console.error("Reset error:", error);
      setMessage("Failed to send reset email. Check the email entered.");
      setMessageType("error");
    }
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

            <div className="text-center text-gray-500 my-2 text-sm ">or Sign in with</div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="cursor-pointer w-full flex items-center justify-center border border-primary py-2 rounded-md hover:bg-gray-100 transition"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-3 "
              />
              <span className="text-sm font-medium">Sign in with Google</span>
            </button>
          </form>

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
