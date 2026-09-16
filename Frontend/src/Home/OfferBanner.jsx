import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const OfferBanner = () => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    let isMounted = true;

    api.get("/banners")
      .then(({ data }) => {
        const offer = (Array.isArray(data) ? data : [])
          .find((item) => item.active && item.type === "offer");
        if (isMounted) setBanner(offer || null);
      })
      .catch((error) => {
        console.error("Failed to load offer banner:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!banner?.image) return null;

  const content = (
    <section className="h-auto md:h-[60vh] bg-green4 px-4 md:px-35 py-10 overflow-hidden relative">
      <div className="w-full h-full border-4 border-dashed border-green-600 rounded-lg p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="lg:w-2/3 text-center lg:text-left">
          {banner.title && <h2 className="text-lg md:text-xl font-semibold mb-2">{banner.title}</h2>}
          {banner.subtitle && <p className="text-xl font-semibold mb-4">{banner.subtitle}</p>}
          {banner.description && <p className="text-base text-gray-700">{banner.description}</p>}
        </div>
        <div className="w-full lg:w-1/2">
          <img src={banner.image} alt={banner.title || "Offer Banner"} className="w-full h-auto object-contain" />
        </div>
      </div>
    </section>
  );

  return banner.link ? <Link to={banner.link}>{content}</Link> : content;
};

export default OfferBanner;
