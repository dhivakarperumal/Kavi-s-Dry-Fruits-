import CustomSelect from "../Common/CustomSelect";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaCheckCircle,
  FaFileAlt,
  FaBoxOpen,
  FaLayerGroup,
  FaSearch,
  FaEdit,
  FaEye,
  FaHeartbeat,
} from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import JsBarcode from "jsbarcode";
import imageCompression from "browser-image-compression";

const Products = ({ onInventoryChanged }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const editItem = location.state?.editItem;

  const [activeTab, setActiveTab] = useState(editItem?.type === "combo" ? "combo" : "single");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setActiveTab(editItem?.type === "combo" ? "combo" : "single");
  }, [editItem]);

  const fetchData = async () => {
    setLoadingList(true);
    try {
      const [catRes, prodRes, comboRes] = await Promise.all([
        api.get("/categories"),
        api.get("/products"),
        api.get("/combos"),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      setCombos(comboRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      const endpoint = type === "single" ? "/products" : "/combos";
      await api.delete(`${endpoint}/${id}`);
      toast.success("Deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredItems = (activeTab === "single" ? products : combos).filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full p-4 md:p-10 mt-0 min-h-screen bg-transparent animate-in fade-in duration-700">
      {/* Header & Tabs */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8 bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/60 shadow-xl shadow-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 transition-all duration-500 ${activeTab === "single" ? "bg-gradient-to-tr from-emerald-600 to-green-400 rotate-0" : "bg-gradient-to-tr from-amber-600 to-orange-400 rotate-12"}`}>
              {activeTab === "single" ? <FaBoxOpen size={24} /> : <FaLayerGroup size={24} />}
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                {activeTab === "single" ? "Single Product" : "Combo Pack"} <span className="text-gray-400 font-medium tracking-normal text-md">Studio</span>
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

      <div className="grid grid-cols-1 gap-12">
        {/* Forms Section */}
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          {activeTab === "single" ? (
            <SingleProductForm 
              categories={categories} 
              onSuccess={async () => {
                await fetchData();
                if (onInventoryChanged) await onInventoryChanged();
                navigate('/adminpanel/all-products');
              }} 
              products={products} 
              editItem={editItem} 
            />
          ) : (
            <ComboProductForm 
              categories={categories} 
              onSuccess={async () => {
                await fetchData();
                if (onInventoryChanged) await onInventoryChanged();
                navigate('/adminpanel/all-products');
              }} 
              combos={combos} 
              products={products} 
              editItem={editItem} 
            />
          )}
        </div>

      </div>
    </div>
  );
};

const SingleProductForm = ({ categories, onSuccess, products, editItem }) => {
  const [form, setForm] = useState({
    productId: "",
    name: "",
    description: "",
    healthBenefits: [""],
    category: "",
    images: [],
    variants: [{ weight: "", mrp: "", offerPercent: "", offerPrice: "" }],
    totalStock: "0",
    totalWeight: 0,
    barcode: "",
    barcodeValue: "",
    rating: 5,
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const barcodeRef = useRef();

  const safeParse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try { return JSON.parse(data); } catch { return []; }
  };

  useEffect(() => {
    if (editItem) {
      const savedStock = Number(editItem.totalStock);
      const savedWeightKg = Number.isFinite(savedStock) && savedStock >= 0
        ? savedStock / 1000
        : Number(editItem.totalWeight ?? 0);
      const savedVariants = safeParse(editItem.variants);
      const savedImages = safeParse(editItem.images).filter((image) => typeof image === "string");
      setForm({
        ...editItem,
        healthBenefits: safeParse(editItem.healthBenefits).length ? safeParse(editItem.healthBenefits) : [""],
        variants: savedVariants.length ? savedVariants : [{ weight: "", mrp: "", offerPercent: "", offerPrice: "" }],
        images: savedImages,
        totalWeight: savedWeightKg,
        barcodeValue: editItem.barcodeValue || editItem.productId
      });
      setImageFiles([]);
    } else {
      const maxId = products.reduce((max, p) => {
        const match = p.productId?.match(/\d+/);
        const num = match ? parseInt(match[0]) : 0;
        return Math.max(max, num);
      }, 0);
      setForm((prev) => ({
        ...prev,
        productId: `PR${String(maxId + 1).padStart(3, "0")}`,
        name: "", description: "", healthBenefits: [""], images: [], variants: [{ weight: "", mrp: "", offerPercent: "", offerPrice: "" }], totalStock: "0",
        barcodeValue: "", barcode: "", status: "Active"
      }));
      setImageFiles([]);
    }
  }, [editItem, products]);

  useEffect(() => {
    if (form.productId && barcodeRef.current) {
      const code = form.barcodeValue || form.productId;
      try {
        JsBarcode(barcodeRef.current, code, { format: "CODE128", lineColor: "#10b981", width: 2, height: 40, displayValue: true });
        const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
        const base64Data = `data:image/svg+xml;base64,${btoa(svgData)}`;
        if (form.barcode !== base64Data) setForm((prev) => ({ ...prev, barcode: base64Data, barcodeValue: code }));
      } catch (e) { }
    }
  }, [form.productId, form.barcodeValue]);

  const handleImageUpload = async (e) => {
    const rawFiles = Array.from(e.target.files);
    try {
      toast.loading("Compressing...", { id: "up-p" });
      const compressedFiles = await Promise.all(
        rawFiles.map((file) =>
          imageCompression(file, { maxSizeMB: 8, maxWidthOrHeight: 800, fileType: file.type, useWebWorker: true })
        ),
      );
      setImageFiles((prev) => [...prev, ...compressedFiles]);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...compressedFiles.map(file => URL.createObjectURL(file))] }));
      toast.success("Ready!", { id: "up-p" });
    } catch { toast.error("Fail", { id: "up-p" }); }
    finally { e.target.value = ""; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const enteredWeightKg = Number(form.totalWeight);
      const hasEnteredWeight = String(form.totalWeight ?? "").trim() !== "" && Number.isFinite(enteredWeightKg) && enteredWeightKg >= 0;
      const currentStock = hasEnteredWeight
        ? enteredWeightKg * 1000
        : Number.isFinite(Number(form.totalStock)) ? Number(form.totalStock) : 0;
      const formData = new FormData();
      Object.entries({
        ...form,
        totalStock: currentStock,
        healthBenefits: JSON.stringify(form.healthBenefits),
        images: JSON.stringify(form.images.filter((image) => typeof image === "string" && !image.startsWith("blob:"))),
        variants: JSON.stringify(form.variants),
      }).forEach(([key, value]) => formData.append(key, value ?? ""));
      imageFiles.forEach(file => formData.append("images", file));

      if (editItem) {
        await api.put(`/products/${editItem.id}`, formData);
        toast.success("Inventory Pulse Updated");
      } else {
        await api.post("/products", formData);
        toast.success("Product Registered Successfully");
      }
      onSuccess();
    } catch { toast.error("Studio Sync Failed"); }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-emerald-100 ring-1 ring-emerald-50">
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 p-10 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div><h2 className="text-xl font-black uppercase tracking-tight">Product Studio</h2><p className="opacity-90 font-medium mt-1 text-emerald-50 uppercase tracking-[0.2em] text-xs"> Fresh Inventory Entry</p></div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30"><span className="font-black tracking-widest text-sm">{form.productId}</span></div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-10 space-y-10">
        <div className="space-y-12">
          {/* Identity Section - Full Width */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50/50">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3"><div className="w-2 h-8 bg-emerald-500 rounded-full"></div> Identity & Details</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Product Title *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none font-bold text-gray-900 shadow-sm" placeholder="e.g. Premium Roasted Almonds" /></div>
                <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Composition / Description *</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows="3" className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none transition-all resize-none font-medium text-gray-700 leading-relaxed shadow-sm" placeholder="Describe quality, origin, benefits..." /></div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Category *</label>
                    <CustomSelect
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Select Category"
                      className="w-full"
                      buttonClassName="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none font-black text-emerald-800 shadow-sm"
                      options={[
                        { value: "", label: "Select Category" },
                        ...categories.map((c) => ({ value: c.cname, label: c.cname })),
                      ]}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Status *</label>
                    <CustomSelect
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      placeholder="Status"
                      className="w-full"
                      buttonClassName="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none font-black text-emerald-800 shadow-sm"
                      options={[
                        { value: "Active", label: "Active" },
                        { value: "Inactive", label: "Inactive" },
                      ]}
                    />
                  </div>
                </div>
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                      Total Weight (kg) *
                      <span className="text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-orange-100 text-orange-500">Manual</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={form.totalWeight}
                        onChange={(e) => setForm({ ...form, totalWeight: e.target.value })}
                        required
                        min="0"
                        className="w-full rounded-2xl px-6 py-4 font-black border-2 bg-orange-50 border-orange-300 text-orange-700 focus:border-orange-500 shadow-sm outline-none transition-all"
                        placeholder="Enter kilograms, e.g. 50"
                      />
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium ml-1 mt-1">Stored as grams: 50 kg = 50000 g.</p>
                  </div>
                {/* <div className="bg-emerald-50/30 p-6 rounded-[2rem] border border-emerald-100">
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">Studio Status Radar</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[60%] animate-pulse"></div></div>
                    <span className="text-[10px] font-black text-emerald-700">60% COMPLETE</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Registry & Ranges - Full Width Spanning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-emerald-50/50 p-8 rounded-[3rem] border border-emerald-100 shadow-xl shadow-emerald-50/20">
              <div className="flex justify-between items-center mb-8"><div><h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight">Digital Registry</h3><div className="w-12 h-1.5 bg-emerald-500 mt-1 rounded-full"></div></div><div className="px-5 py-3 bg-white rounded-2xl border border-emerald-200 font-black text-emerald-700 shadow-sm">{form.productId}</div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4"><label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1 block">SKU Code / Barcode</label><input value={form.barcodeValue} onChange={(e) => setForm({ ...form, barcodeValue: e.target.value })} className="w-full bg-white border-2 border-emerald-100 focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none font-bold shadow-sm" placeholder="System Default" /></div>
                <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center gap-2 shadow-inner"><svg className="absolute -left-[9999px]" ref={barcodeRef}></svg>{form.barcode ? <img src={form.barcode} alt="bc" className="h-24 w-full object-contain" /> : <div className="animate-pulse text-[10px] text-emerald-300 font-black uppercase">Generating...</div>}</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50/50">
              <div className="flex justify-between items-center mb-8"><h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3"><div className="w-2 h-8 bg-orange-400 rounded-full"></div> Sales Variants</h3><button type="button" onClick={() => setForm((p) => ({ ...p, variants: [...p.variants, { weight: "", mrp: "", offerPercent: "", offerPrice: "" }] }))} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-2">Expand Range</button></div>
              <div className="space-y-6">
                {form.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50/50 p-5 rounded-3xl border border-gray-100 items-end">
                    <div><label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Weight</label><input placeholder="250g" value={v.weight} onChange={(e) => { const u = [...form.variants]; u[i].weight = e.target.value; setForm({ ...form, variants: u }); }} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold shadow-sm" /></div>
                    <div><label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">MRP (₹)</label><input type="number" placeholder="500" value={v.mrp} onChange={(e) => { const u = [...form.variants]; u[i].mrp = e.target.value; u[i].offerPrice = Math.round(Number(e.target.value) - (Number(e.target.value) * Number(u[i].offerPercent)) / 100); setForm({ ...form, variants: u }); }} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-emerald-700 shadow-sm" /></div>
                    <div><label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5 ml-1">Discount %</label><input type="number" placeholder="10" value={v.offerPercent} onChange={(e) => { const u = [...form.variants]; u[i].offerPercent = e.target.value; u[i].offerPrice = Math.round(Number(u[i].mrp) - (Number(u[i].mrp) * Number(e.target.value)) / 100); setForm({ ...form, variants: u }); }} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-orange-600 shadow-sm" /></div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1"><label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1.5 ml-1">Final Price</label><div className="bg-emerald-100 px-4 py-3 rounded-xl font-black text-emerald-800 text-[11px] shadow-inner text-center">₹{v.offerPrice || 0}</div></div>
                      {form.variants.length > 1 && (
                        <button type="button" onClick={() => setForm((p) => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }))} className="w-9 h-9 flex-shrink-0 bg-red-50 hover:bg-red-500 text-red-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm mb-0.5"><FaTrash size={11} /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual & Health Grid - Full Width Spanning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3"><div className="w-2 h-8 bg-blue-500 rounded-full"></div> Visual Assets</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative aspect-square border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all cursor-pointer group">
                  <input type="file" accept="image/jpeg,image/png" multiple onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" /><FaPlus className="text-emerald-500 group-hover:scale-125 transition-transform" /><span className="text-[9px] font-black text-gray-400 uppercase">Add Photo</span>
                </div>
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square group rounded-[1.5rem] overflow-hidden border shadow-sm ring-2 ring-white hover:ring-emerald-500 transition-all">
                    <img src={img} className="w-full h-full object-cover" alt="p" /><button type="button" onClick={() => { if (img.startsWith("blob:")) setImageFiles((files) => files.filter((_, fileIndex) => fileIndex !== form.images.slice(0, i).filter(image => image.startsWith("blob:")).length)); setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) })); }} className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50/50 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3"><div className="w-2 h-8 bg-emerald-500 rounded-full"></div> Health Analysis Points</h3>
                <button type="button" onClick={() => setForm({ ...form, healthBenefits: [...form.healthBenefits, ""] })} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg flex items-center gap-2"><FaPlus size={10} /> Add Point</button>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[250px] pr-2 scrollbar-thin scrollbar-thumb-emerald-100">
                {form.healthBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-3 group">
                    <div className="flex-1 relative">
                      <FaHeartbeat className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-200 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        value={benefit}
                        onChange={(e) => {
                          const newBenefits = [...form.healthBenefits];
                          newBenefits[idx] = e.target.value;
                          setForm({ ...form, healthBenefits: newBenefits });
                        }}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-xl pl-12 pr-6 py-3 outline-none font-bold text-sm text-gray-800 transition-all shadow-inner"
                        placeholder="e.g. Rich in Omega-3 Fatty Acids"
                      />
                    </div>
                    {form.healthBenefits.length > 1 && (
                      <button type="button" onClick={() => setForm({ ...form, healthBenefits: form.healthBenefits.filter((_, i) => i !== idx) })} className="p-3 bg-red-50 text-red-300 hover:text-red-500 rounded-xl transition-all">
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10 flex justify-end border-t border-gray-100">
          <button type="submit" disabled={loading} className="bg-gradient-to-tr from-emerald-600 to-green-400 px-20 py-5 rounded-3xl text-white font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"> {loading ? (editItem ? "Updating Master Registry..." : "Saving Master Registry...") : (editItem ? "Update Product Details" : "Save Product Details")}</button>
        </div>
      </form>
    </div>
  );
};

const ComboProductForm = ({ categories, onSuccess, combos, products, editItem }) => {
  const [form, setForm] = useState({
    productId: "",
    name: "",
    description: "",
    healthBenefits: [""],
    category: "Combo Packs",
    images: [],
    comboItems: [{ name: "", weight: "", image: "" }],
    comboDetails: { mrp: "", offerPercent: "", offerPrice: "", totalWeight: 0 },
    totalStock: "0",
    totalWeight: 0,
    barcode: "",
    barcodeValue: "",
    rating: 5,
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const barcodeRef = useRef();
  const [manualWeightEdited, setManualWeightEdited] = useState(false);

  const safeParse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try { return JSON.parse(data); } catch { return []; }
  };

  const parseWeightToGrams = (value, defaultUnit = "g") => {
    if (value === null || value === undefined || value === "") return 0;
    const raw = String(value).trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, "");
    if (!raw) return 0;
    const match = raw.match(/^([\d.]+)(kg|k|g|gm|gram|grams)?$/i);
    const amount = Number.parseFloat(match ? match[1] : raw);
    if (!Number.isFinite(amount)) return 0;
    const unit = match ? (match[2] || defaultUnit) : defaultUnit;
    if (["kg", "k", "kilogram", "kilograms"].includes(unit)) return amount * 1000;
    if (["g", "gm", "gram", "grams"].includes(unit)) return amount;
    return amount * (defaultUnit === "kg" ? 1000 : 1);
  };

  const formatWeightDisplay = (grams) => {
    const total = Number(grams || 0);
    if (!Number.isFinite(total) || total <= 0) return "0g";
    if (total >= 1000) {
      const kg = (total / 1000).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
      return `${total}g (${kg}kg)`;
    }
    return `${total}g`;
  };

  const getComboQuantity = () => {
    const n = parseInt(form.totalStock, 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  };

  const calculateComboTotalWeight = (items = []) =>
    items.reduce((sum, item) => sum + parseWeightToGrams(item.weight, "g"), 0);

  const formatKGDisplay = (grams) => {
    const total = Number(grams || 0);
    if (!Number.isFinite(total) || total <= 0) return "0";
    return (total / 1000).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
  };

  const effectiveTotalWeight = calculateComboTotalWeight(form.comboItems);

  useEffect(() => {
    if (editItem) {
      let parsedDetails = editItem.comboDetails;
      if (typeof parsedDetails === 'string') {
        try { parsedDetails = JSON.parse(parsedDetails || '{}'); } catch { parsedDetails = {}; }
      }
      const savedImages = safeParse(editItem.images).filter((image) => typeof image === "string");
      const savedComboItems = safeParse(editItem.comboItems);
      const storedWeightValue = parsedDetails?.totalWeight !== null && parsedDetails?.totalWeight !== undefined
        ? parsedDetails.totalWeight
        : editItem.totalWeight;
      const storedWeight = Number(storedWeightValue ?? 0);
      // Older combo records stored the kilogram input as grams one extra time.
      const resolvedWeight = storedWeight >= 1000000 ? storedWeight / 1000 : storedWeight;
      setForm({
        ...editItem,
        healthBenefits: safeParse(editItem.healthBenefits).length ? safeParse(editItem.healthBenefits) : [""],
        images: savedImages,
        comboItems: savedComboItems.length ? savedComboItems : [{ name: "", weight: "", image: "" }],
        comboDetails: parsedDetails,
        totalWeight: resolvedWeight,
        totalStock: editItem.totalStock !== undefined && editItem.totalStock !== null
          ? String(editItem.totalStock)
          : String(Number.isFinite(effectiveTotalWeight) ? effectiveTotalWeight : 0),
        barcodeValue: editItem.barcodeValue || editItem.productId
      });
      setImageFiles([]);
      setManualWeightEdited(true);
    } else {
      const maxId = combos.reduce((max, c) => {
        const match = c.productId?.match(/\d+/);
        const num = match ? parseInt(match[0]) : 0;
        return Math.max(max, num);
      }, 0);
      setForm((prev) => ({
        ...prev,
        productId: `KPR${String(maxId + 1).padStart(3, "0")}`,
        name: "", description: "", healthBenefits: [""], images: [], totalStock: "0", comboItems: [{ name: "", weight: "", image: "" }], comboDetails: { mrp: "", offerPercent: "", offerPrice: "" }, totalWeight: 0, status: "Active"
      }));
      setImageFiles([]);
      setManualWeightEdited(false);
    }
  }, [editItem, combos]);

  // Removed totalStock calculation based on weight. Stock is now maintained as piece count (PC).

  useEffect(() => {
    if (form.productId && barcodeRef.current) {
      const code = form.barcodeValue || form.productId;
      try {
        JsBarcode(barcodeRef.current, code, { format: "CODE128", lineColor: "#ea580c", width: 2, height: 40, displayValue: true });
        const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
        const base64Data = `data:image/svg+xml;base64,${btoa(svgData)}`;
        if (form.barcode !== base64Data) setForm((prev) => ({ ...prev, barcode: base64Data, barcodeValue: code }));
      } catch (e) { }
    }
  }, [form.productId, form.barcodeValue]);

  const handleImageUpload = async (e) => {
    const rawFiles = Array.from(e.target.files);
    try {
      toast.loading("Uploading...", { id: "up-c" });
      const compressedFiles = await Promise.all(
        rawFiles.map((file) =>
          imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 800, fileType: file.type, useWebWorker: true })
        ),
      );
      setImageFiles((prev) => [...prev, ...compressedFiles]);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...compressedFiles.map(file => URL.createObjectURL(file))] }));
      toast.success("Ready!", { id: "up-c" });
    } catch { toast.error("Fail", { id: "up-c" }); }
    finally { e.target.value = ""; }
  };

  const handleProductSelect = (index, selectedName) => {
    if (!selectedName) {
      const u = [...form.comboItems];
      u[index] = { name: "", weight: "", image: "" };
      setForm({ ...form, comboItems: u });
      return;
    }

    if (selectedName === "custom") {
      const u = [...form.comboItems];
      u[index] = { name: "custom", weight: "", image: "" };
      setForm({ ...form, comboItems: u });
      return;
    }

    const matchedProd = products.find(p => p.name === selectedName);
    if (!matchedProd) {
      const u = [...form.comboItems];
      u[index].name = selectedName;
      setForm({ ...form, comboItems: u });
      return;
    }

    const variants = typeof matchedProd.variants === 'string' ? JSON.parse(matchedProd.variants || '[]') : (matchedProd.variants || []);
    const images = typeof matchedProd.images === 'string' ? JSON.parse(matchedProd.images || '[]') : (matchedProd.images || []);
    const defaultWeight = variants[0]?.weight || "";
    const weightGrams = parseWeightToGrams(defaultWeight, "g");
    const comboQty = getComboQuantity();
    const requiredGrams = comboQty * weightGrams;
    const availableStock = Number(matchedProd.totalStock || 0);

    if (weightGrams > 0 && requiredGrams > availableStock) {
      toast.error(
        `Cannot add "${matchedProd.name}": Required ${formatWeightDisplay(requiredGrams)} (${defaultWeight} × ${comboQty} PC), but only ${formatWeightDisplay(availableStock)} is available in inventory!`,
        { duration: 5000, id: `stock-err-${matchedProd.id || index}` }
      );
      return; // Do not select/add this product
    }

    const u = [...form.comboItems];
    u[index].name = matchedProd.name;
    u[index].weight = defaultWeight;
    u[index].image = images[0] || "";
    setForm({ ...form, comboItems: u });
  };

  const handleWeightSelect = (index, selectedWeight) => {
    const item = form.comboItems[index];
    const matchedProd = products.find(p => p.name === item?.name);
    
    if (matchedProd) {
      const weightGrams = parseWeightToGrams(selectedWeight, "g");
      const comboQty = getComboQuantity();
      const requiredGrams = comboQty * weightGrams;
      const availableStock = Number(matchedProd.totalStock || 0);

      if (weightGrams > 0 && requiredGrams > availableStock) {
        toast.error(
          `Cannot select ${selectedWeight} for "${matchedProd.name}": Required ${formatWeightDisplay(requiredGrams)} (${selectedWeight} × ${comboQty} PC), but only ${formatWeightDisplay(availableStock)} is available in inventory!`,
          { duration: 5000, id: `stock-weight-err-${matchedProd.id || index}` }
        );
        return; // Do not apply weight change
      }
    }

    const u = [...form.comboItems];
    u[index].weight = selectedWeight;
    setForm({ ...form, comboItems: u });
  };

  const handleStockChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, totalStock: val }));

    const newQty = parseInt(val, 10);
    if (Number.isFinite(newQty) && newQty > 0) {
      for (const item of form.comboItems) {
        if (!item.name || item.name === "custom" || !item.weight) continue;
        const matched = products.find(p => p.name === item.name);
        if (matched) {
          const itemWeightGrams = parseWeightToGrams(item.weight, "g");
          const needed = newQty * itemWeightGrams;
          const available = Number(matched.totalStock || 0);
          if (itemWeightGrams > 0 && needed > available) {
            toast.error(
              `Warning: "${matched.name}" stock deficit! Requires ${formatWeightDisplay(needed)} (${item.weight} × ${newQty} PC), but only ${formatWeightDisplay(available)} available.`,
              { duration: 4000, id: `stock-warn-${matched.id}` }
            );
            break;
          }
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericTotalStock = Number(form.totalStock ?? 0);
    const comboQty = numericTotalStock > 0 ? numericTotalStock : 0;

    // Check constituent products stock before submitting
    if (comboQty > 0) {
      const requiredPerProduct = {};
      for (const item of form.comboItems) {
        if (!item.name || item.name === "custom" || !item.weight) continue;
        const matched = products.find(p => p.name === item.name);
        if (matched) {
          const itemWeightGrams = parseWeightToGrams(item.weight, "g");
          const totalNeeded = comboQty * itemWeightGrams;
          requiredPerProduct[matched.name] = {
            needed: (requiredPerProduct[matched.name]?.needed || 0) + totalNeeded,
            available: Number(matched.totalStock || 0),
            productName: matched.name,
            weight: item.weight
          };
        }
      }

      for (const req of Object.values(requiredPerProduct)) {
        if (req.needed > req.available) {
          toast.error(
            `Cannot save combo! Insufficient stock for "${req.productName}". Required: ${formatWeightDisplay(req.needed)} (${comboQty} PC), but only ${formatWeightDisplay(req.available)} is available in inventory!`,
            { duration: 6000 }
          );
          return;
        }
      }
    }

    setLoading(true);
    try {
      const submitData = {
        ...form,
        totalStock: Number.isFinite(numericTotalStock) ? numericTotalStock : 0,
        comboDetails: {
          ...form.comboDetails,
          offerPrice: form.comboDetails.offerPrice || 0,
          mrp: form.comboDetails.mrp || 0,
        },
      };
      const formData = new FormData();
      Object.entries({
        ...submitData,
        healthBenefits: JSON.stringify(submitData.healthBenefits),
        images: JSON.stringify(submitData.images.filter((image) => typeof image === "string" && !image.startsWith("blob:"))),
        comboItems: JSON.stringify(submitData.comboItems),
        comboDetails: JSON.stringify(submitData.comboDetails),
      }).forEach(([key, value]) => formData.append(key, value ?? ""));
      imageFiles.forEach(file => formData.append("images", file));

      if (editItem) {
        await api.put(`/combos/${editItem.id}`, formData);
        toast.success("Combo Registry Updated");
      } else {
        await api.post("/combos", formData);
        toast.success("Pack Registered");
      }
      onSuccess();
    } catch (err) { 
      toast.error(err.response?.data?.message || "Submission Failure"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-amber-100 ring-1 ring-amber-50">
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-400 p-10 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div><h2 className="text-3xl font-black uppercase tracking-tight">Combo Studio</h2><p className="opacity-90 font-medium mt-1 text-amber-50 uppercase tracking-[0.2em] text-xs">Premium Pack Creation</p></div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30"><span className="font-black tracking-widest text-sm">{form.productId}</span></div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-10 space-y-10">
        <div className="space-y-12">
          {/* Pack Identity - Full Width */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50/50">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3"><div className="w-2 h-8 bg-amber-500 rounded-full"></div> Pack Identity & Scope</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Combo Pack Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 font-bold text-gray-900 shadow-sm" placeholder="e.g. Healthy Morning Combo" /></div>
                <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Description *</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows="4" className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 outline-none resize-none font-medium text-gray-700 shadow-sm" placeholder="Describe pack contents..." /></div>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[2rem] border border-dashed border-amber-200 shadow-inner flex flex-col items-center justify-center relative group min-h-[160px]">
                  <div className="absolute top-4 left-6"><span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Pack Barcode</span></div>
                  <div className="mt-4"><svg ref={barcodeRef}></svg></div>
                  <p className="mt-3 text-[9px] font-bold text-gray-400 font-mono tracking-widest">{form.productId}</p>
                </div>
                <div className="bg-amber-50/30 p-6 rounded-[2rem] border border-amber-100">
                  <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4">Combo Strategy Registry</h4>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-white p-3 rounded-xl border border-amber-100 text-center shadow-sm"><p className="text-[9px] font-black text-gray-400 uppercase">Items</p><p className="text-xl font-black text-amber-600">{form.comboItems.length}</p></div>
                    <div className="flex-1 bg-white p-3 rounded-xl border border-amber-100 text-center shadow-sm">
                      <p className="text-[9px] font-black text-gray-400 uppercase">Total Weight</p>
                      <p className="text-sm font-black text-amber-600">{form.totalWeight >= 1000 ? (form.totalWeight / 1000).toFixed(2) + "kg" : form.totalWeight + "g"}</p>
                    </div>
                  </div>
                  {/* Weight breakdown per item */}
                  {form.comboItems.some(item => item.weight) && (
                    <div className="bg-white rounded-xl border border-amber-100 p-3 mb-3">
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-2">Weight Breakdown & Stock Status</p>
                      <div className="space-y-1">
                        {form.comboItems.map((item, idx) => {
                          if (!item.weight) return null;
                          const inGrams = parseWeightToGrams(item.weight, "g");
                          const matched = products.find(p => p.name === item.name);
                          const comboQty = getComboQuantity();
                          const needed = comboQty * inGrams;
                          const available = matched ? Number(matched.totalStock || 0) : null;
                          const hasDeficit = matched && needed > available;
                          return (
                            <div key={idx} className={`flex justify-between items-center text-[10px] p-1 rounded ${hasDeficit ? "bg-red-50 text-red-700 font-bold" : ""}`}>
                              <span className="text-gray-600 truncate max-w-[120px]">{item.name || `Item ${idx+1}`}</span>
                              <div className="text-right">
                                <span className={hasDeficit ? "font-black text-red-700" : "font-black text-amber-700"}>
                                  {item.weight} = {inGrams}g
                                </span>
                                {hasDeficit && (
                                  <span className="block text-[8px] text-red-600 font-black">
                                    ⚠️ Deficit: Short by {formatWeightDisplay(needed - available)}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div className="border-t border-dashed border-amber-200 mt-1 pt-1 flex justify-between text-[10px]">
                          <span className="font-black text-amber-900">Total Pack Weight</span>
                          <span className="font-black text-amber-900">{effectiveTotalWeight}g {effectiveTotalWeight >= 1000 ? `(${formatKGDisplay(effectiveTotalWeight)}kg)` : ""}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Status *</label><CustomSelect value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full" buttonClassName="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-4 py-2.5 outline-none font-black text-emerald-800 shadow-sm text-sm" options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} /></div>
                    <div className="hidden"></div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      Available Quantity (PC) *
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={form.totalStock}
                        onChange={handleStockChange}
                        required
                        min="0"
                        step="1"
                        className="w-full rounded-xl px-4 py-2.5 font-black border-2 shadow-sm outline-none transition-all text-sm bg-orange-50 border-orange-300 text-orange-700 focus:border-orange-400"
                        placeholder="Enter whole numbers, e.g. 50"
                      />
                      <span className="-ml-16 mr-4 pointer-events-none font-black text-sm text-orange-500">PC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3"><div className="w-2 h-8 bg-orange-500 rounded-full"></div> Pack Photography</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative aspect-square border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-amber-200 hover:bg-amber-50/20 transition-all cursor-pointer group">
                  <input type="file" accept="image/jpeg,image/png" multiple onChange={handleImageUpload} className="absolute inset-0 opacity-0" /><FaPlus className="text-amber-500 group-hover:scale-125 transition-transform" /><span className="text-[9px] font-black text-gray-400 uppercase">Upload</span>
                </div>
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square group rounded-[1.5rem] overflow-hidden border shadow-sm ring-4 ring-white hover:ring-amber-500 transition-all">
                    <img src={img} className="w-full h-full object-cover" alt="p" /><button type="button" onClick={() => { if (img.startsWith("blob:")) setImageFiles((files) => files.filter((_, fileIndex) => fileIndex !== form.images.slice(0, i).filter(image => image.startsWith("blob:")).length)); setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) })); }} className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50/50 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3"><div className="w-2 h-8 bg-amber-500 rounded-full"></div> Health Analysis Points</h3>
                <button type="button" onClick={() => setForm({ ...form, healthBenefits: [...form.healthBenefits, ""] })} className="bg-amber-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg flex items-center gap-2">Add Point</button>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[250px] pr-2 scrollbar-thin scrollbar-thumb-amber-100">
                {form.healthBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-3 group">
                    <input
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...form.healthBenefits];
                        newBenefits[idx] = e.target.value;
                        setForm({ ...form, healthBenefits: newBenefits });
                      }}
                      className="flex-1 bg-gray-50 border-2 border-transparent focus:border-amber-500 rounded-xl px-5 py-3 outline-none font-bold text-sm text-gray-800 transition-all shadow-inner"
                      placeholder="e.g. Immunity Support Factor"
                    />
                    {form.healthBenefits.length > 1 && (
                      <button type="button" onClick={() => setForm({ ...form, healthBenefits: form.healthBenefits.filter((_, i) => i !== idx) })} className="p-3 bg-red-50 text-red-300 hover:text-red-500 rounded-xl transition-all">
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-50/50 flex flex-col">
              <div className="flex justify-between items-center mb-10"><h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3"><div className="w-2 h-8 bg-blue-500 rounded-full"></div> Included Range</h3><button type="button" onClick={() => setForm((p) => ({ ...p, comboItems: [...p.comboItems, { name: "", weight: "" }] }))} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"><FaPlus size={10} /> Add Item</button></div>
              <div className="space-y-4">
                {form.comboItems.map((item, i) => {
                  const matchedProd = products.find(p => p.name === item.name);
                  const variants = matchedProd ? (typeof matchedProd.variants === 'string' ? JSON.parse(matchedProd.variants || '[]') : (matchedProd.variants || [])) : [];
                  const itemWeightGrams = parseWeightToGrams(item.weight, "g");
                  const comboQty = getComboQuantity();
                  const neededGrams = comboQty * itemWeightGrams;
                  const availableStock = matchedProd ? Number(matchedProd.totalStock || 0) : null;
                  const isItemDeficit = matchedProd && neededGrams > 0 && neededGrams > availableStock;

                  return (
                    <div key={i} className={`grid grid-cols-[auto_minmax(0,1fr)_minmax(7rem,8rem)_auto] gap-4 items-center p-5 rounded-3xl border transition-all group shadow-sm ${isItemDeficit ? "bg-red-50/50 border-red-300 ring-2 ring-red-100" : "bg-gray-50/50 border-gray-100 hover:bg-white hover:border-blue-100"}`}>
                      <div className="relative w-14 h-14 bg-white rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 group/img">
                        {item.image ? (
                          <img src={item.image} alt="p" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200"><FaBoxOpen size={16} /></div>
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if(!file) return;
                              try {
                                const compressed = await imageCompression(file, { maxSizeMB: 0.05, maxWidthOrHeight: 300, fileType: file.type, useWebWorker: true });
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const u = [...form.comboItems];
                                  u[i].image = reader.result;
                                  setForm({ ...form, comboItems: u });
                                };
                                reader.readAsDataURL(compressed);
                              } catch (err) { toast.error("Upload failed"); }
                              finally { e.target.value = ""; }
                            }}
                          />
                          <FaEdit className="text-white text-xs" />
                        </label>
                      </div>
                      <div className="min-w-0 relative">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Item Identity</label>
                          {matchedProd && (
                            <span className="ml-2 shrink-0 text-[9px] font-bold text-gray-500">
                              Stock: <strong className={availableStock > 0 ? "text-emerald-700" : "text-red-600"}>{formatWeightDisplay(availableStock)}</strong>
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <CustomSelect 
                            value={item.name} 
                            onChange={(e) => handleProductSelect(i, e.target.value)} 
                            className="w-full"
                            buttonClassName="w-full outline-none font-black bg-transparent text-gray-900 border-none p-0 focus:ring-0 cursor-pointer text-xs"
                            placeholder="Choose Existing Product"
                            searchable={true}
                            options={[
                              { value: "", label: "Choose Existing Product" },
                              ...products.map((p) => {
                                const s = Number(p.totalStock || 0);
                                const sLabel = s > 0 ? formatWeightDisplay(s) : "Out of Stock";
                                return {
                                  value: p.name,
                                  label: `${p.name} — ${p.productId} [${sLabel}]`,
                                };
                              }),
                              { value: "custom", label: "-- Custom Item --" },
                            ]}
                          />
                        </div>
                        {matchedProd && item.weight && (
                          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-medium text-gray-500">
                              Need: <span className={isItemDeficit ? "font-black text-red-600" : "font-bold text-blue-700"}>{formatWeightDisplay(neededGrams)} ({item.weight} × {comboQty} PC)</span>
                            </span>
                            {isItemDeficit && (
                              <span className="bg-red-600 text-white px-2 py-0.5 rounded-full font-black text-[8px] animate-pulse">
                                ⚠️ Deficit: Short by {formatWeightDisplay(neededGrams - availableStock)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 w-full border-l border-gray-100 pl-5 flex flex-col">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Weight</label>
                        {variants.length > 0 ? (
                          <div className="relative">
                            <CustomSelect 
                              value={item.weight}
                              onChange={(e) => handleWeightSelect(i, e.target.value)}
                              className="w-full"
                              buttonClassName="w-full outline-none text-blue-600 font-black bg-transparent border-none p-0 focus:ring-0 cursor-pointer text-xs"
                              placeholder="Select"
                              options={variants.map((v) => ({
                                value: v.weight,
                                label: v.weight,
                              }))}
                            />
                          </div>
                        ) : (
                          <input 
                            placeholder="Weight" 
                            value={item.weight} 
                            onChange={(e) => handleWeightSelect(i, e.target.value)} 
                            className="w-full outline-none text-blue-600 font-black bg-transparent border-none p-0 focus:ring-0 text-xs placeholder:text-gray-300"
                          />
                        )}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setForm((p) => ({ ...p, comboItems: p.comboItems.filter((_, idx) => idx !== i) }))} 
                        className="p-3 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-amber-50/50 p-8 rounded-[3rem] border border-amber-100 shadow-xl overflow-hidden relative">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/40 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="mb-10"><h3 className="text-xl font-black text-amber-900 uppercase tracking-tight">Financial Summary</h3><div className="w-12 h-1.5 bg-amber-500 mt-1 rounded-full"></div></div>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div><label className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 block ml-1">Market MRP (₹)</label><input type="number" placeholder="e.g. 1500" value={form.comboDetails.mrp} onChange={(e) => { const u = { ...form.comboDetails }; u.mrp = e.target.value; u.offerPrice = Math.round(Number(u.mrp) - (Number(u.mrp) * Number(u.offerPercent)) / 100); setForm({ ...form, comboDetails: u }); }} className="w-full bg-white border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 font-black shadow-sm" /></div>
                    <div><label className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 block ml-1">Special Discount %</label><input type="number" placeholder="e.g. 15" value={form.comboDetails.offerPercent} onChange={(e) => { const u = { ...form.comboDetails }; u.offerPercent = e.target.value; u.offerPrice = Math.round(Number(u.mrp) - (Number(u.mrp) * Number(u.offerPercent)) / 100); setForm({ ...form, comboDetails: u }); }} className="w-full bg-white border-2 border-transparent focus:border-amber-500 rounded-2xl px-6 py-4 font-black shadow-sm" /></div>
                  </div>
                  <div className="bg-gradient-to-br from-white to-amber-50 p-8 rounded-[2.5rem] border-2 border-amber-200 shadow-2xl relative group">
                    <label className="text-[11px] font-black text-amber-600 uppercase tracking-[0.25em] mb-2 block">Premium Strategy Price</label>
                    <div className="text-5xl font-black text-amber-900 flex items-baseline gap-2 transition-transform group-hover:scale-105 duration-500"><span className="text-2xl font-medium opacity-50">₹</span>{form.comboDetails.offerPrice || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-10 flex justify-end">
          <button type="submit" disabled={loading} className="bg-gradient-to-tr from-amber-600 to-orange-400 px-24 py-5 rounded-[2rem] text-white font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"> {loading ? (editItem ? "Updating Entry..." : "Executing Entry...") : (editItem ? "Update Premium Combo" : "Finalize Premium Combo")}</button>
        </div>
      </form>
    </div>
  );
};

export default Products;
