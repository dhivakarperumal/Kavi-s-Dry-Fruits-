import ProductCard from "../Component/ProductCard";
import { Link } from "react-router-dom";
import { useStore } from "../Context/StoreContext";
import { Helmet } from "react-helmet";

const PopularProduct = () => {
  const { allProducts, addToCart, addToFav, favItems } = useStore();

  const popularProducts = allProducts
    .filter((item) => item.category !== "Combo");

  return (
    <div className="bg-green4 py-12 px-4">
      {/* ... Helmet content ... */}
      <Helmet>
        <title>Shop Premium Dry Fruits, Nuts, Dates & Seeds | Kavi’s Dry Fruits Tirupattur</title>
        <meta name="description" content="Buy premium dry fruits, nuts, seeds, raisins, dates and combo packs at best prices. Fresh quality delivered across Tamil Nadu and India. Contact +91 94895 93504. Tirupattur 635653." />
        <meta name="keywords" content="dry fruits shop, buy dry fruits online, almonds online, cashews online, pistachios online, dates online, raisins online, premium dry fruits store, fresh dry fruits Tirupattur, Tirupattur dry fruits, dry fruits 635653, dry fruits Tamil Nadu, dry fruits Chennai, dry fruits Coimbatore, dry fruits Madurai, dry fruits Vellore, dry fruits Salem, dry fruits Krishnagiri, dry fruits Dharmapuri, dry fruits Erode, dry fruits Tirunelveli, dry fruits Kanyakumari, dry fruits Tiruvannamalai, dry fruits Namakkal, dry fruits Trichy, dry fruits Thanjavur, dry fruits Cuddalore, dry fruits Dindigul, dry fruits Kanchipuram, buy nuts online India, premium nuts store, healthy snacks online, organic dry fruits, big size cashews W180, premium almonds, roasted pistachios, family pack dry fruits, dry fruits combo pack, Tamil Nadu pincode delivery, dry fruits shop phone number +91 94895 93504" />
        <link rel="canonical" href="https://kavisdryfruits.com/shop" />
        <meta property="og:title" content="Shop Premium Dry Fruits & Nuts – Kavi’s Dry Fruits Tirupattur" />
        <meta property="og:description" content="Premium almonds, cashews, pista, dates & seeds delivered across Tamil Nadu & India. Contact +91 94895 93504." />
        <meta property="og:url" content="https://kavisdryfruits.com/shop" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="text-center md:text-left w-full md:w-auto">
            <h2 className="text-2xl font-bold">
              Top Selling <span className="text-green-600">Products</span>
            </h2>
            <div className="h-[2px] w-40 border-b-2 border-dashed border-green1 mx-auto md:mx-0 mt-2" />
          </div>
          <div>
            <Link to="/shop">
              <button className="bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-green1 transition cursor-pointer">
                View More
              </button>
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              activeWeight={product.weights?.[0]}
              addToCart={addToCart}
              addToFav={addToFav}
              favItems={favItems}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularProduct;
