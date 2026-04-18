import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import JsBarcode from "jsbarcode";
import { FaPlus, FaTrash, FaPrint, FaBarcode } from "react-icons/fa6";

const Stickers = () => {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("create");
  const [barcodeImg, setBarcodeImg] = useState("");
  const [stickerRecords, setStickerRecords] = useState([]);

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

  // Fetch sticker records
  useEffect(() => {
    if (viewMode === "history") {
      const fetchRecords = async () => {
        try {
          const res = await api.get("/stickers");
          setStickerRecords(res.data);
        } catch (error) {
          console.error("Error fetching records:", error);
          toast.error("Failed to load records");
        }
      };
      fetchRecords();
    }
  }, [viewMode]);

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
    const productId = e.target.value;
    const selected = productsList.find((p) => p.productId === productId);
    if (selected) {
      setProductInput({
        productId: selected.productId,
        productName: selected.name,
        price: "",
        barcode: selected.barcode || selected.productId,
        packingDate: "",
        printQty: 1,
      });
    } else {
      setProductInput({
        productId: "",
        productName: "",
        price: "",
        barcode: "",
        packingDate: "",
        printQty: 1,
      });
    }
  };

  // Add product to selection
  const handleAddProduct = () => {
    const { productId, productName, price, barcode, packingDate, printQty } = productInput;
    
    if (!productId || !productName || !price || !barcode || !packingDate || !printQty) {
      toast.error("Please fill all required fields");
      return;
    }

    // Generate barcode image
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, barcode, { format: "CODE128", width: 2, height: 60, displayValue: false, fontSize: 14 });
    const barcodeImgData = canvas.toDataURL("image/png");

    const key = `${productId}-${Date.now()}`;
    setSelectedProducts((prev) => ({
      ...prev,
      [key]: { 
        productId, 
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
    toast.success("Product added to list");
  };

  // Remove product from selection
  const handleRemoveProduct = (key) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    toast.success("Product removed");
  };

  // Delete sticker record
  const handleDeleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await api.delete(`/stickers/${id}`);
      setStickerRecords(prev => prev.filter(r => r.id !== id));
      toast.success("Record deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete record");
    }
  };

  // Print stickers
  const handlePrint = async () => {
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

    // Save records to database
    try {
      setLoading(true);
      let totalStickers = 0;

      for (const product of productsToPrint) {
        await api.post("/stickers", {
          productId: product.productId,
          price: product.price,
          barcode: product.barcode,
          packingDate: product.packingDate,
          printQty: product.printQty,
          totalStickers: product.printQty,
        });
        totalStickers += product.printQty;
      }

      // Generate print page
      const iframe = document.createElement("iframe");
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
              body {
                font-family: Arial, sans-serif;
                padding: 10px;
                margin: 0;
              }
              .sticker-container {
                display: grid;
                grid-template-columns: repeat(10, 1fr);
                gap: 20px;
              }
              .sticker {
                width: 82px;
                padding: 0.5px;
                text-align: center;
              }
              .sticker img {
                width: 100%;
                height: 50px;
                margin-bottom: 2px;
                object-fit: cover;
              }
            </style>
          </head>
          <body>
            <div class="sticker-container">
      `);

      productsToPrint.forEach((product) => {
        for (let i = 0; i < product.printQty; i++) {
          doc.write(`
            <div class="sticker" style="text-align: center; font-family: Arial, sans-serif;">
              <img src="${product.barcodeImg}" alt="Barcode" />
              <div style="font-weight: bold; margin-top: 5px; font-size: 11px;">₹${product.price}</div>
              <div style="margin-top: 2px; font-size: 9px;">${formatDate(product.packingDate)}</div>
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
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);

      // Clear selected products
      setSelectedProducts({});
      toast.success(`${totalStickers} stickers printed and saved!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save sticker records");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-3 md:p-6 min-h-screen bg-transparent animate-in fade-in duration-700">
      {/* Header & Tabs */}
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

        <div className="flex bg-gray-200/50 p-1.5 rounded-2xl shadow-inner backdrop-blur-sm border border-white/50">
          <button
            onClick={() => setViewMode("create")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-500 font-black uppercase tracking-widest text-[11px] ${viewMode === "create" ? "bg-white text-green-700 shadow-xl scale-105 border border-green-100" : "text-gray-500 hover:text-green-600"}`}
          >
            <FaPlus className={viewMode === "create" ? "animate-bounce" : ""} size={14} /> Create
          </button>
          <button
            onClick={() => setViewMode("history")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-500 font-black uppercase tracking-widest text-[11px] ${viewMode === "history" ? "bg-white text-green-700 shadow-xl scale-105 border border-green-100" : "text-gray-500 hover:text-green-600"}`}
          >
            <FaPrint className={viewMode === "history" ? "animate-bounce" : ""} size={14} /> History
          </button>
        </div>
      </div>

      <div className="animate-in slide-in-from-bottom-8 duration-700">
        {/* --- CREATE STICKERS --- */}
        {viewMode === "create" && (
          <>
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
                      <FaBarcode size={14} className="text-green-500" /> Select Product *
                    </label>
                    <select
                      value={productInput.productId}
                      onChange={handleSelectProduct}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
                    >
                      <option value="">-- Choose Product --</option>
                      {productsList.map((p) => (
                        <option key={p.id} value={p.productId}>
                          {p.productId} - {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={productInput.productName}
                      readOnly
                      className="w-full bg-gray-100 border-2 border-transparent rounded-xl px-4 py-2.5 outline-none font-bold text-sm text-gray-700"
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
                      placeholder="Auto-filled from product"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
                    />
                  </div>

                  {/* Packing Date */}
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
                      Packing Date *
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
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
                      Quantity to Print *
                    </label>
                    <input
                      type="number"
                      name="printQty"
                      value={productInput.printQty}
                      onChange={handleChange}
                      min="1"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
                    />
                  </div>
                </div>

                {/* Barcode Preview */}
                {barcodeImg && (
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-3">Barcode Preview</p>
                    <div className="flex justify-center">
                      <img src={barcodeImg} alt="Barcode" className="h-20" />
                    </div>
                  </div>
                )}

                {/* Add Product Button */}
                <button
                  onClick={handleAddProduct}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaPlus size={14} /> Add Product to List
                </button>
              </div>
            </div>

            {/* Selected Products Table */}
            {Object.keys(selectedProducts).length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100 ring-1 ring-green-50 mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                      <tr>
                        <th className="px-4 py-4 text-left font-black">Product ID</th>
                        <th className="px-4 py-4 text-left font-black">Name</th>
                        <th className="px-4 py-4 text-left font-black">Price</th>
                        <th className="px-4 py-4 text-left font-black">Packing Date</th>
                        <th className="px-4 py-4 text-center font-black">Qty</th>
                        <th className="px-4 py-4 text-center font-black">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-100">
                      {Object.entries(selectedProducts).map(([key, product]) => (
                        <tr key={key} className="hover:bg-green-50 transition-colors">
                          <td className="px-4 py-4 font-bold text-gray-900">{product.productId}</td>
                          <td className="px-4 py-4 text-gray-700">{product.productName}</td>
                          <td className="px-4 py-4 font-bold text-green-600">₹{product.price}</td>
                          <td className="px-4 py-4 text-gray-700">{product.packingDate}</td>
                          <td className="px-4 py-4 text-center font-bold">{product.printQty}</td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleRemoveProduct(key)}
                              className="text-red-500 hover:text-red-700 font-black transition-colors"
                            >
                              <FaTrash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Print Button */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-t border-green-200 flex gap-4">
                  <button
                    onClick={handlePrint}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaPrint size={16} /> {loading ? "Processing..." : "Print All Stickers"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- HISTORY VIEW --- */}
        {viewMode === "history" && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100 ring-1 ring-green-50">
            <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-500 p-6 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tight">Printing History</h2>
                <p className="opacity-90 font-medium mt-0.5 text-green-50 uppercase tracking-[0.2em] text-[10px]">
                  All Sticker Printing Records
                </p>
              </div>
            </div>

            {stickerRecords.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 font-semibold">No sticker printing records yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-green-600 to-green-500 text-white">
                    <tr>
                      <th className="px-4 py-4 text-left font-black">S.No</th>
                      <th className="px-4 py-4 text-left font-black">Product</th>
                      <th className="px-4 py-4 text-left font-black">Price</th>
                      <th className="px-4 py-4 text-left font-black">Packing Date</th>
                      <th className="px-4 py-4 text-center font-black">Qty</th>
                      <th className="px-4 py-4 text-left font-black">Date</th>
                      <th className="px-4 py-4 text-center font-black">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100">
                    {stickerRecords.map((record, index) => (
                      <tr key={record.id} className="hover:bg-green-50 transition-colors">
                        <td className="px-4 py-4 font-bold text-gray-900">{index + 1}</td>
                        <td className="px-4 py-4 text-gray-700">{record.name || record.productId}</td>
                        <td className="px-4 py-4 font-bold text-green-600">₹{record.price}</td>
                        <td className="px-4 py-4 text-gray-700">{new Date(record.packingDate).toLocaleDateString()}</td>
                        <td className="px-4 py-4 text-center font-bold">{record.printQty}</td>
                        <td className="px-4 py-4 text-gray-700">{new Date(record.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="text-red-500 hover:text-red-700 font-black transition-colors"
                          >
                            <FaTrash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stickers;
