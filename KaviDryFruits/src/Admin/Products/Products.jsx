import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import {
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaBarcode,
  FaBoxOpen,
  FaImage,
  FaLayerGroup,
  FaFileAlt,
} from "react-icons/fa";
import imageCompression from "browser-image-compression";
import JsBarcode from "jsbarcode";

const Products = () => {
  const [activeTab, setActiveTab] = useState("single"); // "single" or "combo"
  const [categories, setCategories] = useState([]);

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

  const handleSuccess = () => {
    toast.success("Product Saved Successfully! 🎉");
  };

  return (
    <div className="w-full p-4 md:p-10 mt-15 min-h-screen bg-transparent animate-in fade-in duration-700">
      {/* Header & Tabs */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8 bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/60 shadow-xl shadow-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 transition-all duration-500 ${activeTab === "single" ? "bg-gradient-to-tr from-emerald-600 to-green-400 rotate-0" : "bg-gradient-to-tr from-amber-600 to-orange-400 rotate-12"}`}>
              {activeTab === "single" ? <FaBoxOpen size={24} /> : <FaLayerGroup size={24} />}
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
                {activeTab === "single" ? "Single Product" : "Combo Pack"} <span className="text-gray-400 font-medium tracking-normal text-3xl">Studio</span>
              </h1>
              <p className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                Inventory Master Control
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-gray-200/50 p-2 rounded-[2rem] shadow-inner backdrop-blur-sm border border-white/50">
          <button
            onClick={() => setActiveTab("single")}
            className={`flex items-center gap-3 px-10 py-4 rounded-[1.5rem] transition-all duration-500 font-black uppercase tracking-widest text-xs ${activeTab === "single" ? "bg-white text-emerald-700 shadow-xl scale-105 border border-emerald-100" : "text-gray-500 hover:text-emerald-600"}`}
          >
            <FaBoxOpen className={activeTab === "single" ? "animate-bounce" : ""} /> Single
          </button>
          <button
            onClick={() => setActiveTab("combo")}
            className={`flex items-center gap-3 px-10 py-4 rounded-[1.5rem] transition-all duration-500 font-black uppercase tracking-widest text-xs ${activeTab === "combo" ? "bg-white text-amber-700 shadow-xl scale-105 border border-amber-100" : "text-gray-500 hover:text-amber-600"}`}
          >
            <FaLayerGroup className={activeTab === "combo" ? "animate-bounce" : ""} /> Combo
          </button>
        </div>
      </div>

      <div className="animate-in slide-in-from-bottom-8 duration-700">
        {activeTab === "single" ? (
          <SingleProductForm categories={categories} onSuccess={handleSuccess} />
        ) : (
          <ComboProductForm categories={categories} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   SINGLE PRODUCT FORM
   ========================================================================== */
const SingleProductForm = ({ categories, onSuccess }) => {
  const [form, setForm] = useState({
    productId: "",
    name: "",
    description: "",
    category: "",
    rating: 0,
    barcode: "",
    barcodeValue: "",
    images: [],
    totalStock: "0",
    variants: [{ weight: "", mrp: "", offerPercent: "", offerPrice: "" }],
    healthBenefits: [""],
  });
  const [loading, setLoading] = useState(false);
  const barcodeRef = useRef(null);

  useEffect(() => {
    const generateId = async () => {
      try {
        const res = await api.get("/products");
        const count =
          res.data.filter((p) => p.productType === "single").length + 1;
        setForm((prev) => ({
          ...prev,
          productId: `PR${String(count).padStart(3, "0")}`,
        }));
      } catch (err) { }
    };
    generateId();
  }, []);

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
        const svgData = new XMLSerializer().serializeToString(
          barcodeRef.current,
        );
        const base64Data = `data:image/svg+xml;base64,${btoa(svgData)}`;
        if (form.barcode !== base64Data)
          setForm((prev) => ({
            ...prev,
            barcode: base64Data,
            barcodeValue: code,
          }));
      } catch (e) { }
    }
  }, [form.productId, form.barcodeValue]);

  useEffect(() => {
    const calculateTotalStock = () => {
      const sum = form.variants.reduce((acc, v) => {
        const match = v.weight.match(/(\d+)/);
        return acc + (match ? parseInt(match[1]) : 0);
      }, 0);
      setForm((prev) => ({ ...prev, totalStock: sum.toString() }));
    };
    calculateTotalStock();
  }, [form.variants]);

  const handleImageUpload = async (e) => {
    const rawFiles = Array.from(e.target.files);
    try {
      toast.loading("Uploading...", { id: "up" });
      const base64 = await Promise.all(
        rawFiles.map((file) =>
          imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
          }).then((blob) => {
            return new Promise((res) => {
              const r = new FileReader();
              r.onloadend = () => res(r.result);
              r.readAsDataURL(blob);
            });
          }),
        ),
      );
      setForm((prev) => ({ ...prev, images: [...prev.images, ...base64] }));
      toast.success("Ready!", { id: "up" });
    } catch {
      toast.error("Fail", { id: "up" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/products", { ...form, productType: "single" });
      onSuccess();
      setForm({
        ...form,
        name: "",
        description: "",
        category: "",
        images: [],
        totalStock: "0",
        variants: [{ weight: "", mrp: "", offerPercent: "", offerPrice: "" }],
        healthBenefits: [""],
      });
    } catch {
      toast.error("Failed");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-emerald-100 ring-1 ring-emerald-50">
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 p-10 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Product Studio</h2>
            <p className="opacity-90 font-medium mt-1 text-emerald-50 uppercase tracking-[0.2em] text-xs">
              Fresh Inventory Entry
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30">
             <span className="font-black tracking-widest text-sm">{form.productId}</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
                  Product Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-900"
                  placeholder="e.g. Premium Roasted Almonds"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block flex items-center gap-2">
                  {" "}
                  <FaFileAlt className="text-emerald-500" /> Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  rows="3"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none transition-all resize-none"
                  placeholder="Enter product details, health benefits, etc."
                />
              </div>
            </div>

           
              <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      required
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.cname}>
                          {c.cname}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
              </div>

              <div className="bg-emerald-50 rounded-[2rem] border border-emerald-100 p-6 shadow-sm">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">
                      Barcode / SKU
                    </label>
                    <input
                      value={form.barcodeValue}
                      onChange={(e) =>
                        setForm({ ...form, barcodeValue: e.target.value })
                      }
                      className="w-full bg-white border border-emerald-200 rounded-2xl px-5 py-4 text-sm outline-none transition-all"
                      placeholder="Type SKU"
                    />
                  </div>
                  <div className="bg-white p-5 rounded-[1.5rem] border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center gap-3 min-h-[180px]">
                    <label className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                      Preview
                    </label>
                    <svg
                      className="absolute -left-[9999px]"
                      ref={barcodeRef}
                    ></svg>
                    {form.barcode ? (
                      <img
                        src={form.barcode}
                        alt="bc"
                        className="h-24 w-full max-w-[240px] object-contain"
                      />
                    ) : (
                      <div className="h-24 w-full max-w-[240px] bg-emerald-50 rounded-lg flex items-center justify-center text-[10px] text-emerald-300">
                        Generating...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
              Images *
            </label>
            <div className="relative border-4 border-dashed border-gray-100 rounded-3xl p-8 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full">
                <FaPlus size={24} />
              </div>
              <p className="font-bold text-gray-400">Click to add images</p>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square group rounded-xl overflow-hidden border shadow-sm"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="p"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        images: p.images.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 space-y-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaLayerGroup className="text-emerald-500" />
              Product Variants (Weight / Units)
            </h3>
            <button
              type="button"
              onClick={() =>
                setForm((p) => ({
                  ...p,
                  variants: [
                    ...p.variants,
                    { weight: "", mrp: "", offerPercent: "", offerPrice: "" },
                  ],
                }))
              }
              className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              <FaPlus size={14} />
              Add Weight
            </button>
          </div>
          {form.variants.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-100 relative group hover:shadow-md transition-all"
            >
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">
                  Weight / Unit
                </label>
                <input
                  placeholder="e.g. 250g, 500g, 1kg"
                  value={v.weight}
                  onChange={(e) => {
                    const u = [...form.variants];
                    u[i].weight = e.target.value;
                    setForm({ ...form, variants: u });
                  }}
                  className="w-full bg-white border-2 border-transparent focus:border-emerald-500 rounded-xl px-4 py-3 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">
                  MRP Tag (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={v.mrp}
                  onChange={(e) => {
                    const u = [...form.variants];
                    u[i].mrp = e.target.value;
                    u[i].offerPrice = Math.round(
                      Number(e.target.value) -
                        (Number(e.target.value) * Number(u[i].offerPercent)) /
                          100,
                    );
                    setForm({ ...form, variants: u });
                  }}
                  className="w-full bg-white border-2 border-transparent focus:border-emerald-500 rounded-xl px-4 py-3 outline-none text-emerald-600 font-bold transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1 block">
                  DISCOUNT %
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={v.offerPercent}
                  onChange={(e) => {
                    const u = [...form.variants];
                    u[i].offerPercent = e.target.value;
                    u[i].offerPrice = Math.round(
                      Number(u[i].mrp) -
                        (Number(u[i].mrp) * Number(e.target.value)) / 100,
                    );
                    setForm({ ...form, variants: u });
                  }}
                  className="w-full bg-white border-2 border-transparent focus:border-emerald-500 rounded-xl px-4 py-3 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1 block">
                  SELLING PRICE
                </label>
                <div className="bg-emerald-100 px-4 py-3 rounded-xl border border-emerald-200 text-emerald-700 font-black shadow-inner flex items-center ">
                  ₹{v.offerPrice || 0}
                </div>
              </div>
              {form.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      variants: p.variants.filter((_, idx) => idx !== i),
                    }))
                  }
                  className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-400 hover:text-red-600 rounded-full flex items-center justify-center border border-gray-100 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Remove variant"
                >
                  <FaTrash size={12} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block">
            Total Stock *
          </label>
          <input
            type="number"
            value={form.totalStock}
            disabled
            className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-emerald-700"
            placeholder="Total Qty"
          />
        </div>

        <div className="pt-8 space-y-4 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500" />
                Health Benefits
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Add multiple benefit points for the product.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm((p) => ({
                  ...p,
                  healthBenefits: [...p.healthBenefits, ""],
                }))
              }
              className="bg-emerald-600 text-white px-5 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2 text-sm"
            >
              <FaPlus size={12} />
              Add Benefit
            </button>
          </div>

          {/* ✅ CHANGED HERE ONLY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {form.healthBenefits.map((b, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto] gap-3 items-center bg-white p-2 rounded-[1.75rem] border border-gray-200 shadow-sm"
              >
                <input
                  placeholder="e.g., Rich in antioxidants"
                  value={b}
                  onChange={(e) => {
                    const u = [...form.healthBenefits];
                    u[i] = e.target.value;
                    setForm({ ...form, healthBenefits: u });
                  }}
                  className="w-full bg-transparent border border-gray-200 rounded-[1.5rem] px-4 py-3 outline-none text-sm text-gray-700 placeholder-gray-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      healthBenefits: p.healthBenefits.filter(
                        (_, idx) => idx !== i,
                      ),
                    }))
                  }
                  className="text-red-500 hover:text-red-700 p-2 rounded-full transition-all"
                  title="Remove benefit"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-10 flex justify-end">
          <button
            disabled={loading}
            className="bg-gradient-to-tr from-emerald-600 to-green-400 px-16 py-4 rounded-3xl text-white font-black text-xl shadow-2xl hover:shadow-emerald-200 transition-all active:scale-95"
          >
            {loading ? "Processing..." : "Save Product Listing"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ==========================================================================
   COMBO PACK FORM
   ========================================================================== */
const ComboProductForm = ({ categories, onSuccess }) => {
  const [form, setForm] = useState({
    productId: "",
    name: "",
    description: "",
    category: "Combo Packs",
    rating: 0,
    barcode: "",
    barcodeValue: "",
    images: [],
    totalStock: "0",
    comboItems: [{ name: "", weight: "" }],
    comboDetails: { mrp: "", offerPercent: "", offerPrice: "" },
  });
  const [loading, setLoading] = useState(false);
  const barcodeRef = useRef(null);

  useEffect(() => {
    const generateId = async () => {
      try {
        const res = await api.get("/products");
        const count =
          res.data.filter((p) => p.productType === "combo").length + 1;
        setForm((prev) => ({
          ...prev,
          productId: `KPR${String(count).padStart(3, "0")}`,
        }));
      } catch (err) { }
    };
    generateId();
  }, []);

  useEffect(() => {
    if (form.productId && barcodeRef.current) {
      const code = form.barcodeValue || form.productId;
      try {
        JsBarcode(barcodeRef.current, code, {
          format: "CODE128",
          lineColor: "#ea580c",
          width: 2,
          height: 40,
          displayValue: true,
        });
        const svgData = new XMLSerializer().serializeToString(
          barcodeRef.current,
        );
        const base64Data = `data:image/svg+xml;base64,${btoa(svgData)}`;
        if (form.barcode !== base64Data)
          setForm((prev) => ({
            ...prev,
            barcode: base64Data,
            barcodeValue: code,
          }));
      } catch (e) { }
    }
  }, [form.productId, form.barcodeValue]);

  const handleImageUpload = async (e) => {
    const rawFiles = Array.from(e.target.files);
    try {
      toast.loading("Uploading...", { id: "up-c" });
      const base64 = await Promise.all(
        rawFiles.map((file) =>
          imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
          }).then((blob) => {
            return new Promise((res) => {
              const r = new FileReader();
              r.onloadend = () => res(r.result);
              r.readAsDataURL(blob);
            });
          }),
        ),
      );
      setForm((prev) => ({ ...prev, images: [...prev.images, ...base64] }));
      toast.success("Ready!", { id: "up-c" });
    } catch {
      toast.error("Fail", { id: "up-c" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/products", { ...form, productType: "combo" });
      onSuccess();
      setForm({
        ...form,
        name: "",
        description: "",
        images: [],
        totalStock: "0",
        comboItems: [{ name: "", weight: "" }],
        comboDetails: { mrp: "", offerPercent: "", offerPrice: "" },
      });
    } catch {
      toast.error("Failed");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-amber-100 ring-1 ring-amber-50">
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-400 p-10 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Combo Studio</h2>
            <p className="opacity-90 font-medium mt-1 text-amber-50 uppercase tracking-[0.2em] text-xs">
              Premium Pack Creation
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30">
            <span className="font-black tracking-widest text-sm">{form.productId}</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase mb-2 block tracking-widest">
                  Combo Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold text-gray-900"
                  placeholder="e.g. Healthy Morning Combo"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase mb-2 block tracking-widest flex items-center gap-2">
                  {" "}
                  <FaFileAlt className="text-amber-500" /> Combo Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  rows="3"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 outline-none transition-all resize-none"
                  placeholder="Details about this combo pack..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase mb-2 block tracking-widest">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 outline-none transition-all"
                >
                  <option value="Combo Packs">Combo Packs</option>
                  <option value="Gift Packs">Gift Packs</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.cname}>
                      {c.cname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase mb-2 block tracking-widest text-amber-700">
                  Total Pack Stock *
                </label>
                <input
                  type="number"
                  value={form.totalStock}
                  onChange={(e) =>
                    setForm({ ...form, totalStock: e.target.value })
                  }
                  required
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 outline-none transition-all font-bold"
                  placeholder="Pack Qty"
                />
              </div>
            </div>
            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4 items-center">
              <div className="flex-1">
                <label className="text-[10px] font-black text-amber-600 uppercase mb-1 block">
                  Barcode / SKU
                </label>
                <input
                  value={form.barcodeValue}
                  onChange={(e) =>
                    setForm({ ...form, barcodeValue: e.target.value })
                  }
                  className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>
              <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-amber-200 shrink-0 flex flex-col items-center gap-2">
                <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                  Barcode Preview
                </label>
                <svg className="absolute -left-[9999px]" ref={barcodeRef}></svg>
                {form.barcode ? (
                  <img
                    src={form.barcode}
                    alt="bc"
                    className="h-16 w-48 object-contain"
                  />
                ) : (
                  <div className="h-16 w-48 bg-amber-50 rounded-lg flex items-center justify-center text-[10px] text-amber-300">
                    Generating...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase mb-2 block tracking-widest">
              Images *
            </label>
            <div className="relative border-4 border-dashed border-gray-100 rounded-3xl p-8 hover:border-amber-200 hover:bg-amber-50/20 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="bg-amber-100 text-amber-600 p-4 rounded-full">
                <FaPlus size={24} />
              </div>
              <p className="font-bold text-gray-400 text-sm">
                Upload Pack Images
              </p>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square group rounded-xl overflow-hidden border shadow-sm border-amber-100"
                >
                  <img
                    src={img}
                    className="w-full h-full object-cover"
                    alt="p"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        images: p.images.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
          {/* Combo Items List */}
          <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 shadow-inner">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  Pack Contents
                </h3>
                <div className="w-12 h-1 bg-amber-500 mt-1 rounded-full"></div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    comboItems: [...p.comboItems, { name: "", weight: "" }],
                  }))
                }
                className="bg-amber-600 text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-amber-700 transition-all flex items-center gap-2"
              >
                <FaPlus size={10} /> Add Item
              </button>
            </div>
            <div className="space-y-4">
              {form.comboItems.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-amber-50 group hover:border-amber-200 transition-all"
                >
                  <div className="flex-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Item Name</label>
                    <input
                      placeholder="e.g. Roasted Cashews"
                      value={item.name}
                      onChange={(e) => {
                        const u = [...form.comboItems];
                        u[i].name = e.target.value;
                        setForm({ ...form, comboItems: u });
                      }}
                      className="w-full outline-none text-gray-900 font-bold bg-transparent"
                    />
                  </div>
                  <div className="w-24 border-l pl-4">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Weight</label>
                    <input
                      placeholder="500g"
                      value={item.weight}
                      onChange={(e) => {
                        const u = [...form.comboItems];
                        u[i].weight = e.target.value;
                        setForm({ ...form, comboItems: u });
                      }}
                      className="w-full outline-none text-emerald-600 font-black bg-transparent"
                    />
                  </div>
                  {form.comboItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          comboItems: p.comboItems.filter(
                            (_, idx) => idx !== i,
                          ),
                        }))
                      }
                      className="text-red-300 hover:text-red-500 transition-colors p-2"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-amber-50/50 p-8 rounded-[3rem] flex flex-col justify-center border border-amber-100 shadow-inner">
            <div className="mb-8">
              <h3 className="text-xl font-black text-amber-900 uppercase tracking-tight">
                Pricing Summary
              </h3>
              <div className="w-12 h-1 bg-amber-400 mt-1 rounded-full"></div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 block ml-1">
                    Pack MRP (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={form.comboDetails.mrp}
                    onChange={(e) => {
                      const u = { ...form.comboDetails };
                      u.mrp = e.target.value;
                      u.offerPrice = Math.round(
                        Number(u.mrp) -
                        (Number(u.mrp) * Number(u.offerPercent)) / 100,
                      );
                      setForm({ ...form, comboDetails: u });
                    }}
                    className="w-full bg-white border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 font-black text-gray-900 shadow-sm transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 block ml-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 15"
                    value={form.comboDetails.offerPercent}
                    onChange={(e) => {
                      const u = { ...form.comboDetails };
                      u.offerPercent = e.target.value;
                      u.offerPrice = Math.round(
                        Number(u.mrp) -
                        (Number(u.mrp) * Number(u.offerPercent)) / 100,
                      );
                      setForm({ ...form, comboDetails: u });
                    }}
                    className="w-full bg-white border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 font-black text-gray-900 shadow-sm transition-all outline-none"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] border-2 border-amber-200 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                <label className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1 block relative z-10">
                  Total Combo Price
                </label>
                <div className="text-4xl font-black text-amber-900 relative z-10 flex items-baseline gap-1">
                  <span className="text-xl">₹</span>
                  {form.comboDetails.offerPrice || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 flex justify-end">
          <button
            disabled={loading}
            className="bg-gradient-to-tr from-amber-600 to-orange-400 px-16 py-4 rounded-3xl text-white font-black text-xl shadow-2xl hover:shadow-orange-200 transition-all active:scale-95"
          >
            {loading ? "Processing..." : "Create Combo Pack"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Products;
