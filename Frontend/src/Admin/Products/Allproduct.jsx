import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaStar, FaPlus, FaFilter, FaEdit, FaTrash, FaEye, 
  FaBoxOpen, FaLayerGroup, FaThLarge, FaListUl, FaSearch 
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../services/api";

const Allproduct = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [viewMode, setViewMode] = useState("card");

  const [categoryFilter, setCategoryFilter] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState([]);
  const [weights, setWeights] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);

  const [showFilters, setShowFilters] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "card" ? 12 : 15;

  const safeParse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try { return JSON.parse(data); } catch { return []; }
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
      const allPrices = unified.flatMap(item => {
        if (item.type === 'single') return safeParse(item.variants).map(v => Number(v.offerPrice) || 0);
        const details = typeof item.comboDetails === 'string' ? JSON.parse(item.comboDetails || '{}') : item.comboDetails;
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
    if (categoryFilter.length) filtered = filtered.filter(p => categoryFilter.includes(p.category));
    if (selectedWeight !== "All") {
      filtered = filtered.filter(p => p.type === 'single' ? safeParse(p.variants).some(v => v.weight === selectedWeight) : selectedWeight === "Combo Pack");
    }
    filtered = filtered.filter(p => {
      const details = p.type === 'single' ? safeParse(p.variants)[0] : (typeof p.comboDetails === 'string' ? JSON.parse(p.comboDetails || '{}') : p.comboDetails);
      let price = Number(details?.offerPrice) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [search, categoryFilter, selectedWeight, priceRange, items]);

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

  return (
    <div className="p-4 md:p-6 mt-15 min-h-screen bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b pb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">Master Inventory</h1>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
            <span className="w-6 h-1 bg-emerald-500 rounded-full"></span>
            Real-time Asset Control
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-50 p-1 rounded-lg flex border">
            <button onClick={() => setViewMode("card")} className={`p-2 rounded-md ${viewMode === "card" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400"}`}><FaThLarge size={14}/></button>
            <button onClick={() => setViewMode("table")} className={`p-2 rounded-md ${viewMode === "table" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400"}`}><FaListUl size={14}/></button>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 rounded-lg text-xs font-bold border ${showFilters ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}>
            <FaFilter className="inline mr-2"/> Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {showFilters && (
          <div className="w-full lg:w-64">
            <div className="bg-gray-50 p-5 rounded-2xl border sticky top-28 space-y-5">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input placeholder="SKU/Name" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Category</p>
                <div className="flex flex-wrap gap-1">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => categoryFilter.includes(cat) ? setCategoryFilter(categoryFilter.filter(c => c !== cat)) : setCategoryFilter([...categoryFilter, cat])} className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${categoryFilter.includes(cat) ? 'bg-emerald-600 text-white' : 'bg-white border text-gray-500'}`}>{cat}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Price: ₹{priceRange[1]}</label>
                <input type="range" min={0} max={maxPrice} value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full accent-emerald-500" />
              </div>
              <button onClick={() => { setCategoryFilter([]); setSearch(""); }} className="w-full py-2 text-[10px] font-bold text-gray-400 underline uppercase">Clear All</button>
            </div>
          </div>
        )}

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-48 bg-gray-50 rounded-2xl animate-pulse border" />)}</div>
          ) : viewMode === "card" ? (            
           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {currentItems.map(item => {
                const images = safeParse(item.images);
                const isCombo = item.type === 'combo';
                const variants = isCombo ? [] : safeParse(item.variants);
                const details = isCombo ? (typeof item.comboDetails === 'string' ? JSON.parse(item.comboDetails || '{}') : item.comboDetails) : null;
                const price = isCombo ? details?.offerPrice : variants[0]?.offerPrice;
                const mrp = isCombo ? details?.mrp : variants[0]?.mrp;
                const offerPercent = isCombo ? details?.offerPercent : variants[0]?.offerPercent;

                return (
                  <div key={item.id} className="group bg-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
                    {/* Image Area */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                      {images[0]
                        ? <img src={images[0]} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                        : <FaBoxOpen className="text-gray-200" size={40}/>
                      }
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Type badge */}
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[8px] font-black uppercase text-white shadow-lg backdrop-blur-sm ${isCombo ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                        {isCombo ? '🎁 Combo' : '📦 Single'}
                      </span>
                      {/* Offer badge */}
                      {offerPercent && <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[8px] font-black bg-red-500 text-white shadow-lg">{offerPercent}% OFF</span>}
                      {/* Action buttons on hover */}
                      <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <button onClick={() => setViewProduct({ ...item, images, price, mrp })} className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:text-emerald-600 transition-all"><FaEye size={11}/></button>
                        <button onClick={() => navigate('/admin/products', { state: { editItem: item } })} className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:text-blue-600 transition-all"><FaEdit size={11}/></button>
                        <button onClick={() => handleDelete(item)} className="w-8 h-8 bg-white/90 backdrop-blur-sm text-gray-600 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:text-red-600 transition-all"><FaTrash size={11}/></button>
                      </div>
                    </div>
                    {/* Info Area */}
                    <div className="p-4 flex-1 flex flex-col gap-2">
                      <div>
                        <h3 className="text-xs font-black text-gray-900 line-clamp-1 mb-0.5">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-gray-400 font-bold font-mono">{item.productId}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${isCombo ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>{item.category}</span>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-gray-50">
                        <span className="text-base font-black text-gray-900">₹{price || '—'}</span>
                        {mrp && <span className="text-[10px] text-gray-300 line-through">₹{mrp}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border rounded-2xl overflow-hidden">
              <table className="w-full text-[11px]">
                <thead className="bg-gray-50 text-gray-400 uppercase font-bold border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">SKU</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-center">Price</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-600">
                  {currentItems.map(item => {
                    const isCombo = item.type === 'combo';
                    const variants = isCombo ? [] : safeParse(item.variants);
                    const details = isCombo ? (typeof item.comboDetails === 'string' ? JSON.parse(item.comboDetails || '{}') : item.comboDetails) : null;
                    const price = isCombo ? details?.offerPrice : variants[0]?.offerPrice;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 font-bold">{item.productId}</td>
                        <td className="px-4 py-3 font-bold text-gray-800">{item.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${isCombo ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{item.category}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-gray-900">₹{price}</td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <button onClick={() => setViewProduct({ ...item, images: safeParse(item.images) })} className="p-1.5 text-gray-300 hover:text-emerald-600"><FaEye size={12}/></button>
                          <button onClick={() => navigate('/admin/products', { state: { editItem: item } })} className="p-1.5 text-gray-300 hover:text-emerald-600"><FaEdit size={12}/></button>
                          <button onClick={() => handleDelete(item)} className="p-1.5 text-gray-300 hover:text-red-500"><FaTrash size={12}/></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 pb-6">
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="p-2 text-gray-400">←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${currentPage === page ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-500'}`}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="p-2 text-gray-400">→</button>
            </div>
          )}
        </div>
      </div>

      {viewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl relative flex flex-col md:flex-row max-h-[85vh]">
            <button onClick={() => setViewProduct(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 z-50">✕</button>
            <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
                {viewProduct.images?.[0] ? <img src={viewProduct.images[0]} className="max-h-64 object-contain" alt="d" /> : <FaBoxOpen className="text-gray-100" size={80} />}
            </div>
            <div className="flex-1 p-8 flex flex-col justify-center space-y-5 bg-white">
              <div>
                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{viewProduct.category}</span>
                 <h2 className="text-xl font-bold text-gray-800 mt-1">{viewProduct.name}</h2>
                 <p className="text-[9px] text-gray-300 font-bold uppercase mt-0.5">ID: {viewProduct.productId}</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-gray-50 px-4 py-3 rounded-xl border flex-1">
                  <p className="text-[8px] font-bold text-gray-300 uppercase">Price</p>
                  <p className="text-xl font-bold text-gray-800">₹{viewProduct.price}</p>
                </div>
                <div className="bg-emerald-600 px-4 py-3 rounded-xl flex-1 text-white">
                    <p className="text-[8px] font-bold opacity-60 uppercase">Stock</p>
                    <p className="text-xl font-bold">{viewProduct.totalStock}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-bold text-gray-400 uppercase">Benefits</p>
                <div className="flex flex-wrap gap-1">
                  {safeParse(viewProduct.healthBenefits).map((b, i) => <span key={i} className="px-2 py-1 bg-gray-50 border rounded-md text-[8px] font-bold text-gray-500">{b}</span>)}
                </div>
              </div>
              <div className="pt-5 border-t flex items-center justify-between">
                 <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">★ {viewProduct.rating || 5}</div>
                 <button onClick={() => navigate('/admin/products', { state: { editItem: viewProduct } })} className="bg-gray-800 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-600 transition-all flex items-center gap-2">Edit Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Allproduct;
