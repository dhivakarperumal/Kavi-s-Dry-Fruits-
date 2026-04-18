import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {Link} from "react-router-dom"
import { Helmet } from "react-helmet";



const Hero = () => {
  const imageList = [
    { id: 1, img: "https://kavisdryfruits.com/images/Home/bg1.png" },
    { id: 2, img: "https://kavisdryfruits.com/images/Home/bg2.png" },
    { id: 3, img: "https://kavisdryfruits.com/images/Home/bg3.png" },
    { id: 4, img: "https://kavisdryfruits.com/images/Home/bg4.png" },
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false }); // Reusable animations
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imageList.length);
    }, 3000); // Image changes every 3 seconds

    return () => clearInterval(interval);
  }, [imageList.length]);

  return (

    
    <section className="bg-green3 overflow-hidden flex items-center py-10 md:py-16 lg:py-20">
    <Helmet>
  <title>Kavi’s Dry Fruits – Premium Dry Fruits, Nuts, Seeds & Gift Boxes Online</title>

  <meta
    name="description"
    content="Buy premium dry fruits, almonds, cashews, pistachios, dates, raisins, seeds & gift boxes at best price. Pan India delivery. Fresh, healthy & handpicked quality from Kavi’s Dry Fruits."
  />

  <meta
    name="keywords"
    content="dry fruits online, premium dry fruits, almonds, cashews, pista, dates, raisins, gift boxes, healthy snacks, dry fruits Tamil Nadu, dry fruits shop Tirupathur"
  />

  <link rel="canonical" href="https://kavisdryfruits.com/" />
</Helmet>

      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Text Content */}
        <div className="w-full lg:w-2/3 space-y-6 text-center lg:text-left z-10">
          <h1 className="text-2xl lg:text-4xl font-extrabold text-primary leading-snug">
            Premium Quality Dry Fruits
            <br />
            100%  Natural &  Fresh
          </h1>
          {/* <p className="text-lg text-[#9c6b4d] font-medium">
            Almonds, Cashews, Walnuts & More – Healthy & Tasty
          </p> */}
          
          <Link to={"/shop"} className="bg-green1 hover:bg-primary text-white px-6 py-3 rounded-md text-sm font-semibold transition">
            Shop Now
          </Link>
        </div>

        {/* Animated Image */}
        <div
          className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] md:mr-30 rounded-full overflow-hidden flex items-start justify-start relative"
          key={currentImage} // Forces re-render for animation
          data-aos="zoom-in"
          data-aos-easing="ease-in-out"
        >
          <img
            src={imageList[currentImage].img}
            alt="Dry Fruits Bowl"
            className="object-cover w-full h-full transition duration-1000 ease-in-out"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
