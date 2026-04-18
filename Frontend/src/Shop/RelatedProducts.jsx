import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Helmet } from "react-helmet";
import OptimizedImage from "../Component/OptimizedImage";

const RelatedProducts = ({ relatedProducts }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="my-10 px-4 sm:px-10">
    <Helmet>
  <title>Shop Premium Dry Fruits, Nuts, Dates & Seeds | Kavi’s Dry Fruits Tirupattur</title>

  <meta
    name="description"
    content="Buy premium dry fruits, nuts, seeds, raisins, dates and combo packs at best prices. Fresh quality delivered across Tamil Nadu and India. Contact +91 94895 93504. Tirupattur 635653."
  />

  <meta
    name="keywords"
    content="
      dry fruits shop, buy dry fruits online, almonds online, cashews online, pistachios online, dates online, raisins online, premium dry fruits store,
      fresh dry fruits Tirupattur, Tirupattur dry fruits, dry fruits 635653, dry fruits Tamil Nadu,
      dry fruits Chennai, dry fruits Coimbatore, dry fruits Madurai, dry fruits Vellore, dry fruits Salem,
      dry fruits Krishnagiri, dry fruits Dharmapuri, dry fruits Erode, dry fruits Tirunelveli,
      dry fruits Kanyakumari, dry fruits Tiruvannamalai, dry fruits Namakkal, dry fruits Trichy,
      dry fruits Thanjavur, dry fruits Cuddalore, dry fruits Dindigul, dry fruits Kanchipuram,
      buy nuts online India, premium nuts store, healthy snacks online, organic dry fruits,
      big size cashews W180, premium almonds, roasted pistachios, family pack dry fruits,
      dry fruits combo pack, Tamil Nadu pincode delivery, dry fruits shop phone number +91 94895 93504
    "
  />

  <link rel="canonical" href="https://kavisdryfruits.com/shop" />

  <meta property="og:title" content="Shop Premium Dry Fruits & Nuts – Kavi’s Dry Fruits Tirupattur" />
  <meta property="og:description" content="Premium almonds, cashews, pista, dates & seeds delivered across Tamil Nadu & India. Contact +91 94895 93504." />
  <meta property="og:url" content="https://kavisdryfruits.com/shop" />
  <meta property="og:type" content="website" />
</Helmet>

      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Explore <span className="text-primary">Related Products</span>
          </h2>
          <div className="w-[80%] sm:w-[40%] md:w-[17%] h-[2px] border-b-2 border-dashed border-green1 mx-auto"></div>
        </div>

        <div className="w-full flex justify-center md:justify-end mb-4">
          <Link
            to="/shop"
            className="bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-green1 transition cursor-pointer"
          >
            View More
          </Link>
        </div>

        <Slider {...settings} className="w-full">
          {relatedProducts.map((p) => {
            const relWeight = p.weights?.[0];
            const priceObj = p.prices?.[relWeight];
            const offerPercent = p.offer || 0;
            
            let relPrice = 0;
            let relMrp = 0;
            
            if (typeof priceObj === "object" && priceObj !== null) {
              relPrice = Number(priceObj.offerPrice) || Number(priceObj.mrp) || 0;
              relMrp = Number(priceObj.mrp) || relPrice;
            } else if (typeof priceObj === "number") {
              // Fallback for old format
              relPrice = Number(priceObj);
              relMrp = offerPercent > 0 ? Math.round(relPrice + (relPrice * offerPercent) / 100) : relPrice;
            }

            // Ensure they are valid numbers
            if (isNaN(relPrice)) relPrice = 0;
            if (isNaN(relMrp)) relMrp = 0;
            
            const relRating = p.rating?.toFixed?.(1) || "4.5";
            const isOutOfStock = p.stock <= 0;

            return (
              <div key={`${p.id}_${relWeight}`} className="!flex !justify-center px-2">
                <div className="group bg-white rounded-2xl p-4 shadow-md h-full w-[250px] flex flex-col relative">
                  <div className="absolute top-7 left-4 bg-green1 text-white text-xs px-3 py-1 rounded-r-full">
                    Bestseller
                  </div>
                  <div className="absolute top-6 right-6 text-green1 border border-green1 p-2 rounded-full text-xl hover:bg-green1 hover:text-white transition">
                    <FiHeart />
                  </div>
                  <div className="border-2 border-dotted border-green1 rounded-2xl bg-gray-50 h-56 flex items-center justify-center overflow-hidden">
                    <OptimizedImage
                      src={p.images?.[0]}
                      alt={`${p.name} - Kavi's Dry Fruits`}
                      className="w-full h-full flex items-center justify-center p-4 rounded-2xl"
                      objectFit="contain"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-center mb-2">
                    {p.name} ({relWeight})
                  </h3>
                  <p className="text-center text-gray-600 text-sm mb-2">
                    MRP:{" "}
                    <span className="line-through text-gray-400">
                      ₹{relMrp}
                    </span>{" "}
                    ₹{relPrice}
                  </p>
                  {isOutOfStock && (
                    <p className="text-red-500 text-sm font-medium mb-2">
                      Out of Stock
                    </p>
                  )}
                  <div className="w-[90%] h-[1px] border-b border-dashed border-green1 mx-auto mb-3" />
                  <div className="flex justify-center mt-auto">
                    <Link
                      to={`/shop/${p.id}`}
                      className="bg-green1 text-white px-6 py-2 rounded-md text-md hover:bg-green2 transition"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
};

export default RelatedProducts;
