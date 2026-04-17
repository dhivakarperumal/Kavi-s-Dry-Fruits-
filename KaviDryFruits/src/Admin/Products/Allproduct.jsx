import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaPlus, FaFilter, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";

const Allproduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categoryFilter, setCategoryFilter] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState("All");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState([]);
  const [weights, setWeights] = useState([]);
  const [tags, setTags] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);

  const [showFilters, setShowFilters] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const navigate = useNavigate();

   const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Number of products per page

  

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productList);
        setFilteredProducts(productList);

        setCategories([...new Set(productList.map((p) => p.category).filter(Boolean))]);

        setWeights([
          ...new Set(
            productList.flatMap((p) =>
              p.prices ? Object.keys(p.prices) : p.weight ? [p.weight] : []
            )
          ),
        ]);

        setTags([...new Set(productList.flatMap((p) => p.tags || []).filter(Boolean))]);

        const allPrices = productList.flatMap((p) => {
          if (p.prices) {
            return Object.values(p.prices).flatMap((val) => {
              if (val && typeof val === "object") {
                // price object might contain offerPrice and mrp
                return [Number(val.offerPrice) || 0, Number(val.mrp) || 0];
              }
              return [Number(val) || 0];
            });
          }
          // fallback to top level price fields
          if (p.offerPrice !== undefined || p.mrp !== undefined) {
            return [Number(p.offerPrice) || 0, Number(p.mrp) || 0];
          }
          return [Number(p.price) || 0];
        });
        const maxPriceVal = Math.max(...allPrices, 1000);
        setMaxPrice(maxPriceVal);
        setPriceRange([0, maxPriceVal]);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products!");
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter.length > 0) {
      filtered = filtered.filter((p) => categoryFilter.includes(p.category));
    }

    if (selectedWeight !== "All") {
      filtered = filtered.filter((p) =>
        p.prices
          ? Object.keys(p.prices).includes(selectedWeight)
          : p.weight === selectedWeight
      );
    }

    if (selectedRating > 0) {
      filtered = filtered.filter((p) => (p.rating || 0) >= selectedRating);
    }

    if (selectedTag !== "All") {
      filtered = filtered.filter((p) => (p.tags || []).includes(selectedTag));
    }

    filtered = filtered.filter((p) => {
      const checkValue = (val) => {
        let num = 0;
        if (val && typeof val === "object") {
          num = Number(val.offerPrice) || Number(val.mrp) || 0;
        } else {
          num = Number(val) || 0;
        }
        return num >= priceRange[0] && num <= priceRange[1];
      };

      if (p.prices) {
        return Object.values(p.prices).some((price) => checkValue(price));
      }

      if (p.offerPrice !== undefined || p.mrp !== undefined) {
        return checkValue({ offerPrice: p.offerPrice, mrp: p.mrp });
      }

      const price = p.price || 0;
      return checkValue(price);
    });

    setFilteredProducts(filtered);
  }, [search, categoryFilter, selectedWeight, selectedRating, selectedTag, priceRange, products]);

  const clearFilters = () => {
    setCategoryFilter([]);
    setSelectedWeight("All");
    setSelectedRating(0);
    setSelectedTag("All");
    setPriceRange([0, maxPrice]);
    setSearch("");
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteDoc(doc(db, "products", productId));
      toast.success("Product deleted successfully!");
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product!");
    }
  };

  return (
    <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6">
      {/* Sidebar Filters */}
      {showFilters && (
        <div className="w-full md:w-64 mt-15 bg-white p-4 rounded shadow space-y-4 flex-shrink-0">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Categories */}
          <div className="space-y-2">
            <p className="font-semibold">Categories:</p>
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={cat}
                  checked={categoryFilter.includes(cat)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) setCategoryFilter([...categoryFilter, cat]);
                    else setCategoryFilter(categoryFilter.filter((c) => c !== cat));
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                {cat}
              </label>
            ))}
          </div>

          {/* Weights */}
          <div className="space-y-2">
            <p className="font-semibold">Weight:</p>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="weight"
                value="All"
                checked={selectedWeight === "All"}
                onChange={() => setSelectedWeight("All")}
              />
              All
            </label>
            {weights.map((w) => (
              <label key={w} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="weight"
                  value={w}
                  checked={selectedWeight === w}
                  onChange={() => setSelectedWeight(w)}
                />
                {w}
              </label>
            ))}
          </div>

          {/* Ratings */}
          <div className="space-y-2">
            <p className="font-semibold">Ratings:</p>
            {[4, 3, 0].map((r) => (
              <label key={r} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rating"
                  value={r}
                  checked={selectedRating === r}
                  onChange={() => setSelectedRating(r)}
                />
                {r === 0 ? "All Ratings" : `${r}★ & up`}
              </label>
            ))}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <p className="font-semibold">Tags:</p>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tag"
                value="All"
                checked={selectedTag === "All"}
                onChange={() => setSelectedTag("All")}
              />
              All
            </label>
            {tags.map((t) => (
              <label key={t} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tag"
                  value={t}
                  checked={selectedTag === t}
                  onChange={() => setSelectedTag(t)}
                />
                {t}
              </label>
            ))}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <p className="font-semibold">
              Price: ₹{priceRange[0]} - ₹{priceRange[1]}
            </p>
            <input
              type="range"
              min={0}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full"
            />
          </div>

          <button
            onClick={clearFilters}
            className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div></div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 cursor-pointer md:px-6 bg-green-500 text-white rounded py-2 flex items-center gap-2 hover:bg-green-800"
            >
              <FaFilter /> Filter
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
         {currentProducts.length > 0 ? (
            currentProducts.map((product) => {
              const stock = product.stock || 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl p-4 shadow-md hover:ring-2 hover:ring-green-500 transition-all duration-300 relative"
                >
                  <div className="relative h-60 flex items-center justify-center border-2 border-dashed border-green-500 rounded-md overflow-hidden">
                    <img
                      src={product.images?.[0] || ""}
                      alt={product.name}
                      className="w-full h-full p-5 object-contain transition-transform duration-500 transform hover:scale-110"
                    />

                    {product.tags?.includes("Bestseller") && (
                      <span className="absolute top-2 left-0 bg-green-500 text-white text-xs px-3 py-1 rounded-r-full shadow">
                        Bestseller
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-base sm:text-lg text-center mb-2">
                    {product.name}
                  </h3>

                  <p className="line-clamp-2 mt-3 mb-2 overflow-hidden text-gray-700">
                    {product.description}
                  </p>


                  {/* Price Display */}
                  {(() => {
                    // compute display values; handle legacy number and new object formats
                    let displayPrice = 0;
                    let displayMrp = 0;

                    if (product.prices) {
                      const weightKeys = Object.keys(product.prices);
                      const defaultWeight = weightKeys[0];
                      const priceObj = product.prices[defaultWeight];

                      if (priceObj && typeof priceObj === "object") {
                        displayPrice = Number(priceObj.offerPrice) || Number(priceObj.mrp) || 0;
                        displayMrp = Number(priceObj.mrp) || displayPrice;
                      } else if (typeof priceObj === "number") {
                        displayPrice = priceObj;
                        displayMrp = Math.floor(priceObj / 0.84);
                      }
                    } else {
                      if (product.offerPrice !== undefined) {
                        displayPrice = Number(product.offerPrice) || 0;
                        displayMrp = Number(product.mrp) || displayPrice;
                      } else {
                        displayPrice = Number(product.price) || 0;
                        displayMrp = Number(product.mrp) || Math.floor(displayPrice / 0.84);
                      }
                    }

                    return (
                      <p className="text-center">
                        <span className="line-through text-gray-400">MRP: ₹{displayMrp}</span>{" "}
                        <span className="font-bold">₹{displayPrice}</span>
                      </p>
                    );
                  })()}



                  {stock <= 0 && (
                    <p className="text-center text-red-500 text-sm mb-2 font-medium">
                      Out of Stock
                    </p>
                  )}

                  <div className="w-[90%] h-[1px] border-b border-dashed border-green-500 mx-auto mb-3" />

                  <div className="flex justify-center items-center gap-1 text-sm mb-2">
                    <FaStar className="text-yellow-400" />
                    {product.rating || 4.5}
                  </div>

                  {/* View/Delete Buttons */}
                  <div className="flex justify-center items-center gap-4 mt-2">
                    <button
                      onClick={() => setViewProduct(product)}
                      className="text-gray-600 hover:text-blue-600 border p-2 rounded  flex items-center gap-1"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-gray-600 hover:text-red-600 border p-2 rounded  flex items-center gap-1"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center mt-10 md:col-span-3">
              No products found.
            </p>
          )}
        </div>
           {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-green-500 text-white"}`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${currentPage === page ? "bg-green-700 text-white" : "bg-green-500 text-white"}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-green-500 text-white"}`}
            >
              Next
            </button>
          </div>
        )}
      </div>

    

      {/* Product View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button
              onClick={() => setViewProduct(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-lg font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">{viewProduct.name}</h2>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center justify-center border p-2 rounded">
                <img
                  src={viewProduct.images?.[0] || ""}
                  alt={viewProduct.name}
                  className="object-contain max-h-60"
                />
              </div>

              <div className="flex-1 space-y-2">
                <p>
                  <span className="font-semibold">Category:</span> {viewProduct.category}
                </p>
                <p>
                  <span className="font-semibold">Subcategory:</span> {viewProduct.subcategory || "-"}
                </p>
                <p>
                  <span className="font-semibold">Price:</span>{" "}
                  {viewProduct.prices
                    ? Object.entries(viewProduct.prices)
                        .map(([w, p]) => {
                          let displayVal = 0;
                          if (p && typeof p === "object") {
                            displayVal = Number(p.offerPrice) || Number(p.mrp) || 0;
                          } else {
                            displayVal = Number(p) || 0;
                          }
                          return `${w}: ₹${displayVal}`;
                        })
                        .join(", ")
                    : viewProduct.offerPrice !== undefined
                    ? `₹${viewProduct.offerPrice}`
                    : `₹${viewProduct.price}`}
                </p>
                <p>
                  <span className="font-semibold">Stock:</span> {viewProduct.stock || 0}
                </p>
                <p>
                  <span className="font-semibold">Rating:</span> {viewProduct.rating || 4.5}★
                </p>
                {viewProduct.tags && (
                  <p>
                    <span className="font-semibold">Tags:</span> {viewProduct.tags.join(", ")}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Description:</span> {viewProduct.description || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allproduct;
