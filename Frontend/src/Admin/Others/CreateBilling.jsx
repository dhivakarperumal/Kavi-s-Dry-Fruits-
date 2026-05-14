import React, { useState, useEffect, useRef, useMemo } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ImSpinner8 } from "react-icons/im";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { 
  FiMic, FiMaximize, FiTrash2, FiPlus, FiPrinter, FiSearch, 
  FiPackage, FiCamera, FiX, FiUser, FiCreditCard, FiShoppingBag,
  FiMinusCircle, FiPlusCircle
} from "react-icons/fi";
import { Html5QrcodeScanner } from "html5-qrcode";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal", "Andaman & Nicobar", "Chandigarh",
  "Dadra & Nagar Haveli", "Daman & Diu", "Lakshadweep", "Puducherry",
];

const BASE_URL = "http://localhost:5000"; // Should ideally come from config or env

const CreateBilling = () => {
  const navigate = useNavigate();
  const [expandAddress, setExpandAddress] = useState(false);
  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    gst: "",
    shippingAddress: {
      street: "",
      city: "",
      state: "Tamil Nadu",
      zip: "",
      country: "India",
    },
    customerType: "Shop Customer",
    paymentMode: "Cash",
  });

  const [shippingCharge, setShippingCharge] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState({
    id: "",
    name: "",
    price: 0,
    quantity: 1,
    weight: "",
    priceMap: {},
    weights: [],
    category: "",
    gst: 0,
  });
  
  const [productList, setProductList] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");

  // ---------------- Calculations ----------------
  const totals = useMemo(() => {
    const subtotal = invoiceItems.reduce((acc, item) => acc + item.total, 0);
    const gstTotal = invoiceItems.reduce((acc, item) => acc + (item.gst || 0), 0);
    const finalTotal = subtotal + gstTotal + Number(shippingCharge);
    return { subtotal, gstTotal, finalTotal };
  }, [invoiceItems, shippingCharge]);

  // ---------------- Order ID generation ----------------
  const generateOrderId = async () => {
    try {
      const res = await api.get("/orders");
      const ordOrders = (res.data || []).filter(o => String(o.orderId || "").startsWith("ORD"));
      const orderNumber = ordOrders.length + 1;
      return `ORD${String(orderNumber).padStart(4, "0")}`;
    } catch (err) {
      console.error("generateOrderId error:", err);
      return `ORD${Date.now()}`;
    }
  };

  useEffect(() => {
    Promise.all([
      api.get("/products"),
      api.get("/combos")
    ]).then(([prodRes, comboRes]) => {
      const prods = (prodRes.data || []).map(p => ({ ...p, type: 'single' }));
      const combos = (comboRes.data || []).map(c => ({ ...c, type: 'combo', category: 'Combo' }));
      setProductList([...prods, ...combos]);
    }).catch(err => {
      console.error("Fetch products/combos error", err);
      toast.error("Failed to load inventory");
    });
  }, []);

  // ---------------- Barcode Scanner Logic ----------------
  const barcodeBufferRef = useRef("");
  const lastKeyTimeRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTimeRef.current;
      lastKeyTimeRef.current = currentTime;

      if (e.key === "Enter") {
        const finalCode = barcodeBufferRef.current.trim();
        if (finalCode.length > 2) {
          handleBarcodeScan(finalCode);
        }
        barcodeBufferRef.current = "";
        return;
      }

      if (timeDiff > 100) {
        barcodeBufferRef.current = "";
      }

      const target = e.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.key.length === 1) {
        barcodeBufferRef.current += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productList]);

  const handleBarcodeScan = (code) => {
    const product = productList.find((p) => String(p.productId) === code || String(p.barcode) === code);
    if (product) {
      handleProductSelect(product.productId);
      toast.success(`Scanned: ${product.name}`);
    } else {
      toast.error("Product not found: " + code);
    }
  };

  // ---------------- Voice Search Logic ----------------
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const matched = productList.find(p => p.name.toLowerCase().includes(transcript));
      if (matched) {
        handleProductSelect(matched.productId);
      } else {
        toast.error("No match: " + transcript);
      }
    };
    recognition.start();
  };

  // ---------------- Camera Scanner ----------------
  useEffect(() => {
    let scanner = null;
    if (showCamera) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });
      scanner.render(
        (decodedText) => {
          handleBarcodeScan(decodedText);
          setShowCamera(false);
          scanner.clear();
        },
        () => {}
      );
    }
    return () => { if (scanner) scanner.clear().catch(e => console.error(e)); };
  }, [showCamera]);

  // ---------------- Client Auto-fill ----------------
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!client.phone || client.phone.length < 10) return;
      try {
        const res = await api.get("/orders");
        const deliveries = res.data.filter((entry) => entry.clientPhone === client.phone);
        if (deliveries.length > 0) {
          const latest = deliveries[0];
          const addr = typeof latest.shippingAddress === 'string' ? JSON.parse(latest.shippingAddress) : (latest.shippingAddress || {});
          setClient((prev) => ({
            ...prev,
            name: latest.clientName || "",
            email: latest.email || "",
            gst: latest.clientGST || "",
            customerType: latest.customerType || "Shop Customer",
            paymentMode: latest.paymentMode || "Cash",
            shippingAddress: {
              street: addr.street || "",
              city: addr.city || "",
              state: addr.state || "Tamil Nadu",
              zip: addr.zip || "",
              country: addr.country || "India",
            },
          }));
          toast.success("Client details restored.");
        }
      } catch (e) { }
    }, 800);
    return () => clearTimeout(delayDebounce);
  }, [client.phone]);

  const calculatePrice = (priceMap, weight, isCombo, product = null) => {
    let price = 0;
    if (isCombo && product) {
      price = product.offerPrice || product.mrp || priceMap?.["combo"] || 0;
    } else {
      const priceObj = priceMap[weight];
      if (typeof priceObj === "object" && priceObj !== null) {
        price = priceObj.offerPrice || priceObj.mrp || priceObj.price || 0;
      } else if (typeof priceObj === "number") {
        price = priceObj;
      } else {
        const firstVal = Object.values(priceMap || {})[0];
        price = (typeof firstVal === 'object' ? (firstVal?.offerPrice || firstVal?.mrp || firstVal?.price) : firstVal) || 0;
      }
    }
    return Number(price);
  };

  const handleProductSelect = (id) => {
    const product = productList.find((p) => p.productId === id);
    if (!product) return;

    const isCombo = product.category === "Combo";
    let variants = [];
    try {
      variants = typeof product.variants === 'string' ? JSON.parse(product.variants) : (product.variants || []);
    } catch (e) { console.error(e); }

    let priceMap = product.prices || {};
    if (Object.keys(priceMap).length === 0 && variants.length > 0) {
      variants.forEach(v => {
        if (v.weight) {
          priceMap[v.weight] = {
            offerPrice: parseFloat(v.offerPrice || v.price || 0),
            mrp: parseFloat(v.mrp || v.price || 0)
          };
        }
      });
    }

    const defaultWeight = isCombo ? "combo" : (variants[0]?.weight || "");
    let defaultPrice = isCombo ? 
      (product.offerPrice || product.mrp || 0) : 
      calculatePrice(priceMap, defaultWeight, false);

    const getProductImage = () => {
      let imgs = [];
      try {
        if (typeof product.images === 'string' && product.images.startsWith('[')) imgs = JSON.parse(product.images);
        else if (Array.isArray(product.images)) imgs = product.images;
        else if (product.image) {
          if (typeof product.image === 'string' && product.image.startsWith('[')) imgs = JSON.parse(product.image);
          else imgs = [product.image];
        }
      } catch (e) { imgs = [product.image]; }
      const rawImg = imgs[0] || product.image || "";
      if (!rawImg) return "";
      if (rawImg.startsWith('http') || rawImg.startsWith('data:')) return rawImg;
      return `${BASE_URL}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
    };

    setSelectedProduct({
      id: product.productId,
      dbId: product.id,
      name: product.name,
      category: product.category || "",
      image: getProductImage(),
      primaryImage: getProductImage(),
      weights: variants.map(v => v.weight),
      comboProducts: typeof product.comboItems === 'string' ? JSON.parse(product.comboItems) : (product.comboItems || []),
      quantity: 1,
      weight: defaultWeight,
      priceMap,
      gst: product.gst || 0,
      price: Number(defaultPrice),
    });
  };

  const addProductToInvoice = () => {
    const isCombo = selectedProduct.category === "Combo";
    if (!selectedProduct.id || (!isCombo && !selectedProduct.weight)) return;

    const price = Number(selectedProduct.price);
    const qty = parseInt(selectedProduct.quantity || 1);
    const total = price * qty;
    const gstPercent = parseFloat(selectedProduct.gst || 0);
    const calculatedGst = (total * gstPercent) / 100;

    const existingIndex = invoiceItems.findIndex(
      (item) => item.productId === selectedProduct.id && item.selectedWeight === selectedProduct.weight
    );

    if (existingIndex !== -1) {
      const updatedItems = [...invoiceItems];
      const item = updatedItems[existingIndex];
      const newQty = item.quantity + qty;
      const newTotal = item.price * newQty;
      updatedItems[existingIndex] = {
        ...item,
        quantity: newQty,
        total: newTotal,
        gst: (newTotal * gstPercent) / 100
      };
      setInvoiceItems(updatedItems);
    } else {
      setInvoiceItems([...invoiceItems, {
        ...selectedProduct,
        id: selectedProduct.dbId,
        productId: selectedProduct.id,
        selectedWeight: selectedProduct.weight,
        price,
        quantity: qty,
        total,
        gst: calculatedGst,
        weight: isCombo ? "Combo" : selectedProduct.weight
      }]);
    }
    setSelectedProduct({ id: "", name: "", price: 0, quantity: 1, weight: "", priceMap: {}, weights: [], category: "", gst: 0 });
  };

  const updateQuantity = (index, delta) => {
    const updated = [...invoiceItems];
    const item = updated[index];
    const newQty = Math.max(1, item.quantity + delta);
    const newTotal = item.price * newQty;
    
    // We need to know the original GST percentage. Since it might not be stored directly, 
    // we can calculate it from the existing gst/total ratio.
    const gstRatio = item.total > 0 ? (item.gst / item.total) : 0;
    
    updated[index] = {
      ...item,
      quantity: newQty,
      total: newTotal,
      gst: newTotal * gstRatio
    };
    setInvoiceItems(updated);
  };

  const removeInvoiceItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!client.name || invoiceItems.length === 0) return toast.error("Please fill client details and add products");

    setIsLoading(true);
    try {
      const newOrderId = await generateOrderId();
      await api.post("/orders", {
        orderId: newOrderId,
        userId: "POS-GUEST",
        clientName: client.name,
        clientPhone: client.phone,
        clientGST: client.gst,
        email: client.email || "",
        shippingAddress: client.shippingAddress,
        customerType: client.customerType,
        paymentMode: client.paymentMode,
        paymentStatus: "Paid",
        paymentId: "POS-OFFLINE",
        orderStatus: "Delivered",
        shippingCharge: Number(shippingCharge),
        items: invoiceItems,
        gstAmount: totals.gstTotal,
        totalAmount: totals.finalTotal,
      });

      toast.success("Bill saved successfully!");
      navigate("/adminpanel/billing");
    } catch (error) {
      toast.error("Failed to save bill!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
              <FiShoppingBag className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-[900] tracking-tight text-slate-900">Create Billing</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">New POS Transaction</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-[900] bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-wider"
            >
              <FiCamera className="text-indigo-500" /> Scan QR/Barcode
            </button>
            <button
              onClick={startVoiceSearch}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-[900] transition-all shadow-sm uppercase tracking-wider ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'}`}
            >
              <FiMic className={isListening ? 'text-white' : 'text-indigo-500'} /> {isListening ? 'Listening...' : 'Voice Command'}
            </button>
          </div>
        </div>

        {/* Camera Overlay */}
        {showCamera && (
          <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg relative">
              <button onClick={() => setShowCamera(false)} className="absolute right-6 top-6 p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all">
                <FiX size={20} />
              </button>
              <h3 className="text-xl font-[900] text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span> Vision Scanner
              </h3>
              <div id="reader" className="overflow-hidden rounded-3xl border-4 border-slate-50 bg-slate-50 aspect-square"></div>
              <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-6">Align barcode within the frame</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Client & Product Selection */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Client Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-2 mb-8">
                <FiUser className="text-indigo-600" />
                <h3 className="text-sm font-[900] text-slate-900 uppercase tracking-widest">Client Profile</h3>
              </div>

              <div className="space-y-5">
                <div className="relative group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Phone Number</label>
                  <input
                    placeholder="Search by mobile..."
                    className="w-full bg-slate-50 border border-transparent rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 text-sm"
                    value={client.phone}
                    onChange={(e) => setClient({ ...client, phone: e.target.value })}
                  />
                </div>

                <div className="relative group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Client Name</label>
                  <input
                    placeholder="Customer full name"
                    className="w-full bg-slate-50 border border-transparent rounded-2xl px-5 py-4 outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 text-sm"
                    value={client.name}
                    onChange={(e) => setClient({ ...client, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Type</label>
                    <select
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 text-xs cursor-pointer appearance-none"
                      value={client.customerType}
                      onChange={(e) => setClient({ ...client, customerType: e.target.value })}
                    >
                      <option>Shop Customer</option>
                      <option>Online Customer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Payment</label>
                    <select
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-slate-900 text-xs cursor-pointer appearance-none"
                      value={client.paymentMode}
                      onChange={(e) => setClient({ ...client, paymentMode: e.target.value })}
                    >
                      <option>Cash</option>
                      <option>UPI / GPay</option>
                      <option>Card</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setExpandAddress(!expandAddress)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 rounded-2xl hover:bg-black transition-all text-[11px] font-[900] text-white uppercase tracking-widest mt-2"
                >
                  Shipping Details
                  {expandAddress ? <MdKeyboardArrowUp size={18} /> : <MdKeyboardArrowDown size={18} />}
                </button>
                
                {expandAddress && (
                  <div className="pt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <input placeholder="Street Address" className="w-full bg-slate-50 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:bg-white border border-transparent focus:border-indigo-100" value={client.shippingAddress.street} onChange={(e) => setClient({ ...client, shippingAddress: { ...client.shippingAddress, street: e.target.value } })} />
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="City" className="w-full bg-slate-50 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:bg-white border border-transparent focus:border-indigo-100" value={client.shippingAddress.city} onChange={(e) => setClient({ ...client, shippingAddress: { ...client.shippingAddress, city: e.target.value } })} />
                      <select
                        className="w-full bg-slate-50 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:bg-white border border-transparent focus:border-indigo-100 appearance-none"
                        value={client.shippingAddress.state}
                        onChange={(e) => setClient({ ...client, shippingAddress: { ...client.shippingAddress, state: e.target.value } })}
                      >
                        {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Quick Entry */}
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 text-white">
              <div className="flex items-center gap-2 mb-6">
                <FiShoppingBag />
                <h3 className="text-sm font-[900] uppercase tracking-widest">Quick Scan</h3>
              </div>
              <input
                type="text"
                placeholder="Enter Barcode Directly..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-5 outline-none focus:bg-white/20 transition-all font-[900] text-white text-lg placeholder:text-white/40"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleBarcodeScan(manualBarcode);
                    setManualBarcode("");
                  }
                }}
              />
              <p className="mt-4 text-[10px] font-black text-white/50 uppercase tracking-widest text-center">Hit Enter to add immediately</p>
            </div>
          </div>

          {/* Right Column: Order Items */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Search & Selector */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-7 relative group">
                  <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <select
                    className="w-full pl-14 pr-10 py-5 bg-slate-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 font-[900] text-slate-900 text-sm appearance-none cursor-pointer transition-all"
                    value={selectedProduct.id || ""}
                    onChange={(e) => handleProductSelect(e.target.value)}
                  >
                    <option value="">Search or Select Product...</option>
                    {productList.map((p) => (
                      <option key={p.id} value={p.productId}>
                        {p.productId} — {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-3">
                  {selectedProduct.category !== "Combo" && selectedProduct.weights?.length > 0 && (
                    <select
                      className="w-full px-6 py-5 bg-slate-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-indigo-500/20 font-[900] text-slate-900 text-sm appearance-none cursor-pointer transition-all"
                      value={selectedProduct.weight || ""}
                      onChange={(e) => {
                        const newWeight = e.target.value;
                        const newPrice = calculatePrice(selectedProduct.priceMap, newWeight, false);
                        setSelectedProduct({ ...selectedProduct, weight: newWeight, price: newPrice });
                      }}
                    >
                      {selectedProduct.weights?.map((w, idx) => (
                        <option key={idx} value={w}>{w}</option>
                      ))}
                    </select>
                  )}
                  {selectedProduct.category === "Combo" && (
                    <div className="w-full px-6 py-5 bg-indigo-50 text-indigo-600 rounded-[1.5rem] font-black text-center text-xs uppercase tracking-widest">
                      Combo Pack
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={addProductToInvoice}
                    disabled={!selectedProduct.id}
                    className="w-full bg-indigo-600 text-white font-[900] py-5 rounded-[1.5rem] shadow-lg shadow-indigo-100 hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-30 uppercase tracking-widest text-[10px]"
                  >
                    <FiPlus /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-[900] text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <FiShoppingBag className="text-indigo-600" /> Current Invoice
                </h3>
                <span className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {invoiceItems.length} Products
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50 text-left">
                      <th className="pl-8 pr-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                      <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Quantity</th>
                      <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Price</th>
                      <th className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {invoiceItems.length > 0 ? invoiceItems.map((item, index) => (
                      <tr key={index} className="group hover:bg-slate-50/30 transition-colors">
                        <td className="pl-8 pr-4 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-1 overflow-hidden">
                              {item.image ? (
                                <img src={item.image} alt="" className="w-full h-full object-contain" />
                              ) : (
                                <FiPackage className="text-slate-200 text-xl" />
                              )}
                            </div>
                            <div>
                              <p className="font-[900] text-slate-800 text-sm leading-tight mb-1">{item.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                                  {item.selectedWeight || 'Fixed'}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                  ID: {item.productId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-6">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => updateQuantity(index, -1)} className="text-slate-300 hover:text-indigo-600 transition-colors">
                              <FiMinusCircle size={22} />
                            </button>
                            <span className="w-8 text-center font-[900] text-slate-900 text-base">{item.quantity}</span>
                            <button onClick={() => updateQuantity(index, 1)} className="text-slate-300 hover:text-indigo-600 transition-colors">
                              <FiPlusCircle size={22} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-6 text-right font-bold text-slate-500">₹{item.price.toFixed(2)}</td>
                        <td className="px-4 py-6 text-right">
                          <p className="font-[900] text-slate-900 text-base">₹{(item.total + item.gst).toFixed(2)}</p>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">incl. tax</p>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button onClick={() => removeInvoiceItem(index)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="py-32 text-center">
                          <div className="flex flex-col items-center opacity-20">
                            <FiShoppingBag size={64} className="mb-4 text-slate-300" />
                            <p className="text-sm font-[900] uppercase tracking-[0.3em] text-slate-400">Terminal Ready</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Footer */}
              <div className="p-10 bg-slate-950 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/40">Subtotal Amount</span>
                      <span className="font-bold">₹{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/40">GST (Calculated)</span>
                      <span className="font-bold text-indigo-400">+ ₹{totals.gstTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/40">Shipping Charge</span>
                      <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-1">
                        <span className="text-xs text-white/40 font-bold">₹</span>
                        <input
                          type="number"
                          className="w-20 bg-transparent border-none text-right font-[900] text-white outline-none text-sm"
                          value={shippingCharge}
                          onChange={(e) => setShippingCharge(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="text-right">
                      <p className="text-[11px] font-black uppercase tracking-widest text-indigo-400 mb-1">Grand Total Payable</p>
                      <h2 className="text-5xl font-[900] tracking-tighter">₹{totals.finalTotal.toFixed(2)}</h2>
                    </div>
                    
                    <button
                      onClick={handleSave}
                      disabled={isLoading || invoiceItems.length === 0}
                      className="w-full bg-indigo-600 text-white font-[900] py-6 rounded-3xl shadow-2xl shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:hover:scale-100 uppercase tracking-widest text-sm"
                    >
                      {isLoading ? <ImSpinner8 className="animate-spin text-2xl" /> : <><FiPrinter className="text-xl" /> Generate Invoice & Save</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBilling;
