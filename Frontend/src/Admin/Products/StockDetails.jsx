import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const StockDetail = () => {
  const [viewMode, setViewMode] = useState("add");
  const [form, setForm] = useState({
    productId: "",
    productName: "",
    productCategory: "",
    currentQuantity: "",
    invoiceNumber: "",
  });
  const [isCombo, setIsCombo] = useState(false);
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  const [liveStocks, setLiveStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // number of rows per page

  // Fetch invoices and products
  const fetchStocks = async () => {
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
      console.error(e);
      toast.error("Failed to load live stocks");
    }
  };

  useEffect(() => {
    const unsubInvoice = onSnapshot(collection(db, "invoices"), (snap) => {
      const invoices = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInvoiceNumbers(invoices);
    });

    fetchStocks();

    return () => {
      unsubInvoice();
    };
  }, []);

  // Handle product ID selection
  const handleProductIdChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, productId: value });
    if (!value.trim()) return;

    const matched = liveStocks.find(
      (item) => item.productId === value.trim()
    );

    if (matched) {
      setIsCombo(matched.type === 'combo');
      setForm((prev) => ({
        ...prev,
        productName: matched.name || "",
        productCategory: matched.category || "",
        currentQuantity: "",
      }));
    } else {
      toast.warning("Product not found");
      setForm((prev) => ({
        ...prev,
        productName: "",
        productCategory: "",
        currentQuantity: "",
      }));
      setIsCombo(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const matched = liveStocks.find(
        (item) => item.productId === form.productId.trim()
      );
      if (!matched) return toast.error("Product not found in database.");

      const existingStock = Number(matched.totalStock) || 0;
      const addedQuantity = isCombo
        ? parseInt(form.currentQuantity)
        : parseInt(form.currentQuantity) * 1000;
      const newStock = existingStock + addedQuantity;

      const endpoint = matched.type === 'combo' ? `/combos/${matched.id}` : `/products/${matched.id}`;
      
      const updatedProduct = {
        ...matched,
        totalStock: String(newStock),
        lastInvoice: form.invoiceNumber
      };

      await api.put(endpoint, updatedProduct);

      await addDoc(collection(db, "stockRecords"), {
        ...form,
        addedQuantity,
        finalStock: newStock,
        timestamp: Timestamp.now(),
      });

      toast.success("Stock updated and invoice saved!");
      setForm({
        productId: "",
        productName: "",
        productCategory: "",
        currentQuantity: "",
        invoiceNumber: "",
      });
      setIsCombo(false);
      fetchStocks();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Error submitting stock detail");
    }
  };

  // Search and pagination logic
  const filteredStocks = liveStocks.filter(
    (item) =>
      item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const paginatedStocks = filteredStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="relative p-6  rounded mt-10">
      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-4 mb-6 justify-end">
        <button
          onClick={() => setViewMode("add")}
          className={`px-4 py-2 rounded font-semibold ${
            viewMode === "add" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Add Stock
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded font-semibold ${
            viewMode === "list" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Show Live Stock
        </button>
      </div>

      {viewMode === "add" ? (
        <form onSubmit={handleSubmit} className="grid shadow-2xl p-10 rounded md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Product ID</label>
            <select
              name="productId"
              value={form.productId}
              onChange={handleProductIdChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Select Product ID</option>
              {liveStocks.map((item) => (
                <option key={item.id} value={item.productId}>
                  {item.productId} - {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold">Product Name</label>
            <input
              type="text"
              name="productName"
              value={form.productName}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="font-semibold">Product Category</label>
            <input
              type="text"
              name="productCategory"
              value={form.productCategory}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="font-semibold">
              Quantity ({isCombo ? "in pcs" : "in kg"})
            </label>
            <input
              type="number"
              min="0"
              name="currentQuantity"
              value={form.currentQuantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="font-semibold">Invoice Number</label>
            <select
              name="invoiceNumber"
              value={form.invoiceNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Select Invoice</option>
              {invoiceNumbers.map((inv) => (
                <option key={inv.id} value={inv.invoiceNo}>
                  {inv.invoiceNo}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mt-4 cursor-pointer"
            >
              Submit Stock Detail
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by ID, Name, Category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 w-full md:w-1/3 border px-3 py-2 rounded"
          />

          <div className="bg-white shadow rounded-2xl overflow-x-auto">
            <table className="min-w-full text-sm rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
                <tr>
                  <th className="px-3 py-4">Product ID</th>
                  <th className="px-3 py-4">Name</th>
                  <th className="px-3 py-4">Category</th>
                  <th className="px-3 py-4">Current Stock</th>
                  <th className="px-3 py-4">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStocks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No stock data found.
                    </td>
                  </tr>
                ) : (
                  paginatedStocks.map((item) => (
                    <tr key={item.id} className="text-center">
                      <td className="px-3 py-4">{item.productId}</td>
                      <td className="px-3 py-4">{item.name}</td>
                      <td className="px-3 py-4">{item.category}</td>
                      <td className="px-3 py-4">
                        {item.type === 'combo'
                          ? `${item.totalStock || 0} pcs`
                          : `${(Number(item.totalStock) || 0) / 1000} kg`}
                      </td>
                      <td className="px-3 py-4">
                        {item.lastInvoice ? (
                          <Link
                            to={`/admin/invoice?no=${item.lastInvoice}`}
                            className="text-blue-600 hover:underline text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Invoice
                          </Link>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetail;
