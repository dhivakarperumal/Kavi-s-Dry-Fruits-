// ProductCard.jsx - Memoized product card component for better performance
import React from "react";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import OptimizedImage from "./OptimizedImage";

const ProductCard = React.memo(({
  product,
  activeWeight,
  addToCart,
  addToFav,
  favItems = [],
}) => {
  const isFavorite = favItems.some(item => String(item.productId) === String(product.id));

  // Get price object for the active weight
  const priceObj = product.prices?.[activeWeight];
  let mrp = 0;
  let offerPrice = 0;

  if (typeof priceObj === "object" && priceObj !== null) {
    mrp = Number(priceObj.mrp) || 0;
    offerPrice = Number(priceObj.offerPrice) || Number(priceObj.mrp) || 0;
  } else if (typeof priceObj === "number") {
    // Fallback for old format
    offerPrice = Number(priceObj);
    mrp = Math.round(offerPrice / 0.84); // Estimate MRP
  }

  // Additional safety check
  if (typeof mrp !== 'number' || isNaN(mrp)) mrp = 0;
  if (typeof offerPrice !== 'number' || isNaN(offerPrice)) offerPrice = 0;

  const offer = parseFloat(product.offer);
  let finalPrice = offerPrice;

  if (!isNaN(offer) && offer > 0) {
    finalPrice = Math.round(offerPrice * (1 - offer / 100));
    if (mrp === 0) mrp = offerPrice; // Set MRP if not set
  }

  const avgRating = product.rating || 4.5;

  const handleAddToFav = (e) => {
    e.preventDefault();
    addToFav({
      ...product,
      imageUrl: product.images[0],
      qty: 1,
      selectedWeight: activeWeight,
      price: finalPrice,
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.isOutOfStock) {
      toast.error("Out of Stock");
      return;
    }
    addToCart({
      ...product,
      imageUrl: product.images[0],
      qty: 1,
      selectedWeight: activeWeight,
      price: finalPrice,
      weights: product.weights,
    });
  };

  return (
    <div className="group bg-white rounded-2xl p-4 shadow-md hover:ring-2 hover:ring-green1 transition-all duration-300 relative">
      <div className="relative h-60 w-full flex items-center justify-center border-2 border-dashed border-primary rounded-md overflow-hidden bg-gray-50">
        <Link to={`/shop/${product.id}`} className="w-full h-full flex items-center justify-center">
          <OptimizedImage
            src={product.images?.[0] || ""}
            alt={`${product.name} - Kavi's Dry Fruits`}
            className="w-full h-full flex items-center justify-center p-5 rounded-md transition-transform duration-500 transform hover:scale-110"
            objectFit="contain"
            loading="lazy"
          />
        </Link>
        <span className="absolute top-2 left-0 bg-primary text-white text-xs px-3 py-1 rounded-r-full shadow">
          Bestseller
        </span>
        <button
          onClick={handleAddToFav}
          className={`absolute top-2 right-2 border p-2 rounded-full transition cursor-pointer ${isFavorite ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-400 border-slate-200 hover:bg-primary hover:text-white"}`}
        >
          <FiHeart className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      <h3 className="font-semibold text-base sm:text-lg text-center mb-2">
        {product.name}
      </h3>
      {product.isOutOfStock ? (
        <>
          <p className="text-center text-gray-600 text-sm mb-2">
            MRP:{" "}
            <span className="line-through text-gray-400">
              ₹{mrp}
            </span>{" "}
            ₹{offerPrice}
          </p>
          <p className="text-center text-red-500 text-sm mb-2 font-medium">
            Out of Stock
          </p>
        </>
      ) : (
        <p className="text-center text-gray-600 text-sm mb-2">
          MRP:{" "}
          <span className="line-through text-gray-400">
            ₹{mrp}
          </span>{" "}
          ₹{offerPrice}
        </p>
      )}
      <div className="w-[90%] h-[1px] border-b border-dashed border-green1 mx-auto mb-3" />
      <div className="flex justify-between items-center mt-auto px-1">
        <button
          disabled={product.isOutOfStock}
          onClick={handleAddToCart}
          className={`${
            product.isOutOfStock
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
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.activeWeight === nextProps.activeWeight &&
    prevProps.product.isOutOfStock === nextProps.product.isOutOfStock &&
    prevProps.product.rating === nextProps.product.rating &&
    prevProps.favItems?.length === nextProps.favItems?.length
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
