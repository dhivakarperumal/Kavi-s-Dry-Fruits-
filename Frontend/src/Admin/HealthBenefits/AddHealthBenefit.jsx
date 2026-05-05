import React, { useState, useEffect } from "react";
import { 
  FaPlus, FaTrash, FaImage, FaVideo, FaUtensils, 
  FaSave, FaTimes, FaSearch, FaHeartbeat
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import imageCompression from "browser-image-compression";

const AddHealthBenefit = ({ editItem, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const [form, setForm] = useState({
    productId: "",
    productName: "",
    category: "",
    shortDescription: "",
    detailedDescription: "",
    benefits: [{ title: "", description: "" }],
    images: [],
    videos: [{ type: "link", value: "" }],
    howToEat: "",
    howToStore: "",
  });

  useEffect(() => {
    fetchProducts();
    if (editItem) {
      setForm({
        ...editItem,
        benefits: editItem.benefits || [{ title: "", description: "" }],
        images: editItem.images || [],
        videos: editItem.videos || [{ type: "link", value: "" }],
      });
    }
  }, [editItem]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products for selection");
    }
  };

  const handleProductSelect = (product) => {
    setForm({
      ...form,
      productId: product.productId || product.id,
      productName: product.name,
      category: product.category,
    });
    setSearchQuery(product.name);
    setShowProductDropdown(false);
  };

  const handleAddField = (field) => {
    if (field === "benefits") {
      setForm({ ...form, benefits: [...form.benefits, { title: "", description: "" }] });
    } else if (field === "videos") {
      setForm({ ...form, videos: [...form.videos, { type: "link", value: "" }] });
    }
  };

  const handleRemoveField = (field, index) => {
    const updated = [...form[field]];
    updated.splice(index, 1);
    setForm({ ...form, [field]: updated });
  };

  const handleFieldChange = (field, index, key, value) => {
    const updated = [...form[field]];
    updated[index][key] = value;
    setForm({ ...form, [field]: updated });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);
    const toastId = toast.loading("Processing images...");

    try {
      const options = {
        maxSizeMB: 0.2, // ~200KB
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedImages = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await imageCompression(file, options);
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => resolve(reader.result);
          });
        })
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...compressedImages],
      }));
      toast.success("Images added successfully!", { id: toastId });
    } catch (error) {
      console.error("Image compression error:", error);
      toast.error("Failed to process images", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit to 50MB
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video file is too large (Maximum 50MB)");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing video file...");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const updated = [...form.videos];
        updated[index].value = reader.result;
        setForm({ ...form, videos: updated });
        toast.success("Video file uploaded!", { id: toastId });
        setLoading(false);
      };
    } catch (err) {
      toast.error("Failed to process video", { id: toastId });
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!form.productId || !form.productName) return "Product name is required";
    if (!form.shortDescription) return "Short Description is required";
    if (form.benefits.length === 0 || !form.benefits[0].title) return "At least one Health Benefit is required";
    

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    const toastId = toast.loading(editItem ? "Updating Health Benefit..." : "Saving Health Benefit...");

    try {
      const dataToSave = {
        ...form,
        updatedAt: new Date().toISOString(),
      };

      if (editItem) {
        await api.put(`/health-benefits/${editItem.id}`, dataToSave);
        toast.success("Health Benefit updated successfully!", { id: toastId });
        if (onSuccess) onSuccess();
      } else {
        await api.post("/health-benefits", {
          ...dataToSave,
          createdAt: new Date().toISOString(),
        });
        toast.success("Health Benefit saved successfully!", { id: toastId });
        if (onSuccess) {
          onSuccess();
        } else {
          // Reset form if no onSuccess provided (fallback)
          setForm({
            productId: "",
            productName: "",
            category: "",
            shortDescription: "",
            detailedDescription: "",
            benefits: [{ title: "", description: "" }],
            images: [],
            videos: [{ type: "link", value: "" }],
            howToEat: "",
            howToStore: "",
          });
          setSearchQuery("");
        }
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error(error.response?.data?.message || "Failed to save data to database", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.productId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-emerald-100 animate-in fade-in duration-500 max-w-6xl mx-auto my-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <FaHeartbeat className="animate-pulse" />
            {editItem ? "Edit Health Benefit" : "Add Health Benefit"}
          </h2>
          <p className="opacity-90 font-medium mt-1 uppercase tracking-[0.2em] text-xs">
            {editItem ? `Updating ${form.productName}` : "Create a new health profile for a product"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12 bg-gray-50/30">
        
        {/* Basic Product Info Section */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 space-y-8">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div> 1. Basic Product Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Product Name *</label>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onFocus={() => setShowProductDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowProductDropdown(true);
                  }}
                  placeholder="Search and select product..."
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl pl-12 pr-6 py-4 outline-none font-bold text-gray-900 shadow-sm transition-all"
                />
                
                {showProductDropdown && filteredProducts.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                    {filteredProducts.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => handleProductSelect(p)}
                        className="px-6 py-4 hover:bg-emerald-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                      >
                        <p className="font-bold text-gray-800">{p.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{p.productId} • {p.category}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Category</label>
              <input 
                type="text" 
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Product category"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none font-bold text-gray-900 shadow-sm transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Short Description *</label>
              <textarea 
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                rows="2"
                placeholder="A brief summary of health value..."
                className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none font-medium text-gray-700 shadow-sm transition-all resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Detailed Description</label>
              <textarea 
                value={form.detailedDescription}
                onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })}
                rows="5"
                placeholder="More in-depth health information..."
                className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none font-medium text-gray-700 shadow-sm transition-all resize-none"
              />
            </div>
          </div>
        </section>

        {/* Health Benefits Dynamic Section */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-pink-500 rounded-full"></div> 2. Health Benefits (Dynamic)
            </h3>
            <button 
              type="button" 
              onClick={() => handleAddField("benefits")}
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              <FaPlus /> Add More Benefits
            </button>
          </div>

          <div className="space-y-6">
            {form.benefits.map((benefit, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 relative group animate-in slide-in-from-right duration-300">
                <button 
                  type="button" 
                  onClick={() => handleRemoveField("benefits", idx)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes size={12} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Benefit Title</label>
                    <input 
                      type="text" 
                      value={benefit.title}
                      onChange={(e) => handleFieldChange("benefits", idx, "title", e.target.value)}
                      placeholder="e.g. Heart Health"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold shadow-sm outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Benefit Description</label>
                    <textarea 
                      value={benefit.description}
                      onChange={(e) => handleFieldChange("benefits", idx, "description", e.target.value)}
                      placeholder="Explain how it helps..."
                      rows="1"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium shadow-sm outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Media Upload Section */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 space-y-8">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div> 3. Media Upload Section
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Upload */}
            <div className="space-y-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-2">
                <FaImage className="text-blue-500" /> Imagery (Photos)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="relative aspect-square border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-2 hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer group">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <FaPlus className="text-blue-500 group-hover:scale-125 transition-transform" />
                  <span className="text-[9px] font-black text-gray-400 uppercase">Add Photo</span>
                </div>
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square group rounded-[2rem] overflow-hidden border shadow-sm ring-2 ring-white hover:ring-blue-500 transition-all">
                    <img src={img} className="w-full h-full object-cover" alt="p" />
                    <button 
                      type="button" 
                      onClick={() => {
                        const updated = [...form.images];
                        updated.splice(i, 1);
                        setForm({ ...form, images: updated });
                      }}
                      className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Upload Logic Restore */}
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-2">
                     <FaVideo className="text-red-500" /> Video Section (Link / Upload)
                  </label>
                  <button 
                     type="button" 
                     onClick={() => handleAddField("videos")}
                     className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                  >
                     + Add Video
                  </button>
               </div>
               <div className="space-y-4">
                  {form.videos.map((vid, i) => (
                     <div key={i} className="bg-gray-50 p-4 rounded-3xl border border-gray-100 space-y-4 relative group">
                        <button 
                           type="button" 
                           onClick={() => handleRemoveField("videos", i)}
                           className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                           <FaTimes size={10} />
                        </button>
                        <div className="flex gap-2">
                           {['link', 'upload'].map(t => (
                              <button 
                                 key={t}
                                 type="button" 
                                 onClick={() => handleFieldChange("videos", i, "type", t)}
                                 className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${vid.type === t ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                              >
                                 {t === 'link' ? 'Paste Link' : 'Upload File'}
                              </button>
                           ))}
                        </div>
                        {vid.type === 'link' ? (
                           <input 
                              type="text" 
                              value={vid.value}
                              onChange={(e) => handleFieldChange("videos", i, "value", e.target.value)}
                              placeholder="YouTube / MP4 / Vimeo Link..."
                              className="w-full bg-white border-2 border-transparent focus:border-red-500 rounded-2xl px-5 py-3 text-xs font-bold outline-none shadow-sm transition-all"
                           />
                        ) : (
                           <div className="relative h-14 bg-white border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center group/vid transition-all hover:border-red-300">
                              <input 
                                 type="file" 
                                 accept="video/*"
                                 onChange={(e) => handleVideoUpload(e, i)}
                                 className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                 {vid.value ? <span className="text-emerald-500">Video Added ✓</span> : "Select Video File"}
                              </p>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* How to Eat & Store Section */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 space-y-8">
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-teal-500 rounded-full"></div> 5. Usage & Storage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-2">
                <FaUtensils className="text-teal-500" /> How to Eat
              </label>
              <textarea 
                value={form.howToEat}
                onChange={(e) => setForm({ ...form, howToEat: e.target.value })}
                rows="4"
                placeholder="Consumption instructions (bullet points allowed)..."
                className="w-full bg-gray-50 border-2 border-transparent focus:border-teal-500 rounded-2xl px-6 py-4 outline-none font-medium text-gray-700 shadow-sm transition-all resize-none"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-2">
                <FaSave className="text-teal-500" /> How to Store
              </label>
              <textarea 
                value={form.howToStore}
                onChange={(e) => setForm({ ...form, howToStore: e.target.value })}
                rows="4"
                placeholder="Storage instructions (bullet points allowed)..."
                className="w-full bg-gray-50 border-2 border-transparent focus:border-teal-500 rounded-2xl px-6 py-4 outline-none font-medium text-gray-700 shadow-sm transition-all resize-none"
              />
            </div>
          </div>
        </section>


        {/* Form Actions */}
        <div className="pt-10 flex flex-col md:flex-row justify-end items-center gap-6 border-t border-gray-100">
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="px-10 py-5 rounded-3xl text-gray-500 font-black uppercase tracking-widest text-sm hover:bg-gray-100 transition-all flex items-center gap-3"
            >
              <FaTimes /> {editItem ? "Cancel Edit" : "Discard"}
            </button>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-gradient-to-tr from-emerald-600 to-green-400 px-24 py-5 rounded-[2.5rem] text-white font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-4"
          >
            {loading ? "Syncing Workspace..." : editItem ? "Update Profile" : "Finalize Profile"} 
            {!loading && <FaSave />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHealthBenefit;
