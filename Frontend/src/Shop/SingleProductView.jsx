import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaPlus, FaMinus, FaHeart } from "react-icons/fa";
import { useStore } from "../Context/StoreContext";
import PageHeader from "../Component/PageHeader";
import Testimonials from "./Testimonials";
import RelatedProducts from "./RelatedProducts";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import LodingPage from "../Component/LoadingPage";
import OptimizedImage from "../Component/OptimizedImage";
import api from "../services/api";
import { parseWeightToGrams, formatStockDisplay, isProductOutOfStock, isLowStock, checkVariantStock, getProductCartUsage } from "../utils/stockUtils";
import { normalizeProduct } from "../utils/catalog";

const getMetaDescription = (value) => {
  const description = String(value || "").replace(/\s+/g, " ").trim();
  return description.length > 155 ? `${description.slice(0, 152).trimEnd()}...` : description;
};

const SingleProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts, addToCart, addToFav, loadingProducts, cartItems } = useStore();

  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productLoadError, setProductLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeWeight, setActiveWeight] = useState("");
  const [reviewInput, setReviewInput] = useState({ user: "", comment: "" });

  // add these near your other useState declarations
  const [zoomed, setZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("50% 50%");
  const zoomLevel = 2;

  const handleMouseMove = (e) => {
    // Calculate cursor position inside the image element in percent
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };


  useEffect(() => {
    if (!id) return;

    const selected = allProducts.find((item) =>
      String(item.id) === String(id) || String(item.productId) === String(id)
    );

    if (selected) {
      if (selected.category === "Combo" || selected.type === "combo") {
        navigate(`/combos/${selected.id}`, { replace: true });
        return;
      }

      setProduct(selected);
      setProductLoading(false);
      setProductLoadError(false);
      setSelectedImage(selected.images?.[0] || "");
      const firstAvailableWeight = (selected.weights || []).find(
        (w) => checkVariantStock(w, 1, selected.stock ?? selected.totalStock, false).canFulfill
      ) || selected.weights?.[0] || "";
      setActiveWeight(firstAvailableWeight);
      setQuantity(1);

      const related = allProducts.filter(
        (p) => p.category === selected.category && p.id !== selected.id && p.category !== "Combo"
      );
      setRelatedProducts(related);
      return;
    }

    let active = true;
    setProduct(null);
    setRelatedProducts([]);
    setProductLoading(true);
    setProductLoadError(false);
    window.scrollTo(0, 0);

    api.get(`/products/${encodeURIComponent(id)}`, { timeout: 8000 })
      .then(({ data }) => {
        if (!active) return;
        const fetchedProduct = normalizeProduct(data);
        if (fetchedProduct.category === "Combo" || fetchedProduct.type === "combo") {
          navigate(`/combos/${fetchedProduct.id}`, { replace: true });
          return;
        }
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images?.[0] || "");
        setActiveWeight(fetchedProduct.weights?.[0] || "");
        setQuantity(1);
        setRelatedProducts(allProducts.filter(
          (item) => item.category === fetchedProduct.category &&
            String(item.id) !== String(fetchedProduct.id) &&
            item.category !== "Combo"
        ));
      })
      .catch((error) => {
        if (!active) return;
        if (error?.response?.status !== 404) {
          console.error("Product detail request failed:", error);
          setProductLoadError(true);
        }
      })
      .finally(() => {
        if (active) setProductLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, allProducts, loadingProducts, navigate, retryCount]);

  if (productLoading || (!product && loadingProducts)) {
    return <LodingPage />;
  }

  if (!product) {
    return (
      <div className="text-center mt-10 mb-16 font-semibold">
        <p className="text-red-600">{productLoadError ? "Unable to load this product right now." : "Product not found."}</p>
        {productLoadError && (
          <button
            type="button"
            className="mt-4 rounded bg-green1 px-4 py-2 text-white"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  const priceObj = product.prices?.[activeWeight];
  let price = 0;
  let mrp = 0;

  if (typeof priceObj === "object" && priceObj !== null) {
    price = Number(priceObj.offerPrice) || Number(priceObj.mrp) || 0;
    mrp = Number(priceObj.mrp) || price;
  } else if (typeof priceObj === "number") {
    // Fallback for old format
    price = Number(priceObj);
    mrp = Math.floor(price / 0.84);
  }

  // Ensure they are valid numbers
  if (isNaN(price)) price = 0;
  if (isNaN(mrp)) mrp = 0;


  const averageRating =
    typeof product.rating === "number" ? product.rating.toFixed(1) : "4.5";
  const stock = Number(product.stock ?? product.totalStock ?? 0);
  const isCombo = product.category === "Combo" || product.type === "combo";
  const isOutOfStock = isProductOutOfStock(product);
  const lowStock = isLowStock(product);
  const metaDescription = getMetaDescription(
    `Buy ${product.name} online from Kavi's Dry Fruits. ${product.shortDescription || product.description || "Carefully packed and delivered across Tamil Nadu and India."}`
  );

  // Calculate existing cart usage for this product across all variants in cart
  const cartUsage = getProductCartUsage(cartItems, product);
  const remainingStock = Math.max(0, stock - cartUsage);

  // Check whether current selected variant & quantity exceeds available stock (including what is in cart)
  const requiredGrams = isCombo ? quantity : parseWeightToGrams(activeWeight) * quantity;
  const isWeightExceedingStock = (requiredGrams + cartUsage) > stock;

  const increaseQty = () => {
    const nextQty = quantity + 1;
    const nextRequiredGrams = isCombo ? nextQty : parseWeightToGrams(activeWeight) * nextQty;
    if (nextRequiredGrams + cartUsage > stock) {
      if (cartUsage > 0) {
        return toast.error(
          `Cannot add more. Only ${formatStockDisplay(stock, isCombo)} available in stock (${formatStockDisplay(cartUsage, isCombo)} already in your cart).`
        );
      }
      return toast.error(`Cannot add more. Only ${formatStockDisplay(stock, isCombo)} available in stock.`);
    }
    setQuantity(nextQty);
  };
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (isOutOfStock) return toast.error("This product is out of stock.");
    if (isWeightExceedingStock) {
      if (cartUsage > 0) {
        return toast.error(
          `Only ${formatStockDisplay(stock, isCombo)} available in stock (${formatStockDisplay(cartUsage, isCombo)} already in your cart). Cannot add ${quantity > 1 ? `${quantity}x ` : ""}${activeWeight}.`
        );
      }
      return toast.error(
        `Only ${formatStockDisplay(stock, isCombo)} available in stock. Cannot add ${quantity > 1 ? `${quantity}x ` : ""}${activeWeight}.`
      );
    }
    const weight = activeWeight || 'Combo';
    addToCart({
      ...product,
      price: price,
      qty: quantity,
      image: product.images?.[0],
      selectedWeight: weight,
    });
  };

  const handleAddToFav = () => {
    addToFav({
      id: product.id,
      productId: product.productId,
      name: product.name,
      image: product.images?.[0],
      price,
    });
  };

  const handleReviewSubmit = async () => {
    if (!reviewInput.user || !reviewInput.comment) {
      toast.error("Please fill all review fields!");
      return;
    }

    const newReview = {
      user: reviewInput.user,
      comment: reviewInput.comment,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      await api.post(`/products/${product.id ?? product.productId ?? id}/review`, {
        userName: reviewInput.user,
        user: reviewInput.user,
        comment: reviewInput.comment,
        rating: 5,
      });

      toast.success("Review added successfully!");
      setProduct((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), newReview],
      }));
      setReviewInput({ user: "", comment: "" });
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review.");
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Buy Online | Kavi's Dry Fruits</title>
        <meta
          name="description"
          content={metaDescription}
        />
        <link
          rel="canonical"
          href={`https://kavisdryfruits.com/shop/${product.id}/`}
        />
        <meta property="og:title" content={`${product.name} | Kavi's Dry Fruits`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={(product.images?.[0] || "https://kavisdryfruits.com/Kavi_logo.png").replace(/^http:\/\/(?:www\.)?kavisdryfruits\.com\//i, "https://kavisdryfruits.com/")} />
        <meta property="og:url" content={`https://kavisdryfruits.com/shop/${product.id}/`} />
        <meta property="og:type" content="product" />
        {price > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              description: product.shortDescription || product.description || `Premium ${product.name} from Kavi's Dry Fruits.`,
              image: product.images?.filter(Boolean).map((image) => image.replace(/^http:\/\/(?:www\.)?kavisdryfruits\.com\//i, "https://kavisdryfruits.com/")),
              brand: { "@type": "Brand", name: "Kavi's Dry Fruits" },
              offers: {
                "@type": "Offer",
                url: `https://kavisdryfruits.com/shop/${product.id}/`,
                priceCurrency: "INR",
                price,
                availability: isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
                seller: { "@type": "Organization", name: "Kavi's Dry Fruits" },
              },
            })}
          </script>
        )}
      </Helmet>
      <PageHeader
        title="Product Details"
        subtitle="Shop"
        curpage={product.name}
      />

      <section className="bg-green4">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">
            Product <span className="text-primary">Details</span>
          </h2>
          <div className="w-[80%] sm:w-[40%] md:w-[17%] h-[2px] border-b-2 border-dashed border-green1 mx-auto"></div>
        </div>

        <div className="bg-white border-2 border-primary rounded-xl p-4 sm:p-6 mx-4 sm:mx-10 lg:mx-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-dashed border-primary rounded-lg">
            {/* Left image & thumbnails: with zoom */}
            <div className="flex flex-col items-center md:border-r-2 border-dashed border-primary md:rounded-xl p-4">
              <div className="relative w-full">
                {/* Main image (keeps object-contain so full image is visible) */}
                <OptimizedImage
                  src={selectedImage}
                  alt={`${product.name} - Kavi's Dry Fruits`}
                  className="w-full h-[26rem] sm:h-[32rem] rounded-lg bg-white cursor-zoom-in"
                  objectFit="contain"
                  loading="eager"
                  fetchPriority="high"
                  width={640}
                  height={640}
                  onMouseEnter={() => setZoomed(true)}
                  onMouseLeave={() => setZoomed(false)}
                  onMouseMove={handleMouseMove}
                  onTouchStart={() => setZoomed((z) => !z)}
                />

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 p-4 rounded-lg pointer-events-none">
                    <span className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl transform -rotate-6 border-2 border-white">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Zoom pane shown on large screens when zoomed === true */}
                {zoomed && (
                  <div
                    className="hidden md:block absolute top-2 left-full ml-6 w-[min(600px,calc(100vw-2rem))] h-[36rem] border rounded-lg overflow-hidden shadow-lg bg-white z-40"
                    style={{
                      backgroundImage: `url(${selectedImage})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${zoomLevel * 100}%`,
                      backgroundPosition: backgroundPosition,
                    }}
                    // also update position if user moves inside the pane itself
                    onMouseMove={handleMouseMove}
                  />
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2 mt-10 w-1/">
                {product.images?.map((img, idx) => (
                  <div key={idx} className="w-16 h-16 border rounded-lg overflow-hidden">
                    <OptimizedImage
                      src={img}
                      alt={`Thumbnail ${idx + 1} of ${product.name} - Kavi's Dry Fruits`}
                      className={`w-16 h-16 cursor-pointer ${selectedImage === img
                        ? "ring-2 ring-green-600"
                        : ""
                        }`}
                      objectFit="cover"
                      loading="lazy"
                      onClick={() => setSelectedImage(img)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right product info */}
            <div className="p-2 sm:p-4">
              <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">
                {product.name} – {activeWeight}
              </h2>
              <div className="flex items-center gap-2 text-primary mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(product.rating || 0)
                        ? "text-primary"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-gray-700 text-sm">
                  ({averageRating}/5) - {product.reviews?.length || 0} Reviews
                </span>
              </div>
              <p className="text-lg font-semibold">
                Price:{" "}
                <span className="line-through text-gray-400">₹{mrp}</span>{" "}
                <span className="text-primary text-lg md:text-xl font-bold">
                  ₹{price}
                </span>
                <span className="text-xs md:text-sm text-gray-500">
                  {" "}
                  (You save ₹{mrp - price})
                </span>
              </p>

              {/* Low Stock Indicator */}
              {lowStock && !isOutOfStock && (
                <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Low Stock: Only <span className="text-amber-800 underline font-black">{formatStockDisplay(stock, isCombo)}</span> available in stock!</span>
                </div>
              )}

              {/* Insufficient Stock Warning if selected weight/qty exceeds stock */}
              {isWeightExceedingStock && !isOutOfStock && (
                <div className="mt-3 p-3.5 bg-rose-50 border-2 border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-bold animate-in fade-in duration-300">
                  <div className="flex items-start gap-2">
                    <span className="text-base">⚠️</span>
                    <div>
                      <p className="font-black text-rose-900 uppercase tracking-wide text-xs">Insufficient Stock for Selection</p>
                      <p className="mt-0.5 font-medium">
                        Only <span className="font-bold underline">{formatStockDisplay(stock, isCombo)}</span> available in stock{cartUsage > 0 ? ` (${formatStockDisplay(cartUsage, isCombo)} already in your cart)` : ""}. Your selected size ({quantity > 1 ? `${quantity}x ` : ""}{activeWeight}) exceeds the available stock.
                      </p>
                      <p className="text-[11px] text-rose-600 mt-1">Please select an available package size or decrease quantity to proceed.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <select
                  value={activeWeight}
                  onChange={(e) => setActiveWeight(e.target.value)}
                  className="px-4 py-2 border rounded-lg text-white font-semibold bg-primary cursor-pointer max-w-full"
                >
                  {product.weights?.map((w) => {
                    const wGrams = parseWeightToGrams(w);
                    const cannotFulfill = (wGrams + cartUsage) > stock;
                    return (
                      <option key={w} value={w}>
                        {w} {cannotFulfill ? ` (Exceeds stock: ${formatStockDisplay(remainingStock, isCombo)} remaining)` : ""}
                      </option>
                    );
                  })}
                </select>
                <div className="bg-primary text-white flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={decreaseQty}
                    className="px-3 py-2 font-bold cursor-pointer"
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4 font-semibold">
                    {String(quantity).padStart(2, "0")}
                  </span>
                  <button
                    onClick={increaseQty}
                    className="px-3 py-2 font-bold cursor-pointer"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
                <button
                  onClick={handleAddToCart}
                  className="bg-primary hover:bg-green-700 cursor-pointer text-white px-6 py-2 rounded-lg font-semibold transition shadow-sm"
                >
                  {isOutOfStock ? "Out of Stock" : isWeightExceedingStock ? `Insufficient Stock (${formatStockDisplay(remainingStock, isCombo)} left)` : "Add to Cart"}
                </button>
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      if (isOutOfStock) {
                        return toast.error("This product is out of stock.");
                      }
                      if (isWeightExceedingStock) {
                        if (cartUsage > 0) {
                          return toast.error(
                            `Only ${formatStockDisplay(stock, isCombo)} available in stock (${formatStockDisplay(cartUsage, isCombo)} already in your cart).`
                          );
                        }
                        return toast.error(`Only ${formatStockDisplay(stock, isCombo)} available in stock.`);
                      }
                      navigate("/checkout", {
                        state: {
                          checkoutProduct: {
                            ...product,
                            quantity,
                            selectedWeight: activeWeight,
                            price,
                            img: product.images?.[0],
                          },
                        },
                      });
                    }}
                    className="border border-green-600 text-primary cursor-pointer hover:bg-green-50 px-6 py-2 rounded-lg font-semibold w-full transition"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToFav}
                    className="border border-green1 text-primary p-3 rounded-full cursor-pointer"
                  >
                    <FaHeart size={25} />
                  </button>
                </div>
              </div>

              <div className="border-t-2 border-b-2 border-dashed border-green1 mt-6 py-4 text-sm font-semibold text-gray-700">
                <p>Free Shipping on orders above ₹399</p>
                <p className="mt-1">100% Premium Quality ~ No Preservatives</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center text-sm text-green-700">
                {[
                  {
                    img: "/images/New folder/New folder/healthy-heart.png",
                    text: "Healthy Heart",
                  },
                  {
                    img: "/images/New folder/New folder/vitamins.png",
                    text: "High Nutrition",
                  },
                  {
                    img: "/images/New folder/New folder/gluten-free.png",
                    text: "Gluten Free",
                  },
                  {
                    img: "/images/New folder/New folder/sugar-free.png",
                    text: "Cholesterol Free",
                  },
                ].map((item, idx) => (
                  <div key={idx}>
                    <img
                      src={item.img}
                      alt={item.text}
                      className="mx-auto w-16 h-16 border border-dashed border-green1 rounded-full p-3"
                    />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border border-dashed border-green1 rounded-xl p-4 mt-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Product Description</h3>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <ul className="text-gray-700 list-disc pl-5 space-y-1">
                <li>
                  <strong>Weight:</strong> {product.weights?.[0] || "N/A"}
                </li>
                <li>
                  <strong>Packaging:</strong> Airtight Resealable pouch
                </li>
                <li>
                  <strong>Shelf Life:</strong> 6 months
                </li>
                <li>
                  <strong>Ideal for:</strong> Snacking, Cooking, Gifting
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Health Benefits</h3>
              <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                {product.health_benefits?.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="w-full px-4 sm:px-10 md:px-0 mt-10 flex justify-center">
          <div className="w-full max-w-2xl bg-white shadow-lg border border-green-200 rounded-lg p-6">
            <h3 className="font-bold text-2xl mb-4 text-green-700 flex items-center gap-2">
              <FaStar className="text-yellow-500" /> Share Your Review
            </h3>
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={reviewInput.user}
                  onChange={(e) =>
                    setReviewInput({ ...reviewInput, user: e.target.value })
                  }
                  className="w-full p-3 border border-green-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Write your honest feedback here..."
                  value={reviewInput.comment}
                  onChange={(e) =>
                    setReviewInput({ ...reviewInput, comment: e.target.value })
                  }
                  className="w-full p-3 border border-green-400 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleReviewSubmit}
                  className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold shadow-md transition duration-200"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>

        <Testimonials reviews={product.reviews || []} />
        {relatedProducts.length > 0 && (
          <RelatedProducts relatedProducts={relatedProducts} />
        )}
      </section>
    </>
  );
};

export default SingleProductView;
