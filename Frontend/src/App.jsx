import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaCommentDots, FaPhoneAlt, FaWhatsapp, FaArrowUp } from "react-icons/fa";

import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import ScrollToTop from "./Component/ScrollToTop";
import Header from "./Component/Header";
import SEO from "./Component/SEO";
import ChatBot from "./Component/ChatBot";

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 600,
      easing: "ease-in-sine",
      delay: 100,
      once: true,
    });
  }, []);

  return (
    <>
      <SEO />
      <ScrollToTop />
      <Header />
      <Navbar />
      <Outlet />
      <Footer />
      
      {/* Floating Action Buttons */}
      <div className="fixed z-[100] right-6 bottom-20 flex flex-col gap-3">
        {/* Call Button */}
        <a
          href="tel:+919489593504"
          className="p-3.5 bg-green1 hover:bg-primary text-white rounded-full shadow-2xl cursor-pointer transition-transform hover:scale-110 flex justify-center items-center"
          aria-label="Call Us"
        >
          <FaPhoneAlt size={22} />
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919489593504"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl cursor-pointer transition-transform hover:scale-110 flex justify-center items-center"
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={24} />
        </a>

        {/* ChatBot Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="p-3.5 bg-primary hover:bg-green-700 text-white rounded-full shadow-2xl cursor-pointer transition-transform hover:scale-110 flex justify-center items-center"
          aria-label="Open Chatbot"
        >
          <FaCommentDots size={24} />
        </button>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-3 bg-green1 hover:bg-primary text-white rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 flex justify-center items-center"
            aria-label="Scroll to top"
          >
            <FaArrowUp size={20} />
          </button>
        )}
      </div>

      {/* ChatBot Component */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default App;
