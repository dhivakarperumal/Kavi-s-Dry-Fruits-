import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {Link} from "react-router-dom"
import { Helmet } from "react-helmet";
import api from "../services/api";

const fallbackImages = [
  { id: 1, img: "https://kavisdryfruits.com/images/Home/bg1.png" },
  { id: 2, img: "https://kavisdryfruits.com/images/Home/bg2.png" },
  { id: 3, img: "https://kavisdryfruits.com/images/Home/bg3.png" },
  { id: 4, img: "https://kavisdryfruits.com/images/Home/bg4.png" },
];

const fallbackContent = {
  title: "Premium Quality Dry Fruits",
  subtitle: "100% Natural & Fresh",
  description: "Healthy choices, carefully selected for your family.",
};

const fallbackSlides = fallbackImages.map((slide) => ({
  ...slide,
  ...fallbackContent,
}));


const Hero = () => {
  const [heroSlides, setHeroSlides] = useState(fallbackSlides);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let isMounted = true;

    api.get("/banners")
      .then(({ data }) => {
        const heroSlidesFromApi = (Array.isArray(data) ? data : [])
          .filter(banner => banner.active && banner.type === "hero" && banner.image)
          .map((banner) => ({
            id: banner.id,
            img: banner.image,
            title: banner.title || fallbackContent.title,
            subtitle: banner.subtitle || fallbackContent.subtitle,
            description: banner.description || fallbackContent.description,
          }));

        if (isMounted && heroSlidesFromApi.length > 0) {
          setHeroSlides(heroSlidesFromApi);
          setCurrentSlide(0);
        }
      })
      .catch(error => console.error("Failed to load hero banners:", error));

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false }); // Reusable animations
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change the complete hero slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const currentHero = heroSlides[currentSlide] || fallbackSlides[0];

  return (

    
    <section className="min-h-[80vh] h-auto md:h-[85vh] bg-green3 overflow-hidden flex items-center py-10 md:py-12 lg:py-16">
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

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10">
        {/* Text Content */}
        <div className="w-full lg:w-2/3 space-y-4 md:space-y-6 text-center lg:text-left z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary leading-tight break-words">
            {currentHero.title}
          </h1>
          <p className="text-base sm:text-lg text-[#009669] font-medium">{currentHero.subtitle}</p>
          <p className="text-sm sm:text-base text-[#009669] font-medium max-w-xl mx-auto lg:mx-0">{currentHero.description}</p>
          
          <Link to={"/shop"} className="bg-green1 hover:bg-primary text-white px-6 py-3 rounded-md text-sm font-semibold transition">
            Shop Now
          </Link>
        </div>

        {/* Animated Image */}
        <div
          className="w-56 h-56 sm:w-72 sm:h-72 md:w-[380px] md:h-[380px] lg:mr-30 rounded-full overflow-hidden flex items-start justify-start relative shrink-0"
          key={currentHero.id} // Re-run the slide animation for each complete banner
          data-aos="zoom-in"
          data-aos-easing="ease-in-out"
        >
          <img
            src={currentHero.img}
            alt={currentHero.title}
            className="object-cover w-full h-full transition duration-1000 ease-in-out"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
