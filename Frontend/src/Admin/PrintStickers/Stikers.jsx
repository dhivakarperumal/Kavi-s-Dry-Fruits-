import CustomSelect from "../Common/CustomSelect";
import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import JsBarcode from "jsbarcode";
import {
  FaBarcode, FaPrint, FaPlus, FaTrash, FaEdit, FaEye,
  FaThLarge, FaBars, FaSearch, FaTimes, FaLayerGroup, FaCheck, FaSyncAlt
} from "react-icons/fa";

const Stickers = ({ adminData }) => {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Sticker Queue State\
  const [stickersList, setStickersList] = useState(() => {
    try {
      const saved = localStorage.getItem("kavi_stickers_queue");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewSticker, setPreviewSticker] = useState(null);

  // Form State
  const initialFormState = {
    productId: "",
    productName: "",
    price: "",
    barcode: "",
    packingDate: new Date().toISOString().split("T")[0],
    printQty: 1,
  };

  const [productInput, setProductInput] = useState(initialFormState);
  const [liveBarcodeImg, setLiveBarcodeImg] = useState("");

  const safeParse = (data) => {
    if (!data) return [];
    if (typeof data === "object") return data;
    try {
      const parsed = JSON.parse(data);
      return typeof parsed === "object" ? parsed : [];
    } catch {
      return [];
    }
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("kavi_stickers_queue", JSON.stringify(stickersList));
    } catch (err) {
      console.error("Failed to save stickers to localStorage:", err);
    }
  }, [stickersList]);

  // Load products list for Auto-Fill
  useEffect(() => {
    if (adminData && adminData.allProducts && adminData.allProducts.length > 0) {
      const prods = (adminData.allProducts || []).map((p) => {
        const variants = safeParse(p.variants);
        const firstVariant = variants[0] || {};
        return {
          id: p.id,
          productId: p.productId || "",
          name: p.name || "",
          barcode: p.barcode || p.barcodeValue || p.productId || "",
          price: firstVariant.offerPrice || firstVariant.price || "",
          type: "Single Product",
        };
      });

      const combos = (adminData.allCombos || []).map((c) => {
        const details = typeof c.comboDetails === "object" ? c.comboDetails : safeParse(c.comboDetails);
        return {
          id: c.id,
          productId: c.productId || "",
          name: c.name || "",
          barcode: c.barcode || c.barcodeValue || c.productId || "",
          price: details?.offerPrice || details?.price || "",
          type: "Combo Pack",
        };
      });

      setProductsList([...prods, ...combos]);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await api.get("/stickers/products");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProductsList(res.data);
        } else {
          const [prodRes, comboRes] = await Promise.allSettled([
            api.get("/products"),
            api.get("/combos"),
          ]);
          const prods = prodRes.status === "fulfilled" ? prodRes.value.data || [] : [];
          const combos = comboRes.status === "fulfilled" ? comboRes.value.data || [] : [];

          const unified = [
            ...prods.map((p) => ({
              id: p.id,
              productId: p.productId || "",
              name: p.name || "",
              barcode: p.barcode || p.barcodeValue || p.productId || "",
              type: "Single Product",
            })),
            ...combos.map((c) => ({
              id: c.id,
              productId: c.productId || "",
              name: c.name || "",
              barcode: c.barcode || c.barcodeValue || c.productId || "",
              type: "Combo Pack",
            })),
          ];
          setProductsList(unified);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [adminData]);

  // Live Barcode Preview generation in form
  useEffect(() => {
    if (!productInput.barcode && !productInput.productId) {
      setLiveBarcodeImg("");
      return;
    }

    const codeToRender = productInput.barcode || productInput.productId;
    try {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, codeToRender, {
        format: "CODE128",
        width: 2.2,
        height: 60,
        displayValue: true,
        fontSize: 13,
        margin: 6,
      });
      setLiveBarcodeImg(canvas.toDataURL("image/png"));
    } catch {
      setLiveBarcodeImg("");
    }
  }, [productInput.barcode, productInput.productId]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductInput((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-Fill Selection Handler
  const handleSelectExistingProduct = (e) => {
    const index = e.target.value;
    if (index === "") return;

    const selected = productsList[index];
    if (selected) {
      setProductInput((prev) => ({
        ...prev,
        productId: selected.productId || "",
        productName: selected.name || "",
        price: selected.price || prev.price || "",
        barcode: selected.barcode || selected.barcodeValue || selected.productId || "",
      }));
    }
  };

  // Quick Random / SKU Barcode Generator
  const handleGenerateBarcode = () => {
    if (productInput.productId) {
      setProductInput((prev) => ({ ...prev, barcode: prev.productId }));
    } else {
      const randomCode = "KAVI" + Math.floor(10000000 + Math.random() * 90000000);
      setProductInput((prev) => ({ ...prev, barcode: randomCode }));
    }
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingId(null);
    setProductInput({
      ...initialFormState,
      packingDate: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleEditSticker = (sticker) => {
    setEditingId(sticker.id);
    setProductInput({
      productId: sticker.productId || "",
      productName: sticker.productName || "",
      price: sticker.price || "",
      barcode: sticker.barcode || "",
      packingDate: sticker.packingDate || new Date().toISOString().split("T")[0],
      printQty: sticker.printQty || 1,
    });
    setIsModalOpen(true);
  };

  // Save Sticker (Add or Update)
  const handleSaveSticker = (e) => {
    e.preventDefault();
    const { productId, productName, price, barcode, packingDate, printQty } = productInput;

    if (!productName.trim()) {
      toast.error("Please enter product name");
      return;
    }
    if (!price || Number(price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!barcode.trim()) {
      toast.error("Please enter or generate a barcode code");
      return;
    }
    if (!packingDate) {
      toast.error("Please specify a label date");
      return;
    }
    if (!printQty || Number(printQty) < 1) {
      toast.error("Sticker quantity must be at least 1");
      return;
    }

    try {
      // Pre-render high quality barcode image
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, barcode, {
        format: "CODE128",
        width: 3,
        height: 80,
        displayValue: false,
        margin: 0,
      });
      const barcodeImgData = canvas.toDataURL("image/png");

      if (editingId) {
        // Update existing
        setStickersList((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                ...item,
                productId: productId.trim() || "MANUAL",
                productName: productName.trim(),
                price: Number(price),
                barcode: barcode.trim(),
                barcodeImg: barcodeImgData,
                packingDate,
                printQty: Number(printQty),
              }
              : item
          )
        );
        toast.success("Sticker updated successfully");
      } else {
        // Add new
        const newSticker = {
          id: `STK-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: productId.trim() || "MANUAL",
          productName: productName.trim(),
          price: Number(price),
          barcode: barcode.trim(),
          barcodeImg: barcodeImgData,
          packingDate,
          printQty: Number(printQty),
          createdAt: new Date().toISOString(),
        };

        setStickersList((prev) => [newSticker, ...prev]);
        toast.success("Sticker added to queue");
      }

      setIsModalOpen(false);
      setEditingId(null);
      setProductInput(initialFormState);
    } catch (err) {
      console.error("Barcode generation failed:", err);
      toast.error("Invalid barcode value. Could not generate barcode.");
    }
  };

  // Delete Single Sticker
  const handleDeleteSticker = (id) => {
    setStickersList((prev) => prev.filter((item) => item.id !== id));
    toast.success("Sticker removed from queue");
  };

  // Clear All Stickers
  const handleClearAll = () => {
    if (!window.confirm("Are you sure you want to clear all stickers from the queue?")) return;
    setStickersList([]);
    toast.success("Print queue cleared");
  };

  // Format Date for Display
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  // Filtered Stickers based on search
  const filteredStickers = useMemo(() => {
    if (!search.trim()) return stickersList;
    const query = search.toLowerCase();
    return stickersList.filter(
      (item) =>
        (item.productName && item.productName.toLowerCase().includes(query)) ||
        (item.productId && item.productId.toLowerCase().includes(query)) ||
        (item.barcode && item.barcode.toLowerCase().includes(query))
    );
  }, [stickersList, search]);

  // Pagination calculations
  const itemsPerPage = viewMode === "card" ? 12 : 10;
  const totalPages = Math.ceil(filteredStickers.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStickers.slice(start, start + itemsPerPage);
  }, [filteredStickers, currentPage, itemsPerPage]);

  const totalLabelsCount = useMemo(() => {
    return stickersList.reduce((sum, item) => sum + (Number(item.printQty) || 0), 0);
  }, [stickersList]);

  // Print Execution Engine
  const executePrint = (itemsToPrint, title = "Print Stickers") => {
    if (!itemsToPrint || itemsToPrint.length === 0) {
      toast.error("No stickers to print");
      return;
    }

    setLoading(true);

    const iframe = document.createElement("iframe");
    iframe.id = "print-iframe-" + Date.now();
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page { 
              size: auto; 
              margin: 4mm; 
            }
            * {
              box-sizing: border-box;
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0; 
              padding: 2mm; 
              background: #fff;
              color: #000;
            }
            .sticker-grid {
              display: grid;
              grid-template-columns: repeat(10, minmax(0, 1fr));
              gap: 4px;
              justify-content: center;
            }
            .sticker-card {
              width: 100%;
              min-width: 0;
              text-align: center;
              padding: 4px 3px;
              border: 0.5px solid #eaeaea;
              border-radius: 4px;
              background: #fff;
              page-break-inside: avoid;
            }
            .product-name {
              font-size: 8px;
              font-weight: 800;
              line-height: 1.1;
              color: #111;
              margin-bottom: 2px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .sku-tag {
              font-size: 7px;
              color: #555;
              font-weight: bold;
              margin-bottom: 2px;
              font-family: monospace;
            }
            .barcode-img {
              width: 100%;
              height: 38px;
              display: block;
              object-fit: contain;
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
            }
            .price-tag {
              font-weight: 900;
              font-size: 11px;
              margin-top: -2px;
              line-height: 1;
              color: #000;
              white-space: nowrap;
            }
            .date-tag {
              font-size: 8px;
              color: #111;
              margin-top: 1px;
              font-weight: 500;
              white-space: nowrap;
            }
          </style>
        </head>
        <body>
          <div class="sticker-grid">
    `);

    itemsToPrint.forEach((item) => {
      const qty = Number(item.printQty) || 1;
      for (let i = 0; i < qty; i++) {
        doc.write(`
          <div class="sticker-card">
            <img src="${item.barcodeImg}" class="barcode-img" onload="this.setAttribute('loaded', 'true')" />
            <div class="price-tag">MRP: ₹${item.price}</div>
            <div class="date-tag">${formatDate(item.packingDate)}</div>
          </div>
        `);
      }
    });

    doc.write(`
          </div>
        </body>
      </html>
    `);
    doc.close();

    const waitForImages = () => {
      const imgs = doc.querySelectorAll("img");
      const allLoaded = Array.from(imgs).every((img) => img.getAttribute("loaded") === "true");

      if (allLoaded || imgs.length === 0) {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          setLoading(false);
          toast.success("Printing triggered");
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 2000);
        }, 400);
      } else {
        setTimeout(waitForImages, 100);
      }
    };

    waitForImages();
  };

  // Print All Stickers in Queue
  const handlePrintAll = () => {
    if (stickersList.length === 0) {
      toast.error("No stickers in queue to print");
      return;
    }
    executePrint(stickersList, `Print All Stickers (${totalLabelsCount})`);
  };

  // Print Single Sticker
  const handlePrintSingle = (sticker) => {
    executePrint([sticker], `Print - ${sticker.productName}`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto mt-0">
        {/* Header Section (Modeled after /adminpanel/all-products) */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
          {/* Left: Search Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 pr-4">
            <div className="relative w-full max-w-xl">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search stickers by name, SKU, or barcode..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all font-black text-black text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Controls (Matching /adminpanel/all-products) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${viewMode === "card"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-emerald-600"
                  }`}
                title="Card View"
              >
                <FaThLarge size={14} />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${viewMode === "table"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-emerald-600"
                  }`}
                title="Table View"
              >
                <FaBars size={14} />
              </button>
            </div>

            {/* Clear Queue Button */}
            {/* {stickersList.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-5 py-3.5 bg-white border border-rose-200 text-rose-600 rounded-2xl font-black text-xs transition-all hover:bg-rose-50 shadow-sm uppercase tracking-widest cursor-pointer"
                title="Clear entire queue"
              >
                <FaTrash size={12} /> Clear
              </button>
            )} */}

            {/* Print All Barcodes Button */}
            {/* <button
              onClick={handlePrintAll}
              disabled={stickersList.length === 0 || loading}
              className="flex items-center gap-2 px-6 py-3.5 bg-white border border-emerald-200 text-emerald-600 rounded-2xl font-black text-xs transition-all hover:bg-emerald-50 shadow-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaPrint size={12} /> {loading ? "Generating..." : `Barcodes (${totalLabelsCount})`}
            </button> */}

            {/* Add Stickers Button */}
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest cursor-pointer"
            >
              <FaPlus size={12} /> Add Sticker
            </button>
          </div>
        </div>

        {/* Quick Summary / Status Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Sticker Types</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{stickersList.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FaBarcode size={18} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total Copies</p>
              <p className="text-xl font-black text-emerald-600 mt-0.5">{totalLabelsCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FaPrint size={16} />
            </div>
          </div>

         

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Filtered Count</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{filteredStickers.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center font-bold">
              <FaLayerGroup size={16} />
            </div>
          </div>
        </div>

        {/* Content Section: Table View or Card View */}
        {stickersList.length === 0 ? (
          /* Empty Queue State */
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-inner">
              <FaBarcode size={44} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              No Stickers in Print Queue
            </h3>
            <p className="text-xs text-slate-500 font-bold max-w-md mx-auto mb-8 leading-relaxed">
              Add products, combos, or custom barcodes to prepare labels. You can toggle between table and card views, customize print quantities, and print labels anytime.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest cursor-pointer"
            >
              <FaPlus size={14} /> Add First Sticker
            </button>
          </div>
        ) : filteredStickers.length === 0 ? (
          /* Search Empty State */
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-base font-black text-slate-800 mb-1">No matching stickers found</p>
            <p className="text-xs text-slate-400 mb-4">Try clearing or changing your search term</p>
            <button
              onClick={() => setSearch("")}
              className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-black text-xs hover:bg-emerald-100 transition-all uppercase tracking-wider cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : viewMode === "card" ? (
          /* Card View (Reference: Allproduct.jsx Card Grid) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
            {currentItems.map((sticker) => (
              <div
                key={sticker.id}
                className="group bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100/50 hover:shadow-xl transition-all relative overflow-hidden flex flex-col h-full"
              >
                {/* Barcode Mockup Box */}
                <div
                  className="relative h-48 w-full flex flex-col items-center justify-center rounded-[2rem] overflow-hidden bg-slate-50/70 mb-4 p-4 border border-slate-100 cursor-pointer group-hover:bg-emerald-50/20 group-hover:border-emerald-200 transition-all"
                  onClick={() => setPreviewSticker(sticker)}
                  title="Click to preview full label"
                >
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter text-white shadow-sm bg-emerald-600">
                    {sticker.printQty} {sticker.printQty === 1 ? "Label" : "Labels"}
                  </span>
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg text-[8px] font-black bg-white/90 text-slate-500 border border-gray-100 shadow-sm">
                    {formatDate(sticker.packingDate)}
                  </span>

                  <div className="w-full flex flex-col items-center justify-center mt-4">
                    {sticker.barcodeImg ? (
                      <img
                        src={sticker.barcodeImg}
                        alt={sticker.barcode}
                        className="h-16 w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <FaBarcode size={38} className="text-slate-300" />
                    )}
                    <span className="font-mono text-[10px] text-slate-500 mt-2 font-bold tracking-widest">
                      {sticker.barcode}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="mb-4 text-center">
                  <h4 className="text-base font-[900] text-slate-950 truncate mb-1" title={sticker.productName}>
                    {sticker.productName}
                  </h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    ID: {sticker.productId || "MANUAL"}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-base font-black text-slate-950 uppercase tracking-widest">
                      ₹ {sticker.price}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons (Identical to Allproduct.jsx Card Actions) */}
                <div className="mt-auto flex items-center justify-center gap-3 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => setPreviewSticker(sticker)}
                    title="Preview Sticker"
                    className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all border border-transparent hover:border-emerald-700 shadow-sm cursor-pointer"
                  >
                    <FaEye size={12} />
                  </button>
                  <button
                    onClick={() => handlePrintSingle(sticker)}
                    title="Print Label"
                    className="p-3 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all border border-transparent hover:border-emerald-700 shadow-sm cursor-pointer"
                  >
                    <FaPrint size={12} />
                  </button>
                  <button
                    onClick={() => handleEditSticker(sticker)}
                    title="Edit Details"
                    className="p-3 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-2xl transition-all border border-transparent hover:border-blue-700 shadow-sm cursor-pointer"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteSticker(sticker.id)}
                    title="Remove Sticker"
                    className="p-3 bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all border border-transparent hover:border-red-700 shadow-sm cursor-pointer"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View (Reference: Allproduct.jsx Table Layout) */
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#009669] border-b border-emerald-700">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-center">
                    S.No
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">
                    Barcode
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">
                    Product Details
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">
                    Price
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest">
                    Label Date
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-center">
                    Print Qty
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-white uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.map((sticker, index) => (
                  <tr key={sticker.id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-8 py-6 font-black text-slate-400 text-[10px] text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-8 py-6">
                      <div
                        onClick={() => setPreviewSticker(sticker)}
                        className="w-32 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center border border-gray-100 shadow-sm cursor-pointer hover:border-emerald-300 transition-all"
                        title="Click to preview label"
                      >
                        {sticker.barcodeImg ? (
                          <img
                            src={sticker.barcodeImg}
                            alt={sticker.barcode}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <FaBarcode size={20} className="text-slate-300" />
                        )}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 mt-1 block tracking-wider">
                        {sticker.barcode}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-[220px]">
                        <p className="font-black text-slate-950 text-sm mb-0.5 truncate" title={sticker.productName}>
                          {sticker.productName}
                        </p>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                          #{sticker.productId || "MANUAL"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 text-sm">
                      ₹ {sticker.price}
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600 text-xs">
                      {formatDate(sticker.packingDate)}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-black text-xs">
                        {sticker.printQty} Pcs
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => setPreviewSticker(sticker)}
                          title="Preview Sticker"
                          className="p-2.5 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-transparent shadow-sm hover:shadow-emerald-200 cursor-pointer"
                        >
                          <FaEye size={11} />
                        </button>
                        <button
                          onClick={() => handlePrintSingle(sticker)}
                          title="Print This Sticker"
                          className="p-2.5 bg-slate-50 text-slate-400 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-transparent shadow-sm hover:shadow-emerald-200 cursor-pointer"
                        >
                          <FaPrint size={11} />
                        </button>
                        <button
                          onClick={() => handleEditSticker(sticker)}
                          title="Edit Details"
                          className="p-2.5 bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-transparent shadow-sm hover:shadow-blue-200 cursor-pointer"
                        >
                          <FaEdit size={11} />
                        </button>
                        <button
                          onClick={() => handleDeleteSticker(sticker.id)}
                          title="Delete Sticker"
                          className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-transparent shadow-sm hover:shadow-red-200 cursor-pointer"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Print Barcodes Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handlePrintAll}
            disabled={stickersList.length === 0 || loading}
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaPrint size={13} />
            {loading ? "Generating..." : `Print Barcodes (${totalLabelsCount})`}
          </button>
        </div>

        {/* Pagination (Reference: Allproduct.jsx Pagination) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10 pb-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-2xl font-black text-xs transition-all cursor-pointer ${currentPage === page
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-white text-slate-400 border border-gray-100 hover:border-emerald-200"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* POPUP MODAL: Add / Edit Sticker Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-emerald-950/30 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden my-6 border border-emerald-50 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 p-6 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl pointer-events-none" />
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer z-20"
              >
                <FaTimes size={14} />
              </button>
              <div className="relative z-10 pr-10">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2.5">
                  <FaBarcode size={20} />
                  {editingId ? "Edit Sticker Details" : "Add Sticker to Queue"}
                </h2>
                <p className="opacity-90 font-medium mt-1 text-emerald-50 uppercase tracking-[0.2em] text-[10px]">
                  Configure barcode label parameters & quantity
                </p>
              </div>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveSticker} className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Auto-Fill from existing catalog (only when adding new) */}
              {!editingId && productsList.length > 0 && (
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FaBarcode size={12} className="text-emerald-600" /> Auto-Fill from Products / Combos
                  </label>
                  <CustomSelect
                    value=""
                    onChange={handleSelectExistingProduct}
                    placeholder="-- Choose Existing Product or Combo --"
                    searchable={true}
                    className="w-full"
                    buttonClassName="w-full bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 focus:border-emerald-500 rounded-2xl px-4 py-3 outline-none transition-all font-bold text-sm text-gray-900 shadow-sm"
                    options={[
                      { value: "", label: "-- Choose Existing Product or Combo --" },
                      ...productsList.map((p, index) => ({
                        value: index,
                        label: `${p.productId ? `[${p.productId}] ` : ""}${p.name} (${p.type})`,
                      })),
                    ]}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 block">
                    Product / Combo Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={productInput.productName}
                    onChange={handleChange}
                    placeholder="e.g. Premium California Almonds"
                    required
                    className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-bold text-sm text-gray-900"
                  />
                </div>

                {/* SKU / Product ID */}
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 block">
                    SKU / Identifier
                  </label>
                  <input
                    type="text"
                    name="productId"
                    value={productInput.productId}
                    onChange={handleChange}
                    placeholder="e.g. ALM-001"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-bold text-sm text-gray-900 font-mono"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 block">
                    MRP / Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={productInput.price}
                    onChange={handleChange}
                    placeholder="e.g. 299"
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-bold text-sm text-gray-900"
                  />
                </div>

                {/* Barcode Code */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider">
                      Barcode Code <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateBarcode}
                      className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <FaSyncAlt size={9} /> Auto-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    name="barcode"
                    value={productInput.barcode}
                    onChange={handleChange}
                    placeholder="Enter or generate barcode"
                    required
                    className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-bold text-sm text-gray-900 font-mono"
                  />
                </div>

                {/* Label Date */}
                <div>
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 block">
                    Label / Packing Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="packingDate"
                    value={productInput.packingDate}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-bold text-sm text-gray-900"
                  />
                </div>

                {/* Print Quantity */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider mb-2 block">
                    Stickers Count (Print Quantity) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setProductInput((prev) => ({
                          ...prev,
                          printQty: Math.max(1, (Number(prev.printQty) || 1) - 1),
                        }))
                      }
                      className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 font-black text-gray-700 flex items-center justify-center transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="printQty"
                      value={productInput.printQty}
                      onChange={handleChange}
                      min="1"
                      required
                      className="flex-1 bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all font-black text-center text-lg text-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setProductInput((prev) => ({
                          ...prev,
                          printQty: (Number(prev.printQty) || 0) + 1,
                        }))
                      }
                      className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 font-black text-gray-700 flex items-center justify-center transition-all cursor-pointer"
                    >
                      +
                    </button>
                    <div className="flex gap-1.5">
                      {[10, 20, 50].map((quickQty) => (
                        <button
                          key={quickQty}
                          type="button"
                          onClick={() => setProductInput((prev) => ({ ...prev, printQty: quickQty }))}
                          className="px-3 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-black text-xs transition-all cursor-pointer"
                        >
                          +{quickQty}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Barcode Preview Box */}
              {liveBarcodeImg && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 text-center">
                    Live Barcode Label Mockup
                  </p>
                  <div className="max-w-[200px] mx-auto bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-center">
                    <p className="text-[9px] font-bold text-gray-800 truncate mb-1">
                      {productInput.productName || "Product Name"}
                    </p>
                    <div className="flex justify-center mb-1">
                      <img src={liveBarcodeImg} alt="Barcode Preview" className="h-12 object-contain" />
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-black px-1 text-gray-700">
                      <span>MRP: ₹{productInput.price || "0"}</span>
                      <span>{formatDate(productInput.packingDate)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-gray-500 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {editingId ? <FaCheck size={12} /> : <FaPlus size={12} />}
                  {editingId ? "Update Sticker" : "Add to Print Queue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Sticker Detail / Label Preview Modal (Reference: Allproduct.jsx Product Detail Modal) */}
      {previewSticker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-emerald-950/30 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setPreviewSticker(null)}
          />
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-500 border border-emerald-50">
            {/* Close Button */}
            <button
              onClick={() => setPreviewSticker(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-white/70 backdrop-blur border border-gray-100 flex items-center justify-center text-slate-400 hover:text-red-500 z-50 transition-all shadow-sm cursor-pointer"
            >
              <FaTimes size={14} />
            </button>

            <div className="p-8 md:p-10 space-y-6">
              <div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                  Sticker Spec Sheet
                </span>
                <h2 className="text-2xl font-[900] text-slate-950 tracking-tight mt-1">
                  {previewSticker.productName}
                </h2>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                  SKU / Identifier: {previewSticker.productId || "MANUAL"}
                </p>
              </div>

              {/* Realistic Label Card Preview */}
              <div className="bg-gradient-to-b from-gray-50 to-slate-100 p-6 rounded-3xl border border-gray-200 flex flex-col items-center justify-center shadow-inner">
                <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-gray-300 shadow-md text-center max-w-xs w-full">
                  <p className="text-xs font-black text-gray-900 tracking-tight mb-1">
                    {previewSticker.productName}
                  </p>
                  <p className="text-[9px] font-mono text-gray-500 font-bold mb-2">
                    {previewSticker.productId || "MANUAL"}
                  </p>
                  <div className="flex justify-center my-2">
                    {previewSticker.barcodeImg ? (
                      <img
                        src={previewSticker.barcodeImg}
                        alt={previewSticker.barcode}
                        className="h-20 w-full object-contain"
                      />
                    ) : (
                      <FaBarcode size={48} className="text-slate-300" />
                    )}
                  </div>
                  <p className="font-mono text-xs font-bold text-gray-600 tracking-widest mb-2">
                    {previewSticker.barcode}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-xs font-black text-gray-900">
                    <span className="text-emerald-700 text-base">MRP: ₹{previewSticker.price}</span>
                    <span className="text-gray-500 text-[10px]">
                      Date: {formatDate(previewSticker.packingDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Print Copies
                  </p>
                  <p className="text-xl font-black text-slate-950">
                    {previewSticker.printQty} Stickers
                  </p>
                </div>
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                    Label Value
                  </p>
                  <p className="text-xl font-black text-emerald-700">
                    ₹{previewSticker.price}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    const toPrint = previewSticker;
                    setPreviewSticker(null);
                    handlePrintSingle(toPrint);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-100 uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaPrint size={14} /> Print This Sticker Now
                </button>
                <button
                  onClick={() => {
                    const toEdit = previewSticker;
                    setPreviewSticker(null);
                    handleEditSticker(toEdit);
                  }}
                  className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaEdit size={14} /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stickers;
