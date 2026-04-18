// Shop.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { IoCartOutline, IoClose } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import PageHeader from "../Component/PageHeader";
import PageNavigation from "../Component/PageNavigation";
import { Link } from "react-router-dom";
import { useStore } from "../Context/StoreContext";
import NewArrived from "../Home/NewArrived";
import { toast } from "react-hot-toast";
import LodingPage from "../Component/LoadingPage";
import { ProductSkeletonGrid } from "../Component/SkeletonLoader";
import ProductCard from "../Component/ProductCard";
import { Helmet } from "react-helmet";
import OptimizedImage from "../Component/OptimizedImage";

const categories = [
  "All",
  "Nuts",
  "Dryfruits",
  "Dates",
  "Raisins",
  "Driedfruits",
  "Seeds",
];
const weights = ["All", "100g", "250g", "500g", "1000g"];
const ratings = [4, 3];
const tags = [
  "All",
  "New Arrivals",
  "Best Sellers",
  "Festive Picks",
  "Premium Quality",
  "Organic",
];
const productsPerPage = 30;

const Shop = () => {
  const { allProducts, addToCart, addToFav } = useStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWeight, setSelectedWeight] = useState("All");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const safePrices = (allProducts || []).flatMap((p) => {
    if (p.category === "Combo") {
      // For combo products, use mrp and offerPrice at top level
      return [p.mrp || 0, p.offerPrice || 0].filter(price => price > 0);
    } else if (p?.prices && typeof p.prices === "object") {
      // For regular products, extract prices from weights
      return Object.values(p.prices).flatMap((priceObj) => {
        if (typeof priceObj === "object" && priceObj !== null) {
          return [priceObj.mrp || 0, priceObj.offerPrice || 0].filter(price => price > 0);
        } else if (typeof priceObj === "number") {
          // Fallback for old format
          return [priceObj];
        }
        return [];
      });
    }
    return [];
  });
  const maxPrice = safePrices.length ? Math.max(...safePrices) : 1000;
  const [priceRange, setPriceRange] = useState([0, maxPrice]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) setShowFilters(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (allProducts?.length > 0) {
      setLoading(false);
      console.log("Sample product data:", allProducts[0]);
      console.log("Sample product prices:", allProducts[0]?.prices);
    }
  }, [allProducts]);

  // Memoize filtered products to avoid recalculating on every render
  const filteredProducts = useMemo(() => {
    return (allProducts || []).filter((p) => {
      if (p.category === "Combo") return false;
      if (!p?.prices || typeof p.prices !== "object") return false;

      const matchCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchWeight =
        selectedWeight === "All" || p.weights?.includes(selectedWeight);
      const weightToUse =
        selectedWeight !== "All" ? selectedWeight : p.weights?.[0];
      
      // Get price for the selected weight
      let basePrice = 0;
      const priceObj = p.prices[weightToUse];
      if (typeof priceObj === "object" && priceObj !== null) {
        basePrice = priceObj.offerPrice || priceObj.mrp || 0;
      } else if (typeof priceObj === "number") {
        // Fallback for old format
        basePrice = priceObj;
      }

      const offer = parseFloat(p.offer);
      let price = basePrice;

      if (!isNaN(offer) && offer > 0) {
        price = Math.round(basePrice * (1 - offer / 100));
      }

      const matchPrice = price >= priceRange[0] && price <= priceRange[1];
      const matchRating = selectedRating === 0 || p.rating >= selectedRating;
      const matchTag =
        selectedTag === "All" || (p.tags && p.tags.includes(selectedTag));

      return (
        matchCategory && matchWeight && matchPrice && matchRating && matchTag
      );
    });
  }, [allProducts, selectedCategory, selectedWeight, priceRange, selectedRating, selectedTag]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = useMemo(() => filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  ), [filteredProducts, startIndex, productsPerPage]);

  const onFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  // ref to the products grid to keep pagination at the bottom and scroll to it after page change
  const productsRef = useRef(null);

  // central handler so we update page and keep the grid in view (so pagination stays at bottom)
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // wait a tick for DOM update then scroll the products section into view
    setTimeout(() => {
      if (
        productsRef.current &&
        typeof productsRef.current.scrollIntoView === "function"
      ) {
        productsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  // Prevent anchors with hash hrefs from causing the browser to jump to top
  const preventAnchorScroll = (e) => {
    try {
      const anchor = e.target.closest && e.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
      }
    } catch (err) {
      // safe fallback - do nothing
    }
  };

  return (
    <section className="bg-green4">
     <Helmet>
  <title>Shop Premium Dry Fruits, Nuts, Dates & Seeds | Kavi’s Dry Fruits</title>

  <meta
    name="description"
    content="Explore and shop premium dry fruits, nuts, dates, raisins, seeds, combos and more. High quality, fresh and healthy products delivered Pan India."
  />

  <meta
    name="keywords"
    content="dry fruits shop, buy nuts online, dates online, pistachios online, almonds online, cashews online, premium dry fruits store"
  />

  <link rel="canonical" href="https://kavisdryfruits.com/shop" />

  <meta property="og:title" content="Shop Premium Dry Fruits & Nuts – Kavi’s Dry Fruits" />
  <meta property="og:description" content="Buy premium almonds, cashews, pista, raisins, dates & seeds with fast delivery." />
  <meta property="og:url" content="https://kavisdryfruits.com/shop" />
  <meta property="og:type" content="website" />
</Helmet>


      <PageHeader title="Shop" curpage="Shop" />

      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold mb-4">
          Top Selling <span className="text-green-600">Products</span>
        </h2>
        <div className="w-[180px] h-[2px] border-b-2 border-dashed border-green1 mx-auto mb-4"></div>
      </div>

      <div className="bg-green4 px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {windowWidth < 768 && (
          <div className="flex justify-start">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
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
              <p>
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </p>
              <input
                type="range"
                min="0"
                max={isNaN(maxPrice) ? "1000" : maxPrice.toString()}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-green-600"
              />
            </div>

            {["Category", "Weight", "Ratings", "Tags"].map((title, i) => {
              const list =
                title === "Category"
                  ? categories
                  : title === "Weight"
                  ? weights
                  : title === "Ratings"
                  ? [
                      { label: "4★ & up", value: 4 },
                      { label: "3★ & up", value: 3 },
                      { label: "All Ratings", value: 0 },
                    ]
                  : tags;
              const selected =
                title === "Category"
                  ? selectedCategory
                  : title === "Weight"
                  ? selectedWeight
                  : title === "Ratings"
                  ? selectedRating
                  : selectedTag;
              const setter =
                title === "Category"
                  ? setSelectedCategory
                  : title === "Weight"
                  ? setSelectedWeight
                  : title === "Ratings"
                  ? setSelectedRating
                  : setSelectedTag;

              return (
                <div key={i} className="mb-4">
                  <h3 className="font-semibold text-green-700">{title}</h3>
                  {list.map((item) => {
                    const val = typeof item === "object" ? item.value : item;
                    const label = typeof item === "object" ? item.label : item;
                    return (
                      <label key={val} className="flex gap-2 mb-2">
                        <input
                          type="radio"
                          name={title}
                          value={val}
                          checked={selected === val}
                          onChange={() => onFilterChange(setter)(val)}
                        />
                        {label}
                      </label>
                    );
                  })}
                </div>
              );
            })}

            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedWeight("All");
                setSelectedRating(0);
                setSelectedTag("All");
                setPriceRange([0, maxPrice]);
                setCurrentPage(1);
              }}
              className="mt-4 bg-gray-200 rounded p-2"
            >
              Clear Filters
            </button>
          </aside>
        )}

        <main className="md:col-span-3">
          {loading ? (
            <ProductSkeletonGrid count={productsPerPage} />
          ) : (
            <>
              <div ref={productsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                    return (
                      <ProductCard
                        key={`${product.id}-${activeWeight}`}
                        product={product}
                        activeWeight={activeWeight}
                        selectedWeight={selectedWeight}
                        addToCart={addToCart}
                        addToFav={addToFav}
                      />
                    );
                  })
                )}
              </div>

              {totalPages > 1 && (
                <div onClick={preventAnchorScroll}>
                  <PageNavigation
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

  
    </section>
  );
};

export default Shop;
