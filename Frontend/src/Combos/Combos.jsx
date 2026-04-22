import { useEffect, useState } from "react";
import { FaStar, FaRegHeart } from "react-icons/fa";
import { IoCartOutline, IoClose } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useStore } from "../Context/StoreContext";
import PageHeader from "../Component/PageHeader";
import LodingPage from "../Component/LoadingPage";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import OptimizedImage from "../Component/OptimizedImage";

const Combos = () => {
  const { allProducts, addToFav, addToCart, loadingProducts } = useStore();

  // --- Filters ---
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFilters, setShowFilters] = useState(window.innerWidth >= 768); // Open by default on desktop, closed on mobile
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const types = ["All", "Family Combo", "Gift Pack", "Wellness Combo"];
  const maxPrice = allProducts.length > 0 ? Math.max(...allProducts.map((p) => {
    if (p.category === "Combo") {
      return p.offerPrice || p.mrp || 0;
    } else {
      const priceObj = p.prices?.[p.weights?.[0]];
      if (typeof priceObj === "object" && priceObj !== null) {
        return priceObj.offerPrice || priceObj.mrp || 0;
      } else if (typeof priceObj === "number") {
        return priceObj;
      }
      return 0;
    }
  }), 1000) : 10000;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Keep filters open on desktop, closed on mobile
      setShowFilters(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFilterChange = (setter) => (value) => {
    setter(value);
  };

  // --- Filtered Products ---
  const filteredProduct = allProducts.filter((item) => {
    let price = 0;
    if (item.category === "Combo") {
      price = item.offerPrice || item.mrp || 0;
    } else {
      const priceObj = item.prices?.[item.weights?.[0]];
      if (typeof priceObj === "object" && priceObj !== null) {
        price = priceObj.offerPrice || priceObj.mrp || 0;
      } else if (typeof priceObj === "number") {
        price = priceObj;
      }
    }
    
    const matchesCategory = item.category === "Combo";
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesType = selectedType === "All" || item.subcategory === selectedType;
    const matchesRating = selectedRating === 0 || (item.rating || 0) >= selectedRating;

    return matchesCategory && matchesPrice && matchesType && matchesRating;
  });

  return (
    <section className="bg-green4">
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

      {loadingProducts ? (
        <LodingPage />
      ) : (
        <>
          <PageHeader title="Combo Packs" curpage="Combos" />

    
      {/* Header */}
      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold mb-4">
          Today's <span className="text-green-600">Offers</span>
        </h2>
        <div className="mx-auto mb-4 w-[180px] border-b-2 border-dashed border-green1 h-[2px]" />
      </div>

      {/* Filters + Products */}
      <div className="bg-green4 px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter toggle (mobile only) */}
        {windowWidth < 768 && (
          <div className="flex justify-start mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-xl p-2 border rounded-full hover:bg-green1 hover:text-white transition"
              aria-label="Toggle filters"
            >
              {showFilters ? <IoClose /> : <CiFilter />}
            </button>
          </div>
        )}

        {/* Sidebar Filters - hidden on mobile by default */}
        {(showFilters || windowWidth >= 768) && (
          <aside className="bg-[#fffde7] p-4 rounded-xl shadow border border-green-200 md:sticky md:top-4 md:h-fit col-span-1">
            <h2 className="text-lg font-bold mb-4 text-green-700">
              Filter Options
            </h2>

            {/* Price Filter */}
            <div className="mb-4">
              <h3 className="font-semibold text-green-700 border-b border-dashed border-green-400 pb-1 mb-2">
                Price Range
              </h3>
              <p className="text-green-600 text-sm mb-2">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </p>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, +e.target.value])}
                className="w-full accent-green-600"
              />
            </div>

            {/* Combo Type Filter */}
            <div className="mb-4">
              <h3 className="font-semibold text-green-700 border-b border-dashed border-green-400 pb-1 mb-2">
                Combo Type
              </h3>
              {types.map((t) => (
                <label key={t} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    onChange={() => onFilterChange(setSelectedType)(t)}
                    checked={selectedType === t}
                    className="accent-green-600"
                  />
                  {t}
                </label>
              ))}
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
              <h3 className="font-semibold text-green-700 border-b border-dashed border-green-400 pb-1 mb-2">
                Minimum Rating
              </h3>
              {[0, 1, 2, 3, 4, 5].map((r) => (
                <label key={r} className="flex items-center gap-2 mb-1 text-sm">
                  <input
                    type="radio"
                    name="rating"
                    value={r}
                    onChange={() => onFilterChange(setSelectedRating)(r)}
                    checked={selectedRating === r}
                    className="accent-green-600"
                  />
                  {r === 0 ? "All" : `${r} stars & up`}
                </label>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedType("All");
                setPriceRange([0, maxPrice]);
                setSelectedRating(0);
              }}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-green-700 hover:text-white rounded transition text-sm w-full"
            >
              Clear Filters
            </button>
          </aside>
        )}

        {/* Product Grid */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProduct.length > 0 ? (
            filteredProduct.map((product) => {
              let price = 0;
              let mrp = 0;
              
              if (product.category === "Combo") {
                // For combo products - use database values directly
                mrp = Number(product.mrp) || 0;
                price = Number(product.offerPrice) || mrp;
              } else {
                // For regular products (fallback)
                const activeWeight = product.weights?.[0] || "";
                const priceObj = product.prices?.[activeWeight];
                if (typeof priceObj === "object" && priceObj !== null) {
                  mrp = Number(priceObj.mrp) || 0;
                  price = Number(priceObj.offerPrice) || mrp;
                } else if (typeof priceObj === "number") {
                  mrp = Number(priceObj);
                  price = mrp;
                }
              }

              // Ensure valid numbers
              if (isNaN(mrp) || mrp <= 0) mrp = price;
              if (isNaN(price) || price <= 0) price = mrp;
              
              const avgRating = product.rating || 4.5;
              const isOutOfStock = product.stock <= 0;

              return (
                 <div
                    key={product.id}
                    className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center hover:shadow-lg transition h-full"
                  >
                    <div className="relative w-full h-80 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                    <Link to={`/combos/${product.id}`} className="block w-full h-full flex items-center justify-center">
                      <OptimizedImage
                        src={product.images?.[0] || ""}
                        alt={product.name}
                        className="w-full h-full flex items-center justify-center p-5 transition-transform duration-500 transform hover:scale-110"
                        objectFit="contain"
                        loading="lazy"
                      />
                    </Link>
                    {/* <span className="absolute top-2 left-0 bg-primary text-white text-xs px-3 py-1 rounded-r-full shadow">
                      Bestseller
                    </span> */}
                    {/* <button
                      onClick={() => {
                        addToFav({
                          ...product,
                          imageUrl: product.images[0],
                          qty: 1,
                          selectedWeight: activeWeight,
                          price,
                        });
                        toast.success("Added to favorites!");
                      }}
                      className="absolute top-2 right-2 border p-2 rounded-full group-hover:text-white group-hover:bg-primary transition cursor-pointer"
                    >
                      <FaRegHeart />
                    </button> */}
                    {/* <p className="absolute left-0 bottom-2 py-1 px-3 bg-red-500 text-white rounded-br-full rounded-tr-full">
                      {offer}%
                    </p> */}
                  </div>

               

                  

                 <div className="w-full">
                   <h3 className="font-bold text-lg mb-1 mt-2 text-center">{product.name}</h3>
                      <div className="text-center text-yellow-500 text-sm">
                        {[...Array(5)].map((_, i) =>
                          i < (product.rating || 0) ? "★" : "☆"
                        )}
                      </div>
                      <p className="text-sm text-center text-gray-600 mt-1 truncate px-2">
                        {product.combos?.map(item => (typeof item === 'object' ? item.name : item)).join(" | ")}
                      </p>
                      

                  {/* Stock/Price display */}
                  {isOutOfStock ? (
                    <>
                      {mrp > price ? (
                        <p className="text-center text-gray-600 text-sm mb-3 mt-5">
                          MRP:{" "}
                          <span className="line-through text-gray-400">₹{mrp}</span> ₹{price}
                        </p>
                      ) : (
                        <p className="text-center text-gray-600 text-sm mb-3 mt-5">
                          Price: ₹{price}
                        </p>
                      )}
                      <p className="text-center text-red-500 text-sm mb-3 font-medium">
                        Out of Stock
                      </p>
                    </>
                  ) : (
                    <>
                      {mrp > price ? (
                        <p className="text-center text-gray-600 mt-5 text-sm mb-2">
                          MRP:{" "}
                          <span className="line-through text-gray-400">₹{mrp}</span> ₹{price}
                        </p>
                      ) : (
                        <p className="text-center text-gray-600 mt-5 text-sm mb-2">
                          Price: ₹{price}
                        </p>
                      )}
                    </>
                  )}
                 </div>

                  <div className="w-[90%] h-[1px] border-b border-dashed border-green1 mx-auto mb-4 mt-2" />

                  {/* <div className="flex justify-between items-center mt-auto px-1">
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
                        toast.success("Added to cart!");
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
                  </div> */}
                  
                   
                        <Link
                          to={`/combos/${product.id}`}
                          className="mt-auto w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-center block"
                        >
                          View Combo
                        </Link>
                      
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full py-10">No combos found.</p>
          )}
        </div>
      </div>
        </>
      )}
    </section>
  );
};

export default Combos;
