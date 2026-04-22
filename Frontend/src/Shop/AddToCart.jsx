// AddToCart.jsx
import PageHeader from "../Component/PageHeader";
import { useStore } from "../Context/StoreContext";
import bgImage from "/images/empty-cart.png";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";

// --------------------------------------------
// MEMOIZED CART ROW (ONLY re-renders when item changes)
// --------------------------------------------
const CartRow = React.memo(
  ({
    item,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    updatingWeightId,
  }) => {
    const imgSource = Array.isArray(item.image)
      ? item.image[0]
      : item.image || "";

    const subtotal =
      parseFloat(item?.price || 0) * parseInt(item?.quantity || 1);

    // disable select when this item is being updated
    const isUpdating = updatingWeightId === item.id;

    return (
      <tr key={item.id} className="border-b bg-green4">
        <td className="p-4 flex items-center gap-4 max-w-[300px]">
          <img
            src={imgSource}
            alt={`${item.name} - Kavi's Dry Fruits`}
            className="w-14 h-14 object-cover border border-green-400 rounded-md"
          />
          <div className="truncate">
            <p className="font-bold truncate">{item.name}</p>
          </div>
        </td>

        {/* WEIGHT: Selectable for single products */}
        <td className="p-4 text-sm font-medium">
          {item.category === "Combo" ? (
            <span className="font-semibold italic text-primary text-lg">
              COMBO
            </span>
          ) : (
            <select
              disabled={isUpdating}
              value={item.selectedWeight}
              onChange={(e) => handleWeightChange(item, e.target.value)}
              className={`px-2 py-1 rounded border bg-white focus:ring-1 focus:ring-green-500 cursor-pointer ${
                isUpdating ? "opacity-50 grayscale" : ""
              }`}
            >
              {item.weights && item.weights.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          )}
        </td>

        <td className="p-4 font-semibold whitespace-nowrap">
          ₹{Number(item?.price || 0).toFixed(2)}
        </td>

        <td className="p-4">
          <div className="flex border rounded overflow-hidden w-max">
            <button
              onClick={() => decreaseQuantity(item)}
              className="px-3 py-1 text-lg hover:bg-green-200 cursor-pointer"
            >
              –
            </button>
            <span className="px-4 py-1 border-l border-r font-medium select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => increaseQuantity(item)}
              className="px-3 py-1 text-lg hover:bg-green-200 cursor-pointer"
            >
              +
            </button>
          </div>
        </td>

        <td className="p-4 font-semibold whitespace-nowrap">
          ₹{subtotal.toFixed(2)}
        </td>

        <td className="p-4 text-center font-semibold">
          <button
            onClick={() => removeItem(item.docId)}
            className="text-red-600 hover:text-red-800 text-xl cursor-pointer"
          >
            ×
          </button>
        </td>
      </tr>
    );
  },

  // Custom compare — only re-render when the item content changes
  (prev, next) => JSON.stringify(prev.item) === JSON.stringify(next.item)
);

// --------------------------------------------
// MAIN COMPONENT
// --------------------------------------------
const AddToCart = () => {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    updateWeight,
  } = useStore();

  const navigate = useNavigate();

  // local state to prevent double updates while transaction runs
  const [updatingWeightId, setUpdatingWeightId] = useState(null);

  // Robust price extractor: handles the prices object structure
  const extractPriceFromPrices = (pricesObj, weightKey) => {
    if (!pricesObj || typeof pricesObj !== "object") {
      console.error("Invalid pricesObj:", pricesObj);
      return NaN;
    }

    // Direct lookup with the weight key
    let price = pricesObj[weightKey];

    // If not found, try common variations
    if (price === undefined) {
      const keys = Object.keys(pricesObj);
      // Try to find by matching the weight string
      const matchedKey = keys.find(
        (k) => String(k).toLowerCase() === String(weightKey).toLowerCase().trim()
      );
      if (matchedKey) {
        price = pricesObj[matchedKey];
      }
    }

    // Convert to number
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      const cleaned = price.replace(/[^0-9.]+/g, "");
      const num = parseFloat(cleaned);
      return isNaN(num) ? NaN : num;
    }

    console.error("Price not found:", { weightKey, availableKeys: Object.keys(pricesObj) });
    return NaN;
  };

  // handle weight change
  const handleWeightChange = useCallback(
    async (item, newWeight) => {
      try {
        if (!item || !item.id) {
          toast.error("Invalid item");
          return;
        }

        if (!newWeight) {
          toast.error("Please select a weight");
          return;
        }

        // prevent double updates
        if (updatingWeightId === item.id) return;

        const newPrice = extractPriceFromPrices(item.prices, newWeight);

        if (isNaN(newPrice)) {
          console.error("Failed to extract price", { item, newWeight, prices: item.prices });
          toast.error("Price not available for this weight");
          return;
        }

        setUpdatingWeightId(item.id);

        // call provider's updateWeight with cartItemId, new weight, and new price
        await updateWeight(item.id, newWeight, Number(newPrice));
      } catch (err) {
        console.error("handleWeightChange error:", err);
        toast.error("Failed to change weight");
      } finally {
        setUpdatingWeightId(null);
      }
    },
    [updateWeight, updatingWeightId]
  );

  const incQty = useCallback((item) => increaseQuantity(item), [increaseQuantity]);

  const decQty = useCallback((item) => decreaseQuantity(item), [decreaseQuantity]);

  const remove = useCallback((id) => removeItem(id), [removeItem]);

  // Memoized totals → prevents re-renders
  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + parseFloat(item?.price || 0) * parseInt(item?.quantity || 1),
      0
    );
  }, [cartItems]);

  // Minimum purchase config
  const MIN_PURCHASE = 400;
  const isMinimumMet = cartTotal >= MIN_PURCHASE;
  const remaining = Math.max(0, MIN_PURCHASE - cartTotal);

  // Guarded proceed handler
  const handleProceed = useCallback(() => {
    if (!isMinimumMet) {
      toast.error(
        `Minimum purchase is ₹${MIN_PURCHASE}. Add ₹${remaining.toFixed(
          2
        )} more to proceed.`
      );
      return;
    }
    navigate("/checkout");
  }, [isMinimumMet, remaining, navigate]);

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

      <PageHeader title="Shopping Cart" subtitle="shop" curpage="Cart Page" />

      <div className="bg-green4 min-h-[70vh] p-4 md:p-10 max-w-7xl mx-auto space-y-8">
        {cartItems.length === 0 ? (
          <div
            className="text-center text-gray-600 text-xl flex flex-col items-center justify-center"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "30%",
              minHeight: "60vh",
            }}
          >
            <p>Your cart is currently empty.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_320px] gap-6">
            {/* Cart Table */}
            <div className="overflow-x-auto rounded-xl bg-white shadow">
              <table className="w-full min-w-[700px] text-left border-collapse">
                <thead className="bg-yellow-400 text-black text-sm md:text-base">
                  <tr>
                    <th className="p-4 font-bold rounded-tl-lg">Product</th>
                    {/* <-- Add Weight header back */}
                    <th className="p-4 font-bold">Weight</th>
                    <th className="p-4 font-bold">Price</th>
                    <th className="p-4 font-bold">Quantity</th>
                    <th className="p-4 font-bold">Subtotal</th>
                    <th className="p-4 font-bold rounded-tr-lg">Remove</th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item) => (
                    <CartRow
                      key={item.docId}
                      item={item}
                      increaseQuantity={incQty}
                      decreaseQuantity={decQty}
                      removeItem={remove}
                      updatingWeightId={updatingWeightId}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-green-300 rounded-xl p-6 h-fit shadow">
              <h2 className="text-xl font-bold mb-4 text-green-700">
                Order Summary
              </h2>

              <div className="flex justify-between mb-2 text-sm">
                <span>Items</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="flex justify-between mb-2 text-sm">
                <span>Quantity</span>
                <span>
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between mb-2 text-sm">
                <span>Sub Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <hr className="my-2 border-dashed border-green-500" />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleProceed}
                disabled={!isMinimumMet}
                className={
                  "mt-6 w-full px-4 py-2 rounded transition " +
                  (isMinimumMet
                    ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed")
                }
              >
                Proceed to Checkout
              </button>

              {/* Minimum purchase notice */}
              {!isMinimumMet && (
                <p className="mt-2 text-sm text-red-600">
                  Minimum order value is ₹{MIN_PURCHASE}. Add ₹
                  {remaining.toFixed(2)} more to enable checkout.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddToCart;
