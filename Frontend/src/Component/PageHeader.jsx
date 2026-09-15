import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const PageHeader = ({ title, subtitle, curpage }) => {
  const [bgImage, setBgImage] = useState("https://kavisdryfruits.com/images/header-page-bg.jpg");

  useEffect(() => {
    let isMounted = true;
    api.get("/banners")
      .then(({ data }) => {
        const heroBanner = (Array.isArray(data) ? data : [])
          .find((item) => item.active && item.type === "hero");
        if (isMounted && heroBanner?.image) {
          setBgImage(heroBanner.image);
        }
      })
      .catch((error) => {
        console.error("Failed to load hero banner:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className="relative flex flex-col justify-center bg-cover bg-center px-4 py-16 sm:py-20 md:py-24"
      style={{
        backgroundImage: `url('${bgImage}')`,
        minHeight: "20vh",
        backgroundPosition: "bottom",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Title in Center */}
      <div className="relative z-10 flex justify-center items-center">
        <h2 className="uppercase text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white text-center">
          {title}
        </h2>
      </div>

      {/* Breadcrumb at Bottom */}
      <div className="relative z-10 mt-8 sm:mt-12 flex justify-center sm:justify-start sm:absolute sm:bottom-6 sm:left-10">
        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg text-center sm:text-left">
          <Link
            to="/"
            className="font-semibold text-white hover:text-green1 transition"
          >
            Home
          </Link>
          {" > "}
          <Link
            to={`/${subtitle}`}
            className="font-semibold text-green1 hover:text-green2 transition"
          >
            {subtitle}
          </Link>
          {" > "}
          <span className="text-primary font-semibold">{curpage}</span>
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
