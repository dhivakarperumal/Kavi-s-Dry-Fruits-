import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiSearch,
  FiClock,
  FiLayout,
  FiGrid,
} from "react-icons/fi";
import api from "../../services/api";
import { FaBars, FaThLarge } from "react-icons/fa";

const ContactFormSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact-form");
      const items = response.data || [];
      setSubmissions(items);
      setFilteredSubmissions(items);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      toast.error("Unable to load form submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    const filtered = submissions.filter((item) => {
      if (!query) return true;
      const fields = [
        item.name,
        item.email,
        item.phone,
        item.subject,
        item.address,
        item.message,
        item.source,
      ].filter(Boolean).join(" ").toLowerCase();
      return fields.includes(query);
    });

    setFilteredSubmissions(filtered);
  }, [search, submissions]);

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleString();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 pr-4">
            <div className="relative w-full max-w-xl">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contact entries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-black text-black text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2.5 rounded-xl transition-all ${viewMode === "card" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-emerald-600"}`}
                title="Card View"
              >
                <FaThLarge size={14} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 rounded-xl transition-all ${viewMode === "table" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-emerald-600"}`}
                title="Table View"
              >
                <FaBars size={14} />
              </button>
            </div>

           
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-64 bg-white border border-gray-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-12 text-center text-gray-600">
            <p className="text-xl font-bold text-gray-800">No contact submissions found</p>
            <p className="mt-2 text-sm text-gray-500">Try a different search or submit a new enquiry from the contact page.</p>
          </div>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSubmissions.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{item.name || "Customer"}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                      {item.subject || "Contact Form"}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
                    {item.source || "website"}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-emerald-600" />
                    <span className="truncate">{item.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-emerald-600" />
                    <span>{item.phone || "No phone"}</span>
                  </div>
                  {item.address && (
                    <div className="flex items-start gap-2">
                      <FiMapPin className="text-emerald-600 mt-0.5" />
                      <span className="break-words">{item.address}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <FiMessageSquare className="text-emerald-600 mt-0.5" />
                    <p className="whitespace-pre-wrap break-words">{item.message || "No message provided"}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><FiClock size={11} /> {formatDate(item.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#009669] border-b border-emerald-700">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest">Subject</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest">Phone</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest">Address</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest">Message</th>
                  <th className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors align-top">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-black text-slate-900">{item.name || "Customer"}</p>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                          {item.source || "website"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700">{item.subject || "Contact Form"}</td>
                    <td className="px-6 py-5 text-sm text-slate-700 max-w-[220px] break-words">{item.email || "No email"}</td>
                    <td className="px-6 py-5 text-sm text-slate-700">{item.phone || "No phone"}</td>
                    <td className="px-6 py-5 text-sm text-slate-700 max-w-[220px] break-words">{item.address || "—"}</td>
                    <td className="px-6 py-5 text-sm text-slate-700 max-w-[260px] break-words whitespace-pre-wrap">{item.message || "No message provided"}</td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-500">{formatDate(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactFormSubmissions;
