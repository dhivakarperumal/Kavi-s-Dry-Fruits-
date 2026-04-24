import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

const ViewInvoice = () => {
  const [searchParams] = useSearchParams();
  const invoiceNo = searchParams.get("no");

  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const response = await api.get("/invoices");
        const matched = response.data.find(
          (inv) => inv.invoiceNo === invoiceNo
        );
        if (matched) {
          setInvoiceData(matched);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    if (invoiceNo) fetchInvoice();
  }, [invoiceNo]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Invoice Viewer</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : !invoiceNo ? (
        <p className="text-center text-red-500">No invoice number provided.</p>
      ) : !invoiceData ? (
        <p className="text-center text-red-500">
          Invoice <strong>{invoiceNo}</strong> not found.
        </p>
      ) : (
        <div className="text-center">
          <p className="text-gray-700 mb-2">
            Viewing invoice for: <strong>{invoiceNo}</strong>
          </p>
          {(invoiceData.dealerName || invoiceData.dealerId) && (
            <p className="text-sm text-gray-500 mb-4">
              Dealer: <strong>{invoiceData.dealerName || "Unknown"}</strong> {invoiceData.dealerId && `(${invoiceData.dealerId})`}
            </p>
          )}
          {(invoiceData.items && JSON.parse(invoiceData.items).length > 0) && (
            <div className="max-w-4xl mx-auto mb-8 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                     <tr>
                        <th className="px-6 py-3 font-bold text-gray-600">Product</th>
                        <th className="px-6 py-3 font-bold text-gray-600 text-center">Qty</th>
                        <th className="px-6 py-3 font-bold text-gray-600 text-right">Price</th>
                        <th className="px-6 py-3 font-bold text-gray-600 text-right">Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {JSON.parse(invoiceData.items).map((item, idx) => (
                        <tr key={idx}>
                           <td className="px-6 py-3 font-medium text-gray-800">{item.productName}</td>
                           <td className="px-6 py-3 text-center text-gray-600">{item.qty}</td>
                           <td className="px-6 py-3 text-right text-gray-600">₹{parseFloat(item.price).toFixed(2)}</td>
                           <td className="px-6 py-3 text-right font-bold text-emerald-700">₹{(item.qty * item.price).toFixed(2)}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}
          {invoiceData.billPdfBase64 ? (
            <iframe
              title="Invoice PDF"
              src={`data:application/pdf;base64,${invoiceData.billPdfBase64}`}
              className="w-full h-[80vh] border rounded-2xl shadow-inner"
            />
          ) : (
            <p className="text-red-500">No PDF attached for this invoice.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewInvoice;
