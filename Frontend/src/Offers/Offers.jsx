

import PageHeader from "../Component/PageHeader";
import { useState, useEffect, useMemo } from "react";
import { IoCartOutline, IoClose } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import PageNavigation from "../Component/PageNavigation";
import { useStore } from "../Context/StoreContext";
import { Link, useNavigate } from "react-router-dom";
import LodingPage from "../Component/LoadingPage";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import OptimizedImage from "../Component/OptimizedImage";

const categories = [
  "All",
  "Nuts",
  "Dry Fruits",
  "Dates",
  "Raisins",
  "Dried Fruits",
  "Seeds",
];
const weights = ["All", "100g", "250g", "500g", "1000g"];
const productsPerPage = 9;

const Offers = () => {
  const { allProducts, addToCart, loadingProducts } = useStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWeight, setSelectedWeight] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) setShowFilters(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const offerProducts = useMemo(
    () => allProducts.filter((p) => {
      if (p.category === "Combo") return false; // Exclude combos
      
      let mrp = 0;
      let offerPrice = 0;
      
      // Check if product has direct mrp/offerPrice fields (for simple products)
      if (p.mrp !== undefined && p.offerPrice !== undefined) {
        mrp = Number(p.mrp) || 0;
        offerPrice = Number(p.offerPrice) || mrp;
      } else if (typeof p.prices === "number") {
        // Old format: single price
        mrp = Number(p.prices);
        offerPrice = mrp;
      } else {
        // New format: prices per weight
        const priceObj = p.prices?.[p.weights?.[0]];
        if (typeof priceObj === "object" && priceObj !== null) {
          mrp = Number(priceObj.mrp) || 0;
          offerPrice = Number(priceObj.offerPrice) || mrp;
        } else if (typeof priceObj === "number") {
          mrp = Number(priceObj);
          offerPrice = mrp;
        }
      }
      
      return offerPrice < mrp; // Only include products with actual discounts
    }),
    [allProducts]
  );

  const maxPrice = useMemo(() => {
    if (offerProducts.length === 0) return 1000;
    
    const prices = offerProducts.flatMap((p) => {
      // Check for direct mrp/offerPrice fields first
      if (p.mrp !== undefined && p.offerPrice !== undefined) {
        return [Number(p.mrp) || 0, Number(p.offerPrice) || 0].filter(price => price > 0);
      } else if (typeof p.prices === "number") {
        return [p.prices];
      } else if (p.prices && typeof p.prices === "object") {
        return Object.values(p.prices).flatMap((priceObj) => {
          if (typeof priceObj === "object" && priceObj !== null) {
            return [priceObj.mrp || 0, priceObj.offerPrice || 0].filter(price => price > 0);
          } else if (typeof priceObj === "number") {
            return [priceObj];
          }
          return [];
        });
      }
      return [];
    });
    return prices.length ? Math.max(...prices) : 1000;
  }, [offerProducts]);

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const filteredProducts = offerProducts.filter((p) => {
    const weightMatch =
      selectedWeight === "All" ||
      (p.weights && p.weights.includes(selectedWeight));

    const categoryMatch =
      selectedCategory === "All" || p.category?.toLowerCase().replace(/\s+/g, '') === selectedCategory.toLowerCase().replace(/\s+/g, '');

    let offerPrice = 0;
    
    // Check for direct mrp/offerPrice fields first
    if (p.mrp !== undefined && p.offerPrice !== undefined) {
      offerPrice = Number(p.offerPrice) || Number(p.mrp) || 0;
    } else if (typeof p.prices === "number") {
      offerPrice = Number(p.prices);
    } else {
      const priceKey = selectedWeight !== "All" ? selectedWeight : p.weights?.[0];
      const priceObj = p.prices?.[priceKey];
      if (typeof priceObj === "object" && priceObj !== null) {
        offerPrice = Number(priceObj.offerPrice) || Number(priceObj.mrp) || 0;
      } else if (typeof priceObj === "number") {
        offerPrice = Number(priceObj);
      }
    }

    const priceMatch = offerPrice >= priceRange[0] && offerPrice <= priceRange[1];

    return weightMatch && categoryMatch && priceMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts
    .map((product) => {
      // Calculate discount percentage for sorting
      let mrp = 0;
      let offerPrice = 0;
      
      if (product.mrp !== undefined && product.offerPrice !== undefined) {
        mrp = Number(product.mrp) || 0;
        offerPrice = Number(product.offerPrice) || mrp;
      } else if (typeof product.prices === "number") {
        mrp = Number(product.prices);
        offerPrice = mrp;
      } else {
        const priceObj = product.prices?.[product.weights?.[0]];
        if (typeof priceObj === "object" && priceObj !== null) {
          mrp = Number(priceObj.mrp) || 0;
          offerPrice = Number(priceObj.offerPrice) || mrp;
        } else if (typeof priceObj === "number") {
          mrp = Number(priceObj);
          offerPrice = mrp;
        }
      }
      
      const discountPercent = mrp > offerPrice ? ((mrp - offerPrice) / mrp) * 100 : 0;
      
      return { ...product, discountPercent };
    })
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const onFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <section className="bg-green4 overflow-hidden">
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
          <PageHeader title="Offers" curpage="Offers" />

     

      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold mb-4">
          Today <span className="text-green-600">Offer</span>
        </h2>
        <div className="w-[180px] h-[2px] border-b-2 border-dashed border-green1 mx-auto mb-4" />
      </div>

      <div className="bg-green4 px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {windowWidth < 768 && (
          <div className="flex justify-start">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-xl p-2 border rounded-full hover:bg-green1 hover:text-white transition"
            >
              {showFilters ? <IoClose /> : <CiFilter />}
            </button>
          </div>
        )}

        {(showFilters || windowWidth >= 768) && (
          <aside className="bg-[#fffde7] h-fit rounded-xl p-4 shadow border border-green-200 md:sticky top-4">
            <h2 className="font-bold text-lg mb-4 text-green-700">
              Filter Options
            </h2>
            <div className="mb-4">
              <h3 className="font-semibold text-green-700">Price Range</h3>
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
            <div className="mb-4">
              <h3 className="font-semibold text-green-700">Category</h3>
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => onFilterChange(setSelectedCategory)(cat)}
                    className="accent-green-600"
                  />
                  {cat}
                </label>
              ))}
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-green-700">Weight</h3>
              {weights.map((w) => (
                <label key={w} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="weight"
                    checked={selectedWeight === w}
                    onChange={() => onFilterChange(setSelectedWeight)(w)}
                    className="accent-green-600"
                  />
                  {w}
                </label>
              ))}
            </div>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedWeight("All");
                setPriceRange([0, maxPrice]);
                setCurrentPage(1);
              }}
              className="mt-4 py-2 px-4 bg-gray-200 rounded hover:bg-green-700 hover:text-white text-sm"
            >
              Clear Filters
            </button>
          </aside>
        )}

        <main className="md:col-span-3">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No products found.
              </p>
            ) : (
              paginatedProducts.map((product) => {
                const activeWeight =
                  selectedWeight !== "All"
                    ? selectedWeight
                    : product.weights?.[0];
               
                let mrp = 0;
                let offerPrice = 0;
                
                // Check for direct mrp/offerPrice fields first (for simple products)
                if (product.mrp !== undefined && product.offerPrice !== undefined) {
                  mrp = Number(product.mrp) || 0;
                  offerPrice = Number(product.offerPrice) || mrp;
                } else if (typeof product.prices === "number") {
                  // Old format: single price
                  mrp = Number(product.prices);
                  offerPrice = mrp;
                } else {
                  // New format: prices per weight
                  const priceObj = product.prices?.[activeWeight];
                  if (typeof priceObj === "object" && priceObj !== null) {
                    mrp = Number(priceObj.mrp) || 0;
                    offerPrice = Number(priceObj.offerPrice) || mrp;
                  } else if (typeof priceObj === "number") {
                    mrp = Number(priceObj);
                    offerPrice = mrp;
                  }
                }
                
                // Ensure valid numbers
                if (isNaN(mrp) || mrp <= 0) mrp = offerPrice;
                if (isNaN(offerPrice) || offerPrice <= 0) offerPrice = mrp;
                
                const outOfStock = product.stock <= 0;

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl p-4 shadow hover:ring-2 hover:ring-green1 transition relative"
                  >
                    <div className="z-10 absolute top-7 left-4 bg-green1 text-white text-xs px-3 py-1 rounded-r-full">
                      Bestseller
                    </div>
                    <div className="relative border-2 border-dotted border-green1 rounded-2xl bg-gray-50 h-56 flex items-center justify-center overflow-hidden">
                      <OptimizedImage
                        src={product.images?.[0]}
                        alt={`${product.name} - Kavi's Dry Fruits`}
                        className="w-full h-full flex items-center justify-center p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300"
                        objectFit="contain"
                        loading="lazy"
                      />
                      <span className="absolute top-2 right-2 bg-red-700 text-white text-sm py-2 px-3 rounded-lg">
                        {mrp > offerPrice ? Math.round(((mrp - offerPrice) / mrp) * 100) : 0}%<br />
                        OFF
                      </span>
                    </div>
                    <Link
                      to={`/shop/${product.id}`}
                      className="font-semibold text-base sm:text-lg text-center block mb-2"
                    >
                      {product.name} ({activeWeight})
                    </Link>
                    {mrp > offerPrice ? (
                      <p className="text-center text-gray-600 text-sm mb-2">
                        MRP:{" "}
                        <span className="line-through text-gray-400">
                          ₹{mrp}
                        </span>{" "}
                        ₹{offerPrice}
                      </p>
                    ) : (
                      <p className="text-center text-gray-600 text-sm mb-2">
                        Price: ₹{offerPrice}
                      </p>
                    )}
                    {outOfStock && (
                      <p className="text-center font-semibold text-red-500">
                        Out of Stock
                      </p>
                    )}
                    <div className="w-[90%] h-[1px] border-b border-dashed border-green1 mx-auto mb-3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-3 items-center px-1">
                      <button
                        onClick={() =>
                          navigate("/checkout", {
                            state: {
                              checkoutProduct: {
                                ...product,
                                quantity: 1,
                                selectedWeight: activeWeight,
                                price: offerPrice,
                                img: product.images?.[0],
                              },
                            },
                          })
                        }
                        disabled={outOfStock}
                        className={`py-2 px-4 w-full text-sm rounded-md font-semibold ${
                          outOfStock
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-primary text-white hover:bg-green1"
                        }`}
                      >
                        Buy Now
                      </button>
                      <button
                        disabled={outOfStock}
                        onClick={() => {
                          addToCart({
                            ...product,
                            imageUrl: product.images?.[0],
                            qty: 1,
                            selectedWeight: activeWeight,
                            price: offerPrice,
                            weights: product.weights,
                          });
                        }}
                        className={`text-white w-full py-2 rounded-md text-xl flex justify-center items-center transition cursor-pointer ${
                          outOfStock
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-green1 hover:bg-green2"
                        }`}
                      >
                        <IoCartOutline />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-10">
              <PageNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
        </>
      )}
    </section>
  );
};

export default Offers;
