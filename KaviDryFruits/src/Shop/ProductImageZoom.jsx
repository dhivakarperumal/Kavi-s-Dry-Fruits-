import { useState } from "react";

const ProductImageZoom = ({ image }) => {
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex gap-6">
      {/* Main Image */}
      <div
        className="relative w-full md:w-1/2 h-72 sm:h-96 border border-dashed border-primary rounded-lg overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
      >
        <img
          src={image}
          alt="Product Image - Kavi's Dry Fruits"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Zoom Box */}
      <div
        className={`hidden md:block w-1/2 h-72 sm:h-96 border border-dashed border-green-600 rounded-lg overflow-hidden`}
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "200%", // zoom factor
          backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
        }}
      ></div>
    </div>
  );
};

export default ProductImageZoom;
