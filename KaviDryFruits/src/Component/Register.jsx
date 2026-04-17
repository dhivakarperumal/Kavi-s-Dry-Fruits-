import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";


const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    if (!lastName.trim()) return "Last name is required.";

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: `${firstName} ${lastName}`,
        email,
        phone,
        createdAt: serverTimestamp(),
      });

      setMessage("Registration successful!");
      setMessageType("success");

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      let errorMsg = "Registration failed.";

      if (error.code === "auth/email-already-in-use") {
        errorMsg = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Invalid email format.";
      } else if (error.code === "auth/weak-password") {
        errorMsg = "Password must be at least 6 characters.";
      }

      setMessage(errorMsg);
      setMessageType("error");
    }
  };

  // -----------------------------------------------------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans">
      <div className="flex max-w-6xl w-full h-[650px] p-2 bg-white rounded-xl border border-green-600 shadow-xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="w-1/2 hidden md:block">
          <img src="https://kavisdryfruits.com/images/Register.jpg" alt="Register" className="h-full w-full object-cover rounded-3xl" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* FORM */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <div className="mb-6">
            <img src="/images/Kavi_logo.png" alt="Logo" className="w-20 h-auto mb-2" />
            <h2 className="text-3xl font-bold text-green-700">Register</h2>
            <p className="text-sm text-gray-600">Create your account below.</p>
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
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 border border-green-400 rounded-md px-4 py-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 border border-green-400 rounded-md px-4 py-2"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-green-400 rounded-md px-4 py-2"
            />

            {/* Phone */}
            <input
              type="text"
              placeholder="Phone Number (10 digits)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-green-400 rounded-md px-4 py-2"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-green-400 rounded-md px-4 py-2"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-green-400 rounded-md px-4 py-2"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
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
                <a href="#" className="underline text-green-600">Terms & Conditions</a>{" "}
                and{" "}
                <a href="#" className="underline text-green-600">Privacy Policy</a>.
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
            <a href="/login" className="text-green-600 underline">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
