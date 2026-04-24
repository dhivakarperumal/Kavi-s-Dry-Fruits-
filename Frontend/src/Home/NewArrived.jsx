import ProductCard from "../Component/ProductCard";

const NewArrived = () => {
  const { allProducts, addToCart, addToFav, favItems } = useStore();

  const totalProduct = allProducts
    .filter((item) => item.category !== "Combo")
    .slice(0, 4); // Latest 4 products

  return (
    <div className="bg-white py-10 px-5">
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

      <div className="max-w-6xl mx-auto mb-15 relative h-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            New <span className="text-green-600">Arrivals</span>
          </h2>
          <div className="md:w-[17%] w-[80%] h-[2px] border-b-2 border-dashed border-green1 mx-auto"></div>
        </div>
        <div className="absolute md:-top-2 md:right-0 top-14 right-[27%]">
          <Link to="/shop">
            <button className="bg-primary text-white font-semibold px-6 py-2 rounded-md hover:bg-green1 transition cursor-pointer">
              View More
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto items-center">
        {totalProduct.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            activeWeight={product.weights?.[0] || "100g"}
            addToCart={addToCart}
            addToFav={addToFav}
            favItems={favItems}
          />
        ))}
      </div>
    </div>
  );
};

export default NewArrived;
