import Logo from "/images/Kavi_logo.png";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-primary text-white  pt-10 pb-6 px-6 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        {/* Logo & Description */}
        <div>
          <img src={Logo} alt="Kavi Logo" className="w-28 mb-4" />
          <p className="text-sm text-justify leading-[25px]">
            Healthy Snacking Starts Here. At Kavi’s Dry Fruits, we believe in
            making nutrition simple, affordable, and delicious—for every
            lifestyle and every home.
          </p>
        </div>

        {/* Quick Links */}
        <div className="px-0 md:px-15">
          <h2 className="font-semibold text-lg mb-4 ">Quick Links</h2>
          <ul className="space-y-2  text-sm">
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to="/" className="">
                Home
              </Link>
            </li>
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to="/shop" className="">
                Shop
              </Link>
            </li>
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to="/offers" className="">
                Offers
              </Link>
            </li>
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to="/combos" className="">
                Combos
              </Link>
            </li>

            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to="/aboutus" className="">
                About Us
              </Link>
            </li>
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to="/contactus" className="">
                Contact Us
              </Link>
            </li>
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to="/return-policy" className="">
                Return Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Categorys</h2>
          <ul className="space-y-2 text-sm">
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to={`/category/nuts`} className="block">
                Nuts
              </Link>
            </li>
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to={`/category/dryfruits`} className="block">
                Dry Fruits
              </Link>
            </li>
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to={`/category/dates`} className="block">
                Dates
              </Link>
            </li>
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to={`/category/raisins`} className="block">
                Raisins
              </Link>
            </li>
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to={`/category/driedfruits`} className="block">
                Dried Fruits
              </Link>
            </li>
            <li className=" flex items-center gap-2 transition-all duration-300 hover:translate-x-3">
              <MdKeyboardArrowRight size={20} />
              <Link to={`/category/seeds`} className="block">
                Seeds
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Contact Us</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MdLocationPin className="mt-1 text-2xl " />
              <span className="">
                No:58 Vaitheeshwaran Nagar Tirupathur-635653 Tamilnadu
              </span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-xl" />
              <span>+91 9489593504</span>
            </li>
            <li className="flex items-center gap-2">
              <IoMail className="text-xl" />
              <span>kavidryfruits@gmail.com</span>
            </li>
          </ul>

          <div className="flex items-center gap-4 mt-4 text-xl text-white">
            <a
              href="https://wa.me/919489593504"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-2xl bg-white rounded-full text-green-600 p-1.5 hover:-translate-y-2 transition-all duration-300"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href="https://www.facebook.com/share/1Y6zzND3L9/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-2xl bg-white rounded-full text-blue-600  p-1.5 hover:-translate-y-2 transition-all duration-300"
            >
              <FaFacebook size={16} />
            </a>
            <a
              href="https://www.instagram.com/kavisdryfruits?igsh=ZG45YzM4ZWsxa25h"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-2xl bg-white rounded-full text-pink-700 p-1.5 hover:-translate-y-2 transition-all duration-300"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.instagram.com/kavisdryfruits?igsh=ZG45YzM4ZWsxa25h"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-2xl bg-white rounded-full text-red-600 p-1.5 hover:-translate-y-2 transition-all duration-300"
            >
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white pt-4 text-center text-md text-white flex items-center justify-between flex-wrap md:flex-nowrap">
        <p>© 2025 Kavi's Dry Fruits. All Rights Reserved.</p>
        <p className="mt-1">Privacy Policy | Terms of Service</p>
      </div>
    </footer>
  );
};

export default Footer;
