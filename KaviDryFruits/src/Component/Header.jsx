import { useEffect, useState } from "react";
import {
  FaPhone,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!storedUser && !!token);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="hidden md:block bg-primary text-white text-sm font-poppins">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        {/* Contact Info */}
        <div className="flex items-center space-x-4">
          <a
            href="tel:+918798798345"
            className="flex items-center space-x-1 hover:text-green-200"
          >
            <FaPhone />
            <span>+91 9489593504</span>
          </a>
          <span className="text-green2">|</span>
          <a
            href="mailto:dryfruits@gmail.com"
            className="flex items-center space-x-1 hover:text-green-200"
          >
            <IoMdMail />
            <span>kavidryfruits@gmail.com</span>
          </a>
        </div>

        {/* Social + Auth Links */}
        <div className="flex items-center space-x-4">
          {/* Social Icons */}
          <div className="flex items-center space-x-2">
            <a
              href="https://wa.me/919489593504"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href="https://www.facebook.com/share/1Y6zzND3L9/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href="https://www.instagram.com/kavisdryfruits?igsh=ZG45YzM4ZWsxa25h"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.instagram.com/kavisdryfruits?igsh=ZG45YzM4ZWsxa25h"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube size={20} />
            </a>
          </div>

          {/* Auth Links */}
          <div className="flex items-center space-x-2">
            <span className="text-green2">|</span>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="hover:text-green-200 cursor-pointer">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200 cursor-pointer">
                  Login
                </Link>
                <span className="text-green2">|</span>
                <Link to="/register" className="hover:text-green-200 cursor-pointer">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
