import { FaStar, FaRegHeart } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import rightBg from "/images/offer-side-bg2.png";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";

import { Link } from "react-router-dom";
import { useStore } from "../Context/StoreContext";

const FestiveGiftPack = () => {
  const { allProducts, addToFav, addToCart } = useStore();

  const filteredProduct = allProducts.filter((item) => {
    const isCombo = item.category === "Combo" || item.type === "combo";
    
    // Check if it has a discount/offer
    let hasOffer = false;
    if (isCombo) {
      hasOffer = Number(item.mrp || 0) > Number(item.price || 0);
    } else {
      // For fallback/non-combo items in this section
      const activeWeight = item.weights?.[0];
      const pObj = item.prices?.[activeWeight];
      if (pObj) {
        hasOffer = Number(pObj.mrp || 0) > Number(pObj.offerPrice || 0);
      }
    }

    return isCombo && (hasOffer || true); // Showing all combos for now, or those with offers
  });


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="py-10 px-4 bg-[#f4faf6]">
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

      <div className="max-w-6xl mx-auto mb-10 relative">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
           Combos <span className="text-green1">Offer Packs</span>
          </h2>
          <div className="md:w-[17%] w-[80%] h-[2px] border-b-2 border-dashed border-green1 mx-auto"></div>
          <img
            src={rightBg}
            alt="Decoration"
            className="hidden md:block absolute left-0 top-0 w-28"
          />
        </div>
        <div className="absolute md:top-0 md:right-0 top-14 right-[27%]">
          <Link to="/shop">
            <button className="bg-primary text-white  font-semibold px-6 py-2 rounded-md hover:bg-green1 transition cursor-pointer">
              View More
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <Slider {...settings}>
          {filteredProduct.map((product) => {
            const offer = product.offer || 0;
            let price = 0;
            let mrp = 0;
            let activeWeight = "";
            
            if (product.category === "Combo" || product.type === "combo") {
              // For combo products
              price = Number(product.offerPrice || product.price) || 0;
              mrp = Number(product.mrp) || price;
              activeWeight = product.weights?.[0] || "Combo";
            } else {
              // For regular products (fallback)
              activeWeight = product.weights?.[0] || "100g";
              const priceObj = product.prices?.[activeWeight];
              if (typeof priceObj === "object" && priceObj !== null) {
                price = Number(priceObj.offerPrice) || Number(priceObj.mrp) || 0;
                mrp = Number(priceObj.mrp) || price;
              } else if (typeof priceObj === "number") {
                price = Number(priceObj);
                mrp = offer > 0 ? Math.round(price + (price * offer) / 100) : price;
              }
            }

            // Ensure they are valid numbers
            if (isNaN(price)) price = 0;
            if (isNaN(mrp)) mrp = 0;

            const avgRating = product.rating || 4.5;
            const isOutOfStock = product.isOutOfStock;

            return (
              <div key={product.id} className="px-3">
                <div className="group bg-white rounded-2xl p-4 shadow-md relative transition-all duration-300">
                  <div className="relative h-60 flex items-center justify-center border-2 border-dashed border-primary rounded-md overflow-hidden">
                    <Link to={`/combos/${product.id}`}>
                      <img
                        src={product.images?.[0] || null}
                        alt={product.name}
                        className="w-full h-full p-5 object-contain transition-transform duration-500 transform hover:scale-110"
                      />
                    </Link>
                    <span className="absolute top-2 left-0 bg-primary text-white text-xs px-3 py-1 rounded-r-full shadow">
                      Bestseller
                    </span>
                    <button
                      onClick={() => {
                        addToFav({
                                ...product,
                                imageUrl: product.images[0],
                                qty: 1,
                                selectedWeight: activeWeight,
                                price,
                              });
                      }}
                      className="absolute top-2 right-2 border p-2 rounded-full group-hover:text-white group-hover:bg-primary transition cursor-pointer"
                    >
                      <FaRegHeart />
                    </button>
                   
                   
                  </div>

                  <h3 className="font-semibold text-base sm:text-md text-center mb-2">
                    {product.name}
                  </h3>

                  {/* Stock/Price display */}
                  {isOutOfStock ? (
                    <>
                      <p className="text-center text-gray-600 text-sm mb-3">
                        MRP:{" "}
                        <span className="line-through text-gray-400">
                          ₹{mrp}
                        </span>{" "}
                        ₹{price}
                      </p>
                      <p className="text-center text-red-500 text-sm mb-3 font-medium">
                        Out of Stock
                      </p>
                    </>
                  ) : (
                    <p className="text-center text-gray-600 text-sm mb-2">
                      MRP:{" "}
                      <span className="line-through text-gray-400">₹{mrp}</span>{" "}
                      ₹{price}
                    </p>
                  )}

                  <div className="w-[90%] h-[1px] border-b border-dashed border-green1 mx-auto mb-3" />

                  <div className="flex justify-between items-center mt-auto px-1">
                    <button
                      disabled={isOutOfStock}
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price,
                          image: product.images?.[0],
                          qty: 1,
                          selectedWeight: activeWeight,
                          weights: product.weights,
                          prices: product.prices,
                          category: product.category,
                        });
                      }}
                      className={`${
                        isOutOfStock
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green1 hover:bg-green2"
                      } text-white w-1/2 py-2 rounded-md text-xl flex justify-center items-center transition cursor-pointer`}
                    >
                      <IoCartOutline />
                    </button>
                    <div className="bg-green1 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm">
                      <FaStar className="text-yellow-400" />
                      {avgRating}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default FestiveGiftPack;
