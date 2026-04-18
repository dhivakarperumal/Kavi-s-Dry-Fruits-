import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import JsBarcode from "jsbarcode";
import { FaPlus, FaTrash, FaPrint, FaBarcode } from "react-icons/fa6";

const Stickers = () => {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [barcodeImg, setBarcodeImg] = useState("");

  const [productInput, setProductInput] = useState({
    productId: "",
    productName: "",
    price: "",
    barcode: "",
    packingDate: "",
    printQty: 1,
  });

  const [selectedProducts, setSelectedProducts] = useState({});

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/stickers/products");
        setProductsList(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  // Update barcode image
  useEffect(() => {
    if (!productInput.barcode) {
      setBarcodeImg("");
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, productInput.barcode, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 14,
      });
      setBarcodeImg(canvas.toDataURL("image/png"));
    } catch (error) {
      console.error("Barcode generation error:", error);
    }
  }, [productInput.barcode]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInput((prev) => ({ ...prev, [name]: value }));
  };

  // Select product from dropdown
  const handleSelectProduct = (e) => {
    const index = e.target.value;
    if (index === "") return;
    
    const selected = productsList[index];
    if (selected) {
      setProductInput({
        productId: selected.productId,
        productName: selected.name,
        price: "",
        barcode: selected.barcode || selected.barcodeValue || selected.productId,
        packingDate: "",
        printQty: 1,
      });
    }
  };

  // Add product to selection
  const handleAddProduct = () => {
    const { productId, productName, price, barcode, packingDate, printQty } = productInput;
    
    if (!productName || !price || !barcode || !packingDate || !printQty) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Generate barcode image forcefully with dimensions
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, barcode, { 
        format: "CODE128", 
        width: 3, // slightly wider for better scanning
        height: 80, 
        displayValue: false 
      });
      const barcodeImgData = canvas.toDataURL("image/png");

      const key = `${productId || 'MANUAL'}-${Date.now()}`;
      setSelectedProducts((prev) => ({
        ...prev,
        [key]: { 
          productId: productId || "MANUAL", 
          productName, 
          price, 
          barcode,
          barcodeImg: barcodeImgData, 
          packingDate, 
          printQty: Number(printQty) 
        },
      }));

      setProductInput({
        productId: "",
        productName: "",
        price: "",
        barcode: "",
        packingDate: "",
        printQty: 1,
      });
      toast.success("Added to print list");
    } catch (err) {
      console.error("Barcode Generation Error:", err);
      toast.error("Invalid barcode data");
    }
  };

  // Remove product from selection
  const handleRemoveProduct = (key) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    toast.success("Removed from list");
  };

  // Print stickers
  const handlePrint = () => {
    const productsToPrint = Object.values(selectedProducts);
    if (productsToPrint.length === 0) {
      toast.error("Please add at least one product to print");
      return;
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    setLoading(true);
    
    // Create iframe for print
    const iframe = document.createElement("iframe");
    iframe.id = "print-iframe";
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Print Stickers</title>
          <style>
            @page { size: auto; margin: 0mm; }
            body { font-family: 'Segoe UI', Arial; margin: 0; padding: 2mm; background: white; }
            .sticker-grid {
              display: grid;
              grid-template-columns: repeat(10, 1fr);
              gap: 15px;
            }
            .sticker-card {
              width: 80px;
              text-align: center;
              padding: 2px;
              border: 0.1px solid transparent;
            }
            .barcode-img {
              width: 100%;
              height: 45px;
              object-fit: contain;
              image-rendering: pixelated;
            }
            .price-tag {
              font-weight: 800;
              font-size: 11px;
              margin-top: 2px;
              color: black;
            }
            .date-tag {
              font-size: 8px;
              color: #444;
              margin-top: 1px;
            }
          </style>
        </head>
        <body>
          <div class="sticker-grid">
    `);

    productsToPrint.forEach((product) => {
      for (let i = 0; i < product.printQty; i++) {
        doc.write(`
          <div class="sticker-card">
            <div style="font-size: 7px; color: #555; font-weight: bold; margin-bottom: 2px;">${product.productId}</div>
            <img src="${product.barcodeImg}" class="barcode-img" onload="this.setAttribute('loaded', 'true')"/>
            <div class="price-tag">₹${product.price}</div>
            <div class="date-tag">${formatDate(product.packingDate)}</div>
          </div>
        `);
      }
    });

    doc.write(`
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Strategy: Wait for images to load before firing print
    const waitForImages = () => {
      const imgs = doc.querySelectorAll('img');
      const allLoaded = Array.from(imgs).every(img => img.getAttribute('loaded') === 'true');
      
      if (allLoaded) {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          setLoading(false);
          setSelectedProducts({});
          toast.success("Printing sequence triggered");
          setTimeout(() => document.body.removeChild(iframe), 2000);
        }, 500); // safety pad
      } else {
        setTimeout(waitForImages, 100);
      }
    };

    waitForImages();
  };

  return (
    <div className="w-full p-3 md:p-6 min-h-screen bg-transparent animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-5 bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/60 shadow-xl shadow-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100 bg-gradient-to-tr from-green-600 to-green-500`}>
              <FaBarcode size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                Sticker Printing <span className="text-gray-400 font-medium tracking-normal text-xl">Studio</span>
              </h1>
              <p className="text-xs font-black text-green-600 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-green-500 rounded-full"></span>
                Barcode Label Management
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100 ring-1 ring-green-50 mb-6">
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-500 p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Sticker Configuration</h2>
                <p className="opacity-90 font-medium mt-0.5 text-green-50 uppercase tracking-[0.2em] text-[10px]">
                  Setup Your Labels
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Product Selection */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block flex items-center gap-2">
                  <FaBarcode size={14} className="text-green-500" /> Auto-Fill (Optional)
                </label>
                <select
                  value={""}
                  onChange={handleSelectProduct}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
                >
                  <option value="">-- Choose Existing Product or Combo --</option>
                  {productsList.map((p, index) => (
                    <option key={`${p.productType}-${p.id}-${index}`} value={index}>
                      [{p.productType}] {p.productId} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
                  Product/Combo Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={productInput.productName}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
                />
              </div>

              {/* Product ID */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
                  Identifier/SKU
                </label>
                <input
                  type="text"
                  name="productId"
                  value={productInput.productId}
                  onChange={handleChange}
                  placeholder="Optional SKU/ID"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
                  MRP (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={productInput.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
                  min="0"
                />
              </div>

              {/* Barcode */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
                  Barcode Code *
                </label>
                <input
                  type="text"
                  name="barcode"
                  value={productInput.barcode}
                  onChange={handleChange}
                  placeholder="Enter barcode string"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
                />
              </div>

              {/* Packing Date */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
                  Label Date *
                </label>
                <input
                  type="date"
                  name="packingDate"
                  value={productInput.packingDate}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
                />
              </div>

              {/* Print Quantity */}
              <div className="md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block text-center">
                  Stickers Count *
                </label>
                <div className="flex justify-center">
                   <input
                    type="number"
                    name="printQty"
                    value={productInput.printQty}
                    onChange={handleChange}
                    min="1"
                    className="w-32 bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-black text-center text-xl text-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Barcode Preview */}
            {barcodeImg && (
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-3 text-center">Live Barcode Preview</p>
                <div className="flex justify-center">
                  <img src={barcodeImg} alt="Barcode" className="h-20" />
                </div>
              </div>
            )}

            {/* Add Product Button */}
            <button
              onClick={handleAddProduct}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaPlus size={14} /> Add to Print Queue
            </button>
          </div>
        </div>

        {/* Selected Products Table */}
        {Object.keys(selectedProducts).length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100 ring-1 ring-green-50 mb-6 animate-in slide-in-from-top-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                  <tr>
                    <th className="px-6 py-5 text-left font-black uppercase tracking-widest text-[10px]">Product/Combo</th>
                    <th className="px-6 py-5 text-left font-black uppercase tracking-widest text-[10px]">Price</th>
                    <th className="px-6 py-5 text-left font-black uppercase tracking-widest text-[10px]">Date</th>
                    <th className="px-6 py-5 text-center font-black uppercase tracking-widest text-[10px]">Qty</th>
                    <th className="px-6 py-5 text-center font-black uppercase tracking-widest text-[10px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {Object.entries(selectedProducts).map(([key, product]) => (
                    <tr key={key} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-black text-gray-900 text-sm leading-tight">{product.productName}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.productId}</p>
                      </td>
                      <td className="px-6 py-5 font-black text-green-600 text-base">₹{product.price}</td>
                      <td className="px-6 py-5 font-bold text-gray-500">{product.packingDate}</td>
                      <td className="px-6 py-5 text-center">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-black text-xs">{product.printQty}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => handleRemoveProduct(key)}
                          className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 mx-auto"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Print Button */}
            <div className="p-8 bg-gradient-to-tr from-slate-50 to-white border-t border-green-100">
              <button
                onClick={handlePrint}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-base shadow-2xl shadow-green-200 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaPrint size={20} /> {loading ? "Generating Labels..." : `Print ${Object.values(selectedProducts).reduce((a, b) => a + b.printQty, 0)} Stickers Now`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stickers;
