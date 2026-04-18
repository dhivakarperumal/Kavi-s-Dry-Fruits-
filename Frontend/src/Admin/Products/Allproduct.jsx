import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaStar, FaPlus, FaFilter, FaEdit, FaTrash, FaEye, 
  FaBoxOpen, FaLayerGroup, FaThLarge, FaListUl, FaSearch,
  FaBarcode, FaPrint, FaChevronRight, FaImage,FaBars
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../services/api";
import JsBarcode from "jsbarcode";

const Allproduct = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [viewMode, setViewMode] = useState("card");

  const [categoryFilter, setCategoryFilter] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState("All");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState([]);
  const [weights, setWeights] = useState([]);
  const [tags, setTags] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);

  const [showFilters, setShowFilters] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "card" ? 12 : 15;

  const safeParse = (data) => {
    if (!data) return [];
    if (typeof data === "object") return data; // Handles both arrays and objects
    try { 
      const parsed = JSON.parse(data);
      return typeof parsed === "object" ? parsed : [];
    } catch { 
      return []; 
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const [prodRes, comboRes] = await Promise.all([
        api.get("/products"),
        api.get("/combos"),
      ]);
      const unified = [
        ...prodRes.data.map(p => ({ ...p, type: 'single' })),
        ...comboRes.data.map(c => ({ ...c, type: 'combo' }))
      ];
      setItems(unified);
      setFilteredItems(unified);
      setCategories([...new Set(unified.map(p => p.category).filter(Boolean))]);
      const allWeights = unified.flatMap(item => {
        if (item.type === 'single') return safeParse(item.variants).map(v => v.weight);
        return ['Combo Pack'];
      });
      setWeights([...new Set(allWeights.filter(Boolean))]);
      setTags([...new Set(unified.flatMap(item => item.tags || []).filter(Boolean))]);
      const allPrices = unified.flatMap(item => {
        if (item.type === 'single') return safeParse(item.variants).map(v => Number(v.offerPrice) || 0);
        const details = typeof item.comboDetails === 'object' ? item.comboDetails : safeParse(item.comboDetails);
        return [Number(details?.offerPrice) || 0];
      });
      const maxP = Math.max(...allPrices, 1000);
      setMaxPrice(maxP);
      if (priceRange[1] === 5000) setPriceRange([0, maxP]);
    } catch { toast.error("Failed to load products"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    let filtered = [...items];
    if (search.trim()) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.productId.toLowerCase().includes(search.toLowerCase()));
    }
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(p => categoryFilter.includes(p.category));
    }
    if (selectedWeight !== "All") {
      filtered = filtered.filter(p => p.type === 'single' ? safeParse(p.variants).some(v => v.weight === selectedWeight) : selectedWeight === "Combo Pack");
    }
    if (selectedRating > 0) {
      filtered = filtered.filter(p => (Number(p.rating) || 0) >= selectedRating);
    }
    if (selectedTag !== "All") {
      filtered = filtered.filter(p => (p.tags || []).includes(selectedTag));
    }
    filtered = filtered.filter(p => {
      const details = p.type === 'single' ? safeParse(p.variants)[0] : (typeof p.comboDetails === 'object' ? p.comboDetails : safeParse(p.comboDetails));
      let price = Number(details?.offerPrice) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [search, categoryFilter, selectedWeight, selectedRating, selectedTag, priceRange, items]);

  const clearFilters = () => {
    setCategoryFilter([]);
    setSelectedWeight("All");
    setSelectedRating(0);
    setSelectedTag("All");
    setPriceRange([0, maxPrice]);
    setSearch("");
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    try {
      await api.delete(`${item.type === 'single' ? "/products" : "/combos"}/${item.id}`);
      toast.success("Deleted");
      fetchItems();
    } catch { toast.error("Delete failed"); }
  };

  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePrintAll = () => {
    if (filteredItems.length === 0) {
      toast.error("No products to print");
      return;
    }
    setLoading(true);
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
          <title>Print All Barcodes</title>
          <style>
            @page { size: auto; margin: 5mm; }
            body { font-family: 'Segoe UI', Arial; margin: 0; padding: 5mm; background: white; }
            .sticker-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
            .sticker-card { border: 0.5px solid #eee; padding: 10px; text-align: center; border-radius: 8px; }
            .barcode-svg { width: 100%; max-height: 60px; }
            .product-name { font-weight: bold; font-size: 10px; margin-bottom: 5px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
            .price-tag { font-weight: 900; font-size: 14px; margin-top: 5px; }
          </style>
        </head>
        <body><div class="sticker-grid">
    `);
    filteredItems.forEach((item) => {
      const barcodeValue = item.barcode || item.barcodeValue || item.productId;
      const canvas = document.createElement("canvas");
      try {
        JsBarcode(canvas, barcodeValue, { format: "CODE128", width: 2, height: 50, displayValue: false });
        const barcodeDataUrl = canvas.toDataURL("image/png");
        const details = typeof item.comboDetails === 'object' ? item.comboDetails : safeParse(item.comboDetails);
        const price = details?.offerPrice || details?.price || '—';
        doc.write(`
          <div class="sticker-card">
            <div class="product-name">${item.name}</div>
            <div style="font-size: 8px; color: #666; font-weight: bold; margin-bottom: 4px;">ID: ${item.productId}</div>
            <img src="${barcodeDataUrl}" class="barcode-svg" onload="this.setAttribute('loaded', 'true')"/>
            <div class="price-tag">₹${price}</div>
          </div>
        `);
      } catch (e) { console.error("Barcode fail for", item.name); }
    });
    doc.write(`</div></body></html>`);
    doc.close();
    const waitForLoad = () => {
      const imgs = doc.querySelectorAll('img');
      const allDone = Array.from(imgs).every(img => img.getAttribute('loaded') === 'true');
      if (allDone || imgs.length === 0) {
        setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); setLoading(false); document.body.removeChild(iframe); toast.success("Print jobs sent"); }, 1000);
      } else { setTimeout(waitForLoad, 100); }
    };
    waitForLoad();
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto mt-0">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 pr-4">
             {/* Left: Search Bar */}
             <div className="relative w-full max-w-xl">
               <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                 type="text"
                 placeholder="Search products by identity..."
                 value={search}
                 onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
                 className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-black text-black text-sm"
               />
             </div>
          </div>

          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === "card" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-emerald-600"}`}
                >
                  <FaThLarge size={14} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === "table" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-emerald-600"}`}
                >
                  <FaBars size={14} />
                </button>
             </div>

             <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs transition-all border uppercase tracking-widest ${showFilters ? 'bg-emerald-900 text-white border-emerald-900 shadow-xl' : 'bg-white text-slate-600 border-gray-100 hover:border-emerald-200 shadow-sm'}`}
             >
                <FaFilter size={12} className={showFilters ? 'animate-pulse' : ''} /> Filters
             </button>

             <button 
                onClick={handlePrintAll}
                className="flex items-center gap-2 px-6 py-3.5 bg-white border border-emerald-200 text-emerald-600 rounded-2xl font-black text-xs transition-all hover:bg-emerald-50 shadow-sm uppercase tracking-widest"
             >
                <FaPrint size={12} /> Barcodes
             </button>

             <button
               onClick={() => navigate('/adminpanel/products')}
               className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest"
             >
               <FaPlus size={12} /> Add New
             </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-full lg:w-72 flex-shrink-0 animate-in slide-in-from-left duration-500">
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-8 sticky top-32">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                     <p className="font-black text-slate-950 uppercase tracking-widest text-xs">Refine Registry</p>
                     <button onClick={clearFilters} className="text-[10px] font-black text-red-500 uppercase">Clear</button>
                  </div>

                  {/* Categories */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Departments</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={categoryFilter.includes(cat)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              if (checked) setCategoryFilter([...categoryFilter, cat]);
                              else setCategoryFilter(categoryFilter.filter((c) => c !== cat));
                            }}
                            className="h-5 w-5 rounded-lg border-gray-200 text-emerald-600 focus:ring-emerald-500/20"
                          />
                          <span className="text-xs font-black text-slate-700 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Weight Radio */}
                  <div className="space-y-4 pt-4 border-t border-gray-50">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Weight Class</p>
                    <div className="space-y-2">
                       {['All', ...weights].map((w) => (
                          <label key={w} className="flex items-center gap-3 cursor-pointer group">
                             <input 
                                type="radio" 
                                name="weight" 
                                checked={selectedWeight === w} 
                                onChange={() => setSelectedWeight(w)} 
                                className="h-5 w-5 text-emerald-600 border-gray-200 focus:ring-emerald-500/20"
                             />
                             <span className="text-xs font-black text-slate-700 tracking-tight">{w} {w === 'All' ? '' : ''}</span>
                          </label>
                       ))}
                    </div>
                  </div>

                  {/* Price Slider */}
                  <div className="space-y-4 pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                       <span>Price (₹)</span>
                       <span className="bg-emerald-50 px-2 py-0.5 rounded text-emerald-700">₹{priceRange[1]}</span>
                    </div>
                    <input type="range" min={0} max={maxPrice} value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full accent-emerald-500 h-1.5 bg-slate-100 rounded-full cursor-pointer appearance-none" />
                  </div>
               </div>
            </div>
          )}

          {/* Catalog Grid/Table */}
          <div className="flex-1">
             {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                   {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-64 bg-white border border-gray-100 rounded-[2.5rem] animate-pulse" />)}
                </div>
             ) : (
                <>
                   {viewMode === "card" ? (
                      <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFilters ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6 animate-in fade-in zoom-in-95 duration-500`}>
                         {currentItems.map((item) => {
                            const images = safeParse(item.images);
                            const isCombo = item.type === 'combo';
                            const details = isCombo ? (typeof item.comboDetails === 'object' ? item.comboDetails : safeParse(item.comboDetails)) : safeParse(item.variants)[0];
                            const price = details?.offerPrice || details?.price;
                            const mrp = details?.mrp;

                            return (
                               <div key={`${item.type}-${item.id}`} className="group bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all relative overflow-hidden flex flex-col h-full">
                                  {/* Image & Type Badge */}
                                  <div className="relative h-48 w-full flex items-center justify-center rounded-[2rem] overflow-hidden bg-slate-50/50 mb-4 cursor-pointer" onClick={() => setViewProduct(item)}>
                                     {images[0] ? (
                                        <img src={images[0]} className="h-full w-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                     ) : <FaBoxOpen className="text-slate-200" size={32} />}
                                     <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter text-white shadow-sm ${isCombo ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                                        {item.type}
                                     </span>
                                     {details?.offerPercent && <span className="absolute top-4 right-4 px-2 py-1 rounded-lg text-[8px] font-black bg-red-500 text-white shadow-sm">{details.offerPercent}% OFF</span>}
                                  </div>

                                  <div className="mb-4 text-center">
                                     <h4 className="text-base font-[900] text-slate-950 truncate mb-1">{item.name}</h4>
                                     <p className="text-[11px] text-slate-500 font-bold line-clamp-2 h-8 leading-relaxed mb-3">
                                        {item.description || `${item.category} Registry`}
                                     </p>
                                     <div className="flex items-center justify-center gap-2">
                                        {mrp && <span className="text-[11px] font-bold text-slate-300 line-through">₹{mrp}</span>}
                                        <span className="text-sm font-black text-slate-950 uppercase tracking-widest">₹ {price || '—'}</span>
                                     </div>
                                  </div>

                                  <div className="flex justify-center items-center gap-1.5 text-[11px] font-black text-amber-500 mb-6 bg-amber-50/50 w-fit mx-auto px-3 py-1 rounded-full">
                                     <FaStar size={10} /> {item.rating || '5.0'}
                                  </div>

                                  <div className="mt-auto flex items-center justify-center gap-3 pt-4 border-t border-slate-50">
                                     <button onClick={() => setViewProduct(item)} className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all border border-transparent hover:border-emerald-700 shadow-sm"><FaEye size={12} /></button>
                                     <button onClick={() => navigate('/adminpanel/products', { state: { editItem: item } })} className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all border border-transparent hover:border-blue-700 shadow-sm"><FaEdit size={12} /></button>
                                     <button onClick={() => handleDelete(item)} className="p-3 bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all border border-transparent hover:border-red-700 shadow-sm"><FaTrash size={12} /></button>
                                  </div>
                               </div>
                            );
                         })}
                      </div>
                   ) : (
                      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-[#009669] border-b border-emerald-700">
                              <tr>
                                 <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Asset Index</th>
                                 <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Identity & Type</th>
                                 <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Pricing Strategy</th>
                                 <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-center">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {currentItems.map(item => {
                                 const isCombo = item.type === 'combo';
                                 const price = isCombo ? (typeof item.comboDetails === 'object' ? item.comboDetails : safeParse(item.comboDetails))?.offerPrice : safeParse(item.variants)[0]?.offerPrice;
                                 return (
                                    <tr key={`${item.type}-${item.id}`} className="hover:bg-emerald-50/30 transition-colors group">
                                       <td className="px-8 py-6">
                                          <div className="w-14 h-14 rounded-2xl bg-slate-50 p-2 flex items-center justify-center overflow-hidden">
                                             {safeParse(item.images)[0] ? <img src={safeParse(item.images)[0]} className="h-full w-full object-contain" alt="" /> : <FaImage size={20} className="text-slate-200" />}
                                          </div>
                                       </td>
                                       <td className="px-8 py-6">
                                          <div>
                                             <p className="font-black text-slate-950 text-sm mb-1">{item.name}</p>
                                             <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">#{item.productId}</span>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${isCombo ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{item.type}</span>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-8 py-6 font-black text-slate-900 text-sm">₹ {price || '—'}</td>
                                       <td className="px-8 py-6">
                                          <div className="flex justify-center items-center gap-2">
                                             <button onClick={() => setViewProduct(item)} className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all"><FaEye size={12} /></button>
                                             <button onClick={() => navigate('/adminpanel/products', { state: { editItem: item } })} className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all"><FaEdit size={12} /></button>
                                             <button onClick={() => handleDelete(item)} className="p-3 bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all"><FaTrash size={12} /></button>
                                          </div>
                                       </td>
                                    </tr>
                                 );
                              })}
                           </tbody>
                        </table>
                      </div>
                   )}

                   {/* Pagination */}
                   {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-3 mt-10 pb-10">
                         {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-2xl font-black text-xs transition-all ${currentPage === page ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-gray-100 hover:border-emerald-200'}`}>{page}</button>
                         ))}
                      </div>
                   )}
                </>
             )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setViewProduct(null)} />
          <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
             <button onClick={() => setViewProduct(null)} className="absolute top-8 right-8 w-10 h-10 rounded-2xl bg-white/50 backdrop-blur border flex items-center justify-center text-slate-400 hover:text-red-500 z-50 transition-all shadow-sm">✕</button>
             <div className="w-full md:w-1/2 bg-slate-50/50 p-12 flex items-center justify-center border-r border-gray-50">
                {safeParse(viewProduct.images)[0] ? <img src={safeParse(viewProduct.images)[0]} className="max-h-80 object-contain hover:scale-105 transition-transform duration-700" alt="" /> : <FaBoxOpen className="text-slate-100" size={120} />}
             </div>
             <div className="w-full md:w-1/2 p-12 space-y-6">
                <div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{viewProduct.category}</span>
                  <h2 className="text-3xl font-[900] text-slate-950 tracking-tight mt-2">{viewProduct.name}</h2>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry ID: {viewProduct.productId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Control</p>
                     <p className="text-xl font-black text-slate-950">{viewProduct.totalStock || '—'} units</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                     <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Pricing Strategy</p>
                     <p className="text-xl font-black text-emerald-700">₹{(viewProduct.type === 'single' ? safeParse(viewProduct.variants)[0]?.offerPrice : (typeof viewProduct.comboDetails === 'object' ? viewProduct.comboDetails : safeParse(viewProduct.comboDetails))?.offerPrice) || '—'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feature Matrix</p>
                   <div className="flex flex-wrap gap-2">
                      {safeParse(viewProduct.healthBenefits).slice(0, 5).map((b, i) => (
                         <span key={i} className="px-4 py-2 bg-white border border-gray-100 rounded-2xl text-[10px] font-black text-slate-600 shadow-sm">{b}</span>
                      ))}
                   </div>
                </div>

                <button onClick={() => navigate('/adminpanel/products', { state: { editItem: viewProduct } })} className="w-full bg-slate-950 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                   <FaEdit size={12} /> Commit Profile Changes
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allproduct;
