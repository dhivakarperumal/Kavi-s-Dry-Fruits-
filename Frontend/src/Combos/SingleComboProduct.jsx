import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaPlus, FaMinus, FaHeart } from "react-icons/fa";
import { useStore } from "../Context/StoreContext";
import PageHeader from "../Component/PageHeader";
import Testimonials from "../Shop/Testimonials";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import LodingPage from "../Component/LoadingPage";
import api from "../services/api";

const SingleComboProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts, addToCart, addToFav, loadingProducts } = useStore();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewInput, setReviewInput] = useState({ user: "", comment: "" });

  // Zoom state (add near other useState calls)
const [zoomed, setZoomed] = useState(false);
const [backgroundPosition, setBackgroundPosition] = useState("50% 50%");
const zoomLevel = 2.5; // adjust magnification (1.5 - 3 recommended)

// call on mouse move / on mouse enter / on mouse leave
const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  setBackgroundPosition(`${x}% ${y}%`);
};


  useEffect(() => {
    if (!id || !allProducts.length) return;

    // FIX: Must filter by combo type FIRST to avoid ID collision with regular products
    // (both MySQL tables start from id=1, so product id=1 and combo id=1 both exist)
    const selectedProduct = allProducts.find(
      (p) =>
        (p.type === "combo" || p.category === "Combo") &&
        (String(p.id) === String(id) || p.productId === id)
    );

    if (selectedProduct) {
      setProduct(selectedProduct);
      setSelectedImage(selectedProduct.images?.[0] || "");
      setQuantity(1);
      window.scrollTo(0, 0);
    } else {
      setProduct(null);
    }
  }, [id, allProducts]);

  if (loadingProducts) {
    return <LodingPage />;
  }

  if (!product) {
    return <div className="text-center mt-10 text-red-600 font-semibold">Product not found</div>;
  }

  // --- Pricing Logic (robust fallback for MySQL combos) ---
  // comboDetails stores {mrp, offerPrice, totalWeight} but may be empty
  const mrp = Number(product.mrp) || Number(product.comboDetails?.mrp) || Number(product.price) || 0;
  const offerPrice = Number(product.offerPrice) || Number(product.comboDetails?.offerPrice) || Number(product.price) || mrp;
  const averageRating = product.rating ? Number(product.rating).toFixed(1) : "4.5";
  const isOutOfStock = (product.stock ?? product.totalStock ?? 1) <= 0;

  // --- Quantity Handlers ---
  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // --- Cart & Favorite Handlers ---
  const handleAddToCart = () => {
    if (isOutOfStock) return toast.error("This product is out of stock.");
    const weight = product.weights?.[0] || 'Combo';
    addToCart({
      ...product,
      price: offerPrice,
      qty: quantity,
      image: product.images?.[0],
      selectedWeight: weight,
    });
  };

  const handleAddToFav = () => {
    addToFav({
      id: product.id,
      name: product.name,
      image: product.images?.[0],
      price: offerPrice,
    });
    
  };

  // --- Review Submission (MySQL API, no Firebase) ---
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
      // Use MySQL API endpoint for combo reviews
      await api.post(`/combos/${product.id}/review`, newReview);
      toast.success("Review added successfully!");
      setProduct((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), newReview],
      }));
      setReviewInput({ user: "", comment: "" });
    } catch (error) {
      console.error("Error adding review:", error);
      // Still update local state even if API fails
      setProduct((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), newReview],
      }));
      setReviewInput({ user: "", comment: "" });
      toast.success("Review saved locally!");
    }
  };

  return (
    <>
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

      <PageHeader title="Product Details" subtitle="Combos" curpage={product.name} />

      <section className="bg-green4 pb-10">
        {/* Section Title */}
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">
            Product <span className="text-primary">Details</span>
          </h2>
          <div className="w-[80%] sm:w-[40%] md:w-[17%] h-[2px] border-b-2 border-dashed border-green1 mx-auto"></div>
        </div>

        {/* Product Info */}
        <div className="bg-white border-2 border-primary rounded-xl p-4 sm:p-6 mx-4 sm:mx-10 lg:mx-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:border-2 md:border-dashed md:border-primary rounded-lg">

            {/* Images (with hover/tap zoom) */}
<div className="flex flex-col items-center border-dashed border-primary md:rounded-xl p-4">
  <div className="relative w-full">
    <img
      src={selectedImage}
      alt={product.name}
      className="w-full h-72 mt-1 md:mt-5 sm:h-96 object-contain rounded-lg cursor-zoom-in"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setZoomed((z) => !z)} // toggle on mobile tap
    />

    {/* Zoom pane (desktop only) */}
    {zoomed && (
      <div
        className="hidden md:block absolute top-0 left-full ml-4 w-[420px] h-72 sm:h-96 border rounded-lg overflow-hidden shadow-lg bg-white z-50"
        style={{
          backgroundImage: `url(${selectedImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${zoomLevel * 100}%`,
          backgroundPosition: backgroundPosition,
        }}
        onMouseMove={handleMouseMove}
      />
    )}
  </div>

  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-6 mt-1 md:mt-5 px-4">
    {product.images?.map((img, idx) => (
      <img
        key={idx}
        src={img}
        onClick={() => setSelectedImage(img)}
        className={`w-16 h-16 object-cover border rounded-lg cursor-pointer ${
          selectedImage === img ? "border-green-600" : "border-2 border-green-200"
        }`}
        alt={`thumb-${idx}`}
      />
    ))}
  </div>
</div>


            {/* Details */}
            <div className="p-2 sm:p-4">
              <h2 className="text-xl sm:text-2xl font-bold text-black">{product.name}</h2>

              <div className="flex items-center gap-2 mt-2 text-primary">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(product.rating)
                        ? "text-primary"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-gray-700 text-sm">
                  ({averageRating}/5) - {product.reviews?.length || 0} Reviews
                </span>
              </div>

              {product.combos?.length > 0 && (
                <div className="mt-3">
                  <p className="font-bold text-green-800">Combo Includes:</p>
                  <ul className="list-disc list-inside text-gray-700 mt-1">
                    {product.combos.map((item, idx) => (
                      <li key={idx}>
                        {typeof item === 'object' ? `${item.name} (${item.weight || 'N/A'})` : item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price */}
              <p className="text-lg font-semibold mt-4">
                Price:{" "}
                <span className="line-through text-gray-400">₹{mrp}</span>{" "}
                <span className="text-primary text-lg md:text-xl font-bold">
                  ₹{offerPrice}
                </span>{" "}
                <span className="text-xs md:text-sm text-gray-500">
                  (You save ₹{mrp - offerPrice})
                </span>
              </p>

              {isOutOfStock && (
                <p className="mt-2 text-red-600 font-semibold">Out of Stock</p>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <div className="bg-primary text-white flex items-center border rounded-md overflow-hidden">
                  <button onClick={decreaseQty} className="px-3 py-2 font-bold">
                    <FaMinus />
                  </button>
                  <span className="px-4 font-semibold">
                    {String(quantity).padStart(2, "0")}
                  </span>
                  <button onClick={increaseQty} className="px-3 py-2 font-bold">
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={handleAddToCart}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    isOutOfStock
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-primary text-white hover:bg-green-700 cursor-pointer"
                  }`}
                  disabled={isOutOfStock}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => {
                    const checkoutProduct = {
                      ...product,
                      quantity,
                      price: offerPrice,
                      img: product.images[0],
                    };
                    navigate("/checkout", { state: { checkoutProduct } });
                  }}
                  className={`border px-6 py-2 rounded-lg font-semibold ${
                    isOutOfStock
                      ? "border-gray-400 text-gray-400 cursor-not-allowed"
                      : "border-green-600 text-primary hover:bg-green-50 cursor-pointer"
                  }`}
                  disabled={isOutOfStock}
                >
                  Buy Now
                </button>

                <button
                  onClick={handleAddToFav}
                  className="border border-green1 text-primary p-3 rounded-full cursor-pointer"
                >
                  <FaHeart />
                </button>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 pt-3 gap-4 mt-6 text-center text-sm text-green-700 border-t-2 border-dashed border-green1">
                {[
                  { img: "/images/New folder/New folder/healthy-heart.png", text: "Healthy Heart" },
                  { img: "/images/New folder/New folder/vitamins.png", text: "High Nutrition" },
                  { img: "/images/New folder/New folder/gluten-free.png", text: "Gluten Free" },
                  { img: "/images/New folder/New folder/sugar-free.png", text: "Cholesterol Free" },
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

          {/* Description & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-2 border-dashed border-green1 p-4 rounded-lg">
            <div>
              <h3 className="font-bold text-lg mb-2">Product Description</h3>
              <p className="text-gray-700 mb-4">{product.description}</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Health Benefits</h3>
              <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                {product.health_benefits?.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
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
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleReviewSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold shadow-md transition duration-200"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Display */}
        <Testimonials reviews={product.reviews || []} />
      </section>
    </>
  );
};

export default SingleComboProduct;
