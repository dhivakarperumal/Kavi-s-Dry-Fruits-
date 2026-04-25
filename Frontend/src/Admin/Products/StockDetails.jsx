import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set worker for PDF.js using local worker from node_modules (Vite way)
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import { 
  FaPlus, 
  FaSearch, 
  FaHistory, 
  FaBoxOpen, 
  FaFileInvoice, 
  FaTimes,
  FaWarehouse,
  FaArrowLeft,
  FaArrowRight,
  FaThLarge,
  FaList,
  FaUpload,
  FaFilePdf
} from "react-icons/fa";

const StockDetail = () => {
  const safeParse = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try { return JSON.parse(data); } catch { return []; }
  };

  const [viewMode, setViewMode] = useState("table"); // 'card' or 'table'
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    productId: "",
    productName: "",
    productCategory: "",
    currentQuantity: "",
    invoiceNumber: "",
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState([]);
  const [importInvoice, setImportInvoice] = useState("");
  const [isCombo, setIsCombo] = useState(false);
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  const [liveStocks, setLiveStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 50;

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const [prodRes, comboRes] = await Promise.all([
        api.get("/products"),
        api.get("/combos")
      ]);
      const unified = [
        ...prodRes.data.map(p => ({ ...p, type: 'single' })),
        ...comboRes.data.map(c => ({ ...c, type: 'combo' }))
      ];
      setLiveStocks(unified.sort((a, b) => (a.productId || "").localeCompare(b.productId || "", "en", { numeric: true })));
    } catch (e) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/invoices");
        setInvoiceNumbers(res.data);
      } catch (error) {}
    };
    fetchInvoices();
    fetchStocks();
  }, []);

  const handleProductIdChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, productId: value });
    if (!value.trim()) return;

    const matched = liveStocks.find(item => item.productId === value.trim());
    if (matched) {
      setIsCombo(matched.type === 'combo');
      setForm(prev => ({
        ...prev,
        productName: matched.name || "",
        productCategory: matched.category || "",
        currentQuantity: "",
      }));
    } else {
      setForm(prev => ({ ...prev, productName: "", productCategory: "", currentQuantity: "" }));
      setIsCombo(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setShowAddModal(false);
    setForm({ productId: "", productName: "", productCategory: "", currentQuantity: "", invoiceNumber: "" });
    setIsCombo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const matched = liveStocks.find(item => item.productId === form.productId.trim());
      if (!matched) return toast.error("Product mismatch.");

      const existingStock = Number(matched.totalStock) || 0;
      const addedQuantity = parseInt(form.currentQuantity) * 1000; // EVERYTHING is inputted as KG, stored as grams
      const newStock = existingStock + addedQuantity;

      const endpoint = matched.type === 'combo' ? `/combos/${matched.id}` : `/products/${matched.id}`;
      const updatedProduct = { ...matched, totalStock: String(newStock), lastInvoice: form.invoiceNumber };

      await api.put(endpoint, updatedProduct);
      await api.post("/stock-history", { ...form, addedQuantity, finalStock: newStock, type: matched.type });

      toast.success("Inventory updated!");
      closeModal();
      fetchStocks();
    } catch (err) {
      toast.error("Transaction failed.");
    }
  };

  const filteredStocks = liveStocks.filter(item =>
    item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const paginatedStocks = filteredStocks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto mt-0">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
         {/* Search Bar */}
        <div className="relative mb-8 max-w-md">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, Name or Category..."
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-black text-black text-sm"
          />
        </div>


          <div className="flex items-center gap-3">
             <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                <button 
                  onClick={() => setViewMode("card")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'card' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
                >
                  <FaThLarge size={18} />
                </button>
                <button 
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
                >
                  <FaList size={18} />
                </button>
             </div>
              {/* <button
                onClick={() => {
                  const data = liveStocks.map(s => ({
                    'Product ID': s.productId,
                    'Product Name': s.name,
                    'Category': s.category,
                    'Current Stock (KG)': (Number(s.totalStock) / 1000).toFixed(2),
                    'Added Stock (KG)': 0
                  }));
                  const ws = XLSX.utils.json_to_sheet(data);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "Inventory");
                  XLSX.writeFile(wb, "Kavis_Inventory_Template.xlsx");
                  toast.success("Template exported!");
                }}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-sm transition-all shadow-sm uppercase tracking-widest"
              >
                <FaHistory /> Export Template
              </button> */}
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest"
              >
                <FaUpload /> Bulk Import (Excel/PDF)
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest"
              >
                <FaPlus /> Add New Stock
              </button>
          </div>
        </div>

        {/* Global Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <FaWarehouse size={20} />
                </div>
                <div>
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Total SKU's</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{liveStocks.length}</p>
                </div>
            </div>
            {/* Single-product stock (grams → KG) */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <FaBoxOpen size={20} />
                </div>
                <div>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Products Stock</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                        {(liveStocks
                          .filter(s => s.type !== 'combo')
                          .reduce((acc, curr) => acc + (Number(curr.totalStock) || 0), 0) / 1000
                        ).toFixed(1)}
                        <span className="text-xs text-gray-400"> KG</span>
                    </p>
                </div>
            </div>
            {/* Combo stock (grams → KG) */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                    <FaHistory size={20} />
                </div>
                <div>
                    <p className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Combo Stock</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                        {(liveStocks
                          .filter(s => s.type === 'combo')
                          .reduce((acc, curr) => acc + (Number(curr.totalStock) || 0), 0) / 1000
                        ).toFixed(1)}
                        <span className="text-xs text-gray-400"> KG</span>
                    </p>
                </div>
            </div>
        </div>

        
        {/* Inventory Content */}
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedStocks.map((item) => {
               const images = safeParse(item.images || item.cimgs);
               const variants = safeParse(item.variants);
               const displayImg = images[0] || variants[0]?.img || (typeof item.comboDetails === 'string' ? JSON.parse(item.comboDetails || '{}').img : item.comboDetails?.img);

               return (
                 <div key={`${item.type}-${item.id}`} className="group bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all relative overflow-hidden">
                   <div className="relative h-40 mb-4 overflow-hidden rounded-3xl bg-gray-50 flex items-center justify-center">
                      {displayImg ? (
                         <img src={displayImg} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                         <div className="flex flex-col items-center gap-2 text-gray-200">
                            <FaBoxOpen size={32} />
                            <span className="text-[8px] font-black uppercase opacity-40">No Image</span>
                         </div>
                      )}
                      <div className="absolute top-3 left-3">
                         <span className="bg-white/90 backdrop-blur shadow-sm border border-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight">
                           #{item.productId}
                         </span>
                      </div>
                   </div>
                   
                   <h4 className="text-lg font-black text-slate-950 mb-3 truncate leading-none">{item.name}</h4>
                   <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest mb-4 opacity-70">{item.category}</p>
                   
                   <div className="flex items-end justify-between border-t border-gray-50 pt-4">
                     <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Level</p>
                       <p className={`text-xl font-[900] tracking-tighter ${Number(item.totalStock) < 5000 ? 'text-red-500' : 'text-emerald-700'}`}>
                         {((Number(item.totalStock) || 0) / 1000).toFixed(2)} <span className="text-[10px] font-bold text-gray-400">KG</span>
                       </p>
                     </div>
                     
                     {item.lastInvoice ? (
                       <Link 
                         to={`/adminpanel/invoice?no=${item.lastInvoice}`} 
                         className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                         title="View Last Invoice"
                       >
                         <FaFileInvoice size={14} />
                       </Link>
                     ) : (
                       <div className="p-3 bg-gray-50 text-gray-300 rounded-2xl cursor-not-allowed">
                         <FaFileInvoice size={14} />
                       </div>
                     )}
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
                        <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">S.No</th>
                        <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Descriptor</th>
                        <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Identify & Preview</th>
                        <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Classification</th>
                        <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-center">Current Stock</th>
                        <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-right">Last Source</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-50/50">
                     {paginatedStocks.map((item, index) => {
                        const images = safeParse(item.images || item.cimgs);
                        const variants = safeParse(item.variants);
                        const displayImg = images[0] || variants[0]?.img || (typeof item.comboDetails === 'string' ? JSON.parse(item.comboDetails || '{}').img : item.comboDetails?.img);

                        return (
                          <tr key={`${item.type}-${item.id}`} className="hover:bg-emerald-50/30 transition-colors group">
                             <td className="px-8 py-6 font-black text-slate-900 text-xs text-center">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                             </td>
                             <td className="px-8 py-6">
                                <span className="bg-white border border-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                   #{item.productId}
                                </span>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 p-0.5 overflow-hidden shadow-sm flex items-center justify-center">
                                      {displayImg ? <img src={displayImg} className="w-full h-full object-cover rounded-lg" alt="" /> : <FaBoxOpen className="text-gray-100 p-2" />}
                                   </div>
                                   <span className="font-black text-black text-sm">{item.name}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-900 px-3 py-1.5 rounded-full uppercase tracking-tighter">{item.category}</span>
                             </td>
                             <td className="px-8 py-6 text-center">
                                <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-tighter ${Number(item.totalStock) < 5000 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                    {((Number(item.totalStock) || 0) / 1000).toFixed(2)} kg
                                </div>
                             </td>
                             <td className="px-8 py-6 text-right">
                                {item.lastInvoice ? (
                                  <Link
                                    to={`/adminpanel/invoice?no=${item.lastInvoice}`}
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-black text-xs uppercase tracking-widest transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaFileInvoice size={12} /> {item.lastInvoice}
                                  </Link>
                                ) : (
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Record</span>
                                )}
                             </td>
                          </tr>
                        );
                     })}
                     {paginatedStocks.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-8 py-20 text-center">
                              <FaBoxOpen size={40} className="mx-auto text-slate-100 mb-4" />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No inventory matches found</p>
                          </td>
                        </tr>
                     )}
                  </tbody>
               </table>
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-3 bg-white border border-gray-100 rounded-xl text-emerald-950 disabled:opacity-30 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
              <FaArrowLeft size={12} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === page ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white text-slate-600 border border-gray-100 hover:border-emerald-300 hover:text-emerald-700'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-3 bg-white border border-gray-100 rounded-xl text-emerald-950 disabled:opacity-30 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
              <FaArrowRight size={12} />
            </button>
          </div>
        )}

        {/* Add/Adjustment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal} />
             
             <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <div className="bg-emerald-600 p-8 text-white relative flex-shrink-0">
                   <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                   <div className="relative flex items-center justify-between">
                      <div>
                         <h3 className="text-2xl font-[900] tracking-tight uppercase">Stock Adjustment</h3>
                         <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mt-1">Manual stock entry & audit trail</p>
                      </div>
                      <button onClick={closeModal} className="p-3 bg-black/10 hover:bg-black/20 rounded-2xl transition-all">
                        <FaTimes size={18} />
                      </button>
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Select Catalog Item *</label>
                       <select
                         name="productId"
                         value={form.productId}
                         onChange={handleProductIdChange}
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-emerald-600 transition-all font-black text-black text-sm cursor-pointer shadow-sm"
                         required
                       >
                         <option value="">Choose a Product ID</option>
                         {liveStocks.map((item) => (
                           <option key={item.id} value={item.productId}>
                             {item.productId} — {item.name}
                           </option>
                         ))}
                       </select>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Product Name</label>
                          <input type="text" value={form.productName} readOnly className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-5 py-3.5 text-emerald-900 font-black text-sm shadow-inner" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Category</label>
                          <input type="text" value={form.productCategory} readOnly className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-5 py-3.5 text-emerald-900 font-black text-sm shadow-inner" />
                       </div>
                   </div>

                   {/* Combo Items Display */}
                   {isCombo && (
                     <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="text-[10px] font-black text-emerald-800 uppercase tracking-widest ml-1">Combo Contents</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {(() => {
                             const matched = liveStocks.find(p => p.productId === form.productId);
                             const items = safeParse(matched?.comboItems);
                             if (items.length === 0) return <p className="text-[10px] text-gray-400 italic">No items defined for this combo</p>;
                             return items.map((item, idx) => (
                               <div key={idx} className="flex items-center justify-between bg-emerald-50/30 border border-emerald-100 rounded-xl px-4 py-2.5">
                                 <span className="text-xs font-black text-emerald-950 truncate max-w-[160px]">{item.name}</span>
                                 <span className="text-[10px] font-bold text-emerald-600 bg-white px-2.5 py-1 rounded-full border border-emerald-50 shadow-sm">{item.weight}</span>
                               </div>
                             ));
                           })()}
                        </div>
                     </div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Arrival Quantity (KG) *</label>
                          <input
                            type="number"
                            min="0"
                            name="currentQuantity"
                            value={form.currentQuantity}
                            onChange={handleChange}
                            placeholder="Amount to add..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-emerald-600 transition-all font-black text-black text-sm"
                            required
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Reference Invoice *</label>
                          <select
                            name="invoiceNumber"
                            value={form.invoiceNumber}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-emerald-600 transition-all font-black text-black text-sm cursor-pointer"
                            required
                          >
                            <option value="">Select Invoice</option>
                            {invoiceNumbers.map((inv) => (
                              <option key={inv.id} value={inv.invoiceNo}>{inv.invoiceNo}</option>
                            ))}
                          </select>
                       </div>
                   </div>

                   {/* Stock Summary Section */}
                   {form.productId && (
                     <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100/50 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="text-center md:text-left">
                           <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest mb-1">Current Warehouse Stock</p>
                           <p className="text-xl font-black text-slate-900 tracking-tighter">
                              {(() => {
                                const matched = liveStocks.find(p => p.productId === form.productId);
                                const current = Number(matched?.totalStock) || 0;
                                return `${current / 1000} KG`;
                              })()}
                           </p>
                        </div>
                        <div className="h-px w-8 bg-emerald-200 hidden md:block" />
                        <div className="text-center">
                           <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest mb-1">New Batch</p>
                           <p className="text-xl font-black text-blue-600 tracking-tighter">
                              + {form.currentQuantity || 0} KG
                           </p>
                        </div>
                        <div className="h-px w-8 bg-emerald-200 hidden md:block" />
                        <div className="text-center md:text-right">
                           <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest mb-1">Resulting Total</p>
                           <p className="text-xl font-black text-emerald-700 tracking-tighter bg-white px-4 py-1 rounded-full shadow-sm border border-emerald-100">
                              {(() => {
                                const matched = liveStocks.find(p => p.productId === form.productId);
                                const current = Number(matched?.totalStock) || 0;
                                const added = (Number(form.currentQuantity) || 0) * 1000;
                                const total = current + added;
                                return `${total / 1000} KG`;
                              })()}
                           </p>
                        </div>
                     </div>
                   )}

                   <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-[900] py-5 rounded-2xl shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
                      >
                        {loading ? 'Processing Registry...' : 'Commit Stock Entry'}
                      </button>
                   </div>
                </form>
             </div>
          </div>
        )}

        {/* Bulk Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowImportModal(false)} />
             <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
                   <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">Bulk Inventory Import</h3>
                      <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mt-1">Excel / CSV Stock Synchronization</p>
                   </div>
                   <button onClick={() => setShowImportModal(false)} className="p-3 bg-black/10 hover:bg-black/20 rounded-2xl transition-all">
                      <FaTimes size={18} />
                   </button>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto">
                   {!importData.length ? (
                     <div className="space-y-6">
                        <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-[2.5rem] p-12 text-center">
                           <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100 text-indigo-600">
                              <FaFileInvoice size={32} />
                           </div>
                           <h4 className="text-xl font-black text-slate-900 mb-2">Drop your Stock Sheet</h4>
                           <p className="text-sm text-slate-500 font-medium mb-8">Upload .xlsx, .csv or .pdf with columns: Product ID, Added Stock (KG)</p>
                           
                           <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black text-sm cursor-pointer shadow-xl transition-all inline-block uppercase tracking-widest">
                              Select File
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".xlsx, .xls, .csv, .pdf" 
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if(!file) return;

                                  if (file.type === "application/pdf") {
                                    const reader = new FileReader();
                                    reader.onload = async (evt) => {
                                      try {
                                        const typedarray = new Uint8Array(evt.target.result);
                                        const loadingTask = pdfjs.getDocument(typedarray);
                                        const pdf = await loadingTask.promise;
                                        let fullText = "";
                                        
                                        for (let i = 1; i <= pdf.numPages; i++) {
                                          const page = await pdf.getPage(i);
                                          const textContent = await page.getTextContent();
                                          fullText += textContent.items.map(s => s.str).join(" ") + " ";
                                        }

                                        // Smarter Scanner: High-tolerance search
                                        const foundItems = [];
                                        const normalizedText = fullText.replace(/\s+/g, ' '); // Clean line breaks & extra spaces

                                        liveStocks.forEach(prod => {
                                          // 1. Try matching by Product ID (e.g. "KPR001 ... 10")
                                          // Increased limit to 100 to allow for long product names in between
                                          const idRegex = new RegExp(`${prod.productId}[^\\d]{0,100}(\\d+(\\.\\d+)?)`, 'gi');
                                          
                                          // 2. Try matching by Product Name (fallback)
                                          const escapedName = prod.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                          const nameRegex = new RegExp(`${escapedName}[^\\d]{0,100}(\\d+(\\.\\d+)?)`, 'gi');

                                          let match;
                                          // Check ID matches
                                          while ((match = idRegex.exec(normalizedText)) !== null) {
                                            foundItems.push({
                                              productId: prod.productId,
                                              addedQuantity: Number(match[1]),
                                              name: prod.name,
                                              category: prod.category,
                                              type: prod.type,
                                              isValid: true
                                            });
                                          }
                                          // Check Name matches (if no ID matches found yet for this product)
                                          if (foundItems.filter(f => f.productId === prod.productId).length === 0) {
                                            while ((match = nameRegex.exec(normalizedText)) !== null) {
                                              foundItems.push({
                                                productId: prod.productId,
                                                addedQuantity: Number(match[1]),
                                                name: prod.name,
                                                category: prod.category,
                                                type: prod.type,
                                                isValid: true
                                              });
                                            }
                                          }
                                        });

                                        if (foundItems.length === 0) {
                                          toast.error("No recognizable Product IDs found in PDF");
                                        } else {
                                          setImportData(foundItems);
                                          toast.success(`Extracted ${foundItems.length} items from PDF`);
                                        }
                                      } catch (err) {
                                        console.error(err);
                                        toast.error("Failed to parse PDF content");
                                      }
                                    };
                                    reader.readAsArrayBuffer(file);
                                  } else {
                                    // Handle Excel / CSV
                                    const reader = new FileReader();
                                    reader.onload = (evt) => {
                                      const bstr = evt.target.result;
                                      const wb = XLSX.read(bstr, { type: 'binary' });
                                      const wsname = wb.SheetNames[0];
                                      const ws = wb.Sheets[wsname];
                                      const data = XLSX.utils.sheet_to_json(ws);
                                      
                                      const mapped = data.map(row => {
                                        // Improved Column Matching: Search for keywords in column names
                                        const findVal = (keywords) => {
                                          const key = Object.keys(row).find(k => 
                                            keywords.some(kw => k.toLowerCase().includes(kw.toLowerCase()))
                                          );
                                          return key ? String(row[key]).trim() : null;
                                        };

                                        const pId = findVal(['Product ID', 'ID', 'SKU', 'Code']) || "";
                                        const qty = findVal(['Added', 'Stock', 'Qty', 'Quantity', 'Weight', 'KG', 'Adjust']) || 0;
                                        
                                        const matched = liveStocks.find(s => s.productId === String(pId).trim());
                                        return {
                                          productId: String(pId).trim(),
                                          addedQuantity: Number(qty) || 0,
                                          name: matched?.name || "Not Found",
                                          category: matched?.category || "-",
                                          type: matched?.type || "unknown",
                                          isValid: !!matched
                                        };
                                      });
                                      setImportData(mapped);
                                    };
                                    reader.readAsBinaryString(file);
                                  }
                                }}
                              />
                           </label>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Required Excel Format</h5>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                 <p className="text-[10px] font-black text-slate-400 mb-1">Column A</p>
                                 <p className="font-black text-slate-900 text-xs">Product ID</p>
                              </div>
                              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                 <p className="text-[10px] font-black text-slate-400 mb-1">Column B</p>
                                 <p className="font-black text-slate-900 text-xs">Added Stock (KG)</p>
                              </div>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Reviewing {importData.length} Entries</p>
                           <button onClick={() => setImportData([])} className="text-red-500 font-black text-[10px] uppercase tracking-widest">Discard & Clear</button>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden max-h-[300px] overflow-y-auto">
                           <table className="w-full text-left">
                              <thead className="bg-slate-50 sticky top-0">
                                 <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identify</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Added</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Resulting</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                 {importData.map((row, i) => {
                                    const matched = liveStocks.find(s => s.productId === row.productId);
                                    const currentStockKg = (Number(matched?.totalStock) || 0) / 1000;
                                    const finalStockKg = currentStockKg + row.addedQuantity;

                                    return (
                                      <tr key={i} className={!row.isValid ? "bg-red-50" : ""}>
                                         <td className="px-6 py-3">
                                            <p className="font-black text-slate-900 text-xs">{row.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {row.productId}</p>
                                         </td>
                                         <td className="px-6 py-3 text-center font-bold text-slate-500 text-xs">{currentStockKg.toFixed(2)}kg</td>
                                         <td className="px-6 py-3 text-center font-black text-blue-600 text-xs">+{row.addedQuantity}kg</td>
                                         <td className="px-6 py-3 text-right">
                                            <span className={`px-3 py-1 rounded-lg font-black text-xs ${finalStockKg < 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                                               {finalStockKg.toFixed(2)}kg
                                            </span>
                                         </td>
                                      </tr>
                                    );
                                 })}
                              </tbody>
                           </table>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Reference Invoice for this Batch *</label>
                           <select
                             value={importInvoice}
                             onChange={(e) => setImportInvoice(e.target.value)}
                             className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-indigo-600 transition-all font-black text-black text-sm cursor-pointer shadow-sm"
                             required
                           >
                             <option value="">Select Invoice</option>
                             {invoiceNumbers.map((inv) => (
                               <option key={inv.id} value={inv.invoiceNo}>{inv.invoiceNo}</option>
                             ))}
                           </select>
                        </div>

                        <button
                          disabled={!importInvoice || loading || importData.some(r => !r.isValid)}
                          onClick={async () => {
                            setLoading(true);
                            try {
                              await api.post('/stock-history/bulk', { items: importData, invoiceNumber: importInvoice });
                              toast.success("Batch stock updated successfully!");
                              setShowImportModal(false);
                              setImportData([]);
                              fetchStocks();
                            } catch { toast.error("Batch update failed."); }
                            finally { setLoading(false); }
                          }}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                        >
                          Execute Batch Update
                        </button>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetail;
