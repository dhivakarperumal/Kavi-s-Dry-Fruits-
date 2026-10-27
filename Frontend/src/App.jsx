import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaCommentDots, FaPhoneAlt, FaWhatsapp, FaArrowUp } from "react-icons/fa";

import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import ScrollToTop from "./Component/ScrollToTop";
import Header from "./Component/Header";
import SEO from "./Component/SEO";
import ChatBot from "./Component/ChatBot";

const routeSEO = {
  "/": {
    title: "Kavi's Dry Fruits | Premium Dry Fruits, Nuts, Seeds & Gift Boxes",
    description:
      "Shop premium almonds, cashews, pistachios, dates, seeds and dry fruit gift boxes from Kavi's Dry Fruits, with delivery across Tamil Nadu and India.",
  },
  "/shop": {
    title: "Shop Premium Dry Fruits, Nuts, Dates & Seeds | Kavi's Dry Fruits",
    description:
      "Shop premium dry fruits, nuts, seeds, dates, raisins and festive gift boxes, delivered across Tamil Nadu and India.",
  },
  "/aboutus": {
    title: "About Kavi's Dry Fruits | Premium Dry Fruit Store in Tirupattur",
    description:
      "Learn about Kavi's Dry Fruits, based in Tirupattur, Tamil Nadu, and our commitment to quality, hygienic packing and delivery across Tamil Nadu and India.",
  },
  "/contactus": {
    title: "Contact Kavi's Dry Fruits | Dry Fruit Shop in Tirupattur",
    description:
      "Contact Kavi's Dry Fruits in Tirupattur for product enquiries, gift boxes and delivery support across Tamil Nadu and India.",
  },
  "/combos": {
    title: "Combo Dry Fruit Packs & Gift Boxes | Kavi's Dry Fruits",
    description:
      "Discover premium dry fruit combo packs, family gift boxes and festive gift hampers curated for every occasion and celebration.",
  },
  "/offers": {
    title: "Dry Fruit Offers & Deals | Kavi's Dry Fruits",
    description:
      "Shop the best dry fruit offers, seasonal discounts and fresh combo deals on premium almonds, cashews, dates and seeds.",
  },
  "/healthbenefits": {
    title: "Health Benefits of Dry Fruits, Nuts & Seeds | Kavi's Dry Fruits",
    description:
      "Explore the health benefits of almonds, walnuts, dates, seeds, raisins and nuts for better nutrition and healthy snacking.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Kavi's Dry Fruits",
    description: "Read the privacy policy of Kavi's Dry Fruits and how we handle customer information and website data.",
  },
  "/return-policy": {
    title: "Return Policy | Kavi's Dry Fruits",
    description: "Review the return and refund terms for Kavi's Dry Fruits orders and learn how to contact customer support.",
  },
};

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  const currentSeo = useMemo(() => {
    const pathname = location.pathname || "/";
    const exactMatch = routeSEO[pathname];

    if (exactMatch) {
      return exactMatch;
    }

    if (pathname.startsWith("/category/")) {
      const categoryName = pathname.replace("/category/", "").replace(/[-_]/g, " ");
      return {
        title: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} | Kavi's Dry Fruits`,
        description: `Shop premium ${categoryName} products including quality dry fruits, nuts and healthy snacks from Kavi's Dry Fruits.`,
      };
    }

    if (pathname.startsWith("/shop/")) {
      return {
        title: "Premium Dry Fruits Product | Kavi's Dry Fruits",
        description: "Discover fresh, premium dry fruits and nut products with trusted quality, packaging and nationwide delivery.",
      };
    }

    return routeSEO["/"];
  }, [location.pathname]);
  const isPrivatePage = /^\/(admin|adminpanel|dashboard|login|register|account|addtocart|addtofav|checkout|orders|tracking)(\/|$)/i.test(location.pathname);
  const isProductDetailPage = /^\/(?:shop|combos)\/[^/]+\/?$/i.test(location.pathname);

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
      {!isProductDetailPage && (
        <SEO
          title={currentSeo.title}
          description={currentSeo.description}
          robots={isPrivatePage ? "noindex, nofollow" : undefined}
          canonical={`https://kavisdryfruits.com${location.pathname === "/" ? "/" : `${location.pathname.replace(/\/+$/, "")}/`}`}
        />
      )}
      <ScrollToTop />
      <Header />
      <Navbar />
      <Outlet />
      <Footer />
      
      {/* Floating Action Buttons */}
      <div className="fixed z-[100] right-3 bottom-3 sm:right-4 sm:bottom-4 flex flex-col items-center gap-2">
        {/* Call Button */}
        <a
          href="tel:+919489593504"
          className="w-10 h-10 sm:w-11 sm:h-11 bg-green1 hover:bg-primary text-white rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 flex justify-center items-center"
          aria-label="Call Us"
        >
          <FaPhoneAlt className="text-xs sm:text-sm" />
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919489593504"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 sm:w-11 sm:h-11 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 flex justify-center items-center"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="text-sm sm:text-base" />
        </a>

        {/* ChatBot Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-10 h-10 sm:w-11 sm:h-11 bg-primary hover:bg-green-700 text-white rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 flex justify-center items-center"
          aria-label="Open Chatbot"
        >
          <FaCommentDots className="text-sm sm:text-base" />
        </button>

        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-green1 hover:bg-primary text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110 flex justify-center items-center"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="text-xs sm:text-sm" />
          </button>
        )}
      </div>

      {/* ChatBot Component */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default App;
