import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FaFileInvoiceDollar, FaPlus, FaList } from "react-icons/fa6";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: "",
    invoiceDate: "",
    invoiceValue: "",
    invoiceGSTValue: "",
    invoiceTotalValue: "",
    transportAmount: "",
    billPdfBase64: null,
    billPdfName: "",
  });

  const [invoices, setInvoices] = useState([]);
  const [view, setView] = useState("form");
  const [loading, setLoading] = useState(false);

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
      toast.error("Only PDF files are allowed!");
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

  const fetchInvoices = async () => {
    const querySnapshot = await getDocs(collection(db, "invoices"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInvoices(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!invoiceData.billPdfBase64) {
      toast.error("Please upload a bill (PDF only)");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "invoices"), {
        ...invoiceData,
        createdAt: new Date().toISOString(),
      });

      toast.success("Invoice submitted!");
      setInvoiceData({
        invoiceNo: "",
        invoiceDate: "",
        invoiceValue: "",
        invoiceGSTValue: "",
        invoiceTotalValue: "",
        transportAmount: "",
        billPdfBase64: null,
        billPdfName: "",
      });

      fetchInvoices();
      setView("table");
    } catch (error) {
      console.error("Firestore error:", error);
      toast.error("Failed to upload invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-3 md:p-6 min-h-screen bg-transparent animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-5 bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/60 shadow-xl shadow-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100 bg-gradient-to-tr from-green-600 to-green-500">
              <FaFileInvoiceDollar size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                Invoice Management <span className="text-gray-400 font-medium tracking-normal text-xl">Hub</span>
              </h1>
              <p className="text-xs font-black text-green-600 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                <span className="w-6 h-0.5 bg-green-500 rounded-full"></span>
                Business Invoice Control
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-gray-200/50 p-1.5 rounded-2xl shadow-inner backdrop-blur-sm border border-white/50">
          <button
            onClick={() => setView("view")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-500 font-black uppercase tracking-widest text-[11px] ${view === "view" ? "bg-white text-green-700 shadow-xl scale-105 border border-green-100" : "text-gray-500 hover:text-green-600"}`}
          >
            <FaList className={view === "view" ? "animate-bounce" : ""} size={14} /> View Invoices
          </button>
          <button
            onClick={() => setView("form")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-500 font-black uppercase tracking-widest text-[11px] ${view === "form" ? "bg-white text-green-700 shadow-xl scale-105 border border-green-100" : "text-gray-500 hover:text-green-600"}`}
          >
            <FaPlus className={view === "form" ? "animate-bounce" : ""} size={14} /> Add Invoice
          </button>
        </div>
      </div>

      <div className="animate-in slide-in-from-bottom-8 duration-700">
        {view === "form" ? (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100 ring-1 ring-green-50">
            <div className="bg-gradient-to-r from-green-600 via-green-500 to-green-500 p-6 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tight">Invoice Entry Studio</h2>
                <p className="opacity-90 font-medium mt-0.5 text-green-50 uppercase tracking-[0.2em] text-[10px]">
                  Upload and track your invoices
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "invoiceNo",
              "invoiceDate",
              "invoiceValue",
              "invoiceGSTValue",
              "invoiceTotalValue",
              "transportAmount",
            ].map((field, idx) => (
              <div key={idx}>
                <label className="text-xs font-black text-gray-700 uppercase tracking-tighter mb-2 block flex items-center gap-2">
                  <FaFileInvoiceDollar size={14} className="text-green-500" />
                  {field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
                  {field === "transportAmount" ? " (Optional)" : " *"}
                </label>
                <input
                  type={field === "invoiceDate" ? "date" : "number"}
                  name={field}
                  value={invoiceData[field]}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
                  required={field !== "transportAmount"}
                  placeholder={
                    field === "invoiceNo"
                      ? "Enter invoice number"
                      : field === "invoiceDate"
                        ? "Select invoice date"
                        : field === "invoiceValue"
                          ? "Enter base invoice amount"
                          : field === "invoiceGSTValue"
                            ? "Enter GST amount"
                            : field === "invoiceTotalValue"
                              ? "Enter total invoice value"
                              : field === "transportAmount"
                                ? "Enter transport charges (optional)"
                                : ""
                  }
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-2 block flex items-center gap-2">
              <FaFileInvoiceDollar size={14} className="text-green-500" />
              Upload Bill (PDF only) *
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full cursor-pointer bg-gray-50 border-2 border-transparent focus:border-green-500 rounded-xl px-4 py-2.5 outline-none transition-all font-bold text-sm text-gray-900"
            />
            {invoiceData.billPdfName && (
              <p className="text-sm text-green-600 mt-1 font-medium">
                {invoiceData.billPdfName}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Invoice"}
          </button>
        </form>
      </div>

      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-3xl border border-green-100 p-4">
          {invoices.length === 0 ? (
            <p className="text-gray-600 text-sm">No invoices found.</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="border px-3 py-2">Invoice No</th>
                  <th className="border px-3 py-2">Date</th>
                  <th className="border px-3 py-2">Value</th>
                  <th className="border px-3 py-2">GST</th>
                  <th className="border px-3 py-2">Total</th>
                  <th className="border px-3 py-2">Transport</th>
                  <th className="border px-3 py-2">Bill</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, index) => (
                  <tr key={index} className="text-sm text-center">
                    <td className="border px-3 py-2">{inv.invoiceNo}</td>
                    <td className="border px-3 py-2">{inv.invoiceDate}</td>
                    <td className="border px-3 py-2">₹{inv.invoiceValue}</td>
                    <td className="border px-3 py-2">₹{inv.invoiceGSTValue}</td>
                    <td className="border px-3 py-2">
                      ₹{inv.invoiceTotalValue}
                    </td>
                    <td className="border px-3 py-2">
                      ₹{inv.transportAmount || 0}
                    </td>
                    <td className="border px-3 py-2">
                      {inv.billPdfBase64 ? (
                        <Link
                          to={`/admin/invoice?no=${inv.invoiceNo}`}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </Link>
                      ) : (
                        <span className="text-gray-500">No File</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default Invoice;
