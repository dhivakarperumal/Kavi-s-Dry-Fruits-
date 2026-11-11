import ProductCard from "../Component/ProductCard";
import { Link } from "react-router-dom";
import { useStore } from "../Context/StoreContext";

const PopularProduct = () => {
  const { allProducts, addToCart, addToFav, favItems } = useStore();

  const popularProducts = allProducts
    .filter((item) => item.category !== "Combo");

  return (
    <div className="bg-green4 py-12 px-4">
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
          {popularProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              activeWeight={product.weights?.[0]}
              addToCart={addToCart}
              addToFav={addToFav}
              favItems={favItems}
              priority={index < 2}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularProduct;
