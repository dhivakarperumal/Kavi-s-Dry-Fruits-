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
    <div className="max-w-7xl mx-auto p-4 md:p-8 mt-15">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
            <span className="text-emerald-600 border-b-4 border-emerald-500 pb-1">
              Products
            </span>{" "}
            Management
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your inventory and create new product listings
          </p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner inline-flex">
          <button
            onClick={() => setActiveTab("single")}
            className={`flex items-center gap-2 px-8 py-2 rounded-xl transition-all duration-500 font-bold ${activeTab === "single" ? "bg-emerald-600 text-white shadow-xl scale-105" : "text-gray-500 hover:text-emerald-600"}`}
          >
            <FaBoxOpen /> Single Product
          </button>
          <button
            onClick={() => setActiveTab("combo")}
            className={`flex items-center gap-2 px-8 py-2 rounded-xl transition-all duration-500 font-bold ${activeTab === "combo" ? "bg-amber-600 text-white shadow-xl scale-105" : "text-gray-500 hover:text-amber-600"}`}
          >
            <FaLayerGroup /> Combo Pack
          </button>
        </div>
      </div>

      {activeTab === "single" ? (
        <SingleProductForm categories={categories} onSuccess={handleSuccess} />
      ) : (
        <ComboProductForm categories={categories} onSuccess={handleSuccess} />
      )}
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
      } catch (err) {}
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
      } catch (e) {}
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
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-emerald-50">
      <div className="bg-emerald-600 p-8 text-white">
        <h2 className="text-2xl font-bold">Add Single Product Listing</h2>
        <p className="opacity-80">
          Create a standard dry fruit product with description and variants
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
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
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none transition-all"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-100 relative group hover:shadow-md transition-all"
            >
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Weight
                </label>
                <input
                  placeholder="250g"
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
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  MRP (₹)
                </label>
                <input
                  type="number"
                  placeholder="500"
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
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Offer %
                </label>
                <input
                  type="number"
                  placeholder="10"
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
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Final Price
                </label>
                <div className="bg-emerald-100 px-4 py-3 rounded-xl border border-emerald-200 text-emerald-700 font-black shadow-inner flex items-center ">
                  ₹{v.offerPrice || 0}
                </div>
              </div>
              <div className="flex items-end justify-end">
                {form.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        variants: p.variants.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all"
                    title="Remove variant"
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
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
      } catch (err) {}
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
      } catch (e) {}
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
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-amber-50">
      <div className="bg-amber-600 p-8 text-white">
        <h2 className="text-2xl font-bold">Add Premium Combo Pack</h2>
        <p className="opacity-80">
          Create a bundled set with description and pack details
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
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
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 outline-none transition-all"
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
          <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-serif text-amber-900 italic">
                Contents of the Pack
              </h3>
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    comboItems: [...p.comboItems, { name: "", weight: "" }],
                  }))
                }
                className="text-amber-600 font-bold border-b-2 border-amber-600 hover:text-amber-800 transition"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-4">
              {form.comboItems.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-amber-50 group"
                >
                  <input
                    placeholder="Item Name (e.g. Almonds)"
                    value={item.name}
                    onChange={(e) => {
                      const u = [...form.comboItems];
                      u[i].name = e.target.value;
                      setForm({ ...form, comboItems: u });
                    }}
                    className="flex-1 outline-none text-gray-700"
                  />
                  <input
                    placeholder="Wt"
                    value={item.weight}
                    onChange={(e) => {
                      const u = [...form.comboItems];
                      u[i].weight = e.target.value;
                      setForm({ ...form, comboItems: u });
                    }}
                    className="w-20 outline-none text-emerald-600 font-bold border-l pl-4"
                  />
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
                      className="text-red-200 group-hover:text-red-500 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-amber-50 p-8 rounded-[2rem] flex flex-col justify-center border border-amber-100 space-y-6">
            <h3 className="text-xl font-bold text-amber-900 border-b border-amber-200 pb-2">
              Pricing Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-amber-700 uppercase mb-1 block">
                  Combo MRP (₹)
                </label>
                <input
                  type="number"
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
                  className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-amber-700 uppercase mb-1 block">
                  Discount (%)
                </label>
                <input
                  type="number"
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
                  className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-amber-700 uppercase mb-1 block">
                  Offer Price
                </label>
                <div className="w-full bg-white border-2 border-amber-400 text-amber-800 font-black rounded-xl px-4 py-3 shadow-inner">
                  ₹{form.comboDetails.offerPrice}
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
