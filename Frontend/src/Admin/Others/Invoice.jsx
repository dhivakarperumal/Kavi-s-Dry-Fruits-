import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { 
  FaFileInvoiceDollar, 
  FaPlus, 
  FaCalendarAlt, 
  FaCalculator, 
  FaCloudUploadAlt,
  FaFilePdf,
  FaTimes,
  FaSearch,
  FaBoxOpen,
  FaFilter,
  FaThLarge,
  FaBars,
  FaChevronRight,
  FaMoneyBillWave
} from "react-icons/fa";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceValue: "",
    invoiceGSTValue: "",
    invoiceTotalValue: "",
    transportAmount: "0",
    billPdfBase64: null,
    billPdfName: "",
  });

  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'card' or 'table'
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchInvoices = async () => {
    try {
      const response = await api.get("/invoices");
      setInvoices(response.data);
      if (response.data.length > 0) {
        generateNextInvoiceNo(response.data);
      } else {
        setInvoiceData(prev => ({ ...prev, invoiceNo: "INV-001" }));
      }
    } catch (error) {
      toast.error("Failed to fetch invoices");
    }
  };

  const generateNextInvoiceNo = (existingInvoices) => {
    const lastInv = existingInvoices[existingInvoices.length - 1];
    if (lastInv && lastInv.invoiceNo) {
       const match = lastInv.invoiceNo.match(/\d+/);
       if (match) {
          const nextNum = parseInt(match[0]) + 1;
          const paddedNum = nextNum.toString().padStart(3, '0');
          setInvoiceData(prev => ({ ...prev, invoiceNo: `INV-${paddedNum}` }));
       } else {
          setInvoiceData(prev => ({ ...prev, invoiceNo: `INV-001` }));
       }
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const val = parseFloat(invoiceData.invoiceValue) || 0;
    const gst = parseFloat(invoiceData.invoiceGSTValue) || 0;
    const transport = parseFloat(invoiceData.transportAmount) || 0;
    const total = val + gst + transport;
    setInvoiceData(prev => ({ ...prev, invoiceTotalValue: total.toString() }));
  }, [invoiceData.invoiceValue, invoiceData.invoiceGSTValue, invoiceData.transportAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Format Error: Only PDF files are allowed!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setInvoiceData((prev) => ({
        ...prev,
        billPdfBase64: reader.result.split(",")[1],
        billPdfName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const closeModal = () => {
    setShowModal(false);
    setInvoiceData({
      invoiceNo: "",
      invoiceDate: new Date().toISOString().split('T')[0],
      invoiceValue: "",
      invoiceGSTValue: "",
      invoiceTotalValue: "",
      transportAmount: "0",
      billPdfBase64: null,
      billPdfName: "",
    });
    fetchInvoices();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceData.billPdfBase64) return toast.error("Please upload the PDF invoice.");
    
    setLoading(true);
    try {
      await api.post("/invoices", { ...invoiceData, createdAt: new Date().toISOString() });
      toast.success("Invoice Registry Successful!");
      closeModal();
    } catch (error) {
      toast.error("Registry failed.");
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = !filters.startDate || new Date(inv.invoiceDate) >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || new Date(inv.invoiceDate) <= new Date(filters.endDate);
    const total = parseFloat(inv.invoiceTotalValue) || 0;
    const matchesMinAmount = !filters.minAmount || total >= parseFloat(filters.minAmount);
    const matchesMaxAmount = !filters.maxAmount || total <= parseFloat(filters.maxAmount);
    return matchesSearch && matchesStartDate && matchesEndDate && matchesMinAmount && matchesMaxAmount;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto mt-20">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 pr-4">
             {/* Left: Search Bar */}
             <div className="relative w-full max-w-xl">
               <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
               <input
                 type="text"
                 placeholder="Search by Invoice ID..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-black text-black text-sm"
               />
             </div>
          </div>

          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-3">
             {/* View Mode Switcher */}
             <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === "card" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-emerald-600"}`}
                  title="Card Mode"
                >
                  <FaThLarge size={14} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === "table" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-emerald-600"}`}
                  title="Table Mode"
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
               onClick={() => setShowModal(true)}
               className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest"
             >
               <FaPlus size={12} /> Add New
             </button>
          </div>
        </div>

        {/* Collapsible Filter Bar */}
        {showFilters && (
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2rem] p-6 mb-10 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-500">
             <div className="space-y-2">
                <label className="text-[9px] font-black text-emerald-900 uppercase tracking-widest ml-1">Start Date</label>
                <input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-2.5 outline-none font-black text-black text-xs shadow-sm" />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black text-emerald-900 uppercase tracking-widest ml-1">End Date</label>
                <input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-2.5 outline-none font-black text-black text-xs shadow-sm" />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black text-emerald-900 uppercase tracking-widest ml-1">Min Amount (₹)</label>
                <input type="number" placeholder="0" value={filters.minAmount} onChange={(e) => setFilters({...filters, minAmount: e.target.value})} className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-2.5 outline-none font-black text-black text-xs shadow-sm" />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black text-emerald-900 uppercase tracking-widest ml-1">Max Amount (₹)</label>
                <input type="number" placeholder="Any" value={filters.maxAmount} onChange={(e) => setFilters({...filters, maxAmount: e.target.value})} className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-2.5 outline-none font-black text-black text-xs shadow-sm" />
             </div>
          </div>
        )}

        {/* Content Section */}
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
            {filteredInvoices.map((inv, i) => (
               <div key={i} className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all relative overflow-hidden flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                     <span className="bg-emerald-50 text-emerald-900 px-4 py-1.5 rounded-full text-[11px] font-[900] uppercase tracking-tighter">#{inv.invoiceNo}</span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.invoiceDate}</span>
                  </div>
                  
                  <div className="space-y-1 mb-8">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Net Payable</p>
                     <p className="text-4xl font-[900] text-emerald-950 tracking-tighter italic">₹ {parseFloat(inv.invoiceTotalValue).toLocaleString('en-IN')}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Value</p>
                        <p className="text-sm font-black text-slate-900">₹{inv.invoiceValue}</p>
                     </div>
                     <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Tax Engine</p>
                        <p className="text-sm font-black text-slate-900">₹{inv.invoiceGSTValue}</p>
                     </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                     {inv.billPdfBase64 ? (
                        <Link
                          to={`/admin/invoice?no=${inv.invoiceNo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-black text-[10px] uppercase tracking-widest transition-all p-3 bg-red-50 rounded-2xl group-hover:scale-105"
                        >
                          <FaFilePdf size={14} /> Audit PDF
                        </Link>
                     ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Document</span>
                     )}
                     <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
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
                      <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Filing ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">Base Amount</th>
                      <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-center">Taxes & Fees</th>
                      <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-right">Net Payable</th>
                      <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-center">Document</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50/50">
                   {filteredInvoices.map((inv, i) => (
                      <tr key={i} className="hover:bg-emerald-50/30 transition-colors group text-sm">
                         <td className="px-8 py-6">
                            <span className="bg-white border border-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl text-[11px] font-[900] uppercase tracking-tight">#{inv.invoiceNo}</span>
                         </td>
                         <td className="px-8 py-6 font-black text-slate-800 text-[11px]">{inv.invoiceDate}</td>
                         <td className="px-8 py-6 font-[900] text-black">₹ {inv.invoiceValue}</td>
                         <td className="px-8 py-6 text-center">
                            <div className="flex flex-col items-center gap-1">
                               <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">GST: ₹{inv.invoiceGSTValue}</span>
                               <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">TRANS: ₹{inv.transportAmount || 0}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right font-black text-emerald-900 text-base tracking-tighter">₹ {inv.invoiceTotalValue}</td>
                         <td className="px-8 py-6 text-center">
                            {inv.billPdfBase64 ? (
                              <Link to={`/admin/invoice?no=${inv.invoiceNo}`} className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 font-black text-[10px] uppercase tracking-widest transition-all p-3 bg-red-50 rounded-2xl hover:scale-110" target="_blank" rel="noopener noreferrer"><FaFilePdf size={16} /> Open PDF</Link>
                            ) : (
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Doc</span>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {filteredInvoices.length === 0 && (
          <div className="p-32 text-center bg-white rounded-[3rem] border border-dashed border-gray-100 mt-8">
             <FaBoxOpen size={40} className="mx-auto text-emerald-50 mb-4" />
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No invoices found matching query</p>
          </div>
        )}

        {/* Pop-up Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal} />
             <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
                <div className="bg-emerald-600 p-8 text-white relative">
                   <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
                   <div className="relative flex items-center justify-between">
                      <div>
                         <h3 className="text-2xl font-[900] tracking-tight uppercase">Registry Studio</h3>
                         <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mt-1">Automatic ID & Math Verification</p>
                      </div>
                      <button onClick={closeModal} className="p-3 bg-black/10 hover:bg-black/20 rounded-2xl transition-all"><FaTimes size={18} /></button>
                   </div>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Invoice ID (Auto-Gen) *</label>
                         <input type="text" name="invoiceNo" value={invoiceData.invoiceNo} onChange={handleChange} className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-5 py-3.5 outline-none focus:bg-white focus:border-emerald-600 transition-all font-black text-emerald-950 text-sm shadow-inner" required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Filing Date *</label>
                         <div className="relative">
                           <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 opacity-40" />
                           <input type="date" name="invoiceDate" value={invoiceData.invoiceDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 outline-none focus:bg-white focus:border-emerald-600 transition-all font-black text-black text-sm" required />
                         </div>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Value (₹) *</label>
                         <input type="number" name="invoiceValue" value={invoiceData.invoiceValue} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none font-black text-black text-sm" required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">GST (₹) *</label>
                         <input type="number" name="invoiceGSTValue" value={invoiceData.invoiceGSTValue} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none font-black text-black text-sm" required />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Transit (₹)</label>
                         <input type="number" name="transportAmount" value={invoiceData.transportAmount} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none font-black text-black text-sm" />
                       </div>
                    </div>
                    <div className="bg-emerald-950 rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl relative overflow-hidden group">
                       <div className="absolute inset-0 bg-emerald-600/10 group-hover:scale-110 transition-transform duration-1000" />
                       <div className="relative">
                          <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1 flex items-center gap-2"><FaCalculator className="text-emerald-500" /> Total Net Payable</p>
                          <p className="text-3xl font-[900] tracking-tighter">₹ {parseFloat(invoiceData.invoiceTotalValue).toLocaleString('en-IN')}</p>
                       </div>
                       <div className="relative w-full md:w-auto">
                          <div className="relative group/file">
                             <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                             <div className="bg-white/10 hover:bg-white/20 border border-white/20 py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-3">
                                {invoiceData.billPdfBase64 ? <FaFilePdf className="text-red-400" /> : <FaCloudUploadAlt />}
                                <span className="text-[10px] font-black uppercase tracking-widest">{invoiceData.billPdfName ? `${invoiceData.billPdfName.slice(0, 15)}...` : 'Upload Bill'}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-[900] py-5 rounded-2xl shadow-xl shadow-emerald-100 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50">{loading ? 'Finalizing Registry...' : 'Commit Invoice to Ledger'}</button>
                 </form>
              </div>
           </div>
         )}
       </div>
     </div>
   );
 };
 
 export default Invoice;
