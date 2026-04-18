import React, { useState, useEffect } from "react";
import { 
  FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaHeartbeat, 
  FaPlus, FaChevronLeft, FaChevronRight, FaBoxOpen, FaThList, FaVideo
} from "react-icons/fa";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import AddHealthBenefit from "./AddHealthBenefit";

const ViewHealthBenefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [filteredBenefits, setFilteredBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedBenefit, setSelectedBenefit] = useState(null); // For Detail Modal
  const [editItem, setEditItem] = useState(null); // For Edit View
  const [showAddView, setShowAddView] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    setLoading(true);
    try {
      const response = await api.get("/health-benefits");
      const data = response.data || [];
      setBenefits(data);
      setFilteredBenefits(data);
    } catch (err) {
      console.error("Error fetching health benefits:", err);
      toast.error("Failed to load health benefits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = benefits;
    if (search) {
      filtered = filtered.filter(b => 
        b.productName.toLowerCase().includes(search.toLowerCase()) ||
        b.productId?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (categoryFilter !== "All") {
      filtered = filtered.filter(b => b.category === categoryFilter);
    }
    setFilteredBenefits(filtered);
    setCurrentPage(1);
  }, [search, categoryFilter, benefits]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this health benefit profile?")) return;

    try {
      await api.delete(`/health-benefits/${id}`);
      toast.success("Profile deleted successfully");
      fetchBenefits();
    } catch (err) {
      toast.error("Failed to delete profile");
    }
  };


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBenefits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBenefits.length / itemsPerPage);

  const categories = ["All", ...new Set(benefits.map(b => b.category).filter(Boolean))];

  if (editItem || showAddView) {
    return (
      <AddHealthBenefit 
        editItem={editItem} 
        onCancel={() => { setEditItem(null); setShowAddView(false); }} 
        onSuccess={() => { setEditItem(null); setShowAddView(false); fetchBenefits(); }} 
      />
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white/60 backdrop-blur-md p-8 rounded-[3rem] border border-white shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-green-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <FaHeartbeat size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Health Benefits <span className="text-emerald-500">Profiles</span></h1>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Management Console</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search product..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:border-emerald-500 outline-none w-64"
            />
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm outline-none"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <button 
            onClick={() => setShowAddView(true)}
            className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <FaPlus /> New Profile
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-emerald-50/50 text-emerald-800 uppercase font-black text-[10px] tracking-widest border-b border-emerald-100">
              <tr>
                <th className="px-8 py-6 text-center">Preview</th>
                <th className="px-8 py-6">Product & Category</th>
                <th className="px-8 py-6">Short Description</th>
                <th className="px-8 py-6">Benefits</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-8 py-10 h-24 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/20 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-dashed border-emerald-200 p-1 mx-auto flex items-center justify-center overflow-hidden">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <FaBoxOpen className="text-gray-200" size={24} />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 group-hover:text-emerald-700 transition-colors">{item.productName}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.productId} • {item.category}</p>
                    </td>
                    <td className="px-8 py-6 max-w-xs">
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed italic">"{item.shortDescription}"</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-2">
                        {item.benefits?.slice(0, 2).map((b, i) => (
                          <span key={i} className="px-3 py-1 bg-pink-50 text-pink-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-pink-100">
                            {b.title}
                          </span>
                        ))}
                        {item.benefits?.length > 2 && (
                          <span className="text-[9px] font-bold text-gray-400">+{item.benefits.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setSelectedBenefit(item)}
                          className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm"
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </button>
                        <button 
                          onClick={() => setEditItem(item)}
                          className="w-10 h-10 flex items-center justify-center bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Delete"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-300">
                      <FaHeartbeat size={64} className="opacity-10" />
                      <p className="font-black uppercase tracking-[0.2em] text-sm">No health profiles found</p>
                      <button onClick={() => setShowAddView(true)} className="text-emerald-500 font-bold hover:underline text-xs">Create your first profile</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBenefits.length)} of {filteredBenefits.length}
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-emerald-600 disabled:opacity-50 transition-all shadow-sm"
              >
                <FaChevronLeft size={12} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                      currentPage === page 
                      ? "bg-emerald-600 text-white shadow-lg" 
                      : "bg-white text-gray-400 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-emerald-600 disabled:opacity-50 transition-all shadow-sm"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBenefit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col scale-in-center">
            <button 
              onClick={() => setSelectedBenefit(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-gray-50 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 z-50 transition-all shadow-sm border border-gray-100"
            >
              ✕
            </button>

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {/* Modal Top Branding */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-400 p-12 text-white">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                   <div className="w-48 h-48 bg-white/20 backdrop-blur-md rounded-[2.5rem] border border-white/30 p-4 flex items-center justify-center overflow-hidden shadow-2xl">
                      {selectedBenefit.images?.[0] ? (
                        <img src={selectedBenefit.images[0]} className="w-full h-full object-contain rounded-2xl" alt="" />
                      ) : (
                        <FaBoxOpen size={64} className="text-white/40" />
                      )}
                   </div>
                   <div className="flex-1 text-center md:text-left space-y-4">
                      <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                          {selectedBenefit.category}
                        </span>
                      </div>
                      <h2 className="text-4xl font-black tracking-tight">{selectedBenefit.productName}</h2>
                      <p className="text-lg font-medium opacity-90 max-w-2xl">“{selectedBenefit.shortDescription}”</p>
                      <div className="flex items-center gap-6 justify-center md:justify-start pt-2">
                         <div className="flex items-center gap-2">
                            <FaThList className="text-emerald-200" />
                            <span className="text-xs font-bold uppercase tracking-widest">{selectedBenefit.benefits?.length || 0} Benefits</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-12 space-y-12">
                 
                 {/* Descriptions */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-2 space-y-6">
                       <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                          <div className="w-2 h-8 bg-emerald-500 rounded-full"></div> Detailed Analysis
                       </h3>
                       <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                          {selectedBenefit.detailedDescription || "No detailed description provided."}
                       </p>
                    </div>
                    <div className="space-y-6">
                       <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                          <div className="w-2 h-8 bg-pink-500 rounded-full"></div> At a Glance
                       </h3>
                       <div className="space-y-4">
                          {selectedBenefit.benefits?.map((b, i) => (
                             <div key={i} className="bg-pink-50/50 border border-pink-100 p-4 rounded-2xl">
                                <p className="font-black text-pink-700 uppercase tracking-widest text-[10px] mb-1">{b.title}</p>
                                <p className="text-xs text-pink-600/80 font-medium">{b.description}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Media Grid */}
                 <div className="space-y-6">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                       <div className="w-2 h-8 bg-blue-500 rounded-full"></div> Media Library
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                       {selectedBenefit.images?.map((img, i) => (
                          <div key={i} className="aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                             <img src={img} className="w-full h-full object-cover" alt="" />
                          </div>
                       ))}
                       {selectedBenefit.videos?.filter(v => v.value).map((vid, i) => (
                          <div key={i} className="aspect-square rounded-[2rem] bg-gray-900 overflow-hidden border-4 border-white shadow-xl group relative">
                             {vid.type === 'upload' ? (
                                <video src={vid.value} className="w-full h-full object-cover" controls />
                             ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-3">
                                   <FaVideo size={32} className="text-red-500 animate-pulse" />
                                   <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Video Link</p>
                                   <a 
                                     href={vid.value} 
                                     target="_blank" 
                                     rel="noreferrer" 
                                     className="text-[9px] text-red-400 hover:text-red-300 underline font-bold break-all"
                                   >
                                     Open External Media
                                   </a>
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Instructions */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-inner">
                    <div className="space-y-4">
                       <h4 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest text-sm">
                          <FaUtensils className="text-emerald-500" /> Consumption
                       </h4>
                       <p className="text-gray-600 leading-bold whitespace-pre-wrap">{selectedBenefit.howToEat || "Standard consumption guidelines apply."}</p>
                    </div>
                    <div className="space-y-4">
                       <h4 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest text-sm">
                          <FaSave className="text-orange-500" /> Preservation
                       </h4>
                       <p className="text-gray-600 leading-bold whitespace-pre-wrap">{selectedBenefit.howToStore || "Store in a cool, dry place."}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Created: {selectedBenefit.createdAt ? new Date(selectedBenefit.createdAt).toLocaleDateString() : 'Now'}
               </p>
               <button 
                  onClick={() => { setEditItem(selectedBenefit); setSelectedBenefit(null); }}
                  className="bg-emerald-600 text-white px-10 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-3 outline-none"
               >
                  <FaEdit /> Modify Profile
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewHealthBenefits;
