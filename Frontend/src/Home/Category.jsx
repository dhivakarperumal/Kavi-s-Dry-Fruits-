import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useStore } from "../Context/StoreContext";

const PrevArrow = (props) => {
  const { onClick, style } = props;
  return (
    <div
      className="flex items-center justify-center rounded-full w-10 h-10 absolute left-0 z-10 -translate-y-1/2 top-1/2 cursor-pointer "
      onClick={onClick}
      style={{ ...style }}
    >
      <FaChevronLeft className="text-black text-xl" />
    </div>
  );
};

const NextArrow = (props) => {
  const { onClick, style } = props;
  return (
    <div
      className="flex items-center justify-center rounded-full w-10 h-10 absolute -right-5 z-10 -translate-y-1/2 top-1/2 cursor-pointer "
      onClick={onClick}
      style={{ ...style }}
    >
      <FaChevronRight className="text-black text-xl" />
    </div>
  );
};

const Category = () => {
  const { allCategories } = useStore();
  const [hoverIndex, setHoverIndex] = useState(null);

  const settings = {
    dots: false,
    infinite: allCategories.length > 6,
    speed: 600,
    slidesToShow: Math.min(allCategories.length, 6) || 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="relative bg-white py-12 overflow-hidden">

    <Helmet>
  <title>Buy Premium Dry Fruits Online – Almonds, Cashews, Pistachios & Raisins</title>

  <meta
    name="description"
    content="Shop premium quality dry fruits including almonds, cashews, pista, raisins, and walnuts. Fresh and crunchy dry fruits delivered across India."
  />

  <meta
    name="keywords"
    content="almonds online, cashews online, pista online, raisins online, walnuts online, buy dry fruits near me"
  />

  <link rel="canonical" href="https://kavisdryfruits.com/dry-fruits" />
</Helmet>

      {/* Background image (left corner) */}
      <img
        src='https://kavisdryfruits.com/images/offer-side-bg1.png'
        alt="bg"
        className="absolute -left-72 top-0 w-[35%] z-0 hidden md:block"
      />

      {/* Heading */}
      <h2 className="text-2xl font-bold text-center mb-10 relative z-10">
        Our <span className="text-green-600">Category</span>
        <div className="h-[2px] border-b-2 border-dashed border-green1 mt-3 mx-auto w-[120px] sm:w-[150px] md:w-[180px] lg:w-[220px]" />
      </h2>

      {/* Slider */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <Slider {...settings}>
          {allCategories.map((item, index) => (
            <div key={index} className="px-4">
              <Link
                to={`/category/${item.name.toLowerCase().replace(/\s+/g, "")}`}
                className="flex flex-col items-center justify-center text-center group"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {/* Image */}
                <div className="relative z-10">
                  <img
                    src={
                      hoverIndex === index
                        ? item.images?.hover || item.images?.default
                        : item.images?.default
                    }
                    alt={item.name}
                    className="w-[120px] h-[120px] object-contain mb-2 transition duration-500"
                  />
                </div>

                {/* Background bubble */}
                <div className="relative w-[130px] h-[60px] bg-white shadow border border-green-500 border-t-0 rounded-b-[60px] -mt-17 group-hover:shadow-md group-hover:shadow-green-300">
                  <span className="absolute left-[-4px] top-0 w-2 h-2 bg-green-500 rounded-full -translate-y-1/2"></span>
                  <span className="absolute right-[-4px] top-0 w-2 h-2 bg-green-500 rounded-full -translate-y-1/2"></span>
                </div>

                {/* Label */}
                <p className="font-semibold text-black text-lg mt-5">
                  {item.name}
                </p>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Category;
