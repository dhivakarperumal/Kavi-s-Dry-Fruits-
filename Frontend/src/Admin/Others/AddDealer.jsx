import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { 
  FaPlus, 
  FaTrash, 
  FaStore, 
  FaPhone, 
  FaEnvelope, 
  FaFileInvoiceDollar,
  FaTimes,
  FaSearch,
  FaThLarge,
  FaBars,
  FaChevronRight,
  FaBuilding,
  FaUserTie,
  FaBoxOpen,
  FaMapMarkedAlt
} from "react-icons/fa";

const AddDealer = () => {
  const [formData, setFormData] = useState({
    dealerName: "",
    dealerGSTNumber: "",
    dealerPhoneNumber: "",
    dealerMail: "",
    dealerAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [dealerId, setDealerId] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'card' or 'table'
  const [showModal, setShowModal] = useState(false);
  const [dealers, setDealers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- Generate Next Dealer ID ---
  const generateDealerId = async () => {
    try {
      const res = await api.get("/dealers");
      if (res.data.length === 0) {
        setDealerId("KD0001");
      } else {
        const sorted = [...res.data].sort((a, b) => {
          const numA = parseInt(a.dealerId.replace("KD", ""), 10);
          const numB = parseInt(b.dealerId.replace("KD", ""), 10);
          return numB - numA;
        });
        const lastId = sorted[0].dealerId;
        const num = parseInt(lastId.replace("KD", ""), 10) + 1;
        const newId = "KD" + num.toString().padStart(4, "0");
        setDealerId(newId);
      }
    } catch (error) {
      console.error("Error generating dealer ID:", error);
      toast.error("Failed to generate dealer ID");
    }
  };

  // --- Fetch Dealers ---
  const fetchDealers = async () => {
    try {
      const res = await api.get("/dealers");
      setDealers(res.data);
    } catch (error) {
      console.error("Error fetching dealers:", error);
      toast.error("Error loading dealers");
    }
  };

  useEffect(() => {
    generateDealerId();
    fetchDealers();
  }, []);

  // --- Handle Input Change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Submit Form ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dealerId || !formData.dealerName || !formData.dealerPhoneNumber) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/dealers", {
        dealerId,
        ...formData,
      });

      toast.success("Dealer added successfully!");
      setFormData({
        dealerName: "",
        dealerGSTNumber: "",
        dealerPhoneNumber: "",
        dealerMail: "",
        dealerAddress: "",
      });
      setShowModal(false);
      generateDealerId();
      fetchDealers();
    } catch (error) {
      console.error(error);
      toast.error("Error adding dealer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this partner?")) return;
    try {
      await api.delete(`/dealers/${id}`);
      toast.success("Partner removed.");
      fetchDealers();
    } catch (error) {
      toast.error("Deletion failed.");
    }
  };

  // --- Filtering & Pagination ---
  const filteredDealers = dealers.filter((d) =>
    d.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.dealerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.dealerPhoneNumber.includes(searchTerm)
  );

  const paginatedDealers = filteredDealers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredDealers.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto mt-20">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 pr-4">
             <div className="relative w-full max-w-xl">
               <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                 type="text"
                 placeholder="Search Partner by Name, ID or Phone..."
                 value={searchTerm}
                 onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                 className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-black text-black text-sm"
               />
             </div>
          </div>

          <div className="flex items-center gap-3">
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
               onClick={() => setShowModal(true)}
               className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest"
             >
               <FaPlus size={12} /> Add Partner
             </button>
          </div>
        </div>

        {/* Content Section */}
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
             {paginatedDealers.map((dealer) => (
                <div key={dealer.id} className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all relative overflow-hidden flex flex-col h-full">
                   <div className="flex items-center justify-between mb-6">
                      <span className="bg-emerald-50 text-emerald-900 px-4 py-1.5 rounded-full text-[11px] font-[900] uppercase tracking-tighter">#{dealer.dealerId}</span>
                      <button onClick={() => handleDelete(dealer.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                         <FaTrash size={12} />
                      </button>
                   </div>

                   <div className="mb-8">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Corporate Partner</p>
                      <h4 className="text-2xl font-[900] text-slate-950 tracking-tight leading-none leading-none line-clamp-2">{dealer.dealerName}</h4>
                   </div>

                   <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <FaPhone size={12} />
                         </div>
                         <p className="text-sm font-black text-slate-900">{dealer.dealerPhoneNumber}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <FaFileInvoiceDollar size={12} />
                         </div>
                         <p className="text-[11px] font-bold text-slate-600">{dealer.dealerGSTNumber || 'GST Not Provided'}</p>
                      </div>
                      <div className="flex items-start gap-3">
                         <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                            <FaMapMarkedAlt size={12} />
                         </div>
                         <p className="text-[11px] font-bold text-slate-600 line-clamp-2">{dealer.dealerAddress || 'No Address Listed'}</p>
                      </div>
                   </div>

                   <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Partner</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                         <FaChevronRight size={12} />
                      </div>
                   </div>
                </div>
             ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto animate-in fade-in duration-500">
             <table className="w-full text-left">
                <thead className="bg-[#009669] border-b border-emerald-700">
                   <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Identity</th>
                      <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Partner Details</th>
                      <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Compliance (GST)</th>
                      <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-center">Audit</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {paginatedDealers.map((dealer) => (
                      <tr key={dealer.id} className="hover:bg-slate-50 transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xs">
                                  {dealer.dealerId.slice(-2)}
                               </div>
                               <div>
                                  <p className="font-black text-slate-950 text-sm leading-none mb-1">{dealer.dealerName}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">ID: {dealer.dealerId}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="space-y-1">
                               <div className="flex items-center gap-2 text-slate-900 font-black text-[11px]">
                                  <FaPhone size={10} className="text-emerald-500" /> {dealer.dealerPhoneNumber}
                               </div>
                               <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px]">
                                  <FaEnvelope size={10} /> {dealer.dealerMail || 'no-email@partner.com'}
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${dealer.dealerGSTNumber ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                               {dealer.dealerGSTNumber || 'Non-GST'}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <button onClick={() => handleDelete(dealer.id)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                               <FaTrash size={14} />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-2xl font-black text-xs transition-all ${currentPage === page ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-white text-slate-400 hover:text-emerald-600 border border-gray-100 shadow-sm"}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {filteredDealers.length === 0 && (
           <div className="p-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-100 mt-8">
              <FaBoxOpen size={40} className="mx-auto text-emerald-50 mb-4" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No partners matching query</p>
           </div>
        )}

        {/* Pop-up Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowModal(false)} />
             <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <div className="bg-[#009669] p-8 text-white relative">
                   <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
                   <div className="relative flex items-center justify-between">
                      <div>
                         <h3 className="text-2xl font-[900] tracking-tight uppercase">Partner Registry</h3>
                         <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mt-1">Onboard New Business Dealer</p>
                      </div>
                      <button onClick={() => setShowModal(false)} className="p-3 bg-black/10 hover:bg-black/20 rounded-2xl transition-all">
                        <FaTimes size={18} />
                      </button>
                   </div>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Dealer Name *</label>
                         <div className="relative">
                            <FaUserTie className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 opacity-40" />
                            <input type="text" name="dealerName" value={formData.dealerName} onChange={handleChange} placeholder="Legal Name" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:bg-white focus:border-emerald-600 transition-all font-black text-black text-sm" required />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Partner ID (Auto-Gen) *</label>
                         <input type="text" value={dealerId} readOnly className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-5 py-3.5 outline-none font-black text-emerald-950 text-sm italic" />
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Phone Contact *</label>
                         <div className="relative">
                            <FaPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 opacity-40" />
                            <input type="tel" name="dealerPhoneNumber" value={formData.dealerPhoneNumber} onChange={handleChange} placeholder="+91 0000 0000 00" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:bg-white focus:border-emerald-600 transition-all font-black text-black text-sm" required />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Business Email</label>
                         <div className="relative">
                            <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 opacity-40" />
                            <input type="email" name="dealerMail" value={formData.dealerMail} onChange={handleChange} placeholder="partner@company.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:bg-white focus:border-emerald-600 transition-all font-black text-black text-sm" />
                         </div>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">GST Identification</label>
                         <div className="relative">
                            <FaFileInvoiceDollar className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 opacity-40" />
                            <input type="text" name="dealerGSTNumber" value={formData.dealerGSTNumber} onChange={handleChange} placeholder="27A..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:bg-white focus:border-emerald-600 transition-all font-black text-black text-sm" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Office Location</label>
                         <div className="relative">
                            <FaMapMarkedAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 opacity-40" />
                            <input type="text" name="dealerAddress" value={formData.dealerAddress} onChange={handleChange} placeholder="City, State, Zip" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:bg-white focus:border-emerald-600 transition-all font-black text-black text-sm" />
                         </div>
                      </div>
                   </div>
                   <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-[900] py-5 rounded-2xl shadow-xl shadow-emerald-100 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50">{loading ? 'Processing Registry...' : 'Onboard Partner Dealer'}</button>
                </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDealer;
