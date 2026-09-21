// ProductCard.jsx - Memoized product card component for better performance
import React from "react";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import OptimizedImage from "./OptimizedImage";
import { formatStockDisplay, isProductOutOfStock, isLowStock, checkVariantStock } from "../utils/stockUtils";

const ProductCard = React.memo(({
  product,
  activeWeight,
  titleSuffix,
  addToCart,
  addToFav,
  favItems = [],
}) => {
  const isFavorite = favItems.some(item => String(item.productId) === String(product.id));
  const stock = Number(product.stock ?? product.totalStock ?? 0);
  const isCombo = product.category === "Combo" || product.type === "combo";
  const isOutOfStock = product.isOutOfStock ?? isProductOutOfStock(product);
  const lowStock = isLowStock(product);
  const variantCheck = checkVariantStock(activeWeight, 1, stock, isCombo);

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

  const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;

  const avgRating = product.rating || 4.5;
  const displayedWeight = titleSuffix || (!isCombo ? activeWeight || "100g" : "");

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
    if (isOutOfStock) {
      toast.error("Out of Stock");
      return;
    }
    if (!variantCheck.canFulfill) {
      if (isCombo) toast.error(`Out of Stock. Only ${formatStockDisplay(stock, true)} available.`);
      else toast.error(`Only ${formatStockDisplay(stock, isCombo)} available in stock. Please select an available package size.`);
      return;
    }
    addToCart({
      ...product,
      imageUrl: product.images?.[0] || product.image || "",
      qty: 1,
      selectedWeight: activeWeight,
      price: finalPrice,
      weights: product.weights,
    });
  };

  return (
    <div className="group bg-white rounded-2xl p-4 shadow-md hover:ring-2 hover:ring-green1 transition-all duration-300 relative flex flex-col h-full min-h-[390px]">
      <div className="relative h-60 w-full flex items-center justify-center border-2 border-dashed border-primary rounded-md overflow-hidden bg-gray-50">
        <Link to={product.category === "Combo" || product.type === "combo" ? `/combos/${product.id}` : `/shop/${product.id}`} className="w-full h-full flex items-center justify-center">
          <OptimizedImage
            src={product.images?.[0] || ""}
            alt={`${product.name} - Kavi's Dry Fruits`}
            className="w-full h-full flex items-center justify-center p-5 rounded-md"
            imageClassName="transition-transform duration-500 group-hover:scale-110"
            objectFit="contain"
            loading="lazy"
          />
        </Link>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 p-4">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest text-xs shadow-xl transform -rotate-12 border-2 border-white">
              Out of Stock
            </span>
          </div>
        )}
        {lowStock && !isOutOfStock && (
          <span className="absolute bottom-2 left-2 z-10 bg-amber-500/95 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow uppercase tracking-wider">
            Only {formatStockDisplay(stock, isCombo)} left
          </span>
        )}
        <span className="absolute top-2 left-0 bg-primary text-white text-xs px-3 py-1 rounded-r-full shadow">
          Bestseller
        </span>
        <button
          onClick={handleAddToFav}
          className={`absolute top-2 right-2 border p-2 rounded-full transition cursor-pointer z-20 ${isFavorite ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-400 border-slate-200 hover:bg-primary hover:text-white"}`}
        >
          <FiHeart className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      <Link to={product.category === "Combo" || product.type === "combo" ? `/combos/${product.id}` : `/shop/${product.id}`} className="block flex-1">
        <h3 className="font-semibold text-base sm:text-lg text-center mb-2 hover:text-green1 transition-colors truncate whitespace-nowrap overflow-hidden text-ellipsis">
          {product.name}{displayedWeight ? ` (${displayedWeight})` : ""}
        </h3>
      </Link>
      <p className="text-center text-gray-600 text-sm mb-2">
        MRP:{" "}
        <span className="line-through text-gray-400">
          {formatPrice(mrp)}
        </span>{" "}
        <span className="font-bold text-green-700 text-lg">{formatPrice(finalPrice)}</span>
      </p>
      <div className="w-[90%] h-[1px] border-b border-dashed border-green1 mx-auto mb-3" />
      <div className="flex justify-between items-center mt-auto px-1">
        <button
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`${isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : !variantCheck.canFulfill
              ? "bg-amber-600 hover:bg-amber-700 cursor-pointer"
              : "bg-green1 hover:bg-green2 cursor-pointer"
            } text-white w-1/2 py-2 rounded-md text-xl flex justify-center items-center transition`}
          title={!variantCheck.canFulfill ? `Only ${formatStockDisplay(stock, isCombo)} available` : "Add to Cart"}
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
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.product.totalStock === nextProps.product.totalStock &&
    prevProps.product.rating === nextProps.product.rating &&
    prevProps.favItems?.length === nextProps.favItems?.length
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
