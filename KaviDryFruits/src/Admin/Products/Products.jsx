import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { FaPlus, FaTrash, FaCheckCircle, FaBarcode, FaBoxOpen, FaImage } from "react-icons/fa";
import imageCompression from "browser-image-compression";
import JsBarcode from "jsbarcode";

const Products = () => {
  const [productType, setProductType] = useState("single");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const barcodeRef = useRef(null);

  // Form State
  const [form, setForm] = useState({
    productId: "",
    name: "",
    category: "",
    rating: 0,
    barcode: "",
    barcodeValue: "",
    images: [],
    variants: [{ weight: "", mrp: "", offerPercent: "", offerPrice: "", stock: "" }],
    comboItems: [{ name: "", weight: "" }],
    comboDetails: { mrp: "", offerPercent: "", offerPrice: "", stock: "" },
  });

  // Fetch Categories on Mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCats();
  }, []);

  // Generate unique Product ID
  useEffect(() => {
    const generateId = async () => {
      try {
        const res = await api.get("/products");
        const count = res.data.length + 1;
        const prefix = productType === "single" ? "KP" : "KPC";
        const id = `${prefix}${String(count).padStart(3, "0")}`;
        setForm(prev => ({ ...prev, productId: id }));
      } catch (err) {
        console.error("ID gen error", err);
      }
    };
    generateId();
  }, [productType]);

  // Handle Barcode Generation
  useEffect(() => {
    if (form.productId && barcodeRef.current) {
      const code = form.barcodeValue || form.productId;
      try {
        JsBarcode(barcodeRef.current, code, {
          format: "CODE128",
          lineColor: "#059669",
          width: 2,
          height: 40,
          displayValue: true,
        });
        const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
        const base64Data = `data:image/svg+xml;base64,${btoa(svgData)}`;
        if (form.barcode !== base64Data) {
          setForm(prev => ({ ...prev, barcode: base64Data, barcodeValue: code }));
        }
      } catch (e) {
        console.warn("Barcode gen error", e);
      }
    }
  }, [form.productId, form.barcodeValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const rawFiles = Array.from(e.target.files);
    if (rawFiles.length === 0) return;

    try {
      toast.loading("Compressing images...", { id: "img-upload" });
      const compressedBase64 = await Promise.all(
        rawFiles.map(async (file) => {
          const compressedBlob = await imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
          });
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(compressedBlob);
          });
        })
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...compressedBase64],
      }));
      toast.success("Images ready!", { id: "img-upload" });
    } catch (err) {
      toast.error("Upload failed", { id: "img-upload" });
    }
  };

  // Variants management
  const handleVariantChange = (index, field, value) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    if (field === "mrp" || field === "offerPercent") {
      const mrp = parseFloat(updated[index].mrp || 0);
      const offer = parseFloat(updated[index].offerPercent || 0);
      updated[index].offerPrice = Math.round(mrp - (mrp * offer) / 100);
    }
    setForm(prev => ({ ...prev, variants: updated }));
  };

  // Combo management
  const handleComboItemChange = (index, field, value) => {
    const updated = [...form.comboItems];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, comboItems: updated }));
  };

  const handleComboDetailsChange = (field, value) => {
    const updated = { ...form.comboDetails, [field]: value };
    if (field === "mrp" || field === "offerPercent") {
      const mrp = parseFloat(updated.mrp || 0);
      const offer = parseFloat(updated.offerPercent || 0);
      updated.offerPrice = Math.round(mrp - (mrp * offer) / 100);
    }
    setForm(prev => ({ ...prev, comboDetails: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || form.images.length === 0) {
      return toast.error("Please fill Name, Category and add at least one Image");
    }

    setLoading(true);
    const totalStock = productType === "single" 
      ? form.variants.reduce((sum, v) => sum + Number(v.stock || 0), 0)
      : Number(form.comboDetails.stock || 0);

    const payload = {
      ...form,
      productType,
      totalStock
    };

    try {
      await api.post("/products", payload);
      toast.success("Product Saved Successfully! 🎉");
      // Reset form
      setForm({
        ...form,
        name: "",
        category: "",
        images: [],
        rating: 0,
        variants: [{ weight: "", mrp: "", offerPercent: "", offerPrice: "", stock: "" }],
        comboItems: [{ name: "", weight: "" }],
        comboDetails: { mrp: "", offerPercent: "", offerPrice: "", stock: "" },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 mt-15">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <FaBoxOpen className="text-yellow-300" /> Add New Product
            </h1>
            <p className="text-emerald-100 mt-2">Create premium dry fruit listings for your shop</p>
          </div>
          <div className="hidden md:block">
            <svg className="hidden" ref={barcodeRef}></svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Top Selection */}
          <div className="flex bg-gray-50 p-1 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setProductType("single")}
              className={`px-8 py-3 rounded-xl transition-all duration-300 font-semibold ${productType === "single" ? "bg-white text-emerald-600 shadow-md" : "text-gray-500 hover:text-emerald-500"}`}
            >
              Single Product
            </button>
            <button
              type="button"
              onClick={() => setProductType("combo")}
              className={`px-8 py-3 rounded-xl transition-all duration-300 font-semibold ${productType === "combo" ? "bg-white text-emerald-600 shadow-md" : "text-gray-500 hover:text-emerald-500"}`}
            >
              Combo Pack
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - Basic Info */}
            <div className="space-y-6">
              <div className="group">
                <label className="text-sm font-bold text-gray-700 block mb-2 uppercase tracking-wider">Product Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Premium California Almonds"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-5 py-3 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2 uppercase tracking-wider">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-5 py-3 transition-all outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.cname}>{cat.cname}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2 uppercase tracking-wider">Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    max="5"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-5 py-3 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3 text-emerald-700 font-bold mb-2">
                  <FaBarcode /> Barcode Information
                </div>
                <div className="flex gap-4 items-end">
                   <div className="flex-1">
                    <label className="text-xs font-bold text-emerald-600 block mb-1 uppercase">Barcode Value</label>
                    <input
                      name="barcodeValue"
                      value={form.barcodeValue}
                      onChange={handleChange}
                      placeholder={form.productId}
                      className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                  </div>
                  <div className="w-40 h-16 bg-white rounded-xl border border-emerald-200 flex items-center justify-center p-2 overflow-hidden">
                    {form.barcode && <img src={form.barcode} alt="barcode" className="h-full object-contain" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Images */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2 uppercase tracking-wider flex items-center gap-2">
                  <FaImage className="text-emerald-500" /> Product Images *
                </label>
                <div className="relative group cursor-pointer border-2 border-dashed border-gray-300 rounded-3xl p-8 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full group-hover:scale-110 transition-transform">
                    <FaPlus size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-700">Click or Drag images to upload</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square group rounded-xl overflow-hidden shadow-md border border-gray-100">
                      <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="product" />
                      <button
                        type="button"
                        onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100 w-full" />

          {/* Variants / Combo Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                {productType === "single" ? "Product Variants" : "Combo Item Details"}
              </h2>
              {productType === "single" && (
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, variants: [...p.variants, { weight: "", mrp: "", offerPercent: "", offerPrice: "", stock: "" }] }))}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                  <FaPlus /> Add Variant
                </button>
              )}
            </div>

            {productType === "single" ? (
              <div className="space-y-4">
                {form.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Weight (e.g. 500g)</label>
                      <input
                        placeholder="Weight"
                        value={v.weight}
                        onChange={(e) => handleVariantChange(i, "weight", e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">MRP (₹)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={v.mrp}
                        onChange={(e) => handleVariantChange(i, "mrp", e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Offer %</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={v.offerPercent}
                        onChange={(e) => handleVariantChange(i, "offerPercent", e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 block">Final Price</label>
                      <input
                        readOnly
                        value={v.offerPrice}
                        className="w-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 font-bold rounded-xl px-4 py-2 outline-none"
                      />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Stock</label>
                        <input
                          type="number"
                          placeholder="Qty"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(i, "stock", e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-emerald-500"
                        />
                      </div>
                      {form.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setForm(p => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }))}
                          className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <FaTrash size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                 {/* Combo Items */}
                 <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-blue-700 uppercase text-xs tracking-widest">Items in Combo</h4>
                        <button 
                            type="button" 
                            onClick={() => setForm(p => ({ ...p, comboItems: [...p.comboItems, { name: "", weight: "" }] }))}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700"
                        >
                            + Add Item
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {form.comboItems.map((item, i) => (
                            <div key={i} className="flex gap-2 bg-white p-3 rounded-2xl shadow-sm border border-blue-100">
                                <input
                                    placeholder="Item Name"
                                    value={item.name}
                                    onChange={(e) => handleComboItemChange(i, "name", e.target.value)}
                                    className="flex-1 text-sm outline-none"
                                />
                                <input
                                    placeholder="Wt"
                                    value={item.weight}
                                    onChange={(e) => handleComboItemChange(i, "weight", e.target.value)}
                                    className="w-20 text-sm border-l pl-2 outline-none"
                                />
                                {form.comboItems.length > 1 && (
                                    <button onClick={() => setForm(p => ({ ...p, comboItems: p.comboItems.filter((_, idx) => idx !== i) }))} className="text-red-400 hover:text-red-600">
                                        <FaTrash size={12}/>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                 </div>

                 {/* Combo Pricing */}
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Combo MRP (₹)</label>
                      <input
                        type="number"
                        value={form.comboDetails.mrp}
                        onChange={(e) => handleComboDetailsChange("mrp", e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Offer %</label>
                      <input
                        type="number"
                        value={form.comboDetails.offerPercent}
                        onChange={(e) => handleComboDetailsChange("offerPercent", e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1 block">Final Price</label>
                      <input
                        readOnly
                        value={form.comboDetails.offerPrice}
                        className="w-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 font-bold rounded-xl px-4 py-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Total Stock</label>
                      <input
                        type="number"
                        value={form.comboDetails.stock}
                        onChange={(e) => handleComboDetailsChange("stock", e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-emerald-500"
                      />
                    </div>
                 </div>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
            <p className="text-gray-500 font-medium">Fields marked with <span className="text-red-500">*</span> are mandatory</p>
            <button
              disabled={loading}
              className={`px-12 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center gap-3 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-600 to-green-500 hover:shadow-emerald-200 hover:-translate-y-1"}`}
            >
              {loading ? "Saving Product..." : <><FaCheckCircle /> Save Product</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products;